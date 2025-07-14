import { INodeProperties } from "n8n-workflow";

export const invoiceOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["invoice"],
			},
		},
		options: [
			{
				name: "Book Amount",
				value: "bookAmount",
				description: "Books a payment amount to an invoice",
				action: "Book an amount to an invoice",
				routing: {
					request: {
						method: "PUT",
						url: "=/Invoice/{{$parameter.invoiceId}}/bookAmount",
						body: {
							amount: "={{$parameter.amount}}",
							date: "={{$parameter.date}}",
							type: "={{$parameter.paymentType}}",
							checkAccount:
								'=S{ return { id: $parameter.checkAccountId, objectName: "CheckAccount" }; }',
							createFeed: "={{$parameter.createFeed}}",
						},
					},
				},
			},
			{
				name: "Cancel",
				value: "cancel",
				description: "Cancels an invoice",
				action: "Cancel an invoice",
				routing: {
					request: {
						method: "PUT",
						url: "=/Invoice/{{$parameter.invoiceId}}/cancelInvoice",
						qs: {
							cancellationText: "={{$parameter.cancellationText}}",
						},
					},
				},
			},
			{
				name: "Create From Order",
				value: "createFromOrder",
				description: "Creates an invoice from an order",
				action: "Create an invoice from an order",
				routing: {
					request: {
						method: "POST",
						url: "/Invoice/Factory/createInvoiceFromOrder",
						body: {
							order: '={{ { id: $parameter.orderId, objectName: "Order" } }}',
							type: "={{$parameter.creationType}}",
							amount: "={{$parameter.orderAmount}}",
							partialType: "={{$parameter.partialType}}",
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
				name: "Create or Update",
				value: "createOrUpdate",
				description: "Create or update an invoice",
				action: "Create or update an invoice",
				routing: {
					request: {
						method: "POST",
						url: "/Invoice/Factory/saveInvoice",
						body: {
							invoice:
								'=S{\n const invoiceData = { ...$parameter.invoice };\n if (invoiceData.contactId) { invoiceData.contact = { id: invoiceData.contactId, objectName: "Contact" }; delete invoiceData.contactId; }\n if (invoiceData.contactPersonId) { invoiceData.contactPerson = { id: invoiceData.contactPersonId, objectName: "SevUser" }; delete invoiceData.contactPersonId; }\n return invoiceData;\n}',
							invoicePosSave: "={{$parameter.invoicePosSave.values}}",
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
				name: "Create Reminder",
				value: "createReminder",
				description: "Creates a reminder for an invoice",
				action: "Create a reminder for an invoice",
				routing: {
					request: {
						method: "POST",
						url: "/Invoice/Factory/createReminder",
						body: {
							invoice:
								'={{ { id: $parameter.invoiceId, objectName: "Invoice" } }}',
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
				name: "Download PDF",
				value: "downloadPdf",
				description: "Retrieves the PDF document of an invoice with customization options",
				action: "Download an invoice PDF",
				routing: {
					request: {
						method: "GET",
						url: "=/Invoice/{{$parameter.invoiceId}}/getPdf",
						qs: {
							download: "={{$parameter.download}}",
							preventive: "={{$parameter.preventive}}",
							template: "={{$parameter.template}}",
							language: "={{$parameter.language}}",
							letterPaper: "={{$parameter.letterPaper}}",
							draft: "={{$parameter.draft}}",
						},
					},
					output: {
						postReceive: [
							{
								type: "binaryData",
								properties: {
									destinationProperty: "data",
								},
							},
						],
					},
				},
			},
			{
				name: "Download XML",
				value: "downloadXml",
				description: "Retrieves the XML of an e-invoice with format options",
				action: "Download an invoice XML",
				routing: {
					request: {
						method: "GET",
						url: "=/Invoice/{{$parameter.invoiceId}}/getXml",
						qs: {
							format: "={{$parameter.xmlFormat}}",
							version: "={{$parameter.xmlVersion}}",
							includeAttachments: "={{$parameter.includeAttachments}}",
							validation: "={{$parameter.enableValidation}}",
						},
					},
					output: {
						postReceive: [
							{
								type: "binaryData",
								properties: {
									destinationProperty: "data",
								},
							},
						],
					},
				},
			},
			{
				name: "Enshrine",
				value: "enshrine",
				description:
					"Sets the current date and time as a value for the property enshrined",
				action: "Enshrine an invoice",
				routing: {
					request: {
						method: "PUT",
						url: "=/Invoice/{{$parameter.invoiceId}}/enshrine",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				description: "Returns a single invoice",
				action: "Get an invoice",
				routing: {
					request: {
						method: "GET",
						url: "=/Invoice/{{$parameter.invoiceId}}",
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
				description: "Get many invoices",
				action: "Get many invoices",
				routing: {
					request: {
						method: "GET",
						url: "/Invoice",
						qs: {
							status: "={{$parameter.filters.status}}",
							invoiceNumber: "={{$parameter.filters.invoiceNumber}}",
							startDate: "={{$parameter.filters.startDate}}",
							endDate: "={{$parameter.filters.endDate}}",
							"contact[id]": "={{$parameter.filters.contactId}}",
							"contact[objectName]":
								'={{$parameter.filters.contactId ? "Contact" : undefined}}',
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
				name: "Get Positions",
				value: "getPositions",
				description: "Returns all positions of an invoice",
				action: "Get invoice positions",
				routing: {
					request: {
						method: "GET",
						url: "=/Invoice/{{$parameter.invoiceId}}/getPositions",
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
				name: "Is Partially Paid",
				value: "isPartiallyPaid",
				description: "Checks if an invoice is partially paid",
				action: "Check if an invoice is partially paid",
				routing: {
					request: {
						method: "GET",
						url: "=/Invoice/{{$parameter.invoiceId}}/isPartiallyPaid",
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
				name: "Mark as Sent",
				value: "markAsSent",
				description: "Marks an invoice as sent with various send types",
				action: "Mark an invoice as sent",
				routing: {
					request: {
						method: "PUT",
						url: "=/Invoice/{{$parameter.invoiceId}}/sendBy",
						body: {
							sendType: "={{$parameter.sendType}}",
							sendDate: "={{$parameter.sendDate || new Date().toISOString()}}",
							trackingCode: "={{$parameter.trackingCode}}",
							sendCost: "={{$parameter.sendCost}}",
							additionalInfo: "={{$parameter.additionalInfo}}",
						},
					},
				},
			},
			{
				name: "Render PDF",
				value: "renderPdf",
				description: "Renders the PDF document of an invoice",
				action: "Render an invoice PDF",
				routing: {
					request: {
						method: "POST",
						url: "=/Invoice/{{$parameter.invoiceId}}/render",
						body: {
							forceReload: "={{$parameter.forceReload}}",
						},
					},
				},
			},
			{
				name: "Reset to Draft",
				value: "resetToDraft",
				description: 'Resets the status to "Draft" if it has the status "Open"',
				action: "Reset an invoice to draft",
				routing: {
					request: {
						method: "PUT",
						url: "=/Invoice/{{$parameter.invoiceId}}/resetToDraft",
					},
				},
			},
			{
				name: "Reset to Open",
				value: "resetToOpen",
				description: 'Resets the status to "Open" if it has the status "Paid"',
				action: "Reset an invoice to open",
				routing: {
					request: {
						method: "PUT",
						url: "=/Invoice/{{$parameter.invoiceId}}/resetToOpen",
					},
				},
			},
			{
				name: "Send by Email",
				value: "sendByEmail",
				description: "Sends an invoice by email with template support",
				action: "Send an invoice by email",
				routing: {
					request: {
						method: "POST",
						url: "=/Invoice/{{$parameter.invoiceId}}/sendViaEmail",
						body: {
							to: "={{$parameter.email}}",
							subject: "={{$parameter.useTemplate ? $parameter.template.subject : $parameter.subject}}",
							text: "={{$parameter.useTemplate ? $parameter.template.text : $parameter.text}}",
							copy: "={{$parameter.copy}}",
							additionalAttachments: "={{$parameter.additionalAttachments}}",
							bccEmail: "={{$parameter.bccEmail}}",
							sendXml: "={{$parameter.sendXml}}",
							ccEmail: "={{$parameter.ccEmail}}",
							sendType: "={{$parameter.sendType || 'VP'}}",
						},
					},
				},
			},
		],
		default: "getMany",
	},
];

export const invoiceFields: INodeProperties[] = [
	{
		displayName: "Invoice ID",
		name: "invoiceId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["invoice"],
				operation: [
					"get",
					"getPositions",
					"bookAmount",
					"cancel",
					"createReminder",
					"isPartiallyPaid",
					"sendByEmail",
					"markAsSent",
					"renderPdf",
					"downloadPdf",
					"downloadXml",
					"enshrine",
					"resetToDraft",
					"resetToOpen",
				],
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
				resource: ["invoice"],
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
				resource: ["invoice"],
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
				resource: ["invoice"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Contact ID",
				name: "contactId",
				type: "string",
				default: "",
				description: "ID of the contact to retrieve invoices for",
			},
			{
				displayName: "End Date",
				name: "endDate",
				type: "dateTime",
				default: "",
				description: "Retrieve all invoices with a date equal or lower",
			},
			{
				displayName: "Invoice Number",
				name: "invoiceNumber",
				type: "string",
				default: "",
			},
			{
				displayName: "Start Date",
				name: "startDate",
				type: "dateTime",
				default: "",
				description: "Retrieve all invoices with a date equal or higher",
			},
			{
				displayName: "Status",
				name: "status",
				type: "options",
				default: 100,
				options: [
					{ name: "Draft", value: 100 },
					{ name: "Open / Due", value: 200 },
					{ name: "Paid", value: 1000 },
				],
			},
		],
	},
	{
		displayName: "Invoice",
		name: "invoice",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["invoice"],
				operation: ["createOrUpdate"],
			},
		},
		options: [
			{ displayName: "Address", name: "address", type: "string", default: "" },
			{
				displayName: "Contact ID",
				name: "contactId",
				type: "string",
				required: true,
				default: "",
				description: "ID of the contact",
			},
			{
				displayName: "Contact Person ID",
				name: "contactPersonId",
				type: "string",
				default: "",
				description: "ID of the contact person (sevUser)",
			},
			{
				displayName: "Currency",
				name: "currency",
				type: "string",
				default: "EUR",
			},
			{
				displayName: "Delivery Date",
				name: "deliveryDate",
				type: "dateTime",
				default: "",
			},
			{ displayName: "Discount", name: "discount", type: "number", default: 0 },
			{
				displayName: "Discount Time",
				name: "discountTime",
				type: "number",
				default: 0,
			},
			{
				displayName: "Footer Text",
				name: "footText",
				type: "string",
				default: "",
				typeOptions: { multiline: true },
			},
			{
				displayName: "Header Text",
				name: "header",
				type: "string",
				default: "",
				typeOptions: { multiline: true },
			},
			{
				displayName: "ID",
				name: "id",
				type: "string",
				default: "",
				description: "Invoice ID, leave empty to create a new one",
			},
			{
				displayName: "Invoice Date",
				name: "invoiceDate",
				type: "dateTime",
				required: true,
				default: "",
			},
			{
				displayName: "Invoice Number",
				name: "invoiceNumber",
				type: "string",
				default: "",
			},
			{
				displayName: "Invoice Type",
				name: "invoiceType",
				type: "options",
				default: "RE",
				options: [
					{
						name: "Advance Invoice",
						value: "AR",
					},
					{
						name: "Cancellation Invoice",
						value: "SR",
					},
					{
						name: "Final Invoice",
						value: "ER",
					},
					{
						name: "Partial Invoice",
						value: "TR",
					},
					{
						name: "Recurring Invoice",
						value: "WKR",
					},
					{
						name: "Regular Invoice",
						value: "RE",
					},
				],
			},
			{
				displayName: "Show Net",
				name: "showNet",
				type: "boolean",
				default: false,
			},
			{
				displayName: "Small Settlement",
				name: "smallSettlement",
				type: "boolean",
				default: false,
			},
			{
				displayName: "Status",
				name: "status",
				type: "options",
				default: 100,
				options: [
					{ name: "Draft", value: 100 },
					{ name: "Open", value: 200 },
					{ name: "Paid", value: 1000 },
				],
			},
			{
				displayName: "Tax Rule",
				name: "taxRule",
				type: "options",
				default: 1,
				options: [
					{
						name: "Umsatzsteuerpflichtige Umsätze (Standard)",
						value: 1,
						description: "Standard VAT liable transactions (0%, 7%, 19%)",
					},
					{
						name: "Ausfuhren",
						value: 2,
						description: "Exports (0%)",
					},
					{
						name: "Innergemeinschaftliche Lieferungen (EU)",
						value: 3,
						description: "Intra-community deliveries (0%, 7%, 19%)",
					},
					{
						name: "Steuerfreie Umsätze §4 UStG",
						value: 4,
						description: "Tax-free transactions §4 UStG (0%)",
					},
					{
						name: "Reverse Charge Gem. §13b UStG",
						value: 5,
						description: "Reverse charge according to §13b UStG (0%)",
					},
					{
						name: "Steuer Nicht Erhoben Nach §19 UStG (Kleinunternehmer)",
						value: 11,
						description:
							"Tax not levied according to §19 UStG - Small business (0%)",
					},
					{
						name: "Nicht Im Inland Steuerbare Leistung",
						value: 17,
						description: "Services not taxable domestically (0%)",
					},
					{
						name: "One Stop Shop (Waren)",
						value: 18,
						description: "One Stop Shop for goods (country dependent rates)",
					},
					{
						name: "One Stop Shop (Elektronische Dienstleistungen)",
						value: 19,
						description:
							"One Stop Shop for electronic services (country dependent rates)",
					},
					{
						name: "One Stop Shop (Andere Dienstleistungen)",
						value: 20,
						description:
							"One Stop Shop for other services (country dependent rates)",
					},
					{
						name: "Reverse Charge Gem. §18b UStG",
						value: 21,
						description: "Reverse charge according to §18b UStG (0%)",
					},
				],
				description:
					"Define the VAT rule according to SevDesk API v2.0. This replaces the deprecated taxType system.",
			},
			{
				displayName: "Tax Type (Deprecated)",
				name: "taxType",
				type: "options",
				default: "default",
				displayOptions: {
					show: {
						useDeprecatedTaxType: [true],
					},
				},
				options: [
					{
						name: "Custom",
						value: "custom",
					},
					{
						name: "Default",
						value: "default",
					},
					{
						name: "EU",
						value: "eu",
					},
					{
						name: "Non-EU",
						value: "noteu",
					},
					{
						name: "SS",
						value: "ss",
					},
				],
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
		],
	},
	{
		displayName: "Invoice Positions",
		name: "invoicePosSave",
		type: "fixedCollection",
		placeholder: "Add Position",
		default: {},
		displayOptions: {
			show: { resource: ["invoice"], operation: ["createOrUpdate"] },
		},
		typeOptions: { multipleValues: true },
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
					{ displayName: "Name", name: "name", type: "string", default: "" },
					{
						displayName: "Part ID",
						name: "partId",
						type: "string",
						default: "",
					},
					{ displayName: "Price", name: "price", type: "number", default: 0 },
					{
						displayName: "Quantity",
						name: "quantity",
						type: "number",
						default: 1,
					},
					{
						displayName: "Tax Rate",
						name: "taxRate",
						type: "number",
						default: 19,
					},
					{
						displayName: "Text",
						name: "text",
						type: "string",
						default: "",
						typeOptions: { multiline: true },
					},
				],
			},
		],
	},
	{
		displayName: "Amount",
		name: "amount",
		type: "number",
		required: true,
		default: 0,
		displayOptions: {
			show: { resource: ["invoice"], operation: ["bookAmount"] },
		},
	},
	{
		displayName: "Date",
		name: "date",
		type: "dateTime",
		required: true,
		default: "",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["bookAmount"] },
		},
	},
	{
		displayName: "Payment Type",
		name: "paymentType",
		type: "options",
		required: true,
		default: "N",
		options: [
			{ name: "Normal", value: "N" },
			{ name: "Credit", value: "C" },
		],
		displayOptions: {
			show: { resource: ["invoice"], operation: ["bookAmount"] },
		},
	},
	{
		displayName: "Create Feed",
		name: "createFeed",
		type: "boolean",
		default: false,
		displayOptions: {
			show: { resource: ["invoice"], operation: ["bookAmount"] },
		},
	},
	{
		displayName: "Check Account ID",
		name: "checkAccountId",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["bookAmount"] },
		},
	},
	{
		displayName: "Cancellation Text",
		name: "cancellationText",
		type: "string",
		default: "",
		displayOptions: { show: { resource: ["invoice"], operation: ["cancel"] } },
	},
	{
		displayName: "Order ID",
		name: "orderId",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["createFromOrder"] },
		},
	},
	{
		displayName: "Creation Type",
		name: "creationType",
		type: "options",
		default: "percentage",
		options: [
			{ name: "Percentage", value: "percentage" },
			{ name: "Amount", value: "amount" },
		],
		displayOptions: {
			show: { resource: ["invoice"], operation: ["createFromOrder"] },
		},
	},
	{
		displayName: "Order Amount",
		name: "orderAmount",
		type: "number",
		default: null,
		displayOptions: {
			show: { resource: ["invoice"], operation: ["createFromOrder"] },
		},
	},
	{
		displayName: "Partial Type",
		name: "partialType",
		type: "options",
		default: "TR",
		options: [
			{ name: "Teilrechnung (TR)", value: "TR" },
			{ name: "Abschlagsrechnung (AR)", value: "AR" },
			{ name: "Schlussrechnung (ER)", value: "ER" },
		],
		displayOptions: {
			show: { resource: ["invoice"], operation: ["createFromOrder"] },
		},
	},
	{
		displayName: "Use Email Template",
		name: "useTemplate",
		type: "boolean",
		default: false,
		description: "Use predefined email template instead of custom subject/text",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["sendByEmail"] },
		},
	},
	{
		displayName: "Email Template",
		name: "template",
		type: "collection",
		placeholder: "Add Template Fields",
		default: {},
		displayOptions: {
			show: { 
				resource: ["invoice"], 
				operation: ["sendByEmail"],
				useTemplate: [true]
			},
		},
		options: [
			{
				displayName: "Template Type",
				name: "type",
				type: "options",
				options: [
					{ name: "Standard Invoice", value: "standard" },
					{ name: "Reminder", value: "reminder" },
					{ name: "Final Notice", value: "final_notice" },
					{ name: "Payment Confirmation", value: "payment_confirmation" },
					{ name: "Custom", value: "custom" }
				],
				default: "standard",
				description: "Type of email template to use"
			},
			{
				displayName: "Subject Template",
				name: "subject",
				type: "string",
				default: "Invoice {{invoiceNumber}} from {{companyName}}",
				description: "Email subject template (supports placeholders: {{invoiceNumber}}, {{companyName}}, {{contactName}}, {{amount}}, {{dueDate}})"
			},
			{
				displayName: "Text Template",
				name: "text",
				type: "string",
				typeOptions: { multiline: true },
				default: "Dear {{contactName}},\n\nPlease find attached invoice {{invoiceNumber}} with amount {{amount}} EUR.\n\nDue date: {{dueDate}}\n\nBest regards,\n{{companyName}}",
				description: "Email body template (supports placeholders: {{invoiceNumber}}, {{companyName}}, {{contactName}}, {{amount}}, {{dueDate}})"
			}
		]
	},
	{
		displayName: "Email",
		name: "email",
		type: "string",
		placeholder: "name@email.com",
		required: true,
		default: "",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["sendByEmail"] },
		},
	},
	{
		displayName: "Subject",
		name: "subject",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: { 
				resource: ["invoice"], 
				operation: ["sendByEmail"],
				useTemplate: [false]
			},
		},
	},
	{
		displayName: "Text",
		name: "text",
		type: "string",
		required: true,
		default: "",
		typeOptions: { multiline: true },
		displayOptions: {
			show: { 
				resource: ["invoice"], 
				operation: ["sendByEmail"],
				useTemplate: [false]
			},
		},
	},
	{
		displayName: "Send Type",
		name: "sendType",
		type: "options",
		options: [
			{ name: "Standard (VP)", value: "VP" },
			{ name: "Registered Mail (VR)", value: "VR" },
			{ name: "Express (VE)", value: "VE" },
			{ name: "Priority (VZ)", value: "VZ" }
		],
		default: "VP",
		description: "Type of sending method for the invoice",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["sendByEmail"] },
		},
	},
	{
		displayName: "CC Email",
		name: "ccEmail",
		type: "string",
		default: "",
		placeholder: "cc@email.com",
		description: "Carbon copy email address",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["sendByEmail"] },
		},
	},
	{
		displayName: "Copy",
		name: "copy",
		type: "boolean",
		default: false,
		displayOptions: {
			show: { resource: ["invoice"], operation: ["sendByEmail"] },
		},
	},
	{
		displayName: "Additional Attachments",
		name: "additionalAttachments",
		type: "string",
		default: "",
		description:
			"String of IDs of existing documents in your sevdesk account separated by comma",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["sendByEmail"] },
		},
	},
	{
		displayName: "BCC Email",
		name: "bccEmail",
		type: "string",
		default: "",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["sendByEmail"] },
		},
	},
	{
		displayName: "Send XML",
		name: "sendXml",
		type: "boolean",
		default: false,
		displayOptions: {
			show: { resource: ["invoice"], operation: ["sendByEmail"] },
		},
	},
	{
		displayName: "Force Reload",
		name: "forceReload",
		type: "boolean",
		default: false,
		displayOptions: {
			show: { resource: ["invoice"], operation: ["renderPdf"] },
		},
	},
	{
		displayName: "Download",
		name: "download",
		type: "boolean",
		default: true,
		description: "Whether to download the PDF file as binary data",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadPdf"] },
		},
	},
	{
		displayName: "Preventive",
		name: "preventive",
		type: "boolean",
		default: false,
		description: "Generate preventive PDF (for drafts or preview)",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadPdf"] },
		},
	},
	{
		displayName: "Template",
		name: "template",
		type: "options",
		options: [
			{ name: "Default", value: "default" },
			{ name: "Standard", value: "standard" },
			{ name: "Modern", value: "modern" },
			{ name: "Classic", value: "classic" },
			{ name: "Minimal", value: "minimal" },
		],
		default: "default",
		description: "PDF template to use for generation",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadPdf"] },
		},
	},
	{
		displayName: "Language",
		name: "language",
		type: "options",
		options: [
			{ name: "German", value: "de" },
			{ name: "English", value: "en" },
			{ name: "French", value: "fr" },
			{ name: "Spanish", value: "es" },
			{ name: "Italian", value: "it" },
		],
		default: "de",
		description: "Language for the PDF document",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadPdf"] },
		},
	},
	{
		displayName: "Letter Paper",
		name: "letterPaper",
		type: "boolean",
		default: false,
		description: "Use letter paper format instead of A4",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadPdf"] },
		},
	},
	{
		displayName: "Draft Mode",
		name: "draft",
		type: "boolean",
		default: false,
		description: "Generate PDF in draft mode with watermark",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadPdf"] },
		},
	},
	{
		displayName: "XML Format",
		name: "xmlFormat",
		type: "options",
		options: [
			{ name: "XRechnung", value: "xrechnung" },
			{ name: "ZUGFeRD", value: "zugferd" },
			{ name: "FacturX", value: "facturx" },
			{ name: "UBL", value: "ubl" },
			{ name: "Standard", value: "standard" },
		],
		default: "xrechnung",
		description: "XML format for e-invoice generation",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadXml"] },
		},
	},
	{
		displayName: "XML Version",
		name: "xmlVersion",
		type: "options",
		options: [
			{ name: "Version 1.0", value: "1.0" },
			{ name: "Version 2.0", value: "2.0" },
			{ name: "Version 2.1", value: "2.1" },
			{ name: "Version 3.0", value: "3.0" },
		],
		default: "2.1",
		description: "Version of the XML standard to use",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadXml"] },
		},
	},
	{
		displayName: "Include Attachments",
		name: "includeAttachments",
		type: "boolean",
		default: false,
		description: "Include file attachments in the XML export",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadXml"] },
		},
	},
	{
		displayName: "Enable Validation",
		name: "enableValidation",
		type: "boolean",
		default: true,
		description: "Validate XML against schema before export",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["downloadXml"] },
		},
	},
	{
		displayName: "Send Type",
		name: "sendType",
		type: "options",
		required: true,
		default: "VPR",
		options: [
			{
				name: "Print",
				value: "print",
				description: "Physical print and manual delivery"
			},
			{
				name: "Email (VMail)",
				value: "VMail",
				description: "Sent via email"
			},
			{
				name: "Fax (VMSC)",
				value: "VMSC",
				description: "Sent via fax"
			},
			{
				name: "Standard Post (VP)",
				value: "VP",
				description: "Standard postal service"
			},
			{
				name: "Registered Post (VPR)",
				value: "VPR",
				description: "Registered postal service with tracking"
			},
			{
				name: "Express (VE)",
				value: "VE",
				description: "Express delivery service"
			},
			{
				name: "Priority (VZ)",
				value: "VZ",
				description: "Priority postal service"
			},
			{
				name: "Digital (VD)",
				value: "VD",
				description: "Digital delivery (e.g., customer portal)"
			},
		],
		displayOptions: {
			show: { resource: ["invoice"], operation: ["markAsSent"] },
		},
	},
	{
		displayName: "Send Date",
		name: "sendDate",
		type: "dateTime",
		default: "",
		description: "Date when the invoice was sent (defaults to current date)",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["markAsSent"] },
		},
	},
	{
		displayName: "Tracking Code",
		name: "trackingCode",
		type: "string",
		default: "",
		description: "Tracking number for postal/courier services",
		displayOptions: {
			show: { 
				resource: ["invoice"], 
				operation: ["markAsSent"],
				sendType: ["VPR", "VE", "VZ"]
			},
		},
	},
	{
		displayName: "Send Cost",
		name: "sendCost",
		type: "number",
		default: 0,
		description: "Cost of sending the invoice",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["markAsSent"] },
		},
	},
	{
		displayName: "Additional Info",
		name: "additionalInfo",
		type: "string",
		default: "",
		description: "Additional information about the sending process",
		displayOptions: {
			show: { resource: ["invoice"], operation: ["markAsSent"] },
		},
	},
];
