/**
 * Tests for the BaseResourceHandler abstract classes
 */

import { MockExecuteFunctions } from './test-utils';
import { ContactHandler } from '../nodes/SevDesk/handlers/ContactHandler';
import { IExecuteFunctions } from 'n8n-workflow';
import { SevDeskContact } from '../nodes/SevDesk/types/SevDeskApiTypes';

describe('BaseResourceHandler', () => {
	let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;

	beforeEach(() => {
		mockExecuteFunctions = MockExecuteFunctions.create();
	});

	describe('ContactHandler', () => {
		it('should create a ContactHandler instance', () => {
			const handler = new ContactHandler(mockExecuteFunctions);
			expect(handler).toBeInstanceOf(ContactHandler);
		});

		it('should have correct configuration', () => {
			const handler = new ContactHandler(mockExecuteFunctions);
			expect(handler['config'].resourceName).toBe('Contact');
			expect(handler['config'].apiEndpoint).toBe('Contact');
			expect(handler['config'].idParameterName).toBe('contactId');
		});

		it('should support all CRUD operations', () => {
			const handler = new ContactHandler(mockExecuteFunctions);
			const supportedOps = handler['config'].supportedOperations;

			expect(supportedOps.create).toBe(true);
			expect(supportedOps.read).toBe(true);
			expect(supportedOps.update).toBe(true);
			expect(supportedOps.delete).toBe(true);
			expect(supportedOps.list).toBe(true);
		});

		it('should validate supported operations', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// These should not throw
			expect(() => handler['validateOperation']('create')).not.toThrow();
			expect(() => handler['validateOperation']('get')).not.toThrow();
			expect(() => handler['validateOperation']('getMany')).not.toThrow();
			expect(() => handler['validateOperation']('update')).not.toThrow();
			expect(() => handler['validateOperation']('delete')).not.toThrow();

			// Custom operations should also not throw (they're handled by buildCustomRequest)
			expect(() => handler['validateOperation']('checkCustomerNumberAvailability')).not.toThrow();
		});

		it('should build correct request options for create operation', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return test data
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue({
				name: 'Test Contact',
				email: 'test@example.com'
			});

			const requestOptions = await handler['buildRequestOptions']('create', 0);

			expect(requestOptions.method).toBe('POST');
			expect(requestOptions.url).toContain('/Contact');
			expect(requestOptions.body).toEqual({
				name: 'Test Contact',
				email: 'test@example.com'
			});
		});

		it('should build correct request options for get operation', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return contact ID
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue('123');

			const requestOptions = await handler['buildRequestOptions']('get', 0);

			expect(requestOptions.method).toBe('GET');
			expect(requestOptions.url).toContain('/Contact/123');
		});

		it('should build correct request options for custom operations', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method for checkCustomerNumberAvailability
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue('CUST001');

			const requestOptions = await handler['buildRequestOptions']('checkCustomerNumberAvailability', 0);

			expect(requestOptions.method).toBe('GET');
			expect(requestOptions.url).toContain('/Contact/Mapper/checkCustomerNumberAvailability');
			expect(requestOptions.qs).toEqual({ customerNumber: 'CUST001' });
		});

		it('should format response correctly', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			const mockContacts: SevDeskContact[] = [
				{
					id: '1',
					objectName: 'Contact',
					create: '2023-01-01',
					update: '2023-01-01',
					name: 'Contact 1',
					category: {
						id: '1',
						objectName: 'Category'
					}
				},
				{
					id: '2',
					objectName: 'Contact',
					create: '2023-01-01',
					update: '2023-01-01',
					name: 'Contact 2',
					category: {
						id: '1',
						objectName: 'Category'
					}
				}
			];

			const mockResponse = {
				objects: mockContacts
			};

			const result = handler['formatResponse'](mockResponse, 0);

			expect(result.json).toEqual(mockResponse.objects);
			expect(result.pairedItem).toEqual({ item: 0 });
		});

		it('should handle errors correctly', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			const error = new Error('Test error');
			const nodeApiError = handler['handleError'](error, 'create');

			// Check that the error is properly formatted
			expect(nodeApiError.description).toBe('Failed to execute create operation on Contact resource.');
			expect(nodeApiError).toBeInstanceOf(Error);
		});

		it('should build correct request options for update operation', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return test data
			mockExecuteFunctions.getNodeParameter = jest.fn()
				.mockReturnValueOnce('123') // contactId
				.mockReturnValueOnce({ name: 'Updated Contact', email: 'updated@example.com' }); // additionalFields

			const requestOptions = await handler['buildRequestOptions']('update', 0);

			expect(requestOptions.method).toBe('PUT');
			expect(requestOptions.url).toContain('/Contact/123');
			expect(requestOptions.body).toEqual({
				name: 'Updated Contact',
				email: 'updated@example.com'
			});
		});

		it('should build correct request options for delete operation', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return contact ID
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue('123');

			const requestOptions = await handler['buildRequestOptions']('delete', 0);

			expect(requestOptions.method).toBe('DELETE');
			expect(requestOptions.url).toContain('/Contact/123');
		});

		it('should build correct request options for list operation', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return query parameters
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue({
				limit: 50,
				offset: 0
			});

			const requestOptions = await handler['buildRequestOptions']('getMany', 0);

			expect(requestOptions.method).toBe('GET');
			expect(requestOptions.url).toContain('/Contact');
			expect(requestOptions.qs).toEqual({
				limit: 50,
				offset: 0
			});
		});

		it('should validate input data successfully', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return valid data
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue({
				name: 'Valid Contact',
				email: 'valid@example.com'
			});

			// This should not throw
			await expect(handler['validateInputData']('create', 0)).resolves.not.toThrow();
		});

		it('should get operation-specific parameters for ID-based operations', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return contact ID
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue('123');

			const params = handler['getOperationSpecificParameters']('getId', 0);

			expect(params).toEqual({ contactId: '123' });
		});

		it('should get operation-specific parameters for email operations', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return send type
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue('pdf');

			const params = handler['getOperationSpecificParameters']('sendEmail', 0);

			expect(params).toEqual({ sendType: 'pdf' });
		});

		it('should get operation-specific parameters for booking operations', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return booking data
			mockExecuteFunctions.getNodeParameter = jest.fn()
				.mockReturnValueOnce(100.50) // amount
				.mockReturnValueOnce('2023-01-01'); // date

			const params = handler['getOperationSpecificParameters']('bookAmount', 0);

			expect(params).toEqual({
				amount: 100.50,
				date: '2023-01-01'
			});
		});

		it('should handle missing parameters gracefully in getOperationSpecificParameters', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to throw error (parameter doesn't exist)
			mockExecuteFunctions.getNodeParameter = jest.fn().mockImplementation(() => {
				throw new Error('Parameter not found');
			});

			const params = handler['getOperationSpecificParameters']('customOperation', 0);

			expect(params).toEqual({});
		});

		it('should transform create data correctly', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			const inputData = {
				name: 'Test Contact',
				email: 'test@example.com',
				phone: '123456789'
			};

			const transformedData = handler['transformCreateData'](inputData);

			// Base implementation should return data as-is
			expect(transformedData).toEqual(inputData);
		});

		it('should transform update data correctly', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			const inputData = {
				name: 'Updated Contact',
				email: 'updated@example.com'
			};

			const transformedData = handler['transformUpdateData'](inputData);

			// Base implementation should return data as-is
			expect(transformedData).toEqual(inputData);
		});

		it('should transform query parameters correctly', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			const inputParams = {
				limit: 50,
				offset: 0,
				search: 'test'
			};

			const transformedParams = handler['transformQueryParams'](inputParams);

			// Base implementation should return params as-is
			expect(transformedParams).toEqual(inputParams);
		});

		it('should execute operation successfully', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock all required methods
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue({
				name: 'Test Contact',
				email: 'test@example.com'
			});

			// Mock the makeRequest method to return a successful response
			const mockResponse = {
				objects: [{
					id: '1',
					objectName: 'Contact',
					create: '2023-01-01',
					update: '2023-01-01',
					name: 'Test Contact',
					category: { id: '1', objectName: 'Category' }
				}]
			};

			jest.spyOn(handler as any, 'makeRequest').mockResolvedValue(mockResponse);

			const result = await handler.execute('create', 0);

			expect(result).toBeDefined();
			expect(result?.json).toEqual(mockResponse.objects[0]); // Single object should return the first object, not array
			expect(result?.pairedItem).toEqual({ item: 0 });
		});

		it('should handle execution errors', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the makeRequest method to throw an error
			jest.spyOn(handler as any, 'makeRequest').mockRejectedValue(new Error('API Error'));

			await expect(handler.execute('create', 0)).rejects.toThrow();
		});

		it('should validate unsupported operations', () => {
			// Create a handler with limited operations
			const limitedConfig = {
				resourceName: 'TestResource',
				apiEndpoint: 'TestResource',
				supportedOperations: {
					create: false,
					read: true,
					update: false,
					delete: false,
					list: true
				}
			};

			// Create a new handler instance with limited config
			const limitedHandler = new (class extends ContactHandler {
				constructor(executeFunctions: IExecuteFunctions) {
					super(executeFunctions);
					this['config'] = limitedConfig;
				}
			})(mockExecuteFunctions);

			// Test unsupported operations
			expect(() => limitedHandler['validateOperation']('create')).toThrow('Create operation not supported');
			expect(() => limitedHandler['validateOperation']('update')).toThrow('Update operation not supported');
			expect(() => limitedHandler['validateOperation']('delete')).toThrow('Delete operation not supported');

			// Test supported operations
			expect(() => limitedHandler['validateOperation']('get')).not.toThrow();
			expect(() => limitedHandler['validateOperation']('getMany')).not.toThrow();
		});

		it('should handle validation for get operation', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return contact ID
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue('123');

			// This should not throw for get operation
			await expect(handler['validateInputData']('get', 0)).resolves.not.toThrow();
		});

		it('should handle validation for delete operation', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return contact ID
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue('123');

			// This should not throw for delete operation
			await expect(handler['validateInputData']('delete', 0)).resolves.not.toThrow();
		});

		it('should handle validation for list operation', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return query parameters
			mockExecuteFunctions.getNodeParameter = jest.fn().mockReturnValue({
				limit: 50,
				offset: 0
			});

			// This should not throw for list operation
			await expect(handler['validateInputData']('getMany', 0)).resolves.not.toThrow();
		});

		it('should handle validation for custom operations with parameters', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to return custom operation data
			mockExecuteFunctions.getNodeParameter = jest.fn()
				.mockReturnValueOnce({ customField: 'value' }) // additionalFields
				.mockReturnValueOnce('123'); // operation-specific parameter

			// This should not throw for custom operation
			await expect(handler['validateInputData']('customOperation', 0)).resolves.not.toThrow();
		});

		it('should handle validation for custom operations without parameters', async () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			// Mock the getNodeParameter method to throw error (no parameters available)
			mockExecuteFunctions.getNodeParameter = jest.fn().mockImplementation(() => {
				throw new Error('Parameter not found');
			});

			// This should not throw for custom operation even without parameters
			await expect(handler['validateInputData']('customOperation', 0)).resolves.not.toThrow();
		});

		it('should format response with single object', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			const mockResponse = {
				objects: [{
					id: '1',
					objectName: 'Contact',
					create: '2023-01-01',
					update: '2023-01-01',
					name: 'Single Contact',
					category: { id: '1', objectName: 'Category' }
				}]
			};

			const result = handler['formatResponse'](mockResponse, 0);

			expect(result.json).toEqual(mockResponse.objects[0]); // Single object should return the first object, not array
			expect(result.pairedItem).toEqual({ item: 0 });
		});

		it('should format response with empty objects', () => {
			const handler = new ContactHandler(mockExecuteFunctions);

			const mockResponse = {
				objects: []
			};

			const result = handler['formatResponse'](mockResponse, 0);

			expect(result.json).toEqual([]);
			expect(result.pairedItem).toEqual({ item: 0 });
		});
	});
});
