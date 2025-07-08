import { IExecuteFunctions, INodeExecutionData, ICredentialDataDecryptedObject } from 'n8n-workflow';

/**
 * Test data factories for consistent test scenarios
 */
export class TestDataFactory {
  /**
   * Create mock credential data
   */
  static createMockCredentials(overrides: Partial<ICredentialDataDecryptedObject> = {}): ICredentialDataDecryptedObject {
    return {
      apiKey: 'test-api-key-12345',
      apiVersion: 'v2',
      ...overrides,
    };
  }

  /**
   * Create mock workflow settings
   */
  static createMockWorkflowSettings(overrides: Record<string, any> = {}): Record<string, any> {
    return {
      apiVersion: 'v2',
      timeout: 30000,
      retries: 3,
      batchSize: 100,
      enableLogging: true,
      ...overrides,
    };
  }

  /**
   * Create mock SevDesk contact data
   */
  static createMockContact(overrides: Record<string, any> = {}): Record<string, any> {
    return {
      id: '12345',
      objectName: 'Contact',
      name: 'Test Company',
      name2: 'Test Department',
      familyname: 'Doe',
      surename: 'John',
      title: 'Mr.',
      category: {
        id: '3',
        objectName: 'Category',
      },
      description: 'Test contact description',
      academicTitle: 'Dr.',
      gender: 'male',
      customerNumber: 'CUST-001',
      parent: null,
      vatNumber: 'DE123456789',
      bankAccount: 'DE89370400440532013000',
      bankNumber: '37040044',
      defaultCashbackTime: '14',
      defaultCashbackPercent: '2.00',
      defaultTimeToPay: '30',
      taxNumber: '123/456/78901',
      taxOffice: 'Test Tax Office',
      exemptVat: '0',
      taxType: 'default',
      taxSet: null,
      defaultDiscountAmount: '0.00',
      defaultDiscountPercentage: '0.00',
      buyerReference: 'REF-001',
      governmentAgency: '0',
      ...overrides,
    };
  }

  /**
   * Create mock SevDesk invoice data
   */
  static createMockInvoice(overrides: Record<string, any> = {}): Record<string, any> {
    return {
      id: '67890',
      objectName: 'Invoice',
      invoiceNumber: 'INV-2023-001',
      contact: {
        id: '12345',
        objectName: 'Contact',
      },
      contactPerson: {
        id: '1',
        objectName: 'SevUser',
      },
      invoiceDate: '2023-01-15',
      header: 'Test Invoice Header',
      headText: 'Thank you for your business',
      footText: 'Payment terms: 30 days',
      timeToPay: '30',
      discountTime: '14',
      discount: '2.00',
      addressName: 'Test Company',
      addressStreet: 'Test Street 123',
      addressZip: '12345',
      addressCity: 'Test City',
      addressCountry: {
        id: '1',
        objectName: 'StaticCountry',
      },
      payDate: null,
      status: '100',
      smallSettlement: '0',
      taxRate: '19.00',
      taxText: 'Umsatzsteuer',
      dunningLevel: '0',
      taxType: 'default',
      paymentMethod: {
        id: '1',
        objectName: 'PaymentMethod',
      },
      costCentre: {
        id: '1',
        objectName: 'CostCentre',
      },
      sendDate: null,
      origin: null,
      invoiceType: 'RE',
      accountIntervall: null,
      accountLastInvoice: null,
      accountNextInvoice: null,
      reminderTotal: '0.00',
      reminderDebit: '0.00',
      reminderDeadline: null,
      reminderCharge: '0.00',
      taxSet: null,
      address: 'Test Company\nTest Street 123\n12345 Test City',
      currency: 'EUR',
      sumNet: '100.00',
      sumTax: '19.00',
      sumGross: '119.00',
      sumDiscounts: '0.00',
      sumNetForeignCurrency: '100.00',
      sumTaxForeignCurrency: '19.00',
      sumGrossForeignCurrency: '119.00',
      sumDiscountsForeignCurrency: '0.00',
      customerInternalNote: 'Internal note',
      showNet: '1',
      enshrined: null,
      sendType: 'VPR',
      deliveryTerms: 'Standard delivery',
      deliveryDate: '2023-01-20',
      deliveryDateUntil: null,
      ...overrides,
    };
  }

