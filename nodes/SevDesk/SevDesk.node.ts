import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from "n8n-workflow";

import { SevDeskResourceManager } from "./SevDeskResourceManager";
import { ResourceRegistry } from "./ResourceRegistry";
import { initializeValidationSchemas } from "./validation/ValidationSchemas";
import { validateAndWarnEnvironmentConfig } from "./config/EnvironmentConfig";
import {
	accountingContactFields,
	accountingContactOperations,
	categoryFields,
	categoryOperations,
	checkAccountFields,
	checkAccountOperations,
	checkAccountTransactionFields,
	checkAccountTransactionOperations,
	communicationWayFields,
	communicationWayOperations,
	contactAddressFields,
	contactAddressOperations,
	contactCustomFieldFields,
	contactCustomFieldOperations,
	contactCustomFieldSettingFields,
	contactCustomFieldSettingOperations,
	contactFieldFields,
	contactFieldOperations,
	contactFields,
	contactOperations,
	countryFields,
	countryOperations,
	creditNoteFields,
	creditNoteOperations,
	creditNotePosFields,
	creditNotePosOperations,
	exportFields,
	exportOperations,
	invoiceFields,
	invoiceOperations,
	layoutFields,
	layoutOperations,
	orderFields,
	orderOperations,
	orderPoOperations,
	orderPosOperations,
	orderPosFields,
	partFields,
	partOperations,
	reportFields,
	reportOperations,
	tagFields,
	tagOperations,
	tagRelationFields,
	tagRelationOperations,
	unityFields,
	unityOperations,
	voucherFields,
	voucherOperations,
	voucherPoFields,
	voucherPoOperations,
	voucherPosOperations,
	voucherPosFields,
	basicsOperations,
	basicsFields,
	batchOperations,
	batchFields,
} from "./descriptions";

/**
 * SevDesk n8n Node Implementation
 *
 * This node provides integration with the SevDesk v2 API, enabling workflow automation
 * for German accounting processes including invoice management, contact handling,
 * voucher processing, and more.
 *
 * @class SevDesk
 * @implements {INodeType}
 *
 * @example
 * // Basic usage in n8n workflow:
 * // 1. Configure SevDesk API credentials
 * // 2. Select resource (Contact, Invoice, Order, Voucher, etc.)
 * // 3. Choose operation (create, get, list, update, delete, or custom operations)
 * // 4. Configure operation-specific parameters
 *
 * @see {@link https://api.sevdesk.de/} SevDesk API Documentation
 * @see {@link https://docs.n8n.io/} n8n Documentation
 *
 * @author n8n-nodes-sevdesk-v2
 * @version 1.0.0
 * @since 2025-01-01
 */
export class SevDesk implements INodeType {
	/**
	 * Static initialization block to initialize validation schemas
	 *
	 * This block runs when the class is first loaded and sets up all validation
	 * schemas required for SevDesk API operations. It ensures that all resource
	 * validation rules are properly configured before any node execution.
	 *
	 * @static
	 * @throws {Error} When validation schema initialization fails
	 */
	static {
		try {
			initializeValidationSchemas();
		} catch (error) {
			console.error("Failed to initialize SevDesk validation schemas:", error);
		}
	}

