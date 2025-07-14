# SevDesk Node for n8n - User Manual

**Version:** 2.4.1  
**Updated:** 2025-07-14  
**Status:** Production Ready  
**API Version:** SevDesk API v2.0

This n8n Community Node enables you to interact directly with the SevDesk API. SevDesk is a German accounting tool for small and medium-sized businesses.

## Installation

### Installation via n8n Community Nodes

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-sevdesk-v2`
5. Click **Install**

### Manual Installation

For manual installation, you can install the package via npm:

```bash
npm install n8n-nodes-sevdesk-v2
```

## Configuration

### SevDesk API Key

To use the SevDesk node, you need a SevDesk API key:

1. Log in to your SevDesk account
2. Go to **Settings** > **User Management** > **API**
3. Create a new API key
4. Copy the API key for use in n8n

### Configure Credentials in n8n

1. Go to **Credentials** in n8n
2. Click **Create New**
3. Select **SevDesk API** from the list
4. Fill in the required fields:
   - **API Key**: Your SevDesk API key
   - **API Version**: Choose v2 (recommended) or v1 (legacy)

**That's it! No further configuration required.** The node works directly with the SevDesk API without external dependencies.

## Available Resources

The SevDesk node supports the following SevDesk API resources:

### ✅ **Fully Supported**

- **Contact** - Manage contacts (customers, suppliers)
- **Invoice** - Create and manage invoices
- **Voucher** - Manage vouchers/documents
- **Order** - Manage orders
- **Part** - Manage products/parts
- **CheckAccount** - Manage bank accounts
- **CheckAccountTransaction** - Manage transactions
- **CommunicationWay** - Communication methods (email, phone)
- **Country** - Countries
- **Category** - Categories
- **Tag** - Manage tags
- **Unity** - Units of measurement
- **Report** - Generate reports

### ✅ **Fully Supported (Extended)**

- **Export** - Data exports in various formats
- **Layout** - Document templates and layouts
- **Credit Note** - Create and manage credit notes
- **Basics** - Basic system functions and configuration

## Example Workflows

### Create New Contact

1. Add a SevDesk node to your workflow
2. Select the following configuration:
   - **Resource**: Contact
   - **Operation**: Create
3. Configure the contact data:
   ```json
   {
   	"name": "John Doe Company",
   	"customerNumber": "CUST-001",
   	"email": "info@johndoe.com",
   	"phone": "+49 123 456789",
   	"category": {
   		"id": 3,
   		"objectName": "Category"
   	}
   }
   ```

### Create Invoice

1. Add a SevDesk node to your workflow
2. Select the following configuration:
   - **Resource**: Invoice
   - **Operation**: Create
3. Configure the invoice data:
   ```json
   {
   	"contact": {
   		"id": "123",
   		"objectName": "Contact"
   	},
   	"invoiceDate": "2025-01-15",
   	"status": "100",
   	"invoiceType": "RE",
   	"currency": "EUR"
   }
   ```

### List Contacts with Filtering

1. Add a SevDesk node to your workflow
2. Select the following configuration:
   - **Resource**: Contact
   - **Operation**: List
3. Add optional filters:
   ```json
   {
   	"limit": 50,
   	"offset": 0,
   	"filters": {
   		"customerNumber": "CUST-*",
   		"category.id": "3"
   	}
   }
   ```

### Upload Document (Voucher)

1. Add a SevDesk node to your workflow
2. Select the following configuration:
   - **Resource**: Voucher
   - **Operation**: Create
3. Configure voucher with document:
   ```json
   {
   	"voucherDate": "2025-01-15",
   	"supplier": {
   		"id": "456",
   		"objectName": "Contact"
   	},
   	"description": "Office supplies",
   	"document": "{{ $binary.data }}"
   }
   ```

## Advanced Features

### Batch Operations

For processing multiple records efficiently:

```json
{
	"resource": "batch",
	"operation": "create",
	"operations": [
		{
			"resource": "contact",
			"operation": "create",
			"data": {
				"name": "Customer 1",
				"customerNumber": "K-001"
			}
		},
		{
			"resource": "contact",
			"operation": "create",
			"data": {
				"name": "Customer 2",
				"customerNumber": "K-002"
			}
		}
	]
}
```

### Email Templates for Invoices

Send invoices with predefined templates:

```json
{
	"resource": "invoice",
	"operation": "sendByEmail",
	"invoiceId": "789",
	"template": "standard",
	"sendToEmail": "customer@example.com",
	"subject": "Your Invoice {{invoiceNumber}}",
	"text": "Dear {{contactName}}, please find your invoice attached."
}
```

### PDF Export with Custom Templates

Generate invoice PDFs with specific templates:

```json
{
	"resource": "invoice",
	"operation": "getPdf",
	"invoiceId": "789",
	"template": "modern",
	"language": "en",
	"letterPaper": true
}
```

## Error Handling

The node provides comprehensive error handling:

### Common Error Codes

- **400**: Bad Request - Invalid parameters
- **401**: Unauthorized - Invalid API key
- **403**: Forbidden - Insufficient permissions
- **404**: Not Found - Resource doesn't exist
- **429**: Too Many Requests - Rate limit exceeded
- **500**: Internal Server Error - SevDesk server error

### Error Handling in Workflows

```javascript
// Example error handling
try {
	const result = await sevDesk.createContact(contactData);
	return result;
} catch (error) {
	if (error.statusCode === 429) {
		// Wait and retry for rate limits
		await new Promise((resolve) => setTimeout(resolve, 60000));
		return await sevDesk.createContact(contactData);
	}
	throw error;
}
```

## Rate Limiting

SevDesk API has the following rate limits:

- **Standard Account**: 1,000 requests per hour
- **Premium Account**: 5,000 requests per hour
- **Professional Account**: 10,000 requests per hour

The node automatically handles rate limiting with:

- Exponential backoff strategy
- Automatic retry mechanisms
- Rate limit header monitoring

## Best Practices

### 1. Use Batch Operations

- Process multiple records in single API calls
- Recommended batch size: 25-50 operations
- Better performance and fewer API calls

### 2. Implement Proper Error Handling

- Always handle API errors gracefully
- Implement retry logic for transient errors
- Log errors for debugging

### 3. Cache Master Data

- Cache categories, countries, units
- Reduces API calls for frequently accessed data
- Improves workflow performance

### 4. Monitor API Usage

- Track your API quota usage
- Plan workflows around rate limits
- Use webhooks instead of polling when possible

### 5. Data Validation

- Validate data before API calls
- Check required fields
- Verify data formats and types

## Troubleshooting

### Node Not Appearing

- Ensure n8n version compatibility (1.101.1+)
- Restart n8n after installation
- Check n8n logs for installation errors

### API Connection Issues

- Verify API key is correct and active
- Check SevDesk account permissions
- Ensure correct API version selection

### Rate Limit Issues

- Monitor your API usage
- Implement delays between requests
- Use batch operations for bulk data

### Data Validation Errors

- Check required fields are provided
- Verify data types and formats
- Review SevDesk API documentation

## Support and Resources

### Documentation

- [API Reference](API_REFERENCE.md) - Complete API documentation
- [Troubleshooting Guide](TROUBLESHOOTING.md) - Problem-solving guide
- [Migration Guide](MIGRATION_GUIDE.md) - Upgrade instructions

### Community Support

- [GitHub Issues](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- [n8n Community Forum](https://community.n8n.io/)
- [Project Discussions](https://github.com/knackw/n8n-nodes-sevdesk-v2/discussions)

### Professional Support

For business-critical implementations, consider:

- Custom workflow development
- Integration consulting
- Priority support packages

---

_This user manual is part of the n8n-nodes-sevdesk-v2 project - a production-ready SevDesk integration for n8n workflows._
