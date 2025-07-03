import { INodeProperties } from "n8n-workflow";

export const checkAccountTransactionOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		default: "getMany",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a check account transaction",
				routing: {
					request: {
						method: "POST",
						url: "/CheckAccountTransaction",
						body: {
							checkAccount: {
								id: "={{$parameter.checkAccountId}}",
								objectName: "CheckAccount",
							},
							valueDate: "={{$parameter.valueDate}}",
							entryDate: "={{$parameter.entryDate}}",
							amount: "={{$parameter.amount}}",
							payeePayerName: "={{$parameter.payeePayerName}}",
							paymtPurpose: "={{$parameter.paymtPurpose}}",
							status: "={{$parameter.status}}",
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
				name: "Delete",
				value: "delete",
				action: "Delete a check account transaction",
				routing: {
					request: {
						method: "DELETE",
						url: "/CheckAccountTransaction/{{$parameter.checkAccountTransactionId}}",
					},
				},
			},
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many check account transactions",
				routing: {
					request: {
						method: "GET",
						url: "/CheckAccountTransaction",
						qs: {
							"checkAccount[id]": "={{$parameter.filters.checkAccountId}}",
							"checkAccount[objectName]": "CheckAccount",
							isBooked: "={{$parameter.filters.isBooked}}",
							paymtPurpose: "={{$parameter.filters.paymtPurpose}}",
							startDate: "={{$parameter.filters.startDate}}",
							endDate: "={{$parameter.filters.endDate}}",
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
				action: "Update a check account transaction",
				routing: {
					request: {
						method: "PUT",
						url: "/CheckAccountTransaction/{{$parameter.checkAccountTransactionId}}",
						body: {
							amount: "={{$parameter.amount}}",
							payeePayerName: "={{$parameter.payeePayerName}}",
							paymtPurpose: "={{$parameter.paymtPurpose}}",
							status: "={{$parameter.status}}",
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
	},
];

export const checkAccountTransactionFields: INodeProperties[] = [
	{
		displayName: "Check Account Transaction ID",
		name: "checkAccountTransactionId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["update", "delete"],
			},
		},
	},
	{
		displayName: "Check Account ID",
		name: "checkAccountId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Amount",
		name: "amount",
		type: "number",
		default: 0,
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Value Date",
		name: "valueDate",
		type: "dateTime",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Entry Date",
		name: "entryDate",
		type: "dateTime",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["create"],
			},
		},
	},
	{
		displayName: "Payee/Payer Name",
		name: "payeePayerName",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Payment Purpose",
		name: "paymtPurpose",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Status",
		name: "status",
		type: "options",
		default: "created",
		required: true,
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["create", "update"],
			},
		},
		options: [
			{ name: "Created", value: "created" },
			{ name: "Linked", value: "linked" },
			{ name: "Private", value: "private" },
			{ name: "Booked", value: "booked" },
		],
	},
	{
		displayName: "Filters",
		name: "filters",
		type: "collection",
		placeholder: "Add Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["checkAccountTransaction"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Check Account ID",
				name: "checkAccountId",
				type: "string",
				default: "",
			},
			{
				displayName: "End Date",
				name: "endDate",
				type: "dateTime",
				default: "",
			},
			{
				displayName: "Is Booked",
				name: "isBooked",
				type: "boolean",
				default: false,
			},
			{
				displayName: "Payment Purpose",
				name: "paymtPurpose",
				type: "string",
				default: "",
			},
			{
				displayName: "Start Date",
				name: "startDate",
				type: "dateTime",
				default: "",
			},
		],
	},
];
