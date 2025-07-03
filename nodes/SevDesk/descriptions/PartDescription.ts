import { INodeProperties } from "n8n-workflow";

export const partOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["part"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a part",
				routing: {
					request: {
						method: "POST",
						url: "/Part",
						body: "={{$parameter.additionalFields}}",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get a part",
				routing: {
					request: {
						method: "GET",
						url: "=/Part/{{$parameter.partId}}",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many parts",
				routing: {
					request: {
						method: "GET",
						url: "/Part",
						qs: {
							partNumber: "={{$parameter.filters.partNumber}}",
							name: "={{$parameter.filters.name}}",
						},
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Get Stock",
				value: "getStock",
				action: "Get stock of a part",
				routing: {
					request: {
						method: "GET",
						url: "=/Part/{{$parameter.partId}}/getStock",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Update",
				value: "update",
				action: "Update a part",
				routing: {
					request: {
						method: "PUT",
						url: "=/Part/{{$parameter.partId}}",
						body: "={{$parameter.additionalFields}}",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
		],
		default: "getMany",
	},
];

export const partFields: INodeProperties[] = [
	{
		displayName: "Part ID",
		name: "partId",
		type: "string",
		required: true,
		displayOptions: {
			show: {
				resource: ["part"],
				operation: ["get", "getStock", "update"],
			},
		},
		default: "",
	},
	{
		displayName: "Filters",
		name: "filters",
		type: "collection",
		placeholder: "Add Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["part"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Part Number",
				name: "partNumber",
				type: "string",
				default: "",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
			},
		],
	},
	{
		displayName: "Additional Fields",
		name: "additionalFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["part"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Category",
				name: "category",
				type: "json",
				default: '{"id": "", "objectName": "Category"}',
				description: "Category of the part",
			},
			{
				displayName: "Internal Comment",
				name: "internalComment",
				type: "string",
				default: "",
				description:
					"An internal comment for the part. Does not appear on invoices and orders.",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
				description: "Name of the part. Required for create.",
			},
			{
				displayName: "Part Number",
				name: "partNumber",
				type: "string",
				default: "",
				description: "The part number. Required for create.",
			},
			{
				displayName: "Price",
				name: "price",
				type: "number",
				default: 0,
				description:
					"Net price for which the part is sold. Required for create.",
			},
			{
				displayName: "Price Gross",
				name: "priceGross",
				type: "number",
				default: 0,
				description: "Gross price for which the part is sold",
			},
			{
				displayName: "Price Net",
				name: "priceNet",
				type: "number",
				default: 0,
				description: "Net price for which the part is sold",
			},
			{
				displayName: "Price Purchase",
				name: "pricePurchase",
				type: "number",
				default: 0,
				description: "Purchase price of the part",
			},
			{
				displayName: "Status",
				name: "status",
				type: "number",
				default: 100,
				description: "Status of the part. 50 = Inactive, 100 = Active.",
			},
			{
				displayName: "Stock",
				name: "stock",
				type: "number",
				default: 0,
				description: "The stock of the part. Required for create.",
			},
			{
				displayName: "Stock Enabled",
				name: "stockEnabled",
				type: "boolean",
				default: false,
				description:
					"Whether the stock should be enabled. Required for create.",
			},
			{
				displayName: "Tax Rate",
				name: "taxRate",
				type: "number",
				default: 0,
				description: "Tax rate of the part. Required for create.",
			},
			{
				displayName: "Text",
				name: "text",
				type: "string",
				default: "",
				description: "A text describing the part",
			},
			{
				displayName: "Unity",
				name: "unity",
				type: "json",
				default: '{"id": "", "objectName": "Unity"}',
				description:
					"The unit in which the part is measured. Required for create.",
			},
		],
	},
];
