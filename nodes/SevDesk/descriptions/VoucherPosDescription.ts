import { INodeProperties } from "n8n-workflow";

export const voucherPosOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		options: [
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many voucher pos",
				routing: {
					request: {
						method: "GET",
						url: "/VoucherPos",
						qs: {
							"voucher[id]": "={{$parameter.voucherId}}",
							"voucher[objectName]": "Voucher",
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

export const voucherPosFields: INodeProperties[] = [
	{
		displayName: "Voucher ID",
		name: "voucherId",
		type: "string",
		default: "",
		required: true,
		displayOptions: {
			show: {
				resource: ["voucherPos"],
				operation: ["getMany"],
			},
		},
	},
];
