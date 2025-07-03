import { faker } from '@faker-js/faker';

/**
 * Test Data Factory for generating consistent test data across all test scenarios
 * This factory provides standardized data generation for SevDesk entities
 */
export class TestDataFactory {
  private static instance: TestDataFactory;
  private seedValue: number;

  private constructor() {
    this.seedValue = 12345; // Default seed for reproducible tests
    this.setSeed(this.seedValue);
  }

  public static getInstance(): TestDataFactory {
    if (!TestDataFactory.instance) {
      TestDataFactory.instance = new TestDataFactory();
    }
    return TestDataFactory.instance;
  }

  /**
   * Set seed for reproducible test data generation
   */
  public setSeed(seed: number): void {
    this.seedValue = seed;
    faker.seed(seed);
  }

  /**
   * Reset to default seed
   */
  public resetSeed(): void {
    this.setSeed(this.seedValue);
  }

  /**
   * Generate contact test data
   */
  public createContact(overrides: Partial<any> = {}): any {
    const baseContact = {
      id: faker.string.numeric(5),
      objectName: 'Contact',
      name: faker.company.name(),
      customerNumber: `CUST-${faker.string.numeric(4)}`,
      category: { id: faker.number.int({ min: 1, max: 5 }), objectName: 'Category' },
      email: faker.internet.email(),
      phone: faker.phone.number(),
      website: faker.internet.url(),
      vatNumber: faker.string.alphanumeric(10),
      taxNumber: faker.string.numeric(8),
      description: faker.lorem.paragraph(),
      create: faker.date.past().toISOString(),
      update: faker.date.recent().toISOString(),
      ...overrides,
    };

    return baseContact;
  }

  /**
   * Generate contact address test data
   */
  public createContactAddress(contactId?: string, overrides: Partial<any> = {}): any {
    const baseAddress = {
      id: faker.string.numeric(5),
      objectName: 'ContactAddress',
      contact: { id: contactId || faker.string.numeric(5), objectName: 'Contact' },
      street: faker.location.streetAddress(),
      zip: faker.location.zipCode(),
      city: faker.location.city(),
      country: { id: faker.number.int({ min: 1, max: 250 }), objectName: 'StaticCountry' },
      category: { id: faker.number.int({ min: 1, max: 3 }), objectName: 'Category' },
      name: faker.person.fullName(),
      name2: faker.company.name(),
      name3: faker.lorem.words(2),
      name4: faker.lorem.words(2),
      create: faker.date.past().toISOString(),
      update: faker.date.recent().toISOString(),
      ...overrides,
    };

    return baseAddress;
  }

  /**
   * Generate invoice test data
   */
  public createInvoice(contactId?: string, overrides: Partial<any> = {}): any {
    const netAmount = faker.number.float({ min: 100, max: 10000, fractionDigits: 2 });
    const taxRate = faker.helpers.arrayElement([0, 7, 19]);
    const taxAmount = (netAmount * taxRate) / 100;
    const grossAmount = netAmount + taxAmount;

    const baseInvoice = {
      id: faker.string.numeric(5),
      objectName: 'Invoice',
      invoiceNumber: `INV-${faker.date.recent().getFullYear()}-${faker.string.numeric(4)}`,
      contact: { id: contactId || faker.string.numeric(5), objectName: 'Contact' },
      invoiceDate: faker.date.recent().toISOString().split('T')[0],
      header: faker.lorem.sentence(),
      headText: faker.lorem.paragraph(),
      footText: faker.lorem.sentence(),
      timeToPay: faker.number.int({ min: 7, max: 30 }),
      discountTime: faker.number.int({ min: 0, max: 14 }),
      discount: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
      addressName: faker.company.name(),
      addressStreet: faker.location.streetAddress(),
      addressZip: faker.location.zipCode(),
      addressCity: faker.location.city(),
      addressCountry: { id: faker.number.int({ min: 1, max: 250 }), objectName: 'StaticCountry' },
      payDate: null,
      status: faker.helpers.arrayElement([100, 200, 750, 1000]), // Draft, Open, Sent, Paid
      smallBusiness: faker.datatype.boolean(),
      taxRate: taxRate,
      taxText: `${taxRate}% VAT`,
      taxType: 'default',
      taxSet: null,
      paymentMethod: { id: faker.number.int({ min: 1, max: 10 }), objectName: 'PaymentMethod' },
      costCentre: { id: faker.number.int({ min: 1, max: 5 }), objectName: 'CostCentre' },
      sendDate: null,
      origin: null,
      invoiceType: 'RE',
      accountIntervall: null,
      accountLastInvoice: null,
      accountNextInvoice: null,
      reminderTotal: 0,
      reminderDebit: 0,
      reminderDeadline: null,
      reminderCharge: 0,
      taxNumber: faker.string.numeric(8),
      creditDebit: 'C',
      datevConnectOnline: null,
      sendType: null,
      voucherType: 'VOU',
      currency: faker.helpers.arrayElement(['EUR', 'USD', 'GBP']),
      sumNet: netAmount.toFixed(2),
      sumTax: taxAmount.toFixed(2),
      sumGross: grossAmount.toFixed(2),
      sumDiscounts: '0.00',
      sumNetForeignCurrency: netAmount.toFixed(2),
      sumTaxForeignCurrency: taxAmount.toFixed(2),
      sumGrossForeignCurrency: grossAmount.toFixed(2),
      sumDiscountsForeignCurrency: '0.00',
      customerInternalNote: faker.lorem.sentence(),
      showNet: true,
      enshrined: null,
      sendPaymentReceivedNotificationDate: null,
      create: faker.date.past().toISOString(),
      update: faker.date.recent().toISOString(),
      ...overrides,
    };

    return baseInvoice;
  }

