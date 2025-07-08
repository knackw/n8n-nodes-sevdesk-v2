/**
 * Abstract base classes for common resource operations (CRUD patterns)
 * This eliminates code duplication across different resource handlers
 */

import {
	IExecuteFunctions,
	INodeExecutionData,
	NodeApiError,
	IHttpRequestOptions,
	IDataObject,
} from "n8n-workflow";

import { SevDeskResponse } from "../types/SevDeskApiTypes";
import { ResourceValidator, IValidationResult } from "../validation/ResourceValidator";
import { defaultSanitizer, SanitizationResult } from "../security/InputSanitizer";

/**
 * Base interface for all resource operations
 */
export interface IResourceOperation {
	operation: string;
	itemIndex: number;
}

/**
 * Base interface for CRUD operations
 */
export interface ICrudOperations {
	create?: boolean;
	read?: boolean;
	update?: boolean;
	delete?: boolean;
	list?: boolean;
}

/**
 * Configuration for a resource handler
 */
export interface IResourceConfig {
	resourceName: string;
	apiEndpoint: string;
	supportedOperations: ICrudOperations;
	idParameterName?: string;
}

/**
 * Abstract base class for all SevDesk resource handlers
 * Implements common CRUD patterns and eliminates code duplication
 */
export abstract class BaseResourceHandler<T = any> {
	protected executeFunctions: IExecuteFunctions;
	protected config: IResourceConfig;

	constructor(executeFunctions: IExecuteFunctions, config: IResourceConfig) {
		this.executeFunctions = executeFunctions;
		this.config = config;
	}

	/**
	 * Execute a resource operation
	 */
	public async execute(operation: string, itemIndex: number): Promise<INodeExecutionData | null> {
		try {
			this.validateOperation(operation);

			// Validate input data before making API calls
			await this.validateInputData(operation, itemIndex);

			const requestOptions = await this.buildRequestOptions(operation, itemIndex);
			const response = await this.makeRequest(requestOptions);

			return this.formatResponse(response, itemIndex);
		} catch (error) {
			throw this.handleError(error, operation);
		}
	}

	/**
	 * Validate that the operation is supported
	 */
	protected validateOperation(operation: string): void {
		const supportedOps = this.config.supportedOperations;

		switch (operation) {
			case 'create':
				if (!supportedOps.create) {
					throw new Error(`Create operation not supported for ${this.config.resourceName}`);
				}
				break;
			case 'get':
				if (!supportedOps.read) {
					throw new Error(`Read operation not supported for ${this.config.resourceName}`);
				}
				break;
			case 'getMany':
			case 'list':
				if (!supportedOps.list) {
					throw new Error(`List operation not supported for ${this.config.resourceName}`);
				}
				break;
			case 'update':
				if (!supportedOps.update) {
					throw new Error(`Update operation not supported for ${this.config.resourceName}`);
				}
				break;
			case 'delete':
				if (!supportedOps.delete) {
					throw new Error(`Delete operation not supported for ${this.config.resourceName}`);
				}
				break;
			default:
				// Allow custom operations to be handled by subclasses
				break;
		}
	}

	/**
	 * Get a sanitized node parameter
	 *
	 * This method retrieves a parameter from the node and sanitizes it to prevent
	 * security vulnerabilities. Use this instead of direct getNodeParameter calls
	 * for user-provided data.
	 *
	 * @protected
	 * @param parameterName - Name of the parameter to retrieve
	 * @param itemIndex - Index of the current input item
	 * @param defaultValue - Default value if parameter is not found
	 * @returns Sanitized parameter value
	 */
	protected getSanitizedNodeParameter(parameterName: string, itemIndex: number, defaultValue?: any): any {
		const rawValue = this.executeFunctions.getNodeParameter(parameterName, itemIndex, defaultValue);

		// Only sanitize if it's a meaningful value (not null, undefined, or empty default)
		if (rawValue === null || rawValue === undefined || rawValue === defaultValue) {
			return rawValue;
		}

		// Sanitize the value using our input sanitizer
		const sanitizationResult = defaultSanitizer.sanitizeForSevDesk(
			rawValue,
			this.config.resourceName.toLowerCase()
		);

		// Log warnings if any dangerous content was detected
		if (sanitizationResult.warnings.length > 0) {
			console.warn(`Parameter '${parameterName}' sanitization warnings:`, sanitizationResult.warnings);
		}

		return sanitizationResult.data;
	}

