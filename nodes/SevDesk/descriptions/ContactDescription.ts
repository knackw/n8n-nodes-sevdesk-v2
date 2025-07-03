import { INodeProperties } from "n8n-workflow";

export const contactOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["contact"],
			},
		},
		options: [
			{
				name: "Check Customer Number Availability",
				value: "checkCustomerNumberAvailability",
				description:
					"Checks if a given customer number is available or already used",
				action: "Check customer number availability",
				routing: {
					request: {
						method: "GET",
						url: "/Contact/Mapper/checkCustomerNumberAvailability",
						qs: {
							customerNumber: "={{$parameter.customerNumber}}",
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
				name: "Create",
				value: "create",
				action: "Create a contact",
				description: "Create a new contact",
				routing: {
					request: {
						method: "POST",
						url: "/Contact",
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
				description: "Delete the contact",
				action: "Delete a contact",
				routing: {
					request: {
						method: "DELETE",
						url: "/Contact/{{$parameter.contactId}}",
					},
				},
			},
			{
				name: "Find By Custom Field Value",
				value: "findByCustomFieldValue",
				description: "Finds contacts by custom field value",
				action: "Find contacts by custom field value",
				routing: {
					request: {
						method: "GET",
						url: "/Contact/Factory/findContactByCustomFieldValue",
						qs: {
							"customFieldSetting[id]": "={{$parameter.customFieldSetting.id}}",
							"customFieldSetting[objectName]":
								"={{$parameter.customFieldSetting.objectName}}",
							value: "={{$parameter.value}}",
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
				name: "Get",
				value: "get",
				description: "Returns a single contact",
				action: "Get a contact",
				routing: {
					request: {
						method: "GET",
						url: "/Contact/{{$parameter.contactId}}",
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
				description: "Gets a List of Contacts based on filters",
				action: "Get many contacts",
				routing: {
					request: {
						method: "GET",
						url: "/Contact",
						qs: {
							depth: "={{$parameter.filters.depth}}",
							"category[id]": "={{$parameter.filters.category.id}}",
							"category[objectName]":
								"={{$parameter.filters.category.objectName}}",
							city: "={{$parameter.filters.city}}",
							"tags[id]": "={{$parameter.filters.tags.id}}",
							"tags[objectName]": "={{$parameter.filters.tags.objectName}}",
							customerNumber: "={{$parameter.filters.customerNumber}}",
							"parent[id]": "={{$parameter.filters.parent.id}}",
							"parent[objectName]": "={{$parameter.filters.parent.objectName}}",
							name: "={{$parameter.filters.name}}",
							zip: "={{$parameter.filters.zip}}",
							"country[id]": "={{$parameter.filters.country.id}}",
							"country[objectName]":
								"={{$parameter.filters.country.objectName}}",
							createBefore: "={{$parameter.filters.createBefore}}",
							createAfter: "={{$parameter.filters.createAfter}}",
							updateBefore: "={{$parameter.filters.updateBefore}}",
							updateAfter: "={{$parameter.filters.updateAfter}}",
							"orderBy[customerNumber]":
								'={{$parameter.filters["orderBy[customerNumber]"]}}',
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
				name: "Get Next Customer Number",
				value: "getNextCustomerNumber",
				description:
					"Retrieves the next available customer number. Avoids duplicates.",
				action: "Get next customer number",
				routing: {
					request: {
						method: "GET",
						url: "/Contact/Factory/getNextCustomerNumber",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Get Number of Items",
				value: "getNumberOfItems",
				description:
					"Get number of all invoices, orders, etc. of a specified contact.",
				action: "Get number of items",
				routing: {
					request: {
						method: "GET",
						url: "/Contact/{{$parameter.contactId}}/getnumberOfAllItems",
					},
					output: {
						postReceive: [
							{ type: "rootProperty", properties: { property: "objects" } },
						],
					},
				},
			},
			{
				name: "Is Deletable",
				value: "isDeletable",
				description: "Check if a contact is deletable",
				action: "Check if a contact is deletable",
				routing: {
					request: {
						method: "GET",
						url: "/Contact/{{$parameter.contactId}}/getIsDeletable",
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
				description: "Update the contact",
				action: "Update a contact",
				routing: {
					request: {
						method: "PUT",
						url: "/Contact/{{$parameter.contactId}}",
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

const contactCreateAndUpdateFields: INodeProperties[] = [
	{
		displayName: "Name",
		name: "name",
		type: "string",
		default: "",
		description:
			"The organization name. Be aware that the type of contact will depend on this attribute. If it holds a value, the contact will be regarded as an organization.",
	},
	{
		displayName: "Status",
		name: "status",
		type: "number",
		default: 1000,
		description:
			"Defines the status of the contact. 100 -> Lead, 500 -> Pending, 1000 -> Active.",
	},
	{
		displayName: "Customer Number",
		name: "customerNumber",
		type: "string",
		default: "",
	},
	{
		displayName: "Parent",
		name: "parent",
		type: "collection",
		placeholder: "Add Parent Info",
		default: {},
		options: [
			{ displayName: "ID", name: "id", type: "string", default: "" },
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "Contact",
			},
		],
		description:
			"The parent contact to which this contact belongs. Must be an organization.",
	},
	{
		displayName: "Surename",
		name: "surename",
		type: "string",
		default: "",
		description: "The first name of the contact",
	},
	{
		displayName: "Familyname",
		name: "familyname",
		type: "string",
		default: "",
		description: "The last name of the contact",
	},
	{
		displayName: "Title",
		name: "titel",
		type: "string",
		default: "",
		description:
			"A non-academic title for the contact. Not to be used for organizations.",
	},
	{
		displayName: "Category",
		name: "category",
		type: "collection",
		placeholder: "Add Category Info",
		default: {},
		required: true,
		options: [
			{ displayName: "ID", name: "id", type: "string", default: "" },
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "Category",
			},
		],
		description: "Category of the contact",
	},
	{
		displayName: "Description",
		name: "description",
		type: "string",
		default: "",
	},
	{
		displayName: "Academic Title",
		name: "academicTitle",
		type: "string",
		default: "",
		description:
			"A academic title for the contact. Not to be used for organizations.",
	},
	{
		displayName: "Gender",
		name: "gender",
		type: "string",
		default: "",
		description: "Gender of the contact. Not to be used for organizations.",
	},
	{ displayName: "Name 2", name: "name2", type: "string", default: "" },
	{ displayName: "Birthday", name: "birthday", type: "string", default: "" },
	{ displayName: "Vat Number", name: "vatNumber", type: "string", default: "" },
	{
		displayName: "Bank Account",
		name: "bankAccount",
		type: "string",
		default: "",
	},
	{
		displayName: "Bank Number",
		name: "bankNumber",
		type: "string",
		default: "",
	},
	{
		displayName: "Default Cashback Time",
		name: "defaultCashbackTime",
		type: "number",
		default: 0,
	},
	{
		displayName: "Default Cashback Percent",
		name: "defaultCashbackPercent",
		type: "number",
		default: 0,
	},
	{
		displayName: "Default Discount Amount",
		name: "defaultDiscountAmount",
		type: "number",
		default: 0,
	},
	{
		displayName: "Default Discount Percentage",
		name: "defaultDiscountPercentage",
		type: "boolean",
		default: false,
	},
	{
		displayName: "Default Time To Pay",
		name: "defaultTimeToPay",
		type: "number",
		default: 0,
	},
	{ displayName: "Tax Number", name: "taxNumber", type: "string", default: "" },
	{
		displayName: "Exempt Vat",
		name: "exemptVat",
		type: "boolean",
		default: false,
	},
	{
		displayName: "Buyer Reference",
		name: "buyerReference",
		type: "string",
		default: "",
	},
	{
		displayName: "Government Agency",
		name: "governmentAgency",
		type: "boolean",
		default: false,
	},
];

export const contactFields: INodeProperties[] = [
	{
		displayName: "Contact ID",
		name: "contactId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: [
					"get",
					"update",
					"delete",
					"getNumberOfItems",
					"isDeletable",
				],
			},
		},
	},
	{
		displayName: "Customer Number",
		name: "customerNumber",
		description: "The customer number to be checked",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["checkCustomerNumberAvailability"],
			},
		},
	},
	{
		displayName: "Custom Field Setting",
		name: "customFieldSetting",
		type: "collection",
		placeholder: "Add Custom Field Setting",
		default: {},
		required: true,
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["findByCustomFieldValue"],
			},
		},
		options: [
			{
				displayName: "Custom Field Setting ID",
				name: "id",
				type: "string",
				default: "",
				description:
					"ID of ContactCustomFieldSetting for which the value has to be checked",
			},
			{
				displayName: "Object Name",
				name: "objectName",
				type: "string",
				default: "ContactCustomFieldSetting",
				description:
					"Object name. Only needed if you also defined the ID of a ContactCustomFieldSetting.",
			},
		],
	},
	{
		displayName: "Value",
		name: "value",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["findByCustomFieldValue"],
			},
		},
		description: "The value to be checked",
	},
	{
		displayName: "Filters",
		name: "filters",
		type: "collection",
		placeholder: "Add Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Category",
				name: "category",
				type: "collection",
				placeholder: "Add Category Info",
				default: {},
				options: [
					{ displayName: "ID", name: "id", type: "string", default: "" },
					{
						displayName: "Object Name",
						name: "objectName",
						type: "string",
						default: "Category",
					},
				],
			},
			{ displayName: "City", name: "city", type: "string", default: "" },
			{
				displayName: "Country",
				name: "country",
				type: "collection",
				placeholder: "Add Country Info",
				default: {},
				options: [
					{ displayName: "ID", name: "id", type: "string", default: "" },
					{
						displayName: "Object Name",
						name: "objectName",
						type: "string",
						default: "StaticCountry",
					},
				],
			},
			{
				displayName: "Create After",
				name: "createAfter",
				type: "dateTime",
				default: "",
			},
			{
				displayName: "Create Before",
				name: "createBefore",
				type: "dateTime",
				default: "",
			},
			{
				displayName: "Customer Number",
				name: "customerNumber",
				type: "string",
				default: "",
			},
			{
				displayName: "Depth",
				name: "depth",
				type: "number",
				default: 1,
				description:
					"Defines if both organizations and persons should be returned. 0 for only organizations, 1 for organizations and persons.",
			},
			{ displayName: "Name", name: "name", type: "string", default: "" },
			{
				displayName: "Order By Customer Number",
				name: "orderBy[customerNumber]",
				type: "options",
				options: [
					{ name: "ASC", value: "ASC" },
					{ name: "DESC", value: "DESC" },
				],
				default: "ASC",
			},
			{
				displayName: "Parent",
				name: "parent",
				type: "collection",
				placeholder: "Add Parent Info",
				default: {},
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
				displayName: "Tags",
				name: "tags",
				type: "collection",
				placeholder: "Add Tag Info",
				default: {},
				options: [
					{ displayName: "ID", name: "id", type: "string", default: "" },
					{
						displayName: "Object Name",
						name: "objectName",
						type: "string",
						default: "Tag",
					},
				],
			},
			{
				displayName: "Update After",
				name: "updateAfter",
				type: "dateTime",
				default: "",
			},
			{
				displayName: "Update Before",
				name: "updateBefore",
				type: "dateTime",
				default: "",
			},
			{ displayName: "Zip", name: "zip", type: "string", default: "" },
		],
	},
	{
		displayName: "Additional Fields",
		name: "additionalFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["create"],
			},
		},
		options: [...contactCreateAndUpdateFields],
	},
	{
		displayName: "Update Fields",
		name: "updateFields",
		type: "collection",
		placeholder: "Add Field",
		default: {},
		displayOptions: {
			show: {
				resource: ["contact"],
				operation: ["update"],
			},
		},
		options: [...contactCreateAndUpdateFields],
	},
];
