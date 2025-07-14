# SevDesk Node Documentation

**Version:** 2.4.1  
**Updated:** 2025-07-14  
**Status:** Production Ready  
**API Version:** SevDesk API v2.0

## Table of Contents

1. [Overview](#overview)
2. [Installation](#installation)
3. [Configuration](#configuration)
4. [Resources](#resources)
5. [Operations](#operations)
6. [Advanced Features](#advanced-features)
7. [Examples](#examples)
8. [Troubleshooting](#troubleshooting)
9. [API Reference](#api-reference)
10. [Best Practices](#best-practices)
11. [Development](#development)

## Overview

The SevDesk node for n8n provides direct integration with the SevDesk accounting platform. SevDesk is a popular German accounting software that offers a robust API for automation and integration.

### Main Features

- **Complete CRUD Operations**: Create, read, update and delete for all important entities
- **API v2 Support**: Latest API version with backward compatibility
- **Comprehensive Filtering**: Advanced search and filter functions
- **File Management**: Upload and download of documents
- **Batch Operations**: Efficient processing of multiple items
- **Error Handling**: Robust error handling with detailed feedback
- **Direct API Integration**: No external dependencies or intermediate layers
- **Simple Configuration**: Only API key and version required

### Supported Resources

| Resource     | Status      | Description                                         |
| ------------ | ----------- | --------------------------------------------------- |
| Contacts     | ✅ Complete | Contact management with addresses and custom fields |
| Invoices     | ✅ Complete | Complete invoice lifecycle including PDF generation |
| Orders       | ✅ Complete | Order management with positions                     |
| Vouchers     | ✅ Complete | Document management with file attachments           |
| Parts        | ✅ Complete | Inventory management with stock tracking            |
| Banking      | ✅ Complete | Bank accounts and transactions                      |
| Tags         | ✅ Complete | Flexible tagging system                             |
| Reports      | ✅ Complete | PDF report generation                               |
| Credit Notes | ✅ Complete | Credit note management                              |
| Exports      | ✅ Complete | Data export functionality                           |

## Installation

### Via n8n Community Nodes

```bash
npm install n8n-nodes-sevdesk-v2
```

### Manual Installation

1. Clone repository
2. Install dependencies: `npm install`
3. Create build: `npm run build`
4. Link node: `npm link`

## Configuration

### SevDesk API Credentials

The SevDesk node requires only two simple configuration parameters:

1. **API Key**: Your SevDesk API key
2. **API Version**: v2 (recommended) or v1 (legacy)

#### Creating API Key

1. Log in to SevDesk
2. Go to **Settings** > **User Management** > **API**
3. Create a new API key
4. Configure credentials in n8n

## Advanced Features

### Bulk Operations

For efficient processing of large datasets, the node supports batch operations:

```javascript
// Create multiple contacts simultaneously
const contacts = [
	{ name: "Customer 1", customerNumber: "K001" },
	{ name: "Customer 2", customerNumber: "K002" },
	{ name: "Customer 3", customerNumber: "K003" },
];

// Batch processing with error handling
for (const contact of contacts) {
	try {
		await sevDeskApi.createContact(contact);
	} catch (error) {
		console.error(`Failed to create contact: ${error.message}`);
	}
}
```

### File Handling

The node supports file operations for document management:

```javascript
// Upload voucher document
const voucherData = {
	voucherDate: "2025-01-15",
	supplier: { id: 123, objectName: "Contact" },
	document: binaryData, // File content
};

await sevDeskApi.createVoucher(voucherData);
```

### Rate Limiting

Automatic rate limiting ensures compliance with SevDesk API limits:

- **Standard Account**: 1000 requests/hour
- **Premium Account**: 5000 requests/hour
- **Professional Account**: 10000 requests/hour

The node automatically handles rate limiting with exponential backoff and retry mechanisms.

## Error Handling

The node provides comprehensive error handling:

```javascript
try {
	const result = await sevDeskApi.createInvoice(invoiceData);
	return result;
} catch (error) {
	if (error.statusCode === 401) {
		throw new Error("Invalid API credentials");
	} else if (error.statusCode === 429) {
		throw new Error("Rate limit exceeded");
	} else {
		throw new Error(`SevDesk API error: ${error.message}`);
	}
}
```

## Best Practices

### 1. Use Batch Operations

For multiple records, use batch operations to improve performance and reduce API calls.

### 2. Implement Proper Error Handling

Always handle potential API errors gracefully with appropriate retry logic.

### 3. Cache Master Data

Cache frequently accessed data like categories, countries, and units to reduce API calls.

### 4. Monitor Rate Limits

Keep track of your API usage to avoid hitting rate limits.

### 5. Use Webhooks

For real-time data synchronization, consider using webhooks instead of polling.

### 6. Validate Data

Validate data before sending to the API to prevent errors and improve performance.

## Development

### Setting Up Development Environment

1. Clone the repository:

```bash
git clone https://github.com/knackw/n8n-nodes-sevdesk-v2.git
cd n8n-nodes-sevdesk-v2
```

2. Install dependencies:

```bash
npm install
```

3. Create environment configuration:

```bash
cp ENV-TEMPLATE.md .env
# Edit .env with your settings
```

4. Start development environment:

```bash
npm start
```

### Testing

Run the test suite:

```bash
# All tests
npm test

# Coverage report
npm run test:coverage

# Watch mode
npm run test:watch
```

### Building

Build the project:

```bash
# Development build
npm run build

# Production build
npm run build:prod
```

### Credit Notes

Create and manage credit notes:

```javascript
// Create credit note
const creditNoteData = {
	contact: { id: 123, objectName: "Contact" },
	creditNoteDate: "2025-01-15",
	status: "100",
	currency: "EUR",
};

await sevDeskApi.createCreditNote(creditNoteData);
```

### Export Operations

Export data in various formats:

```javascript
// Export contacts to CSV
const exportData = {
	resource: "contact",
	format: "csv",
	dateFrom: "2025-01-01",
	dateTo: "2025-01-31",
};

const exportResult = await sevDeskApi.createExport(exportData);
```

## API Reference

For detailed API reference, see [API_REFERENCE.md](API_REFERENCE.md).

## Support

- **GitHub Issues**: [Report bugs and request features](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- **Documentation**: Complete documentation in the `/docs` folder
- **Community**: n8n Community Forum

---

_This documentation is part of the n8n-nodes-sevdesk-v2 project - a production-ready SevDesk integration for n8n workflows._
