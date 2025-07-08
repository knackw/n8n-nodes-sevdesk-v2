# Migration Guide: From Placeholder to Production Implementation

This guide helps you migrate from placeholder implementations to the fully functional SevDesk API integration in n8n-nodes-sevdesk-v2.

## Overview

The n8n-nodes-sevdesk-v2 node has evolved from placeholder implementations to a fully functional SevDesk API integration. This guide covers:

- **What Changed**: Key differences between placeholder and production versions
- **Migration Steps**: How to update your workflows
- **Breaking Changes**: What might need adjustment
- **New Features**: Enhanced capabilities now available
- **Best Practices**: Recommendations for optimal usage

## What Changed

### 1. API Integration

**Before (Placeholder):**
```javascript
// Returned mock data
return [
  {
    json: {
      id: 'mock-123',
      name: 'Mock Contact',
      status: 'placeholder'
    }
  }
];
```

**After (Production):**
```javascript
// Makes actual SevDesk API calls
const response = await this.helpers.httpRequestWithAuthentication.call(
  this,
  'sevDeskApi',
  {
    method: 'GET',
    url: '/Contact',
    headers: {
      'Authorization': `Token ${credentials.apiKey}`,
      'Content-Type': 'application/json'
    }
  }
);
```

### 2. Authentication

**Before:**
- No actual API authentication
- Credentials were ignored
- All operations returned mock data

**After:**
- Full SevDesk API authentication
- API key validation
- Proper error handling for auth failures

### 3. Data Validation

**Before:**
- Minimal input validation
- No business rule enforcement
- Generic error messages

**After:**
- Comprehensive input validation
- German business rule compliance
- Detailed error messages with suggestions

### 4. Error Handling

**Before:**
```javascript
// Generic error handling
throw new Error('Operation failed');
```

**After:**
```javascript
// Specific SevDesk error handling
if (error.response?.status === 401) {
  throw new SevDeskAuthenticationError('Invalid API key', error);
} else if (error.response?.status === 422) {
  throw new SevDeskValidationError('Business rule violation', error);
}
```

## Migration Steps

### Step 1: Update Credentials

**Action Required:** Verify your SevDesk API credentials

1. **Check API Key Format**
   ```json
   {
     "apiKey": "your-actual-sevdesk-api-key",
     "apiVersion": "v1"
   }
   ```

2. **Test Credentials**
   - Create a simple test workflow
   - Use the `basics` resource with `get` operation
   - Verify successful authentication

**Test Workflow:**
```json
{
  "resource": "basics",
  "operation": "get"
}
```

### Step 2: Review Workflow Logic

**Action Required:** Update workflows that relied on placeholder behavior

**Common Changes Needed:**

1. **Response Data Structure**
   - Real API responses may have different field names
   - Additional metadata fields are now included
   - Nested objects follow SevDesk API structure

2. **Error Handling**
   - Add proper try-catch blocks
   - Handle specific SevDesk error codes
   - Implement retry logic for transient failures

**Example Update:**
```javascript
// Before: Expected mock data structure
const contactName = items[0].json.name;

// After: Handle real API response structure
const contactName = items[0].json.objects?.[0]?.name || items[0].json.name;
```

### Step 3: Update Resource Operations

**Action Required:** Review and update resource-specific operations

#### Contact Operations

**Before:**
```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Test Contact"
}
```

**After:**
```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Test Contact",
  "category": {
    "id": 3,
    "objectName": "Category"
  },
  "customerNumber": "K-001"
}
```

#### Invoice Operations

**Before:**
```json
{
  "resource": "invoice",
  "operation": "create",
  "amount": 100
}
```

