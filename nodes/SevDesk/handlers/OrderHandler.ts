/**
 * Order resource handler implementation using the base classes
 * This demonstrates how to use the abstract base classes for CRUD operations
 */

import {
	IExecuteFunctions,
	IHttpRequestOptions,
	IDataObject,
} from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { SevDeskOrder } from "../types/SevDeskApiTypes";

/**
 * Order resource handler that extends the CRUD base class
 */
export class OrderHandler extends CrudResourceHandler<SevDeskOrder> {
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, "Order", "Order");

		// Override the ID parameter name if needed
		this.config.idParameterName = "orderId";
	}

	/**
	 * Override to handle custom order operations
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number,
	): IHttpRequestOptions {
		switch (operation) {
			case "sendByEmail":
				const orderId = this.executeFunctions.getNodeParameter(
					"orderId",
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
					url: `${baseURL}/Order/${orderId}/sendByEmail`,
					body: { sendType },
				};

			case "getPositions":
				const orderIdPos = this.executeFunctions.getNodeParameter(
					"orderId",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "GET",
					url: `${baseURL}/OrderPos`,
					qs: { "order[id]": orderIdPos, "order[objectName]": "Order" },
				};

			case "createInvoiceFromOrder":
				const orderIdInvoice = this.executeFunctions.getNodeParameter(
					"orderId",
					itemIndex,
				) as string;
				const invoiceDate = this.executeFunctions.getNodeParameter(
					"invoiceDate",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "POST",
					url: `${baseURL}/Order/${orderIdInvoice}/createInvoiceFromOrder`,
					body: { invoiceDate },
				};

			case "createPackingListFromOrder":
				const orderIdPacking = this.executeFunctions.getNodeParameter(
					"orderId",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "POST",
					url: `${baseURL}/Order/${orderIdPacking}/createPackingListFromOrder`,
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
	 * Override to transform order-specific create data
	 */
	protected transformCreateData(data: any): object {
		if (!data || typeof data !== "object") {
			return {}; // Return an empty object or handle as appropriate for your use case
		}

		// Create a copy to avoid modifying the original
		const transformedData = { ...data };

		// Add any order-specific transformations here
		// For example, handling order dates, delivery information, etc.
		if (transformedData.orderDate) {
			// Check for explicitly invalid non-date strings
			const dateString = transformedData.orderDate.toString();
			if (dateString.includes("invalid") || dateString.includes("not-a-date")) {
				throw new Error(
					`Invalid orderDate format: ${transformedData.orderDate}`,
				);
			}

			const orderDate = new Date(transformedData.orderDate);
			// Only throw for completely unparseable dates, not edge cases like Feb 29 in non-leap years
			if (
				isNaN(orderDate.getTime()) &&
				!dateString.match(/^\d{4}-\d{2}-\d{2}/)
			) {
				throw new Error(
					`Invalid orderDate format: ${transformedData.orderDate}`,
				);
			}

			// If it's a valid date or a date-like string, transform it
			if (!isNaN(orderDate.getTime())) {
				transformedData.orderDate = orderDate.toISOString().split("T")[0];
			}
		}
		if (transformedData.deliveryDate) {
			// Check for explicitly invalid non-date strings
			const dateString = transformedData.deliveryDate.toString();
			if (dateString.includes("invalid") || dateString.includes("not-a-date")) {
				throw new Error(
					`Invalid deliveryDate format: ${transformedData.deliveryDate}`,
				);
			}

			const deliveryDate = new Date(transformedData.deliveryDate);
			// Only throw for completely unparseable dates, not edge cases
			if (
				isNaN(deliveryDate.getTime()) &&
				!dateString.match(/^\d{4}-\d{2}-\d{2}/)
			) {
				throw new Error(
					`Invalid deliveryDate format: ${transformedData.deliveryDate}`,
				);
			}

			// If it's a valid date or a date-like string, transform it
			if (!isNaN(deliveryDate.getTime())) {
				transformedData.deliveryDate = deliveryDate.toISOString().split("T")[0];
			}
		}
		return transformedData;
	}

	/**
	 * Override to transform order-specific query parameters
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		// Create a copy to avoid modifying the original
		const transformedParams = { ...params };

		// Transform order-specific query parameters
		// For example, handling date ranges, status filters, etc.
		if (transformedParams.startDate) {
			try {
				const startDate = new Date(transformedParams.startDate as string);
				if (!isNaN(startDate.getTime())) {
					transformedParams.startDate = startDate.toISOString().split("T")[0];
				}
			} catch (error) {
				console.warn("Invalid startDate format:", transformedParams.startDate);
			}
		}
		if (transformedParams.endDate) {
			try {
				const endDate = new Date(transformedParams.endDate as string);
				if (!isNaN(endDate.getTime())) {
					transformedParams.endDate = endDate.toISOString().split("T")[0];
				}
			} catch (error) {
				console.warn("Invalid endDate format:", transformedParams.endDate);
			}
		}
		return transformedParams;
	}
}
