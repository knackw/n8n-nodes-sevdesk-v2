import { INodeProperties } from "n8n-workflow";

export const invoicePosOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["invoicePos"],
			},
		},
		options: [
			{
				name: "Get Many",
				value: "getMany",
				description: "Get many invoice positions",
				action: "Get many invoice positions",
				routing: {
					request: {
						method: "GET",
						url: "/InvoicePos",
						qs: {
							"invoice[id]": "={{$parameter.filters.invoiceId}}",
							"invoice[objectName]":
								'={{$parameter.filters.invoiceId ? \"Invoice\" : undefined}}',
							"part[id]": "={{$parameter.filters.partId}}",
							"part[objectName]":
								'={{$parameter.filters.partId ? \"Part\" : undefined}}',
						},
					},
					output: {
						postReceive: [
							{
								type: "rootProperty",
								properties: {
									property: "objects",
								},
							},
						],
					},
				},
			},
		],
		default: "getMany",
	},
];

export const invoicePosFields: INodeProperties[] = [
	{
		displayName: "Return All",
		name: "returnAll",
		type: "boolean",
		default: false,
		description: "Whether to return all results or only up to a given limit",
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["getMany"],
			},
		},
	},
	{
		displayName: "Limit",
		name: "limit",
		type: "number",
		default: 50,
		description: "Max number of results to return",
		typeOptions: {
			minValue: 1,
		},
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["getMany"],
				returnAll: [false],
			},
		},
		routing: {
			send: {
				type: "query",
				property: "limit",
			},
		},
	},
	{
		displayName: "Filters",
		name: "filters",
		type: "collection",
		placeholder: "Add Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Invoice ID",
				name: "invoiceId",
				type: "string",
				default: "",
				description: "ID of the invoice to retrieve positions for",
			},
			{
				displayName: "Part ID",
				name: "partId",
				type: "string",
				default: "",
				description: "ID of the part to retrieve positions for",
			},
		],
	},
];
