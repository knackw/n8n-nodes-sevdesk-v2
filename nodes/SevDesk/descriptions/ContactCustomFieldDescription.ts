import { INodeProperties } from "n8n-workflow";

export const contactCustomFieldOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["contactCustomField"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a contact custom field",
				routing: {
					request: {
						method: "POST",
						url: "/ContactCustomField",
						body: "={{$parameter.additionalFields}}" as any,
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
				action: "Delete a contact custom field",
				routing: {
					request: {
						method: "DELETE",
						url: "/ContactCustomField/{{$parameter.contactCustomFieldId}}",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get a contact custom field",
				routing: {
					request: {
						method: "GET",
						url: "/ContactCustomField/{{$parameter.contactCustomFieldId}}",
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
				action: "Get many contact custom fields",
				routing: {
					request: {
						method: "GET",
						url: "/ContactCustomField",
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
				action: "Update a contact custom field",
				routing: {
					request: {
						method: "PUT",
						url: "/ContactCustomField/{{$parameter.contactCustomFieldId}}",
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

const createOrUpdateFields: INodeProperties[] = [
	{
		displayName: "Contact",
		name: "contact",
		type: "collection",
		placeholder: "Add Contact",
		default: {},
		required: true,
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
		displayName: "Contact Custom Field Setting",
		name: "contactCustomFieldSetting",
		type: "collection",
		placeholder: "Add Setting",
		default: {},
		required: true,
		options: [
			{ displayName: "ID", name: "id", type: "string", default: "" },
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "ContactCustomFieldSetting",
			},
		],
	},
	{
		displayName: "Value",
		name: "value",
		type: "string",
		default: "",
		required: true,
	},
];

export const contactCustomFieldFields: INodeProperties[] = [
	{
		displayName: "Contact Custom Field ID",
		name: "contactCustomFieldId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["contactCustomField"],
				operation: ["get", "update", "delete"],
			},
		},
	},
	{
		displayName: "Additional Fields",
		name: "additionalFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["contactCustomField"],
				operation: ["create"],
			},
		},
		options: createOrUpdateFields,
	},
	{
		displayName: "Update Fields",
		name: "updateFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["contactCustomField"],
				operation: ["update"],
			},
		},
		options: createOrUpdateFields,
	},
];
