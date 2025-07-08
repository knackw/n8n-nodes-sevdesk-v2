/**
 * Validation schemas for SevDesk resources
 * This file contains predefined validation rules for all core resources
 */

import { ResourceValidator, IResourceValidationSchema, GermanBusinessValidator } from './ResourceValidator';

/**
 * Contact validation schemas
 */
const contactValidationSchemas: IResourceValidationSchema[] = [
	{
		resource: 'contact',
		operation: 'create',
		rules: [
			{ field: 'name', type: 'required', message: 'Contact name is required' },
			{ field: 'name', type: 'string', minLength: 1, maxLength: 255 },
			{ field: 'email', type: 'email', message: 'Please provide a valid email address' },
			{ field: 'phone', type: 'custom', validator: (value) => !value || GermanBusinessValidator.validatePhoneNumber(value), message: 'Please provide a valid German phone number' },
			{ field: 'vatNumber', type: 'custom', validator: (value) => !value || GermanBusinessValidator.validateVATNumber(value), message: 'Please provide a valid German VAT number (DE + 9 digits)' },
			{ field: 'zip', type: 'custom', validator: (value) => !value || GermanBusinessValidator.validatePostalCode(value), message: 'Please provide a valid German postal code (5 digits)' },
			{ field: 'customerNumber', type: 'string', maxLength: 50 },
			{ field: 'description', type: 'string', maxLength: 1000 },
		],
	},
	{
		resource: 'contact',
		operation: 'update',
		rules: [
			{ field: 'name', type: 'string', minLength: 1, maxLength: 255 },
			{ field: 'email', type: 'email', message: 'Please provide a valid email address' },
			{ field: 'phone', type: 'custom', validator: (value) => !value || GermanBusinessValidator.validatePhoneNumber(value), message: 'Please provide a valid German phone number' },
			{ field: 'vatNumber', type: 'custom', validator: (value) => !value || GermanBusinessValidator.validateVATNumber(value), message: 'Please provide a valid German VAT number (DE + 9 digits)' },
			{ field: 'zip', type: 'custom', validator: (value) => !value || GermanBusinessValidator.validatePostalCode(value), message: 'Please provide a valid German postal code (5 digits)' },
			{ field: 'customerNumber', type: 'string', maxLength: 50 },
			{ field: 'description', type: 'string', maxLength: 1000 },
		],
	},
];

/**
 * Invoice validation schemas
 */
