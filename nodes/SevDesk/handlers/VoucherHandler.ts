/**
 * Voucher resource handler implementation using the base classes
 * This demonstrates how to use the abstract base classes for CRUD operations
 */

import { IExecuteFunctions, IHttpRequestOptions, IDataObject } from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { SevDeskVoucher } from "../types/SevDeskApiTypes";

/**
 * Voucher resource handler that extends the CRUD base class
 */
export class VoucherHandler extends CrudResourceHandler<SevDeskVoucher> {
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, 'Voucher', 'Voucher');

		// Override the ID parameter name if needed
		this.config.idParameterName = 'voucherId';
	}

	/**
	 * Override to handle custom voucher operations
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number
	): IHttpRequestOptions {
		switch (operation) {
			case 'uploadFile':
				const voucherId = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				const filename = this.executeFunctions.getNodeParameter('filename', itemIndex) as string;
				return {
					...baseOptions,
					method: 'POST',
					url: `${baseURL}/Voucher/${voucherId}/uploadFile`,
					body: { filename },
				};

			case 'bookVoucher':
				const voucherIdBook = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				const amount = this.executeFunctions.getNodeParameter('amount', itemIndex) as number;
				const date = this.executeFunctions.getNodeParameter('date', itemIndex) as string;
				return {
					...baseOptions,
					method: 'PUT',
					url: `${baseURL}/Voucher/${voucherIdBook}/bookVoucher`,
					body: { amount, date },
				};

			case 'getPositions':
				const voucherIdPos = this.executeFunctions.getNodeParameter('voucherId', itemIndex) as string;
				return {
					...baseOptions,
					method: 'GET',
					url: `${baseURL}/VoucherPos`,
					qs: { 'voucher[id]': voucherIdPos, 'voucher[objectName]': 'Voucher' },
				};

			case 'getAccountingTypes':
				return {
					...baseOptions,
					method: 'GET',
					url: `${baseURL}/AccountingType`,
				};

			default:
				return super.buildCustomRequest(baseOptions, baseURL, operation, itemIndex);
		}
	}

	/**
	 * Override to transform voucher-specific create data
	 */
	protected transformCreateData(data: any): object {
		// Add any voucher-specific transformations here
		// For example, handling voucher dates, document references, etc.
		if (data.voucherDate) {
			data.voucherDate = new Date(data.voucherDate).toISOString().split('T')[0];
		}
		if (data.deliveryDate) {
			data.deliveryDate = new Date(data.deliveryDate).toISOString().split('T')[0];
		}
		return data;
	}

	/**
	 * Override to transform voucher-specific query parameters
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		// Transform voucher-specific query parameters
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
