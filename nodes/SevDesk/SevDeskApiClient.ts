import {
	IExecuteFunctions,
	IHttpRequestOptions,
	NodeApiError,
} from "n8n-workflow";

import { SevDeskErrorFactory, SevDeskError } from "./errors/SevDeskErrors";

export interface ApiRequestConfig {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	endpoint: string;
	body?: any;
	queryParams?: Record<string, any>;
}

export interface ApiResponse<T = any> {
	data: T;
	statusCode?: number;
	headers?: Record<string, string>;
}

/**
 * Centralized API client for SevDesk operations
 * Handles authentication, request/response processing, and error handling
 */
export class SevDeskApiClient {
	private executeFunctions: IExecuteFunctions;
	private baseURL: string;
	private credentials: any;

	constructor(executeFunctions: IExecuteFunctions) {
		this.executeFunctions = executeFunctions;
	}

	/**
	 * Initialize the API client with credentials
	 */
	async initialize(): Promise<void> {
		this.credentials = await this.executeFunctions.getCredentials('sevDeskApi');
		this.baseURL = `https://my.sevdesk.de/api/${this.credentials.apiVersion}`;
	}

	/**
	 * Make an authenticated API request
	 */
	async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
		if (!this.credentials) {
			await this.initialize();
		}

		const requestOptions: IHttpRequestOptions = {
			method: config.method,
			url: `${this.baseURL}${config.endpoint}`,
			headers: {
				'Authorization': this.credentials.apiKey as string,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
		};

		// Add query parameters if provided
		if (config.queryParams) {
			requestOptions.qs = this.processQueryParameters(config.queryParams);
		}

		// Add body for POST/PUT requests
		if (config.body && (config.method === 'POST' || config.method === 'PUT')) {
			requestOptions.body = config.body;
		}

		try {
			this.logRequest(config);
			const response = await this.executeFunctions.helpers.httpRequest(requestOptions);
			this.logResponse(config, response);

			return {
				data: response,
				statusCode: response.statusCode,
				headers: response.headers,
			};
		} catch (error) {
			this.logError(config, error);
			throw this.handleApiError(error, config);
		}
	}

	/**
	 * GET request helper
	 */
	async get<T = any>(endpoint: string, queryParams?: Record<string, any>): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'GET',
			endpoint,
			queryParams,
		});
	}

	/**
	 * POST request helper
	 */
	async post<T = any>(endpoint: string, body: any, queryParams?: Record<string, any>): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'POST',
			endpoint,
			body,
			queryParams,
		});
	}

	/**
	 * PUT request helper
	 */
	async put<T = any>(endpoint: string, body: any, queryParams?: Record<string, any>): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'PUT',
			endpoint,
			body,
			queryParams,
		});
	}

	/**
	 * DELETE request helper
	 */
	async delete<T = any>(endpoint: string, queryParams?: Record<string, any>): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'DELETE',
			endpoint,
			queryParams,
		});
	}

	/**
	 * Process and clean query parameters
	 */
	private processQueryParameters(params: Record<string, any>): Record<string, any> {
		const processedParams: Record<string, any> = {};

		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined && value !== null && value !== '') {
				processedParams[key] = value;
			}
		}

		return processedParams;
	}

	/**
	 * Log API request
	 */
	private logRequest(config: ApiRequestConfig): void {
		const logData = {
			timestamp: new Date().toISOString(),
			method: config.method,
			endpoint: config.endpoint,
			hasBody: !!config.body,
			hasQueryParams: !!config.queryParams,
		};

		if (this.executeFunctions.logger) {
			this.executeFunctions.logger.info('SevDesk API Request', logData);
		} else {
			console.info(`[SevDesk API Request] ${JSON.stringify(logData)}`);
		}
	}

	/**
	 * Log API response
	 */
	private logResponse(config: ApiRequestConfig, response: any): void {
		const logData = {
			timestamp: new Date().toISOString(),
			method: config.method,
			endpoint: config.endpoint,
			statusCode: response.statusCode || 'unknown',
			hasData: !!response,
		};

		if (this.executeFunctions.logger) {
			this.executeFunctions.logger.info('SevDesk API Response', logData);
		} else {
			console.info(`[SevDesk API Response] ${JSON.stringify(logData)}`);
		}
	}

	/**
	 * Log API error
	 */
	private logError(config: ApiRequestConfig, error: any): void {
		const logData = {
			timestamp: new Date().toISOString(),
			method: config.method,
			endpoint: config.endpoint,
			error: error instanceof Error ? error.message : String(error),
		};

		if (this.executeFunctions.logger) {
			this.executeFunctions.logger.error('SevDesk API Error', logData);
		} else {
			console.error(`[SevDesk API Error] ${JSON.stringify(logData)}`);
		}
	}

	/**
	 * Handle and format API errors using unified error handling system
	 */
	private handleApiError(error: any, config: ApiRequestConfig): NodeApiError {
		let sevDeskError: SevDeskError;

		// Check if it's a network/connection error
		if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
			sevDeskError = SevDeskErrorFactory.createConnectionError(error);
		}
		// Check if it's an HTTP error with status code
		else if (error.statusCode || error.response?.status) {
			const statusCode = error.statusCode || error.response?.status;
			const errorData = error.response?.data || error.response?.body || error.body || {};
			sevDeskError = SevDeskErrorFactory.createError(statusCode, errorData, error);
		}
		// Handle other types of errors
		else {
			const errorMessage = error instanceof Error ? error.message : String(error);
			sevDeskError = SevDeskErrorFactory.createConfigurationError(
				`API request failed: ${errorMessage}`,
				error
			);
		}

		// Convert to NodeApiError for n8n
		return sevDeskError.toNodeApiError(this.executeFunctions.getNode());
	}

	/**
	 * Add pagination parameters to query params
	 */
	addPagination(queryParams: Record<string, any>, itemIndex: number): Record<string, any> {
		const limit = this.executeFunctions.getNodeParameter('limit', itemIndex, 50) as number;
		const offset = this.executeFunctions.getNodeParameter('offset', itemIndex, 0) as number;

		return {
			...queryParams,
			limit,
			offset
		};
	}

	/**
	 * Get base URL for the API
	 */
	getBaseURL(): string {
		return this.baseURL;
	}

	/**
	 * Get credentials
	 */
	getCredentials(): any {
		return this.credentials;
	}
}
