# SevDesk Node Documentation

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Resources](#resources)
5. [Operations](#operations)
6. [Examples](#examples)
7. [Troubleshooting](#troubleshooting)
8. [API Reference](#api-reference)
9. [Best Practices](#best-practices)
10. [Development](#development)

## Overview

The SevDesk Node for n8n provides comprehensive integration with the SevDesk accounting platform. SevDesk is a popular German accounting software that offers a robust API for automation and integration.

### Key Features

- **Full CRUD Operations**: Create, read, update, and delete operations for all major entities
- **API v2 Support**: Latest API version with backward compatibility
- **Comprehensive Filtering**: Advanced search and filter capabilities
- **File Management**: Upload and download documents
- **Batch Operations**: Efficient processing of multiple items
- **Error Handling**: Robust error handling with detailed feedback

### Supported Resources

| Resource | Status | Description |
|----------|--------|-------------|
| Contacts | ✅ Complete | Contact management with addresses and custom fields |
| Invoices | ✅ Complete | Full invoice lifecycle including PDF generation |
| Orders | ✅ Complete | Order management with positions |
| Vouchers | ✅ Complete | Receipt management with file attachments |
| Parts | ✅ Complete | Inventory management with stock tracking |
| Banking | ✅ Complete | Check accounts and transactions |
| Tags | ✅ Complete | Flexible tagging system |
| Reports | ✅ Complete | PDF report generation |
| Credit Notes | 🔄 In Progress | Credit note management |
| Exports | 🔄 In Progress | Data export functionality |

## Installation

### Prerequisites

- Node.js 16.0.0 or higher
- n8n instance (self-hosted or cloud)
- SevDesk account with API access

### Installation Steps

1. **Install the package**:
   ```bash
   npm install n8n-nodes-sevdesk-v2
   ```

2. **Restart n8n**:
   ```bash
   n8n restart
   ```

3. **Verify installation**:
   - The "SevDesk" node should appear in the node list
   - Available under the "Output" category

## Configuration

### Credentials Setup

1. **Get API Key**:
   - Log into your SevDesk account
   - Navigate to Settings → API
   - Copy your API key

2. **Configure in n8n**:
   - Go to Credentials in n8n
   - Add new credential of type "SevDesk API"
   - Enter your API key
   - Choose API version (v2 recommended)
   - Test the connection

### API Versions

- **v1 (Legacy)**: Original API, still supported
- **v2 (Recommended)**: Latest API with improved features

## Resources

### Contacts

Contacts represent customers, suppliers, and other business partners.

#### Operations
- **Create**: Create a new contact
- **Get**: Retrieve a single contact by ID
- **Get Many**: Retrieve multiple contacts with filtering
- **Update**: Update an existing contact
- **Delete**: Delete a contact
- **Check Customer Number Availability**: Verify if a customer number is available
- **Get Next Customer Number**: Get the next available customer number
- **Find By Custom Field Value**: Search contacts by custom field values
- **Get Number of Items**: Get count of related items
- **Is Deletable**: Check if a contact can be deleted

#### Fields
- **Name**: Organization name (required for organizations)
- **Surename**: First name (for individuals)
- **Familyname**: Last name (for individuals)
- **Customer Number**: Unique customer identifier
- **Category**: Contact category (required)
- **Status**: Contact status (100=Lead, 500=Pending, 1000=Active)
- **Addresses**: Contact addresses
- **Custom Fields**: Custom field values

### Invoices

Invoices represent sales documents with positions and discounts.

#### Operations
- **Create and Update**: Create or update invoices with positions
- **Get**: Retrieve a single invoice
- **Get Many**: Retrieve multiple invoices with filtering
- **Get Positions**: Get invoice positions
- **Get Invoice PDF**: Download invoice as PDF
- **Render Invoice**: Generate PDF for invoice
- **Send via Email**: Send invoice via email
- **Mark as Sent**: Mark invoice as sent
- **Book**: Book invoice to payment account
- **Cancel**: Cancel invoice (creates cancellation invoice)
- **Is Invoice Partially Paid**: Check payment status

#### Fields
- **Contact**: Customer contact (required)
- **Invoice Date**: Date of invoice
- **Header**: Invoice header text
- **HeadText**: Additional header text
- **FootText**: Footer text
- **Address Country**: Country for address
- **Status**: Invoice status
- **SmallSettlement**: Small settlement flag
- **Tax Rate**: Default tax rate
- **Tax Text**: Tax text
- **Tax Type**: Tax type
- **Currency**: Currency code
- **Delivery Date**: Delivery date
- **DeliveryDateUntil**: Delivery date until

### Orders

Orders represent purchase orders and sales orders.

#### Operations
- **Create**: Create a new order
- **Get**: Retrieve a single order
- **Get Many**: Retrieve multiple orders with filtering
- **Update**: Update an existing order
- **Delete**: Delete an order
- **Get Positions**: Get order positions
- **Get Order PDF**: Download order as PDF
- **Send via Email**: Send order via email
- **Mark as Sent**: Mark order as sent

### Vouchers

Vouchers represent receipts and accounting documents.

#### Operations
- **Create**: Create a new voucher
- **Get**: Retrieve a single voucher
- **Get Many**: Retrieve multiple vouchers with filtering
- **Update**: Update an existing voucher
- **Delete**: Delete a voucher
- **Book Voucher**: Book voucher to finalize
- **Upload File**: Upload file and attach to voucher
- **Get Voucher PDF**: Download voucher as PDF

### Parts

Parts represent inventory items and products.

#### Operations
- **Create**: Create a new part
- **Get**: Retrieve a single part
- **Get Many**: Retrieve multiple parts with filtering
- **Update**: Update an existing part
- **Get Current Stock**: Get current stock level

#### Fields
- **Name**: Part name (required)
- **PartNumber**: Part number (required)
- **Stock**: Current stock level (required)
- **Unity**: Unit of measurement (required)
- **TaxRate**: Tax rate (required)
- **Price**: Price per unit
- **PriceNet**: Net price
- **PriceGross**: Gross price

## Operations

### Common Operations

#### Create Operations
All create operations follow a similar pattern:
1. Select the resource
2. Choose "Create" operation
3. Fill in required fields
4. Add optional fields as needed
5. Execute the node

#### Get Operations
Get operations retrieve data from SevDesk:
- **Get**: Retrieves a single item by ID
- **Get Many**: Retrieves multiple items with optional filtering

#### Update Operations
Update operations modify existing data:
1. Provide the item ID
2. Specify fields to update
3. Execute the node

#### Delete Operations
Delete operations remove items:
1. Provide the item ID
2. Confirm deletion
3. Execute the node

### Filtering

Most "Get Many" operations support filtering:

#### Common Filters
- **Limit**: Maximum number of items to return
- **Offset**: Number of items to skip
- **Order By**: Sort order for results
- **Date Filters**: Filter by creation or update dates

#### Resource-Specific Filters
Each resource has specific filters:
- **Contacts**: Category, city, customer number, tags
- **Invoices**: Status, contact, date range, amount
- **Orders**: Status, contact, date range
- **Parts**: Name, part number, stock level

### Pagination

For large datasets, use pagination:
1. Set a reasonable limit (e.g., 50-100)
2. Use offset to get subsequent pages
3. Continue until all data is retrieved

## Examples

### Create a Contact

```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Acme Corporation",
  "customerNumber": "CUST001",
  "category": {
    "id": "1",
    "objectName": "Category"
  },
  "status": 1000,
  "vatNumber": "DE123456789",
  "taxNumber": "123/456/78901"
}
```

### Get Invoices with Filters

```json
{
  "resource": "invoice",
  "operation": "getMany",
  "filters": {
    "status": "100",
    "createAfter": "2024-01-01",
    "createBefore": "2024-12-31",
    "limit": 50,
    "offset": 0
  }
}
```

### Send Invoice via Email

```json
{
  "resource": "invoice",
  "operation": "sendViaEmail",
  "invoiceId": "12345",
  "email": "customer@example.com",
  "subject": "Your Invoice #INV-2024-001",
  "text": "Please find your invoice attached. Payment is due within 30 days."
}
```

### Create Invoice with Positions

```json
{
  "resource": "invoice",
  "operation": "create",
  "contact": {
    "id": "123",
    "objectName": "Contact"
  },
  "invoiceDate": "2024-01-15",
  "header": "Invoice for Services",
  "status": "100",
  "positions": [
    {
      "name": "Consulting Services",
      "quantity": 10,
      "price": 100.00,
      "unity": {
        "id": "1",
        "objectName": "Unity"
      },
      "taxRate": 19
    }
  ]
}
```

### Batch Contact Creation

```javascript
// Example workflow for batch contact creation
const contacts = [
  { name: "Company A", customerNumber: "CUST001" },
  { name: "Company B", customerNumber: "CUST002" },
  { name: "Company C", customerNumber: "CUST003" }
];

// Use a loop to create contacts
for (const contact of contacts) {
  // Create contact node configuration
  const contactConfig = {
    resource: "contact",
    operation: "create",
    ...contact,
    category: { id: "1", objectName: "Category" }
  };
  
  // Execute contact creation
  // Handle response and errors
}
```

## Troubleshooting

### Common Issues

#### Authentication Errors
**Problem**: "401 Unauthorized" or "403 Forbidden"
**Solution**:
1. Verify API key is correct
2. Check API key permissions in SevDesk
3. Ensure API key is not expired
4. Verify API version selection

#### Rate Limiting
**Problem**: "429 Too Many Requests"
**Solution**:
1. Implement request throttling
2. Use batch operations when possible
3. Add delays between requests
4. Monitor API usage limits

#### Missing Required Fields
**Problem**: "400 Bad Request" with field validation errors
**Solution**:
1. Check required fields for the operation
2. Verify field formats (dates, numbers, etc.)
3. Ensure object references are correct
4. Review API documentation for field requirements

#### Network Issues
**Problem**: Connection timeouts or network errors
**Solution**:
1. Check internet connection
2. Verify SevDesk API status
3. Check firewall/proxy settings
4. Retry with exponential backoff

### Error Handling

#### Best Practices
1. **Always check responses**: Verify success status
2. **Handle errors gracefully**: Implement proper error handling
3. **Log errors**: Keep logs for debugging
4. **Retry logic**: Implement retry for transient failures
5. **Validate data**: Check data before sending

#### Error Response Format
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": {
      "field": "Additional error details"
    }
  }
}
```

### Debugging

#### Enable Debug Logging
1. Set log level to DEBUG in n8n
2. Check node execution logs
3. Monitor network requests
4. Verify data transformations

#### Common Debug Steps
1. **Test credentials**: Verify API connection
2. **Check field values**: Ensure correct data types
3. **Validate IDs**: Verify object references
4. **Test with minimal data**: Start with required fields only

## API Reference

### Base URL
- **v1**: `https://my.sevdesk.de/api/v1/`
- **v2**: `https://my.sevdesk.de/api/v2/`

### Authentication
```http
Authorization: YOUR_API_KEY
Content-Type: application/json
Accept: application/json
```

### Response Format
```json
{
  "objects": [
    {
      "id": "123",
      "objectName": "Contact",
      "additionalProperties": "..."
    }
  ],
  "meta": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

### Rate Limits
- **Requests per minute**: Varies by plan
- **Burst limit**: Check your SevDesk plan
- **Rate limit headers**: Available in response headers

## Best Practices

### Performance
1. **Use pagination**: Limit result sets
2. **Batch operations**: Process multiple items together
3. **Cache data**: Cache frequently accessed data
4. **Optimize queries**: Use specific filters
5. **Monitor usage**: Track API consumption

### Data Management
1. **Validate input**: Check data before sending
2. **Handle duplicates**: Implement duplicate detection
3. **Backup data**: Keep local backups
4. **Version control**: Track data changes
5. **Clean data**: Remove obsolete records

### Security
1. **Secure API keys**: Store keys securely
2. **Limit permissions**: Use minimal required permissions
3. **Monitor access**: Track API usage
4. **Rotate keys**: Regularly update API keys
5. **Audit logs**: Keep access logs

### Workflow Design
1. **Error handling**: Implement proper error handling
2. **Retry logic**: Add retry for failed operations
3. **Data validation**: Validate data at each step
4. **Logging**: Add comprehensive logging
5. **Testing**: Test workflows thoroughly

## Development

### Local Development Setup

1. **Clone repository**:
   ```bash
   git clone https://github.com/knackw/n8n-nodes-sevdesk-v2.git
   cd n8n-nodes-sevdesk-v2
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build project**:
   ```bash
   npm run build
   ```

4. **Run tests**:
   ```bash
   npm test
   ```

5. **Start development**:
   ```bash
   npm run dev
   ```

### Code Structure

```
n8n-nodes-sevdesk-v2/
├── credentials/
│   └── SevDeskApi.credentials.ts
├── nodes/
│   └── SevDesk/
│       ├── SevDesk.node.ts
│       └── descriptions/
│           ├── index.ts
│           ├── ContactDescription.ts
│           ├── InvoiceDescription.ts
│           └── ...
├── tests/
│   └── setup.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Adding New Resources

1. **Create description file**:
   ```typescript
   // nodes/SevDesk/descriptions/NewResourceDescription.ts
   export const newResourceOperations: INodeProperties[] = [
     // Define operations
   ];
   
   export const newResourceFields: INodeProperties[] = [
     // Define fields
   ];
   ```

2. **Update index file**:
   ```typescript
   // nodes/SevDesk/descriptions/index.ts
   export * from './NewResourceDescription';
   ```

3. **Update main node**:
   ```typescript
   // nodes/SevDesk/SevDesk.node.ts
   import { newResourceOperations, newResourceFields } from './descriptions';
   
   // Add to properties array
   ...newResourceOperations,
   ...newResourceFields,
   ```

4. **Add tests**:
   ```typescript
   // tests/NewResource.test.ts
   describe('NewResource', () => {
     // Add test cases
   });
   ```

### Testing

#### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage
```

#### Writing Tests
```typescript
import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { SevDesk } from '../SevDesk.node';

describe('SevDesk Node', () => {
  let node: SevDesk;

  beforeEach(() => {
    node = new SevDesk();
  });

  it('should have correct description', () => {
    const description: INodeTypeDescription = node.description;
    expect(description.displayName).toBe('sevDesk');
    expect(description.name).toBe('sevDesk');
  });
});
```

### Contributing

1. **Fork the repository**
2. **Create feature branch**: `git checkout -b feature/new-feature`
3. **Make changes**: Implement your feature
4. **Add tests**: Write tests for new functionality
5. **Run tests**: Ensure all tests pass
6. **Submit PR**: Create pull request with description

### Code Style

- **TypeScript**: Use strict TypeScript configuration
- **ESLint**: Follow ESLint rules
- **Prettier**: Use Prettier for formatting
- **Comments**: Add JSDoc comments for functions
- **Naming**: Use descriptive names for variables and functions

---

## Support

For additional support:

- **GitHub Issues**: [Report bugs or request features](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- **n8n Community**: [Community forum](https://community.n8n.io/)
- **SevDesk API Docs**: [Official API documentation](https://api.sevdesk.de/)
- **Developer Contact**: harald@schwankl.info

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 