import { SevDeskResourceManager } from '../nodes/SevDesk/SevDeskResourceManager';
import { TestDataFactory } from './test-utils';
import { IExecuteFunctions } from 'n8n-workflow';
import { sevDeskApiMock, mockSevDeskApi } from './mocks/SevDeskApiMock';

// Mock the SevDesk API client
jest.mock('../nodes/SevDesk/SevDeskApiClient');

describe('SevDeskResourceManager - Functional Tests', () => {
	let resourceManager: SevDeskResourceManager;
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		// Reset API mock to clean state
		sevDeskApiMock.reset();

		// Create mock execution functions using the comprehensive API mock
		mockExecuteFunctions = mockSevDeskApi.createMockExecuteFunctions() as unknown as jest.Mocked<IExecuteFunctions>;

		// Add additional required methods for n8n interface
		mockExecuteFunctions.getWorkflow = jest.fn();
		mockExecuteFunctions.getExecutionId = jest.fn();
		mockExecuteFunctions.getRestApiUrl = jest.fn();
		mockExecuteFunctions.getInstanceBaseUrl = jest.fn();
		mockExecuteFunctions.getInstanceId = jest.fn();
		mockExecuteFunctions.getTimezone = jest.fn();
		mockExecuteFunctions.getExecuteData = jest.fn();
		mockExecuteFunctions.evaluateExpression = jest.fn();
		mockExecuteFunctions.getContext = jest.fn();
		mockExecuteFunctions.getInputSourceData = jest.fn();
		mockExecuteFunctions.getMode = jest.fn();
		mockExecuteFunctions.getActivationMode = jest.fn();
		mockExecuteFunctions.getNodeInputs = jest.fn();
		mockExecuteFunctions.getParentCallbackManager = jest.fn();
		mockExecuteFunctions.getChildNodes = jest.fn();
		mockExecuteFunctions.getKnownEntryPoints = jest.fn();
		mockExecuteFunctions.addInputData = jest.fn();
		mockExecuteFunctions.addOutputData = jest.fn();
		mockExecuteFunctions.getExecutionCancelSignal = jest.fn();
		mockExecuteFunctions.onExecutionCancellation = jest.fn();
		mockExecuteFunctions.sendMessageToUI = jest.fn();
		mockExecuteFunctions.sendResponse = jest.fn();
		mockExecuteFunctions.getResponsePromise = jest.fn();
		mockExecuteFunctions.getSSHClient = jest.fn();
		mockExecuteFunctions.putExecutionToWait = jest.fn();
		mockExecuteFunctions.sendDataToUI = jest.fn();
		mockExecuteFunctions.logAiEvent = jest.fn();

		resourceManager = new SevDeskResourceManager(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Contact Operations', () => {
		beforeEach(() => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'resource':
						return 'contact';
					case 'operation':
						return 'create';
					case 'name':
						return 'Test Company';
					case 'customerNumber':
						return 'CUST-001';
					default:
						return undefined;
				}
			});
		});

		it('should create a contact successfully', async () => {
			// Mock successful API response
			const mockContact = TestDataFactory.createMockContact();
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				objects: [mockContact],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation('contact', 'create', 0);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(1);
			expect(result[0].json).toEqual(mockContact);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: expect.stringContaining('/Contact'),
				})
			);
		});

		it('should read contacts successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation':
						return 'getAll';
					case 'limit':
						return 50;
					default:
						return undefined;
				}
			});

			const mockContacts = [
				TestDataFactory.createMockContact(),
				TestDataFactory.createMockContact({ name: 'Another Company' }),
			];
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				objects: mockContacts,
				total: 2,
			});

			const result = await resourceManager.executeResourceOperation('contact', 'getAll', 0);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result.length).toBe(2);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: expect.stringContaining('/Contact'),
				})
			);
		});

		it('should update a contact successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation':
						return 'update';
					case 'contactId':
						return '12345';
					case 'name':
						return 'Updated Company Name';
					default:
						return undefined;
				}
			});

			const mockUpdatedContact = TestDataFactory.createMockContact({
				name: 'Updated Company Name'
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				objects: [mockUpdatedContact],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation('contact', 'update', 0);

			expect(result).toBeDefined();
			expect(result[0].json.name).toBe('Updated Company Name');
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'PUT',
					url: expect.stringContaining('/Contact/12345'),
				})
			);
		});

		it('should delete a contact successfully', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation':
						return 'delete';
					case 'contactId':
						return '12345';
					default:
						return undefined;
				}
			});

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				objects: [],
				total: 0,
			});

			const result = await resourceManager.executeResourceOperation('contact', 'delete', 0);

			expect(result).toBeDefined();
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'DELETE',
					url: expect.stringContaining('/Contact/12345'),
				})
			);
		});
	});

	describe('Invoice Operations', () => {
		beforeEach(() => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'resource':
						return 'invoice';
					case 'operation':
						return 'create';
					case 'contactId':
						return '12345';
					case 'invoiceNumber':
						return 'INV-2023-001';
					default:
						return undefined;
				}
			});
		});

		it('should create an invoice successfully', async () => {
			const mockInvoice = TestDataFactory.createMockInvoice();
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				objects: [mockInvoice],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation('invoice', 'create', 0);

			expect(result).toBeDefined();
			expect(result[0].json).toEqual(mockInvoice);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: expect.stringContaining('/Invoice'),
				})
			);
		});

		it('should handle invoice status updates', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'operation':
						return 'update';
					case 'invoiceId':
						return '67890';
					case 'status':
						return '200'; // Paid status
					default:
						return undefined;
				}
			});

			const mockUpdatedInvoice = TestDataFactory.createMockInvoice({
				status: '200'
			});
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				objects: [mockUpdatedInvoice],
				total: 1,
			});

			const result = await resourceManager.executeResourceOperation('invoice', 'update', 0);

			expect(result).toBeDefined();
			expect(result[0].json.status).toBe('200');
		});
	});

	describe('Batch Operations', () => {
		beforeEach(() => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'resource':
						return 'batch';
					case 'operation':
						return 'execute';
					case 'operations':
						return [
							{
								resource: 'contact',
								operation: 'create',
								data: { name: 'Batch Contact 1' }
							},
							{
								resource: 'contact',
								operation: 'create',
								data: { name: 'Batch Contact 2' }
							}
						];
					default:
						return undefined;
				}
			});
		});

		it('should execute batch operations successfully', async () => {
			const mockBatchResults = [
				TestDataFactory.createMockContact({ name: 'Batch Contact 1' }),
				TestDataFactory.createMockContact({ name: 'Batch Contact 2' }),
			];

			// Mock multiple API calls for batch operations
			mockExecuteFunctions.helpers.httpRequest
				.mockResolvedValueOnce({ objects: [mockBatchResults[0]], total: 1 })
				.mockResolvedValueOnce({ objects: [mockBatchResults[1]], total: 1 });

			const result = await resourceManager.executeResourceOperation('batch', 'execute', 0);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledTimes(2);
		});
	});

	describe('Error Handling', () => {
		beforeEach(() => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'resource':
						return 'contact';
					case 'operation':
						return 'create';
					default:
						return undefined;
				}
			});
		});

		it('should handle API errors gracefully', async () => {
			const mockError = new Error('API Error: Invalid credentials');
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockError);

			await expect(
				resourceManager.executeResourceOperation('contact', 'create', 0)
			).rejects.toThrow('API Error: Invalid credentials');
		});

		it('should handle validation errors', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'resource':
						return 'contact';
					case 'operation':
						return 'create';
					case 'name':
						return ''; // Invalid empty name
					default:
						return undefined;
				}
			});

			await expect(
				resourceManager.executeResourceOperation('contact', 'create', 0)
			).rejects.toThrow();
		});

		it('should handle network timeouts', async () => {
			const timeoutError = new Error('Request timeout');
			timeoutError.name = 'TimeoutError';
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(timeoutError);

			await expect(
				resourceManager.executeResourceOperation('contact', 'create', 0)
			).rejects.toThrow('Request timeout');
		});
	});

	describe('Parameter Validation', () => {
		it('should validate required parameters for contact creation', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'resource':
						return 'contact';
					case 'operation':
						return 'create';
					// Missing required 'name' parameter
					default:
						return undefined;
				}
			});

			await expect(
				resourceManager.executeResourceOperation('contact', 'create', 0)
			).rejects.toThrow();
		});

		it('should validate resource types', async () => {
			await expect(
				resourceManager.executeResourceOperation('invalidResource' as any, 'create', 0)
			).rejects.toThrow();
		});

		it('should validate operation types', async () => {
			await expect(
				resourceManager.executeResourceOperation('contact', 'invalidOperation' as any, 0)
			).rejects.toThrow();
		});
	});

	describe('Response Transformation', () => {
		it('should transform API responses to n8n format', async () => {
			mockExecuteFunctions.getNodeParameter.mockImplementation((paramName: string) => {
				switch (paramName) {
					case 'resource':
						return 'contact';
					case 'operation':
						return 'getAll';
					default:
						return undefined;
				}
			});

			const mockApiResponse = {
				objects: [TestDataFactory.createMockContact()],
				total: 1,
			};
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockApiResponse);

			const result = await resourceManager.executeResourceOperation('contact', 'getAll', 0);

			expect(result).toBeDefined();
			expect(Array.isArray(result)).toBe(true);
			expect(result[0]).toHaveProperty('json');
			expect(result[0]).toHaveProperty('pairedItem');
		});
	});
});
