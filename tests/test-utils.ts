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
        httpRequest: jest.fn(),
        httpRequestWithAuthentication: jest.fn(),
        requestWithAuthenticationPaginated: jest.fn(),
        returnJsonArray: jest.fn((data: any[]) => data.map(item => ({ json: item }))),
        constructExecutionMetaData: jest.fn((data: INodeExecutionData[], options: any) => data),
      },
      ...overrides,
    } as any;

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
   * Create mock HTTP responses for API testing
   */
  static createMockHttpResponses() {
    return {
      success: jest.fn().mockResolvedValue({
        statusCode: 200,
        body: TestDataFactory.createMockApiResponse([TestDataFactory.createMockContact()]),
      }),
      error: jest.fn().mockRejectedValue({
        statusCode: 400,
        body: TestDataFactory.createMockErrorResponse('Bad Request'),
      }),
      timeout: jest.fn().mockRejectedValue(new Error('Request timeout')),
      unauthorized: jest.fn().mockRejectedValue({
        statusCode: 401,
        body: TestDataFactory.createMockErrorResponse('Unauthorized', 401),
      }),
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
