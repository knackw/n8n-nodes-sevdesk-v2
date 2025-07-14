import { INodeProperties } from "n8n-workflow";

export const voucherOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["voucher"],
			},
		},
		options: [
			{
				name: "Book",
				value: "book",
				action: "Book a voucher",
				routing: {
					request: {
						method: "PUT",
						url: "/Voucher/{{$parameter.voucherId}}/bookAmount",
						body: {
							amount: "={{$parameter.amount}}",
							date: "={{$parameter.date}}",
							type: "={{$parameter.paymentType}}",
							checkAccount:
								'={"id": "{{$parameter.checkAccountId}}", "objectName": "CheckAccount"}',
						},
					},
				},
			},
			{
				name: "Create",
				value: "create",
				action: "Create a voucher",
				routing: {
					request: {
						method: "POST",
						url: "/Voucher/Factory/saveVoucher",
						body: {
							voucher: "={{$parameter.voucher}}",
							voucherPosSave: "={{$parameter.voucherPosSave}}",
							voucherPosDelete: null,
							filename: "={{$parameter.fileName}}",
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
									property: "voucher",
								},
							},
						],
					},
				},
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a voucher",
				routing: {
					request: {
						method: "DELETE",
						url: "/Voucher/{{$parameter.voucherId}}",
					},
				},
			},
			{
				name: "Enshrine",
				value: "enshrine",
				action: "Enshrine a voucher",
				routing: {
					request: {
						method: "PUT",
						url: "/Voucher/{{$parameter.voucherId}}/enshrine",
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
				action: "Get a voucher",
				routing: {
					request: {
						method: "GET",
						url: "/Voucher/{{$parameter.voucherId}}",
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
				action: "Get many vouchers",
				routing: {
					request: {
						method: "GET",
						url: "/Voucher",
						qs: {
							status: "={{$parameter.filters.status}}",
							creditDebit: "={{$parameter.filters.creditDebit}}",
							description: "={{$parameter.filters.description}}",
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
				name: "Reset to Draft",
				value: "resetToDraft",
				action: "Reset a voucher to draft",
				routing: {
					request: {
						method: "PUT",
						url: "/Voucher/{{$parameter.voucherId}}/resetToDraft",
					},
				},
			},
			{
				name: "Reset to Open",
				value: "resetToOpen",
				action: "Reset a voucher to open",
				routing: {
					request: {
						method: "PUT",
						url: "/Voucher/{{$parameter.voucherId}}/resetToOpen",
					},
				},
			},
			{
				name: "Update",
				value: "update",
				action: "Update a voucher",
				routing: {
					request: {
						method: "PUT",
						url: "/Voucher/{{$parameter.voucherId}}",
					},
				},
			},
			{
				name: "Upload File",
				value: "uploadFile",
				action: "Upload a file for a voucher",
				routing: {
					request: {
						method: "POST",
						url: "/Voucher/Factory/uploadTempFile",
						body: {
							data: "={{$binary.data}}",
							filename: "={{$parameter.filename || $binary.fileName}}",
							mimeType: "={{$parameter.mimeType || $binary.mimeType}}",
							size: "={{$parameter.fileSize}}",
							description: "={{$parameter.description}}",
							category: "={{$parameter.category}}",
							ocrData: "={{$parameter.enableOCR}}",
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

export const voucherFields: INodeProperties[] = [
	{
		displayName: "Voucher ID",
		name: "voucherId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: [
					"get",
					"enshrine",
					"delete",
					"update",
					"book",
					"resetToOpen",
					"resetToDraft",
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
				resource: ["voucher"],
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
				displayName: "Credit/Debit",
				name: "creditDebit",
				type: "options",
				options: [
					{ name: "Credit", value: "C" },
					{ name: "Debit", value: "D" },
				],
				default: "C",
			},
			{
				displayName: "Description",
				name: "description",
				type: "string",
				default: "",
			},
			{
				displayName: "End Date",
				name: "endDate",
				type: "number",
				default: 0,
				description: "Timestamp",
			},
			{
				displayName: "Start Date",
				name: "startDate",
				type: "number",
				default: 0,
				description: "Timestamp",
			},
			{
				displayName: "Status",
				name: "status",
				type: "options",
				options: [
					{ name: "Draft", value: 50 },
					{ name: "Open", value: 100 },
					{ name: "Paid", value: 1000 },
				],
				default: 50,
			},
		],
	},
	{
		displayName: "Voucher",
		name: "voucher",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Credit/Debit",
				name: "creditDebit",
				type: "options",
				options: [
					{ name: "Credit", value: "C" },
					{ name: "Debit", value: "D" },
				],
				default: "C",
			},
			{
				displayName: "Currency",
				name: "currency",
				type: "string",
				default: "",
			},
			{
				displayName: "Description",
				name: "description",
				type: "string",
				default: "",
			},
			{
				displayName: "Pay Date",
				name: "payDate",
				type: "dateTime",
				default: "",
			},
			{
				displayName: "Status",
				name: "status",
				type: "options",
				options: [
					{ name: "Draft", value: 50 },
					{ name: "Open", value: 100 },
				],
				default: 50,
			},
			{
				displayName: "Supplier ID",
				name: "supplierId",
				type: "string",
				default: "",
			},
			{
				displayName: "Supplier Name",
				name: "supplierName",
				type: "string",
				default: "",
			},
			{
				displayName: "Tax Rule",
				name: "taxRule",
				type: "options",
				default: 9,
				description:
					"Define the VAT rule according to SevDesk API v2.0. For expense vouchers, use rule 9 (Vorsteuerabziehbare Aufwendungen) or 10 (Nicht vorsteuerabziehbare Aufwendungen).",
				options: [
					{
						name: "Vorsteuerabziehbare Aufwendungen",
						value: 9,
						description: "Deductible input tax expenses (0%, 7%, 19%)",
					},
					{
						name: "Nicht Vorsteuerabziehbare Aufwendungen",
						value: 10,
						description: "Non-deductible input tax expenses (0%)",
					},
					{
						name: "Innergemeinschaftliche Erwerbe",
						value: 8,
						description: "Intra-community acquisitions (0%, 7%, 19%)",
					},
					{
						name: "Reverse Charge Gem. §13b Abs. 2 UStG Mit Vorsteuerabzug 0% (19%)",
						value: 12,
						description:
							"Reverse charge according to §13b para. 2 UStG with input tax deduction 0% (19%).",
					},
					{
						name: "Reverse Charge Gem. §13b UStG Ohne Vorsteuerabzug 0% (19%)",
						value: 13,
						description:
							"Reverse charge according to §13b UStG without input tax deduction 0% (19%)",
					},
					{
						name: "Reverse Charge Gem. §13b Abs. 1 EU Umsätze 0% (19%)",
						value: 14,
						description:
							"Reverse charge according to §13b para. 1 EU transactions 0% (19%).",
					},
				],
			},
			{
				displayName: "Tax Type (Deprecated)",
				name: "taxType",
				type: "string",
				default: "",
				displayOptions: {
					show: {
						useDeprecatedTaxType: [true],
					},
				},
				description:
					"⚠️ DEPRECATED: Use taxRule instead. This field is maintained for backward compatibility only.",
			},
			{
				displayName: "Use Deprecated Tax Type",
				name: "useDeprecatedTaxType",
				type: "boolean",
				default: false,
				description:
					"⚠️ Enable this only if you need to use the deprecated taxType system for backward compatibility. New implementations should use taxRule.",
			},
			{
				displayName: "Voucher Date",
				name: "voucherDate",
				type: "dateTime",
				required: true,
				default: "",
			},
			{
				displayName: "Voucher ID",
				name: "id",
				type: "string",
				default: "",
				description: "The voucher ID. Leave empty to create a new one.",
			},
			{
				displayName: "Voucher Type",
				name: "voucherType",
				type: "options",
				options: [
					{ name: "Voucher", value: "VOU" },
					{ name: "Credit", value: "CRED" },
				],
				default: "VOU",
			},
		],
	},
	{
		displayName: "File Name",
		name: "fileName",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["create"],
			},
		},
		description:
			"Filename of a previously uploaded file which should be attached",
	},
	{
		displayName: "Voucher Positions",
		name: "voucherPosSave",
		type: "fixedCollection",
		placeholder: "Add Position",
		default: {},
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["create"],
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
						displayName: "Accounting Type ID",
						name: "accountingTypeId",
						type: "string",
						default: "",
					},
					{
						displayName: "Tax Rate",
						name: "taxRate",
						type: "number",
						default: 0,
					},
					{
						displayName: "Sum",
						name: "sum",
						type: "number",
						default: 0,
					},
					{
						displayName: "Comment",
						name: "comment",
						type: "string",
						default: "",
					},
				],
			},
		],
	},
	{
		displayName: "Amount",
		name: "amount",
		type: "number",
		default: 0,
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["book"],
			},
		},
	},
	{
		displayName: "Date",
		name: "date",
		type: "dateTime",
		default: "",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["book"],
			},
		},
	},
	{
		displayName: "Payment Type",
		name: "paymentType",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["book"],
			},
		},
	},
	{
		displayName: "Check Account ID",
		name: "checkAccountId",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["book"],
			},
		},
	},
	{
		displayName: "Filename",
		name: "filename",
		type: "string",
		default: "",
		description: "Custom filename for the uploaded file",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["uploadFile"],
			},
		},
	},
	{
		displayName: "MIME Type",
		name: "mimeType",
		type: "options",
		options: [
			{ name: "PDF", value: "application/pdf" },
			{ name: "JPEG", value: "image/jpeg" },
			{ name: "PNG", value: "image/png" },
			{ name: "TIFF", value: "image/tiff" },
			{ name: "Auto-detect", value: "" },
		],
		default: "",
		description: "MIME type of the file (auto-detected if not specified)",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["uploadFile"],
			},
		},
	},
	{
		displayName: "File Size (MB)",
		name: "fileSize",
		type: "number",
		default: 0,
		description: "File size in megabytes (calculated automatically if not provided)",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["uploadFile"],
			},
		},
	},
	{
		displayName: "Description",
		name: "description",
		type: "string",
		default: "",
		description: "Description or notes for the uploaded file",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["uploadFile"],
			},
		},
	},
	{
		displayName: "Category",
		name: "category",
		type: "options",
		options: [
			{ name: "Invoice", value: "invoice" },
			{ name: "Receipt", value: "receipt" },
			{ name: "Credit Note", value: "credit_note" },
			{ name: "Contract", value: "contract" },
			{ name: "Other", value: "other" },
		],
		default: "receipt",
		description: "Category of the document",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["uploadFile"],
			},
		},
	},
	{
		displayName: "Enable OCR",
		name: "enableOCR",
		type: "boolean",
		default: true,
		description: "Enable Optical Character Recognition to extract text from the document",
		displayOptions: {
			show: {
				resource: ["voucher"],
				operation: ["uploadFile"],
			},
		},
	},
];
