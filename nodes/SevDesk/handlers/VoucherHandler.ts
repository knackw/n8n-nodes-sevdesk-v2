/**
 * Voucher resource handler implementation using the base classes
 * This demonstrates how to use the abstract base classes for CRUD operations
 */

import {
	IExecuteFunctions,
	IHttpRequestOptions,
	IDataObject,
} from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { SevDeskVoucher } from "../types/SevDeskApiTypes";

/**
 * Voucher resource handler that extends the CRUD base class
 */
export class VoucherHandler extends CrudResourceHandler<SevDeskVoucher> {
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, "Voucher", "Voucher");

		// Override the ID parameter name if needed
		this.config.idParameterName = "voucherId";
	}

	/**
	 * Override to handle custom voucher operations
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number,
	): IHttpRequestOptions {
		switch (operation) {
			case "uploadFile":
				const voucherId = this.executeFunctions.getNodeParameter(
					"voucherId",
					itemIndex,
				) as string;
				const filename = this.executeFunctions.getNodeParameter(
					"filename",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "POST",
					url: `${baseURL}/Voucher/${voucherId}/uploadFile`,
					body: { filename },
				};

			case "bookVoucher":
				const voucherIdBook = this.executeFunctions.getNodeParameter(
					"voucherId",
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
					url: `${baseURL}/Voucher/${voucherIdBook}/bookVoucher`,
					body: { amount, date },
				};

			case "getPositions":
				const voucherIdPos = this.executeFunctions.getNodeParameter(
					"voucherId",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "GET",
					url: `${baseURL}/VoucherPos`,
					qs: { "voucher[id]": voucherIdPos, "voucher[objectName]": "Voucher" },
				};

			case "getAccountingTypes":
				return {
					...baseOptions,
					method: "GET",
					url: `${baseURL}/AccountingType`,
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
	 * Transform voucher data before creation
	 */
	protected transformCreateData(data: any): object {
		if (!data) return {};

		// Create a copy to avoid modifying the original
		const transformedData = { ...data };

		// Handle voucher date safely
		if (data.voucherDate) {
			try {
				const date = new Date(data.voucherDate);
				// Check if the date is valid before calling toISOString()
				if (!isNaN(date.getTime())) {
					transformedData.voucherDate = date.toISOString().split("T")[0];
				} else {
					// For invalid dates, remove the field or keep original value
					delete transformedData.voucherDate;
				}
			} catch (error) {
				// If any error occurs during date processing, remove the field
				delete transformedData.voucherDate;
			}
		}

		// Handle delivery date safely
		if (data.deliveryDate) {
			try {
				const date = new Date(data.deliveryDate);
				// Check if the date is valid before calling toISOString()
				if (!isNaN(date.getTime())) {
					transformedData.deliveryDate = date.toISOString().split("T")[0];
				} else {
					// For invalid dates, remove the field or keep original value
					delete transformedData.deliveryDate;
				}
			} catch (error) {
				// If any error occurs during date processing, remove the field
				delete transformedData.deliveryDate;
			}
		}
		return transformedData;
	}

	/**
	 * Override to transform voucher-specific query parameters
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		// Transform voucher-specific query parameters
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
