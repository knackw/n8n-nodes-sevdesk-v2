import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

export class SevDeskApi implements ICredentialType {
	name = "sevDeskApi";
	displayName = "sevDesk API";
	documentationUrl =
		"https://api.sevdesk.de/#section/Authentication-and-Authorization";
	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: { password: true },
			default: "",
			description:
				"Your SevDesk API key. You can find it in your SevDesk account settings.",
		},
		{
			displayName: "API Version",
			name: "apiVersion",
			type: "options",
			options: [
				{
					name: "v1 (Legacy)",
					value: "v1",
				},
				{
					name: "v2 (Recommended)",
					value: "v2",
				},
			],
			default: "v2",
			description:
				"The API version to use. v2 is recommended for new implementations.",
		},
	];

	// This allows the credential to be used by other parts of n8n
	// stating how this credential is injected as part of the request
	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				Authorization: "={{$credentials.apiKey}}",
			},
		},
	};

	// The block below tells how this credential can be tested
	test: ICredentialTestRequest = {
		request: {
			baseURL: "https://my.sevdesk.de/api/{{$credentials.apiVersion}}/Contact",
			method: "GET",
			qs: {
				limit: 1,
			},
		},
	};
}
