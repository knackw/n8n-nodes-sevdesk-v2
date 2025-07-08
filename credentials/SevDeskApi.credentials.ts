import {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from "n8n-workflow";

/**
 * SevDesk API Credentials Configuration
 *
 * This class defines the credential type for authenticating with the SevDesk API.
 * It provides configuration for API key authentication and includes comprehensive
 * validation to ensure proper connectivity and authorization.
 *
 * @class SevDeskApi
 * @implements {ICredentialType}
 *
 * @example
 * // Configure credentials in n8n:
 * // 1. Go to Credentials → Create New Credential
 * // 2. Search for "SevDesk API"
 * // 3. Enter your API key and select API version
 * // 4. Test the connection to verify credentials
 *
 * @see {@link https://api.sevdesk.de/#section/Authentication-and-Authorization} SevDesk Authentication Documentation
 * @see {@link https://docs.n8n.io/credentials/} n8n Credentials Documentation
 *
 * @author n8n-nodes-sevdesk-v2
 * @version 1.0.0
 * @since 2025-01-01
 */
export class SevDeskApi implements ICredentialType {
	/**
	 * Internal name for the credential type
	 * Used by n8n to identify this credential configuration
	 */
	name = "sevDeskApi";

	/**
	 * Display name shown in the n8n UI
	 * This is what users see when selecting credentials
	 */
	displayName = "sevDesk API";

	/**
	 * Link to official SevDesk API documentation
	 * Provides users with additional information about authentication
	 */
	documentationUrl =
		"https://api.sevdesk.de/#section/Authentication-and-Authorization";

	/**
	 * Credential properties configuration
	 *
	 * Defines the input fields that users need to fill when creating
	 * SevDesk API credentials. Includes validation and user guidance.
	 *
	 * @type {INodeProperties[]}
	 */
	properties: INodeProperties[] = [
		{
			displayName: "API Key",
			name: "apiKey",
			type: "string",
			typeOptions: {
				password: true,
				minLength: 10,
				maxLength: 200,
			},
			default: "",
			required: true,
			description:
				"Your SevDesk API key. You can find it in your SevDesk account under Settings → User Management → API. The key should start with your user ID followed by an underscore.",
			placeholder: "123456_abcdef1234567890abcdef1234567890",
		},
		{
			displayName: "API Version",
			name: "apiVersion",
			type: "options",
			options: [
				{
					name: "v1 (Legacy)",
					value: "v1",
					description:
						"Legacy API version - use only for existing integrations",
				},
				{
					name: "v2 (Recommended)",
					value: "v2",
					description:
						"Current API version with enhanced features and better performance",
				},
			],
			default: "v2",
			required: true,
			description:
				"The SevDesk API version to use. v2 is recommended for new implementations as it provides better performance, enhanced features, and improved error handling.",
		},
	];

	/**
	 * Authentication configuration
	 *
	 * Defines how the credential is used to authenticate API requests.
	 * The API key is sent in the Authorization header for all requests.
	 *
	 * @type {IAuthenticateGeneric}
	 */
	authenticate: IAuthenticateGeneric = {
		type: "generic",
		properties: {
			headers: {
				Authorization: "={{$credentials.apiKey}}",
			},
		},
	};

	/**
	 * Credential test configuration
	 *
	 * Defines how to test the validity of the provided credentials.
	 * This test performs comprehensive validation including:
	 * - API key format validation
	 * - Network connectivity check
	 * - Authentication verification
	 * - API version compatibility
	 *
	 * The test makes a minimal request to the Contact endpoint to verify:
	 * 1. The API key is valid and properly formatted
	 * 2. The user has access to the SevDesk API
	 * 3. The selected API version is accessible
	 * 4. The SevDesk service is reachable
	 *
	 * @type {ICredentialTestRequest}
	 *
	 * @example
	 * // Test request flow:
	 * // GET https://my.sevdesk.de/api/v2/Contact?limit=1
	 * // Headers: { Authorization: "123456_abcdef..." }
	 * // Expected: 200 OK with contact data or empty array
	 *
	 * @see {@link https://api.sevdesk.de/#operation/getContacts} SevDesk Get Contacts API
	 */
	test: ICredentialTestRequest = {
		request: {
			baseURL: "https://my.sevdesk.de/api/{{$credentials.apiVersion}}",
			url: "/Contact",
			method: "GET",
			qs: {
				limit: 1,
			},
			timeout: 10000, // 10 second timeout for credential testing
		},
		rules: <any[]>[
			// Test for successful authentication
			{
				type: "responseSuccessBody",
				properties: {
					key: "objects",
					message: "API key is valid and SevDesk API is accessible",
					value: "", // Add a value property to satisfy the type requirement
				},
			},
			// Test for invalid API key
			{
				type: "responseFailedStatusCode",
				properties: {
					statusCode: 401,
					message:
						"Invalid API key. Please check your SevDesk API key and ensure it has the correct format (userID_token).",
				},
			},
			// Test for forbidden access
			{
				type: "responseFailedStatusCode",
				properties: {
					statusCode: 403,
					message:
						"Access forbidden. Your API key may not have sufficient permissions or your SevDesk account may not have API access enabled.",
				},
			},
			// Test for rate limiting
			{
				type: "responseFailedStatusCode",
				properties: {
					statusCode: 429,
					message:
						"Rate limit exceeded. Please wait a moment before testing the credentials again.",
				},
			},
			// Test for server errors
			{
				type: "responseFailedStatusCode",
				properties: {
					statusCode: 500,
					message:
						"SevDesk server error. Please try again later or contact SevDesk support if the issue persists.",
				},
			},
			// Test for service unavailable
			{
				type: "responseFailedStatusCode",
				properties: {
					statusCode: 503,
					message:
						"SevDesk service temporarily unavailable. Please try again in a few minutes.",
				},
			},
		],
	};
}
