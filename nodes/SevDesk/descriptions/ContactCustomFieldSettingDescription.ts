import { INodeProperties } from "n8n-workflow";

export const contactCustomFieldSettingOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["contactCustomFieldSetting"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a contact field setting",
				routing: {
					request: {
						method: "POST",
						url: "/ContactCustomFieldSetting",
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
				action: "Delete a contact field setting",
				routing: {
					request: {
						method: "DELETE",
						url: "/ContactCustomFieldSetting/{{$parameter.contactCustomFieldSettingId}}",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get a contact field setting",
				routing: {
					request: {
						method: "GET",
						url: "/ContactCustomFieldSetting/{{$parameter.contactCustomFieldSettingId}}",
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
				action: "Get many contact field settings",
				routing: {
					request: {
						method: "GET",
						url: "/ContactCustomFieldSetting",
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
				action: "Update a contact field setting",
				routing: {
					request: {
						method: "PUT",
						url: "/ContactCustomFieldSetting/{{$parameter.contactCustomFieldSettingId}}",
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
		displayName: "Name",
		name: "name",
		type: "string",
		default: "",
		required: true,
	},
	{
		displayName: "Description",
		name: "description",
		type: "string",
		default: "",
	},
];

export const contactCustomFieldSettingFields: INodeProperties[] = [
	{
		displayName: "Contact Custom Field Setting ID",
		name: "contactCustomFieldSettingId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["contactCustomFieldSetting"],
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
				resource: ["contactCustomFieldSetting"],
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
				resource: ["contactCustomFieldSetting"],
				operation: ["update"],
			},
		},
		options: createOrUpdateFields,
	},
];
