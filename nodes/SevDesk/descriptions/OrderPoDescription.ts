import { INodeProperties } from "n8n-workflow";

export const orderPoOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["orderPo"],
			},
		},
		options: [
			{
				name: "Get Many",
				value: "getMany",
				description: "Get many order positions",
				action: "Get many order positions",
				routing: {
					request: {
						method: "GET",
						url: "/OrderPos",
						qs: {
							"order[id]": "={{$parameter.filters.orderId}}",
							"order[objectName]": "Order",
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
		default: "getMany",
	},
];

// @ts-ignore
export const orderPoFields: INodeProperties[] = [
	{
		displayName: "Filters",
		name: "filters",
		type: "collection",
		placeholder: "Add Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["orderPo"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Order ID",
				name: "orderId",
				type: "string",
				default: "",
				description: "The ID of the order to retrieve positions for",
			},
		],
	},
];
