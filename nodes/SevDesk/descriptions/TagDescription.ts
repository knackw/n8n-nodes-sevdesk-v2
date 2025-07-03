import { INodeProperties } from "n8n-workflow";

export const tagOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["tag"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a tag",
				routing: {
					request: {
						method: "POST",
						url: "/Tag/Factory/createTag",
						body: {
							name: "={{$parameter.name}}",
							object:
								'={"id": "{{$parameter.objectId}}", "objectName": "{{$parameter.objectName}}"}',
						},
					},
				},
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete a tag",
				routing: {
					request: {
						method: "DELETE",
						url: "=/Tag/{{$parameter.id}}",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get a tag",
				routing: {
					request: {
						method: "GET",
						url: "=/Tag/{{$parameter.id}}",
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
				action: "Get many tags",
				routing: {
					request: {
						method: "GET",
						url: "/Tag",
						qs: {
							id: "={{$parameter.filters.id}}",
							name: "={{$parameter.filters.name}}",
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
				action: "Update a tag",
				routing: {
					request: {
						method: "PUT",
						url: "=/Tag/{{$parameter.id}}",
						body: {
							name: "={{$parameter.name}}",
						},
					},
				},
			},
		],
		default: "getMany",
	},
];

export const tagFields: INodeProperties[] = [
	{
		displayName: "ID",
		name: "id",
		type: "string",
		displayOptions: {
			show: {
				resource: ["tag"],
				operation: ["get", "delete", "update"],
			},
		},
		default: "",
		description: "The ID of the tag",
	},
	{
		displayName: "Name",
		name: "name",
		type: "string",
		displayOptions: {
			show: {
				resource: ["tag"],
				operation: ["create", "update"],
			},
		},
		default: "",
		description: "The name of the tag",
	},
	{
		displayName: "Filters",
		name: "filters",
		type: "collection",
		placeholder: "Add Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["tag"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "ID",
				name: "id",
				type: "string",
				default: "",
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
			},
		],
	},
	{
		displayName: "Object ID",
		name: "objectId",
		type: "string",
		displayOptions: {
			show: {
				resource: ["tag"],
				operation: ["create"],
			},
		},
		default: "",
		description: "The ID of the object to associate the tag with",
	},
	{
		displayName: "Object Name",
		name: "objectName",
		type: "string",
		displayOptions: {
			show: {
				resource: ["tag"],
				operation: ["create"],
			},
		},
		default: "",
		description:
			"The type of the object to associate the tag with (e.g. Invoice, Contact)",
	},
];