	/**
	 * Validate input data using the ResourceValidator
	 */
	protected async validateInputData(operation: string, itemIndex: number): Promise<void> {
		// Get the input data based on the operation type
		let inputData: IDataObject = {};

		switch (operation) {
			case 'create':
			case 'update':
				// For create/update operations, get the data from additionalFields
				inputData = this.getSanitizedNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
				break;
			case 'get':
			case 'delete':
				// For get/delete operations, validate the ID parameter
				const idParamName = this.config.idParameterName || `${this.config.resourceName.toLowerCase()}Id`;
				const resourceId = this.getSanitizedNodeParameter(idParamName, itemIndex) as string;
				inputData = { [idParamName]: resourceId };
				break;
			case 'getMany':
			case 'list':
				// For list operations, get query parameters
				inputData = this.getSanitizedNodeParameter('additionalFields', itemIndex, {}) as IDataObject;
				break;
			default:
				// For custom operations, try to get all available parameters
				try {
					inputData = this.getSanitizedNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

					// Also try to get operation-specific parameters
					const operationParams = this.getOperationSpecificParameters(operation, itemIndex);
					inputData = { ...inputData, ...operationParams };
				} catch (error) {
					// If we can't get parameters, skip validation for custom operations
					return;
				}
				break;
		}

		// Sanitize input data before validation to prevent security vulnerabilities
		const sanitizationResult: SanitizationResult = defaultSanitizer.sanitizeForSevDesk(
			inputData,
			this.config.resourceName.toLowerCase()
		);

		// Log sanitization warnings if any
		if (sanitizationResult.warnings.length > 0) {
			console.warn(`Input sanitization warnings for ${this.config.resourceName} ${operation}:`, sanitizationResult.warnings);
		}

		// Use sanitized data for validation and further processing
		const sanitizedInputData = sanitizationResult.data;

		// Perform validation using ResourceValidator on sanitized data
		const validationResult: IValidationResult = ResourceValidator.validate(
			sanitizedInputData,
			this.config.resourceName.toLowerCase(),
			operation
		);

		// If validation fails, throw an error with detailed messages
		if (!validationResult.isValid) {
			const errorMessages = validationResult.errors.map(error => error.message).join('; ');
			throw new NodeApiError(this.executeFunctions.getNode(), {
				message: `Validation failed for ${this.config.resourceName} ${operation}: ${errorMessages}`,
				description: 'Please check your input parameters and try again.',
			});
		}
	}

	/**
	 * Get operation-specific parameters for custom operations
	 * This method can be overridden by subclasses to provide operation-specific parameter extraction
	 */
	protected getOperationSpecificParameters(operation: string, itemIndex: number): IDataObject {
		const params: IDataObject = {};

		// Try to get common operation-specific parameters
		try {
			// For operations that typically require an ID
			if (operation.includes('Id') || operation.includes('get') || operation.includes('update') || operation.includes('delete')) {
				const idParamName = this.config.idParameterName || `${this.config.resourceName.toLowerCase()}Id`;
				const resourceId = this.executeFunctions.getNodeParameter(idParamName, itemIndex, null);
				if (resourceId) {
					params[idParamName] = resourceId;
				}
			}

			// For email operations
			if (operation.includes('Email')) {
				const sendType = this.executeFunctions.getNodeParameter('sendType', itemIndex, null);
				if (sendType) {
					params.sendType = sendType;
				}
			}

			// For booking operations
			if (operation.includes('book') || operation.includes('Book')) {
				const amount = this.executeFunctions.getNodeParameter('amount', itemIndex, null);
				const date = this.executeFunctions.getNodeParameter('date', itemIndex, null);
				if (amount) params.amount = amount;
				if (date) params.date = date;
			}
		} catch (error) {
			// If parameter doesn't exist, ignore and continue
		}

		return params;
	}

