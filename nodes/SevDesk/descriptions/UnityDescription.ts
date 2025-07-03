import { INodeProperties } from "n8n-workflow";

export const unityOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		default: "getMany",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["unity"],
			},
		},
		options: [
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many unities",
				routing: {
					request: {
						method: "GET",
						url: "/Unity",
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

export const unityFields: INodeProperties[] = [];
