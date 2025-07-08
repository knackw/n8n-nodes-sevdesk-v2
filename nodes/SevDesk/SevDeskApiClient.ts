import {
	IExecuteFunctions,
	IHttpRequestOptions,
	NodeApiError,
} from "n8n-workflow";

import { SevDeskErrorFactory, SevDeskError } from "./errors/SevDeskErrors";
import { SevDeskConfigManager } from "./config/SevDeskConfig";
import { isDebugEnabled, validateAndWarnEnvironmentConfig } from "./config/EnvironmentConfig";

/**
 * Configuration interface for API requests
 *
 * @interface ApiRequestConfig
 * @property {string} method - HTTP method for the request
 * @property {string} endpoint - API endpoint path (relative to base URL)
 * @property {any} [body] - Request body data for POST/PUT requests
 * @property {Record<string, any>} [queryParams] - Query parameters to append to the URL
 */
export interface ApiRequestConfig {
	method: 'GET' | 'POST' | 'PUT' | 'DELETE';
	endpoint: string;
	body?: any;
	queryParams?: Record<string, any>;
}

/**
 * Standardized API response interface
 *
 * @interface ApiResponse
 * @template T - Type of the response data
 * @property {T} data - The response data from the API
 * @property {number} [statusCode] - HTTP status code of the response
 * @property {Record<string, string>} [headers] - Response headers
 */
export interface ApiResponse<T = any> {
	data: T;
	statusCode?: number;
	headers?: Record<string, string>;
}

/**
 * Centralized API client for SevDesk operations
 *
 * This class provides a unified interface for making authenticated requests to the SevDesk API.
 * It handles authentication, request/response processing, error handling, and logging.
 * All SevDesk API interactions should go through this client to ensure consistent
 * behavior and proper error handling.
 *
 * @class SevDeskApiClient
 *
 * @example
 * ```typescript
 * const apiClient = new SevDeskApiClient(executeFunctions);
 * await apiClient.initialize();
 *
 * // GET request
 * const contacts = await apiClient.get('/Contact');
 *
 * // POST request
 * const newContact = await apiClient.post('/Contact', {
 *   name: 'Test Company',
 *   customerNumber: 'CUST-001'
 * });
 * ```
 *
 * @see {@link https://api.sevdesk.de/} SevDesk API Documentation
 * @author n8n-nodes-sevdesk-v2
 * @version 1.0.0
 * @since 2025-01-01
 */
export class SevDeskApiClient {
	private executeFunctions: IExecuteFunctions;
	private baseURL: string = '';
	private credentials: any;

	/**
	 * Creates a new SevDeskApiClient instance
	 *
	 * @constructor
	 * @param {IExecuteFunctions} executeFunctions - The n8n execution context providing access to credentials and helpers
	 *
	 * @example
	 * ```typescript
	 * const apiClient = new SevDeskApiClient(this);
	 * ```
	 */
	constructor(executeFunctions: IExecuteFunctions) {
		this.executeFunctions = executeFunctions;
	}

	/**
	 * Initialize the API client with credentials
	 *
	 * Retrieves SevDesk API credentials from n8n and sets up the base URL for API requests.
	 * This method must be called before making any API requests.
	 *
	 * @async
	 * @method initialize
	 * @returns {Promise<void>} Promise that resolves when initialization is complete
	 *
	 * @throws {Error} When credentials cannot be retrieved or are invalid
	 *
	 * @example
	 * ```typescript
	 * const apiClient = new SevDeskApiClient(executeFunctions);
	 * await apiClient.initialize();
	 * ```
	 */
	async initialize(): Promise<void> {
		// Validate environment configuration before API initialization
		validateAndWarnEnvironmentConfig();

		this.credentials = await this.executeFunctions.getCredentials('sevDeskApi');
		this.baseURL = `https://my.sevdesk.de/api/${this.credentials.apiVersion}`;
	}