  /**
   * Generate invoice position test data
   */
  public createInvoicePosition(invoiceId?: string, overrides: Partial<any> = {}): any {
    const quantity = faker.number.float({ min: 1, max: 100, fractionDigits: 2 });
    const price = faker.number.float({ min: 10, max: 500, fractionDigits: 2 });
    const total = quantity * price;

    const basePosition = {
      id: faker.string.numeric(5),
      objectName: 'InvoicePos',
      invoice: { id: invoiceId || faker.string.numeric(5), objectName: 'Invoice' },
      part: { id: faker.string.numeric(5), objectName: 'Part' },
      quantity: quantity.toString(),
      price: price.toFixed(2),
      name: faker.commerce.productName(),
      unity: { id: faker.number.int({ min: 1, max: 10 }), objectName: 'Unity' },
      positionNumber: faker.number.int({ min: 1, max: 100 }),
      text: faker.commerce.productDescription(),
      discount: faker.number.float({ min: 0, max: 10, fractionDigits: 2 }),
      optional: faker.datatype.boolean(),
      taxRate: faker.helpers.arrayElement([0, 7, 19]),
      sumNet: total.toFixed(2),
      sumGross: (total * 1.19).toFixed(2), // Assuming 19% tax
      create: faker.date.past().toISOString(),
      update: faker.date.recent().toISOString(),
      ...overrides,
    };

    return basePosition;
  }

