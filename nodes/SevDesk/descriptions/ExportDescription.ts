import { INodeProperties } from "n8n-workflow";

export const exportOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["export"],
			},
		},
		options: [
			{
				name: "Update Export Config",
				value: "updateExportConfig",
				action: "Update export config to export DATEV",
				routing: {
					request: {
						method: "PUT",
						url: "=/SevClient/{{$parameter.sevClientId}}/updateExportConfig",
						body: "={{$parameter.updateData}}" as any,
					},
				},
			},
			{
				name: "Export DATEV (Deprecated)",
				value: "exportDatev",
				action: "Export datev so zip with cs vs",
				routing: {
					request: {
						method: "GET",
						url: "/Export/datevCsv",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: { dataProperty: "data", fileName: "export.zip" },
							} as any,
						],
					},
				},
			},
			{
				name: "Start DATEV CSV Zip Export",
				value: "startLegacyDatevCsvExport",
				action:
					"Start an export that generates booking data in the DATEV format (CSV)",
				routing: {
					request: {
						method: "GET",
						url: "/Export/createDatevCsv?job=true",
						qs: "={{$parameter.options}}" as any,
					},
				},
			},
			{
				name: "Start DATEV XML Zip Export",
				value: "startLegacyDatevXmlExport",
				action:
					"Start an export that generate invoice data in the DATEV format (XML)",
				routing: {
					request: {
						method: "GET",
						url: "/Export/createDatevXml?job=true",
						qs: "={{$parameter.options}}" as any,
					},
				},
			},
			{
				name: "Generate Download Hash",
				value: "generateDownloadHash",
				action:
					"Generates an identifier to request the current export progress",
				routing: {
					request: {
						method: "GET",
						url: "=/Progress/generateDownloadHash",
						qs: "={{$parameter.options}}" as any,
					},
				},
			},
			{
				name: "Get Progress",
				value: "getProgress",
				action: "Get the progress state of the export",
				routing: {
					request: {
						method: "GET",
						url: "=/Progress/getProgress",
						qs: "={{$parameter.options}}" as any,
					},
				},
			},
			{
				name: "Get Job Download Info",
				value: "getJobDownloadInfo",
				action:
					"When the export job has finished you can call this endpoint to get the download all",
				routing: {
					request: {
						method: "GET",
						url: "=/Progress/jobDownloadInfo",
						qs: "={{$parameter.options}}" as any,
					},
				},
			},
			{
				name: "Export Invoice as CSV",
				value: "exportInvoiceCsv",
				action: "Export all invoices as csv",
				routing: {
					request: {
						method: "GET",
						url: "/Export/invoiceCsv",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: { dataProperty: "data", fileName: "invoices.csv" },
							} as any,
						],
					},
				},
			},
			{
				name: "Export Invoice as Zip",
				value: "exportInvoiceZip",
				action: "Export all invoices as zip",
				routing: {
					request: {
						method: "GET",
						url: "/Export/invoiceZip",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: { dataProperty: "data", fileName: "invoices.zip" },
							} as any,
						],
					},
				},
			},
			{
				name: "Export Credit Note as CSV",
				value: "exportCreditNoteCsv",
				action: "Export all credit notes as csv",
				routing: {
					request: {
						method: "GET",
						url: "/Export/creditNoteCsv",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: {
									dataProperty: "data",
									fileName: "creditnotes.csv",
								},
							} as any,
						],
					},
				},
			},
			{
				name: "Export Voucher as CSV",
				value: "exportVoucherCsv",
				action: "Export all vouchers as csv",
				routing: {
					request: {
						method: "GET",
						url: "/Export/voucherCsv",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: { dataProperty: "data", fileName: "vouchers.csv" },
							} as any,
						],
					},
				},
			},
			{
				name: "Export Voucher as Zip",
				value: "exportVoucherZip",
				action: "Export all vouchers as zip",
				routing: {
					request: {
						method: "GET",
						url: "/Export/voucherZip",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: { dataProperty: "data", fileName: "vouchers.zip" },
							} as any,
						],
					},
				},
			},
			{
				name: "Export Transaction as CSV",
				value: "exportTransactionCsv",
				action: "Export all transactions as csv",
				routing: {
					request: {
						method: "GET",
						url: "/Export/transactionCsv",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: {
									dataProperty: "data",
									fileName: "transactions.csv",
								},
							} as any,
						],
					},
				},
			},
			{
				name: "Export Contact as CSV",
				value: "exportContactCsv",
				action: "Export all contacts as csv",
				routing: {
					request: {
						method: "GET",
						url: "/Export/contactCsv",
						qs: "={{$parameter.options}}" as any,
						encoding: "raw" as any,
					},
					output: {
						postReceive: [
							{
								type: "binary",
								properties: { dataProperty: "data", fileName: "contacts.csv" },
							} as any,
						],
					},
				},
			},
		],
		default: "exportDatev",
	},
];

