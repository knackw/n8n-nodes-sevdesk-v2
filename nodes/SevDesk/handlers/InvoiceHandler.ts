/**
 * Invoice resource handler implementation using the base classes
 * This demonstrates how to use the abstract base classes for CRUD operations
 */

import {
	IExecuteFunctions,
	IHttpRequestOptions,
	IDataObject,
} from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { SevDeskInvoice } from "../types/SevDeskApiTypes";

/**
 * Invoice Resource Handler for SevDesk API
 *
 * Handles all invoice-related operations including creation, management, and processing.
 * Extends the base CRUD functionality with invoice-specific operations like email sending,
 * payment booking, cancellation, and position management. Includes automatic date
 * transformation for proper API compatibility.
 *
 * @class InvoiceHandler
 * @extends {CrudResourceHandler<SevDeskInvoice>}
 *
 * @example
 * // Create a new invoice
 * const invoiceHandler = new InvoiceHandler(executeFunctions);
 * const result = await invoiceHandler.execute('create', 0);
 *
 * @example
 * // Send invoice by email
 * const result = await invoiceHandler.execute('sendByEmail', 0);
 *
 * @example
 * // Book payment for invoice
 * const result = await invoiceHandler.execute('bookAmount', 0);
 *
 * @see {@link https://api.sevdesk.de/#tag/Invoice} SevDesk Invoice API Documentation
 * @see {@link CrudResourceHandler} Base CRUD handler implementation
 *
 * @author n8n-nodes-sevdesk-v2
 * @version 1.0.0
 * @since 2025-01-01
 */
export class InvoiceHandler extends CrudResourceHandler<SevDeskInvoice> {
	/**
	 * Initialize the Invoice Handler
	 *
	 * Sets up the handler with the appropriate resource name, API endpoint,
	 * and configures invoice-specific parameters like the ID parameter name.
	 *
	 * @constructor
	 * @param {IExecuteFunctions} executeFunctions - The n8n execution context
	 *
	 * @example
	 * const invoiceHandler = new InvoiceHandler(this);
	 */
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, "Invoice", "Invoice");

		// Override the ID parameter name if needed
		this.config.idParameterName = "invoiceId";
	}

	/**
	 * Build custom HTTP requests for invoice-specific operations
	 *
	 * Handles special invoice operations that don't follow the standard CRUD pattern,
	 * including email sending, payment booking, invoice cancellation, and position retrieval.
	 * Each operation has specific parameter requirements and API endpoints.
	 *
	 * @protected
	 * @method buildCustomRequest
	 * @param {IHttpRequestOptions} baseOptions - Base HTTP request configuration
	 * @param {string} baseURL - The SevDesk API base URL
	 * @param {string} operation - The operation to perform (sendByEmail, bookAmount, cancelInvoice, getPositions)
	 * @param {number} itemIndex - Index of the current input item being processed
	 *
	 * @returns {IHttpRequestOptions} Configured HTTP request options for the operation
	 *
	 * @throws {Error} When required parameters are missing for custom operations
	 *
	 * @example
	 * // Send invoice by email
	 * const request = buildCustomRequest(baseOptions, baseURL, 'sendByEmail', 0);
	 * // Results in PUT /Invoice/{id}/sendByEmail with sendType parameter
	 *
	 * @example
	 * // Book payment amount
	 * const request = buildCustomRequest(baseOptions, baseURL, 'bookAmount', 0);
	 * // Results in PUT /Invoice/{id}/bookAmount with amount and date
	 *
	 * @example
	 * // Cancel invoice
	 * const request = buildCustomRequest(baseOptions, baseURL, 'cancelInvoice', 0);
	 * // Results in PUT /Invoice/{id}/cancelInvoice
	 *
	 * @example
	 * // Get invoice positions
	 * const request = buildCustomRequest(baseOptions, baseURL, 'getPositions', 0);
	 * // Results in GET /InvoicePos with invoice filter
	 *
	 * @see {@link https://api.sevdesk.de/#operation/sendInvoiceByEmail} Send Invoice Email API
	 * @see {@link https://api.sevdesk.de/#operation/bookInvoice} Book Invoice API
	 * @see {@link https://api.sevdesk.de/#operation/cancelInvoice} Cancel Invoice API
	 * @see {@link https://api.sevdesk.de/#operation/getInvoicePositions} Get Invoice Positions API
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number,
	): IHttpRequestOptions {
		switch (operation) {
			case "sendByEmail":
				const invoiceId = this.executeFunctions.getNodeParameter(
					"invoiceId",
					itemIndex,
				) as string;
				const sendType = this.executeFunctions.getNodeParameter(
					"sendType",
					itemIndex,
					"VPR",
				) as string;
				return {
					...baseOptions,
					method: "PUT",
					url: `${baseURL}/Invoice/${invoiceId}/sendByEmail`,
					body: { sendType },
				};

			case "bookAmount":
				const invoiceIdBook = this.executeFunctions.getNodeParameter(
					"invoiceId",
					itemIndex,
				) as string;
				const amount = this.executeFunctions.getNodeParameter(
					"amount",
					itemIndex,
				) as number;
				const date = this.executeFunctions.getNodeParameter(
					"date",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "PUT",
					url: `${baseURL}/Invoice/${invoiceIdBook}/bookAmount`,
					body: { amount, date },
				};

			case "cancelInvoice":
				const invoiceIdCancel = this.executeFunctions.getNodeParameter(
					"invoiceId",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "PUT",
					url: `${baseURL}/Invoice/${invoiceIdCancel}/cancelInvoice`,
				};

			case "getPositions":
				const invoiceIdPos = this.executeFunctions.getNodeParameter(
					"invoiceId",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "GET",
					url: `${baseURL}/InvoicePos`,
					qs: { "invoice[id]": invoiceIdPos, "invoice[objectName]": "Invoice" },
				};

			default:
				return super.buildCustomRequest(
					baseOptions,
					baseURL,
					operation,
					itemIndex,
				);
		}
	}

	/**
	 * Override to transform invoice-specific create data
	 */
	protected transformCreateData(data: any): object {
		if (!data || typeof data !== "object") {
			return {}; // Return an empty object or handle as appropriate for your use case
		}
		// Add any invoice-specific transformations here
		// For example, handling invoice positions, tax calculations, etc.
		if (data.invoiceDate) {
			data.invoiceDate = new Date(data.invoiceDate).toISOString().split("T")[0];
		}
		if (data.deliveryDate) {
			data.deliveryDate = new Date(data.deliveryDate)
				.toISOString()
				.split("T")[0];
		}
		return data;
	}

	/**
	 * Override to transform invoice-specific query parameters
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		// Transform invoice-specific query parameters
		// For example, handling date ranges, status filters, etc.
		if (params.startDate) {
			params.startDate = new Date(params.startDate as string)
				.toISOString()
				.split("T")[0];
		}
		if (params.endDate) {
			params.endDate = new Date(params.endDate as string)
				.toISOString()
				.split("T")[0];
		}
		return params;
	}
}
