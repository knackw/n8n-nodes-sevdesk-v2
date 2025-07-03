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
			expect(nodeApiError.description).toBe('Contact operation failed: Test error');
			expect(nodeApiError).toBeInstanceOf(Error);
		});
	});
});