export const exportFields: INodeProperties[] = [
	{
		displayName: "Sev Client ID",
		name: "sevClientId",
		type: "number",
		required: true,
		displayOptions: {
			show: {
				resource: ["export"],
				operation: ["updateExportConfig"],
			},
		},
		default: 0,
	},
	{
		displayName: "Update Fields",
		name: "updateData",
		type: "collection",
		placeholder: "Add Update Data",
		default: {},
		displayOptions: {
			show: {
				resource: ["export"],
				operation: ["updateExportConfig"],
			},
		},
		options: [
			{
				displayName: "Accountant Number",
				name: "accountantNumber",
				type: "number",
				default: 0,
			},
			{
				displayName: "Accountant Client Number",
				name: "accountantClientNumber",
				type: "number",
				default: 0,
			},
			{
				displayName: "Accounting Year Begin",
				name: "accountingYearBegin",
				type: "string",
				default: "",
			},
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
				resource: ["export"],
				operation: [
					"exportDatev",
					"startLegacyDatevCsvExport",
					"startLegacyDatevXmlExport",
					"generateDownloadHash",
					"getProgress",
					"getJobDownloadInfo",
					"exportInvoiceCsv",
					"exportInvoiceZip",
					"exportCreditNoteCsv",
					"exportVoucherCsv",
					"exportVoucherZip",
					"exportTransactionCsv",
					"exportContactCsv",
				],
			},
		},
		options: [
			{
				displayName: "Archive Documents",
				name: "archiveDocuments",
				type: "boolean",
				default: false,
			},
			{
				displayName: "Download",
				name: "download",
				type: "boolean",
				default: false,
			},
			{ displayName: "End Date", name: "endDate", type: "string", default: "" },
			{
				displayName: "Enshrine Documents",
				name: "enshrineDocuments",
				type: "boolean",
				default: false,
			},
			{
				displayName: "Export By Payday",
				name: "exportByPayday",
				type: "boolean",
				default: false,
			},
			{ displayName: "Hash", name: "hash", type: "string", default: "" },
			{
				displayName: "Include Document XML",
				name: "includeDocumentXml",
				type: "boolean",
				default: false,
			},
			{
				displayName: "Include Enshrined",
				name: "includeEnshrined",
				type: "boolean",
				default: false,
			},
			{
				displayName: "Include Exported Documents",
				name: "includeExportedDocuments",
				type: "boolean",
				default: false,
			},
			{ displayName: "Job ID", name: "jobId", type: "string", default: "" },
			{
				displayName: "Sev Query",
				name: "sevQuery",
				type: "string",
				default: "",
			},
			{
				displayName: "Start Date",
				name: "startDate",
				type: "string",
				default: "",
			},
			{
				displayName: "Stateless",
				name: "stateless",
				type: "boolean",
				default: false,
			},
			{ displayName: "Types", name: "types", type: "string", default: "" },
		],
	},
];