	/**
	 * Make an authenticated API request
	 *
	 * Executes an HTTP request to the SevDesk API with proper authentication,
	 * error handling, and logging. This is the core method used by all other
	 * request methods.
	 *
	 * @async
	 * @method request
	 * @template T - Expected type of the response data
	 * @param {ApiRequestConfig} config - Request configuration including method, endpoint, body, and query parameters
	 *
	 * @returns {Promise<ApiResponse<T>>} Promise resolving to the API response with typed data
	 *
	 * @throws {SevDeskAuthenticationError} When API credentials are invalid
	 * @throws {SevDeskValidationError} When request parameters are invalid
	 * @throws {SevDeskRateLimitError} When API rate limits are exceeded
	 * @throws {SevDeskApiError} For other API-related errors
	 * @throws {NodeApiError} For network or other technical errors
	 *
	 * @example
	 * ```typescript
	 * const response = await apiClient.request({
	 *   method: 'GET',
	 *   endpoint: '/Contact',
	 *   queryParams: { limit: 10 }
	 * });
	 * ```
	 */
	async request<T = any>(config: ApiRequestConfig): Promise<ApiResponse<T>> {
		if (!this.credentials) {
			await this.initialize();
		}

		// Get timeout configuration for the current API version
		const apiVersion = this.credentials.apiVersion as string || 'v2';
		const timeouts = SevDeskConfigManager.getTimeouts(apiVersion);

		const requestOptions: IHttpRequestOptions = {
			method: config.method,
			url: `${this.baseURL}${config.endpoint}`,
			headers: {
				'Authorization': this.credentials.apiKey as string,
				'Accept': 'application/json',
				'Content-Type': 'application/json',
			},
			// Add timeout configurations
			timeout: timeouts.request, // Overall request timeout
			// Note: n8n's httpRequest doesn't have separate connection timeout,
			// but we can use the request timeout as the overall limit
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

			// Create a timeout promise for additional safety
			const timeoutPromise = new Promise<never>((_, reject) => {
				setTimeout(() => {
					reject(new Error(`Request timeout after ${timeouts.request}ms`));
				}, timeouts.request);
			});

			// Race between the actual request and the timeout
			const requestPromise = this.executeFunctions.helpers.httpRequest(requestOptions);
			const response = await Promise.race([requestPromise, timeoutPromise]);

			this.logResponse(config, response);

			return {
				data: response,
				statusCode: response.statusCode,
				headers: response.headers,
			};
		} catch (error) {
			this.logError(config, error);

			// Check if it's a timeout error and enhance the error message
			if (error.message && error.message.includes('timeout')) {
				const timeoutError = new Error(
					`Request timed out after ${timeouts.request}ms. ` +
					`This may indicate network issues or that the SevDesk API is experiencing delays. ` +
					`Please try again later or check your network connection.`
				);
				timeoutError.name = 'TimeoutError';
				throw this.handleApiError(timeoutError, config);
			}

			throw this.handleApiError(error, config);
		}
	}

	/**
	 * Execute a GET request to the SevDesk API
	 *
	 * Convenience method for making GET requests. Commonly used for retrieving
	 * resources, listing data, and performing read-only operations.
	 *
	 * @async
	 * @method get
	 * @template T - Expected type of the response data
	 * @param {string} endpoint - API endpoint path (e.g., '/Contact', '/Invoice/123')
	 * @param {Record<string, any>} [queryParams] - Optional query parameters for filtering, pagination, etc.
	 *
	 * @returns {Promise<ApiResponse<T>>} Promise resolving to the API response
	 *
	 * @throws {SevDeskApiError} When the API request fails
	 *
	 * @example
	 * ```typescript
	 * // Get all contacts
	 * const contacts = await apiClient.get('/Contact');
	 *
	 * // Get contacts with pagination
	 * const pagedContacts = await apiClient.get('/Contact', { limit: 10, offset: 20 });
	 *
	 * // Get specific contact
	 * const contact = await apiClient.get('/Contact/123');
	 * ```
	 */
	async get<T = any>(endpoint: string, queryParams?: Record<string, any>): Promise<ApiResponse<T>> {
		return this.request<T>({
			method: 'GET',
			endpoint,
			queryParams,
		});
	}

