/**
 * Resource validation system to ensure data integrity before API calls
 * This system provides comprehensive validation for all SevDesk resources
 */

import { IDataObject } from "n8n-workflow";

/**
 * Validation rule interface
 */
export interface IValidationRule {
	field: string;
	type: 'required' | 'string' | 'number' | 'email' | 'date' | 'boolean' | 'array' | 'object' | 'custom' | 'allowedValues';
	message?: string;
	validator?: (value: any) => boolean;
	minLength?: number;
	maxLength?: number;
	min?: number;
	max?: number;
	pattern?: RegExp;
	allowedValues?: any[];
}

/**
 * Validation result interface
 */
export interface IValidationResult {
	isValid: boolean;
	errors: IValidationError[];
}

/**
 * Validation error interface
 */
export interface IValidationError {
	field: string;
	message: string;
	value?: any;
}

/**
 * Resource validation schema interface
 */
export interface IResourceValidationSchema {
	resource: string;
	operation: string;
	rules: IValidationRule[];
}

/**
 * German business validation rules
 */
export class GermanBusinessValidator {
	/**
	 * Validate German VAT number (Umsatzsteuer-Identifikationsnummer)
	 */
	static validateVATNumber(vatNumber: string): boolean {
		// German VAT format: DE + 9 digits
		const germanVATPattern = /^DE\d{9}$/;
		return germanVATPattern.test(vatNumber);
	}

	/**
	 * Validate German postal code
	 */
	static validatePostalCode(postalCode: string): boolean {
		// German postal codes are 5 digits
		const postalCodePattern = /^\d{5}$/;
		return postalCodePattern.test(postalCode);
	}

	/**
	 * Validate German phone number
	 */
	static validatePhoneNumber(phoneNumber: string): boolean {
		// Basic German phone number validation
		const phonePattern = /^(\+49|0)[1-9]\d{1,14}$/;
		return phonePattern.test(phoneNumber.replace(/[\s\-\(\)]/g, ''));
	}

	/**
	 * Validate German IBAN
	 */
	static validateIBAN(iban: string): boolean {
		// German IBAN format: DE + 2 check digits + 18 digits
		const germanIBANPattern = /^DE\d{20}$/;
		return germanIBANPattern.test(iban.replace(/\s/g, ''));
	}

	/**
	 * Validate German tax number (Steuernummer)
	 */
	static validateTaxNumber(taxNumber: string): boolean {
		// German tax number format varies by state, basic validation
		const taxNumberPattern = /^\d{2,3}\/\d{3}\/\d{5}$/;
		return taxNumberPattern.test(taxNumber);
	}
}

/**
 * Core resource validator class
 */
export class ResourceValidator {
	private static validationSchemas: Map<string, IResourceValidationSchema[]> = new Map();

	/**
	 * Register validation schema for a resource
	 */
	static registerSchema(schema: IResourceValidationSchema): void {
		const schemas = this.validationSchemas.get(schema.resource) || [];

		// Remove existing schema for the same operation
		const filteredSchemas = schemas.filter(s => s.operation !== schema.operation);
		filteredSchemas.push(schema);

		this.validationSchemas.set(schema.resource, filteredSchemas);
	}

	/**
	 * Get validation schema for a resource and operation
	 */
	static getSchema(resource: string, operation: string): IResourceValidationSchema | null {
		const schemas = this.validationSchemas.get(resource);
		if (!schemas) return null;

		return schemas.find(s => s.operation === operation) || null;
	}

	/**
	 * Validate data against a schema
	 */
	static validate(data: IDataObject, resource: string, operation: string): IValidationResult {
		const schema = this.getSchema(resource, operation);
		if (!schema) {
			return { isValid: true, errors: [] };
		}

		const errors: IValidationError[] = [];

		for (const rule of schema.rules) {
			const value = data[rule.field];
			const error = this.validateField(rule.field, value, rule);
			if (error) {
				errors.push(error);
			}
		}

		return {
			isValid: errors.length === 0,
			errors,
		};
	}

