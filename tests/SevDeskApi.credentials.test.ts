import { INodeProperties, ICredentialTestRequest } from 'n8n-workflow';
import { SevDeskApi } from '../credentials/SevDeskApi.credentials';

describe('SevDeskApi Credentials', () => {
  let credentials: SevDeskApi;

  beforeEach(() => {
    credentials = new SevDeskApi();
  });

  describe('Credential Configuration', () => {
    it('should have correct name and display name', () => {
      expect(credentials.name).toBe('sevDeskApi');
      expect(credentials.displayName).toBe('sevDesk API');
    });

    it('should have documentation URL', () => {
      expect(credentials.documentationUrl).toBe('https://api.sevdesk.de/#section/Authentication-and-Authorization');
    });

    it('should have required properties', () => {
      const properties: INodeProperties[] = credentials.properties;
      expect(properties).toHaveLength(2);

      // Check API Key property
      const apiKeyProperty = properties.find(p => p.name === 'apiKey');
      expect(apiKeyProperty).toBeDefined();
      expect(apiKeyProperty!.type).toBe('string');
      expect(apiKeyProperty!.typeOptions?.password).toBe(true);

      // Check API Version property
      const apiVersionProperty = properties.find(p => p.name === 'apiVersion');
      expect(apiVersionProperty).toBeDefined();
      expect(apiVersionProperty!.type).toBe('options');
      expect(apiVersionProperty!.default).toBe('v2');
    });

    it('should have expected properties', () => {
      const properties: INodeProperties[] = credentials.properties;
      const propertyNames = properties.map(p => p.name);
      
      expect(propertyNames).toContain('apiKey');
      expect(propertyNames).toContain('apiVersion');
      expect(propertyNames).toHaveLength(2);
    });

    it('should have correct property types and configurations', () => {
      const properties: INodeProperties[] = credentials.properties;

      // API Key should be password type
      const apiKey = properties.find(p => p.name === 'apiKey');
      expect(apiKey?.type).toBe('string');
      expect(apiKey?.typeOptions?.password).toBe(true);

      // API Version should have options
      const apiVersion = properties.find(p => p.name === 'apiVersion');
      expect(apiVersion?.type).toBe('options');
      expect(apiVersion?.options).toBeDefined();
      expect(Array.isArray(apiVersion?.options)).toBe(true);
    });

    it('should have valid API version options', () => {
      const properties: INodeProperties[] = credentials.properties;
      const apiVersionProperty = properties.find(p => p.name === 'apiVersion');

      expect(apiVersionProperty?.options).toBeDefined();
      const options = apiVersionProperty!.options as Array<{ name: string; value: string }>;

      // Should have v1 and v2 options
      const values = options.map(opt => opt.value);
      expect(values).toContain('v1');
      expect(values).toContain('v2');

      // Default should be v2
      expect(apiVersionProperty?.default).toBe('v2');
    });
  });

  describe('Authentication Configuration', () => {
    it('should have authentication configuration', () => {
      expect(credentials.authenticate).toBeDefined();
      expect(credentials.authenticate.type).toBe('generic');
      expect(credentials.authenticate.properties.headers).toEqual({
        'Authorization': '={{$credentials.apiKey}}',
      });
    });

    it('should use correct authentication method', () => {
      const auth = credentials.authenticate;
      expect(auth.type).toBe('generic');
      expect(auth.properties).toBeDefined();
      expect(auth.properties.headers).toBeDefined();
      if (auth.properties.headers) {
        expect(auth.properties.headers['Authorization']).toBe('={{$credentials.apiKey}}');
      }
    });

    it('should not expose sensitive data in authentication config', () => {
      const auth = credentials.authenticate;
      const authString = JSON.stringify(auth);

      // Should not contain actual API keys or sensitive data
      expect(authString).not.toMatch(/[a-f0-9]{32,}/); // No actual API keys
      expect(authString).toContain('$credentials.apiKey'); // Should use template
    });
  });

  describe('Test Configuration', () => {
    it('should have test configuration', () => {
      expect(credentials.test).toBeDefined();
      expect(credentials.test.request.baseURL).toBe('https://my.sevdesk.de/api/{{$credentials.apiVersion}}');
      expect(credentials.test.request.url).toBe('/Contact');
      expect(credentials.test.request.method).toBe('GET');
      expect(credentials.test.request.qs).toEqual({ limit: 1 });
    });

    it('should use correct test endpoint', () => {
      const test = credentials.test;
      expect(test.request.baseURL).toContain('my.sevdesk.de/api');
      expect(test.request.baseURL).toContain('{{$credentials.apiVersion}}');
      expect(test.request.url).toBe('/Contact');
    });

    it('should use minimal test request', () => {
      const test = credentials.test;
      expect(test.request.method).toBe('GET');
      expect(test.request.qs).toEqual({ limit: 1 });

      // Should not have body for GET request
      expect(test.request.body).toBeUndefined();
    });

    it('should have proper test request structure', () => {
      const test: ICredentialTestRequest = credentials.test;

      // Required properties
      expect(test.request).toBeDefined();
      expect(test.request.baseURL).toBeDefined();
      expect(test.request.method).toBeDefined();

      // Optional properties should be properly typed
      if (test.request.headers) {
        expect(typeof test.request.headers).toBe('object');
      }

      if (test.request.qs) {
        expect(typeof test.request.qs).toBe('object');
      }
    });
  });

  describe('Field Validation', () => {
    it('should have helpful descriptions for all fields', () => {
      const properties: INodeProperties[] = credentials.properties;

      properties.forEach(property => {
        expect(property.description).toBeDefined();
        expect(property.description).not.toBe('');
        expect(typeof property.description).toBe('string');
      });
    });

    it('should have proper display names for all fields', () => {
      const properties: INodeProperties[] = credentials.properties;

      properties.forEach(property => {
        expect(property.displayName).toBeDefined();
        expect(property.displayName).not.toBe('');
        expect(typeof property.displayName).toBe('string');
      });
    });
  });

  describe('Security Considerations', () => {
    it('should mark API key as password type', () => {
      const properties: INodeProperties[] = credentials.properties;
      const apiKey = properties.find(p => p.name === 'apiKey');
      
      expect(apiKey).toBeDefined();
      expect(apiKey?.typeOptions?.password).toBe(true);
    });

    it('should not expose sensitive data in configuration', () => {
      const configString = JSON.stringify(credentials);

      // Should not contain actual sensitive values
      expect(configString).not.toMatch(/sk_[a-zA-Z0-9]{32,}/); // No actual API keys
      expect(configString).not.toMatch(/[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/); // No UUIDs
    });

    it('should use HTTPS for all API endpoints', () => {
      expect(credentials.test.request.baseURL).toMatch(/^https:/);
      expect(credentials.documentationUrl).toMatch(/^https:/);
    });
  });

  describe('API Version Compatibility', () => {
    it('should support multiple API versions', () => {
      const properties: INodeProperties[] = credentials.properties;
      const apiVersionProperty = properties.find(p => p.name === 'apiVersion');
      const options = apiVersionProperty!.options as Array<{ name: string; value: string }>;

      expect(options.length).toBeGreaterThanOrEqual(2);
      expect(options.some(opt => opt.value === 'v1')).toBe(true);
      expect(options.some(opt => opt.value === 'v2')).toBe(true);
    });

    it('should have proper version naming', () => {
      const properties: INodeProperties[] = credentials.properties;
      const apiVersionProperty = properties.find(p => p.name === 'apiVersion');
      const options = apiVersionProperty!.options as Array<{ name: string; value: string }>;

      options.forEach(option => {
        expect(option.name).toBeDefined();
        expect(option.value).toBeDefined();
        expect(option.value).toMatch(/^v\d+$/); // Should be v1, v2, etc.
      });
    });

    it('should use latest stable version as default', () => {
      const properties: INodeProperties[] = credentials.properties;
      const apiVersionProperty = properties.find(p => p.name === 'apiVersion');

      expect(apiVersionProperty?.default).toBe('v2');
    });
  });

  describe('Integration Tests', () => {
    it('should have complete credential structure for testing', () => {
      // Verify all components needed for credential testing are present
      expect(credentials.name).toBeDefined();
      expect(credentials.displayName).toBeDefined();
      expect(credentials.properties).toBeDefined();
      expect(credentials.authenticate).toBeDefined();
      expect(credentials.test).toBeDefined();
      expect(credentials.documentationUrl).toBeDefined();
    });

    it('should be compatible with n8n credential system', () => {
      // Test that the credential follows n8n patterns
      expect(typeof credentials.name).toBe('string');
      expect(Array.isArray(credentials.properties)).toBe(true);
      expect(typeof credentials.authenticate).toBe('object');
      expect(typeof credentials.test).toBe('object');
    });
  });
});
