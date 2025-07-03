import { INodeProperties } from "n8n-workflow";

export const orderPosOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["orderPos"],
			},
		},
		options: [
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many order positions",
				routing: {
					request: {
						method: "GET",
						url: "/OrderPos",
						qs: {
							"order[id]": "={{$parameter.orderId}}",
							"order[objectName]": "Order",
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
				action: "Get an order position",
				routing: {
					request: {
						method: "GET",
						url: "=/OrderPos/{{$parameter.orderPosId}}",
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
				action: "Update an order position",
				routing: {
					request: {
						method: "PUT",
						url: "=/OrderPos/{{$parameter.orderPosId}}",
					},
				},
			},
			{
				name: "Delete",
				value: "delete",
				action: "Delete an order position",
				routing: {
					request: {
						method: "DELETE",
						url: "=/OrderPos/{{$parameter.orderPosId}}",
					},
				},
			},
		],
		default: "getMany",
	},
];

export const orderPosFields: INodeProperties[] = [
	{
		displayName: "Order ID",
		name: "orderId",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["orderPos"],
				operation: ["getMany"],
			},
		},
	},
	{
		displayName: "Order Position ID",
		name: "orderPosId",
		type: "string",
		required: true,
		default: "",
		displayOptions: {
			show: {
				resource: ["orderPos"],
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
				resource: ["orderPos"],
				operation: ["update"],
			},
		},
		options: [
			{
				displayName: "Discount",
				name: "discount",
				type: "number",
				default: 0,
			},
			{
				displayName: "Name",
				name: "name",
				type: "string",
				default: "",
			},
			{
				displayName: "Price",
				name: "price",
				type: "number",
				default: 0,
			},
			{
				displayName: "Quantity",
				name: "quantity",
				type: "number",
				default: 0,
			},
			{
				displayName: "Text",
				name: "text",
				type: "string",
				default: "",
			},
		],
	},
];