	/**
	 * Node type description configuration
	 *
	 * Defines the complete configuration for the SevDesk node including:
	 * - Display properties and metadata
	 * - Input/output configuration
	 * - Credential requirements
	 * - API request defaults
	 * - All available resources and their operations
	 *
	 * @type {INodeTypeDescription}
	 * @readonly
	 */
	description: INodeTypeDescription = {
		displayName: "sevDesk",
		name: "sevDesk",
		group: ["output"],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: "Consume the sevDesk API",
		icon: "file:sevDesk.svg",
		defaults: {
			name: "sevDesk",
		},
		inputs: ["main"] as any,
		outputs: ["main"] as any,
		credentials: [
			{
				name: "sevDeskApi",
				required: true,
			},
		],
		requestDefaults: {
			baseURL: "https://my.sevdesk.de/api/{{$credentials.apiVersion}}/",
			url: "",
			headers: {
				Accept: "application/json",
				"Content-Type": "application/json",
			},
		},
		properties: [
			// Standard resource selection
			{
				displayName: "Resource",
				name: "resource",
				type: "options",
				noDataExpression: true,
				default: "",
				options: ResourceRegistry.getResourceOptions(),
			},
			...contactOperations,
			...contactFields,
			...contactAddressOperations,
			...contactAddressFields,
			...contactCustomFieldOperations,
			...contactCustomFieldFields,
			...contactCustomFieldSettingOperations,
			...contactCustomFieldSettingFields,
			...contactFieldOperations,
			...contactFieldFields,
			...countryOperations,
			...countryFields,
			...categoryOperations,
			...categoryFields,
			...communicationWayOperations,
			...communicationWayFields,
			...accountingContactOperations,
			...accountingContactFields,
			...unityOperations,
			...unityFields,
			...orderOperations,
			...orderFields,
			...orderPosOperations,
			...orderPosFields,
			...orderPoOperations,
			...partOperations,
			...partFields,
			...checkAccountOperations,
			...checkAccountFields,
			...checkAccountTransactionOperations,
			...checkAccountTransactionFields,
			...creditNoteOperations,
			...creditNoteFields,
			...creditNotePosOperations,
			...creditNotePosFields,
			...exportOperations,
			...exportFields,
			...tagOperations,
			...tagFields,
			...tagRelationOperations,
			...tagRelationFields,
			...invoiceOperations,
			...invoiceFields,
			...layoutOperations,
			...layoutFields,
			...reportOperations,
			...reportFields,
			...voucherOperations,
			...voucherFields,
			...voucherPoOperations,
			...voucherPoFields,
			...voucherPosOperations,
			...voucherPosFields,
			...basicsOperations,
			...basicsFields,
			...batchOperations,
			...batchFields,
		],
	};

	/**
	 * Execute the SevDesk node operation
	 *
	 * This method is called by n8n when the node is executed. It processes all input items,
	 * extracts the resource and operation parameters, and delegates the actual API calls
	 * to the SevDeskResourceManager. Each input item is processed independently, allowing
	 * for batch operations while maintaining individual error handling.
	 *
	 * @async
	 * @method execute
	 * @param {IExecuteFunctions} this - The n8n execution context providing access to node parameters, credentials, and utilities
	 *
	 * @returns {Promise<INodeExecutionData[][]>} Array of arrays containing the execution results
	 *   - Each inner array represents the output for one execution
	 *   - Each INodeExecutionData contains the JSON response and optional metadata
	 *
	 * @throws {Error} When API calls fail and continueOnFail is false
	 * @throws {SevDeskAuthenticationError} When API credentials are invalid
	 * @throws {SevDeskValidationError} When input parameters are invalid
	 * @throws {SevDeskRateLimitError} When API rate limits are exceeded
	 *
	 * @example
	 * // Example execution flow:
	 * // 1. Get input data from previous node
	 * // 2. For each input item:
	 * //    - Extract resource (e.g., 'Contact', 'Invoice')
	 * //    - Extract operation (e.g., 'create', 'get', 'list')
	 * //    - Execute via SevDeskResourceManager
	 * //    - Handle errors based on continueOnFail setting
	 * // 3. Return all results as array
	 *
	 * @see {@link SevDeskResourceManager.executeResourceOperation} For resource operation execution
	 * @see {@link IExecuteFunctions} For n8n execution context interface
	 * @see {@link INodeExecutionData} For output data structure
	 */
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		// Validate environment configuration on each execution
		validateAndWarnEnvironmentConfig();

		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resourceManager = new SevDeskResourceManager(this);

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter("resource", i) as string;
				const operation = this.getNodeParameter("operation", i) as string;

				const result = await resourceManager.executeResourceOperation(
					resource,
					operation,
					i,
				);

				if (result) {
					returnData.push(result);
				}
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
