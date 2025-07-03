import { TestDataFactory } from '../test-utils';
import { SevDeskContact, SevDeskInvoice, SevDeskVoucher, SevDeskOrder } from '../../nodes/SevDesk/types/SevDeskApiTypes';

/**
 * Comprehensive API mocking utility for SevDesk endpoints
 * Provides realistic mock responses for all SevDesk API operations
 */
export class SevDeskApiMock {
	private static instance: SevDeskApiMock;
	private mockData: Map<string, any> = new Map();
	private requestHistory: Array<{ method: string; url: string; body?: any; timestamp: Date }> = [];

	private constructor() {
		this.initializeMockData();
	}

	public static getInstance(): SevDeskApiMock {
		if (!SevDeskApiMock.instance) {
			SevDeskApiMock.instance = new SevDeskApiMock();
		}
		return SevDeskApiMock.instance;
	}

	/**
	 * Initialize mock data for all resource types
	 */
	private initializeMockData(): void {
		// Contacts
		this.mockData.set('contacts', [
			TestDataFactory.createMockContact(),
			TestDataFactory.createMockContact({
				id: '2',
				name: 'Another Company',
				customerNumber: 'CUST-002'
			}),
			TestDataFactory.createMockContact({
				id: '3',
				name: 'Third Company',
				customerNumber: 'CUST-003'
			}),
		]);

		// Invoices
		this.mockData.set('invoices', [
			TestDataFactory.createMockInvoice(),
			TestDataFactory.createMockInvoice({
				id: '2',
				invoiceNumber: 'INV-2023-002',
				status: '200' // Paid
			}),
		]);

		// Vouchers
		this.mockData.set('vouchers', [
			TestDataFactory.createMockVoucher(),
			TestDataFactory.createMockVoucher({
				id: '2',
				voucherNumber: 'VOUCH-002'
			}),
		]);

		// Orders
		this.mockData.set('orders', [
			TestDataFactory.createMockOrder(),
			TestDataFactory.createMockOrder({
				id: '2',
				orderNumber: 'ORD-002'
			}),
		]);
	}

	/**
	 * Mock HTTP request based on method and URL
	 */
	public mockHttpRequest(options: {
		method: string;
		url: string;
		body?: any;
		qs?: any;
	}): Promise<any> {
		// Record request for debugging
		this.requestHistory.push({
			method: options.method,
			url: options.url,
			body: options.body,
			timestamp: new Date(),
		});

		const { method, url, body, qs } = options;
		const urlParts = url.split('/');
		const resource = this.extractResourceFromUrl(url);
		const resourceId = this.extractIdFromUrl(url);

		switch (method) {
			case 'GET':
				return this.handleGetRequest(resource, resourceId, qs);
			case 'POST':
				return this.handlePostRequest(resource, body);
			case 'PUT':
				return this.handlePutRequest(resource, resourceId, body);
			case 'DELETE':
				return this.handleDeleteRequest(resource, resourceId);
			default:
				return Promise.reject(new Error(`Unsupported method: ${method}`));
		}
	}

	/**
	 * Handle GET requests
	 */
	private async handleGetRequest(resource: string, resourceId?: string, queryParams?: any): Promise<any> {
		const resourceKey = this.getResourceKey(resource);
		const data = this.mockData.get(resourceKey) || [];

		if (resourceId) {
			// Get single resource
			const item = data.find((item: any) => item.id === resourceId);
			if (!item) {
				throw new Error(`${resource} with ID ${resourceId} not found`);
			}
			return Promise.resolve({
				objects: [item],
				total: 1,
			});
		} else {
			// Get all resources with pagination
			const limit = queryParams?.limit || 50;
			const offset = queryParams?.offset || 0;
			const paginatedData = data.slice(offset, offset + limit);

			return Promise.resolve({
				objects: paginatedData,
				total: data.length,
			});
		}
	}

