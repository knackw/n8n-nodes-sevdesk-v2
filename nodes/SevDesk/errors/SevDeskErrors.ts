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
	 * Sanitize error message to prevent information leakage
	 * Removes sensitive information like API keys, tokens, and internal system details
	 */
	private sanitizeMessage(message: string): string {
		if (!message) return 'An error occurred';

		// Patterns to sanitize
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

			// Internal system paths
			/[a-zA-Z]:\\[^\\]+\\[^\\]+/g,
			/\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/g,

			// Database connection strings
			/(?:mysql|postgres|mongodb|redis):\/\/[^\s]+/gi,

			// IP addresses (partial masking)
			/\b(?:\d{1,3}\.){3}\d{1,3}\b/g,

			// Stack traces (remove file paths)
			/at\s+[^\s]+\s+\([^)]+\)/g,
		];

		let sanitized = message;

		// Apply sanitization patterns
		sensitivePatterns.forEach(pattern => {
			if (pattern.source.includes('email')) {
				// Partial email masking: user@domain.com -> u***@domain.com
				sanitized = sanitized.replace(pattern, (match, user, domain) => {
					const maskedUser = user.length > 1 ? user[0] + '*'.repeat(user.length - 1) : '*';
					return `${maskedUser}@${domain}`;
				});
			} else if (pattern.source.includes('IP')) {
				// Partial IP masking: 192.168.1.1 -> 192.168.*.*
				sanitized = sanitized.replace(pattern, (match) => {
					const parts = match.split('.');
					return parts.length === 4 ? `${parts[0]}.${parts[1]}.*.*` : match;
				});
			} else {
				// Complete removal/replacement for sensitive data
				sanitized = sanitized.replace(pattern, '[REDACTED]');
			}
		});

		// Remove excessive whitespace
		sanitized = sanitized.replace(/\s+/g, ' ').trim();

		// Ensure message is not empty after sanitization
		return sanitized || 'An error occurred during the operation';
	}

	/**
	 * Get sanitized error message for user display
	 */
	private getSanitizedMessage(): string {
		return this.sanitizeMessage(this.message);
	}

	/**
	 * Convert to n8n NodeApiError with proper sanitization
	 */
	toNodeApiError(node: INode): NodeApiError {
		// Use sanitized message for user-facing error
		const sanitizedMessage = this.getSanitizedMessage();

		// Log error details for debugging (only in development)
		if (process.env.NODE_ENV === 'development') {
			console.log('SevDesk Error Debug Info:', {
				nodeType: node?.type,
				nodeName: node?.name,
				errorType: this.constructor.name,
				errorCode: this.errorCode,
				// Only log sanitized message, never the original
				sanitizedMessage: sanitizedMessage
			});
		}

		// Create error data with sanitized information
		const errorData = {
			message: sanitizedMessage,
			error: sanitizedMessage,
			errorCode: this.errorCode,
			type: this.constructor.name
		};

		const nodeApiError = new NodeApiError(node, errorData, {
			description: this.getDescription(),
			...(this.httpStatusCode && { httpCode: this.httpStatusCode.toString() }),
		});

		return nodeApiError;
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
	readonly httpStatusCode = undefined;

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
	readonly httpStatusCode = undefined;

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
 * Contact operation specific errors
 */
export class SevDeskContactError extends SevDeskError {
	readonly errorCode = 'CONTACT_ERROR';
	readonly httpStatusCode = 400;

	constructor(
		operation: string,
		message: string,
		public readonly contactId?: string,
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		const suggestions = {
			'create': 'Ensure required fields (name, customerNumber, category) are provided and valid.',
			'update': 'Check that the contact ID exists and you have permission to modify it.',
			'delete': 'Verify the contact exists and is not referenced by other records (invoices, orders).',
			'get': 'Check that the contact ID is valid and you have access to it.',
			'checkCustomerNumberAvailability': 'Ensure the customer number format is valid.'
		};
		
		return suggestions[this.message.toLowerCase()] || 'Please check the contact data and permissions.';
	}
}

/**
 * Invoice operation specific errors
 */
export class SevDeskInvoiceError extends SevDeskError {
	readonly errorCode = 'INVOICE_ERROR';
	readonly httpStatusCode = 400;

	constructor(
		operation: string,
		message: string,
		public readonly invoiceId?: string,
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		const suggestions = {
			'create': 'Ensure contact ID, invoice date, and positions are provided. Check tax calculations.',
			'update': 'Verify the invoice is still editable (not sent or paid) and data is valid.',
			'delete': 'Check that the invoice exists and is not finalized or paid.',
			'sendByEmail': 'Ensure the contact has a valid email address and invoice is finalized.',
			'markAsSent': 'Verify the invoice is in the correct status to be marked as sent.',
			'bookAmount': 'Check the amount, date, and check account are valid for payment booking.',
			'cancel': 'Ensure the invoice can be cancelled (not already paid or cancelled).'
		};
		
		return suggestions[this.message.toLowerCase()] || 'Please check the invoice data and status.';
	}
}

/**
 * Order operation specific errors
 */
export class SevDeskOrderError extends SevDeskError {
	readonly errorCode = 'ORDER_ERROR';
	readonly httpStatusCode = 400;

	constructor(
		operation: string,
		message: string,
		public readonly orderId?: string,
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		const suggestions = {
			'create': 'Ensure contact ID, order date, and order positions are provided.',
			'update': 'Verify the order is still editable and not converted to invoice.',
			'delete': 'Check that the order exists and is not referenced by invoices.',
			'createInvoice': 'Ensure the order is finalized and has valid positions for invoice creation.'
		};
		
		return suggestions[this.message.toLowerCase()] || 'Please check the order data and status.';
	}
}

/**
 * Voucher operation specific errors
 */
export class SevDeskVoucherError extends SevDeskError {
	readonly errorCode = 'VOUCHER_ERROR';
	readonly httpStatusCode = 400;

	constructor(
		operation: string,
		message: string,
		public readonly voucherId?: string,
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		const suggestions = {
			'create': 'Ensure voucher date, supplier, and amounts are provided. Check document upload.',
			'update': 'Verify the voucher is still editable and not booked.',
			'delete': 'Check that the voucher exists and is not booked to accounting.',
			'upload': 'Ensure the file is valid (PDF, image) and under size limit (10MB).'
		};
		
		return suggestions[this.message.toLowerCase()] || 'Please check the voucher data and document.';
	}
}

/**
 * Batch operation specific errors
 */
export class SevDeskBatchError extends SevDeskError {
	readonly errorCode = 'BATCH_ERROR';
	readonly httpStatusCode = 400;

	constructor(
		message: string,
		public readonly batchId?: string,
		public readonly failedOperations?: any[],
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		if (this.failedOperations && this.failedOperations.length > 0) {
			return `Batch operation partially failed. ${this.failedOperations.length} operations failed. Check individual operation errors for details.`;
		}
		return 'Batch operation failed. Ensure all operations are valid and within batch size limits (max 100 operations).';
	}
}

/**
 * File operation specific errors
 */
export class SevDeskFileError extends SevDeskError {
	readonly errorCode = 'FILE_ERROR';
	readonly httpStatusCode = 400;

	constructor(
		operation: string,
		message: string,
		public readonly fileName?: string,
		originalError?: any
	) {
		super(message, originalError);
	}

	getDescription(): string {
		const suggestions = {
			'upload': 'Check file format (PDF, JPG, PNG), size (max 10MB), and permissions.',
			'download': 'Ensure the file exists and you have access permissions.',
			'downloadPdf': 'Verify the document can be generated as PDF.',
			'downloadXml': 'Check that XML export is available for this resource type.'
		};
		
		return suggestions[this.message.toLowerCase()] || 'Please check the file operation and permissions.';
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
	 * Create resource-specific error based on operation context
	 */
	static createResourceError(
		resource: string,
		operation: string,
		message: string,
		resourceId?: string,
		originalError?: any
	): SevDeskError {
		switch (resource.toLowerCase()) {
			case 'contact':
				return new SevDeskContactError(operation, message, resourceId, originalError);
			
			case 'invoice':
				return new SevDeskInvoiceError(operation, message, resourceId, originalError);
			
			case 'order':
				return new SevDeskOrderError(operation, message, resourceId, originalError);
			
			case 'voucher':
				return new SevDeskVoucherError(operation, message, resourceId, originalError);
			
			case 'batch':
				return new SevDeskBatchError(message, resourceId, undefined, originalError);
			
			default:
				return new SevDeskApiError(message, 400, originalError);
		}
	}

	/**
	 * Create file operation error
	 */
	static createFileError(
		operation: string,
		message: string,
		fileName?: string,
		originalError?: any
	): SevDeskFileError {
		return new SevDeskFileError(operation, message, fileName, originalError);
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

	/**
	 * Create batch error with failed operations details
	 */
	static createBatchError(
		message: string,
		batchId?: string,
		failedOperations?: any[],
		originalError?: any
	): SevDeskBatchError {
		return new SevDeskBatchError(message, batchId, failedOperations, originalError);
	}
}
