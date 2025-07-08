import {
	IExecuteFunctions,
	IHttpRequestOptions,
	IDataObject,
} from "n8n-workflow";
import { ContactHandler } from "../../nodes/SevDesk/handlers/ContactHandler";
import axios from "axios";

// Mock axios for integration tests
jest.mock("axios");
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("ContactApi Integration Tests", () => {
	let contactHandler: ContactHandler;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;
	let mockHttpRequest: jest.MockedFunction<any>;

	beforeEach(() => {
		// Create mock httpRequest function
		mockHttpRequest = jest.fn();

		// Create mock execute functions
		mockExecuteFunctions = {
			getCredentials: jest.fn(),
			getNodeParameter: jest.fn(),
			getNode: jest.fn(),
			helpers: {
				httpRequest: mockHttpRequest,
			},
		} as any;

		// Ensure httpRequest is properly mocked
		(mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>) =
			jest.fn();

		// Setup default credentials
		mockExecuteFunctions.getCredentials.mockResolvedValue({
			apiKey: "test-api-key-12345",
			apiVersion: "v2",
		});

		mockExecuteFunctions.getNode.mockReturnValue({
			id: "test-node-id",
			name: "Test SevDesk Node",
			type: "n8n-nodes-sevdesk-v2.sevDesk",
			typeVersion: 1,
			position: [100, 200],
			parameters: {},
		});

		contactHandler = new ContactHandler(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Authentication", () => {
		it("should authenticate successfully with valid credentials", async () => {
			const mockAuthResponse = {
				objects: [{ success: true }],
				total: 1,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				mockAuthResponse,
			);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "contactId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute("get", 0);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "test-api-key-12345",
					}),
				}),
			);
		});

		it("should handle authentication failure", async () => {
			const mockAuthError = new Error("Authentication failed");
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockAuthError);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "contactId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			await expect(contactHandler.execute("get", 0)).rejects.toThrow();
		});

		it("should handle rate limiting", async () => {
			mockExecuteFunctions.helpers.httpRequest.mockImplementation(
				(options: IHttpRequestOptions) => {
					if (options.url?.includes("/Contact")) {
						throw new Error("Rate limit exceeded");
					}
					return Promise.resolve({ objects: [], total: 0 });
				},
			);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "contactId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			await expect(contactHandler.execute("get", 0)).rejects.toThrow(
				"Rate limit exceeded",
			);
		});
	});

	describe("Contact CRUD Operations", () => {
		it("should create contact successfully", async () => {
			const mockCreateResponse = {
				objects: [
					{
						id: "12345",
						name: "Test Company",
						objectName: "Contact",
					},
				],
				total: 1,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				mockCreateResponse,
			);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "additionalFields":
							return { name: "Test Company" };
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute("create", 0);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "POST",
					url: expect.stringContaining("/Contact"),
					body: expect.objectContaining({
						name: "Test Company",
					}),
				}),
			);
		});

		it("should read contacts successfully", async () => {
			const mockContactsResponse = {
				objects: [
					{ id: "1", name: "Company 1", objectName: "Contact" },
					{ id: "2", name: "Company 2", objectName: "Contact" },
				],
				total: 2,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				mockContactsResponse,
			);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "additionalFields":
							return { limit: 50 };
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute("getAll", 0);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: expect.stringContaining("/Contact"),
				}),
			);
		});

		it("should update contact successfully", async () => {
			const mockUpdateResponse = {
				objects: [
					{
						id: "12345",
						name: "Updated Company",
						objectName: "Contact",
					},
				],
				total: 1,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				mockUpdateResponse,
			);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "contactId":
							return "12345";
						case "updateFields":
							return { name: "Updated Company" };
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute("update", 0);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "PUT",
					url: expect.stringContaining("/Contact/12345"),
				}),
			);
		});

		it("should delete contact successfully", async () => {
			const mockDeleteResponse = {
				objects: [],
				total: 0,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				mockDeleteResponse,
			);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "contactId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute("delete", 0);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "DELETE",
					url: expect.stringContaining("/Contact/12345"),
				}),
			);
		});
	});

	describe("Custom Contact Operations", () => {
		it("should check customer number availability", async () => {
			const mockAvailabilityResponse = {
				objects: [{ available: true }],
				total: 1,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				mockAvailabilityResponse,
			);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "customerNumber":
							return "CUST-001";
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute(
				"checkCustomerNumberAvailability",
				0,
			);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: expect.stringContaining(
						"/Contact/Mapper/checkCustomerNumberAvailability",
					),
					qs: { customerNumber: "CUST-001" },
				}),
			);
		});

		it("should find contact by custom field value", async () => {
			const mockSearchResponse = {
				objects: [
					{ id: "12345", name: "Found Contact", objectName: "Contact" },
				],
				total: 1,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(
				mockSearchResponse,
			);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "customFieldSetting":
							return { id: "1", objectName: "ContactCustomFieldSetting" };
						case "value":
							return "search-value";
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute("findByCustomFieldValue", 0);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: expect.stringContaining(
						"/Contact/Factory/findContactByCustomFieldValue",
					),
				}),
			);
		});
	});

	describe("Error Handling", () => {
		it("should handle rate limit errors", async () => {
			const rateLimitError = new Error("Rate limit exceeded");
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				rateLimitError,
			);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			await expect(contactHandler.execute("getAll", 0)).rejects.toThrow(
				"Rate limit exceeded",
			);
		});

		it("should handle validation errors", async () => {
			const validationError = new Error("Validation failed");
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				validationError,
			);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "additionalFields":
							return { name: "Test" };
						default:
							return undefined;
					}
				},
			);

			await expect(contactHandler.execute("create", 0)).rejects.toThrow(
				"Validation failed",
			);
		});

		it("should handle timeout errors", async () => {
			const timeoutError = new Error("timeout of 30000ms exceeded");
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(timeoutError);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			await expect(contactHandler.execute("getAll", 0)).rejects.toThrow(
				"timeout of 30000ms exceeded",
			);
		});
	});

	describe("Data Transformation", () => {
		it("should transform response data correctly for single contact", async () => {
			const mockResponse = {
				objects: [
					{
						id: "12345",
						name: "Test Company",
						familyname: "Doe",
						surename: "John",
						objectName: "Contact",
					},
				],
				total: 1,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "additionalFields":
							return { name: "Test Company" };
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute("create", 0);

			expect(result).toBeDefined();
			expect(result?.json).toHaveProperty("id", "12345");
			expect(result?.json).toHaveProperty("name", "Test Company");
			expect(result?.json).toHaveProperty("objectName", "Contact");
		});

		it("should transform response data correctly for multiple contacts", async () => {
			const mockResponse = {
				objects: [
					{ id: "1", name: "Company 1", objectName: "Contact" },
					{ id: "2", name: "Company 2", objectName: "Contact" },
				],
				total: 2,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "additionalFields":
							return {};
						default:
							return undefined;
					}
				},
			);

			const result = await contactHandler.execute("getAll", 0);

			expect(result).toBeDefined();
			expect(Array.isArray(result?.json)).toBe(true);
			expect((result?.json as any[]).length).toBe(2);
		});
	});
});
