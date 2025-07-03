import { INodeProperties } from "n8n-workflow";

export const layoutOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["layout"],
			},
		},
		options: [
			{
				name: "Get Letterpapers",
				value: "getLetterpapers",
				action: "Get all letterpapers",
				routing: {
					request: {
						method: "GET",
						url: "/DocServer/getLetterpapersWithThumb",
					},
					output: {
						postReceive: [
							{
								type: "rootProperty",
								properties: {
									property: "objects.letterpapers",
								},
							},
						],
					},
				},
			},
			{
				name: "Get Templates",
				value: "getTemplates",
				action: "Get all templates",
				routing: {
					request: {
						method: "GET",
						url: "/DocServer/getTemplatesWithThumb",
					},
					output: {
						postReceive: [
							{
								type: "rootProperty",
								properties: {
									property: "objects.templates",
								},
							},
						],
					},
				},
			},
			{
				name: "Update Document Layout",
				value: "update",
				action: "Update a document layout",
				routing: {
					request: {
						method: "PUT",
						url: "=/{{$parameter.documentType}}/{{$parameter.documentId}}/changeParameter",
						body: {
							key: "={{$parameter.key}}",
							value: "={{$parameter.value}}",
						},
					},
				},
			},
		],
		default: "getLetterpapers",
	},
];

export const layoutFields: INodeProperties[] = [
	{
		displayName: "Template Type",
		name: "templateType",
		type: "options",
		options: [
			{
				name: "Contract",
				value: "Contract",
			},
			{
				name: "Credit Note",
				value: "Creditnote",
			},
			{
				name: "Invoice",
				value: "Invoice",
			},
			{
				name: "Invoice Correction",
				value: "Invoicecorrection",
			},
			{
				name: "Letter",
				value: "Letter",
			},
			{
				name: "Order",
				value: "Order",
			},
			{
				name: "Packing List",
				value: "PackingList",
			},
		],
		required: true,
		default: "Invoice",
		displayOptions: {
			show: {
				resource: ["layout"],
				operation: ["getTemplates"],
			},
		},
		routing: {
			send: {
				type: "query",
				property: "type",
				value: "={{$value}}",
			},
		},
	},
	{
		displayName: "Document Type",
		name: "documentType",
		type: "options",
		options: [
			{
				name: "Invoice",
				value: "Invoice",
			},
			{
				name: "Order",
				value: "Order",
			},
			{
				name: "Credit Note",
				value: "CreditNote",
			},
		],
		required: true,
		default: "Invoice",
		displayOptions: {
			show: {
				resource: ["layout"],
				operation: ["update"],
			},
		},
	},
	{
		displayName: "Document ID",
		name: "documentId",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["layout"],
				operation: ["update"],
			},
		},
	},
	{
		displayName: "Key",
		name: "key",
		type: "options",
		options: [
			{
				name: "Template",
				value: "template",
			},
			{
				name: "Letterpaper",
				value: "letterpaper",
			},
			{
				name: "Language",
				value: "language",
			},
			{
				name: "PayPal",
				value: "payPal",
			},
		],
		required: true,
		default: "template",
		displayOptions: {
			show: {
				resource: ["layout"],
				operation: ["update"],
			},
		},
	},
	{
		displayName: "Value",
		name: "value",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["layout"],
				operation: ["update"],
			},
		},
	},
];
