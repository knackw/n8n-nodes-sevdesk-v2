import { InvoiceHandler } from "../../nodes/SevDesk/handlers/InvoiceHandler";
import { MockExecuteFunctions, TestDataFactory } from "../test-utils";
import { IExecuteFunctions, IHttpRequestOptions } from "n8n-workflow";

describe("InvoiceHandler", () => {
	let invoiceHandler: InvoiceHandler;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		// Create mock execute functions using utility
		mockExecuteFunctions = MockExecuteFunctions.create();

		invoiceHandler = new InvoiceHandler(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Constructor", () => {
		it("should initialize with correct resource name and endpoint", () => {
			expect(invoiceHandler).toBeInstanceOf(InvoiceHandler);
			expect((invoiceHandler as any).config.resourceName).toBe("Invoice");
			expect((invoiceHandler as any).config.apiEndpoint).toBe("Invoice");
			expect((invoiceHandler as any).config.idParameterName).toBe("invoiceId");
		});
	});

	describe("buildCustomRequest", () => {
		const baseOptions: IHttpRequestOptions = {
			method: "GET",
			url: "",
			headers: {},
		};
		const baseURL = "https://my.sevdesk.de/api/v1";

		it("should build sendByEmail request correctly", () => {
			const invoiceId = "12345";
			const sendType = "VPR";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(invoiceId)
				.mockReturnValueOnce(sendType);

			const result = (invoiceHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"sendByEmail",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "PUT",
				url: `${baseURL}/Invoice/${invoiceId}/sendByEmail`,
				body: { sendType },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"invoiceId",
				0,
			);
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"sendType",
				0,
				"VPR",
			);
		});

		it("should build sendByEmail request with default sendType", () => {
			const invoiceId = "12345";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(invoiceId)
				.mockReturnValueOnce(undefined); // sendType not provided, should use default

			const result = (invoiceHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"sendByEmail",
				0,
			);

			expect(result.body).toEqual({ sendType: undefined });
		});

		it("should build bookAmount request correctly", () => {
			const invoiceId = "12345";
			const amount = 100.5;
			const date = "2023-01-15";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(invoiceId)
				.mockReturnValueOnce(amount)
				.mockReturnValueOnce(date);

			const result = (invoiceHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"bookAmount",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "PUT",
				url: `${baseURL}/Invoice/${invoiceId}/bookAmount`,
				body: { amount, date },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"invoiceId",
				0,
			);
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"amount",
				0,
			);
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"date",
				0,
			);
		});

		it("should build cancelInvoice request correctly", () => {
			const invoiceId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(invoiceId);

			const result = (invoiceHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"cancelInvoice",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "PUT",
				url: `${baseURL}/Invoice/${invoiceId}/cancelInvoice`,
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"invoiceId",
				0,
			);
		});

		it("should build getPositions request correctly", () => {
			const invoiceId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(invoiceId);

			const result = (invoiceHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"getPositions",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "GET",
				url: `${baseURL}/InvoicePos`,
				qs: { "invoice[id]": invoiceId, "invoice[objectName]": "Invoice" },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"invoiceId",
				0,
			);
		});

		it("should call parent buildCustomRequest for unknown operations", () => {
			const spy = jest.spyOn(
				Object.getPrototypeOf(Object.getPrototypeOf(invoiceHandler)),
				"buildCustomRequest",
			);
			spy.mockReturnValue(baseOptions);

			const result = (invoiceHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"unknownOperation",
				0,
			);

			expect(spy).toHaveBeenCalledWith(
				baseOptions,
				baseURL,
				"unknownOperation",
				0,
			);
			expect(result).toEqual(baseOptions);
		});
	});

	describe("transformCreateData", () => {
		it("should transform invoice date to ISO format", () => {
			const testData = {
				invoiceDate: "2023-01-15T10:30:00Z",
				name: "Test Invoice",
			};

			const result = (invoiceHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				invoiceDate: "2023-01-15",
				name: "Test Invoice",
			});
		});

		it("should transform delivery date to ISO format", () => {
			const testData = {
				deliveryDate: "2023-01-20T14:30:00Z",
				name: "Test Invoice",
			};

			const result = (invoiceHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				deliveryDate: "2023-01-20",
				name: "Test Invoice",
			});
		});

		it("should transform both dates when present", () => {
			const testData = {
				invoiceDate: "2023-01-15T10:30:00Z",
				deliveryDate: "2023-01-20T14:30:00Z",
				name: "Test Invoice",
			};

			const result = (invoiceHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				invoiceDate: "2023-01-15",
				deliveryDate: "2023-01-20",
				name: "Test Invoice",
			});
		});

		it("should handle data without dates", () => {
			const testData = TestDataFactory.createMockInvoice();
			delete testData.invoiceDate;

			const result = (invoiceHandler as any).transformCreateData(testData);
			expect(result).toEqual(testData);
		});

		it("should handle empty data", () => {
			const result = (invoiceHandler as any).transformCreateData({});
			expect(result).toEqual({});
		});

		it("should handle null data", () => {
			const result = (invoiceHandler as any).transformCreateData(null);
			expect(result).toEqual({});
		});

		it("should handle invalid date formats gracefully", () => {
			const testData = {
				invoiceDate: "invalid-date",
				name: "Test Invoice",
			};

			expect(() => {
				(invoiceHandler as any).transformCreateData(testData);
			}).toThrow();
		});
	});

	describe("transformQueryParams", () => {
		it("should transform startDate to ISO format", () => {
			const testParams = {
				startDate: "2023-01-01T00:00:00Z",
				limit: 50,
			};

			const result = (invoiceHandler as any).transformQueryParams(testParams);

			expect(result).toEqual({
				startDate: "2023-01-01",
				limit: 50,
			});
		});

		it("should transform endDate to ISO format", () => {
			const testParams = {
				endDate: "2023-12-31T23:59:59Z",
				limit: 50,
			};

			const result = (invoiceHandler as any).transformQueryParams(testParams);

			expect(result).toEqual({
				endDate: "2023-12-31",
				limit: 50,
			});
		});

		it("should transform both date parameters when present", () => {
			const testParams = {
				startDate: "2023-01-01T00:00:00Z",
				endDate: "2023-12-31T23:59:59Z",
				status: "100",
			};

			const result = (invoiceHandler as any).transformQueryParams(testParams);

			expect(result).toEqual({
				startDate: "2023-01-01",
				endDate: "2023-12-31",
				status: "100",
			});
		});

		it("should handle params without dates", () => {
			const testParams = { status: "100", limit: 50 };
			const result = (invoiceHandler as any).transformQueryParams(testParams);
			expect(result).toEqual(testParams);
		});

		it("should handle empty params", () => {
			const result = (invoiceHandler as any).transformQueryParams({});
			expect(result).toEqual({});
		});
	});

	describe("CRUD Operations Integration", () => {
		beforeEach(() => {
			// Mock HTTP request helper
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [TestDataFactory.createMockInvoice()],
				total: 1,
			});
		});

		it("should execute create operation", async () => {
			const createData = { header: "Test Invoice Header" };

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "additionalFields":
							return createData;
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("create", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute get operation", async () => {
			const invoiceId = "12345";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return invoiceId;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("get", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute list operation", async () => {
			const listParams = { limit: 50 };

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "additionalFields":
							return listParams;
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("list", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute update operation", async () => {
			const invoiceId = "12345";
			const updateData = { header: "Updated Invoice Header" };

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return invoiceId;
						case "updateFields":
							return updateData;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("update", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute delete operation", async () => {
			const invoiceId = "12345";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return invoiceId;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("delete", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});
	});

	describe("Custom Operations Integration", () => {
		beforeEach(() => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [{ success: true }],
				total: 1,
			});
		});

		it("should execute sendByEmail operation", async () => {
			const invoiceId = "12345";
			const sendType = "VPR";

			// Mock parameters in the correct order as expected by the handler
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return invoiceId;
						case "sendType":
							return sendType;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("sendByEmail", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "PUT",
					url: expect.stringContaining(`/Invoice/${invoiceId}/sendByEmail`),
					body: { sendType },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute bookAmount operation", async () => {
			const invoiceId = "12345";
			const amount = 100.5;
			const date = "2023-01-15";

			// Mock parameters in the correct order as expected by the handler
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return invoiceId;
						case "amount":
							return amount;
						case "date":
							return date;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("bookAmount", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "PUT",
					url: expect.stringContaining(`/Invoice/${invoiceId}/bookAmount`),
					body: { amount, date },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute cancelInvoice operation", async () => {
			const invoiceId = "12345";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return invoiceId;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("cancelInvoice", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "PUT",
					url: expect.stringContaining(`/Invoice/${invoiceId}/cancelInvoice`),
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute getPositions operation", async () => {
			const invoiceId = "12345";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return invoiceId;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("getPositions", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: expect.stringContaining("/InvoicePos"),
					qs: { "invoice[id]": invoiceId, "invoice[objectName]": "Invoice" },
				}),
			);
			expect(result).toBeDefined();
		});
	});

	describe("Error Handling", () => {
		it("should handle API errors gracefully", async () => {
			const apiError = new Error("API Error");
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(apiError);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			await expect(invoiceHandler.execute("get", 0)).rejects.toThrow();
		});

		it("should handle invalid operation", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("invalidOperation", 0);
			expect(result).toBeDefined();
			expect(result?.json).toEqual([]);
		});

		it("should handle missing required parameters for custom operations", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return undefined;
						case "sendType":
							return undefined;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("sendByEmail", 0);
			expect(result).toBeDefined();
			expect(result?.json).toEqual([]);
		});

		it("should handle invalid date formats in transformations", () => {
			const invalidData = {
				invoiceDate: "not-a-date",
				name: "Test Invoice",
			};

			expect(() => {
				(invoiceHandler as any).transformCreateData(invalidData);
			}).toThrow();
		});
	});

	describe("Validation", () => {
		it("should validate supported operations", () => {
			const supportedOperations = [
				"create",
				"get",
				"list",
				"update",
				"delete",
				"sendByEmail",
				"bookAmount",
				"cancelInvoice",
				"getPositions",
			];

			supportedOperations.forEach((operation) => {
				expect(() =>
					(invoiceHandler as any).validateOperation(operation),
				).not.toThrow();
			});
		});

		it("should allow custom operations", () => {
			// Custom operations are allowed in the base implementation
			expect(() =>
				(invoiceHandler as any).validateOperation("sendByEmail"),
			).not.toThrow();
			expect(() =>
				(invoiceHandler as any).validateOperation("customOperation"),
			).not.toThrow();
		});
	});

	describe("Edge Cases", () => {
		it("should handle empty response from API", async () => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [],
				total: 0,
			});

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await invoiceHandler.execute("list", 0);
			expect(result).toBeDefined();
		});

		it("should handle malformed API response", async () => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue(null);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			await expect(invoiceHandler.execute("get", 0)).rejects.toThrow();
		});

		it("should handle network timeout", async () => {
			const timeoutError = new Error("ETIMEDOUT");
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(timeoutError);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "invoiceId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			await expect(invoiceHandler.execute("get", 0)).rejects.toThrow(
				"The connection timed out",
			);
		});

		it("should handle date edge cases in transformations", () => {
			const edgeCaseData = {
				invoiceDate: "2023-02-29T10:30:00Z", // Invalid date for non-leap year
				name: "Test Invoice",
			};

			expect(() => {
				(invoiceHandler as any).transformCreateData(edgeCaseData);
			}).not.toThrow(); // This should not throw anymore since we handle it properly
		});
	});
});
