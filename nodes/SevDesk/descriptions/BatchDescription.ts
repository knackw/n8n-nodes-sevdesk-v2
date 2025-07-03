import { INodeProperties } from "n8n-workflow";

export const batchOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["batch"],
			},
		},
		options: [
			{
				name: "Execute Batch",
				value: "executeBatch",
				action: "Execute multiple operations in a single batch",
				description: "Process multiple operations efficiently with concurrency control",
			},
		],
		default: "executeBatch",
	},
];

export const batchFields: INodeProperties[] = [
	// Batch Configuration
	{
		displayName: "Batch Configuration",
		name: "batchConfig",
		type: "fixedCollection",
		displayOptions: {
			show: {
				resource: ["batch"],
				operation: ["executeBatch"],
			},
		},
		default: {},
		placeholder: "Add Batch Configuration",
		typeOptions: {
			multipleValues: false,
		},
		options: [
			{
				name: "config",
				displayName: "Configuration",
				values: [
					{
						displayName: "Continue on Error",
						name: "continueOnError",
						type: "boolean",
						default: true,
						description: "Whether to continue processing other operations if one fails",
					},
					{
						displayName: "Max Concurrency",
						name: "maxConcurrency",
						type: "number",
						default: 5,
						description: "Maximum number of operations to execute concurrently",
						typeOptions: {
							minValue: 1,
							maxValue: 20,
						},
					},
					{
						displayName: 'Timeout (Ms)',
						name: "timeout",
						type: "number",
						default: 30000,
						description: "Timeout for the entire batch operation in milliseconds",
						typeOptions: {
							minValue: 1000,
							maxValue: 300000,
						},
					},
				],
			},
		],
	},

	// Operations Array
	{
		displayName: "Operations",
		name: "operations",
		type: "fixedCollection",
		displayOptions: {
			show: {
				resource: ["batch"],
				operation: ["executeBatch"],
			},
		},
		default: {},
		placeholder: "Add Operation",
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				name: "operation",
				displayName: "Operation",
				values: [
					{
						displayName: "Resource",
						name: "resource",
						type: "options",
						noDataExpression: true,
						required: true,
						default: "contact",
						options: [
							{
								name: "Contact",
								value: "contact",
							},
							{
								name: "Invoice",
								value: "invoice",
							},
							{
								name: "Voucher",
								value: "voucher",
							},
							{
								name: "Order",
								value: "order",
							},
						],
						description: "The resource type for this operation",
					},
					{
						displayName: "Operation Type",
						name: "operation",
						type: "options",
						noDataExpression: true,
						required: true,
						default: "create",
						options: [
							{
								name: "Create",
								value: "create",
							},
							{
								name: "Delete",
								value: "delete",
							},
							{
								name: "Get",
								value: "get",
							},
							{
								name: "Get Many",
								value: "getMany",
							},
							{
								name: "Update",
								value: "update",
							},
						],
					},
					{
						displayName: "Resource ID",
						name: "id",
						type: "string",
						default: "",
						displayOptions: {
							show: {
								operation: ["get", "update", "delete"],
							},
						},
						description: "The ID of the resource (required for get, update, delete operations)",
					},
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
						description: "The data to send with the operation (for create/update operations)",
					},
					{
						displayName: "Parameters",
						name: "parameters",
						type: "json",
						default: "{}",
						description: "Additional parameters for the operation (query parameters, filters, etc.)",
					},
				],
			},
		],
	},

	// Alternative: JSON Input for Advanced Users
	{
		displayName: "Advanced: JSON Batch Configuration",
		name: "jsonBatchConfig",
		type: "json",
		displayOptions: {
			show: {
				resource: ["batch"],
				operation: ["executeBatch"],
			},
		},
		default: `{
  "operations": [
    {
      "resource": "contact",
      "operation": "create",
      "data": {
        "name": "Example Contact",
        "customerNumber": "12345"
      }
    },
    {
      "resource": "invoice",
      "operation": "getMany",
      "parameters": {
        "limit": 10
      }
    }
  ],
  "options": {
    "continueOnError": true,
    "maxConcurrency": 5,
    "timeout": 30000
  }
}`,
		description: "Advanced JSON configuration for batch operations. Use this for complex batch configurations.",
		typeOptions: {
			rows: 15,
		},
	},

	// Batch Processing Options
	{
		displayName: "Processing Options",
		name: "processingOptions",
		type: "collection",
		displayOptions: {
			show: {
				resource: ["batch"],
				operation: ["executeBatch"],
			},
		},
		default: {},
		placeholder: "Add Processing Option",
		options: [
			{
				displayName: "Group by Resource",
				name: "groupByResource",
				type: "boolean",
				default: false,
				description: "Whether to group operations by resource type for optimized processing",
			},
			{
				displayName: "Validate Compatibility",
				name: "validateCompatibility",
				type: "boolean",
				default: true,
				description: "Whether to validate that operations can be safely batched together",
			},
			{
				displayName: "Chunk Size",
				name: "chunkSize",
				type: "number",
				default: 50,
				description: "Split large batches into smaller chunks of this size",
				typeOptions: {
					minValue: 1,
					maxValue: 100,
				},
			},
			{
				displayName: "Return Detailed Results",
				name: "returnDetailedResults",
				type: "boolean",
				default: true,
				description: "Whether to include detailed results for each operation in the response",
			},
		],
	},
];
