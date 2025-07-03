import { INodeProperties } from "n8n-workflow";

export const contactAddressOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["contactAddress"],
			},
		},
		options: [
			{
				name: "Create",
				value: "create",
				description: "Create a contact address",
				action: "Create a contact address",
				routing: {
					request: {
						method: "POST",
						url: "/ContactAddress",
						body: {
							contact: "={{$parameter.contact}}",
							street: "={{$parameter.street}}",
							zip: "={{$parameter.zip}}",
							city: "={{$parameter.city}}",
							country: "={{$parameter.country}}",
							category: "={{$parameter.category}}",
							name: "={{$parameter.name}}",
							name2: "={{$parameter.name2}}",
							name3: "={{$parameter.name3}}",
							name4: "={{$parameter.name4}}",
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
				action: "Deletes a contact address",
				routing: {
					request: {
						method: "DELETE",
						url: "/ContactAddress/{{$parameter.contactAddressId}}",
					},
				},
			},
			{
				name: "Get",
				value: "get",
				action: "Get a contact address",
				routing: {
					request: {
						method: "GET",
						url: "/ContactAddress/{{$parameter.contactAddressId}}",
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
				description: "Gets a List of ContactAddresses",
				action: "Get many contact addresses",
				routing: {
					request: {
						method: "GET",
						url: "/ContactAddress",
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
				action: "Updates a contact address",
				routing: {
					request: {
						method: "PUT",
						url: "/ContactAddress/{{$parameter.contactAddressId}}",
						body: {
							contact: "={{$parameter.contact}}",
							street: "={{$parameter.street}}",
							zip: "={{$parameter.zip}}",
							city: "={{$parameter.city}}",
							country: "={{$parameter.country}}",
							category: "={{$parameter.category}}",
							name: "={{$parameter.name}}",
							name2: "={{$parameter.name2}}",
							name3: "={{$parameter.name3}}",
							name4: "={{$parameter.name4}}",
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

export const contactAddressFields: INodeProperties[] = [
	{
		displayName: "Contact Address ID",
		name: "contactAddressId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["contactAddress"],
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
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Contact ID",
				name: "id",
				type: "string",
				default: "",
				description: "The contact to which this contact address belongs",
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
		displayName: "Street",
		name: "street",
		description: "Street name",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Zip Code",
		name: "zip",
		description: "Zip code of the address",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "City",
		name: "city",
		description: "City of the address",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Country",
		name: "country",
		type: "collection",
		placeholder: "Add Country Info",
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Country ID",
				name: "id",
				type: "string",
				default: "",
				description:
					"Country of the contact address. For all countries, spend a GET to /StaticCountry.",
			},
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "StaticCountry",
				description: 'Object name is "StaticCountry"',
			},
		],
	},
	{
		displayName: "Category",
		name: "category",
		type: "collection",
		placeholder: "Add Category Info",
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
		options: [
			{
				displayName: "Category ID",
				name: "id",
				type: "string",
				default: "",
				description:
					"Category of the contact address. For all categories, send a GET to /Category?objectType=ContactAddress.",
			},
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "Category",
				description: 'Object name is "Category"',
			},
		],
	},
	{
		displayName: "Name",
		name: "name",
		description: "Name in address",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Name 2",
		name: "name2",
		description: "Second name in address",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Name 3",
		name: "name3",
		description: "Third name in address",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
	},
	{
		displayName: "Name 4",
		name: "name4",
		description: "Fourth name in address",
		type: "string",
		default: "",
		displayOptions: {
			show: {
				resource: ["contactAddress"],
				operation: ["create", "update"],
			},
		},
	},
];
