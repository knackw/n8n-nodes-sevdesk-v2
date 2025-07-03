import { INodeProperties } from "n8n-workflow";

export const checkAccountOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		default: "getMany",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
			},
		},
		options: [
			{
				name: "Create Clearing Account",
				value: "createClearingAccount",
				action: "Create a new clearing account",
				routing: {
					request: {
						method: "POST",
						url: "/CheckAccount/Factory/clearingAccount",
						body: {
							name: "={{$parameter.name}}",
							accountingNumber: "={{$parameter.accountingNumber}}",
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
				name: "Create File Import Account",
				value: "createFileImportAccount",
				action: "Create a new file import account",
				routing: {
					request: {
						method: "POST",
						url: "/CheckAccount/Factory/fileImportAccount",
						body: {
							name: "={{$parameter.name}}",
							importType: "={{$parameter.importType}}",
							accountingNumber: "={{$parameter.accountingNumber}}",
							iban: "={{$parameter.iban}}",
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
				name: "Delete",
				value: "delete",
				action: "Delete a check account",
				routing: {
					request: {
						method: "DELETE",
						url: "/CheckAccount/{{$parameter.checkAccountId}}",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get a check account",
				routing: {
					request: {
						method: "GET",
						url: "/CheckAccount/{{$parameter.checkAccountId}}",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Get Balance at Date",
				value: "getBalanceAtDate",
				action: "Get balance at given date",
				routing: {
					request: {
						method: "GET",
						url: "/CheckAccount/{{$parameter.checkAccountId}}/getBalanceAtDate",
						qs: {
							date: "={{$parameter.date}}",
						},
					},
					output: {
						postReceive: [
							{
								type: "setKeyValue",
								properties: {
									balance: "={{$response.body.objects}}",
								},
							},
						],
					},
				},
			},
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many check accounts",
				routing: {
					request: {
						method: "GET",
						url: "/CheckAccount",
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
				action: "Update a check account",
				routing: {
					request: {
						method: "PUT",
						url: "/CheckAccount/{{$parameter.checkAccountId}}",
						body: {
							name: "={{$parameter.name}}",
							type: "={{$parameter.type}}",
							importType: "={{$parameter.importType}}",
							currency: "={{$parameter.currency}}",
							defaultAccount: "={{$parameter.defaultAccount}}",
							status: "={{$parameter.status}}",
							autoMapTransactions: "={{$parameter.autoMapTransactions}}",
							accountingNumber: "={{$parameter.accountingNumber}}",
						},
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
		],
	},
];

export const checkAccountFields: INodeProperties[] = [
	{
		displayName: "ID",
		name: "checkAccountId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["delete", "get", "getBalanceAtDate", "update"],
			},
		},
		description: "ID of check account",
	},
	{
		displayName: "Name",
		name: "name",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: [
					"createClearingAccount",
					"createFileImportAccount",
					"update",
				],
			},
		},
		description: "Name of the check account",
	},
	{
		displayName: "Accounting Number",
		name: "accountingNumber",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: [
					"createClearingAccount",
					"createFileImportAccount",
					"update",
				],
			},
		},
		description: "The booking account used for this clearing account",
	},
	{
		displayName: "Import Type",
		name: "importType",
		type: "options",
		options: [
			{ name: "CSV", value: "CSV" },
			{ name: "MT940", value: "MT940" },
		],
		default: "CSV",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["createFileImportAccount", "update"],
			},
		},
		description:
			"Import type. Transactions can be imported by this method on the check account.",
	},
	{
		displayName: "IBAN",
		name: "iban",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["createFileImportAccount"],
			},
		},
		description: "IBAN of the bank account, without spaces",
	},
	{
		displayName: "Type",
		name: "type",
		type: "options",
		options: [
			{ name: "Online", value: "online" },
			{ name: "Offline", value: "offline" },
		],
		default: "online",
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["update"],
			},
		},
		description: "Type of the check account",
	},
	{
		displayName: "Currency",
		name: "currency",
		type: "string",
		default: "EUR",
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["update"],
			},
		},
		description: "The currency of the check account",
	},
	{
		displayName: "Default Account",
		name: "defaultAccount",
		type: "boolean",
		default: false,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["update"],
			},
		},
		description: "Whether this check account is the default account",
	},
	{
		displayName: "Status",
		name: "status",
		type: "options",
		options: [
			{ name: "Active", value: 100 },
			{ name: "Archived", value: 200 },
		],
		default: 100,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["update"],
			},
		},
		description: "Status of the check account",
	},
	{
		displayName: "Auto Map Transactions",
		name: "autoMapTransactions",
		type: "boolean",
		default: false,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["update"],
			},
		},
		description:
			"Whether transactions on this account are automatically mapped to invoice and vouchers when imported if possible",
	},
	{
		displayName: "Date",
		name: "date",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccount"],
				operation: ["getBalanceAtDate"],
			},
		},
		description: "Only consider transactions up to this date at 23:59:59",
	},
];
