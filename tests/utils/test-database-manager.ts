import { testDataFactory } from '../factories/test-data-factory';

/**
 * Test Database Manager for handling test data seeding and cleanup
 * This manager provides utilities for setting up and tearing down test data
 */
export class TestDatabaseManager {
  private static instance: TestDatabaseManager;
  private testData: Map<string, any> = new Map();
  private cleanupTasks: Array<() => Promise<void>> = [];

  private constructor() {}

  public static getInstance(): TestDatabaseManager {
    if (!TestDatabaseManager.instance) {
      TestDatabaseManager.instance = new TestDatabaseManager();
    }
    return TestDatabaseManager.instance;
  }

  /**
   * Seed test database with initial data
   */
  public async seedDatabase(scenario: 'unit' | 'integration' | 'e2e' | 'performance' = 'unit'): Promise<void> {
    console.log(`Seeding test database for ${scenario} tests...`);

    try {
      switch (scenario) {
        case 'unit':
          await this.seedUnitTestData();
          break;
        case 'integration':
          await this.seedIntegrationTestData();
          break;
        case 'e2e':
          await this.seedE2ETestData();
          break;
        case 'performance':
          await this.seedPerformanceTestData();
          break;
      }

      console.log(`Test database seeded successfully for ${scenario} tests`);
    } catch (error) {
      console.error(`Failed to seed test database for ${scenario} tests:`, error);
      throw error;
    }
  }

  /**
   * Seed data for unit tests
   */
  private async seedUnitTestData(): Promise<void> {
    // Create basic test entities for unit tests
    const contacts = testDataFactory.createContactBatch(10, { name: 'Unit Test Contact' });
    const invoices = testDataFactory.createInvoiceBatch(10, contacts[0].id, { invoiceNumber: 'UNIT-INV' });
    const vouchers = Array.from({ length: 5 }, () => testDataFactory.createVoucher());

    this.testData.set('unit-contacts', contacts);
    this.testData.set('unit-invoices', invoices);
    this.testData.set('unit-vouchers', vouchers);

    // Register cleanup for unit test data
    this.registerCleanup('unit-test-data', async () => {
      this.testData.delete('unit-contacts');
      this.testData.delete('unit-invoices');
      this.testData.delete('unit-vouchers');
    });
  }

  /**
   * Seed data for integration tests
   */
  private async seedIntegrationTestData(): Promise<void> {
    // Create complete business scenarios for integration tests
    const businessScenario = testDataFactory.createBusinessScenario('integration-test');
    const multiCurrencyData = this.createMultiCurrencyTestData();
    const workflowData = this.createWorkflowTestData();

    this.testData.set('integration-business-scenario', businessScenario);
    this.testData.set('integration-multi-currency', multiCurrencyData);
    this.testData.set('integration-workflow', workflowData);

    // Register cleanup for integration test data
    this.registerCleanup('integration-test-data', async () => {
      this.testData.delete('integration-business-scenario');
      this.testData.delete('integration-multi-currency');
      this.testData.delete('integration-workflow');
    });
  }

  /**
   * Seed data for end-to-end tests
   */
  private async seedE2ETestData(): Promise<void> {
    // Create comprehensive user journey data
    const smallBusinessData = this.createSmallBusinessJourneyData();
    const accountantData = this.createAccountantJourneyData();
    const enterpriseData = this.createEnterpriseJourneyData();

    this.testData.set('e2e-small-business', smallBusinessData);
    this.testData.set('e2e-accountant', accountantData);
    this.testData.set('e2e-enterprise', enterpriseData);

    // Register cleanup for e2e test data
    this.registerCleanup('e2e-test-data', async () => {
      this.testData.delete('e2e-small-business');
      this.testData.delete('e2e-accountant');
      this.testData.delete('e2e-enterprise');
    });
  }

  /**
   * Seed data for performance tests
   */
  private async seedPerformanceTestData(): Promise<void> {
    // Create large datasets for performance testing
    const largeContactSet = testDataFactory.createContactBatch(1000, { name: 'Performance Test Contact' });
    const largeInvoiceSet = testDataFactory.createInvoiceBatch(1000, undefined, { invoiceNumber: 'PERF-INV' });
    const concurrentTestData = this.createConcurrentTestData();

    this.testData.set('performance-contacts', largeContactSet);
    this.testData.set('performance-invoices', largeInvoiceSet);
    this.testData.set('performance-concurrent', concurrentTestData);

    // Register cleanup for performance test data
    this.registerCleanup('performance-test-data', async () => {
      this.testData.delete('performance-contacts');
      this.testData.delete('performance-invoices');
      this.testData.delete('performance-concurrent');
    });
  }

