/**
 * Order resource handler implementation using the base classes
 * This demonstrates how to use the abstract base classes for CRUD operations
 */

import { IExecuteFunctions, IHttpRequestOptions, IDataObject } from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { SevDeskOrder } from "../types/SevDeskApiTypes";

/**
 * Order resource handler that extends the CRUD base class
 */
export class OrderHandler extends CrudResourceHandler<SevDeskOrder> {
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, 'Order', 'Order');

		// Override the ID parameter name if needed
		this.config.idParameterName = 'orderId';
	}

	/**
	 * Override to handle custom order operations
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number
	): IHttpRequestOptions {
		switch (operation) {
			case 'sendByEmail':
				const orderId = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				const sendType = this.executeFunctions.getNodeParameter('sendType', itemIndex, 'VPR') as string;
				return {
					...baseOptions,
					method: 'PUT',
					url: `${baseURL}/Order/${orderId}/sendByEmail`,
					body: { sendType },
				};

			case 'getPositions':
				const orderIdPos = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				return {
					...baseOptions,
					method: 'GET',
					url: `${baseURL}/OrderPos`,
					qs: { 'order[id]': orderIdPos, 'order[objectName]': 'Order' },
				};

			case 'createInvoiceFromOrder':
				const orderIdInvoice = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				const invoiceDate = this.executeFunctions.getNodeParameter('invoiceDate', itemIndex) as string;
				return {
					...baseOptions,
					method: 'POST',
					url: `${baseURL}/Order/${orderIdInvoice}/createInvoiceFromOrder`,
					body: { invoiceDate },
				};

			case 'createPackingListFromOrder':
				const orderIdPacking = this.executeFunctions.getNodeParameter('orderId', itemIndex) as string;
				return {
					...baseOptions,
					method: 'POST',
					url: `${baseURL}/Order/${orderIdPacking}/createPackingListFromOrder`,
				};

			default:
				return super.buildCustomRequest(baseOptions, baseURL, operation, itemIndex);
		}
	}

	/**
	 * Override to transform order-specific create data
	 */
	protected transformCreateData(data: any): object {
		// Add any order-specific transformations here
		// For example, handling order dates, delivery information, etc.
		if (data.orderDate) {
			data.orderDate = new Date(data.orderDate).toISOString().split('T')[0];
		}
		if (data.deliveryDate) {
			data.deliveryDate = new Date(data.deliveryDate).toISOString().split('T')[0];
		}
		return data;
	}

	/**
	 * Override to transform order-specific query parameters
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		// Transform order-specific query parameters
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
