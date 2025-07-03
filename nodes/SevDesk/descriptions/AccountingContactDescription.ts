import { INodeProperties } from "n8n-workflow";

export const accountingContactOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["accountingContact"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create an accounting contact",
				routing: {
					request: {
						method: "POST",
						url: "/AccountingContact",
						body: {
							contact: "={{$parameter.contact}}",
							debitorNumber: "={{$parameter.debitorNumber}}",
							creditorNumber: "={{$parameter.creditorNumber}}",
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
				action: "Delete an accounting contact",
				routing: {
					request: {
						method: "DELETE",
						url: "/AccountingContact/{{$parameter.accountingContactId}}",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get an accounting contact",
				routing: {
					request: {
						method: "GET",
						url: "/AccountingContact/{{$parameter.accountingContactId}}",
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
				action: "Get many accounting contacts",
				routing: {
					request: {
						method: "GET",
						url: "/AccountingContact",
						qs: {
							contact: "={{$parameter.contactFilter}}",
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
				name: "Update",
				value: "update",
				action: "Update an accounting contact",
				routing: {
					request: {
						method: "PUT",
						url: "/AccountingContact/{{$parameter.accountingContactId}}",
						body: {
							contact: "={{$parameter.contact}}",
							debitorNumber: "={{$parameter.debitorNumber}}",
							creditorNumber: "={{$parameter.creditorNumber}}",
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
		default: "getMany",
	},
];

export const accountingContactFields: INodeProperties[] = [
	{
		displayName: "ID",
		name: "accountingContactId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["accountingContact"],
				operation: ["get", "update", "delete"],
			},
		},
		description: "ID of accounting contact",
	},
	{
		displayName: "Contact",
		name: "contact",
		type: "collection",
		placeholder: "Add Contact Info",
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ["accountingContact"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Contact ID",
				name: "id",
				type: "string",
				default: "",
				description: "The contact to which this accounting contact belongs",
			},
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "Contact",
				description: 'Object name is "Contact"',
			},
		],
	},
	{
		displayName: "Contact Filter",
		name: "contactFilter",
		type: "collection",
		placeholder: "Add Contact Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["accountingContact"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Contact ID",
				name: "id",
				type: "string",
				default: "",
				description: "ID of contact for which you want the accounting contact",
			},
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "Contact",
				description:
					"Object name. Only needed if you also defined the ID of a contact.",
			},
		],
	},
	{
		displayName: "Debitor Number",
		name: "debitorNumber",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["accountingContact"],
				operation: ["create", "update"],
			},
		},
		description: "Debitor number of the accounting contact",
	},
	{
		displayName: "Creditor Number",
		name: "creditorNumber",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["accountingContact"],
				operation: ["create", "update"],
			},
		},
		description: "Creditor number of the accounting contact",
	},
];
