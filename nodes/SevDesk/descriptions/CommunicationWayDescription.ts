import { INodeProperties } from "n8n-workflow";

export const communicationWayOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["communicationWay"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				action: "Create a communication way",
				routing: {
					request: {
						method: "POST",
						url: "/CommunicationWay",
						body: {
							contact: "={{$parameter.contact}}",
							key: "={{$parameter.key}}",
							type: "={{$parameter.type}}",
							value: "={{$parameter.value}}",
							main: "={{$parameter.main}}",
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
				action: "Deletes a communication way",
				routing: {
					request: {
						method: "DELETE",
						url: "/CommunicationWay/{{$parameter.communicationWayId}}",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get a communication way",
				routing: {
					request: {
						method: "GET",
						url: "/CommunicationWay/{{$parameter.communicationWayId}}",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Get Keys",
				value: "getKeys",
				action: "Get communication way keys",
				routing: {
					request: {
						method: "GET",
						url: "/CommunicationWayKey",
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
				action: "Gets many communication ways",
				routing: {
					request: {
						method: "GET",
						url: "/CommunicationWay",
						qs: {
							contact: "={{$parameter.filters.contact}}",
							type: "={{$parameter.filters.type}}",
							main: "={{$parameter.filters.main}}",
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
				action: "Update a communication way",
				routing: {
					request: {
						method: "PUT",
						url: "/CommunicationWay/{{$parameter.communicationWayId}}",
						body: {
							contact: "={{$parameter.contact}}",
							type: "={{$parameter.type}}",
							value: "={{$parameter.value}}",
							key: "={{$parameter.key}}",
							main: "={{$parameter.main}}",
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

export const communicationWayFields: INodeProperties[] = [
	{
		displayName: "Communication Way ID",
		name: "communicationWayId",
		required: true,
		description: "Unique identifier of the communication way",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["communicationWay"],
				operation: ["get", "update", "delete"],
			},
		},
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
				resource: ["communicationWay"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Contact ID",
				name: "id",
				type: "string",
				default: "",
				description: "The contact to which this communication way belongs",
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
		displayName: "Key",
		name: "key",
		type: "collection",
		placeholder: "Add Key Info",
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ["communicationWay"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Key ID",
				name: "id",
				type: "string",
				default: "",
				description: "The key of the communication way",
			},
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "CommunicationWayKey",
				description: 'Object name is "CommunicationWayKey"',
			},
		],
	},
	{
		displayName: "Communication Way Type",
		name: "type",
		required: true,
		description: "Type of the communication way",
		type: "options",
		default: "EMAIL",
		displayOptions: {
			show: {
				resource: ["communicationWay"],
				operation: ["create", "update"],
			},
		},
		options: [
			{ name: "Email", value: "EMAIL" },
			{ name: "Phone", value: "PHONE" },
			{ name: "Web", value: "WEB" },
			{ name: "Mobile", value: "MOBILE" },
		],
	},
	{
		displayName: "Value",
		name: "value",
		required: true,
		description:
			"The value of the communication way. For example the phone number, e-mail address or website.",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["communicationWay"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Main",
		name: "main",
		type: "boolean",
		default: false,
		description: "Whether this is the main communication way for the contact",
		displayOptions: {
			show: {
				resource: ["communicationWay"],
				operation: ["create", "update"],
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
				resource: ["communicationWay"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Contact",
				name: "contact",
				type: "collection",
				placeholder: "Add Contact Filter",
				default: {},
				options: [
					{
						displayName: "Contact ID",
						name: "id",
						type: "string",
						default: "",
						description:
							"ID of contact for which you want the communication ways",
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
				displayName: "Type",
				name: "type",
				type: "options",
				default: "EMAIL",
				options: [
					{ name: "Email", value: "EMAIL" },
					{ name: "Phone", value: "PHONE" },
					{ name: "Web", value: "WEB" },
					{ name: "Mobile", value: "MOBILE" },
				],
				description: "Type of the communication ways you want to get",
			},
			{
				displayName: "Main",
				name: "main",
				type: "boolean",
				default: false,
				description: "Whether you only want the main communication way",
			},
		],
	},
];
