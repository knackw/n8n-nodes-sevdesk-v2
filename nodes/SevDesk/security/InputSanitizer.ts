/**
 * Input Sanitization Utility for SevDesk API Operations
 *
 * This module provides comprehensive input sanitization to prevent security vulnerabilities
 * such as injection attacks, XSS, and other malicious input. It works alongside the
 * existing validation system to ensure data integrity and security.
 *
 * @module InputSanitizer
 * @author n8n-nodes-sevdesk-v2
 * @version 1.0.0
 * @since 2025-01-07
 */

/**
 * Configuration options for input sanitization
 *
 * @interface SanitizationOptions
 */
export interface SanitizationOptions {
	/** Whether to trim whitespace from strings */
	trimWhitespace?: boolean;
	/** Whether to remove HTML tags */
	stripHtml?: boolean;
	/** Whether to escape special characters */
	escapeSpecialChars?: boolean;
	/** Whether to normalize Unicode characters */
	normalizeUnicode?: boolean;
	/** Maximum length for string fields */
	maxLength?: number;
	/** Whether to sanitize SQL injection patterns */
	preventSqlInjection?: boolean;
	/** Whether to prevent script injection */
	preventScriptInjection?: boolean;
	/** Custom sanitization patterns to remove */
	customPatterns?: RegExp[];
}

/**
 * Result of sanitization operation
 *
 * @interface SanitizationResult
 */
export interface SanitizationResult {
	/** The sanitized data */
	data: any;
	/** Whether any sanitization was applied */
	wasSanitized: boolean;
	/** List of sanitization actions performed */
	actions: string[];
	/** Any warnings about potentially malicious content */
	warnings: string[];
}

/**
 * Input Sanitizer Class
 *
 * Provides comprehensive input sanitization for all user-provided parameters
 * to prevent security vulnerabilities and ensure data integrity.
 *
 * @class InputSanitizer
 *
 * @example
 * ```typescript
 * const sanitizer = new InputSanitizer();
 * const result = sanitizer.sanitize({
 *   name: "  <script>alert('xss')</script>John Doe  ",
 *   email: "john@example.com'; DROP TABLE users; --"
 * });
 * // Returns sanitized data with security threats removed
 * ```
 */
export class InputSanitizer {
	private readonly defaultOptions: SanitizationOptions = {
		trimWhitespace: true,
		stripHtml: true,
		escapeSpecialChars: true,
		normalizeUnicode: true,
		maxLength: 10000,
		preventSqlInjection: true,
		preventScriptInjection: true,
		customPatterns: []
	};

