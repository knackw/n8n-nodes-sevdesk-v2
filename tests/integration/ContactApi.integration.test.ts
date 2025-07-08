import { ContactHandler } from '../../nodes/SevDesk/handlers/ContactHandler';
import { SevDeskApiClient } from '../../nodes/SevDesk/api/SevDeskApiClient';
import { TestDataFactory } from '../test-utils';
import { IExecuteFunctions, IHttpRequestOptions } from 'n8n-workflow';
import axios from 'axios';

// Mock axios for integration tests
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Contact API Integration Tests', () => {
  let contactHandler: ContactHandler;
  let mockExecuteFunctions: jest.Mocked<IExecuteFunctions>;
  let apiClient: SevDeskApiClient;

  beforeEach(() => {
    // Reset axios mock
    jest.clearAllMocks();

    // Create mock execute functions with realistic API client behavior
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn(),
      helpers: {
        httpRequest: jest.fn(),
      },
      getInputData: jest.fn(),
      continueOnFail: jest.fn().mockReturnValue(false),
      getNode: jest.fn().mockReturnValue({ name: 'SevDesk Test Node' }),
      getWorkflow: jest.fn().mockReturnValue({ id: 'test-workflow' }),
    } as any;

    // Mock credentials with realistic API key
    mockExecuteFunctions.getCredentials.mockResolvedValue({
      apiKey: 'test-api-key-12345',
      licenseCode: 'test-license-code',
    });

    // Initialize API client and handler
    apiClient = new SevDeskApiClient(mockExecuteFunctions);
    contactHandler = new ContactHandler(mockExecuteFunctions);
  });

  describe('Authentication Integration', () => {
    it('should authenticate successfully with valid credentials', async () => {
      // Mock successful authentication response
      const mockAuthResponse = {
        status: 200,
        data: {
          success: true,
          objects: {
            user: {
              id: '12345',
              username: 'test@example.com',
            },
          },
        },
      };

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockAuthResponse);

      // Test authentication
      const result = await apiClient.testCredentials();

      expect(result).toBe(true);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/User'),
          headers: expect.objectContaining({
            'Authorization': expect.stringContaining('test-api-key-12345'),
          }),
        })
      );
    });

    it('should handle authentication failure gracefully', async () => {
      // Mock authentication failure
      const mockAuthError = {
        response: {
          status: 401,
          data: {
            error: {
              message: 'Invalid API key',
            },
          },
        },
      };

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(mockAuthError);

      // Test authentication failure
      await expect(apiClient.testCredentials()).rejects.toThrow('Invalid API key');
    });
  });

  describe('Contact CRUD Operations Integration', () => {
    beforeEach(() => {
      // Mock successful authentication for all CRUD tests
      mockExecuteFunctions.helpers.httpRequest.mockImplementation((options: IHttpRequestOptions) => {
        if (options.url?.includes('/User')) {
          return Promise.resolve({
            status: 200,
            data: { success: true, objects: { user: { id: '12345' } } },
          });
        }
        return Promise.resolve({ status: 200, data: {} });
      });
    });

    it('should create a contact successfully', async () => {
      const mockContactData = TestDataFactory.createMockContact();
      const mockCreateResponse = {
        status: 201,
        data: {
          success: true,
          objects: {
            ...mockContactData,
            id: '67890',
            create: '2025-01-07T10:00:00Z',
          },
        },
      };

      // Mock node parameters for create operation
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('create') // operation
        .mockReturnValueOnce(mockContactData.name) // name
        .mockReturnValueOnce(mockContactData.customerNumber) // customerNumber
        .mockReturnValueOnce('customer') // category
        .mockReturnValueOnce(mockContactData); // additionalFields

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockCreateResponse);

      // Execute create operation
      const result = await contactHandler.handleCreateOperation(0);

      expect(result).toEqual([{
        json: mockCreateResponse.data.objects,
        pairedItem: { item: 0 },
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'POST',
          url: expect.stringContaining('/Contact'),
          body: expect.objectContaining({
            name: mockContactData.name,
            customerNumber: mockContactData.customerNumber,
            category: expect.objectContaining({
              id: expect.any(String),
              objectName: 'Category',
            }),
          }),
        })
      );
    });

    it('should retrieve contacts with pagination', async () => {
      const mockContactsResponse = {
        status: 200,
        data: {
          success: true,
          objects: [
            TestDataFactory.createMockContact({ id: '1', name: 'Contact 1' }),
            TestDataFactory.createMockContact({ id: '2', name: 'Contact 2' }),
          ],
          total: 25,
          countOnPage: 2,
        },
      };

      // Mock node parameters for get all operation
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getAll') // operation
        .mockReturnValueOnce(true) // returnAll
        .mockReturnValueOnce(10) // limit
        .mockReturnValueOnce({}); // filters

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockContactsResponse);

      // Execute get all operation
      const result = await contactHandler.handleGetAllOperation(0);

      expect(result).toHaveLength(2);
      expect(result[0].json).toEqual(mockContactsResponse.data.objects[0]);
      expect(result[1].json).toEqual(mockContactsResponse.data.objects[1]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/Contact'),
          qs: expect.objectContaining({
            limit: 10,
          }),
        })
      );
    });

    it('should update a contact successfully', async () => {
      const contactId = '67890';
      const updateData = { name: 'Updated Contact Name' };
      const mockUpdateResponse = {
        status: 200,
        data: {
          success: true,
          objects: {
            id: contactId,
            ...updateData,
            update: '2025-01-07T11:00:00Z',
          },
        },
      };

      // Mock node parameters for update operation
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('update') // operation
        .mockReturnValueOnce(contactId) // contactId
        .mockReturnValueOnce(updateData); // updateFields

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockUpdateResponse);

      // Execute update operation
      const result = await contactHandler.handleUpdateOperation(0);

      expect(result).toEqual([{
        json: mockUpdateResponse.data.objects,
        pairedItem: { item: 0 },
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'PUT',
          url: expect.stringContaining(`/Contact/${contactId}`),
          body: updateData,
        })
      );
    });

    it('should delete a contact successfully', async () => {
      const contactId = '67890';
      const mockDeleteResponse = {
        status: 200,
        data: {
          success: true,
          objects: {
            id: contactId,
            status: 'deleted',
          },
        },
      };

      // Mock node parameters for delete operation
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('delete') // operation
        .mockReturnValueOnce(contactId); // contactId

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockDeleteResponse);

      // Execute delete operation
      const result = await contactHandler.handleDeleteOperation(0);

      expect(result).toEqual([{
        json: mockDeleteResponse.data.objects,
        pairedItem: { item: 0 },
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'DELETE',
          url: expect.stringContaining(`/Contact/${contactId}`),
        })
      );
    });
  });

  describe('Custom Operations Integration', () => {
    it('should check customer number availability', async () => {
      const customerNumber = 'CUST-001';
      const mockAvailabilityResponse = {
        status: 200,
        data: {
          success: true,
          objects: {
            available: true,
          },
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('checkCustomerNumberAvailability') // operation
        .mockReturnValueOnce(customerNumber); // customerNumber

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockAvailabilityResponse);

      // Execute custom operation
      const result = await contactHandler.handleCustomOperation('checkCustomerNumberAvailability', 0);

      expect(result).toEqual([{
        json: mockAvailabilityResponse.data.objects,
        pairedItem: { item: 0 },
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/Contact/Mapper/checkCustomerNumberAvailability'),
          qs: { customerNumber },
        })
      );
    });

    it('should find contact by custom field value', async () => {
      const customFieldSetting = { id: '123', objectName: 'Contact' };
      const value = 'test-value';
      const mockSearchResponse = {
        status: 200,
        data: {
          success: true,
          objects: [TestDataFactory.createMockContact({ name: 'Found Contact' })],
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('findByCustomFieldValue') // operation
        .mockReturnValueOnce(customFieldSetting) // customFieldSetting
        .mockReturnValueOnce(value); // value

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockSearchResponse);

      // Execute custom operation
      const result = await contactHandler.handleCustomOperation('findByCustomFieldValue', 0);

      expect(result).toEqual([{
        json: mockSearchResponse.data.objects[0],
        pairedItem: { item: 0 },
      }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          method: 'GET',
          url: expect.stringContaining('/Contact/Factory/findContactByCustomFieldValue'),
          qs: {
            'customFieldSetting[id]': customFieldSetting.id,
            'customFieldSetting[objectName]': customFieldSetting.objectName,
            value,
          },
        })
      );
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle API rate limiting', async () => {
      const rateLimitError = {
        response: {
          status: 429,
          data: {
            error: {
              message: 'Rate limit exceeded',
            },
          },
          headers: {
            'retry-after': '60',
          },
        },
      };

      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(rateLimitError);

      // Test rate limiting error handling
      await expect(contactHandler.handleGetAllOperation(0)).rejects.toThrow('Rate limit exceeded');
    });

    it('should handle validation errors', async () => {
      const validationError = {
        response: {
          status: 400,
          data: {
            error: {
              message: 'Validation failed',
              details: {
                name: 'Name is required',
                customerNumber: 'Customer number already exists',
              },
            },
          },
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('create')
        .mockReturnValueOnce('') // empty name
        .mockReturnValueOnce('EXISTING-001'); // duplicate customer number

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(validationError);

      // Test validation error handling
      await expect(contactHandler.handleCreateOperation(0)).rejects.toThrow('Validation failed');
    });

    it('should handle network timeouts', async () => {
      const timeoutError = {
        code: 'ECONNABORTED',
        message: 'timeout of 30000ms exceeded',
      };

      mockExecuteFunctions.getNodeParameter.mockReturnValue('getAll');
      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(timeoutError);

      // Test timeout error handling
      await expect(contactHandler.handleGetAllOperation(0)).rejects.toThrow('timeout of 30000ms exceeded');
    });
  });

  describe('Data Transformation Integration', () => {
    it('should properly transform German address data', async () => {
      const germanContact = {
        name: 'Müller GmbH',
        street: 'Hauptstraße 123',
        zip: '10115',
        city: 'Berlin',
        country: { id: '1', objectName: 'StaticCountry' }, // Germany
        vatNumber: 'DE123456789',
      };

      const mockResponse = {
        status: 201,
        data: {
          success: true,
          objects: {
            ...germanContact,
            id: '12345',
          },
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('create')
        .mockReturnValueOnce(germanContact.name)
        .mockReturnValueOnce('CUST-001')
        .mockReturnValueOnce('customer')
        .mockReturnValueOnce(germanContact);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await contactHandler.handleCreateOperation(0);

      expect(result[0].json).toEqual(mockResponse.data.objects);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            name: germanContact.name,
            street: germanContact.street,
            zip: germanContact.zip,
            city: germanContact.city,
            vatNumber: germanContact.vatNumber,
          }),
        })
      );
    });

    it('should handle special characters in contact data', async () => {
      const specialCharContact = {
        name: 'Café & Bäckerei Müller',
        description: 'Spezialitäten: Bröt, Käse, Weiß',
        email: 'info@café-müller.de',
      };

      const mockResponse = {
        status: 201,
        data: {
          success: true,
          objects: {
            ...specialCharContact,
            id: '12345',
          },
        },
      };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('create')
        .mockReturnValueOnce(specialCharContact.name)
        .mockReturnValueOnce('CAFE-001')
        .mockReturnValueOnce('customer')
        .mockReturnValueOnce(specialCharContact);

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await contactHandler.handleCreateOperation(0);

      expect(result[0].json.name).toBe(specialCharContact.name);
      expect(result[0].json.description).toBe(specialCharContact.description);
      expect(result[0].json.email).toBe(specialCharContact.email);
    });
  });
});