  /**
   * Create mock node execution data
   */
  static createMockNodeExecutionData(data: Record<string, any>[]): INodeExecutionData[][] {
    return [data.map(item => ({ json: item }))];
  }

  /**
   * Create mock API response
   */
  static createMockApiResponse(data: any, success: boolean = true): Record<string, any> {
    return {
      success,
      data,
      total: Array.isArray(data) ? data.length : 1,
      countAll: Array.isArray(data) ? data.length : 1,
    };
  }

  /**
   * Create mock error response
   */
  static createMockErrorResponse(message: string, code: number = 400): Record<string, any> {
    return {
      success: false,
      error: {
        message,
        code,
        details: 'Test error details',
      },
    };
  }

  /**
   * Create mock voucher data
   */
  static createMockVoucher(overrides: Partial<any> = {}): Record<string, any> {
    return {
      id: '1',
      objectName: 'Voucher',
      create: '2023-01-01T00:00:00Z',
      update: '2023-01-01T00:00:00Z',
      voucherNumber: 'VOUCH-001',
      voucherDate: '2023-01-01',
      supplier: {
        id: '1',
        objectName: 'Contact',
      },
      supplierName: 'Test Supplier',
      description: 'Test voucher description',
      payDate: '2023-01-15',
      status: '50', // Draft
      sumNet: '100.00',
      sumTax: '19.00',
      sumGross: '119.00',
      taxType: 'default',
      creditDebit: 'D', // Debit
      voucherType: 'VOU',
      currency: 'EUR',
      propertyForeignCurrencyDeadline: null,
      propertyExchangeRate: null,
      taxSet: {
        id: '1',
        objectName: 'TaxSet',
      },
      paymentDeadline: '2023-01-31',
      deliveryDate: '2023-01-01',
      deliveryDateUntil: null,
      document: null,
      costCentre: {
        id: '1',
        objectName: 'CostCentre',
      },
      ...overrides,
    };
  }

  /**
   * Create mock order data
   */
  static createMockOrder(overrides: Partial<any> = {}): Record<string, any> {
    return {
      id: '1',
      objectName: 'Order',
      create: '2023-01-01T00:00:00Z',
      update: '2023-01-01T00:00:00Z',
      orderNumber: 'ORD-001',
      contact: {
        id: '1',
        objectName: 'Contact',
      },
      orderDate: '2023-01-01',
      status: '100', // Draft
      header: 'Test Order Header',
      headText: 'Test order head text',
      footText: 'Test order foot text',
      addressName: 'Test Company',
      addressStreet: 'Test Street 123',
      addressZip: '12345',
      addressCity: 'Test City',
      addressCountry: {
        id: '1',
        objectName: 'StaticCountry',
      },
      createUser: {
        id: '1',
        objectName: 'SevUser',
      },
      sevClient: {
        id: '1',
        objectName: 'SevClient',
      },
      deliveryTerms: 'Standard delivery',
      paymentTerms: 'Net 30',
      origin: null,
      version: '1.0',
      smallSettlement: false,
      contactPerson: {
        id: '1',
        objectName: 'SevUser',
      },
      taxRate: '19.00',
      taxSet: {
        id: '1',
        objectName: 'TaxSet',
      },
      taxText: 'Umsatzsteuer 19%',
      taxType: 'default',
      orderType: 'AN', // Angebot (Quote)
      sendDate: null,
      address: 'Test Company\nTest Street 123\n12345 Test City',
      currency: 'EUR',
      sumNet: '100.00',
      sumTax: '19.00',
      sumGross: '119.00',
      sumDiscounts: '0.00',
      sumNetForeignCurrency: '100.00',
      sumTaxForeignCurrency: '19.00',
      sumGrossForeignCurrency: '119.00',
      sumDiscountsForeignCurrency: '0.00',
      customerInternalNote: null,
      showNet: true,
      sendType: 'VPR', // Email
      ...overrides,
    };
  }

