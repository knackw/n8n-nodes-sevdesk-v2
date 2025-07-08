import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

/**
 * Starter API Credentials Configuration
 *
 * This is a simplified example of how to create credentials for an n8n node.
 * It demonstrates basic API key authentication pattern.
 *
 * @class StarterApi
 * @implements {ICredentialType}
 */
export class StarterApi implements ICredentialType {
	/**
	 * Internal name for the credential type
	 * Used by n8n to identify this credential configuration
	 */
	name = "starterApi";

	/**
	 * Display name shown in the n8n UI
	 */
	displayName = "Starter API";

	/**
	 * Link to documentation (replace with your API documentation)
	 */
	documentationUrl = "https://example.com/api-docs";

	/**
	 * Credential properties configuration
	 * Defines the input fields that users need to fill
	 */
	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: {
				password: true,
			},
			default: "",
			required: true,
			description: "Your API key for authentication",
			placeholder: "your-api-key-here",
		},
		{
			displayName: "Base URL",
			name: "baseUrl",
			type: "string",
			default: "https://api.example.com",
			required: true,
			description: "The base URL of the API",
			placeholder: "https://api.example.com",
		},
	];

	/**
	 * Authentication configuration
	 * Defines how the credential is used to authenticate API requests
	 */
	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				Authorization: "Bearer ={{$credentials.apiKey}}",
			},
		},
	};

	/**
	 * Test configuration to verify credentials
	 * This endpoint will be called when users test their credentials
	 */
	test: ICredentialTestRequest = {
		request: {
			baseURL: "={{$credentials.baseUrl}}",
			url: "/health", // Replace with your API's health check endpoint
			method: "GET",
		},
	};
}