	/**
	 * Build request options for the operation
	 */
	protected async buildRequestOptions(operation: string, itemIndex: number): Promise<IHttpRequestOptions> {
		const credentials = await this.executeFunctions.getCredentials('sevDeskApi');
		const baseURL = `https://my.sevdesk.de/api/${credentials.apiVersion}`;

		const baseOptions: IHttpRequestOptions = {
			headers: {
				'Authorization': credentials.apiKey as string,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			url: '',
			method: 'GET',
		};

		switch (operation) {
			case 'create':
				return this.buildCreateRequest(baseOptions, baseURL, itemIndex);
			case 'get':
				return this.buildGetRequest(baseOptions, baseURL, itemIndex);
			case 'getMany':
			case 'list':
				return this.buildListRequest(baseOptions, baseURL, itemIndex);
			case 'update':
				return this.buildUpdateRequest(baseOptions, baseURL, itemIndex);
			case 'delete':
				return this.buildDeleteRequest(baseOptions, baseURL, itemIndex);
			default:
				return this.buildCustomRequest(baseOptions, baseURL, operation, itemIndex);
		}
	}

	/**
	 * Build create request options
	 */
	protected buildCreateRequest(baseOptions: IHttpRequestOptions, baseURL: string, itemIndex: number): IHttpRequestOptions {
		const createData = this.getSanitizedNodeParameter('additionalFields', itemIndex, {}) as object;

		return {
			...baseOptions,
			method: 'POST',
			url: `${baseURL}/${this.config.apiEndpoint}`,
			body: this.transformCreateData(createData),
		};
	}

	/**
	 * Build get request options
	 */
	protected buildGetRequest(baseOptions: IHttpRequestOptions, baseURL: string, itemIndex: number): IHttpRequestOptions {
		const idParamName = this.config.idParameterName || `${this.config.resourceName.toLowerCase()}Id`;
		const resourceId = this.getSanitizedNodeParameter(idParamName, itemIndex) as string;

		return {
			...baseOptions,
			method: 'GET',
			url: `${baseURL}/${this.config.apiEndpoint}/${resourceId}`,
		};
	}

	/**
	 * Build list request options
	 */
	protected buildListRequest(baseOptions: IHttpRequestOptions, baseURL: string, itemIndex: number): IHttpRequestOptions {
		const queryParams = this.getSanitizedNodeParameter('additionalFields', itemIndex, {}) as IDataObject;

		return {
			...baseOptions,
			method: 'GET',
			url: `${baseURL}/${this.config.apiEndpoint}`,
			qs: this.transformQueryParams(queryParams),
		};
	}

	/**
	 * Build update request options
	 */
	protected buildUpdateRequest(baseOptions: IHttpRequestOptions, baseURL: string, itemIndex: number): IHttpRequestOptions {
		const idParamName = this.config.idParameterName || `${this.config.resourceName.toLowerCase()}Id`;
		const resourceId = this.getSanitizedNodeParameter(idParamName, itemIndex) as string;
		const updateData = this.getSanitizedNodeParameter('updateFields', itemIndex, {}) as object;

		return {
			...baseOptions,
			method: 'PUT',
			url: `${baseURL}/${this.config.apiEndpoint}/${resourceId}`,
			body: this.transformUpdateData(updateData),
		};
	}

	/**
	 * Build delete request options
	 */
	protected buildDeleteRequest(baseOptions: IHttpRequestOptions, baseURL: string, itemIndex: number): IHttpRequestOptions {
		const idParamName = this.config.idParameterName || `${this.config.resourceName.toLowerCase()}Id`;
		const resourceId = this.getSanitizedNodeParameter(idParamName, itemIndex) as string;

		return {
			...baseOptions,
			method: 'DELETE',
			url: `${baseURL}/${this.config.apiEndpoint}/${resourceId}`,
		};
	}

	/**
	 * Build custom request options - to be overridden by subclasses
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number
	): IHttpRequestOptions {
		throw new Error(`Custom operation '${operation}' not implemented for ${this.config.resourceName}`);
	}

	/**
	 * Make the HTTP request
	 */
	protected async makeRequest(requestOptions: IHttpRequestOptions): Promise<SevDeskResponse<T>> {
		return await this.executeFunctions.helpers.httpRequest(requestOptions) as SevDeskResponse<T>;
	}

	/**
	 * Format the response for n8n
	 */
	protected formatResponse(response: SevDeskResponse<T>, itemIndex: number): INodeExecutionData {
		// Extract objects from response if available, otherwise return full response
		const responseData = response.objects || response;

		return {
			json: responseData as IDataObject,
			pairedItem: {
				item: itemIndex,
			},
		};
	}

	/**
	 * Handle errors consistently
	 */
	protected handleError(error: any, operation: string): NodeApiError {
		const errorMessage = error.message || 'Unknown error occurred';

		return new NodeApiError(this.executeFunctions.getNode(), {
			message: `${this.config.resourceName} operation failed: ${errorMessage}`,
			description: `Failed to execute ${operation} operation on ${this.config.resourceName} resource.`,
		});
	}

	/**
	 * Transform create data - can be overridden by subclasses
	 */
	protected transformCreateData(data: object): object {
		return data;
	}

	/**
	 * Transform update data - can be overridden by subclasses
	 */
	protected transformUpdateData(data: object): object {
		return data;
	}

	/**
	 * Transform query parameters - can be overridden by subclasses
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		return params;
	}
}

/**
 * Abstract base class for resources that support standard CRUD operations
 */
export abstract class CrudResourceHandler<T = any> extends BaseResourceHandler<T> {
	constructor(executeFunctions: IExecuteFunctions, resourceName: string, apiEndpoint?: string) {
		const config: IResourceConfig = {
			resourceName,
			apiEndpoint: apiEndpoint || resourceName,
			supportedOperations: {
				create: true,
				read: true,
				update: true,
				delete: true,
				list: true,
			},
		};

		super(executeFunctions, config);
	}
}

/**
 * Abstract base class for read-only resources
 */
export abstract class ReadOnlyResourceHandler<T = any> extends BaseResourceHandler<T> {
	constructor(executeFunctions: IExecuteFunctions, resourceName: string, apiEndpoint?: string) {
		const config: IResourceConfig = {
			resourceName,
			apiEndpoint: apiEndpoint || resourceName,
			supportedOperations: {
				create: false,
				read: true,
				update: false,
				delete: false,
				list: true,
			},
		};

		super(executeFunctions, config);
	}
}