	/**
	 * Handle POST requests (create)
	 */
	private async handlePostRequest(resource: string, body: any): Promise<any> {
		const resourceKey = this.getResourceKey(resource);
		const data = this.mockData.get(resourceKey) || [];

		// Generate new ID
		const newId = (data.length + 1).toString();

		// Create new item based on resource type
		let newItem: any;
		switch (resource.toLowerCase()) {
			case 'contact':
				newItem = { ...TestDataFactory.createMockContact(), ...body, id: newId };
				break;
			case 'invoice':
				newItem = { ...TestDataFactory.createMockInvoice(), ...body, id: newId };
				break;
			case 'voucher':
				newItem = { ...TestDataFactory.createMockVoucher(), ...body, id: newId };
				break;
			case 'order':
				newItem = { ...TestDataFactory.createMockOrder(), ...body, id: newId };
				break;
			default:
				newItem = { ...body, id: newId };
		}

		// Add to mock data
		data.push(newItem);
		this.mockData.set(resourceKey, data);

		return Promise.resolve({
			objects: [newItem],
			total: 1,
		});
	}

	/**
	 * Handle PUT requests (update)
	 */
	private async handlePutRequest(resource: string, resourceId: string, body: any): Promise<any> {
		const resourceKey = this.getResourceKey(resource);
		const data = this.mockData.get(resourceKey) || [];

		const itemIndex = data.findIndex((item: any) => item.id === resourceId);
		if (itemIndex === -1) {
			throw new Error(`${resource} with ID ${resourceId} not found`);
		}

		// Update item
		const updatedItem = { ...data[itemIndex], ...body };
		data[itemIndex] = updatedItem;
		this.mockData.set(resourceKey, data);

		return Promise.resolve({
			objects: [updatedItem],
			total: 1,
		});
	}

	/**
	 * Handle DELETE requests
	 */
	private async handleDeleteRequest(resource: string, resourceId: string): Promise<any> {
		const resourceKey = this.getResourceKey(resource);
		const data = this.mockData.get(resourceKey) || [];

		const itemIndex = data.findIndex((item: any) => item.id === resourceId);
		if (itemIndex === -1) {
			throw new Error(`${resource} with ID ${resourceId} not found`);
		}

		// Remove item
		data.splice(itemIndex, 1);
		this.mockData.set(resourceKey, data);

		return Promise.resolve({
			objects: [],
			total: 0,
		});
	}

	/**
	 * Extract resource name from URL
	 */
	private extractResourceFromUrl(url: string): string {
		const urlParts = url.split('/');
		// Find the resource part (usually after 'api/v2/')
		const apiIndex = urlParts.findIndex(part => part.startsWith('v'));
		if (apiIndex !== -1 && apiIndex + 1 < urlParts.length) {
			return urlParts[apiIndex + 1];
		}
		// Fallback: take the last meaningful part
		return urlParts.filter(part => part && !part.includes('.')).pop() || 'unknown';
	}

	/**
	 * Extract ID from URL
	 */
	private extractIdFromUrl(url: string): string | undefined {
		const urlParts = url.split('/');
		const lastPart = urlParts[urlParts.length - 1];
		// Check if last part is a number (ID)
		return /^\d+$/.test(lastPart) ? lastPart : undefined;
	}

	/**
	 * Get resource key for mock data storage
	 */
	private getResourceKey(resource: string): string {
		const resourceMap: Record<string, string> = {
			'Contact': 'contacts',
			'Invoice': 'invoices',
			'Voucher': 'vouchers',
			'Order': 'orders',
			'CreditNote': 'creditNotes',
			'Part': 'parts',
			'Tag': 'tags',
			'Category': 'categories',
			'CheckAccount': 'checkAccounts',
		};
		return resourceMap[resource] || resource.toLowerCase() + 's';
	}

	/**
	 * Mock error responses for testing error handling
	 */
	public mockErrorResponse(statusCode: number, message: string): Promise<never> {
		const error = new Error(message);
		(error as any).statusCode = statusCode;
		(error as any).name = 'StatusCodeError';
		return Promise.reject(error);
	}

	/**
	 * Mock specific SevDesk API errors
	 */
	public mockSevDeskErrors = {
		unauthorized: () => this.mockErrorResponse(401, 'Unauthorized: Invalid API key'),
		notFound: (resource: string, id: string) =>
			this.mockErrorResponse(404, `${resource} with ID ${id} not found`),
		badRequest: (message: string = 'Bad Request') =>
			this.mockErrorResponse(400, message),
		rateLimited: () =>
			this.mockErrorResponse(429, 'Too Many Requests: Rate limit exceeded'),
		serverError: () =>
			this.mockErrorResponse(500, 'Internal Server Error'),
		validationError: (field: string) =>
			this.mockErrorResponse(422, `Validation failed for field: ${field}`),
	};

