import { INodeProperties } from "n8n-workflow";

export const creditNotePosOperations: INodeProperties[] = [
	{
		displayName: "Operation",
		name: "operation",
		type: "options",
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ["creditNotePos"],
			},
		},
		options: [
			{
				name: "Get Many",
				value: "getMany",
				action: "Get many credit note positions",
				routing: {
					request: {
						method: "GET",
						url: "/CreditNotePos",
						qs: "={{$parameter.filters}}" as any,
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

export const creditNotePosFields: INodeProperties[] = [
	{
		displayName: "Filters",
		name: "filters",
		type: "collection",
		placeholder: "Add Filter",
		default: {},
		displayOptions: {
			show: {
				resource: ["creditNotePos"],
				operation: ["getMany"],
			},
		},
		options: [
			{
				displayName: "Credit Note ID",
				name: "creditNote[id]",
				type: "string",
				default: "",
				description:
					"Retrieve all creditNote positions belonging to this creditNote. Must be provided with creditNote[objectName].",
			},
			{
				displayName: "Credit Note Object Name",
				name: "creditNote[objectName]",
				type: "string",
				default: "CreditNote",
				description:
					"Only required if creditNote[ID] was provided. Should be used as value.",
			},
		],
	},
];
