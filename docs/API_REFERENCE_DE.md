# SevDesk API Operations Reference

This document provides comprehensive documentation for all supported SevDesk API operations in the n8n-nodes-sevdesk-v2 node.

## Overview

The SevDesk node supports a wide range of operations across multiple resource types, enabling complete workflow automation for German accounting processes. All operations require valid SevDesk API credentials.

## Authentication

All API operations require:
- **API Key**: Your SevDesk API key
- **API Version**: Typically `v1` or `v2` (configured in credentials)

## Supported Resources

### 1. Contact Management

#### Contact
Primary customer and supplier management resource.

**Operations:**
- `create` - Create a new contact
- `get` - Retrieve a specific contact by ID
- `list` - List all contacts with optional filtering
- `update` - Update an existing contact
- `delete` - Delete a contact

**Example - Create Contact:**
```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Max Mustermann GmbH",
  "customerNumber": "K-001",
  "category": {
    "id": 3,
    "objectName": "Category"
  },
  "description": "Main customer contact"
}
```

**Example - List Contacts:**
```json
{
  "resource": "contact",
  "operation": "list",
  "limit": 50,
  "offset": 0,
  "depth": 1
}
```

#### Contact Address
Manage addresses associated with contacts.

**Operations:**
- `create` - Add new address to contact
- `get` - Retrieve specific address
- `list` - List addresses for contact
- `update` - Update address information
- `delete` - Remove address

#### Contact Custom Fields
Handle custom field data for contacts.

**Operations:**
- `create` - Create custom field value
- `get` - Retrieve custom field value
- `list` - List custom field values
- `update` - Update custom field value
- `delete` - Delete custom field value

### 2. Invoice Management

#### Invoice
Core invoicing functionality for billing customers.

**Operations:**
- `create` - Create new invoice
- `get` - Retrieve invoice by ID
- `list` - List invoices with filtering
- `update` - Update invoice details
- `delete` - Delete invoice
- `sendByEmail` - Send invoice via email
- `markAsSent` - Mark invoice as sent
- `bookAmount` - Book payment amount

**Example - Create Invoice:**
```json
{
  "resource": "invoice",
  "operation": "create",
  "invoiceNumber": "RE-2025-001",
  "contact": {
    "id": 123,
    "objectName": "Contact"
  },
  "invoiceDate": "2025-01-15",
  "status": 100,
  "invoiceType": "RE",
  "currency": "EUR"
}
```

**Example - Send Invoice by Email:**
```json
{
  "resource": "invoice",
  "operation": "sendByEmail",
  "invoiceId": 456,
  "sendToEmail": "customer@example.com",
  "subject": "Your Invoice RE-2025-001",
  "text": "Please find your invoice attached."
}
```

### 3. Order Management

#### Order
Handle customer orders and quotations.

**Operations:**
- `create` - Create new order
- `get` - Retrieve order details
- `list` - List orders
- `update` - Update order
- `delete` - Delete order

**Example - Create Order:**
```json
{
  "resource": "order",
  "operation": "create",
  "orderNumber": "AN-2025-001",
  "contact": {
    "id": 123,
    "objectName": "Contact"
  },
  "orderDate": "2025-01-15",
  "status": 100,
  "orderType": "AN"
}
```

#### Order Positions
Manage line items within orders.

**Operations:**
- `create` - Add position to order
- `get` - Retrieve position details
- `list` - List order positions
- `update` - Update position
- `delete` - Remove position

### 4. Voucher Management

#### Voucher
Handle receipts, expenses, and document management.

**Operations:**
- `create` - Create new voucher
- `get` - Retrieve voucher
- `list` - List vouchers
- `update` - Update voucher
- `delete` - Delete voucher
- `upload` - Upload voucher document

**Example - Create Voucher:**
```json
{
  "resource": "voucher",
  "operation": "create",
  "voucherDate": "2025-01-15",
  "supplier": {
    "id": 789,
    "objectName": "Contact"
  },
  "description": "Office supplies",
  "voucherType": "VOU",
  "status": 50
}
```

#### Voucher Positions
Manage accounting positions within vouchers.

**Operations:**
- `create` - Add position to voucher
- `get` - Retrieve position
- `list` - List voucher positions
- `update` - Update position
- `delete` - Remove position

### 5. Credit Note Management

#### Credit Note
Handle credit notes and refunds.

**Operations:**
- `create` - Create credit note
- `get` - Retrieve credit note
- `list` - List credit notes
- `update` - Update credit note
- `delete` - Delete credit note

**Example - Create Credit Note:**
```json
{
  "resource": "creditNote",
  "operation": "create",
  "creditNoteNumber": "GS-2025-001",
  "contact": {
    "id": 123,
    "objectName": "Contact"
  },
  "creditNoteDate": "2025-01-15",
  "status": 100
}
```

### 6. Accounting Management