  /**
   * Create multi-currency test data
   */
  private createMultiCurrencyTestData(): any {
    const currencies = ['EUR', 'USD', 'GBP'];
    const exchangeRates = { 'EUR-USD': 1.10, 'EUR-GBP': 0.85, 'USD-EUR': 0.91, 'GBP-EUR': 1.18 };

    const multiCurrencyInvoices = currencies.map(currency =>
      testDataFactory.createInvoice(undefined, {
        currency,
        invoiceNumber: `MULTI-${currency}-001`,
      })
    );

    return {
      currencies,
      exchangeRates,
      invoices: multiCurrencyInvoices,
    };
  }

  /**
   * Create workflow test data
   */
  private createWorkflowTestData(): any {
    const customer = testDataFactory.createContact({ name: 'Workflow Test Customer' });
    const order = testDataFactory.createOrder(customer.id);
    const invoice = testDataFactory.createInvoice(customer.id);
    const creditNote = testDataFactory.createCreditNote(invoice.id);

    return {
      customer,
      order,
      invoice,
      creditNote,
      workflow: [
        { step: 'create-customer', data: customer },
        { step: 'create-order', data: order },
        { step: 'create-invoice', data: invoice },
        { step: 'create-credit-note', data: creditNote },
      ],
    };
  }

  /**
   * Create small business journey data
   */
  private createSmallBusinessJourneyData(): any {
    const customer = testDataFactory.createContact({ name: 'Acme Corporation' });
    const address = testDataFactory.createContactAddress(customer.id);
    const services = [
      testDataFactory.createPart({ name: 'Web Development', price: '75.00' }),
      testDataFactory.createPart({ name: 'SEO Optimization', price: '100.00' }),
      testDataFactory.createPart({ name: 'Hosting Setup', price: '200.00' }),
    ];
    const invoice = testDataFactory.createInvoice(customer.id, {
      invoiceNumber: 'INV-ACME-2023-001',
      currency: 'USD',
      taxRate: 8.5,
    });

    return {
      customer,
      address,
      services,
      invoice,
      journey: [
        { step: 'customer-onboarding', data: { customer, address } },
        { step: 'service-catalog', data: services },
        { step: 'invoice-creation', data: invoice },
        { step: 'payment-tracking', data: { invoice, status: 'pending' } },
      ],
    };
  }

  /**
   * Create accountant journey data
   */
  private createAccountantJourneyData(): any {
    const period = { startDate: '2023-06-01', endDate: '2023-06-30' };
    const invoices = testDataFactory.createInvoiceBatch(25, undefined, {
      invoiceDate: '2023-06-15',
      status: 1000, // Paid
    });
    const vouchers = Array.from({ length: 10 }, () =>
      testDataFactory.createVoucher({ voucherDate: '2023-06-15' })
    );

    const vatInvoices = [
      ...testDataFactory.createInvoiceBatch(15, undefined, { taxRate: 19, status: 1000 }),
      ...testDataFactory.createInvoiceBatch(10, undefined, { taxRate: 7, status: 1000 }),
      ...testDataFactory.createInvoiceBatch(5, undefined, { taxRate: 0, status: 1000 }),
    ];

    return {
      period,
      invoices,
      vouchers,
      vatInvoices,
      reports: [
        { type: 'sales', format: 'pdf' },
        { type: 'outstanding', format: 'excel' },
        { type: 'tax', format: 'pdf' },
      ],
    };
  }

  /**
   * Create enterprise journey data
   */
  private createEnterpriseJourneyData(): any {
    const entities = [
      { id: 'entity-001', name: 'Main Corp', currency: 'EUR', country: 'DE' },
      { id: 'entity-002', name: 'US Subsidiary', currency: 'USD', country: 'US' },
      { id: 'entity-003', name: 'UK Branch', currency: 'GBP', country: 'UK' },
    ];

    const entityInvoices = entities.flatMap((entity, index) =>
      testDataFactory.createInvoiceBatch(10, undefined, {
        currency: entity.currency,
        invoiceNumber: `${entity.id.toUpperCase()}-INV`,
      })
    );

    return {
      entities,
      invoices: entityInvoices,
      consolidation: {
        period: { startDate: '2023-06-01', endDate: '2023-06-30' },
        exchangeRates: { 'EUR-USD': 1.10, 'EUR-GBP': 0.85, 'USD-EUR': 0.91, 'GBP-EUR': 1.18 },
      },
    };
  }