	/**
	 * Get request history for testing
	 */
	public getRequestHistory(): Array<{ method: string; url: string; body?: any; timestamp: Date }> {
		return [...this.requestHistory];
	}

	/**
	 * Clear request history
	 */
	public clearRequestHistory(): void {
		this.requestHistory = [];
	}

	/**
	 * Reset all mock data to initial state
	 */
	public reset(): void {
		this.mockData.clear();
		this.requestHistory = [];
		this.initializeMockData();
	}

	/**
	 * Add custom mock data for testing
	 */
	public addMockData(resourceKey: string, data: any[]): void {
		this.mockData.set(resourceKey, data);
	}

	/**
	 * Get current mock data for a resource
	 */
	public getMockData(resourceKey: string): any[] {
		return this.mockData.get(resourceKey) || [];
	}

	/**
	 * Mock batch operations
	 */
	public mockBatchOperation(operations: Array<{
		method: string;
		resource: string;
		data?: any;
		id?: string;
	}>): Promise<any> {
		const results = operations.map(async (op, index) => {
			try {
				const url = op.id ? `/${op.resource}/${op.id}` : `/${op.resource}`;
				const response = await this.mockHttpRequest({
					method: op.method,
					url,
					body: op.data,
				});
				return {
					success: true,
					data: response.objects?.[0] || response,
					operation: op.method.toLowerCase(),
					resource: op.resource,
				};
			} catch (error) {
				return {
					success: false,
					error: (error as Error).message,
					operation: op.method.toLowerCase(),
					resource: op.resource,
				};
			}
		});

		return Promise.all(results).then(results => ({
			results,
			summary: {
				total: results.length,
				successful: results.filter(r => r.success).length,
				failed: results.filter(r => !r.success).length,
				duration: Math.random() * 1000, // Mock duration
			},
		}));
	}

	/**
	 * Create mock for Jest testing
	 */
	public createJestMock() {
		return {
			httpRequest: jest.fn().mockImplementation((options) =>
				this.mockHttpRequest(options)
			),
		};
	}
}

// Export singleton instance
export const sevDeskApiMock = SevDeskApiMock.getInstance();

// Export helper functions for easy testing
export const mockSevDeskApi = {
	/**
	 * Setup mock for successful operations
	 */
	setupSuccessfulMocks: () => {
		sevDeskApiMock.reset();
	},

	/**
	 * Setup mock for error scenarios
	 */
	setupErrorMocks: (errorType: 'unauthorized' | 'notFound' | 'badRequest' | 'rateLimited' | 'serverError') => {
		const mockFn = jest.fn();
		switch (errorType) {
			case 'unauthorized':
				mockFn.mockRejectedValue(sevDeskApiMock.mockSevDeskErrors.unauthorized());
				break;
			case 'notFound':
				mockFn.mockRejectedValue(sevDeskApiMock.mockSevDeskErrors.notFound('Contact', '999'));
				break;
			case 'badRequest':
				mockFn.mockRejectedValue(sevDeskApiMock.mockSevDeskErrors.badRequest());
				break;
			case 'rateLimited':
				mockFn.mockRejectedValue(sevDeskApiMock.mockSevDeskErrors.rateLimited());
				break;
			case 'serverError':
				mockFn.mockRejectedValue(sevDeskApiMock.mockSevDeskErrors.serverError());
				break;
		}
		return mockFn;
	},

	/**
	 * Create mock execution functions with SevDesk API mock
	 */
	createMockExecuteFunctions: () => {
		const mockExecuteFunctions = {
			getCredentials: jest.fn().mockResolvedValue(TestDataFactory.createMockCredentials()),
			helpers: sevDeskApiMock.createJestMock(),
			getInputData: jest.fn().mockReturnValue([TestDataFactory.createMockInputData()]),
			getNodeParameter: jest.fn(),
			getNode: jest.fn().mockReturnValue(TestDataFactory.createMockNode()),
		};
		return mockExecuteFunctions;
	},
};