const invoiceValidationSchemas: IResourceValidationSchema[] = [
	{
		resource: 'invoice',
		operation: 'create',
		rules: [
			{ field: 'contact', type: 'required', message: 'Contact is required for invoice creation' },
			{ field: 'contact.id', type: 'required', message: 'Contact ID is required' },
			{ field: 'contact.objectName', type: 'required', message: 'Contact object name is required' },
			{ field: 'invoiceNumber', type: 'string', maxLength: 50 },
			{ field: 'invoiceDate', type: 'date', message: 'Please provide a valid invoice date' },
			{ field: 'deliveryDate', type: 'date', message: 'Please provide a valid delivery date' },
			{ field: 'status', type: 'allowedValues', allowedValues: ['50', '100', '200', '1000'], message: 'Invalid invoice status' },
			{ field: 'invoiceType', type: 'allowedValues', allowedValues: ['RE', 'WKV', 'SR', 'MA', 'TR', 'ER'], message: 'Invalid invoice type' },
			{ field: 'currency', type: 'string', pattern: /^[A-Z]{3}$/, message: 'Currency must be a 3-letter ISO code (e.g., EUR)' },
			{ field: 'taxRate', type: 'number', min: 0, max: 100, message: 'Tax rate must be between 0 and 100' },
			{ field: 'taxRule', type: 'allowedValues', allowedValues: [1, 2, 3, 4, 5, 11, 17, 18, 19, 20, 21], message: 'Invalid tax rule - must be one of: 1 (Standard), 2 (Exports), 3 (EU deliveries), 4 (Tax-free §4), 5 (Reverse Charge §13b), 11 (Small business §19), 17 (Non-domestic), 18-20 (One Stop Shop), 21 (Reverse Charge §18b)' },
			{ field: 'taxText', type: 'string', maxLength: 255 },
			{ field: 'discount', type: 'number', min: 0, message: 'Discount cannot be negative' },
		],
	},
	{
		resource: 'invoice',
		operation: 'update',
		rules: [
			{ field: 'invoiceNumber', type: 'string', maxLength: 50 },
			{ field: 'invoiceDate', type: 'date', message: 'Please provide a valid invoice date' },
			{ field: 'deliveryDate', type: 'date', message: 'Please provide a valid delivery date' },
			{ field: 'status', type: 'allowedValues', allowedValues: ['50', '100', '200', '1000'], message: 'Invalid invoice status' },
			{ field: 'currency', type: 'string', pattern: /^[A-Z]{3}$/, message: 'Currency must be a 3-letter ISO code (e.g., EUR)' },
			{ field: 'taxRate', type: 'number', min: 0, max: 100, message: 'Tax rate must be between 0 and 100' },
			{ field: 'taxRule', type: 'allowedValues', allowedValues: [1, 2, 3, 4, 5, 11, 17, 18, 19, 20, 21], message: 'Invalid tax rule - must be one of: 1 (Standard), 2 (Exports), 3 (EU deliveries), 4 (Tax-free §4), 5 (Reverse Charge §13b), 11 (Small business §19), 17 (Non-domestic), 18-20 (One Stop Shop), 21 (Reverse Charge §18b)' },
			{ field: 'taxText', type: 'string', maxLength: 255 },
			{ field: 'discount', type: 'number', min: 0, message: 'Discount cannot be negative' },
		],
	},
	{
		resource: 'invoice',
		operation: 'sendByEmail',
		rules: [
			{ field: 'invoiceId', type: 'required', message: 'Invoice ID is required' },
			{ field: 'sendType', type: 'allowedValues', allowedValues: ['VPR', 'VP', 'VER', 'ER'], message: 'Invalid send type' },
		],
	},
	{
		resource: 'invoice',
		operation: 'bookAmount',
		rules: [
			{ field: 'invoiceId', type: 'required', message: 'Invoice ID is required' },
			{ field: 'amount', type: 'required', message: 'Amount is required' },
			{ field: 'amount', type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
			{ field: 'date', type: 'required', message: 'Date is required' },
			{ field: 'date', type: 'date', message: 'Please provide a valid date' },
		],
	},
];

/**
 * Voucher validation schemas
 */
const voucherValidationSchemas: IResourceValidationSchema[] = [
	{
		resource: 'voucher',
		operation: 'create',
		rules: [
			{ field: 'voucherDate', type: 'required', message: 'Voucher date is required' },
			{ field: 'voucherDate', type: 'date', message: 'Please provide a valid voucher date' },
			{ field: 'supplier', type: 'object', message: 'Supplier must be an object' },
			{ field: 'supplier.id', type: 'required', message: 'Supplier ID is required' },
			{ field: 'supplier.objectName', type: 'required', message: 'Supplier object name is required' },
			{ field: 'description', type: 'string', maxLength: 1000 },
			{ field: 'payDate', type: 'date', message: 'Please provide a valid pay date' },
			{ field: 'status', type: 'allowedValues', allowedValues: ['50', '100', '1000'], message: 'Invalid voucher status' },
			{ field: 'taxRule', type: 'allowedValues', allowedValues: [8, 9, 10, 12, 13, 14], message: 'Invalid tax rule - must be one of: 8 (Innergemeinschaftliche Erwerbe), 9 (Vorsteuerabziehbare Aufwendungen), 10 (Nicht vorsteuerabziehbare Aufwendungen), 12-14 (Reverse Charge variants)' },
			{ field: 'taxType', type: 'allowedValues', allowedValues: ['default', 'eu', 'noteu', 'custom'], message: 'Invalid tax type (DEPRECATED - use taxRule instead)' },
			{ field: 'currency', type: 'string', pattern: /^[A-Z]{3}$/, message: 'Currency must be a 3-letter ISO code (e.g., EUR)' },
		],
	},
	{
		resource: 'voucher',
		operation: 'update',
		rules: [
			{ field: 'voucherDate', type: 'date', message: 'Please provide a valid voucher date' },
			{ field: 'description', type: 'string', maxLength: 1000 },
			{ field: 'payDate', type: 'date', message: 'Please provide a valid pay date' },
			{ field: 'status', type: 'allowedValues', allowedValues: ['50', '100', '1000'], message: 'Invalid voucher status' },
			{ field: 'taxRule', type: 'allowedValues', allowedValues: [8, 9, 10, 12, 13, 14], message: 'Invalid tax rule - must be one of: 8 (Innergemeinschaftliche Erwerbe), 9 (Vorsteuerabziehbare Aufwendungen), 10 (Nicht vorsteuerabziehbare Aufwendungen), 12-14 (Reverse Charge variants)' },
			{ field: 'taxType', type: 'allowedValues', allowedValues: ['default', 'eu', 'noteu', 'custom'], message: 'Invalid tax type (DEPRECATED - use taxRule instead)' },
			{ field: 'currency', type: 'string', pattern: /^[A-Z]{3}$/, message: 'Currency must be a 3-letter ISO code (e.g., EUR)' },
		],
	},
	{
		resource: 'voucher',
		operation: 'bookVoucher',
		rules: [
			{ field: 'voucherId', type: 'required', message: 'Voucher ID is required' },
			{ field: 'amount', type: 'required', message: 'Amount is required' },
			{ field: 'amount', type: 'number', min: 0.01, message: 'Amount must be greater than 0' },
			{ field: 'date', type: 'required', message: 'Date is required' },
			{ field: 'date', type: 'date', message: 'Please provide a valid date' },
		],
	},
];

/**
 * Order validation schemas
 */
const orderValidationSchemas: IResourceValidationSchema[] = [
	{
		resource: 'order',
		operation: 'create',
		rules: [
			{ field: 'contact', type: 'required', message: 'Contact is required for order creation' },
			{ field: 'contact.id', type: 'required', message: 'Contact ID is required' },
			{ field: 'contact.objectName', type: 'required', message: 'Contact object name is required' },
			{ field: 'orderNumber', type: 'string', maxLength: 50 },
			{ field: 'orderDate', type: 'date', message: 'Please provide a valid order date' },
			{ field: 'deliveryDate', type: 'date', message: 'Please provide a valid delivery date' },
			{ field: 'status', type: 'allowedValues', allowedValues: ['50', '100', '200', '300', '1000'], message: 'Invalid order status' },
			{ field: 'orderType', type: 'allowedValues', allowedValues: ['AN', 'AB', 'LI'], message: 'Invalid order type' },
			{ field: 'currency', type: 'string', pattern: /^[A-Z]{3}$/, message: 'Currency must be a 3-letter ISO code (e.g., EUR)' },
			{ field: 'taxRate', type: 'number', min: 0, max: 100, message: 'Tax rate must be between 0 and 100' },
			{ field: 'taxRule', type: 'allowedValues', allowedValues: [1, 2, 3, 4, 5, 11, 17, 18, 19, 20, 21], message: 'Invalid tax rule - must be one of: 1 (Standard), 2 (Exports), 3 (EU deliveries), 4 (Tax-free §4), 5 (Reverse Charge §13b), 11 (Small business §19), 17 (Non-domestic), 18-20 (One Stop Shop), 21 (Reverse Charge §18b)' },
			{ field: 'discount', type: 'number', min: 0, message: 'Discount cannot be negative' },
		],
	},
	{
		resource: 'order',
		operation: 'update',
		rules: [
			{ field: 'orderNumber', type: 'string', maxLength: 50 },
			{ field: 'orderDate', type: 'date', message: 'Please provide a valid order date' },
			{ field: 'deliveryDate', type: 'date', message: 'Please provide a valid delivery date' },
			{ field: 'status', type: 'allowedValues', allowedValues: ['50', '100', '200', '300', '1000'], message: 'Invalid order status' },
			{ field: 'currency', type: 'string', pattern: /^[A-Z]{3}$/, message: 'Currency must be a 3-letter ISO code (e.g., EUR)' },
			{ field: 'taxRate', type: 'number', min: 0, max: 100, message: 'Tax rate must be between 0 and 100' },
			{ field: 'taxRule', type: 'allowedValues', allowedValues: [1, 2, 3, 4, 5, 11, 17, 18, 19, 20, 21], message: 'Invalid tax rule - must be one of: 1 (Standard), 2 (Exports), 3 (EU deliveries), 4 (Tax-free §4), 5 (Reverse Charge §13b), 11 (Small business §19), 17 (Non-domestic), 18-20 (One Stop Shop), 21 (Reverse Charge §18b)' },
			{ field: 'discount', type: 'number', min: 0, message: 'Discount cannot be negative' },
		],
	},
	{
		resource: 'order',
		operation: 'sendByEmail',
		rules: [
			{ field: 'orderId', type: 'required', message: 'Order ID is required' },
			{ field: 'sendType', type: 'allowedValues', allowedValues: ['VPR', 'VP', 'VER', 'ER'], message: 'Invalid send type' },
		],
	},
	{
		resource: 'order',
		operation: 'createInvoiceFromOrder',
		rules: [
			{ field: 'orderId', type: 'required', message: 'Order ID is required' },
			{ field: 'invoiceDate', type: 'required', message: 'Invoice date is required' },
			{ field: 'invoiceDate', type: 'date', message: 'Please provide a valid invoice date' },
		],
	},
];

/**
 * Initialize all validation schemas
 */
export function initializeValidationSchemas(): void {
	// Register contact schemas
	contactValidationSchemas.forEach(schema => {
		ResourceValidator.registerSchema(schema);
	});

	// Register invoice schemas
	invoiceValidationSchemas.forEach(schema => {
		ResourceValidator.registerSchema(schema);
	});

	// Register voucher schemas
	voucherValidationSchemas.forEach(schema => {
		ResourceValidator.registerSchema(schema);
	});

	// Register order schemas
	orderValidationSchemas.forEach(schema => {
		ResourceValidator.registerSchema(schema);
	});

	console.log('SevDesk validation schemas initialized successfully');
}

/**
 * Export individual schema arrays for testing or custom usage
 */
export {
	contactValidationSchemas,
	invoiceValidationSchemas,
	voucherValidationSchemas,
	orderValidationSchemas,
};