  /**
   * Create concurrent test data
   */
  private createConcurrentTestData(): any {
    const concurrencyLevels = [5, 10, 20, 50];
    const testData = {};

    concurrencyLevels.forEach(level => {
      testData[`concurrent-${level}`] = {
        contacts: testDataFactory.createContactBatch(level, { name: `Concurrent Test ${level}` }),
        operations: Array.from({ length: level }, (_, i) => ({
          id: `concurrent-op-${level}-${i}`,
          type: 'get',
          resource: 'contact',
        })),
      };
    });

    return testData;
  }

  /**
   * Get test data by key
   */
  public getTestData(key: string): any {
    return this.testData.get(key);
  }

  /**
   * Set test data
   */
  public setTestData(key: string, data: any): void {
    this.testData.set(key, data);
  }

  /**
   * Register cleanup task
   */
  public registerCleanup(name: string, cleanupFn: () => Promise<void>): void {
    this.cleanupTasks.push(cleanupFn);
  }

  /**
   * Clean up all test data
   */
  public async cleanup(): Promise<void> {
    console.log('Cleaning up test database...');

    try {
      // Execute all cleanup tasks
      await Promise.all(this.cleanupTasks.map(task => task()));

      // Clear all test data
      this.testData.clear();

      // Clear cleanup tasks
      this.cleanupTasks = [];

      // Reset test data factory
      testDataFactory.cleanup();

      console.log('Test database cleanup completed successfully');
    } catch (error) {
      console.error('Failed to cleanup test database:', error);
      throw error;
    }
  }

  /**
   * Clean up specific test scenario data
   */
  public async cleanupScenario(scenario: 'unit' | 'integration' | 'e2e' | 'performance'): Promise<void> {
    console.log(`Cleaning up ${scenario} test data...`);

    const keysToDelete = Array.from(this.testData.keys()).filter(key =>
      key.startsWith(scenario) || key.includes(scenario)
    );

    keysToDelete.forEach(key => this.testData.delete(key));

    console.log(`${scenario} test data cleanup completed`);
  }

  /**
   * Verify test data integrity
   */
  public verifyTestDataIntegrity(): boolean {
    try {
      // Check if required test data exists
      const requiredKeys = ['unit-contacts', 'unit-invoices'];
      const missingKeys = requiredKeys.filter(key => !this.testData.has(key));

      if (missingKeys.length > 0) {
        console.warn(`Missing required test data: ${missingKeys.join(', ')}`);
        return false;
      }

      // Verify data structure integrity
      for (const [key, data] of this.testData.entries()) {
        if (!data || (Array.isArray(data) && data.length === 0)) {
          console.warn(`Empty or invalid test data for key: ${key}`);
          return false;
        }
      }

      return true;
    } catch (error) {
      console.error('Test data integrity check failed:', error);
      return false;
    }
  }

  /**
   * Get test data statistics
   */
  public getTestDataStatistics(): any {
    const stats = {
      totalKeys: this.testData.size,
      dataByType: {},
      memoryUsage: 0,
    };

    for (const [key, data] of this.testData.entries()) {
      const type = key.split('-')[0];
      if (!stats.dataByType[type]) {
        stats.dataByType[type] = 0;
      }

      if (Array.isArray(data)) {
        stats.dataByType[type] += data.length;
      } else {
        stats.dataByType[type] += 1;
      }

      // Rough memory usage estimation
      stats.memoryUsage += JSON.stringify(data).length;
    }

    return stats;
  }

  /**
   * Export test data for debugging
   */
  public exportTestData(filePath?: string): any {
    const exportData = {
      timestamp: new Date().toISOString(),
      statistics: this.getTestDataStatistics(),
      data: Object.fromEntries(this.testData),
    };

    if (filePath) {
      // In a real implementation, this would write to file
      console.log(`Test data would be exported to: ${filePath}`);
    }

    return exportData;
  }

  /**
   * Import test data from export
   */
  public importTestData(importData: any): void {
    if (importData.data) {
      this.testData.clear();
      for (const [key, value] of Object.entries(importData.data)) {
        this.testData.set(key, value);
      }
      console.log('Test data imported successfully');
    } else {
      throw new Error('Invalid import data format');
    }
  }
}

// Export singleton instance
export const testDatabaseManager = TestDatabaseManager.getInstance();

// Jest setup and teardown helpers
export const setupTestDatabase = async (scenario: 'unit' | 'integration' | 'e2e' | 'performance' = 'unit') => {
  await testDatabaseManager.seedDatabase(scenario);
};

export const teardownTestDatabase = async () => {
  await testDatabaseManager.cleanup();
};

// Jest global setup/teardown functions
export const globalSetup = async () => {
  console.log('Setting up global test environment...');
  await setupTestDatabase('unit');
};

export const globalTeardown = async () => {
  console.log('Tearing down global test environment...');
  await teardownTestDatabase();
};