  /**
   * Generate voucher test data
   */
  public createVoucher(overrides: Partial<any> = {}): any {
    const baseVoucher = {
      id: faker.string.numeric(5),
      objectName: 'Voucher',
      mapAll: true,
      voucherDate: faker.date.recent().toISOString().split('T')[0],
      supplier: { id: faker.string.numeric(5), objectName: 'Contact' },
      supplierName: faker.company.name(),
      description: faker.lorem.sentence(),
      payDate: faker.date.future().toISOString().split('T')[0],
      status: faker.helpers.arrayElement([50, 100, 1000]), // Draft, Open, Paid
      sumNet: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }).toFixed(2),
      sumTax: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }).toFixed(2),
      sumGross: faker.number.float({ min: 110, max: 5500, fractionDigits: 2 }).toFixed(2),
      taxType: 'default',
      creditDebit: 'D',
      voucherType: 'VOU',
      currency: faker.helpers.arrayElement(['EUR', 'USD', 'GBP']),
      propertyForeignCurrencyDeadline: null,
      propertyExchangeRate: null,
      taxSet: null,
      paymentDeadline: faker.date.future().toISOString().split('T')[0],
      deliveryDate: faker.date.recent().toISOString().split('T')[0],
      deliveryDateUntil: null,
      document: null,
      costCentre: { id: faker.number.int({ min: 1, max: 5 }), objectName: 'CostCentre' },
      create: faker.date.past().toISOString(),
      update: faker.date.recent().toISOString(),
      ...overrides,
    };

    return baseVoucher;
  }

  /**
   * Generate order test data
   */
  public createOrder(contactId?: string, overrides: Partial<any> = {}): any {
    const netAmount = faker.number.float({ min: 100, max: 10000, fractionDigits: 2 });
    const taxRate = faker.helpers.arrayElement([0, 7, 19]);
    const taxAmount = (netAmount * taxRate) / 100;
    const grossAmount = netAmount + taxAmount;

    const baseOrder = {
      id: faker.string.numeric(5),
      objectName: 'Order',
      orderNumber: `ORD-${faker.date.recent().getFullYear()}-${faker.string.numeric(4)}`,
      contact: { id: contactId || faker.string.numeric(5), objectName: 'Contact' },
      orderDate: faker.date.recent().toISOString().split('T')[0],
      status: faker.helpers.arrayElement([100, 200, 300, 1000]), // Draft, Open, In Progress, Completed
      header: faker.lorem.sentence(),
      headText: faker.lorem.paragraph(),
      footText: faker.lorem.sentence(),
      addressName: faker.company.name(),
      addressStreet: faker.location.streetAddress(),
      addressZip: faker.location.zipCode(),
      addressCity: faker.location.city(),
      addressCountry: { id: faker.number.int({ min: 1, max: 250 }), objectName: 'StaticCountry' },
      currency: faker.helpers.arrayElement(['EUR', 'USD', 'GBP']),
      sumNet: netAmount.toFixed(2),
      sumTax: taxAmount.toFixed(2),
      sumGross: grossAmount.toFixed(2),
      customerInternalNote: faker.lorem.sentence(),
      smallBusiness: faker.datatype.boolean(),
      taxRate: taxRate,
      taxText: `${taxRate}% VAT`,
      taxType: 'default',
      orderType: 'AN',
      sendDate: null,
      create: faker.date.past().toISOString(),
      update: faker.date.recent().toISOString(),
      ...overrides,
    };

    return baseOrder;
  }

  /**
   * Generate credit note test data
   */
  public createCreditNote(invoiceId?: string, overrides: Partial<any> = {}): any {
    const netAmount = faker.number.float({ min: 50, max: 1000, fractionDigits: 2 });
    const taxRate = faker.helpers.arrayElement([0, 7, 19]);
    const taxAmount = (netAmount * taxRate) / 100;
    const grossAmount = netAmount + taxAmount;

    const baseCreditNote = {
      id: faker.string.numeric(5),
      objectName: 'CreditNote',
      creditNoteNumber: `CN-${faker.date.recent().getFullYear()}-${faker.string.numeric(4)}`,
      contact: { id: faker.string.numeric(5), objectName: 'Contact' },
      creditNoteDate: faker.date.recent().toISOString().split('T')[0],
      status: faker.helpers.arrayElement([100, 200, 750, 1000]), // Draft, Open, Sent, Paid
      header: faker.lorem.sentence(),
      headText: faker.lorem.paragraph(),
      footText: faker.lorem.sentence(),
      addressName: faker.company.name(),
      addressStreet: faker.location.streetAddress(),
      addressZip: faker.location.zipCode(),
      addressCity: faker.location.city(),
      addressCountry: { id: faker.number.int({ min: 1, max: 250 }), objectName: 'StaticCountry' },
      currency: faker.helpers.arrayElement(['EUR', 'USD', 'GBP']),
      sumNet: netAmount.toFixed(2),
      sumTax: taxAmount.toFixed(2),
      sumGross: grossAmount.toFixed(2),
      taxRate: taxRate,
      taxText: `${taxRate}% VAT`,
      taxType: 'default',
      creditNoteType: 'CN',
      smallBusiness: faker.datatype.boolean(),
      bookingCategory: faker.lorem.word(),
      invoice: invoiceId ? { id: invoiceId, objectName: 'Invoice' } : null,
      create: faker.date.past().toISOString(),
      update: faker.date.recent().toISOString(),
      ...overrides,
    };

    return baseCreditNote;
  }

  /**
   * Generate part (product/service) test data
   */
  public createPart(overrides: Partial<any> = {}): any {
    return {
      id: faker.string.numeric(5),
      objectName: 'Part',
      name: faker.commerce.productName(),
      partNumber: faker.string.alphanumeric(8).toUpperCase(),
      text: faker.commerce.productDescription(),
      category: { id: faker.number.int({ min: 1, max: 10 }), objectName: 'Category' },
      stock: faker.number.int({ min: 0, max: 1000 }),
      stockEnabled: faker.datatype.boolean(),
      unity: { id: faker.number.int({ min: 1, max: 10 }), objectName: 'Unity' },
      price: faker.number.float({ min: 10, max: 500, fractionDigits: 2 }).toFixed(2),
      ...overrides,
    };
  }

  /**
   * Generate batch of contacts for testing
   */
  public createContactBatch(count: number, overrides: Partial<any> = {}): any[] {
    return Array.from({ length: count }, (_, index) =>
      this.createContact({
        customerNumber: `BATCH-${String(index + 1).padStart(4, '0')}`,
        ...overrides
      })
    );
  }

  /**
   * Generate batch of invoices for testing
   */
  public createInvoiceBatch(count: number, contactId?: string, overrides: Partial<any> = {}): any[] {
    return Array.from({ length: count }, (_, index) =>
      this.createInvoice(contactId, {
        invoiceNumber: `BATCH-INV-${String(index + 1).padStart(4, '0')}`,
        ...overrides
      })
    );
  }

  /**
   * Generate complete business scenario data
   */
  public createBusinessScenario(scenarioName: string = 'default'): {
    customer: any;
    address: any;
    products: any[];
    order: any;
    invoice: any;
    positions: any[];
  } {
    const customer = this.createContact({ name: `${scenarioName} Customer Corp` });
    const address = this.createContactAddress(customer.id);
    const products = [
      this.createPart({ name: 'Web Development Service' }),
      this.createPart({ name: 'SEO Optimization' }),
      this.createPart({ name: 'Hosting Setup' }),
    ];
    const order = this.createOrder(customer.id);
    const invoice = this.createInvoice(customer.id);
    const positions = products.map(product =>
      this.createInvoicePosition(invoice.id, { part: { id: product.id, objectName: 'Part' } })
    );

    return {
      customer,
      address,
      products,
      order,
      invoice,
      positions,
    };
  }

  /**
   * Generate test data for specific test scenarios
   */
  public createTestScenario(scenarioType: 'performance' | 'integration' | 'e2e' | 'error', options: any = {}): any {
    switch (scenarioType) {
      case 'performance':
        return {
          contacts: this.createContactBatch(options.count || 1000),
          invoices: this.createInvoiceBatch(options.count || 1000),
        };

      case 'integration':
        return this.createBusinessScenario('integration-test');

      case 'e2e':
        return {
          smallBusiness: this.createBusinessScenario('small-business'),
          enterprise: this.createBusinessScenario('enterprise'),
          accountant: {
            contacts: this.createContactBatch(25),
            invoices: this.createInvoiceBatch(25),
            vouchers: Array.from({ length: 10 }, () => this.createVoucher()),
          },
        };

      case 'error':
        return {
          invalidContact: this.createContact({ name: '', customerNumber: '' }),
          duplicateInvoice: this.createInvoice(undefined, { invoiceNumber: 'DUPLICATE-001' }),
          malformedData: { invalidProperty: 'invalid' },
        };

      default:
        return this.createBusinessScenario();
    }
  }

  /**
   * Generate API response format
   */
  public createApiResponse(data: any | any[], total?: number): any {
    if (Array.isArray(data)) {
      return {
        objects: data,
        total: total || data.length,
      };
    } else {
      return {
        objects: [data],
        total: 1,
      };
    }
  }

  /**
   * Generate error response format
   */
  public createErrorResponse(message: string, code: number = 400): any {
    return {
      error: {
        message,
        code,
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Clean up and reset factory state
   */
  public cleanup(): void {
    this.resetSeed();
  }
}

// Export singleton instance
export const testDataFactory = TestDataFactory.getInstance();