  /**
   * Create mock credit note data
   */
  static createMockCreditNote(overrides: Partial<any> = {}): Record<string, any> {
    return {
      id: '1',
      objectName: 'CreditNote',
      create: '2023-01-01T00:00:00Z',
      update: '2023-01-01T00:00:00Z',
      creditNoteNumber: 'CN-001',
      contact: {
        id: '1',
        objectName: 'Contact',
      },
      creditNoteDate: '2023-01-01',
      status: '100', // Draft
      header: 'Test Credit Note Header',
      headText: 'Test credit note head text',
      footText: 'Test credit note foot text',
      addressName: 'Test Company',
      addressStreet: 'Test Street 123',
      addressZip: '12345',
      addressCity: 'Test City',
      addressCountry: {
        id: '1',
        objectName: 'StaticCountry',
      },
      createUser: {
        id: '1',
        objectName: 'SevUser',
      },
      sevClient: {
        id: '1',
        objectName: 'SevClient',
      },
      smallSettlement: false,
      contactPerson: {
        id: '1',
        objectName: 'SevUser',
      },
      taxRate: '19.00',
      taxSet: {
        id: '1',
        objectName: 'TaxSet',
      },
      taxText: 'Umsatzsteuer 19%',
      taxType: 'default',
      creditNoteType: 'CN',
      sendDate: null,
      address: 'Test Company\nTest Street 123\n12345 Test City',
      currency: 'EUR',
      sumNet: '-100.00',
      sumTax: '-19.00',
      sumGross: '-119.00',
      sumDiscounts: '0.00',
      sumNetForeignCurrency: '-100.00',
      sumTaxForeignCurrency: '-19.00',
      sumGrossForeignCurrency: '-119.00',
      sumDiscountsForeignCurrency: '0.00',
      customerInternalNote: null,
      showNet: true,
      sendType: 'VPR', // Email
      ...overrides,
    };
  }

  /**
   * Create mock part (product/service) data
   */
  static createMockPart(overrides: Partial<any> = {}): Record<string, any> {
    return {
      id: '1',
      objectName: 'Part',
      create: '2023-01-01T00:00:00Z',
      update: '2023-01-01T00:00:00Z',
      name: 'Test Product',
      partNumber: 'PROD-001',
      text: 'Test product description',
      category: {
        id: '1',
        objectName: 'Category',
      },
      stock: 100,
      stockEnabled: true,
      unity: {
        id: '1',
        objectName: 'Unity',
      },
      price: '50.00',
      priceNet: '42.02',
      priceGross: '50.00',
      taxRate: '19.00',
      status: 100, // Active
      internalComment: 'Internal comment for test product',
      sevClient: {
        id: '1',
        objectName: 'SevClient',
      },
      ...overrides,
    };
  }

  /**
   * Create mock tag data
   */
  static createMockTag(overrides: Partial<any> = {}): Record<string, any> {
    return {
      id: '1',
      objectName: 'Tag',
      create: '2023-01-01T00:00:00Z',
      update: '2023-01-01T00:00:00Z',
      name: 'Test Tag',
      color: '#FF0000',
      sevClient: {
        id: '1',
        objectName: 'SevClient',
      },
      ...overrides,
    };
  }

  /**
   * Create mock category data
   */
  static createMockCategory(overrides: Partial<any> = {}): Record<string, any> {
    return {
      id: '1',
      objectName: 'Category',
      create: '2023-01-01T00:00:00Z',
      update: '2023-01-01T00:00:00Z',
      name: 'Test Category',
      priority: 1,
      code: 'CAT001',
      color: '#0000FF',
      postingAccount: null,
      sevClient: {
        id: '1',
        objectName: 'SevClient',
      },
      ...overrides,
    };
  }

