# n8n-nodes-sevdesk-v2

[![Version](https://img.shields.io/npm/v/n8n-nodes-sevdesk-v2.svg)](https://www.npmjs.com/package/n8n-nodes-sevdesk-v2)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-sevdesk-v2.svg)](https://www.npmjs.com/package/n8n-nodes-sevdesk-v2)
[![Tests](https://github.com/knackw/n8n-nodes-sevdesk-v2/workflows/CI/badge.svg)](https://github.com/knackw/n8n-nodes-sevdesk-v2/actions)
[![License](https://img.shields.io/npm/l/n8n-nodes-sevdesk-v2.svg)](https://github.com/knackw/n8n-nodes-sevdesk-v2/blob/main/LICENSE)

A comprehensive n8n community node for integrating with the SevDesk v2 API. SevDesk is a popular German accounting software that helps businesses manage invoices, contacts, orders, and financial documents.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## 🚀 Features

- **Complete CRUD Operations** for all major SevDesk entities
- **API v2 Support** with backward compatibility to v1
- **Comprehensive Filtering** and search capabilities
- **File Upload/Download** support for documents
- **Batch Operations** for efficient data processing
- **Error Handling** with detailed feedback and retry logic
- **Direct API Access** without external dependencies
- **Simple Configuration** with just API key and version
- **Optimized Performance** through lean architecture
- **TypeScript Support** with full type definitions
- **Comprehensive Testing** with unit and integration tests

## 📋 Supported Resources

### ✅ Fully Implemented
- **Contacts** - Complete contact management with addresses and custom fields
- **Invoices** - Full invoice lifecycle including PDF generation and email sending
- **Orders** - Order management with line items and discounts
- **Vouchers** - Document management with file attachments
- **Parts** - Inventory management with stock tracking
- **Check Accounts** - Bank account and transaction management
- **Tags** - Flexible tagging system for all resources
- **Reports** - PDF report generation and export
- **Categories** - Resource categorization and organization
- **Communication Ways** - Contact communication methods (email, phone, etc.)
- **Countries** - Country and region management
- **Unity** - Unit of measurement management

### 🔄 In Progress
- **Credit Notes** - Credit note management and processing
- **Exports** - Data export functionality
- **Layouts** - Document layout management

## 🛠 Installation

### Prerequisites

Before installing the node, ensure you have:

1. **n8n installed** - Follow the [n8n installation guide](https://docs.n8n.io/getting-started/installation/)
2. **Node.js >= 18.0.0** - Required for the node to function properly
3. **SevDesk Account** - You'll need a SevDesk account with API access

### Install via n8n Community Nodes

1. **Open n8n** in your browser
2. **Go to Settings** → **Community Nodes**
3. **Click "Install a community node"**
4. **Enter the package name**: `n8n-nodes-sevdesk-v2`
5. **Click "Install"**

### Install via npm (Self-hosted)

```bash
# Navigate to your n8n installation directory
cd ~/.n8n

# Install the community node
npm install n8n-nodes-sevdesk-v2

# Restart n8n
n8n start
```

### Install via Docker

If you're using n8n with Docker, add the package to your Docker setup:

```dockerfile
# In your Dockerfile
RUN npm install -g n8n-nodes-sevdesk-v2

# Or via docker-compose.yml environment variable
environment:
  - N8N_NODES_INCLUDE=n8n-nodes-sevdesk-v2
```

## ⚙️ Configuration

### Step 1: Get Your SevDesk API Key

1. **Log in to your SevDesk account**
2. **Navigate to Settings** → **User Management** → **API**
3. **Create a new API key**:
   - Click "Generate new API key"
   - Give it a descriptive name (e.g., "n8n Integration")
   - Copy the generated API key (you won't see it again!)

### Step 2: Configure Credentials in n8n

1. **In n8n, go to Credentials**
2. **Click "Create New Credential"**
3. **Search for "SevDesk API"**
4. **Fill in the required fields**:
   - **API Key**: Your SevDesk API key from Step 1
   - **API Version**: `v2` (recommended) or `v1` (legacy)
   - **Test Connection**: Click to verify your credentials

### Step 3: Test Your Setup

Create a simple workflow to test the connection:

1. **Add a SevDesk node** to your workflow
2. **Select your credentials**
3. **Choose Resource**: `Contact`
4. **Choose Operation**: `List`
5. **Execute the node** to verify it works

## 🚀 Quick Start Examples

### Example 1: Create a New Contact

```json
{
  "resource": "contact",
  "operation": "create",
  "name": "John Doe",
  "customerNumber": "CUST-001",
  "email": "john.doe@example.com",
  "phone": "+49 123 456789",
  "category": {
    "id": "3",
    "objectName": "Category"
  }
}
```

### Example 2: Create an Invoice

```json
{
  "resource": "invoice",
  "operation": "create",
  "contact": {
    "id": "{{ $('Get Contact').item.json.id }}",
    "objectName": "Contact"
  },
  "invoiceDate": "2025-01-07",
  "status": "draft",
  "invoiceType": "RE",
  "currency": "EUR"
}
```

### Example 3: List Contacts with Filtering

```json
{
  "resource": "contact",
  "operation": "list",
  "filters": {
    "customerNumber": "CUST-*",
    "category.id": "3"
  },
  "limit": 50,
  "offset": 0
}
```

### Example 4: Upload a Document

```json
{
  "resource": "voucher",
  "operation": "create",
  "voucherDate": "2025-01-07",
  "supplier": {
    "id": "{{ $('Get Supplier').item.json.id }}",
    "objectName": "Contact"
  },
  "document": "{{ $('Read File').item.binary.data }}"
}
```

## 📖 Detailed Usage Guide

### Working with Contacts

Contacts are the foundation of SevDesk and represent customers, suppliers, and other business partners.

#### Create a Contact
```javascript
// Basic contact creation
{
  "resource": "contact",
  "operation": "create",
  "name": "Acme Corporation",
  "customerNumber": "CUST-001",
  "category": { "id": "3", "objectName": "Category" }
}

// Contact with full details
{
  "resource": "contact",
  "operation": "create",
  "name": "Acme Corporation",
  "customerNumber": "CUST-001",
  "email": "info@acme.com",
  "phone": "+49 123 456789",
  "website": "https://acme.com",
  "category": { "id": "3", "objectName": "Category" },
  "taxNumber": "DE123456789",
  "vatNumber": "DE987654321"
}
```

#### Search Contacts
```javascript
// Search by name
{
  "resource": "contact",
  "operation": "list",
  "filters": {
    "name": "Acme*"
  }
}

// Search by customer number
{
  "resource": "contact",
  "operation": "list",
  "filters": {
    "customerNumber": "CUST-001"
  }
}
```

### Working with Invoices

Invoices represent billing documents sent to customers.

#### Create an Invoice
```javascript
{
  "resource": "invoice",
  "operation": "create",
  "contact": {
    "id": "123",
    "objectName": "Contact"
  },
  "invoiceDate": "2025-01-07",
  "header": "Invoice for services rendered",
  "headText": "Thank you for your business!",
  "footText": "Payment due within 30 days.",
  "currency": "EUR",
  "status": "draft"
}
```

#### Send an Invoice
```javascript
{
  "resource": "invoice",
  "operation": "sendViaEmail",
  "invoiceId": "{{ $('Create Invoice').item.json.id }}",
  "sendToEmail": "customer@example.com",
  "subject": "Your Invoice #{{ $('Create Invoice').item.json.invoiceNumber }}",
  "text": "Please find your invoice attached."
}
```

### Working with Orders

Orders represent sales orders before they become invoices.

#### Create an Order
```javascript
{
  "resource": "order",
  "operation": "create",
  "contact": {
    "id": "123",
    "objectName": "Contact"
  },
  "orderDate": "2025-01-07",
  "status": "pending",
  "currency": "EUR"
}
```

### Error Handling

The node provides comprehensive error handling with detailed error messages:

```javascript
// Example error handling in a workflow
try {
  const result = await this.helpers.httpRequest(options);
  return result;
} catch (error) {
  if (error.statusCode === 401) {
    throw new Error('Invalid API credentials. Please check your SevDesk API key.');
  } else if (error.statusCode === 429) {
    throw new Error('Rate limit exceeded. Please wait before making more requests.');
  } else {
    throw new Error(`SevDesk API error: ${error.message}`);
  }
}
```

## 🔧 Advanced Configuration

### Rate Limiting

SevDesk has rate limits on their API. The node automatically handles rate limiting with exponential backoff:

- **Default rate limit**: 1000 requests per hour
- **Burst limit**: 10 requests per second
- **Automatic retry**: Up to 3 retries with exponential backoff

### Pagination

For list operations, use pagination to handle large datasets:

```javascript
{
  "resource": "contact",
  "operation": "list",
  "limit": 100,        // Max 100 per request
  "offset": 0,         // Start from beginning
  "orderBy": "name",   // Sort by name
  "orderDirection": "ASC"
}
```

### Custom Fields

SevDesk supports custom fields for most resources:

```javascript
{
  "resource": "contact",
  "operation": "create",
  "name": "Custom Contact",
  "customFields": {
    "customField1": "value1",
    "customField2": "value2"
  }
}
```

## 🧪 Development Setup

### Prerequisites for Development

- **Node.js >= 18.0.0**
- **npm or yarn**
- **Docker** (for testing)
- **Git**

### Clone and Setup

```bash
# Clone the repository
git clone https://github.com/knackw/n8n-nodes-sevdesk-v2.git
cd n8n-nodes-sevdesk-v2

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Start development mode
npm run dev
```

### Environment Setup

1. **Copy the environment template**:
   ```bash
   cp .env.template .env
   ```

2. **Fill in your SevDesk credentials**:
   ```bash
   SEVDESK_API_KEY=your_api_key_here
   SEVDESK_API_VERSION=v2
   ```

3. **Start the development environment**:
   ```bash
   npm start
   ```

### Testing

The project includes comprehensive tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch

# Run specific test file
npm test -- ContactHandler.test.ts
```

### Docker Development

For a complete development environment with n8n:

```bash
# Start the development environment
docker-compose up -d

# View logs
docker-compose logs -f

# Stop the environment
docker-compose down
```

## 🐛 Troubleshooting

### Common Issues

#### 1. "Invalid API credentials" Error

**Problem**: The node returns authentication errors.

**Solution**:
- Verify your API key is correct
- Check that your SevDesk account has API access enabled
- Ensure you're using the correct API version (v2 recommended)

#### 2. "Rate limit exceeded" Error

**Problem**: Too many requests in a short time.

**Solution**:
- Reduce the frequency of your requests
- Implement delays between requests in your workflow
- Use batch operations where possible

#### 3. "Resource not found" Error

**Problem**: Trying to access a resource that doesn't exist.

**Solution**:
- Verify the resource ID is correct
- Check that the resource hasn't been deleted
- Ensure you have permission to access the resource

#### 4. Connection Timeout

**Problem**: Requests are timing out.

**Solution**:
- Check your internet connection
- Verify SevDesk service status
- Increase timeout settings if using custom HTTP requests

### Debug Mode

Enable debug logging to troubleshoot issues:

```bash
# Set environment variable for debug logging
export N8N_LOG_LEVEL=debug

# Or in your .env file
N8N_LOG_LEVEL=debug
```

### Getting Help

If you encounter issues:

1. **Check the logs** for detailed error messages
2. **Review the documentation** for correct usage
3. **Search existing issues** on GitHub
4. **Create a new issue** with:
   - Detailed error description
   - Steps to reproduce
   - n8n version
   - Node version
   - SevDesk API version

## 📚 API Reference

### Supported Operations by Resource

| Resource | Create | Read | Update | Delete | List | Custom Operations |
|----------|--------|------|--------|--------|------|-------------------|
| Contact | ✅ | ✅ | ✅ | ✅ | ✅ | checkCustomerNumber, findByCustomField |
| Invoice | ✅ | ✅ | ✅ | ✅ | ✅ | sendViaEmail, markAsSent, bookAmount |
| Order | ✅ | ✅ | ✅ | ✅ | ✅ | convertToInvoice |
| Voucher | ✅ | ✅ | ✅ | ✅ | ✅ | uploadDocument |
| Part | ✅ | ✅ | ✅ | ✅ | ✅ | updateStock |
| Tag | ✅ | ✅ | ✅ | ✅ | ✅ | - |
| Category | ✅ | ✅ | ✅ | ✅ | ✅ | - |

### Response Format

All operations return data in this format:

```json
{
  "objects": [...],     // Array of returned objects
  "total": 150,         // Total number of objects (for list operations)
  "success": true       // Operation success status
}
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes**
4. **Add tests** for new functionality
5. **Run the test suite**: `npm test`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

### Code Style

- Use **TypeScript** for all new code
- Follow **ESLint** and **Prettier** configurations
- Add **JSDoc comments** for all public methods
- Write **comprehensive tests** for new features
- Follow **conventional commit** messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [n8n](https://n8n.io/) for the amazing workflow automation platform
- [SevDesk](https://sevdesk.de/) for providing a comprehensive accounting API
- The n8n community for feedback and contributions

## 📞 Support

- **Documentation**: [Full documentation](docs/)
- **Issues**: [GitHub Issues](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- **Discussions**: [GitHub Discussions](https://github.com/knackw/n8n-nodes-sevdesk-v2/discussions)
- **n8n Community**: [n8n Community Forum](https://community.n8n.io/)
- **Buy me a coffee**: [Support the project](https://buymeacoffee.com/knackw)

---

**Made with ❤️ for the n8n community**
