import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription
} from "n8n-workflow";

import { SevDeskResourceManager } from "./SevDeskResourceManager";
import { ResourceRegistry } from "./ResourceRegistry";
import { initializeValidationSchemas } from "./validation/ValidationSchemas";
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

export class SevDesk implements INodeType {
	// Static initialization block to initialize validation schemas
	static {
		try {
			initializeValidationSchemas();
		} catch (error) {
			console.error('Failed to initialize SevDesk validation schemas:', error);
		}
	}

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
		inputs: ["main"],
		outputs: ["main"],
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

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resourceManager = new SevDeskResourceManager(this);

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

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
