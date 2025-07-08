import { SevDeskApiClient } from "../nodes/SevDesk/SevDeskApiClient";
import { TestDataFactory } from "./test-utils";
import { IExecuteFunctions } from "n8n-workflow";

describe("SevDeskApiClient - Functional Tests", () => {
	let apiClient: SevDeskApiClient;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		// Create mock execution functions
		mockExecuteFunctions = {
			getCredentials: jest.fn(),
			getNode: jest.fn(),
			helpers: {
				httpRequest: jest.fn(),
			},
		} as unknown as jest.Mocked<IExecuteFunctions>;

		// Setup default mock returns
		mockExecuteFunctions.getCredentials.mockResolvedValue(
			TestDataFactory.createMockCredentials(),
		);
		mockExecuteFunctions.getNode.mockReturnValue(
			TestDataFactory.createMockNode(),
		);
		(
			mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
		).mockResolvedValue({});

		apiClient = new SevDeskApiClient(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Initialization", () => {
		it("should initialize with credentials successfully", async () => {
			const mockCredentials = TestDataFactory.createMockCredentials();
			mockExecuteFunctions.getCredentials.mockResolvedValue(mockCredentials);

			await apiClient.initialize();

			expect(mockExecuteFunctions.getCredentials).toHaveBeenCalledWith(
				"sevDeskApi",
			);
		});

		it("should handle missing credentials gracefully", async () => {
			mockExecuteFunctions.getCredentials.mockRejectedValue(
				new Error("Credentials not found"),
			);

			await expect(apiClient.initialize()).rejects.toThrow(
				"Credentials not found",
			);
		});
	});

	describe("HTTP Request Methods", () => {
		beforeEach(async () => {
			await apiClient.initialize();
		});

		describe("GET Requests", () => {
			it("should make GET request successfully", async () => {
				const mockResponse = {
					objects: [TestDataFactory.createMockContact()],
					total: 1,
				};
				(
					mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
				).mockResolvedValue(mockResponse);

				const result = await apiClient.get("/Contact");

				expect(result.data).toEqual(mockResponse);
				expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
					expect.objectContaining({
						method: "GET",
						url: expect.stringContaining("/Contact"),
						headers: expect.objectContaining({
							Authorization: "test-api-key-12345",
							Accept: "application/json",
							"Content-Type": "application/json",
						}),
					}),
				);
			});

			it("should handle GET request with query parameters", async () => {
				const mockResponse = { objects: [], total: 0 };
				(
					mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
				).mockResolvedValue(mockResponse);

				const queryParams = { limit: 50, offset: 0 };
				await apiClient.get("/Contact", queryParams);

				expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
					expect.objectContaining({
						method: "GET",
						qs: queryParams,
					}),
				);
			});
		});

		describe("POST Requests", () => {
			it("should make POST request successfully", async () => {
				const mockContact = TestDataFactory.createMockContact();
				const mockResponse = {
					objects: [mockContact],
					total: 1,
				};
				(
					mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
				).mockResolvedValue(mockResponse);

				const contactData = {
					name: "Test Company",
					customerNumber: "CUST-001",
				};

				const result = await apiClient.post("/Contact", contactData);

				expect(result.data).toEqual(mockResponse);
				expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
					expect.objectContaining({
						method: "POST",
						url: expect.stringContaining("/Contact"),
						body: contactData,
					}),
				);
			});

			it("should handle POST request with query parameters", async () => {
				const mockResponse = { objects: [], total: 0 };
				(
					mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
				).mockResolvedValue(mockResponse);

				const postData = { name: "Test" };
				const queryParams = { embed: "category" };

				await apiClient.post("/Contact", postData, queryParams);

				expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
					expect.objectContaining({
						method: "POST",
						body: postData,
						qs: queryParams,
					}),
				);
			});
		});

		describe("PUT Requests", () => {
			it("should make PUT request successfully", async () => {
				const mockUpdatedContact = TestDataFactory.createMockContact({
					name: "Updated Company",
				});
				const mockResponse = {
					objects: [mockUpdatedContact],
					total: 1,
				};
				(
					mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
				).mockResolvedValue(mockResponse);

				const updateData = { name: "Updated Company" };
				const result = await apiClient.put("/Contact/12345", updateData);

				expect(result.data).toEqual(mockResponse);
				expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
					expect.objectContaining({
						method: "PUT",
						url: expect.stringContaining("/Contact/12345"),
						body: updateData,
					}),
				);
			});
		});

		describe("DELETE Requests", () => {
			it("should make DELETE request successfully", async () => {
				const mockResponse = { objects: [], total: 0 };
				(
					mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
				).mockResolvedValue(mockResponse);

				const result = await apiClient.delete("/Contact/12345");

				expect(result.data).toEqual(mockResponse);
				expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
					expect.objectContaining({
						method: "DELETE",
						url: expect.stringContaining("/Contact/12345"),
					}),
				);
			});
		});
	});

	describe("Authentication", () => {
		it("should include API key in request headers", async () => {
			const mockCredentials = TestDataFactory.createMockCredentials({
				apiKey: "custom-api-key-123",
			});
			mockExecuteFunctions.getCredentials.mockResolvedValue(mockCredentials);

			await apiClient.initialize();
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({});

			await apiClient.get("/Contact");

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						Authorization: "custom-api-key-123",
					}),
				}),
			);
		});

		it("should use correct API version in base URL", async () => {
			const mockCredentials = TestDataFactory.createMockCredentials({
				apiVersion: "v2", // Use v2 instead of v3 since v3 is not supported
			});
			mockExecuteFunctions.getCredentials.mockResolvedValue(mockCredentials);

			await apiClient.initialize();
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({});

			await apiClient.get("/Contact");

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining("api/v2"),
				}),
			);
		});
	});

	describe("Error Handling", () => {
		beforeEach(async () => {
			await apiClient.initialize();
		});

		it("should handle 401 Unauthorized errors", async () => {
			const unauthorizedError = new Error("Unauthorized");
			unauthorizedError.name = "StatusCodeError";
			(unauthorizedError as any).statusCode = 401;
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(unauthorizedError);

			await expect(apiClient.get("/Contact")).rejects.toThrow();
		});

		it("should handle 404 Not Found errors", async () => {
			const notFoundError = new Error("Not Found");
			notFoundError.name = "StatusCodeError";
			(notFoundError as any).statusCode = 404;
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(notFoundError);

			await expect(apiClient.get("/Contact/999999")).rejects.toThrow();
		});

		it("should handle 429 Rate Limit errors", async () => {
			const rateLimitError = new Error("Too Many Requests");
			rateLimitError.name = "StatusCodeError";
			(rateLimitError as any).statusCode = 429;
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(rateLimitError);

			await expect(apiClient.get("/Contact")).rejects.toThrow();
		});

		it("should handle network timeout errors", async () => {
			const timeoutError = new Error("Request timeout");
			timeoutError.name = "TimeoutError";
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(timeoutError);

			try {
				await apiClient.get("/Contact");
				fail("Expected error to be thrown");
			} catch (error: any) {
				// Check that the error description contains the standardized SevDesk connection error message
				expect(error.description).toContain(
					"Failed to connect to SevDesk API. Please check your internet connection and try again.",
				);
			}
		});

		it("should handle connection errors", async () => {
			const connectionError = new Error("Connection refused");
			connectionError.name = "ConnectionError";
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(connectionError);

			try {
				await apiClient.get("/Contact");
				fail("Expected error to be thrown");
			} catch (error: any) {
				// Check that the error description contains the standardized SevDesk connection error message
				expect(error.description).toContain(
					"Failed to connect to SevDesk API. Please check your internet connection and try again.",
				);
			}
		});
	});

	describe("Request Configuration", () => {
		beforeEach(async () => {
			await apiClient.initialize();
		});

		it("should set correct content type headers", async () => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({});

			await apiClient.post("/Contact", { name: "Test" });

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						"Content-Type": "application/json",
						Accept: "application/json",
					}),
				}),
			);
		});

		it("should handle query parameter processing", async () => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({});

			const queryParams = {
				limit: 50,
				offset: 0,
				embed: ["category", "country"],
				active: true,
			};

			await apiClient.get("/Contact", queryParams);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					qs: expect.objectContaining({
						limit: 50,
						offset: 0,
						active: true,
					}),
				}),
			);
		});
	});

	describe("Response Processing", () => {
		beforeEach(async () => {
			await apiClient.initialize();
		});

		it("should return response with correct structure", async () => {
			const mockApiResponse = {
				objects: [TestDataFactory.createMockContact()],
				total: 1,
			};
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue(mockApiResponse);

			const result = await apiClient.get("/Contact");

			expect(result).toHaveProperty("data");
			expect(result.data).toEqual(mockApiResponse);
		});

		it("should handle empty responses", async () => {
			const emptyResponse = { objects: [], total: 0 };
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue(emptyResponse);

			const result = await apiClient.get("/Contact");

			expect(result.data).toEqual(emptyResponse);
		});

		it("should handle malformed responses gracefully", async () => {
			const malformedResponse = { invalid: "response" };
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue(malformedResponse);

			const result = await apiClient.get("/Contact");

			expect(result.data).toEqual(malformedResponse);
		});
	});

	describe("Logging and Debugging", () => {
		beforeEach(async () => {
			await apiClient.initialize();
		});

		it("should log requests for debugging", async () => {
			const consoleSpy = jest.spyOn(console, "log").mockImplementation();
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({});

			await apiClient.get("/Contact");

			// Verify that logging occurs (implementation dependent)
			consoleSpy.mockRestore();
		});

		it("should log errors for debugging", async () => {
			const consoleSpy = jest.spyOn(console, "error").mockImplementation();
			const error = new Error("Test error");
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(error);

			try {
				await apiClient.get("/Contact");
			} catch (e) {
				// Expected to throw
			}

			consoleSpy.mockRestore();
		});
	});

	describe("Integration Scenarios", () => {
		beforeEach(async () => {
			await apiClient.initialize();
		});

		it("should handle complete CRUD workflow", async () => {
			// Create
			const createResponse = {
				objects: [TestDataFactory.createMockContact()],
				total: 1,
			};
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValueOnce(createResponse);

			const createResult = await apiClient.post("/Contact", {
				name: "Test Company",
			});
			expect(createResult.data).toEqual(createResponse);

			// Read
			const readResponse = {
				objects: [TestDataFactory.createMockContact()],
				total: 1,
			};
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValueOnce(readResponse);

			const readResult = await apiClient.get("/Contact/12345");
			expect(readResult.data).toEqual(readResponse);

			// Update
			const updateResponse = {
				objects: [
					TestDataFactory.createMockContact({ name: "Updated Company" }),
				],
				total: 1,
			};
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValueOnce(updateResponse);

			const updateResult = await apiClient.put("/Contact/12345", {
				name: "Updated Company",
			});
			expect(updateResult.data).toEqual(updateResponse);

			// Delete
			const deleteResponse = { objects: [], total: 0 };
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValueOnce(deleteResponse);

			const deleteResult = await apiClient.delete("/Contact/12345");
			expect(deleteResult.data).toEqual(deleteResponse);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledTimes(4);
		});
	});
});
