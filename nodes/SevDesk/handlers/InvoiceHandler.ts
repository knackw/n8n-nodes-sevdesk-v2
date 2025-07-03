/**
 * Invoice resource handler implementation using the base classes
 * This demonstrates how to use the abstract base classes for CRUD operations
 */

import { IExecuteFunctions, IHttpRequestOptions, IDataObject } from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { SevDeskInvoice } from "../types/SevDeskApiTypes";

/**
 * Invoice resource handler that extends the CRUD base class
 */
export class InvoiceHandler extends CrudResourceHandler<SevDeskInvoice> {
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, 'Invoice', 'Invoice');

		// Override the ID parameter name if needed
		this.config.idParameterName = 'invoiceId';
	}

	/**
	 * Override to handle custom invoice operations
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number
	): IHttpRequestOptions {
		switch (operation) {
			case 'sendByEmail':
				const invoiceId = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				const sendType = this.executeFunctions.getNodeParameter('sendType', itemIndex, 'VPR') as string;
				return {
					...baseOptions,
					method: 'PUT',
					url: `${baseURL}/Invoice/${invoiceId}/sendByEmail`,
					body: { sendType },
				};

			case 'bookAmount':
				const invoiceIdBook = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				const amount = this.executeFunctions.getNodeParameter('amount', itemIndex) as number;
				const date = this.executeFunctions.getNodeParameter('date', itemIndex) as string;
				return {
					...baseOptions,
					method: 'PUT',
					url: `${baseURL}/Invoice/${invoiceIdBook}/bookAmount`,
					body: { amount, date },
				};

			case 'cancelInvoice':
				const invoiceIdCancel = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				return {
					...baseOptions,
					method: 'PUT',
					url: `${baseURL}/Invoice/${invoiceIdCancel}/cancelInvoice`,
				};

			case 'getPositions':
				const invoiceIdPos = this.executeFunctions.getNodeParameter('invoiceId', itemIndex) as string;
				return {
					...baseOptions,
					method: 'GET',
					url: `${baseURL}/InvoicePos`,
					qs: { 'invoice[id]': invoiceIdPos, 'invoice[objectName]': 'Invoice' },
				};

			default:
				return super.buildCustomRequest(baseOptions, baseURL, operation, itemIndex);
		}
	}

	/**
	 * Override to transform invoice-specific create data
	 */
	protected transformCreateData(data: any): object {
		// Add any invoice-specific transformations here
		// For example, handling invoice positions, tax calculations, etc.
		if (data.invoiceDate) {
			data.invoiceDate = new Date(data.invoiceDate).toISOString().split('T')[0];
		}
		if (data.deliveryDate) {
			data.deliveryDate = new Date(data.deliveryDate).toISOString().split('T')[0];
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
			params.startDate = new Date(params.startDate as string).toISOString().split('T')[0];
		}
		if (params.endDate) {
			params.endDate = new Date(params.endDate as string).toISOString().split('T')[0];
		}
		return params;
	}
}