  /**
   * Create mock check account data
   */
  static createMockCheckAccount(overrides: Partial<any> = {}): Record<string, any> {
    return {
      id: '1',
      objectName: 'CheckAccount',
      create: '2023-01-01T00:00:00Z',
      update: '2023-01-01T00:00:00Z',
      name: 'Test Bank Account',
      type: 'online',
      importType: null,
      currency: 'EUR',
      defaultAccount: 1,
      status: 100,
      autoMapTransactions: 1,
      accountingSystemNumber: '1200',
      clientNumber: '12345678',
      bankServer: 'test-bank.de',
      bankCode: '12345678',
      description: 'Test bank account description',
      sevClient: {
        id: '1',
        objectName: 'SevClient',
      },
      ...overrides,
    };
  }

  /**
   * Create mock input data for n8n node execution
   */
  static createMockInputData(overrides: Partial<any> = {}): INodeExecutionData {
    return {
      json: {
        id: '1',
        name: 'Test Input Data',
        ...overrides,
      },
      pairedItem: {
        item: 0,
      },
    };
  }

  /**
   * Create mock node data for n8n
   */
  static createMockNode(overrides: Partial<any> = {}): any {
    return {
      id: 'test-node-id',
      name: 'Test SevDesk Node',
      type: 'n8n-nodes-sevdesk-v2.sevDesk',
      typeVersion: 1,
      position: [100, 200],
      parameters: {
        resource: 'contact',
        operation: 'getAll',
        ...overrides.parameters,
      },
      ...overrides,
    };
  }

  /**
   * Create batch of test data for performance testing
   */
  static createBatchTestData(resourceType: string, count: number): any[] {
    const batch: any[] = [];
    for (let i = 0; i < count; i++) {
      switch (resourceType) {
        case 'contact':
          batch.push(this.createMockContact({
            id: (i + 1).toString(),
            name: `Test Company ${i + 1}`,
            customerNumber: `CUST-${String(i + 1).padStart(3, '0')}`,
          }));
          break;
        case 'invoice':
          batch.push(this.createMockInvoice({
            id: (i + 1).toString(),
            invoiceNumber: `INV-2023-${String(i + 1).padStart(3, '0')}`,
          }));
          break;
        case 'voucher':
          batch.push(this.createMockVoucher({
            id: (i + 1).toString(),
            voucherNumber: `VOUCH-${String(i + 1).padStart(3, '0')}`,
          }));
          break;
        case 'order':
          batch.push(this.createMockOrder({
            id: (i + 1).toString(),
            orderNumber: `ORD-${String(i + 1).padStart(3, '0')}`,
          }));
          break;
        default:
          batch.push({ id: (i + 1).toString(), name: `Test ${resourceType} ${i + 1}` });
      }
    }
    return batch;
  }
}

/**
 * Mock execution functions helper
 */
export class MockExecuteFunctions {
  /**
   * Create a comprehensive mock of IExecuteFunctions
   */
  static create(overrides: Partial<IExecuteFunctions> = {}): jest.Mocked<IExecuteFunctions> {
    const mockFunctions = {
      getNodeParameter: jest.fn(),
      getNode: jest.fn().mockReturnValue({
        name: 'Test Node',
        type: 'n8n-nodes-sevdesk-v2.sevDesk',
        typeVersion: 1,
      }),
      getCredentials: jest.fn().mockResolvedValue(TestDataFactory.createMockCredentials()),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getWorkflowStaticData: jest.fn().mockReturnValue({}),
      getRestApiUrl: jest.fn().mockReturnValue('https://test.n8n.io/rest'),
      getInstanceBaseUrl: jest.fn().mockReturnValue('https://test.n8n.io'),
      getInstanceId: jest.fn().mockReturnValue('test-instance-id'),
      getMode: jest.fn().mockReturnValue('manual'),
      getActivationMode: jest.fn().mockReturnValue('manual'),
      getTimezone: jest.fn().mockReturnValue('UTC'),
      getExecuteData: jest.fn().mockReturnValue({
        node: {
          name: 'Test Node',
          type: 'n8n-nodes-sevdesk-v2.sevDesk',
          typeVersion: 1,
        },
        data: {
          main: [[{ json: {} }]],
        },
        source: {
          main: [{ previousNode: 'Start' }],
        },
      }),
      continueOnFail: jest.fn().mockReturnValue(false),
      evaluateExpression: jest.fn((expression: string) => expression),
      getContext: jest.fn().mockReturnValue({}),
      getExecutionId: jest.fn().mockReturnValue('test-execution-id'),
      getWorkflow: jest.fn().mockReturnValue({
        id: 'test-workflow-id',
        name: 'Test Workflow',
      }),
      getWorkflowDataProxy: jest.fn(),
      helpers: {
        httpRequest: jest.fn().mockResolvedValue({ objects: [], total: 0 }),
        httpRequestWithAuthentication: jest.fn().mockResolvedValue({ objects: [], total: 0 }),
        requestWithAuthenticationPaginated: jest.fn().mockResolvedValue({ objects: [], total: 0 }),
        returnJsonArray: jest.fn((data: any[]) => data.map(item => ({ json: item }))),
        constructExecutionMetaData: jest.fn((data: INodeExecutionData[], options: any) => data),
      },
      ...overrides,
    } as jest.Mocked<IExecuteFunctions>;

    return mockFunctions;
  }

