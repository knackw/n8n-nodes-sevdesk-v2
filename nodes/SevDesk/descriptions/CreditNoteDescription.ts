import { INodeProperties } from "n8n-workflow";

export const creditNoteOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["creditNote"],
			},
		},
		options: [
			{
				name: "Book",
				value: "book",
				action: "Book a credit note",
				routing: {
					request: {
						method: "PUT",
						url: "=CreditNote/{{$parameter.creditNoteId}}/book",
						body: "={{$parameter.bookingData}}" as any,
					},
				},
			},
			{
				name: "Create",
				value: "create",
				action: "Create a credit note",
				routing: {
					request: {
						method: "POST",
						url: "/CreditNote/Factory/createCreditNote",
						body: "={{$parameter.creditNoteData}}" as any,
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Create From Invoice",
				value: "createFromInvoice",
				action: "Create a credit note from an invoice",
				routing: {
					request: {
						method: "POST",
						url: "/CreditNote/Factory/createFromInvoice",
						body: "={{$parameter.invoice}}" as any,
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a credit note",
				routing: {
					request: {
						method: "DELETE",
						url: "=CreditNote/{{$parameter.creditNoteId}}",
					},
				},
			},
			{
				name: "Enshrine",
				value: "enshrine",
				action: "Enshrine a credit note",
				routing: {
					request: {
						method: "PUT",
						url: "=CreditNote/{{$parameter.creditNoteId}}/enshrine",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get a credit note",
				routing: {
					request: {
						method: "GET",
						url: "=CreditNote/{{$parameter.creditNoteId}}",
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
				action: "Get many credit notes",
				routing: {
					request: {
						method: "GET",
						url: "/CreditNote",
						qs: "={{$parameter.filters}}" as any,
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Get Next Number",
				value: "getNextNumber",
				action: "Get the next credit note number",
				routing: {
					request: {
						method: "GET",
						url: "/V1/SevSequence/Factory/getByType?objectType=CreditNote&type=CN",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Get PDF",
				value: "getPdf",
				action: "Get PDF of a credit note",
				routing: {
					request: {
						method: "GET",
						url: "=CreditNote/{{$parameter.creditNoteId}}/getPdf",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: {
									dataProperty: "data",
									fileName: "={{$response.body.filename}}",
								},
							} as any,
						],
					},
				},
			},
			{
				name: "Mark As Sent",
				value: "markAsSent",
				action: "Mark a credit note as sent",
				routing: {
					request: {
						method: "PUT",
						url: "=CreditNote/{{$parameter.creditNoteId}}/send",
						body: "={{$parameter.sendData}}" as any,
					},
				},
			},
			{
				name: "Reset Status To Draft",
				value: "resetStatusToDraft",
				action: "Reset a credit note status to draft",
				routing: {
					request: {
						method: "PUT",
						url: "=CreditNote/{{$parameter.creditNoteId}}/uncancel",
					},
				},
			},
			{
				name: "Reset Status To Open",
				value: "resetStatusToOpen",
				action: "Reset a credit note status to open",
				routing: {
					request: {
						method: "PUT",
						url: "=CreditNote/{{$parameter.creditNoteId}}/cancel",
					},
				},
			},
			{
				name: "Send By Email",
				value: "sendByEmail",
				action: "Send a credit note by email",
				routing: {
					request: {
						method: "POST",
						url: "=CreditNote/{{$parameter.creditNoteId}}/sendViaEmail",
						body: "={{$parameter.emailData}}" as any,
					},
				},
			},
			{
				name: "Send By Printing",
				value: "sendByPrinting",
				action: "Send a credit note by printing",
				routing: {
					request: {
						method: "GET",
						url: "=CreditNote/{{$parameter.creditNoteId}}/sendBy",
						qs: "={{$parameter.sendType}}" as any,
					},
				},
			},
			{
				name: "Update",
				value: "update",
				action: "Update a credit note",
				routing: {
					request: {
						method: "PUT",
						url: "=CreditNote/{{$parameter.creditNoteId}}",
						body: "={{$parameter.updateFields}}" as any,
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

const creditNoteModel: INodeProperties[] = [
	{
		displayName: "Credit Note Number",
		name: "creditNoteNumber",
		type: "string",
		default: "",
	},
	{
		displayName: "Contact",
		name: "contact",
		type: "collection",
		placeholder: "Add Contact",
		default: {},
		options: [
			{ displayName: "ID", name: "id", type: "string", default: "" },
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "Contact",
			},
		],
	},
	{
		displayName: "Credit Note Date",
		name: "creditNoteDate",
		type: "string",
		default: "",
	},
	{
		displayName: "Status",
		name: "status",
		type: "options",
		options: [
			{ name: "Draft", value: "100" },
			{ name: "Open", value: "200" },
			{ name: "Paid", value: "1000" },
		],
		default: "100",
	},
	{ displayName: "Header", name: "header", type: "string", default: "" },
	{
		displayName: "Head Text",
		name: "headText",
		type: "string",
		typeOptions: { multiline: true },
		default: "",
	},
	{
		displayName: "Foot Text",
		name: "footText",
		type: "string",
		typeOptions: { multiline: true },
		default: "",
	},
	{ displayName: "Address", name: "address", type: "string", default: "" },
	{ displayName: "Currency", name: "currency", type: "string", default: "" },
	{ displayName: "Tax Type", name: "taxType", type: "string", default: "" },
	{ displayName: "Tax Text", name: "taxText", type: "string", default: "" },
	{
		displayName: "Small Settlement",
		name: "smallSettlement",
		type: "boolean",
		default: false,
	},
];

export const creditNoteFields: INodeProperties[] = [
	{
		displayName: "Credit Note ID",
		name: "creditNoteId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: [
					"book",
					"delete",
					"enshrine",
					"get",
					"getPdf",
					"markAsSent",
					"resetStatusToDraft",
					"resetStatusToOpen",
					"sendByEmail",
					"sendByPrinting",
					"update",
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
				resource: ["creditNote"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Contact ID",
				name: "contact[id]",
				type: "string",
				default: "",
			},
			{
				displayName: "Credit Note Number",
				name: "creditNoteNumber",
				type: "string",
				default: "",
			},
			{ displayName: "End Date", name: "endDate", type: "string", default: "" },
			{
				displayName: "Start Date",
				name: "startDate",
				type: "string",
				default: "",
			},
			{
				displayName: "Status",
				name: "status",
				type: "options",
				options: [
					{ name: "Draft", value: 100 },
					{ name: "Open", value: 200 },
					{ name: "Paid", value: 1000 },
				],
				default: 100,
			},
		],
	},
	{
		displayName: "Credit Note Data",
		name: "creditNoteData",
		type: "collection",
		placeholder: "Add Credit Note Data",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: ["create"],
			},
		},
		options: [
			{
				displayName: "Credit Note",
				name: "creditNote",
				type: "collection",
				placeholder: "Add Credit Note",
				default: {},
				options: creditNoteModel,
			},
			{
				displayName: "Credit Note Pos",
				name: "creditNotePos",
				type: "fixedCollection",
				placeholder: "Add Credit Note Position",
				default: {},
				typeOptions: { multipleValues: true },
				options: [
					{ name: "values", displayName: "Values", values: [] }, // simplified for now
				],
			},
		],
	},
	{
		displayName: "Update Fields",
		name: "updateFields",
		type: "collection",
		placeholder: "Add Field to Update",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: ["update"],
			},
		},
		options: creditNoteModel,
	},
	{
		displayName: "Invoice",
		name: "invoice",
		type: "collection",
		placeholder: "Add Invoice",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: ["createFromInvoice"],
			},
		},
		options: [
			{ displayName: "ID", name: "id", type: "string", default: "" },
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "Invoice",
			},
		],
	},
	{
		displayName: "Email Data",
		name: "emailData",
		type: "collection",
		placeholder: "Add Email Data",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: ["sendByEmail"],
			},
		},
		options: [
			{ displayName: "To", name: "to", type: "string", default: "" },
			{ displayName: "Subject", name: "subject", type: "string", default: "" },
			{ displayName: "Text", name: "text", type: "string", default: "" },
		],
	},
	{
		displayName: "Options",
		name: "options",
		type: "collection",
		placeholder: "Add Option",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: ["getPdf"],
			},
		},
		options: [
			{
				displayName: "Download",
				name: "download",
				type: "boolean",
				default: false,
			},
		],
	},
	{
		displayName: "Send Type",
		name: "sendType",
		type: "collection",
		placeholder: "Add Send Type",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: ["sendByPrinting"],
			},
		},
		options: [
			{ displayName: "Type", name: "type", type: "string", default: "" },
		],
	},
	{
		displayName: "Send Data",
		name: "sendData",
		type: "collection",
		placeholder: "Add Send Data",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: ["markAsSent"],
			},
		},
		options: [
			{
				displayName: "Send Type",
				name: "sendType",
				type: "string",
				default: "",
			},
		],
	},
	{
		displayName: "Booking Data",
		name: "bookingData",
		type: "collection",
		placeholder: "Add Booking Data",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNote"],
				operation: ["book"],
			},
		},
		options: [
			{ displayName: "Amount", name: "amount", type: "number", default: 0 },
			{ displayName: "Date", name: "date", type: "string", default: "" },
			{ displayName: "Type", name: "type", type: "string", default: "" },
			{
				displayName: "Check Account",
				name: "checkAccount",
				type: "collection",
				placeholder: "Add Check Account",
				default: {},
				options: [
					{ displayName: "ID", name: "id", type: "string", default: "" },
					{
						displayName: "Object Name",
						name: "objectName",
						type: "string",
						default: "CheckAccount",
					},
				],
			},
		],
	},
];
