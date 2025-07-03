import { INodeProperties } from "n8n-workflow";

export const countryOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		default: "getMany",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["country"],
			},
		},
		options: [
			{
				name: "Get Many",
				value: "getMany",
				action: "Gets many countries",
				description: "Gets many countries",
				routing: {
					request: {
						method: "GET",
						url: "/StaticCountry",
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

export const countryFields: INodeProperties[] = [];
