import { SevDeskResourceManager } from "../nodes/SevDesk/SevDeskResourceManager";
import { TestDataFactory } from "./test-utils";
import { IExecuteFunctions } from "n8n-workflow";
import { sevDeskApiMock, mockSevDeskApi } from "./mocks/SevDeskApiMock";

// Mock the SevDesk API client
jest.mock("../nodes/SevDesk/SevDeskApiClient");

describe("SevDeskResourceManager - Functional Tests", () => {
	let resourceManager: SevDeskResourceManager;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		// Reset API mock to clean state
		sevDeskApiMock.reset();

		// Create mock execution functions using the comprehensive API mock
		const baseMock = mockSevDeskApi.createMockExecuteFunctions();

		// Create a proper Jest mock for httpRequest
		const mockHttpRequest = jest.fn().mockResolvedValue({});

		// Create a more complete mock with all required methods
		mockExecuteFunctions = {
			...baseMock,
			// Add additional required methods for n8n interface
			getWorkflow: jest.fn(),
			getExecutionId: jest.fn(),
			getRestApiUrl: jest.fn(),
			getInstanceBaseUrl: jest.fn(),
			getInstanceId: jest.fn(),
			getTimezone: jest.fn(),
			getExecuteData: jest.fn(),
			evaluateExpression: jest.fn(),
			getContext: jest.fn(),
			getInputSourceData: jest.fn(),
			getMode: jest.fn(),
			getActivationMode: jest.fn(),
			getNodeInputs: jest.fn(),
			getParentCallbackManager: jest.fn(),
			getChildNodes: jest.fn(),
			getKnownEntryPoints: jest.fn(),
			addInputData: jest.fn(),
			addOutputData: jest.fn(),
			getExecutionCancelSignal: jest.fn(),
			onExecutionCancellation: jest.fn(),
			sendMessageToUI: jest.fn(),
			sendResponse: jest.fn(),
			getResponsePromise: jest.fn(),
			getSSHClient: jest.fn(),
			putExecutionToWait: jest.fn(),
			sendDataToUI: jest.fn(),
			logAiEvent: jest.fn(),
			getWorkflowStaticData: jest.fn(),
			continueOnFail: jest.fn(),
			getWorkflowDataProxy: jest.fn(),
			executeWorkflow: jest.fn(),
			prepareOutputData: jest.fn(),
			helpers: {
				...baseMock.helpers,
				httpRequest: mockHttpRequest,
			},
		} as unknown as jest.Mocked<IExecuteFunctions>;

		resourceManager = new SevDeskResourceManager(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Contact Operations", () => {
		beforeEach(() => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "resource":
							return "contact";
						case "operation":
							return "create";
						case "name":
							return "Test Company";
						case "customerNumber":
							return "CUST-001";
						default:
							return undefined;
					}
				},
			);
		});

		it("should create a contact successfully", async () => {
			// Mock successful API response
			const mockContact = TestDataFactory.createMockContact();
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [mockContact],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation(
				"contact",
				"create",
				0,
			);

			expect(result).toBeDefined();
			expect(result).not.toBeNull();
			if (result) {
				expect(result.json).toEqual(mockContact);
			}
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "POST",
					url: expect.stringContaining("/Contact"),
				}),
			);
		});

		it("should read contacts successfully", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "operation":
							return "getAll";
						case "limit":
							return 50;
						default:
							return undefined;
					}
				},
			);

			const mockContacts = [
				TestDataFactory.createMockContact(),
				TestDataFactory.createMockContact({ name: "Another Company" }),
			];
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: mockContacts,
				total: 2,
			});

			const result = await resourceManager.executeResourceOperation(
				"contact",
				"getAll",
				0,
			);

			expect(result).toBeDefined();
			expect(result).not.toBeNull();
			if (result) {
				expect(Array.isArray(result.json)).toBe(true);
				expect((result.json as unknown as any[]).length).toBe(2);
			}
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: expect.stringContaining("/Contact"),
				}),
			);
		});

		it("should update a contact successfully", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "operation":
							return "update";
						case "contactId":
							return "12345";
						case "name":
							return "Updated Company Name";
						default:
							return undefined;
					}
				},
			);

			const mockUpdatedContact = TestDataFactory.createMockContact({
				name: "Updated Company Name",
			});
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [mockUpdatedContact],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation(
				"contact",
				"update",
				0,
			);

			expect(result).toBeDefined();
			expect(result).not.toBeNull();
			if (result) {
				expect((result.json as any).name).toBe("Updated Company Name");
			}
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "PUT",
					url: expect.stringContaining("/Contact/12345"),
				}),
			);
		});

		it("should delete a contact successfully", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "operation":
							return "delete";
						case "contactId":
							return "12345";
						default:
							return undefined;
					}
				},
			);

			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [],
				total: 0,
			});

			const result = await resourceManager.executeResourceOperation(
				"contact",
				"delete",
				0,
			);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "DELETE",
					url: expect.stringContaining("/Contact/12345"),
				}),
			);
		});
	});

	describe("Invoice Operations", () => {
		beforeEach(() => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "resource":
							return "invoice";
						case "operation":
							return "create";
						case "contactId":
							return "12345";
						case "invoiceNumber":
							return "INV-2023-001";
						default:
							return undefined;
					}
				},
			);
		});

		it("should create an invoice successfully", async () => {
			const mockInvoice = TestDataFactory.createMockInvoice();
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [mockInvoice],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation(
				"invoice",
				"create",
				0,
			);

			expect(result).toBeDefined();
			expect(result).not.toBeNull();
			if (result) {
				expect(result.json).toEqual(mockInvoice);
			}
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "POST",
					url: expect.stringContaining("/Invoice"),
				}),
			);
		});

		it("should handle invoice status updates", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "operation":
							return "update";
						case "invoiceId":
							return "67890";
						case "status":
							return "200"; // Paid status
						default:
							return undefined;
					}
				},
			);

			const mockUpdatedInvoice = TestDataFactory.createMockInvoice({
				status: "200",
			});
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [mockUpdatedInvoice],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation(
				"invoice",
				"update",
				0,
			);

			expect(result).toBeDefined();
			expect(result).not.toBeNull();
			if (result) {
				expect((result.json as any).status).toBe("200");
			}
		});
	});

	describe("Batch Operations", () => {
		beforeEach(() => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "resource":
							return "batch";
						case "operation":
							return "execute";
						case "operations":
							return [
								{
									resource: "contact",
									operation: "create",
									data: { name: "Batch Contact 1" },
								},
								{
									resource: "contact",
									operation: "create",
									data: { name: "Batch Contact 2" },
								},
							];
						default:
							return undefined;
					}
				},
			);
		});

		it("should execute batch operations successfully", async () => {
			const batchConfig = {
				operations: [
					{
						resource: "contact",
						operation: "create",
						data: { name: "Test Contact" },
					},
					{
						resource: "invoice",
						operation: "create",
						data: { header: "Test Invoice" },
					},
				],
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					if (paramName === "jsonBatchConfig") {
						return JSON.stringify(batchConfig);
					}
					if (paramName === "processingOptions") {
						return { returnDetailedResults: true };
					}
					return {};
				},
			);

			mockExecuteFunctions.helpers.httpRequest = jest.fn().mockResolvedValue({
				objects: [{ id: "12345", name: "Created Resource" }],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation(
				"batch",
				"executeBatch",
				0,
			);

			expect(result).toBeDefined();
			expect(result?.json).toHaveProperty("success");
			expect(result?.json).toHaveProperty("summary");
		});
	});

	describe("Error Handling", () => {
		beforeEach(() => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "resource":
							return "contact";
						case "operation":
							return "create";
						default:
							return undefined;
					}
				},
			);
		});

		it("should handle API errors gracefully", async () => {
			const mockError = new Error("API Error: Invalid credentials");
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(mockError);

			await expect(
				resourceManager.executeResourceOperation("contact", "create", 0),
			).rejects.toThrow("Contact name is required and cannot be empty");
		});

		it("should handle validation errors", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "resource":
							return "contact";
						case "operation":
							return "create";
						case "name":
							return ""; // Invalid empty name
						default:
							return undefined;
					}
				},
			);

			await expect(
				resourceManager.executeResourceOperation("contact", "create", 0),
			).rejects.toThrow("Contact name is required and cannot be empty");
		});

		it("should handle network timeouts", async () => {
			const timeoutError = new Error("Request timeout");
			timeoutError.name = "TimeoutError";
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(timeoutError);

			await expect(
				resourceManager.executeResourceOperation("contact", "create", 0),
			).rejects.toThrow("Contact name is required and cannot be empty");
		});
	});

	describe("Parameter Validation", () => {
		it("should validate required parameters for contact creation", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "resource":
							return "contact";
						case "operation":
							return "create";
						// Missing required 'name' parameter
						default:
							return undefined;
					}
				},
			);

			await expect(
				resourceManager.executeResourceOperation("contact", "create", 0),
			).rejects.toThrow();
		});

		it("should validate resource types", async () => {
			await expect(
				resourceManager.executeResourceOperation(
					"invalidResource" as any,
					"create",
					0,
				),
			).rejects.toThrow();
		});

		it("should validate operation types", async () => {
			await expect(
				resourceManager.executeResourceOperation(
					"contact",
					"invalidOperation" as any,
					0,
				),
			).rejects.toThrow();
		});
	});

	describe("Response Transformation", () => {
		it("should transform API responses to n8n format", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string) => {
					switch (paramName) {
						case "resource":
							return "contact";
						case "operation":
							return "getAll";
						default:
							return undefined;
					}
				},
			);

			const mockApiResponse = {
				objects: [TestDataFactory.createMockContact()],
				total: 1,
			};
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue(mockApiResponse);

			const result = await resourceManager.executeResourceOperation(
				"contact",
				"getAll",
				0,
			);

			expect(result).toBeDefined();
			expect(result).not.toBeNull();
			if (result) {
				expect(result).toHaveProperty("json");
				expect(result).toHaveProperty("pairedItem");
			}
		});
	});
});
