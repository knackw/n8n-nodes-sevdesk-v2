import { ContactHandler } from "../../nodes/SevDesk/handlers/ContactHandler";
import { MockExecuteFunctions, TestDataFactory } from "../test-utils";
import { IExecuteFunctions, IHttpRequestOptions } from "n8n-workflow";

describe("ContactHandler", () => {
	let contactHandler: ContactHandler;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		// Create mock execute functions using utility
		mockExecuteFunctions = MockExecuteFunctions.create();

		contactHandler = new ContactHandler(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe("Constructor", () => {
		it("should initialize with correct resource name and endpoint", () => {
			expect(contactHandler).toBeInstanceOf(ContactHandler);
			expect((contactHandler as any).config.resourceName).toBe("Contact");
			expect((contactHandler as any).config.apiEndpoint).toBe("Contact");
			expect((contactHandler as any).config.idParameterName).toBe("contactId");
		});
	});

	describe("buildCustomRequest", () => {
		const baseOptions: IHttpRequestOptions = {
			method: "GET",
			url: "",
			headers: {},
		};
		const baseURL = "https://my.sevdesk.de/api/v1";

		it("should build checkCustomerNumberAvailability request correctly", () => {
			const customerNumber = "CUST-001";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(customerNumber);

			const result = (contactHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"checkCustomerNumberAvailability",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "GET",
				url: `${baseURL}/Contact/Mapper/checkCustomerNumberAvailability`,
				qs: { customerNumber },
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"customerNumber",
				0,
			);
		});

		it("should build findByCustomFieldValue request correctly", () => {
			const customFieldSetting = { id: "123", objectName: "Contact" };
			const value = "test-value";

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(customFieldSetting)
				.mockReturnValueOnce(value);

			const result = (contactHandler as any).buildCustomRequest(
				baseOptions,
				baseURL,
				"findByCustomFieldValue",
				0,
			);

			expect(result).toEqual({
				...baseOptions,
				method: "GET",
				url: `${baseURL}/Contact/Factory/findContactByCustomFieldValue`,
				qs: {
					"customFieldSetting[id]": customFieldSetting.id,
					"customFieldSetting[objectName]": customFieldSetting.objectName,
					value,
				},
			});
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"customFieldSetting",
				0,
			);
			expect(mockExecuteFunctions.getNodeParameter).toHaveBeenCalledWith(
				"value",
				0,
			);
		});

		it("should call parent buildCustomRequest for unknown operations", () => {
			const spy = jest.spyOn(
				Object.getPrototypeOf(Object.getPrototypeOf(contactHandler)),
				"buildCustomRequest",
			);
			spy.mockReturnValue(baseOptions);

			const result = (contactHandler as any).buildCustomRequest(
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
		it("should return data unchanged by default", () => {
			const testData = TestDataFactory.createMockContact();
			const result = (contactHandler as any).transformCreateData(testData);
			expect(result).toEqual(testData);
		});

		it("should handle empty data", () => {
			const result = (contactHandler as any).transformCreateData({});
			expect(result).toEqual({});
		});

		it("should handle null data", () => {
			const result = (contactHandler as any).transformCreateData(null);
			expect(result).toEqual(null);
		});
	});

	describe("transformQueryParams", () => {
		it("should return params unchanged by default", () => {
			const testParams = { name: "Test Company", customerNumber: "CUST-001" };
			const result = (contactHandler as any).transformQueryParams(testParams);
			expect(result).toEqual(testParams);
		});

		it("should handle empty params", () => {
			const result = (contactHandler as any).transformQueryParams({});
			expect(result).toEqual({});
		});
	});

	describe("CRUD Operations Integration", () => {
		beforeEach(() => {
			// Mock HTTP request helper
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [TestDataFactory.createMockContact()],
				total: 1,
			});
		});

		it("should execute create operation", async () => {
			const contactData = TestDataFactory.createMockContact();
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(contactData) // for data parameter
				.mockReturnValueOnce({}); // for additionalFields

			const result = await contactHandler.execute("create", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute get operation", async () => {
			const contactId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(contactId);

			const result = await contactHandler.execute("get", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute list operation", async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce({}) // for filters
				.mockReturnValueOnce({}); // for options

			const result = await contactHandler.execute("list", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute update operation", async () => {
			const contactId = "12345";
			const updateData = { name: "Updated Company" };

			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce(contactId) // for contactId
				.mockReturnValueOnce(updateData) // for updateData
				.mockReturnValueOnce({}); // for additionalFields

			const result = await contactHandler.execute("update", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});

		it("should execute delete operation", async () => {
			const contactId = "12345";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(contactId);

			const result = await contactHandler.execute("delete", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalled();
			expect(result).toBeDefined();
		});
	});

	describe("Custom Operations Integration", () => {
		beforeEach(() => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue({
				objects: [{ available: true }],
				total: 1,
			});
		});

		it("should execute checkCustomerNumberAvailability operation", async () => {
			const customerNumber = "CUST-001";
			mockExecuteFunctions.getNodeParameter.mockReturnValue(customerNumber);

			const result = await contactHandler.execute(
				"checkCustomerNumberAvailability",
				0,
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining(
						"/Contact/Mapper/checkCustomerNumberAvailability",
					),
					qs: { customerNumber },
				}),
			);
			expect(result).toBeDefined();
		});

		it("should execute findByCustomFieldValue operation", async () => {
			const customFieldSetting = { id: "123", objectName: "Contact" };
			const value = "test-value";

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "customFieldSetting":
							return customFieldSetting;
						case "value":
							return value;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await contactHandler.execute("findByCustomFieldValue", 0);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					url: expect.stringContaining(
						"/Contact/Factory/findContactByCustomFieldValue",
					),
					qs: expect.objectContaining({
						"customFieldSetting[id]": customFieldSetting.id,
						"customFieldSetting[objectName]": customFieldSetting.objectName,
						value,
					}),
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

			await expect(contactHandler.execute("get", 0)).rejects.toThrow();
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

			const result = await contactHandler.execute("invalidOperation", 0);
			expect(result).toBeDefined();
			expect(result?.json).toEqual([]);
		});

		it("should handle missing required parameters", async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "contactId":
							return undefined;
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			const result = await contactHandler.execute("get", 0);
			expect(result).toBeDefined();
			expect(result?.json).toEqual([]);
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
				"checkCustomerNumberAvailability",
				"findByCustomFieldValue",
			];

			supportedOperations.forEach((operation) => {
				expect(() =>
					(contactHandler as any).validateOperation(operation),
				).not.toThrow();
			});
		});

		it("should allow custom operations", () => {
			// Custom operations are allowed in the base implementation
			expect(() =>
				(contactHandler as any).validateOperation(
					"checkCustomerNumberAvailability",
				),
			).not.toThrow();
			expect(() =>
				(contactHandler as any).validateOperation("customOperation"),
			).not.toThrow();
		});
	});

	describe("Data Transformation", () => {
		it("should handle complex contact data transformation", () => {
			const complexContactData = {
				...TestDataFactory.createMockContact(),
				addresses: [
					{
						street: "Test Street 123",
						zip: "12345",
						city: "Test City",
						country: { id: "1", objectName: "StaticCountry" },
					},
				],
				communicationWays: [
					{
						type: "EMAIL",
						value: "test@example.com",
						key: "2",
					},
				],
			};

			const result = (contactHandler as any).transformCreateData(
				complexContactData,
			);
			expect(result).toEqual(complexContactData);
		});

		it("should handle query parameter transformation", () => {
			const queryParams = {
				name: "Test Company",
				customerNumber: "CUST-001",
				category: { id: "3" },
				limit: 50,
				offset: 0,
			};

			const result = (contactHandler as any).transformQueryParams(queryParams);
			expect(result).toEqual(queryParams);
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

			const result = await contactHandler.execute("list", 0);
			expect(result).toBeDefined();
		});

		it("should handle malformed API response", async () => {
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockResolvedValue(null);
			mockExecuteFunctions.getNodeParameter.mockReturnValue("12345");

			await expect(contactHandler.execute("get", 0)).rejects.toThrow();
		});

		it("should handle network timeout", async () => {
			const timeoutError = new Error("ETIMEDOUT");
			(
				mockExecuteFunctions.helpers.httpRequest as jest.MockedFunction<any>
			).mockRejectedValue(timeoutError);

			mockExecuteFunctions.getNodeParameter.mockImplementation(
				(paramName: string, itemIndex: number, defaultValue?: any) => {
					switch (paramName) {
						case "contactId":
							return "12345";
						case "additionalFields":
							return {};
						default:
							return defaultValue;
					}
				},
			);

			await expect(contactHandler.execute("get", 0)).rejects.toThrow(
				"The connection timed out",
			);
		});
	});
});