	/**
	 * SQL injection patterns to detect and sanitize
	 */
	private readonly sqlInjectionPatterns: RegExp[] = [
		/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi,
		/(--|\/\*|\*\/|;|'|"|`)/g,
		/(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+/gi,
		/(\bOR\b|\bAND\b)\s+['"]?\w+['"]?\s*=\s*['"]?\w+['"]?/gi
	];

	/**
	 * Script injection patterns to detect and sanitize
	 */
	private readonly scriptInjectionPatterns: RegExp[] = [
		/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
		/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi,
		/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi,
		/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi,
		/javascript:/gi,
		/vbscript:/gi,
		/on\w+\s*=/gi
	];

	/**
	 * HTML tags to remove for security
	 */
	private readonly dangerousHtmlTags: RegExp = /<[^>]*>/g;

	/**
	 * Special characters that need escaping
	 */
	private readonly specialCharacters: { [key: string]: string } = {
		'<': '&lt;',
		'>': '&gt;',
		'"': '&quot;',
		"'": '&#x27;',
		'/': '&#x2F;',
		'&': '&amp;'
	};

	/**
	 * Sanitize input data with comprehensive security checks
	 *
	 * @param data - The input data to sanitize
	 * @param options - Sanitization options (optional)
	 * @returns Sanitization result with cleaned data and metadata
	 *
	 * @example
	 * ```typescript
	 * const result = sanitizer.sanitize({
	 *   name: "<script>alert('xss')</script>John",
	 *   description: "SQL'; DROP TABLE users; --"
	 * });
	 * ```
	 */
	public sanitize(data: any, options?: Partial<SanitizationOptions>): SanitizationResult {
		const opts = { ...this.defaultOptions, ...options };
		const result: SanitizationResult = {
			data: null,
			wasSanitized: false,
			actions: [],
			warnings: []
		};

		try {
			result.data = this.sanitizeValue(data, opts, result);
			return result;
		} catch (error) {
			result.warnings.push(`Sanitization error: ${error instanceof Error ? error.message : String(error)}`);
			result.data = data; // Return original data if sanitization fails
			return result;
		}
	}

	/**
	 * Sanitize a single value recursively
	 *
	 * @private
	 * @param value - The value to sanitize
	 * @param options - Sanitization options
	 * @param result - Result object to track actions and warnings
	 * @returns Sanitized value
	 */
	private sanitizeValue(value: any, options: SanitizationOptions, result: SanitizationResult): any {
		if (value === null || value === undefined) {
			return value;
		}

		if (typeof value === 'string') {
			return this.sanitizeString(value, options, result);
		}

		if (typeof value === 'number' || typeof value === 'boolean') {
			return value;
		}

		if (Array.isArray(value)) {
			return value.map(item => this.sanitizeValue(item, options, result));
		}

		if (typeof value === 'object') {
			const sanitizedObject: any = {};
			for (const [key, val] of Object.entries(value)) {
				const sanitizedKey = this.sanitizeString(key, options, result);
				sanitizedObject[sanitizedKey] = this.sanitizeValue(val, options, result);
			}
			return sanitizedObject;
		}

		return value;
	}

	/**
	 * Sanitize a string value with comprehensive security checks
	 *
	 * @private
	 * @param str - The string to sanitize
	 * @param options - Sanitization options
	 * @param result - Result object to track actions and warnings
	 * @returns Sanitized string
	 */
	private sanitizeString(str: string, options: SanitizationOptions, result: SanitizationResult): string {
		let sanitized = str;
		const originalLength = str.length;

		// Trim whitespace
		if (options.trimWhitespace) {
			const trimmed = sanitized.trim();
			if (trimmed !== sanitized) {
				sanitized = trimmed;
				result.wasSanitized = true;
				result.actions.push('Trimmed whitespace');
			}
		}

		// Normalize Unicode
		if (options.normalizeUnicode) {
			const normalized = sanitized.normalize('NFC');
			if (normalized !== sanitized) {
				sanitized = normalized;
				result.wasSanitized = true;
				result.actions.push('Normalized Unicode');
			}
		}

		// Check for SQL injection patterns
		if (options.preventSqlInjection) {
			for (const pattern of this.sqlInjectionPatterns) {
				if (pattern.test(sanitized)) {
					result.warnings.push('Potential SQL injection pattern detected and sanitized');
					sanitized = sanitized.replace(pattern, '');
					result.wasSanitized = true;
					result.actions.push('Removed SQL injection patterns');
				}
			}
		}

		// Check for script injection patterns
		if (options.preventScriptInjection) {
			for (const pattern of this.scriptInjectionPatterns) {
				if (pattern.test(sanitized)) {
					result.warnings.push('Potential script injection pattern detected and sanitized');
					sanitized = sanitized.replace(pattern, '');
					result.wasSanitized = true;
					result.actions.push('Removed script injection patterns');
				}
			}
		}

		// Strip HTML tags
		if (options.stripHtml) {
			const withoutHtml = sanitized.replace(this.dangerousHtmlTags, '');
			if (withoutHtml !== sanitized) {
				sanitized = withoutHtml;
				result.wasSanitized = true;
				result.actions.push('Stripped HTML tags');
			}
		}

		// Escape special characters
		if (options.escapeSpecialChars) {
			let escaped = sanitized;
			for (const [char, replacement] of Object.entries(this.specialCharacters)) {
				escaped = escaped.replace(new RegExp(char, 'g'), replacement);
			}
			if (escaped !== sanitized) {
				sanitized = escaped;
				result.wasSanitized = true;
				result.actions.push('Escaped special characters');
			}
		}

		// Apply custom patterns
		if (options.customPatterns && options.customPatterns.length > 0) {
			for (const pattern of options.customPatterns) {
				const cleaned = sanitized.replace(pattern, '');
				if (cleaned !== sanitized) {
					sanitized = cleaned;
					result.wasSanitized = true;
					result.actions.push('Applied custom sanitization pattern');
				}
			}
		}

		// Check maximum length
		if (options.maxLength && sanitized.length > options.maxLength) {
			sanitized = sanitized.substring(0, options.maxLength);
			result.wasSanitized = true;
			result.actions.push(`Truncated to ${options.maxLength} characters`);
			result.warnings.push(`Input was truncated from ${originalLength} to ${options.maxLength} characters`);
		}

		return sanitized;
	}

	/**
	 * Sanitize data specifically for SevDesk API operations
	 *
	 * Applies SevDesk-specific sanitization rules for common fields
	 * like contact names, email addresses, phone numbers, etc.
	 *
	 * @param data - The data to sanitize
	 * @param resourceType - The SevDesk resource type (contact, invoice, etc.)
	 * @returns Sanitization result with SevDesk-specific cleaning
	 *
	 * @example
	 * ```typescript
	 * const result = sanitizer.sanitizeForSevDesk({
	 *   name: "  John Doe  ",
	 *   email: "JOHN@EXAMPLE.COM",
	 *   phone: "+49 (123) 456-789"
	 * }, 'contact');
	 * ```
	 */
	public sanitizeForSevDesk(data: any, resourceType: string): SanitizationResult {
		const sevDeskOptions: SanitizationOptions = {
			...this.defaultOptions,
			maxLength: this.getMaxLengthForResource(resourceType),
			customPatterns: this.getCustomPatternsForResource(resourceType)
		};

		const result = this.sanitize(data, sevDeskOptions);

		// Apply SevDesk-specific sanitization
		if (typeof result.data === 'object' && result.data !== null) {
			result.data = this.applySevDeskSpecificSanitization(result.data, resourceType, result);
		}

		return result;
	}

	/**
	 * Get maximum length limits for different SevDesk resources
	 *
	 * @private
	 * @param resourceType - The resource type
	 * @returns Maximum length for the resource
	 */
	private getMaxLengthForResource(resourceType: string): number {
		const limits: { [key: string]: number } = {
			'contact': 5000,
			'invoice': 10000,
			'voucher': 5000,
			'order': 10000,
			'part': 2000,
			'default': 5000
		};

		return limits[resourceType.toLowerCase()] || limits.default;
	}

	/**
	 * Get custom sanitization patterns for different SevDesk resources
	 *
	 * @private
	 * @param resourceType - The resource type
	 * @returns Array of custom patterns for the resource
	 */
	private getCustomPatternsForResource(resourceType: string): RegExp[] {
		const patterns: { [key: string]: RegExp[] } = {
			'contact': [
				/[^\w\s@.\-+()]/g, // Allow only word chars, spaces, email chars, phone chars
			],
			'invoice': [
				/[^\w\s@.\-+(),€$%]/g, // Allow currency symbols for invoices
			],
			'default': [
				/[^\w\s@.\-+()]/g
			]
		};

		return patterns[resourceType.toLowerCase()] || patterns.default;
	}

	/**
	 * Apply SevDesk-specific sanitization rules
	 *
	 * @private
	 * @param data - The data object to sanitize
	 * @param resourceType - The resource type
	 * @param result - Result object to track actions
	 * @returns Sanitized data with SevDesk-specific rules applied
	 */
	private applySevDeskSpecificSanitization(data: any, resourceType: string, result: SanitizationResult): any {
		const sanitized = { ...data };

		// Sanitize email addresses
		if (sanitized.email && typeof sanitized.email === 'string') {
			const originalEmail = sanitized.email;
			sanitized.email = sanitized.email.toLowerCase().trim();
			if (sanitized.email !== originalEmail) {
				result.wasSanitized = true;
				result.actions.push('Normalized email address');
			}
		}

		// Sanitize phone numbers
		if (sanitized.phone && typeof sanitized.phone === 'string') {
			const originalPhone = sanitized.phone;
			// Remove all non-digit characters except +, -, (, ), and spaces
			sanitized.phone = sanitized.phone.replace(/[^\d+\-() ]/g, '');
			if (sanitized.phone !== originalPhone) {
				result.wasSanitized = true;
				result.actions.push('Sanitized phone number');
			}
		}

		// Sanitize customer numbers (alphanumeric only)
		if (sanitized.customerNumber && typeof sanitized.customerNumber === 'string') {
			const originalCustomerNumber = sanitized.customerNumber;
			sanitized.customerNumber = sanitized.customerNumber.replace(/[^\w\-]/g, '');
			if (sanitized.customerNumber !== originalCustomerNumber) {
				result.wasSanitized = true;
				result.actions.push('Sanitized customer number');
			}
		}

		// Sanitize VAT numbers (remove spaces and special chars except letters and numbers)
		if (sanitized.vatNumber && typeof sanitized.vatNumber === 'string') {
			const originalVatNumber = sanitized.vatNumber;
			sanitized.vatNumber = sanitized.vatNumber.replace(/[^\w]/g, '').toUpperCase();
			if (sanitized.vatNumber !== originalVatNumber) {
				result.wasSanitized = true;
				result.actions.push('Sanitized VAT number');
			}
		}

		return sanitized;
	}

	/**
	 * Quick sanitization for simple string inputs
	 *
	 * @param input - The string to sanitize
	 * @returns Sanitized string
	 *
	 * @example
	 * ```typescript
	 * const clean = InputSanitizer.quickSanitize("<script>alert('xss')</script>Hello");
	 * // Returns: "Hello"
	 * ```
	 */
	public static quickSanitize(input: string): string {
		if (typeof input !== 'string') {
			return input;
		}

		return input
			.trim()
			.replace(/<[^>]*>/g, '') // Remove HTML tags
			.replace(/[<>"'&]/g, '') // Remove dangerous characters
			.replace(/(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION|SCRIPT)\b)/gi, '') // Remove SQL keywords
			.substring(0, 1000); // Limit length
	}

	/**
	 * Validate that sanitization was successful
	 *
	 * @param original - Original data
	 * @param sanitized - Sanitized data
	 * @returns True if sanitization appears successful
	 */
	public static validateSanitization(original: any, sanitized: any): boolean {
		if (typeof original !== 'string' || typeof sanitized !== 'string') {
			return true; // Non-string data doesn't need string sanitization validation
		}

		// Check that dangerous patterns are removed
		const dangerousPatterns = [
			/<script/i,
			/javascript:/i,
			/on\w+\s*=/i,
			/(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|UNION)\b/i
		];

		return !dangerousPatterns.some(pattern => pattern.test(sanitized));
	}
}

/**
 * Default input sanitizer instance
 * Can be used throughout the application for consistent sanitization
 */
export const defaultSanitizer = new InputSanitizer();

/**
 * Convenience function for quick sanitization
 *
 * @param data - Data to sanitize
 * @param options - Sanitization options
 * @returns Sanitized data
 */
export function sanitizeInput(data: any, options?: Partial<SanitizationOptions>): any {
	return defaultSanitizer.sanitize(data, options).data;
}

/**
 * Convenience function for SevDesk-specific sanitization
 *
 * @param data - Data to sanitize
 * @param resourceType - SevDesk resource type
 * @returns Sanitized data
 */
export function sanitizeForSevDesk(data: any, resourceType: string): any {
	return defaultSanitizer.sanitizeForSevDesk(data, resourceType).data;
}
