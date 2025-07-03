import { TestDataFactory } from './test-utils';

describe('Simple Demo Tests', () => {
  test('should create valid test credentials', () => {
    const credentials = TestDataFactory.createMockCredentials();
    
    expect(credentials.apiKey).toBe('test-api-key-12345');
    expect(credentials.apiVersion).toBe('v2');
  });

  test('should override credentials properties', () => {
    const customCredentials = TestDataFactory.createMockCredentials({
      apiKey: 'custom-api-key',
    });
    
    expect(customCredentials.apiKey).toBe('custom-api-key');
    expect(customCredentials.apiVersion).toBe('v2'); // Should keep default
  });

  test('should create valid contact data', () => {
    const contact = TestDataFactory.createMockContact();
    
    expect(contact.name).toBe('Test Company');
    expect(contact.customerNumber).toBe('CUST-001');
    expect(contact.category.id).toBe('3');
  });

  test('should create valid invoice data', () => {
    const invoice = TestDataFactory.createMockInvoice();
    
    expect(invoice.invoiceNumber).toBe('INV-2023-001');
    expect(invoice.status).toBe('100');
    expect(invoice.sumGross).toBe('119.00');
  });
});
