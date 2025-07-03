import { INodeProperties } from "n8n-workflow";

export const basicsOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["basics"],
			},
		},
		options: [
			{
				name: "Get Bookkeeping System Version",
				value: "getBookkeepingSystemVersion",
				action: "Get the bookkeeping system version",
				routing: {
					request: {
						method: "GET",
						url: "/Tools/bookkeepingSystemVersion",
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
		default: "getBookkeepingSystemVersion",
	},
];

export const basicsFields: INodeProperties[] = [];
