import { NodeApiError, INode } from "n8n-workflow";

/**
 * Base class for all SevDesk API errors
 */
export abstract class SevDeskError extends Error {
	abstract readonly errorCode: string;
	abstract readonly httpStatusCode?: number;

	constructor(message: string, public readonly originalError?: any) {
		super(message);
		this.name = this.constructor.name;
	}

	/**
	 * Convert to n8n NodeApiError
	 */
	toNodeApiError(node: INode): NodeApiError {
		return new NodeApiError(node, {
			message: this.message,
			description: this.getDescription(),
			httpCode: this.httpStatusCode,
		});
	}

	/**
	 * Get detailed error description
	 */
	abstract getDescription(): string;
}

/**
 * Authentication related errors
 */
export class SevDeskAuthenticationError extends SevDeskError {
	readonly errorCode = 'AUTHENTICATION_ERROR';
	readonly httpStatusCode = 401;

	constructor(message: string = 'Authentication failed', originalError?: any) {
		super(message, originalError);
	}

	getDescription(): string {
		return 'Please check your API key and ensure it has the necessary permissions. You can find your API key in your SevDesk account settings.';
	}
}

/**
 * Authorization/Permission related errors
 */
export class SevDeskAuthorizationError extends SevDeskError {
	readonly errorCode = 'AUTHORIZATION_ERROR';
	readonly httpStatusCode = 403;

	constructor(message: string = 'Insufficient permissions', originalError?: any) {
		super(message, originalError);
	}

	getDescription(): string {
		return 'Your API key does not have sufficient permissions for this operation. Please check your SevDesk account permissions or contact your administrator.';
	}
}

/**
 * Resource not found errors
 */
export class SevDeskNotFoundError extends SevDeskError {
	readonly errorCode = 'NOT_FOUND_ERROR';
	readonly httpStatusCode = 404;

	constructor(resource: string, id?: string, originalError?: any) {
		const message = id
			? `${resource} with ID '${id}' not found`
			: `${resource} not found`;
		super(message, originalError);
	}

	getDescription(): string {
		return 'The requested resource does not exist. Please verify the ID and try again.';
	}
}

/**
 * Validation errors for request data
 */
export class SevDeskValidationError extends SevDeskError {
	readonly errorCode = 'VALIDATION_ERROR';
	readonly httpStatusCode = 400;

	constructor(
		message: string = 'Validation failed',
		public readonly validationErrors?: Record<string, string[]>,
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		if (this.validationErrors) {
			const errorDetails = Object.entries(this.validationErrors)
				.map(([field, errors]) => `${field}: ${errors.join(', ')}`)
				.join('; ');
			return `Validation failed: ${errorDetails}`;
		}
		return 'The provided data is invalid. Please check your input parameters and try again.';
	}
}

/**
 * Rate limiting errors
 */
export class SevDeskRateLimitError extends SevDeskError {
	readonly errorCode = 'RATE_LIMIT_ERROR';
	readonly httpStatusCode = 429;

	constructor(
		message: string = 'Rate limit exceeded',
		public readonly retryAfter?: number,
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		const retryMessage = this.retryAfter
			? ` Please wait ${this.retryAfter} seconds before retrying.`
			: ' Please wait before making additional requests.';
		return `You have exceeded the API rate limit.${retryMessage}`;
	}
}

/**
 * Server errors (5xx)
 */
export class SevDeskServerError extends SevDeskError {
	readonly errorCode = 'SERVER_ERROR';
	readonly httpStatusCode = 500;

	constructor(message: string = 'Server error occurred', originalError?: any) {
		super(message, originalError);
	}

	getDescription(): string {
		return 'A server error occurred on SevDesk\'s side. Please try again later or contact SevDesk support if the problem persists.';
	}
}

/**
 * Network/Connection errors
 */
export class SevDeskConnectionError extends SevDeskError {
	readonly errorCode = 'CONNECTION_ERROR';

	constructor(message: string = 'Connection failed', originalError?: any) {
		super(message, originalError);
	}

	getDescription(): string {
		return 'Failed to connect to SevDesk API. Please check your internet connection and try again.';
	}
}

/**
 * Configuration errors
 */
export class SevDeskConfigurationError extends SevDeskError {
	readonly errorCode = 'CONFIGURATION_ERROR';

	constructor(message: string = 'Configuration error', originalError?: any) {
		super(message, originalError);
	}

	getDescription(): string {
		return 'There is an issue with the node configuration. Please check your settings and credentials.';
	}
}

/**
 * Generic API errors for unhandled cases
 */
export class SevDeskApiError extends SevDeskError {
	readonly errorCode = 'API_ERROR';

	constructor(
		message: string = 'API error occurred',
		public readonly httpStatusCode?: number,
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		return 'An unexpected API error occurred. Please check your request parameters and try again.';
	}
}

/**
 * Error factory for creating appropriate error types based on HTTP status codes and error details
 */
export class SevDeskErrorFactory {
	/**
	 * Create appropriate error type based on HTTP status code and error details
	 */
	static createError(
		statusCode: number,
		errorData: any,
		originalError?: any
	): SevDeskError {
		const message = errorData?.message || errorData?.error || 'Unknown error';

		switch (statusCode) {
			case 401:
				return new SevDeskAuthenticationError(message, originalError);

			case 403:
				return new SevDeskAuthorizationError(message, originalError);

			case 404:
				return new SevDeskNotFoundError('Resource', undefined, originalError);

			case 400:
				return new SevDeskValidationError(
					message,
					errorData?.validation_errors || errorData?.errors,
					originalError
				);

			case 429:
				const retryAfter = errorData?.retry_after || originalError?.headers?.['retry-after'];
				return new SevDeskRateLimitError(message, retryAfter, originalError);

			case 500:
			case 502:
			case 503:
			case 504:
				return new SevDeskServerError(message, originalError);

			default:
				return new SevDeskApiError(message, statusCode, originalError);
		}
	}

	/**
	 * Create error from network/connection issues
	 */
	static createConnectionError(originalError: any): SevDeskConnectionError {
		const message = originalError?.message || 'Connection failed';
		return new SevDeskConnectionError(message, originalError);
	}

	/**
	 * Create configuration error
	 */
	static createConfigurationError(message: string, originalError?: any): SevDeskConfigurationError {
		return new SevDeskConfigurationError(message, originalError);
	}
}
