/**
 * Contact resource handler implementation using the base classes
 * This demonstrates how to use the abstract base classes for CRUD operations
 */

import { IExecuteFunctions, IHttpRequestOptions, IDataObject } from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { SevDeskContact } from "../types/SevDeskApiTypes";

/**
 * Contact resource handler that extends the CRUD base class
 */
export class ContactHandler extends CrudResourceHandler<SevDeskContact> {
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, 'Contact', 'Contact');

		// Override the ID parameter name if needed
		this.config.idParameterName = 'contactId';
	}

	/**
	 * Override to handle custom contact operations
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number
	): IHttpRequestOptions {
		switch (operation) {
			case 'checkCustomerNumberAvailability':
				const customerNumber = this.executeFunctions.getNodeParameter('customerNumber', itemIndex) as string;
				return {
					...baseOptions,
					method: 'GET',
					url: `${baseURL}/Contact/Mapper/checkCustomerNumberAvailability`,
					qs: { customerNumber },
				};

			case 'findByCustomFieldValue':
				const customFieldSetting = this.executeFunctions.getNodeParameter('customFieldSetting', itemIndex) as any;
				const value = this.executeFunctions.getNodeParameter('value', itemIndex) as string;
				return {
					...baseOptions,
					method: 'GET',
					url: `${baseURL}/Contact/Factory/findContactByCustomFieldValue`,
					qs: {
						'customFieldSetting[id]': customFieldSetting.id,
						'customFieldSetting[objectName]': customFieldSetting.objectName,
						value,
					},
				};

			default:
				return super.buildCustomRequest(baseOptions, baseURL, operation, itemIndex);
		}
	}

	/**
	 * Override to transform contact-specific create data
	 */
	protected transformCreateData(data: any): object {
		// Add any contact-specific transformations here
		// For example, handling address formatting, contact type validation, etc.
		return data;
	}

	/**
	 * Override to transform contact-specific query parameters
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		// Transform contact-specific query parameters
		// For example, handling contact type filters, address searches, etc.
		return params;
	}
}