#### Check Account
Manage chart of accounts and accounting categories.

**Operations:**
- `create` - Create account
- `get` - Retrieve account
- `list` - List accounts
- `update` - Update account
- `delete` - Delete account

#### Check Account Transaction
Handle individual accounting transactions.

**Operations:**
- `create` - Create transaction
- `get` - Retrieve transaction
- `list` - List transactions
- `update` - Update transaction
- `delete` - Delete transaction

### 7. Master Data Management

#### Category
Manage contact and item categories.

**Operations:**
- `get` - Retrieve category
- `list` - List categories

**Example - List Categories:**
```json
{
  "resource": "category",
  "operation": "list",
  "objectType": "Contact"
}
```

#### Part
Manage products and services.

**Operations:**
- `create` - Create part/product
- `get` - Retrieve part
- `list` - List parts
- `update` - Update part
- `delete` - Delete part

**Example - Create Part:**
```json
{
  "resource": "part",
  "operation": "create",
  "name": "Consulting Hour",
  "partNumber": "CONS-001",
  "price": 120.00,
  "unity": {
    "id": 1,
    "objectName": "Unity"
  }
}
```

#### Unity
Manage units of measurement.

**Operations:**
- `get` - Retrieve unity
- `list` - List unities

#### Country
Access country master data.

**Operations:**
- `get` - Retrieve country
- `list` - List countries

### 8. Communication Management

#### Communication Way
Manage contact communication methods (email, phone, etc.).

**Operations:**
- `create` - Add communication method
- `get` - Retrieve communication method
- `list` - List communication methods
- `update` - Update communication method
- `delete` - Delete communication method

### 9. Tag Management

#### Tag
Organize resources with tags.

**Operations:**
- `create` - Create tag
- `get` - Retrieve tag
- `list` - List tags
- `update` - Update tag
- `delete` - Delete tag

#### Tag Relation
Manage tag assignments to resources.

**Operations:**
- `create` - Assign tag to resource
- `get` - Retrieve tag relation
- `list` - List tag relations
- `delete` - Remove tag assignment

### 10. Reporting & Export

#### Report
Generate various business reports.

**Operations:**
- `generate` - Generate report
- `get` - Retrieve report
- `list` - List available reports

#### Export
Export data in various formats.

**Operations:**
- `create` - Create export job
- `get` - Retrieve export status
- `download` - Download export file

### 11. Layout Management

#### Layout
Manage document templates and layouts.

**Operations:**
- `get` - Retrieve layout
- `list` - List layouts

### 12. Batch Operations

#### Batch
Perform bulk operations efficiently.

**Operations:**
- `create` - Create batch job
- `get` - Retrieve batch status
- `list` - List batch jobs

### 13. System Operations

#### Basics
Access basic system information and settings.

**Operations:**
- `get` - Retrieve basic information
- `list` - List basic settings

## Common Parameters

### Pagination
Most list operations support pagination:
- `limit` - Number of records to return (default: 50, max: 1000)
- `offset` - Number of records to skip (default: 0)

### Filtering
Many operations support filtering:
- `depth` - Include related objects (0-2)
- `embed` - Comma-separated list of relations to include

### Sorting
List operations often support sorting:
- `orderBy` - Field to sort by
- `orderDirection` - `ASC` or `DESC`

## Error Handling

The node handles various SevDesk API errors:

- **400 Bad Request** - Invalid parameters or data
- **401 Unauthorized** - Invalid API credentials
- **403 Forbidden** - Insufficient permissions
- **404 Not Found** - Resource not found
- **429 Too Many Requests** - Rate limit exceeded
- **500 Internal Server Error** - SevDesk server error

## Rate Limits

SevDesk API has rate limits:
- Standard: 1000 requests per hour
- Premium: Higher limits available

The node automatically handles rate limiting with exponential backoff.

## Best Practices

1. **Use Batch Operations** for bulk data processing
2. **Implement Pagination** for large datasets
3. **Cache Master Data** (categories, countries, unities)
4. **Handle Errors Gracefully** with proper retry logic
5. **Use Webhooks** for real-time data synchronization
6. **Validate Data** before API calls to prevent errors

## Examples by Use Case

### Complete Invoice Workflow
1. Create/retrieve contact
2. Create invoice with positions
3. Send invoice by email
4. Track payment status
5. Generate reports

### Expense Management
1. Upload voucher document
2. Create voucher with positions
3. Assign to appropriate accounts
4. Generate expense reports

### Customer Management
1. Create contact with addresses
2. Set up communication methods
3. Assign categories and tags
4. Track interaction history

## Support

For additional help:
- Check the [SevDesk API Documentation](https://api.sevdesk.de/)
- Review the [n8n Community Forum](https://community.n8n.io/)
- Submit issues on the project repository

---

*This documentation covers all supported operations as of January 2025. For the most current API features, refer to the official SevDesk API documentation.*
