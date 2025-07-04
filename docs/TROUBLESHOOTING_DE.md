# SevDesk API Troubleshooting Guide

This guide helps you diagnose and resolve common issues when using the n8n-nodes-sevdesk-v2 node.

## Quick Diagnosis

### Is Your Issue Related To:
- **Authentication** → [Authentication Issues](#authentication-issues)
- **API Errors** → [Common API Errors](#common-api-errors)
- **Data Validation** → [Data Validation Errors](#data-validation-errors)
- **Performance** → [Performance Issues](#performance-issues)
- **Configuration** → [Configuration Problems](#configuration-problems)

## Authentication Issues

### 1. Invalid API Key Error

**Error Message:**
```
401 Unauthorized: Invalid API key
```

**Causes & Solutions:**

✅ **Check API Key Format**
- Ensure your API key is correctly formatted
- SevDesk API keys typically start with specific prefixes
- Remove any extra spaces or characters

✅ **Verify API Key Validity**
- Log into your SevDesk account
- Navigate to Settings → API
- Generate a new API key if needed
- Ensure the key has appropriate permissions

✅ **Check API Version**
- Verify you're using the correct API version (v1 or v2)
- Update the API version in your credentials if needed

**Example Fix:**
```json
{
  "apiKey": "your-valid-api-key-here",
  "apiVersion": "v1"
}
```

### 2. License Code Issues

**Error Message:**
```
403 Forbidden: Invalid license code
```

**Solutions:**
- Verify your SevDesk subscription includes API access
- Contact SevDesk support to confirm API permissions
- Check if your license has expired

### 3. Rate Limit Exceeded

**Error Message:**
```
429 Too Many Requests: Rate limit exceeded
```

**Solutions:**
- Implement delays between requests
- Use batch operations for bulk data
- Upgrade to a higher SevDesk plan for increased limits
- The node automatically handles retries with exponential backoff

## Common API Errors

### 1. Resource Not Found (404)

**Error Message:**
```
404 Not Found: Contact with ID 123 not found
```

**Debugging Steps:**
1. Verify the resource ID exists in SevDesk
2. Check if the resource was deleted
3. Ensure you have permission to access the resource
4. Use the list operation to find valid IDs

**Example Debug Query:**
```json
{
  "resource": "contact",
  "operation": "list",
  "limit": 10
}
```

### 2. Validation Errors (400)

**Error Message:**
```
400 Bad Request: Field 'email' is required
```

**Common Validation Issues:**

✅ **Required Fields Missing**
- Check SevDesk API documentation for required fields
- Ensure all mandatory fields are provided
- Use proper data types (string, number, boolean)

✅ **Invalid Data Format**
- Dates must be in ISO format: `YYYY-MM-DD`
- Email addresses must be valid
- Phone numbers should follow German format
- VAT numbers must be valid for German businesses

✅ **Field Length Limits**
- Contact names: max 255 characters
- Descriptions: max 1000 characters
- Custom fields: check specific limits

**Example Valid Contact:**
```json
{
  "name": "Max Mustermann GmbH",
  "customerNumber": "K-001",
  "category": {
    "id": 3,
    "objectName": "Category"
  },
  "email": "max@example.com",
  "phone": "+49 30 12345678"
}
```

### 3. Business Logic Errors

**Error Message:**
```
422 Unprocessable Entity: Invoice cannot be deleted - already sent
```

**Common Business Rules:**
- Invoices cannot be deleted after being sent
- Contacts with existing invoices cannot be deleted
- Vouchers must have valid accounting assignments
- Orders must have at least one position

**Solutions:**
- Check resource status before operations
- Use appropriate operations (e.g., cancel instead of delete)
- Follow German accounting regulations

## Data Validation Errors

### 1. German VAT Number Validation

**Error Message:**
```
Invalid VAT number format for German business
```

**Valid Formats:**
- German VAT: `DE123456789`
- EU VAT: Country code + number
- No VAT: Leave field empty

### 2. Address Validation

**Error Message:**
```
Invalid postal code for German address
```

**Requirements:**
- German postal codes: 5 digits (e.g., `10115`)
- Street addresses must include house number
- City names must be valid German cities

**Example Valid Address:**
```json
{
  "street": "Musterstraße 123",
  "zip": "10115",
  "city": "Berlin",
  "country": {
    "id": 1,
    "objectName": "Country"
  }
}
```

### 3. Currency and Amount Validation

**Error Message:**
```
Invalid currency code or amount format
```

**Requirements:**
- Use ISO currency codes (EUR, USD, etc.)
- Amounts must be positive numbers
- Maximum 2 decimal places for most currencies
- Use proper decimal separator (dot, not comma)

## Performance Issues

### 1. Slow Response Times

**Symptoms:**
- Requests taking longer than 30 seconds
- Timeouts during large data operations

**Solutions:**

✅ **Optimize Queries**
- Use pagination for large datasets
- Limit the `depth` parameter to reduce data size
- Filter results to only needed data

✅ **Batch Operations**
- Use batch endpoints for bulk operations
- Process data in smaller chunks
- Implement proper error handling for partial failures

**Example Optimized Query:**
```json
{
  "resource": "contact",
  "operation": "list",
  "limit": 50,
  "depth": 0,
  "embed": "category"
}
```

### 2. Memory Issues

**Symptoms:**
- Out of memory errors
- Node crashes during large operations

**Solutions:**
- Process data in smaller batches
- Use streaming for large file operations
- Clear variables after processing
- Monitor memory usage

## Configuration Problems

### 1. Incorrect Base URL

**Error Message:**
```
Connection refused or DNS resolution failed
```

**Solutions:**
- Verify the SevDesk API base URL
- Check your internet connection
- Ensure firewall allows HTTPS connections
- Use the correct regional endpoint

**Correct Base URLs:**
- Production: `https://my.sevdesk.de/api/v1/`
- Sandbox: `https://my.sevdesk.de/api/v1/` (with test credentials)

### 2. SSL/TLS Issues

**Error Message:**
```
SSL certificate verification failed
```

**Solutions:**
- Update Node.js to latest version
- Check system certificate store
- Verify system time is correct
- Contact IT support for corporate firewalls

### 3. Proxy Configuration

**Error Message:**
```
Connection timeout through proxy
```

**Solutions:**
- Configure proxy settings in n8n
- Whitelist SevDesk domains in proxy
- Use direct connection if possible
- Check proxy authentication

## Debugging Techniques

### 1. Enable Debug Logging

Add debug information to your workflows:

```javascript
// In a Code node before SevDesk operations
console.log('Input data:', $input.all());
console.log('Credentials test:', $credentials.sevDeskApi);
return $input.all();
```

### 2. Test API Connectivity

Create a simple test workflow:

```json
{
  "resource": "basics",
  "operation": "get"
}
```

### 3. Validate Data Step by Step

Break complex operations into smaller steps:
1. Test authentication
2. Validate input data
3. Test individual operations
4. Combine into full workflow

### 4. Use SevDesk API Documentation

- Check official API docs: https://api.sevdesk.de/
- Verify field requirements and formats
- Test operations in SevDesk's API explorer

## Error Code Reference

| Code | Meaning | Common Causes | Solutions |
|------|---------|---------------|-----------|
| 400 | Bad Request | Invalid parameters, missing required fields | Validate input data, check API documentation |
| 401 | Unauthorized | Invalid API key, expired credentials | Update API key, check permissions |
| 403 | Forbidden | Insufficient permissions, license issues | Check account permissions, verify license |
| 404 | Not Found | Resource doesn't exist, wrong ID | Verify resource exists, check ID format |
| 422 | Unprocessable Entity | Business logic violation | Follow German accounting rules, check resource status |
| 429 | Too Many Requests | Rate limit exceeded | Implement delays, use batch operations |
| 500 | Internal Server Error | SevDesk server issues | Retry request, contact SevDesk support |
| 502/503 | Service Unavailable | SevDesk maintenance | Wait and retry, check SevDesk status page |

## Getting Help

### 1. Check Logs
- Review n8n execution logs
- Look for detailed error messages
- Check network connectivity logs

### 2. Community Support
- n8n Community Forum: https://community.n8n.io/
- SevDesk Support: https://sevdesk.de/support/
- GitHub Issues: Project repository

### 3. Professional Support
- n8n Cloud support for hosted instances
- SevDesk premium support for API issues
- Consulting services for complex integrations

### 4. Useful Resources
- [SevDesk API Documentation](https://api.sevdesk.de/)
- [n8n Documentation](https://docs.n8n.io/)
- [German Accounting Regulations](https://www.bundesfinanzministerium.de/)

## Prevention Tips

### 1. Regular Maintenance
- Update API keys before expiration
- Monitor rate limit usage
- Keep node version updated
- Test workflows regularly

### 2. Error Handling
- Implement proper try-catch blocks
- Add retry logic for transient failures
- Log errors for debugging
- Provide user-friendly error messages

### 3. Data Quality
- Validate data before API calls
- Use consistent data formats
- Implement data sanitization
- Regular data quality checks

### 4. Performance Monitoring
- Monitor response times
- Track error rates
- Set up alerts for failures
- Regular performance reviews

---

## Quick Reference Commands

### Test API Connection
```json
{
  "resource": "basics",
  "operation": "get"
}
```

### List Available Resources
```json
{
  "resource": "category",
  "operation": "list"
}
```

### Validate Contact Data
```json
{
  "resource": "contact",
  "operation": "list",
  "limit": 1
}
```

### Check Rate Limits
Monitor response headers for rate limit information.

---

*This troubleshooting guide is updated regularly. For the latest information, check the project documentation and SevDesk API updates.*
