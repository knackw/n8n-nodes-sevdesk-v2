import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { SevDesk } from '../nodes/SevDesk/SevDesk.node';

describe('SevDesk Node', () => {
  let node: SevDesk;

  beforeEach(() => {
    node = new SevDesk();
  });

  it('should have correct description', () => {
    const description: INodeTypeDescription = node.description;
    expect(description.displayName).toBe('sevDesk');
    expect(description.name).toBe('sevDesk');
    expect(description.group).toEqual(['output']);
    expect(description.version).toBe(1);
  });

  it('should have required credentials', () => {
    const description: INodeTypeDescription = node.description;
    expect(description.credentials).toBeDefined();
    expect(description.credentials).toHaveLength(1);
    expect(description.credentials![0].name).toBe('sevDeskApi');
    expect(description.credentials![0].required).toBe(true);
  });

  it('should have correct request defaults', () => {
    const description: INodeTypeDescription = node.description;
    expect(description.requestDefaults).toBeDefined();
    expect(description.requestDefaults!.baseURL).toBe('https://my.sevdesk.de/api/{{$credentials.apiVersion}}/');
    expect(description.requestDefaults!.headers).toEqual({
      Accept: 'application/json',
      'Content-Type': 'application/json',
    });
  });

  it('should have properties defined', () => {
    const description: INodeTypeDescription = node.description;
    expect(description.properties).toBeDefined();
    expect(description.properties.length).toBeGreaterThan(0);
  });
}); 