  /**
   * Setup common parameter mocks for SevDesk node
   */
  static setupSevDeskParameterMocks(mockFunctions: jest.Mocked<IExecuteFunctions>, params: Record<string, any> = {}) {
    const defaultParams = {
      resource: 'contact',
      operation: 'getAll',
      nodeConfiguration: 'operation',
      ...params,
    };

    mockFunctions.getNodeParameter.mockImplementation((parameterName: string, itemIndex: number) => {
      return (defaultParams as Record<string, any>)[parameterName] || null;
    });
  }
}

/**
 * Performance testing utilities
 */
export class PerformanceTestUtils {
  /**
   * Measure execution time of a function
   */
  static async measureExecutionTime<T>(fn: () => Promise<T>): Promise<{ result: T; duration: number }> {
    const startTime = process.hrtime.bigint();
    const result = await fn();
    const endTime = process.hrtime.bigint();
    const duration = Number(endTime - startTime) / 1000000; // Convert to milliseconds

    return { result, duration };
  }

  /**
   * Run performance benchmark
   */
  static async runBenchmark<T>(
    fn: () => Promise<T>,
    iterations: number = 10
  ): Promise<{
    averageDuration: number;
    minDuration: number;
    maxDuration: number;
    totalDuration: number;
    results: T[];
  }> {
    const durations: number[] = [];
    const results: T[] = [];

    for (let i = 0; i < iterations; i++) {
      const { result, duration } = await this.measureExecutionTime(fn);
      durations.push(duration);
      results.push(result);
    }

    return {
      averageDuration: durations.reduce((sum, d) => sum + d, 0) / durations.length,
      minDuration: Math.min(...durations),
      maxDuration: Math.max(...durations),
      totalDuration: durations.reduce((sum, d) => sum + d, 0),
      results,
    };
  }

  /**
   * Assert performance requirements
   */
  static assertPerformance(duration: number, maxDuration: number, operation: string) {
    if (duration > maxDuration) {
      throw new Error(
        `Performance requirement failed for ${operation}: ` +
        `Expected duration <= ${maxDuration}ms, but got ${duration}ms`
      );
    }
  }
}

/**
 * Integration test utilities
 */
export class IntegrationTestUtils {
  /**
   * Create a complete test scenario for node execution
   */
  static createNodeExecutionScenario(
    nodeParams: Record<string, any>,
    inputData: Record<string, any>[] = [{}],
    credentials?: Partial<ICredentialDataDecryptedObject>
  ) {
    const mockFunctions = MockExecuteFunctions.create();
    MockExecuteFunctions.setupSevDeskParameterMocks(mockFunctions, nodeParams);

    if (credentials) {
      mockFunctions.getCredentials.mockResolvedValue(
        TestDataFactory.createMockCredentials(credentials)
      );
    }

    mockFunctions.getInputData.mockReturnValue(
      inputData.map(data => ({ json: data }))
    );

    return mockFunctions;
  }

