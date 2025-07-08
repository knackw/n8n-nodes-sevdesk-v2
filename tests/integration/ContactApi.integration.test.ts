import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import { ContactHandler } from '../../nodes/SevDesk/handlers/ContactHandler';

describe('ContactApi Integration Tests', () => {
	let contactHandler: ContactHandler;
	let mockExecuteFunctions: IExecuteFunctions;
	let mockHttpRequest: jest.Mock;

	beforeEach(() => {
		// Create mock httpRequest function
		mockHttpRequest = jest.fn();

		// Create mock execute functions  
		mockExecuteFunctions = {
			getCredentials: jest.fn() as jest.MockedFunction<any>,
			getNodeParameter: jest.fn() as jest.MockedFunction<any>,
			getNode: jest.fn() as jest.MockedFunction<any>,
			helpers: {
				httpRequest: mockHttpRequest,
			},
		} as any;

		// Setup default credentials
		(mockExecuteFunctions.getCredentials as jest.MockedFunction<any>).mockResolvedValue({
			apiKey: 'test-api-key-12345',
			apiVersion: 'v2',
		});

		(mockExecuteFunctions.getNode as jest.MockedFunction<any>).mockReturnValue({
			id: 'test-node-id',
			name: 'Test SevDesk Node',
			type: 'n8n-nodes-sevdesk-v2.sevDesk',
			typeVersion: 1,
			position: [100, 200],
			parameters: {},
		});

		// Initialize the ContactHandler with mocked functions
		contactHandler = new ContactHandler(mockExecuteFunctions);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('Authentication', () => {
		it('should authenticate successfully with valid API key', async () => {
			const mockResponse = {
				objects: [{ id: '1', name: 'Test Contact' }],
				total: 1,
			};

			mockHttpRequest.mockResolvedValue(mockResponse);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return {};
				return undefined;
			});

			const result = await contactHandler.execute('list', 0);
			
			expect(result).toBeDefined();
			expect(mockHttpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					headers: expect.objectContaining({
						'Authorization': 'test-api-key-12345',
					}),
				})
			);
		});

		it('should handle authentication errors', async () => {
			const mockAuthError = new Error('Unauthorized');
			mockHttpRequest.mockRejectedValue(mockAuthError);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return {};
				return undefined;
			});

			await expect(contactHandler.execute('list', 0)).rejects.toThrow();
		});
	});

	describe('Rate Limiting', () => {
		it('should respect rate limits', async () => {
			const mockError = new Error('Too Many Requests');
			(mockError as any).statusCode = 429;

			mockHttpRequest.mockImplementation(() => {
				return Promise.reject(mockError);
			});

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return {};
				return undefined;
			});

			// Should handle rate limiting gracefully
			await expect(contactHandler.execute('list', 0)).rejects.toThrow();
		});
	});

	describe('Contact Operations', () => {
		it('should create contact successfully', async () => {
			const mockResponse = {
				objects: [{ 
					id: '12345', 
					name: 'John Doe',
					email: 'john@example.com',
					objectName: 'Contact'
				}],
			};

			mockHttpRequest.mockResolvedValue(mockResponse);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return {
					name: 'John Doe',
					email: 'john@example.com'
				};
				return undefined;
			});

			const result = await contactHandler.execute('create', 0);
			
			expect(result).toBeDefined();
			expect(mockHttpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'POST',
					url: expect.stringContaining('/Contact'),
					body: expect.objectContaining({
						name: 'John Doe',
						email: 'john@example.com'
					}),
				})
			);
		});

		it('should get contact by ID', async () => {
			const contactId = '12345';
			const mockResponse = {
				objects: [{ 
					id: contactId, 
					name: 'John Doe',
					email: 'john@example.com',
					objectName: 'Contact'
				}],
			};

			mockHttpRequest.mockResolvedValue(mockResponse);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'contactId') return contactId;
				return undefined;
			});

			const result = await contactHandler.execute('get', 0);
			
			expect(result).toBeDefined();
			expect(mockHttpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: expect.stringContaining(`/Contact/${contactId}`),
				})
			);
		});

		it('should list contacts', async () => {
			const mockResponse = {
				objects: [
					{ id: '1', name: 'Contact 1', objectName: 'Contact' },
					{ id: '2', name: 'Contact 2', objectName: 'Contact' }
				],
				total: 2,
			};

			mockHttpRequest.mockResolvedValue(mockResponse);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return {};
				return undefined;
			});

			const result = await contactHandler.execute('list', 0);
			
			expect(result).toBeDefined();
			expect(mockHttpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'GET',
					url: expect.stringContaining('/Contact'),
				})
			);
		});

		it('should update contact', async () => {
			const contactId = '12345';
			const mockResponse = {
				objects: [{ 
					id: contactId, 
					name: 'Jane Doe',
					email: 'jane@example.com',
					objectName: 'Contact'
				}],
			};

			mockHttpRequest.mockResolvedValue(mockResponse);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'contactId') return contactId;
				if (paramName === 'updateFields') return {
					name: 'Jane Doe',
					email: 'jane@example.com'
				};
				return undefined;
			});

			const result = await contactHandler.execute('update', 0);
			
			expect(result).toBeDefined();
			expect(mockHttpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'PUT',
					url: expect.stringContaining(`/Contact/${contactId}`),
					body: expect.objectContaining({
						name: 'Jane Doe',
						email: 'jane@example.com'
					}),
				})
			);
		});

		it('should delete contact', async () => {
			const contactId = '12345';
			const mockResponse = { objects: [] };

			mockHttpRequest.mockResolvedValue(mockResponse);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'contactId') return contactId;
				return undefined;
			});

			const result = await contactHandler.execute('delete', 0);
			
			expect(result).toBeDefined();
			expect(mockHttpRequest).toHaveBeenCalledWith(
				expect.objectContaining({
					method: 'DELETE',
					url: expect.stringContaining(`/Contact/${contactId}`),
				})
			);
		});
	});

	describe('Error Handling', () => {
		it('should handle API errors gracefully', async () => {
			const apiError = new Error('API Error');
			mockHttpRequest.mockRejectedValue(apiError);
			
			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return {};
				return undefined;
			});

			await expect(contactHandler.execute('list', 0)).rejects.toThrow();
		});

		it('should handle network errors', async () => {
			const networkError = new Error('Network Error');
			mockHttpRequest.mockRejectedValue(networkError);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return {};
				return undefined;
			});

			await expect(contactHandler.execute('list', 0)).rejects.toThrow();
		});

		it('should handle timeout errors', async () => {
			const timeoutError = new Error('ETIMEDOUT');
			mockHttpRequest.mockRejectedValue(timeoutError);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'contactId') return '12345';
				return undefined;
			});

			await expect(contactHandler.execute('get', 0)).rejects.toThrow();
		});
	});

	describe('Pagination', () => {
		it('should handle paginated results', async () => {
			const mockResponse = {
				objects: [
					{ id: '1', name: 'Contact 1', objectName: 'Contact' },
					{ id: '2', name: 'Contact 2', objectName: 'Contact' }
				],
				total: 2,
			};

			mockHttpRequest.mockResolvedValue(mockResponse);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return {
					limit: 10,
					offset: 0
				};
				return undefined;
			});

			const result = await contactHandler.execute('list', 0);
			
			expect(result).toBeDefined();
			// For list operations with multiple results, expect array format
			expect(Array.isArray((result?.json as unknown as any[]))).toBe(true);
			expect((result?.json as unknown as any[]).length).toBe(2);
		});

		it('should handle large result sets', async () => {
			const mockResponse = {
				objects: Array(100).fill(null).map((_, index) => ({
					id: `${index + 1}`,
					name: `Contact ${index + 1}`,
					objectName: 'Contact'
				})),
				total: 100,
			};

			mockHttpRequest.mockResolvedValue(mockResponse);

			(mockExecuteFunctions.getNodeParameter as jest.MockedFunction<any>).mockImplementation((paramName: string) => {
				if (paramName === 'additionalFields') return { limit: 100 };
				return undefined;
			});

			const result = await contactHandler.execute('list', 0);
			
			expect(result).toBeDefined();
			expect(Array.isArray((result?.json as unknown as any[]))).toBe(true);
			expect((result?.json as unknown as any[]).length).toBe(100);
		});
	});
});
