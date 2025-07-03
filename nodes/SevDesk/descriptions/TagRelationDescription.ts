import { INodeProperties } from "n8n-workflow";

export const tagRelationOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		options: [
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many tag relations",
				routing: {
					request: {
						method: "GET",
						url: "/TagRelation",
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

export const tagRelationFields: INodeProperties[] = [];
