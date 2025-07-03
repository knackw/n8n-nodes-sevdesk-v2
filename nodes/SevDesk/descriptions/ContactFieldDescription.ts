import { INodeProperties } from "n8n-workflow";

export const contactFieldOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["contactField"],
			},
		},
		options: [
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many contact fields",
				routing: {
					request: {
						method: "GET",
						url: "/ContactField",
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

export const contactFieldFields: INodeProperties[] = [];
