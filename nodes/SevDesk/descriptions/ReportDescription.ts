import { INodeProperties } from "n8n-workflow";

export const reportOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["report"],
			},
		},
		options: [
			{
				name: "Invoice List",
				value: "invoiceList",
				action: "Get invoice list report",
				routing: {
					request: {
						method: "GET",
						url: "/Report/invoicelist",
						qs: {
							download: "={{$parameter.download}}",
							type: "={{$parameter.type}}",
							sevQuery: "={{$parameter.sevQuery}}",
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
				name: "Order List",
				value: "orderList",
				action: "Get order list report",
				routing: {
					request: {
						method: "GET",
						url: "/Report/orderlist",
						qs: {
							download: "={{$parameter.download}}",
							type: "={{$parameter.type}}",
							sevQuery: "={{$parameter.sevQuery}}",
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
				name: "Contact List",
				value: "contactList",
				action: "Get contact list report",
				routing: {
					request: {
						method: "GET",
						url: "/Report/contactlist",
						qs: {
							download: "={{$parameter.download}}",
							sevQuery: "={{$parameter.sevQuery}}",
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
				name: "Voucher List",
				value: "voucherList",
				action: "Get voucher list report",
				routing: {
					request: {
						method: "GET",
						url: "/Report/voucherlist",
						qs: {
							download: "={{$parameter.download}}",
							sevQuery: "={{$parameter.sevQuery}}",
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
		default: "invoiceList",
	},
];

export const reportFields: INodeProperties[] = [
	{
		displayName: "Download",
		name: "download",
		type: "boolean",
		displayOptions: {
			show: {
				resource: ["report"],
			},
		},
		default: false,
		description: "Whether the report will be downloaded as a file",
	},
	{
		displayName: "Type",
		name: "type",
		type: "string",
		displayOptions: {
			show: {
				resource: ["report"],
				operation: ["invoiceList", "orderList"],
			},
		},
		default: "",
		description:
			'Type of report. e.g. "VRE" for invoice list, "all" for order list.',
	},
	{
		displayName: "Additional Fields",
		name: "sevQuery",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["report"],
			},
		},
		options: [
			{
				displayName: "Contact",
				name: "contact",
				type: "string",
				default: "",
				description: "Retrieve all invoices of this contact",
			},
			{
				displayName: "Start Date",
				name: "startDate",
				type: "string",
				default: "",
				description: "Retrieve all invoices with a date equal or higher",
			},
			{
				displayName: "End Date",
				name: "endDate",
				type: "string",
				default: "",
				description: "Retrieve all invoices with a date equal or lower",
			},
		],
	},
];