  /**
   * Validate node execution result structure
   */
  static validateExecutionResult(result: INodeExecutionData[][], expectedLength: number = 1) {
    expect(Array.isArray(result)).toBe(true);
    expect(result).toHaveLength(expectedLength);

    result.forEach((batch, batchIndex) => {
      expect(Array.isArray(batch)).toBe(true);
      batch.forEach((item, itemIndex) => {
        expect(item).toHaveProperty('json');
        expect(typeof item.json).toBe('object');
      });
    });
  }

  /**
   * Create comprehensive mock HTTP responses for SevDesk API testing
   * Integrates with SevDeskApiMock for realistic API behavior
   */
  static createMockHttpResponses() {
    // Import SevDeskApiMock dynamically to avoid circular dependencies
    const { sevDeskApiMock } = require('./mocks/SevDeskApiMock');

    return {
      // Successful responses for different resources
      contacts: {
        getAll: jest.fn().mockImplementation(() =>
          sevDeskApiMock.mockHttpRequest({ method: 'GET', url: '/api/v2/Contact' })
        ),
        getById: jest.fn().mockImplementation((id: string) =>
          sevDeskApiMock.mockHttpRequest({ method: 'GET', url: `/api/v2/Contact/${id}` })
        ),
        create: jest.fn().mockImplementation((data: any) =>
          sevDeskApiMock.mockHttpRequest({ method: 'POST', url: '/api/v2/Contact', body: data })
        ),
        update: jest.fn().mockImplementation((id: string, data: any) =>
          sevDeskApiMock.mockHttpRequest({ method: 'PUT', url: `/api/v2/Contact/${id}`, body: data })
        ),
        delete: jest.fn().mockImplementation((id: string) =>
          sevDeskApiMock.mockHttpRequest({ method: 'DELETE', url: `/api/v2/Contact/${id}` })
        ),
      },
      invoices: {
        getAll: jest.fn().mockImplementation(() =>
          sevDeskApiMock.mockHttpRequest({ method: 'GET', url: '/api/v2/Invoice' })
        ),
        getById: jest.fn().mockImplementation((id: string) =>
          sevDeskApiMock.mockHttpRequest({ method: 'GET', url: `/api/v2/Invoice/${id}` })
        ),
        create: jest.fn().mockImplementation((data: any) =>
          sevDeskApiMock.mockHttpRequest({ method: 'POST', url: '/api/v2/Invoice', body: data })
        ),
        update: jest.fn().mockImplementation((id: string, data: any) =>
          sevDeskApiMock.mockHttpRequest({ method: 'PUT', url: `/api/v2/Invoice/${id}`, body: data })
        ),
        delete: jest.fn().mockImplementation((id: string) =>
          sevDeskApiMock.mockHttpRequest({ method: 'DELETE', url: `/api/v2/Invoice/${id}` })
        ),
      },
      vouchers: {
        getAll: jest.fn().mockImplementation(() =>
          sevDeskApiMock.mockHttpRequest({ method: 'GET', url: '/api/v2/Voucher' })
        ),
        getById: jest.fn().mockImplementation((id: string) =>
          sevDeskApiMock.mockHttpRequest({ method: 'GET', url: `/api/v2/Voucher/${id}` })
        ),
        create: jest.fn().mockImplementation((data: any) =>
          sevDeskApiMock.mockHttpRequest({ method: 'POST', url: '/api/v2/Voucher', body: data })
        ),
        update: jest.fn().mockImplementation((id: string, data: any) =>
          sevDeskApiMock.mockHttpRequest({ method: 'PUT', url: `/api/v2/Voucher/${id}`, body: data })
        ),
        delete: jest.fn().mockImplementation((id: string) =>
          sevDeskApiMock.mockHttpRequest({ method: 'DELETE', url: `/api/v2/Voucher/${id}` })
        ),
      },
      orders: {
        getAll: jest.fn().mockImplementation(() =>
          sevDeskApiMock.mockHttpRequest({ method: 'GET', url: '/api/v2/Order' })
        ),
        getById: jest.fn().mockImplementation((id: string) =>
          sevDeskApiMock.mockHttpRequest({ method: 'GET', url: `/api/v2/Order/${id}` })
        ),
        create: jest.fn().mockImplementation((data: any) =>
          sevDeskApiMock.mockHttpRequest({ method: 'POST', url: '/api/v2/Order', body: data })
        ),
        update: jest.fn().mockImplementation((id: string, data: any) =>
          sevDeskApiMock.mockHttpRequest({ method: 'PUT', url: `/api/v2/Order/${id}`, body: data })
        ),
        delete: jest.fn().mockImplementation((id: string) =>
          sevDeskApiMock.mockHttpRequest({ method: 'DELETE', url: `/api/v2/Order/${id}` })
        ),
      },
      // Error scenarios using SevDeskApiMock error system
      errors: {
        unauthorized: jest.fn().mockImplementation(() =>
          sevDeskApiMock.mockSevDeskErrors.unauthorized()
        ),
        notFound: jest.fn().mockImplementation((resource: string, id: string) =>
          sevDeskApiMock.mockSevDeskErrors.notFound(resource, id)
        ),
        badRequest: jest.fn().mockImplementation((message?: string) =>
          sevDeskApiMock.mockSevDeskErrors.badRequest(message)
        ),
        rateLimited: jest.fn().mockImplementation(() =>
          sevDeskApiMock.mockSevDeskErrors.rateLimited()
        ),
        serverError: jest.fn().mockImplementation(() =>
          sevDeskApiMock.mockSevDeskErrors.serverError()
        ),
        validationError: jest.fn().mockImplementation((field: string) =>
          sevDeskApiMock.mockSevDeskErrors.validationError(field)
        ),
      },
      // Batch operations
      batch: {
        execute: jest.fn().mockImplementation((operations: any[]) =>
          sevDeskApiMock.mockBatchOperation(operations)
        ),
      },
      // Generic HTTP request mock that routes through SevDeskApiMock
      httpRequest: jest.fn().mockImplementation((options: any) =>
        sevDeskApiMock.mockHttpRequest(options)
      ),
    };
  }
}