	/**
	 * Validate a single field against a rule
	 */
	private static validateField(field: string, value: any, rule: IValidationRule): IValidationError | null {
		// Required validation
		if (rule.type === 'required' && (value === undefined || value === null || value === '')) {
			return {
				field,
				message: rule.message || `Field '${field}' is required`,
				value,
			};
		}

		// Skip other validations if value is empty and not required
		if (value === undefined || value === null || value === '') {
			return null;
		}

		// Type validations
		switch (rule.type) {
			case 'string':
				if (typeof value !== 'string') {
					return {
						field,
						message: rule.message || `Field '${field}' must be a string`,
						value,
					};
				}
				break;

			case 'number':
				if (typeof value !== 'number' || isNaN(value)) {
					return {
						field,
						message: rule.message || `Field '${field}' must be a number`,
						value,
					};
				}
				break;

			case 'email':
				const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
				if (!emailPattern.test(value)) {
					return {
						field,
						message: rule.message || `Field '${field}' must be a valid email address`,
						value,
					};
				}
				break;

			case 'date':
				const date = new Date(value);
				if (isNaN(date.getTime())) {
					return {
						field,
						message: rule.message || `Field '${field}' must be a valid date`,
						value,
					};
				}
				break;

			case 'boolean':
				if (typeof value !== 'boolean') {
					return {
						field,
						message: rule.message || `Field '${field}' must be a boolean`,
						value,
					};
				}
				break;

			case 'array':
				if (!Array.isArray(value)) {
					return {
						field,
						message: rule.message || `Field '${field}' must be an array`,
						value,
					};
				}
				break;

			case 'object':
				if (typeof value !== 'object' || Array.isArray(value)) {
					return {
						field,
						message: rule.message || `Field '${field}' must be an object`,
						value,
					};
				}
				break;

			case 'custom':
				if (rule.validator && !rule.validator(value)) {
					return {
						field,
						message: rule.message || `Field '${field}' failed custom validation`,
						value,
					};
				}
				break;

			case 'allowedValues':
				if (rule.allowedValues && !rule.allowedValues.includes(value)) {
					return {
						field,
						message: rule.message || `Field '${field}' must be one of: ${rule.allowedValues.join(', ')}`,
						value,
					};
				}
				break;
		}

		// Length validations for strings
		if (typeof value === 'string') {
			if (rule.minLength !== undefined && value.length < rule.minLength) {
				return {
					field,
					message: rule.message || `Field '${field}' must be at least ${rule.minLength} characters long`,
					value,
				};
			}

			if (rule.maxLength !== undefined && value.length > rule.maxLength) {
				return {
					field,
					message: rule.message || `Field '${field}' must be at most ${rule.maxLength} characters long`,
					value,
				};
			}
		}

		// Range validations for numbers
		if (typeof value === 'number') {
			if (rule.min !== undefined && value < rule.min) {
				return {
					field,
					message: rule.message || `Field '${field}' must be at least ${rule.min}`,
					value,
				};
			}

			if (rule.max !== undefined && value > rule.max) {
				return {
					field,
					message: rule.message || `Field '${field}' must be at most ${rule.max}`,
					value,
				};
			}
		}

		// Pattern validation
		if (rule.pattern && typeof value === 'string' && !rule.pattern.test(value)) {
			return {
				field,
				message: rule.message || `Field '${field}' does not match the required pattern`,
				value,
			};
		}

		return null;
	}

	/**
	 * Get all registered schemas
	 */
	static getAllSchemas(): Map<string, IResourceValidationSchema[]> {
		return new Map(this.validationSchemas);
	}

	/**
	 * Clear all schemas (useful for testing)
	 */
	static clearSchemas(): void {
		this.validationSchemas.clear();
	}
}
