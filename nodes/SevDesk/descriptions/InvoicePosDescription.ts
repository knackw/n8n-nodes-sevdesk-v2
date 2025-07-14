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
				name: "Create",
				value: "create",
				description: "Create an invoice position",
				action: "Create an invoice position",
				routing: {
					request: {
						method: "POST",
						url: "/InvoicePos",
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
			{
				name: "Get",
				value: "get",
				description: "Get an invoice position",
				action: "Get an invoice position",
				routing: {
					request: {
						method: "GET",
						url: "=/InvoicePos/{{$parameter.invoicePosId}}",
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
			{
				name: "Update",
				value: "update",
				description: "Update an invoice position",
				action: "Update an invoice position",
				routing: {
					request: {
						method: "PUT",
						url: "=/InvoicePos/{{$parameter.invoicePosId}}",
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
			{
				name: "Delete",
				value: "delete",
				description: "Delete an invoice position",
				action: "Delete an invoice position",
				routing: {
					request: {
						method: "DELETE",
						url: "=/InvoicePos/{{$parameter.invoicePosId}}",
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
	// Invoice Position ID for get, update, delete operations
	{
		displayName: "Invoice Position ID",
		name: "invoicePosId",
		type: "string",
		description: "Invoice Position ID",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["get", "update", "delete"],
			},
		},
	},

	// Fields for create and update operations
	{
		displayName: "Invoice",
		name: "invoice",
		type: "collection",
		description: "Invoice",
		required: true,
		default: {},
		options: [
			{
				displayName: "ID",
				name: "id",
				type: "string",
				default: "",
			},
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "Invoice",
			},
		],
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["create", "update"],
			},
		},
	},

	{
		displayName: "Quantity",
		name: "quantity",
		type: "number",
		description: "Quantity of the position",
		default: 1,
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["create", "update"],
			},
		},
	},

	{
		displayName: "Price",
		name: "price",
		type: "number",
		description: "Price per unit",
		default: 0,
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["create", "update"],
			},
		},
	},

	{
		displayName: "Name",
		name: "name",
		type: "string",
		description: "Name of the position",
		default: "",
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["create", "update"],
			},
		},
	},

	{
		displayName: "Position Number",
		name: "positionNumber",
		type: "number",
		description: "Position number in the invoice",
		default: 1,
		displayOptions: {
			show: {
				resource: ["invoicePos"],
				operation: ["create", "update"],
			},
		},
	},

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