**After:**
```json
{
  "resource": "invoice",
  "operation": "create",
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

### Step 4: Handle New Required Fields

**Action Required:** Add required fields that weren't needed in placeholder version

#### Common Required Fields by Resource:

**Contact:**
- `category` (object with id and objectName)
- `customerNumber` (for customers)

**Invoice:**
- `contact` (object reference)
- `invoiceDate` (ISO date format)
- `status` (numeric status code)
- `invoiceType` (RE, AN, etc.)

**Voucher:**
- `voucherDate` (ISO date format)
- `supplier` (contact object reference)
- `voucherType` (VOU, etc.)

**Order:**
- `contact` (object reference)
- `orderDate` (ISO date format)
- `orderType` (AN, etc.)

### Step 5: Update Data Formats

**Action Required:** Ensure data formats match SevDesk API requirements

#### Date Formats

**Before:** Any date format accepted
```
"date": "15.01.2025"
```

**After:** ISO date format required
```
"date": "2025-01-15"
```

#### Object References

**Before:** Simple ID reference
```
"categoryId": 3
```

**After:** Object reference format
```
"category": {
  "id": 3,
  "objectName": "Category"
}
```

#### Currency and Amounts

**Before:** Simple number
```
"amount": 100
```

**After:** Proper decimal format
```
"amount": 100.00,
"currency": "EUR"
```

## Breaking Changes

### 1. Response Structure Changes

**Impact:** Workflows that parse response data

**Before:**
```json
{
  "id": "123",
  "name": "Contact Name",
  "email": "test@example.com"
}
```

**After:**
```json
{
  "objects": [
    {
      "id": "123",
      "objectName": "Contact",
      "name": "Contact Name",
      "email": "test@example.com",
      "create": "2025-01-15T10:00:00Z",
      "update": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Migration:**
```javascript
// Update data extraction logic
const contacts = response.objects || [response];
const contact = contacts[0];
```

### 2. Error Response Changes

**Impact:** Error handling logic

**Before:**
```json
{
  "error": "Generic error message"
}
```

**After:**
```json
{
  "error": {
    "message": "Specific SevDesk error",
    "code": 400,
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### 3. Authentication Requirements

**Impact:** All operations now require valid credentials

**Before:** Operations worked without credentials
**After:** All operations require valid SevDesk API key

**Migration:** Ensure all workflows have proper credential configuration

## New Features Available

### 1. Real-time Data Synchronization

```json
{
  "resource": "contact",
  "operation": "list",
  "modifiedAfter": "2025-01-15T00:00:00Z"
}
```

### 2. Advanced Filtering

```json
{
  "resource": "invoice",
  "operation": "list",
  "status": 100,
  "contactId": 123,
  "dateFrom": "2025-01-01",
  "dateTo": "2025-01-31"
}
```

### 3. Batch Operations

```json
{
  "resource": "batch",
  "operation": "create",
  "operations": [
    {
      "method": "POST",
      "url": "/Contact",
      "data": { "name": "Contact 1" }
    },
    {
      "method": "POST", 
      "url": "/Contact",
      "data": { "name": "Contact 2" }
    }
  ]
}
```

### 4. Document Management

```json
{
  "resource": "voucher",
  "operation": "upload",
  "file": "base64-encoded-document",
  "filename": "receipt.pdf"
}
```

### 5. Email Integration

```json
{
  "resource": "invoice",
  "operation": "sendByEmail",
  "invoiceId": 456,
  "sendToEmail": "customer@example.com",
  "subject": "Your Invoice",
  "text": "Please find attached..."
}
```

## Migration Checklist

### Pre-Migration
- [ ] Backup existing workflows
- [ ] Document current workflow behavior
- [ ] Obtain valid SevDesk API credentials
- [ ] Test credentials with simple operations

### During Migration
- [ ] Update credential configuration
- [ ] Review and update each workflow step by step
- [ ] Add proper error handling
- [ ] Update data extraction logic
- [ ] Test each operation individually

### Post-Migration
- [ ] Perform end-to-end testing
- [ ] Monitor for errors and performance issues
- [ ] Update documentation and comments
- [ ] Train users on new features
- [ ] Set up monitoring and alerts

## Common Migration Issues

### 1. Authentication Failures

**Symptom:** 401 Unauthorized errors
**Solution:** 
- Verify API key format and validity
- Check SevDesk account permissions
- Ensure API access is enabled in SevDesk

### 2. Data Format Errors

**Symptom:** 400 Bad Request errors
**Solution:**
- Convert dates to ISO format (YYYY-MM-DD)
- Use object references instead of simple IDs
- Validate required fields

### 3. Business Logic Violations

**Symptom:** 422 Unprocessable Entity errors
**Solution:**
- Follow German accounting regulations
- Check resource status before operations
- Validate business relationships

### 4. Performance Issues

**Symptom:** Slow response times or timeouts
**Solution:**
- Implement pagination for large datasets
- Use batch operations for bulk data
- Add appropriate delays between requests

## Testing Your Migration

### 1. Basic Connectivity Test

```json
{
  "resource": "basics",
  "operation": "get"
}
```

### 2. CRUD Operations Test

```javascript
// Create
const contact = await createContact({
  name: "Test Contact",
  category: { id: 3, objectName: "Category" }
});

// Read
const retrieved = await getContact(contact.id);

// Update
const updated = await updateContact(contact.id, {
  description: "Updated description"
});

// Delete
await deleteContact(contact.id);
```

### 3. Error Handling Test

```javascript
try {
  // Attempt operation with invalid data
  await createContact({ name: "" }); // Should fail
} catch (error) {
  // Verify proper error handling
  console.log('Error handled correctly:', error.message);
}
```

## Best Practices After Migration

### 1. Error Handling
- Always wrap SevDesk operations in try-catch blocks
- Implement retry logic for transient failures
- Log errors for debugging purposes

### 2. Data Validation
- Validate input data before API calls
- Use TypeScript interfaces for type safety
- Implement business rule validation

### 3. Performance Optimization
- Use pagination for large datasets
- Implement caching for frequently accessed data
- Monitor API rate limits

### 4. Security
- Never log sensitive data (API keys, personal information)
- Validate all user inputs
- Use secure credential storage

## Getting Help

### Migration Support Resources

1. **Documentation**
   - [API Reference](./api-reference.md)
   - [Troubleshooting Guide](./troubleshooting.md)
   - [SevDesk API Documentation](https://api.sevdesk.de/)

2. **Community Support**
   - n8n Community Forum
   - GitHub Issues
   - SevDesk Support

3. **Professional Services**
   - Migration consulting
   - Custom development
   - Training and support

## Migration Timeline Recommendations

### Small Workflows (1-5 nodes)
- **Planning:** 1-2 hours
- **Migration:** 2-4 hours
- **Testing:** 1-2 hours
- **Total:** 4-8 hours

### Medium Workflows (5-20 nodes)
- **Planning:** 4-8 hours
- **Migration:** 8-16 hours
- **Testing:** 4-8 hours
- **Total:** 16-32 hours

### Large Workflows (20+ nodes)
- **Planning:** 1-2 days
- **Migration:** 2-5 days
- **Testing:** 1-2 days
- **Total:** 4-9 days

## Conclusion

Migrating from placeholder to production implementation provides:

✅ **Real SevDesk Integration** - Actual API connectivity
✅ **Enhanced Reliability** - Proper error handling and validation
✅ **New Features** - Advanced operations and capabilities
✅ **Better Performance** - Optimized for production use
✅ **Compliance** - German business rule adherence

The migration process, while requiring some effort, significantly improves the functionality and reliability of your SevDesk workflows.

---

*For additional migration support, consult the project documentation or reach out to the community for assistance.*
