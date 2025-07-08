/**
 * Contact resource handler implementation using the base classes
 * This demonstrates how to use the abstract base classes for CRUD operations
 */

import {
	IExecuteFunctions,
	IHttpRequestOptions,
	IDataObject,
} from "n8n-workflow";
import { CrudResourceHandler } from "../base/BaseResourceHandler";
import { SevDeskContact } from "../types/SevDeskApiTypes";

/**
 * Contact Resource Handler for SevDesk API
 *
 * Handles all contact-related operations including customers, suppliers, and other business contacts.
 * Extends the base CRUD functionality with contact-specific operations like customer number validation
 * and custom field searches.
 *
 * @class ContactHandler
 * @extends {CrudResourceHandler<SevDeskContact>}
 *
 * @example
 * // Create a new contact
 * const contactHandler = new ContactHandler(executeFunctions);
 * const result = await contactHandler.execute('create', 0);
 *
 * @example
 * // Check customer number availability
 * const result = await contactHandler.execute('checkCustomerNumberAvailability', 0);
 *
 * @see {@link https://api.sevdesk.de/#tag/Contact} SevDesk Contact API Documentation
 * @see {@link CrudResourceHandler} Base CRUD handler implementation
 *
 * @author n8n-nodes-sevdesk-v2
 * @version 1.0.0
 * @since 2025-01-01
 */
export class ContactHandler extends CrudResourceHandler<SevDeskContact> {
	/**
	 * Initialize the Contact Handler
	 *
	 * Sets up the handler with the appropriate resource name, API endpoint,
	 * and configures contact-specific parameters like the ID parameter name.
	 *
	 * @constructor
	 * @param {IExecuteFunctions} executeFunctions - The n8n execution context
	 *
	 * @example
	 * const contactHandler = new ContactHandler(this);
	 */
	constructor(executeFunctions: IExecuteFunctions) {
		super(executeFunctions, "Contact", "Contact");

		// Override the ID parameter name if needed
		this.config.idParameterName = "contactId";
	}

	/**
	 * Build custom HTTP requests for contact-specific operations
	 *
	 * Handles special contact operations that don't follow the standard CRUD pattern,
	 * such as checking customer number availability and searching by custom field values.
	 *
	 * @protected
	 * @method buildCustomRequest
	 * @param {IHttpRequestOptions} baseOptions - Base HTTP request configuration
	 * @param {string} baseURL - The SevDesk API base URL
	 * @param {string} operation - The operation to perform
	 * @param {number} itemIndex - Index of the current input item being processed
	 *
	 * @returns {IHttpRequestOptions} Configured HTTP request options for the operation
	 *
	 * @throws {Error} When required parameters are missing for custom operations
	 *
	 * @example
	 * // Check customer number availability
	 * const request = buildCustomRequest(baseOptions, baseURL, 'checkCustomerNumberAvailability', 0);
	 * // Results in GET /Contact/Mapper/checkCustomerNumberAvailability?customerNumber=CUST-001
	 *
	 * @example
	 * // Find contact by custom field value
	 * const request = buildCustomRequest(baseOptions, baseURL, 'findByCustomFieldValue', 0);
	 * // Results in GET /Contact/Factory/findContactByCustomFieldValue with custom field parameters
	 *
	 * @see {@link https://api.sevdesk.de/#operation/checkCustomerNumberAvailability} Customer Number Check API
	 * @see {@link https://api.sevdesk.de/#operation/findContactByCustomFieldValue} Custom Field Search API
	 */
	protected buildCustomRequest(
		baseOptions: IHttpRequestOptions,
		baseURL: string,
		operation: string,
		itemIndex: number,
	): IHttpRequestOptions {
		switch (operation) {
			case "getAll":
				const additionalFields = this.executeFunctions.getNodeParameter(
					"additionalFields",
					itemIndex,
					{},
				) as IDataObject;
				return {
					...baseOptions,
					method: "GET",
					url: `${baseURL}/Contact`,
					qs: this.transformQueryParams(additionalFields),
				};

			case "checkCustomerNumberAvailability":
				const customerNumber = this.executeFunctions.getNodeParameter(
					"customerNumber",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "GET",
					url: `${baseURL}/Contact/Mapper/checkCustomerNumberAvailability`,
					qs: { customerNumber },
				};

			case "findByCustomFieldValue":
				const customFieldSetting = this.executeFunctions.getNodeParameter(
					"customFieldSetting",
					itemIndex,
				) as any;
				const value = this.executeFunctions.getNodeParameter(
					"value",
					itemIndex,
				) as string;
				return {
					...baseOptions,
					method: "GET",
					url: `${baseURL}/Contact/Factory/findContactByCustomFieldValue`,
					qs: {
						"customFieldSetting[id]": customFieldSetting.id,
						"customFieldSetting[objectName]": customFieldSetting.objectName,
						value,
					},
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
	 * Transform contact data before creation
	 *
	 * Applies contact-specific transformations to the input data before sending
	 * it to the SevDesk API. This can include address formatting, contact type
	 * validation, phone number normalization, and other business logic.
	 *
	 * @protected
	 * @method transformCreateData
	 * @param {any} data - Raw contact data from the node input
	 *
	 * @returns {object} Transformed contact data ready for API submission
	 *
	 * @example
	 * // Input data transformation
	 * const rawData = {
	 *   name: "Test Company",
	 *   phone: "+49 123 456789",
	 *   address: { street: "Main St 123", city: "Berlin" }
	 * };
	 * const transformed = transformCreateData(rawData);
	 * // Returns normalized and validated contact data
	 *
	 * @see {@link https://api.sevdesk.de/#operation/createContact} Create Contact API
	 */
	protected transformCreateData(data: any): object {
		// Add any contact-specific transformations here
		// For example, handling address formatting, contact type validation, etc.
		return data;
	}

	/**
	 * Transform query parameters for contact searches
	 *
	 * Applies contact-specific transformations to query parameters used in
	 * list and search operations. This can include contact type filters,
	 * address-based searches, and other contact-specific query logic.
	 *
	 * @protected
	 * @method transformQueryParams
	 * @param {IDataObject} params - Raw query parameters from the node input
	 *
	 * @returns {IDataObject} Transformed query parameters for the API request
	 *
	 * @example
	 * // Query parameter transformation
	 * const rawParams = {
	 *   contactType: "customer",
	 *   city: "Berlin",
	 *   limit: 50
	 * };
	 * const transformed = transformQueryParams(rawParams);
	 * // Returns API-compatible query parameters
	 *
	 * @see {@link https://api.sevdesk.de/#operation/getContacts} Get Contacts API
	 */
	protected transformQueryParams(params: IDataObject): IDataObject {
		// Transform contact-specific query parameters
		// For example, handling contact type filters, address searches, etc.
		return params;
	}
}
