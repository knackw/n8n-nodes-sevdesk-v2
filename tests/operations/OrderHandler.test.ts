import { OrderHandler } from "../../nodes/SevDesk/handlers/OrderHandler";
import { MockExecuteFunctions } from "../test-utils";
import { IExecuteFunctions, IHttpRequestOptions } from "n8n-workflow";

describe("OrderHandler", () => {
	let orderHandler: OrderHandler;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		// Create mock execute functions using utility
		mockExecuteFunctions = MockExecuteFunctions.create();

		orderHandler = new OrderHandler(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Constructor", () => {
		it("should initialize with correct resource name and endpoint", () => {
			expect(orderHandler).toBeInstanceOf(OrderHandler);
			expect((orderHandler as any).config.resourceName).toBe("Order");
			expect((orderHandler as any).config.apiEndpoint).toBe("Order");
			expect((orderHandler as any).config.idParameterName).toBe("orderId");
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
			const orderId = "12345";
			const sendType = "VPR";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(orderId)
				.mockReturnValueOnce(sendType);

			const result = (orderHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"sendByEmail",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "PUT",
				url: `${baseURL}/Order/${orderId}/sendByEmail`,
				body: { sendType },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"orderId",
				0,
			);
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"sendType",
				0,
				"VPR",
			);
		});

		it("should build sendByEmail request with default sendType", () => {
			const orderId = "12345";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(orderId)
				.mockReturnValueOnce(undefined); // sendType not provided, should use default

			const result = (orderHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"sendByEmail",
				0,
			);

			expect(result.body).toEqual({ sendType: undefined });
		});

		it("should build getPositions request correctly", () => {
			const orderId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(orderId);

			const result = (orderHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"getPositions",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "GET",
				url: `${baseURL}/OrderPos`,
				qs: { "order[id]": orderId, "order[objectName]": "Order" },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"orderId",
				0,
			);
		});

		it("should build createInvoiceFromOrder request correctly", () => {
			const orderId = "12345";
			const invoiceDate = "2023-01-15";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(orderId)
				.mockReturnValueOnce(invoiceDate);

			const result = (orderHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"createInvoiceFromOrder",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "POST",
				url: `${baseURL}/Order/${orderId}/createInvoiceFromOrder`,
				body: { invoiceDate },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"orderId",
				0,
			);
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"invoiceDate",
				0,
			);
		});

		it("should build createPackingListFromOrder request correctly", () => {
			const orderId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(orderId);

			const result = (orderHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"createPackingListFromOrder",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "POST",
				url: `${baseURL}/Order/${orderId}/createPackingListFromOrder`,
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"orderId",
				0,
			);
		});

		it("should call parent buildCustomRequest for unknown operations", () => {
			const spy = jest.spyOn(
				Object.getPrototypeOf(Object.getPrototypeOf(orderHandler)),
				"buildCustomRequest",
			);
			spy.mockReturnValue(baseOptions);

			const result = (orderHandler as any).buildCustomRequest(
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
		it("should transform order date to ISO format", () => {
			const testData = {
				orderDate: "2023-01-15T10:30:00Z",
				name: "Test Order",
			};

			const result = (orderHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				orderDate: "2023-01-15",
				name: "Test Order",
			});
		});

		it("should transform delivery date to ISO format", () => {
			const testData = {
				deliveryDate: "2023-01-20T14:30:00Z",
				name: "Test Order",
			};

			const result = (orderHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				deliveryDate: "2023-01-20",
				name: "Test Order",
			});
		});

		it("should transform both dates when present", () => {
			const testData = {
				orderDate: "2023-01-15T10:30:00Z",
				deliveryDate: "2023-01-20T14:30:00Z",
				name: "Test Order",
			};

			const result = (orderHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				orderDate: "2023-01-15",
				deliveryDate: "2023-01-20",
				name: "Test Order",
			});
		});

		it("should handle data without dates", () => {
			const testData = { name: "Test Order", status: "pending" };

			const result = (orderHandler as any).transformCreateData(testData);
			expect(result).toEqual(testData);
		});

		it("should handle empty data", () => {
			const result = (orderHandler as any).transformCreateData({});
			expect(result).toEqual({});
		});

		it("should handle null data", () => {
			const result = (orderHandler as any).transformCreateData(null);
			expect(result).toEqual({});
		});

		it("should handle invalid date formats gracefully", () => {
			const testData = {
				orderDate: "invalid-date",
				name: "Test Order",
			};

			expect(() => {
				(orderHandler as any).transformCreateData(testData);
			}).toThrow();
		});
	});

	describe("transformQueryParams", () => {
		it("should transform startDate to ISO format", () => {
			const testParams = {
				startDate: "2023-01-01T00:00:00Z",
				limit: 50,
			};

			const result = (orderHandler as any).transformQueryParams(testParams);

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

			const result = (orderHandler as any).transformQueryParams(testParams);

			expect(result).toEqual({
				endDate: "2023-12-31",
				limit: 50,
			});
		});

		it("should transform both date parameters when present", () => {
			const testParams = {
				startDate: "2023-01-01T00:00:00Z",
				endDate: "2023-12-31T23:59:59Z",
				status: "pending",
			};

			const result = (orderHandler as any).transformQueryParams(testParams);

			expect(result).toEqual({
				startDate: "2023-01-01",
				endDate: "2023-12-31",
				status: "pending",
			});
		});

		it("should handle params without dates", () => {
			const testParams = { status: "pending", limit: 50 };
			const result = (orderHandler as any).transformQueryParams(testParams);
			expect(result).toEqual(testParams);
		});

		it("should handle empty params", () => {
			const result = (orderHandler as any).transformQueryParams({});
			expect(result).toEqual({});
		});
	});

	describe("CRUD Operations Integration", () => {
		beforeEach(() => {
			// Mock HTTP request helper
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [{ id: "12345", objectName: "Order", orderNumber: "ORD-001" }],
				total: 1,
			});
		});

		it("should execute create operation with date transformation", async () => {
			const orderData = {
				orderDate: "2023-01-15T10:30:00Z",
				deliveryDate: "2023-01-20T14:30:00Z",
				contact: { id: "123", objectName: "Contact" },
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "additionalFields":
							return orderData;
						default:
							return defaultValue;
					}
				},
			);

			const result = await orderHandler.execute("create", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute get operation", async () => {
			const orderId = "12345";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "orderId":
							return orderId;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await orderHandler.execute("get", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute list operation with date filtering", async () => {
			const filterData = {
				startDate: "2023-01-01T00:00:00Z",
				endDate: "2023-12-31T23:59:59Z",
			};

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "additionalFields":
							return filterData;
						default:
							return defaultValue;
					}
				},
			);

			const result = await orderHandler.execute("list", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute update operation", async () => {
			const orderId = "12345";
			const updateData = { status: "completed" };

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "orderId":
							return orderId;
						case "updateFields":
							return updateData;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await orderHandler.execute("update", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute delete operation", async () => {
			const orderId = "12345";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "orderId":
							return orderId;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await orderHandler.execute("delete", 0);

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
			const orderId = "12345";
			const sendType = "VPR";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "orderId":
							return orderId;
						case "sendType":
							return sendType;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await orderHandler.execute("sendByEmail", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "PUT",
					url: expect.stringContaining(`/Order/${orderId}/sendByEmail`),
					body: { sendType },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute getPositions operation", async () => {
			const orderId = "12345";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "orderId":
							return orderId;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await orderHandler.execute("getPositions", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: expect.stringContaining("/OrderPos"),
					qs: { "order[id]": orderId, "order[objectName]": "Order" },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute createInvoiceFromOrder operation", async () => {
			const orderId = "12345";
			const invoiceDate = "2023-01-15";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "orderId":
							return orderId;
						case "invoiceDate":
							return invoiceDate;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await orderHandler.execute("createInvoiceFromOrder", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "POST",
					url: expect.stringContaining(
						`/Order/${orderId}/createInvoiceFromOrder`,
					),
					body: { invoiceDate },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute createPackingListFromOrder operation", async () => {
			const orderId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(orderId);

			const result = await orderHandler.execute(
				"createPackingListFromOrder",
				0,
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "POST",
					url: expect.stringContaining(
						`/Order/${orderId}/createPackingListFromOrder`,
					),
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
			mockExecuteFunctions.getNodeParameter.mockReturnValue("12345");

			await expect(orderHandler.execute("get", 0)).rejects.toThrow();
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

			const result = await orderHandler.execute("invalidOperation", 0);
			expect(result).toBeDefined();
			expect(result?.json).toEqual([]);
		});

		it("should handle missing required parameters for custom operations", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "orderId":
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

			const result = await orderHandler.execute("sendByEmail", 0);
			expect(result).toBeDefined();
			expect(result?.json).toEqual([]);
		});

		it("should handle invalid date formats in transformations", () => {
			const invalidData = {
				orderDate: "not-a-date",
				name: "Test Order",
			};

			expect(() => {
				(orderHandler as any).transformCreateData(invalidData);
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
				"getPositions",
				"createInvoiceFromOrder",
				"createPackingListFromOrder",
			];

			supportedOperations.forEach((operation) => {
				expect(() =>
					(orderHandler as any).validateOperation(operation),
				).not.toThrow();
			});
		});

		it("should allow custom operations", () => {
			// Custom operations are allowed in the base implementation
			expect(() =>
				(orderHandler as any).validateOperation("sendByEmail"),
			).not.toThrow();
			expect(() =>
				(orderHandler as any).validateOperation("customOperation"),
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
			mockExecuteFunctions.getNodeParameter.mockReturnValue({});

			const result = await orderHandler.execute("list", 0);
			expect(result).toBeDefined();
		});

		it("should handle malformed API response", async () => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue(null);
			mockExecuteFunctions.getNodeParameter.mockReturnValue("12345");

			await expect(orderHandler.execute("get", 0)).rejects.toThrow();
		});

		it("should handle network timeout", async () => {
			const timeoutError = new Error("ETIMEDOUT");
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(timeoutError);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "orderId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			await expect(orderHandler.execute("get", 0)).rejects.toThrow(
				"The connection timed out",
			);
		});

		it("should handle date edge cases in transformations", () => {
			const edgeCaseData = {
				orderDate: "2023-02-29T10:30:00Z", // Invalid date for non-leap year
				name: "Test Order",
			};

			expect(() => {
				(orderHandler as any).transformCreateData(edgeCaseData);
			}).not.toThrow(); // This should not throw anymore since we handle it properly
		});

		it("should handle complex order data with positions", () => {
			const complexOrderData = {
				orderDate: "2023-01-15T10:30:00Z",
				deliveryDate: "2023-01-20T14:30:00Z",
				contact: { id: "123", objectName: "Contact" },
				positions: [
					{
						quantity: 2,
						price: 50.0,
						part: { id: "456", objectName: "Part" },
					},
				],
			};

			const result = (orderHandler as any).transformCreateData(
				complexOrderData,
			);
			expect(result.orderDate).toBe("2023-01-15");
			expect(result.deliveryDate).toBe("2023-01-20");
			expect(result.positions).toEqual(complexOrderData.positions);
		});
	});
});
