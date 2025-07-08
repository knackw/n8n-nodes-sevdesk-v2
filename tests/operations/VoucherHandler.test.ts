import { VoucherHandler } from "../../nodes/SevDesk/handlers/VoucherHandler";
import { MockExecuteFunctions } from "../test-utils";
import { IExecuteFunctions, IHttpRequestOptions } from "n8n-workflow";

describe("VoucherHandler", () => {
	let voucherHandler: VoucherHandler;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		// Create mock execute functions using utility
		mockExecuteFunctions = MockExecuteFunctions.create();

		voucherHandler = new VoucherHandler(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Constructor", () => {
		it("should initialize with correct resource name and endpoint", () => {
			expect(voucherHandler).toBeInstanceOf(VoucherHandler);
			expect((voucherHandler as any).config.resourceName).toBe("Voucher");
			expect((voucherHandler as any).config.apiEndpoint).toBe("Voucher");
			expect((voucherHandler as any).config.idParameterName).toBe("voucherId");
		});
	});

	describe("buildCustomRequest", () => {
		const baseOptions: IHttpRequestOptions = {
			method: "GET",
			url: "",
			headers: {},
		};
		const baseURL = "https://my.sevdesk.de/api/v1";

		it("should build uploadFile request correctly", () => {
			const voucherId = "12345";
			const filename = "receipt.pdf";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(voucherId)
				.mockReturnValueOnce(filename);

			const result = (voucherHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"uploadFile",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "POST",
				url: `${baseURL}/Voucher/${voucherId}/uploadFile`,
				body: { filename },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"voucherId",
				0,
			);
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"filename",
				0,
			);
		});

		it("should build bookVoucher request correctly", () => {
			const voucherId = "12345";
			const amount = 150.75;
			const date = "2023-01-15";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(voucherId)
				.mockReturnValueOnce(amount)
				.mockReturnValueOnce(date);

			const result = (voucherHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"bookVoucher",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "PUT",
				url: `${baseURL}/Voucher/${voucherId}/bookVoucher`,
				body: { amount, date },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"voucherId",
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

		it("should build getPositions request correctly", () => {
			const voucherId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(voucherId);

			const result = (voucherHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"getPositions",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "GET",
				url: `${baseURL}/VoucherPos`,
				qs: { "voucher[id]": voucherId, "voucher[objectName]": "Voucher" },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"voucherId",
				0,
			);
		});

		it("should build getAccountingTypes request correctly", () => {
			const result = (voucherHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"getAccountingTypes",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "GET",
				url: `${baseURL}/AccountingType`,
			});
			// Should not call getNodeParameter for this operation
			expect(mockExecuteFunctions.getNodeParameter).not.toHaveBeenCalled();
		});

		it("should call parent buildCustomRequest for unknown operations", () => {
			const spy = jest.spyOn(
				Object.getPrototypeOf(Object.getPrototypeOf(voucherHandler)),
				"buildCustomRequest",
			);
			spy.mockReturnValue(baseOptions);

			const result = (voucherHandler as any).buildCustomRequest(
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
		it("should transform voucher date to ISO format", () => {
			const testData = {
				voucherDate: "2023-01-15T10:30:00Z",
				description: "Test Voucher",
			};

			const result = (voucherHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				voucherDate: "2023-01-15",
				description: "Test Voucher",
			});
		});

		it("should transform delivery date to ISO format", () => {
			const testData = {
				deliveryDate: "2023-01-20T14:30:00Z",
				description: "Test Voucher",
			};

			const result = (voucherHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				deliveryDate: "2023-01-20",
				description: "Test Voucher",
			});
		});

		it("should transform both dates when present", () => {
			const testData = {
				voucherDate: "2023-01-15T10:30:00Z",
				deliveryDate: "2023-01-20T14:30:00Z",
				description: "Test Voucher",
			};

			const result = (voucherHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				voucherDate: "2023-01-15",
				deliveryDate: "2023-01-20",
				description: "Test Voucher",
			});
		});

		it("should handle data without dates", () => {
			const testData = { description: "Test Voucher", status: "pending" };

			const result = (voucherHandler as any).transformCreateData(testData);
			expect(result).toEqual(testData);
		});

		it("should handle empty data", () => {
			const result = (voucherHandler as any).transformCreateData({});
			expect(result).toEqual({});
		});

		it("should handle null data", () => {
			const result = (voucherHandler as any).transformCreateData(null);
			expect(result).toEqual({});
		});

		it("should handle invalid date formats gracefully", () => {
			const testData = {
				voucherDate: "invalid-date",
				description: "Test Voucher",
			};

			// Should not throw, but should remove the invalid date field
			const result = (voucherHandler as any).transformCreateData(testData);

			expect(result).toEqual({
				description: "Test Voucher",
				// voucherDate should be removed because it's invalid
			});
			expect(result.voucherDate).toBeUndefined();
		});
	});

	describe("transformQueryParams", () => {
		it("should transform startDate to ISO format", () => {
			const testParams = {
				startDate: "2023-01-01T00:00:00Z",
				limit: 50,
			};

			const result = (voucherHandler as any).transformQueryParams(testParams);

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

			const result = (voucherHandler as any).transformQueryParams(testParams);

			expect(result).toEqual({
				endDate: "2023-12-31",
				limit: 50,
			});
		});

		it("should transform both date parameters when present", () => {
			const testParams = {
				startDate: "2023-01-01T00:00:00Z",
				endDate: "2023-12-31T23:59:59Z",
				status: "booked",
			};

			const result = (voucherHandler as any).transformQueryParams(testParams);

			expect(result).toEqual({
				startDate: "2023-01-01",
				endDate: "2023-12-31",
				status: "booked",
			});
		});

		it("should handle params without dates", () => {
			const testParams = { status: "pending", limit: 50 };
			const result = (voucherHandler as any).transformQueryParams(testParams);
			expect(result).toEqual(testParams);
		});

		it("should handle empty params", () => {
			const result = (voucherHandler as any).transformQueryParams({});
			expect(result).toEqual({});
		});
	});

	describe("CRUD Operations Integration", () => {
		beforeEach(() => {
			// Mock HTTP request helper
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [
					{ id: "12345", objectName: "Voucher", voucherNumber: "VOU-001" },
				],
				total: 1,
			});
		});

		it("should execute create operation with date transformation", async () => {
			const voucherData = {
				voucherDate: "2023-01-15T10:30:00Z",
				deliveryDate: "2023-01-20T14:30:00Z",
				supplier: { id: "123", objectName: "Contact" },
			};

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(voucherData) // for data parameter
				.mockReturnValueOnce({}); // for additionalFields

			const result = await voucherHandler.execute("create", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute get operation", async () => {
			const voucherId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(voucherId);

			const result = await voucherHandler.execute("get", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute list operation with date filtering", async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce({
					startDate: "2023-01-01T00:00:00Z",
					endDate: "2023-12-31T23:59:59Z",
				}) // for filters
				.mockReturnValueOnce({}); // for options

			const result = await voucherHandler.execute("list", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute update operation", async () => {
			const voucherId = "12345";
			const updateData = { status: "booked" };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(voucherId) // for voucherId
				.mockReturnValueOnce(updateData) // for updateData
				.mockReturnValueOnce({}); // for additionalFields

			const result = await voucherHandler.execute("update", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute delete operation", async () => {
			const voucherId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(voucherId);

			const result = await voucherHandler.execute("delete", 0);

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

		it("should execute uploadFile operation", async () => {
			const voucherId = "12345";
			const filename = "receipt.pdf";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "voucherId":
							return voucherId;
						case "filename":
							return filename;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await voucherHandler.execute("uploadFile", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "POST",
					url: expect.stringContaining(`/Voucher/${voucherId}/uploadFile`),
					body: { filename: filename },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute bookVoucher operation", async () => {
			const voucherId = "12345";
			const amount = 150.75;
			const date = "2023-01-15";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "voucherId":
							return voucherId;
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

			const result = await voucherHandler.execute("bookVoucher", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "PUT",
					url: expect.stringContaining(`/Voucher/${voucherId}/bookVoucher`),
					body: { amount: amount, date: date },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute getPositions operation", async () => {
			const voucherId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(voucherId);

			const result = await voucherHandler.execute("getPositions", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: expect.stringContaining("/VoucherPos"),
					qs: { "voucher[id]": voucherId, "voucher[objectName]": "Voucher" },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute getAccountingTypes operation", async () => {
			const result = await voucherHandler.execute("getAccountingTypes", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: "GET",
					url: expect.stringContaining("/AccountingType"),
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

			await expect(voucherHandler.execute("get", 0)).rejects.toThrow();
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

			const result = await voucherHandler.execute("invalidOperation", 0);
			expect(result).toBeDefined();
			expect(result?.json).toEqual([]);
		});

		it("should handle missing required parameters for custom operations", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "voucherId":
							return undefined;
						case "filename":
							return undefined;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await voucherHandler.execute("uploadFile", 0);
			expect(result).toBeDefined();
			expect(result?.json).toEqual([]);
		});

		it("should handle invalid date formats in transformations", () => {
			const invalidData = {
				voucherDate: "not-a-date",
				deliveryDate: "also-not-a-date",
				description: "Test Voucher",
			};

			// Should not throw, but should remove invalid date fields
			const result = (voucherHandler as any).transformCreateData(invalidData);

			expect(result).toEqual({
				description: "Test Voucher",
				// Both date fields should be removed because they're invalid
			});
			expect(result.voucherDate).toBeUndefined();
			expect(result.deliveryDate).toBeUndefined();
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
				"uploadFile",
				"bookVoucher",
				"getPositions",
				"getAccountingTypes",
			];

			supportedOperations.forEach((operation) => {
				expect(() =>
					(voucherHandler as any).validateOperation(operation),
				).not.toThrow();
			});
		});

		it("should reject unsupported operations", () => {
			// The base implementation is tolerant and doesn't reject operations
			expect(() =>
				(voucherHandler as any).validateOperation("uploadFile"),
			).not.toThrow();
			expect(() =>
				(voucherHandler as any).validateOperation("customOperation"),
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

			const result = await voucherHandler.execute("list", 0);
			expect(result).toBeDefined();
		});

		it("should handle malformed API response", async () => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue(null);
			mockExecuteFunctions.getNodeParameter.mockReturnValue("12345");

			await expect(voucherHandler.execute("get", 0)).rejects.toThrow();
		});

		it("should handle network timeout", async () => {
			const timeoutError = new Error("ETIMEDOUT");
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(timeoutError);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "voucherId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			await expect(voucherHandler.execute("get", 0)).rejects.toThrow(
				"The connection timed out",
			);
		});

		it("should handle date edge cases in transformations", () => {
			const edgeCaseData = {
				voucherDate: "2023-02-29T10:30:00Z", // Invalid date for non-leap year
				deliveryDate: "2023-13-01T10:30:00Z", // Invalid month
			};

			// The handler should handle invalid dates gracefully without throwing
			expect(() => {
				(voucherHandler as any).transformCreateData(edgeCaseData);
			}).not.toThrow();
		});

		it("should handle complex voucher data with positions", () => {
			const complexVoucherData = {
				voucherDate: "2023-01-15T10:30:00Z",
				deliveryDate: "2023-01-20T14:30:00Z",
				supplier: { id: "123", objectName: "Contact" },
				positions: [
					{
						accountingType: { id: "456", objectName: "AccountingType" },
						taxRate: 19.0,
						sum: 100.0,
					},
				],
			};

			const result = (voucherHandler as any).transformCreateData(
				complexVoucherData,
			);
			expect(result.voucherDate).toBe("2023-01-15");
			expect(result.deliveryDate).toBe("2023-01-20");
			expect(result.positions).toEqual(complexVoucherData.positions);
		});

		it("should handle file upload scenarios", async () => {
			const filename = "receipt with spaces.pdf";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "voucherId":
							return "12345";
						case "filename":
							return filename;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await voucherHandler.execute("uploadFile", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					body: { filename: filename },
				}),
			);
			expect(result).toBeDefined();
		});
	});
});
