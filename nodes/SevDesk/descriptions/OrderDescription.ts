import { INodeProperties } from "n8n-workflow";

export const orderOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["order"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create an order",
				routing: {
					request: {
						method: "POST",
						url: "/Order/Factory/saveOrder",
						body: {
							order: "={{$parameter.order}}",
							orderPosSave: "={{$parameter.orderPosSave}}",
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
							{
								type: "rootProperty",
								properties: {
									property: "order",
								},
							},
						],
					},
				},
			},
			{
				name: "Create Invoice",
				value: "createInvoice",
				action: "Create an invoice from an order",
				routing: {
					request: {
						method: "POST",
						url: "/Order/Factory/createInvoice",
						body: {
							order: '={"id": "{{$parameter.orderId}}", "objectName": "Order"}',
							"part-sum": "={{$parameter.partSum}}",
							invoiceDate: "={{$parameter.invoiceDate}}",
							deliveryDate: "={{$parameter.deliveryDate}}",
							status: "={{$parameter.invoiceStatus || 100}}",
							smallBusiness: "={{$parameter.smallBusiness}}",
							taxRate: "={{$parameter.taxRate}}",
							taxText: "={{$parameter.taxText}}",
							dunningLevel: "={{$parameter.dunningLevel || 1}}",
						},
					},
					output: {
						postReceive: [
							{
								type: "rootProperty",
								properties: {
									property: "invoice",
								},
							},
						],
					},
				},
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete an order",
				routing: {
					request: {
						method: "DELETE",
						url: "/Order/{{$parameter.orderId}}",
					},
				},
			},
			{
				name: "Download PDF",
				value: "downloadPdf",
				action: "Download order as pdf",
				routing: {
					request: {
						method: "GET",
						url: "/Order/{{$parameter.orderId}}/getPdf",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get an order",
				routing: {
					request: {
						method: "GET",
						url: "/Order/{{$parameter.orderId}}",
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
				action: "Get many orders",
				routing: {
					request: {
						method: "GET",
						url: "/Order",
						qs: {
							status: "={{$parameter.filters.status}}",
							orderNumber: "={{$parameter.filters.orderNumber}}",
							startDate: "={{$parameter.filters.startDate}}",
							endDate: "={{$parameter.filters.endDate}}",
							"contact[id]": "={{$parameter.filters.contactId}}",
							"contact[objectName]": "Contact",
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
				name: "Send By Email",
				value: "sendViaEmail",
				action: "Send an order by email",
				routing: {
					request: {
						method: "POST",
						url: "/Order/{{$parameter.orderId}}/sendViaEmail",
						body: {
							to: "={{$parameter.email}}",
							subject: "={{$parameter.subject}}",
							text: "={{$parameter.text}}",
						},
					},
				},
			},
			{
				name: "Update",
				value: "update",
				action: "Update an order",
				routing: {
					request: {
						method: "PUT",
						url: "/Order/{{$parameter.orderId}}",
						body: {
							contact: "={{$parameter.contactId}}",
							contactPerson: "={{$parameter.contactPersonId}}",
						},
					},
				},
			},
		],
		default: "getMany",
	},
];

export const orderFields: INodeProperties[] = [
	{
		displayName: "Order ID",
		name: "orderId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["order"],
				operation: [
					"get",
					"delete",
					"update",
					"sendViaEmail",
					"createInvoice",
					"downloadPdf",
				],
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
				resource: ["order"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Contact ID",
				name: "contactId",
				type: "string",
				default: "",
			},
			{
				displayName: "End Date",
				name: "endDate",
				type: "number",
				default: 0,
			},
			{
				displayName: "Order Number",
				name: "orderNumber",
				type: "string",
				default: "",
			},
			{
				displayName: "Start Date",
				name: "startDate",
				type: "number",
				default: 0,
			},
			{
				displayName: "Status",
				name: "status",
				type: "options",
				options: [
					{ name: "Draft", value: 100 },
					{ name: "Delivered", value: 200 },
					{ name: "Billed", value: 300 },
					{ name: "Accepted", value: 500 },
					{ name: "Declined", value: 750 },
					{ name: "Finished", value: 1000 },
				],
				default: 100,
			},
		],
	},
	{
		displayName: "Order",
		name: "order",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Address",
				name: "address",
				type: "string",
				default: "",
			},
			{
				displayName: "Contact ID",
				name: "contactId",
				type: "string",
				required: true,
				default: "",
				routing: {
					send: {
						type: "body",
						property: "contact",
						value: '={"id": {{$value}}, "objectName": "Contact"}',
					},
				},
			},
			{
				displayName: "Contact Person ID",
				name: "contactPersonId",
				type: "string",
				default: "",
				routing: {
					send: {
						type: "body",
						property: "contactPerson",
						value: '={"id": {{$value}}, "objectName": "SevUser"}',
					},
				},
			},
			{
				displayName: "Foot Text",
				name: "footText",
				type: "string",
				default: "",
			},
			{
				displayName: "Head Text",
				name: "headText",
				type: "string",
				default: "",
			},
			{
				displayName: "Header",
				name: "header",
				type: "string",
				default: "",
			},
			{
				displayName: "Order Date",
				name: "orderDate",
				type: "dateTime",
				required: true,
				default: "",
			},
			{
				displayName: "Order ID",
				name: "id",
				type: "string",
				default: "",
			},
			{
				displayName: "Order Number",
				name: "orderNumber",
				type: "string",
				default: "",
			},
			{
				displayName: "Status",
				name: "status",
				type: "options",
				options: [
					{ name: "Draft", value: 100 },
					{ name: "Delivered", value: 200 },
					{ name: "Billed", value: 300 },
					{ name: "Accepted", value: 500 },
					{ name: "Declined", value: 750 },
					{ name: "Finished", value: 1000 },
				],
				default: 100,
			},
		],
	},
	{
		displayName: "Order Positions",
		name: "orderPosSave",
		type: "fixedCollection",
		placeholder: "Add Position",
		default: {},
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["create", "update"],
			},
		},
		typeOptions: {
			multipleValues: true,
		},
		options: [
			{
				displayName: "Position",
				name: "values",
				type: "collection",
				default: {},
				options: [
					{
						displayName: "Discount",
						name: "discount",
						type: "number",
						default: 0,
					},
					{
						displayName: "Part ID",
						name: "partId",
						type: "string",
						default: "",
						routing: {
							send: {
								type: "body",
								property: "part",
								value: '={"id": {{$value}}, "objectName": "Part"}',
							},
						},
					},
					{
						displayName: "Position Number",
						name: "positionNumber",
						type: "number",
						default: 0,
					},
					{
						displayName: "Price",
						name: "price",
						type: "number",
						default: 0,
					},
					{
						displayName: "Quantity",
						name: "quantity",
						type: "number",
						default: 1,
					},
				],
			},
		],
	},
	{
		displayName: "Email",
		name: "email",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["sendViaEmail"],
			},
		},
		placeholder: "recipient@example.com",
		description: "The recipient's email address",
	},
	{
		displayName: "Subject",
		name: "subject",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["sendViaEmail"],
			},
		},
		placeholder: "Your Order",
		description: "The subject of the email",
	},
	{
		displayName: "Text",
		name: "text",
		type: "string",
		typeOptions: {
			rows: 4,
		},
		default: "",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["sendViaEmail"],
			},
		},
		description: "The body of the email",
	},
	{
		displayName: "Part Sum",
		name: "partSum",
		type: "boolean",
		default: false,
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["createInvoice"],
			},
		},
		description:
			"Whether to create a partial invoice. If true, a new invoice will be created with the sum of all not yet billed order positions.",
	},
	{
		displayName: "Invoice Date",
		name: "invoiceDate",
		type: "dateTime",
		default: "",
		description: "Date for the created invoice (defaults to current date)",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["createInvoice"],
			},
		},
	},
	{
		displayName: "Delivery Date",
		name: "deliveryDate",
		type: "dateTime",
		default: "",
		description: "Delivery date for the invoice",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["createInvoice"],
			},
		},
	},
	{
		displayName: "Invoice Status",
		name: "invoiceStatus",
		type: "options",
		options: [
			{ name: "Draft", value: 50 },
			{ name: "Open", value: 100 },
			{ name: "Paid", value: 200 },
		],
		default: 100,
		description: "Status of the created invoice",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["createInvoice"],
			},
		},
	},
	{
		displayName: "Small Business",
		name: "smallBusiness",
		type: "boolean",
		default: false,
		description: "Whether this is a small business invoice (tax-exempt)",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["createInvoice"],
			},
		},
	},
	{
		displayName: "Tax Rate",
		name: "taxRate",
		type: "number",
		default: 19,
		description: "Tax rate percentage for the invoice",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["createInvoice"],
			},
		},
	},
	{
		displayName: "Tax Text",
		name: "taxText",
		type: "string",
		default: "",
		description: "Custom tax text for the invoice",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["createInvoice"],
			},
		},
	},
	{
		displayName: "Dunning Level",
		name: "dunningLevel",
		type: "options",
		options: [
			{ name: "No Dunning", value: 0 },
			{ name: "First Reminder", value: 1 },
			{ name: "Second Reminder", value: 2 },
			{ name: "Final Notice", value: 3 },
		],
		default: 1,
		description: "Dunning level for the invoice",
		displayOptions: {
			show: {
				resource: ["order"],
				operation: ["createInvoice"],
			},
		},
	},
];