/**
 * Test assertion helpers
 */
export class TestAssertions {
  /**
   * Assert that an object has all required properties
   */
  static assertHasRequiredProperties(obj: any, requiredProps: string[]) {
    requiredProps.forEach(prop => {
      expect(obj).toHaveProperty(prop);
      expect(obj[prop]).toBeDefined();
    });
  }

  /**
   * Assert that sensitive data is not exposed
   */
  static assertNoSensitiveDataExposed(obj: any, sensitivePatterns: RegExp[] = []) {
    const objString = JSON.stringify(obj);
    const defaultPatterns = [
      /[a-f0-9]{32,}/i, // API keys
      /sk_[a-zA-Z0-9]{32,}/i, // Secret keys
      /password/i, // Password fields
      /secret/i, // Secret fields
    ];

    [...defaultPatterns, ...sensitivePatterns].forEach(pattern => {
      expect(objString).not.toMatch(pattern);
    });
  }

  /**
   * Assert API response structure
   */
  static assertApiResponseStructure(response: any, expectSuccess: boolean = true) {
    expect(response).toHaveProperty('success');
    expect(response.success).toBe(expectSuccess);

    if (expectSuccess) {
      expect(response).toHaveProperty('data');
    } else {
      expect(response).toHaveProperty('error');
      expect(response.error).toHaveProperty('message');
    }
  }

  /**
   * Assert n8n node execution data structure
   */
  static assertNodeExecutionDataStructure(data: INodeExecutionData[]) {
    expect(Array.isArray(data)).toBe(true);

    data.forEach(item => {
      expect(item).toHaveProperty('json');
      expect(typeof item.json).toBe('object');
    });
  }
}

export const createTestCredentials = (overrides: Partial<ICredentialDataDecryptedObject> = {}): ICredentialDataDecryptedObject => {
	return {
		apiKey: 'test-api-key-12345',
		apiVersion: 'v2',
		...overrides,
	};
};
