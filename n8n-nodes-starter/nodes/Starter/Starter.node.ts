import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IHttpRequestOptions,
	NodeConnectionType,
	NodeOperationError,
} from "n8n-workflow";

/**
 * Starter Node Implementation
 *
 * This is a simplified example of an n8n node that demonstrates:
 * - Basic CRUD operations (Create, Read, Update, Delete)
 * - API authentication using credentials
 * - Error handling
 * - Input/output data processing
 *
 * @class Starter
 * @implements {INodeType}
 */
export class Starter implements INodeType {
	/**
	 * Node type description configuration
	 */
	description: INodeTypeDescription = {
		displayName: "Starter",
		name: "starter",
		group: ["output"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "A starter node template for API integration",
		icon: "fa:rocket", // You can replace this with a custom icon
		defaults: {
			name: "Starter",
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: "starterApi",
				required: true,
			},
		],
		requestDefaults: {
			baseURL: "={{$credentials.baseUrl}}",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
		properties: [
			// Resource selection
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				default: "users",
				options: [
					{
						name: "Users",
						value: "users",
					},
					{
						name: "Posts",
						value: "posts",
					},
					{
						name: "Comments",
						value: "comments",
					},
				],
			},
			// Operation selection
			{
				displayName: "Operation",
				name: "operation",
				type: "options",
				noDataExpression: true,
				default: "get",
				options: [
					{
						name: "Create",
						value: "create",
						description: "Create a new resource",
						action: "Create a resource",
					},
					{
						name: "Get",
						value: "get",
						description: "Get a resource by ID",
						action: "Get a resource",
					},
					{
						name: "Get All",
						value: "getAll",
						description: "Get all resources",
						action: "Get all resources",
					},
					{
						name: "Update",
						value: "update",
						description: "Update a resource",
						action: "Update a resource",
					},
					{
						name: "Delete",
						value: "delete",
						description: "Delete a resource",
						action: "Delete a resource",
					},
				],
			},
			// ID field for operations that need it
			{
				displayName: "ID",
				name: "id",
				type: "string",
				default: "",
				required: true,
				displayOptions: {
					show: {
						operation: ["get", "update", "delete"],
					},
				},
				description: "The ID of the resource",
			},
			// Data field for create/update operations
			{
				displayName: "Data",
				name: "data",
				type: "json",
				default: "{}",
				displayOptions: {
					show: {
						operation: ["create", "update"],
					},
				},
				description: "The data to send (JSON format)",
			},
			// Limit for getAll operation
			{
				displayName: "Limit",
				name: "limit",
				type: "number",
				default: 10,
				displayOptions: {
					show: {
						operation: ["getAll"],
					},
				},
				description: "Maximum number of results to return",
			},
		],
	};

	/**
	 * Execute the node
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		// Process each input item
		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter("resource", i) as string;
				const operation = this.getNodeParameter("operation", i) as string;

				let responseData;

				// Build the API request based on operation
				switch (operation) {
					case "create":
						responseData = await this.createResource(resource, i);
						break;
					case "get":
						responseData = await this.getResource(resource, i);
						break;
					case "getAll":
						responseData = await this.getAllResources(resource, i);
						break;
					case "update":
						responseData = await this.updateResource(resource, i);
						break;
					case "delete":
						responseData = await this.deleteResource(resource, i);
						break;
					default:
						throw new NodeOperationError(
							this.getNode(),
							`The operation "${operation}" is not supported!`,
							{ itemIndex: i }
						);
				}

				// Add the response data to return data
				returnData.push({
					json: responseData,
					pairedItem: { item: i },
				});
			} catch (error) {
				// Handle errors gracefully
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: error.message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}

	/**
	 * Create a new resource
	 */
	private async createResource(resource: string, itemIndex: number) {
		const data = this.getNodeParameter("data", itemIndex) as string;

		const options: IHttpRequestOptions = {
			method: "POST",
			url: `/${resource}`,
			body: JSON.parse(data),
		};

		return await this.helpers.httpRequestWithAuthentication.call(this, "starterApi", options);
	}

	/**
	 * Get a resource by ID
	 */
	private async getResource(resource: string, itemIndex: number) {
		const id = this.getNodeParameter("id", itemIndex) as string;

		const options: IHttpRequestOptions = {
			method: "GET",
			url: `/${resource}/${id}`,
		};

		return await this.helpers.httpRequestWithAuthentication.call(this, "starterApi", options);
	}

	/**
	 * Get all resources
	 */
	private async getAllResources(resource: string, itemIndex: number) {
		const limit = this.getNodeParameter("limit", itemIndex) as number;

		const options: IHttpRequestOptions = {
			method: "GET",
			url: `/${resource}`,
			qs: {
				limit: limit,
			},
		};

		return await this.helpers.httpRequestWithAuthentication.call(this, "starterApi", options);
	}

	/**
	 * Update a resource
	 */
	private async updateResource(resource: string, itemIndex: number) {
		const id = this.getNodeParameter("id", itemIndex) as string;
		const data = this.getNodeParameter("data", itemIndex) as string;

		const options: IHttpRequestOptions = {
			method: "PUT",
			url: `/${resource}/${id}`,
			body: JSON.parse(data),
		};

		return await this.helpers.httpRequestWithAuthentication.call(this, "starterApi", options);
	}

	/**
	 * Delete a resource
	 */
	private async deleteResource(resource: string, itemIndex: number) {
		const id = this.getNodeParameter("id", itemIndex) as string;

		const options: IHttpRequestOptions = {
			method: "DELETE",
			url: `/${resource}/${id}`,
		};

		return await this.helpers.httpRequestWithAuthentication.call(this, "starterApi", options);
	}
}