	/**
	 * Execute a POST request to the SevDesk API
	 *
	 * Convenience method for making POST requests. Commonly used for creating
	 * new resources and executing operations that modify server state.
	 *
	 * @async
	 * @method post
	 * @template T - Expected type of the response data
	 * @param {string} endpoint - API endpoint path (e.g., '/Contact', '/Invoice')
	 * @param {any} body - Request body data containing the resource to create or operation parameters
	 * @param {Record<string, any>} [queryParams] - Optional query parameters
	 *
	 * @returns {Promise<ApiResponse<T>>} Promise resolving to the API response with created resource data
	 *
	 * @throws {SevDeskValidationError} When the request body contains invalid data
	 * @throws {SevDeskApiError} When the API request fails
	 *
	 * @example
	 * ```typescript
	 * // Create a new contact
	 * const newContact = await apiClient.post('/Contact', {
	 *   name: 'Test Company',
	 *   customerNumber: 'CUST-001',
	 *   category: { id: '3', objectName: 'Category' }
	 * });
	 *
	 * // Create an invoice
	 * const invoice = await apiClient.post('/Invoice', {
	 *   contact: { id: '123', objectName: 'Contact' },
	 *   invoiceDate: '2025-01-07'
	 * });
	 * ```
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
	 * Execute a PUT request to the SevDesk API
	 *
	 * Convenience method for making PUT requests. Commonly used for updating
	 * existing resources with new data.
	 *
	 * @async
	 * @method put
	 * @template T - Expected type of the response data
	 * @param {string} endpoint - API endpoint path including resource ID (e.g., '/Contact/123')
	 * @param {any} body - Request body data containing the updated resource data
	 * @param {Record<string, any>} [queryParams] - Optional query parameters
	 *
	 * @returns {Promise<ApiResponse<T>>} Promise resolving to the API response with updated resource data
	 *
	 * @throws {SevDeskValidationError} When the request body contains invalid data
	 * @throws {SevDeskApiError} When the API request fails or resource is not found
	 *
	 * @example
	 * ```typescript
	 * // Update a contact
	 * const updatedContact = await apiClient.put('/Contact/123', {
	 *   name: 'Updated Company Name',
	 *   email: 'new-email@example.com'
	 * });
	 *
	 * // Update an invoice
	 * const updatedInvoice = await apiClient.put('/Invoice/456', {
	 *   status: 'sent',
	 *   sendDate: '2025-01-07'
	 * });
	 * ```
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
	 * Execute a DELETE request to the SevDesk API
	 *
	 * Convenience method for making DELETE requests. Commonly used for removing
	 * resources from the system. Note that some SevDesk resources may use soft
	 * deletion (marking as inactive) rather than permanent removal.
	 *
	 * @async
	 * @method delete
	 * @template T - Expected type of the response data
	 * @param {string} endpoint - API endpoint path including resource ID (e.g., '/Contact/123')
	 * @param {Record<string, any>} [queryParams] - Optional query parameters
	 *
	 * @returns {Promise<ApiResponse<T>>} Promise resolving to the API response confirming deletion
	 *
	 * @throws {SevDeskApiError} When the API request fails or resource is not found
	 *
	 * @example
	 * ```typescript
	 * // Delete a contact
	 * const result = await apiClient.delete('/Contact/123');
	 *
	 * // Delete an invoice
	 * const result = await apiClient.delete('/Invoice/456');
	 *
	 * // Delete with query parameters
	 * const result = await apiClient.delete('/Contact/123', { force: true });
	 * ```
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
	 *
	 * Filters out undefined, null, and empty string values from query parameters
	 * to ensure clean API requests. This prevents sending unnecessary parameters
	 * that could cause API errors or unexpected behavior.
	 *
	 * @private
	 * @method processQueryParameters
	 * @param {Record<string, any>} params - Raw query parameters object
	 *
	 * @returns {Record<string, any>} Cleaned query parameters with falsy values removed
	 *
	 * @example
	 * ```typescript
	 * const cleaned = this.processQueryParameters({
	 *   limit: 10,
	 *   offset: 0,
	 *   filter: '',
	 *   sort: undefined
	 * });
	 * // Returns: { limit: 10, offset: 0 }
	 * ```
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
	 * Sanitize data for secure logging
	 * Removes sensitive information from log data to prevent information leakage
	 */
	private sanitizeForLogging(data: any): any {
		if (!data) return data;

		// Convert to string for pattern matching
		const dataStr = typeof data === 'string' ? data : JSON.stringify(data);

		// Patterns to sanitize in logs
		const sensitivePatterns = [
			// API keys and tokens
			/api[_-]?key[=:\s]*[a-zA-Z0-9_-]{10,}/gi,
			/token[=:\s]*[a-zA-Z0-9_-]{10,}/gi,
			/bearer\s+[a-zA-Z0-9_-]{10,}/gi,
			/authorization[=:\s]*[a-zA-Z0-9_-]{10,}/gi,

			// Email addresses (partial masking)
			/([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g,

			// Phone numbers
			/\+?[\d\s\-\(\)]{10,}/g,

			// Credit card numbers
			/\b\d{4}[\s\-]?\d{4}[\s\-]?\d{4}[\s\-]?\d{4}\b/g,

			// IP addresses (partial masking)
			/\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
		];

		let sanitized = dataStr;

		// Apply sanitization patterns
		sensitivePatterns.forEach(pattern => {
			if (pattern.source.includes('email')) {
				// Partial email masking
				sanitized = sanitized.replace(pattern, (match, user, domain) => {
					const maskedUser = user.length > 1 ? user[0] + '*'.repeat(Math.min(user.length - 1, 3)) : '*';
					return `${maskedUser}@${domain}`;
				});
			} else if (pattern.source.includes('IP')) {
				// Partial IP masking
				sanitized = sanitized.replace(pattern, (match) => {
					const parts = match.split('.');
					return parts.length === 4 ? `${parts[0]}.${parts[1]}.*.*` : match;
				});
			} else {
				// Complete removal for sensitive data
				sanitized = sanitized.replace(pattern, '[REDACTED]');
			}
		});

		// Try to parse back to original type if it was an object
		if (typeof data === 'object') {
			try {
				return JSON.parse(sanitized);
			} catch {
				return sanitized;
			}
		}

		return sanitized;
	}

	/**
	 * Log API request details with secure sanitization
	 *
	 * Logs structured information about outgoing API requests for debugging
	 * and monitoring purposes. Includes timestamp, HTTP method, endpoint,
	 * and metadata about request body and query parameters.
	 * All sensitive data is sanitized before logging.
	 *
	 * @private
	 * @method logRequest
	 * @param {ApiRequestConfig} config - The request configuration being logged
	 *
	 * @example
	 * ```typescript
	 * this.logRequest({
	 *   method: 'POST',
	 *   endpoint: '/Contact',
	 *   body: { name: 'Test' },
	 *   queryParams: { validate: true }
	 * });
	 * // Logs: [SevDesk API Request] {"timestamp":"2025-01-07T10:00:00.000Z","method":"POST","endpoint":"/Contact","hasBody":true,"hasQueryParams":true}
	 * ```
	 */
	private logRequest(config: ApiRequestConfig): void {
		// Only log when debug is enabled to prevent production log pollution
		if (!isDebugEnabled()) {
			return;
		}

		const logData = {
			timestamp: new Date().toISOString(),
			method: config.method,
			endpoint: this.sanitizeForLogging(config.endpoint),
			hasBody: !!config.body,
			hasQueryParams: !!config.queryParams,
			// Never log actual body or query params content for security
		};

		console.info(`[SevDesk API Request] ${JSON.stringify(logData)}`);
	}

	/**
	 * Log API response details with secure sanitization
	 *
	 * Logs structured information about API responses for debugging and
	 * monitoring purposes. Includes timestamp, request details, response
	 * status code, and metadata about response data.
	 * All sensitive data is sanitized before logging.
	 *
	 * @private
	 * @method logResponse
	 * @param {ApiRequestConfig} config - The original request configuration
	 * @param {any} response - The API response object
	 *
	 * @example
	 * ```typescript
	 * this.logResponse(config, { statusCode: 200, data: {...} });
	 * // Logs: [SevDesk API Response] {"timestamp":"2025-01-07T10:00:00.000Z","method":"POST","endpoint":"/Contact","statusCode":200,"hasData":true}
	 * ```
	 */
	private logResponse(config: ApiRequestConfig, response: any): void {
		// Only log when debug is enabled to prevent production log pollution
		if (!isDebugEnabled()) {
			return;
		}

		const logData = {
			timestamp: new Date().toISOString(),
			method: config.method,
			endpoint: this.sanitizeForLogging(config.endpoint),
			statusCode: response.statusCode || 'unknown',
			hasData: !!response,
			// Never log actual response data content for security
		};

		console.info(`[SevDesk API Response] ${JSON.stringify(logData)}`);
	}

	/**
	 * Log API error details
	 *
	 * Logs structured information about API errors for debugging and
	 * troubleshooting purposes. Includes timestamp, request details,
	 * and error message information.
	 *
	 * @private
	 * @method logError
	 * @param {ApiRequestConfig} config - The original request configuration that failed
	 * @param {any} error - The error object or message
	 *
	 * @example
	 * ```typescript
	 * this.logError(config, new Error('Network timeout'));
	 * // Logs: [SevDesk API Error] {"timestamp":"2025-01-07T10:00:00.000Z","method":"POST","endpoint":"/Contact","error":"Network timeout"}
	 * ```
	 */
	private logError(config: ApiRequestConfig, error: any): void {
		const logData = {
			timestamp: new Date().toISOString(),
			method: config.method,
			endpoint: config.endpoint,
			error: error instanceof Error ? error.message : String(error),
		};

		// Use console for logging since n8n logger is not available in this context
		console.error(`[SevDesk API Error] ${JSON.stringify(logData)}`);
	}

	/**
	 * Handle and format API errors using unified error handling system
	 *
	 * Processes API errors and converts them into standardized SevDesk error types
	 * with appropriate error messages and context. This ensures consistent error
	 * handling across all API operations and provides meaningful feedback to users.
	 *
	 * @private
	 * @method handleApiError
	 * @param {any} error - The raw error from the HTTP request
	 * @param {ApiRequestConfig} config - The request configuration that caused the error
	 *
	 * @returns {NodeApiError} Formatted n8n-compatible error with SevDesk-specific details
	 *
	 * @throws {NodeApiError} Always throws a formatted error for the calling code to handle
	 *
	 * @example
	 * ```typescript
	 * try {
	 *   await this.request(config);
	 * } catch (error) {
	 *   throw this.handleApiError(error, config);
	 * }
	 * ```
	 */
	private handleApiError(error: any, config: ApiRequestConfig): NodeApiError {
		let sevDeskError: SevDeskError;

		// Debug logging
		console.log('Error details:', {
			code: error.code,
			name: error.name,
			message: error.message,
			statusCode: error.statusCode,
			hasResponse: !!error.response
		});

		// Check if it's a network/connection error (by error code or error name)
		if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT' ||
			error.name === 'TimeoutError' || error.name === 'ConnectionError' ||
			error.message?.includes('timeout') || error.message?.includes('Connection refused')) {
			console.log('Creating connection error');
			sevDeskError = SevDeskErrorFactory.createConnectionError(error);
		}
		// Check if it's an HTTP error with status code
		else if (error.statusCode || error.response?.status) {
			console.log('Creating HTTP status error');
			const statusCode = error.statusCode || error.response?.status;
			const errorData = error.response?.data || error.response?.body || error.body || {};
			sevDeskError = SevDeskErrorFactory.createError(statusCode, errorData, error);
		}
		// Handle other types of errors
		else {
			console.log('Creating configuration error');
			const errorMessage = error instanceof Error ? error.message : String(error);
			sevDeskError = SevDeskErrorFactory.createConfigurationError(
				`API request failed: ${errorMessage}`,
				error
			);
		}

		console.log('Created error:', {
			type: sevDeskError.constructor.name,
			message: sevDeskError.message,
			errorCode: sevDeskError.errorCode
		});

		// Convert to NodeApiError for n8n
		return sevDeskError.toNodeApiError(this.executeFunctions.getNode());
	}

	/**
	 * Add pagination parameters to query params
	 *
	 * Extracts pagination parameters from the node configuration and adds them
	 * to the query parameters object. This is used for list operations that
	 * support pagination to control the number of results returned.
	 *
	 * @method addPagination
	 * @param {Record<string, any>} queryParams - Existing query parameters object
	 * @param {number} itemIndex - Index of the current input item being processed
	 *
	 * @returns {Record<string, any>} Query parameters object with pagination added
	 *
	 * @example
	 * ```typescript
	 * const params = { filter: 'active' };
	 * const paginatedParams = apiClient.addPagination(params, 0);
	 * // Returns: { filter: 'active', limit: 50, offset: 0 }
	 * ```
	 *
	 * @see {@link https://api.sevdesk.de/#section/Pagination} SevDesk Pagination Documentation
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
	 *
	 * Returns the configured base URL for SevDesk API requests. This URL
	 * includes the API version and is used as the foundation for all
	 * endpoint URLs.
	 *
	 * @method getBaseURL
	 * @returns {string} The complete base URL for SevDesk API requests
	 *
	 * @example
	 * ```typescript
	 * const baseURL = apiClient.getBaseURL();
	 * // Returns: "https://my.sevdesk.de/api/v1"
	 * ```
	 */
	getBaseURL(): string {
		return this.baseURL;
	}

	/**
	 * Get credentials
	 *
	 * Returns the currently loaded SevDesk API credentials. This includes
	 * the API key, API version, and other authentication-related information
	 * retrieved from the n8n credential store.
	 *
	 * @method getCredentials
	 * @returns {any} The SevDesk API credentials object
	 *
	 * @example
	 * ```typescript
	 * const credentials = apiClient.getCredentials();
	 * // Returns: { apiKey: "...", apiVersion: "v1", ... }
	 * ```
	 *
	 * @see {@link https://api.sevdesk.de/#section/Authentication} SevDesk Authentication Documentation
	 */
	getCredentials(): any {
		return this.credentials;
	}
}
