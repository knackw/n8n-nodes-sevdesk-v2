import { ICredentialType, INodeProperties } from 'n8n-workflow';
import { SevDeskApi } from '../credentials/SevDeskApi.credentials';

describe('SevDeskApi Credentials', () => {
  let credentials: SevDeskApi;

  beforeEach(() => {
    credentials = new SevDeskApi();
  });

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

  it('should have authentication configuration', () => {
    expect(credentials.authenticate).toBeDefined();
    expect(credentials.authenticate.type).toBe('generic');
    expect(credentials.authenticate.properties.headers).toEqual({
      'Authorization': '={{$credentials.apiKey}}',
    });
  });

  it('should have test configuration', () => {
    expect(credentials.test).toBeDefined();
    expect(credentials.test.request.baseURL).toBe('https://my.sevdesk.de/api/{{$credentials.apiVersion}}/Contact');
    expect(credentials.test.request.method).toBe('GET');
    expect(credentials.test.request.qs).toEqual({ limit: 1 });
  });
}); 