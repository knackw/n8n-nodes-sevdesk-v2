# 🚀 n8n-nodes-sevdesk-v2

**Version:** 2.4.1  
**Status:** Production Ready  
**API-Kompatibilität:** SevDesk API v2.0  
**n8n-Kompatibilität:** 1.101.1+

[![Version](https://img.shields.io/npm/v/n8n-nodes-sevdesk-v2.svg)](https://www.npmjs.com/package/n8n-nodes-sevdesk-v2)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-sevdesk-v2.svg)](https://www.npmjs.com/package/n8n-nodes-sevdesk-v2)
[![Tests](https://github.com/knackw/n8n-nodes-sevdesk-v2/workflows/CI/badge.svg)](https://github.com/knackw/n8n-nodes-sevdesk-v2/actions)
[![License](https://img.shields.io/npm/l/n8n-nodes-sevdesk-v2.svg)](https://github.com/knackw/n8n-nodes-sevdesk-v2/blob/main/LICENSE)
[![Node Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![n8n Version](https://img.shields.io/badge/n8n-%3E%3D1.101.1-blue)](https://n8n.io/)

Professional n8n community node for SevDesk API v2 integration with 24 production-ready workflow templates. Direct API access without external dependencies - simplified, secure, and optimized for German accounting automation.

[n8n](https://n8n.io/) is a [fair-code licensed](https://docs.n8n.io/reference/license/) workflow automation platform.

## 🚀 Features

### 📧 Advanced Email & Document Management

- **Email Template System** - 5 predefined templates with placeholder support
- **Professional PDF Export** - 5 customizable templates, multi-language support
- **E-Invoice Standards** - XRechnung, ZUGFeRD, FacturX, UBL compliance
- **Smart Document Upload** - OCR integration, categorization, MIME detection

### 🔧 Complete Business Operations

- **Complete CRUD Operations** for all major SevDesk entities
- **Advanced Order-to-Invoice** conversion with dunning levels
- **Batch Operations** for efficient data processing (25-50 operations optimal)
- **Rate Limiting Intelligence** - Account-tier aware with exponential backoff

### 🔒 Enterprise-Grade Reliability

- **Resource-Specific Error Handling** - Context-aware error management
- **Field Validation** - Required field enforcement across all resources
- **Security Features** - Advanced error message sanitization
- **API v2 Support** with backward compatibility to v1

### 🌟 Production Ready

- **n8n 1.101.1 Compatible** - Latest n8n version support with updated typeVersions
- **Production-Ready Workflows** - 24+ comprehensive test workflows for German businesses
- **German Business Standards** - SKR03, GoBD, DATEV compliance
- **TypeScript Support** with full type definitions
- **Comprehensive Testing** with unit and integration tests

## 📋 Supported Resources

### ✅ Fully Implemented & Enhanced

- **Contacts** - Complete contact management with required field validation
- **Invoices** - Full lifecycle with email templates, PDF customization, XML e-invoicing
- **Invoice Positions** - Complete CRUD operations for line items
- **Orders** - Enhanced order-to-invoice conversion with dunning levels
- **Vouchers** - Smart document upload with OCR and categorization
- **Parts** - Inventory management with stock tracking
- **Check Accounts** - Bank account and transaction management
- **Tags** - Flexible tagging system for all resources
- **Reports** - PDF report generation and export
- **Categories** - Resource categorization and organization
- **Communication Ways** - Contact communication methods (email, phone, etc.)
- **Countries** - Country and region management
- **Unity** - Unit of measurement management
- **Batch Operations** - Professional bulk operation framework

### ✅ Fully Supported (Extended)

- **Credit Notes** - Credit note management and processing
- **Exports** - Data export functionality
- **Layouts** - Document layout management
- **Basics** - System information and settings

## 🛠 Installation

### Prerequisites

Before installing the node, ensure you have:

1. **n8n >= 1.101.1** - Follow the [n8n installation guide](https://docs.n8n.io/getting-started/installation/)
2. **Node.js >= 18.0.0** - Required for the node to function properly
3. **SevDesk Account** - You'll need a SevDesk account with API access
4. **German Business Context** (Optional) - Many templates are optimized for German accounting standards

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

## 🔧 Pre-built Workflow Templates

This package includes comprehensive test workflows that demonstrate real-world SevDesk automation scenarios. These workflows are ready-to-use templates for common business processes.

### 📋 Available Workflow Templates

#### 01. Belegerfassung (Document Processing)

**Path**: `test-workflows/01-Belegerfassung/`

- **Teil 1**: Document capture from multiple sources (email, scan, upload)
- **Teil 2**: Automated processing with OCR and data extraction
- **Teil 3**: Validation and SevDesk integration

#### 02. Rechnungsstellung (Invoicing)

**Path**: `test-workflows/02-Rechnungsstellung/`

- **Teil 1**: Invoice data collection and customer validation
- **Teil 2**: Automated invoice generation with templates
- **Teil 3**: Multi-channel distribution (email, print, portal)

#### 03. Mahnwesen (Dunning Management)

**Path**: `test-workflows/03-Mahnwesen/`

- **Teil 1**: Overdue invoice detection and escalation logic
- **Teil 2**: Automated reminder processing with staging
- **Teil 3**: Multi-channel reminder distribution

#### 04. Steuerberater-Export (Tax Advisor Export)

**Path**: `test-workflows/04-Steuerberater-Export/`

- **Teil 1**: DATEV-compliant data extraction
- **Teil 2**: Format conversion and data preparation
- **Teil 3**: Secure transmission to tax advisors

#### 05. Banktransaktionen (Bank Transactions)

**Path**: `test-workflows/05-Banktransaktionen/`

- **Teil 1**: Multi-bank format import (CSV, MT940, CAMT.053)
- **Teil 2**: AI-powered transaction categorization
- **Teil 3**: Automated booking with SKR03 compliance

#### 06. Reporting (Business Intelligence)

**Path**: `test-workflows/06-Reporting/`

- **Teil 1**: Comprehensive data extraction with KPIs
- **Teil 2**: Advanced analytics and trend analysis
- **Teil 3**: Automated report distribution

#### 07. Dokumentenmanagement (Document Management)

**Path**: `test-workflows/07-Dokumentenmanagement/`

- **Teil 1**: Intelligent document capture with OCR
- **Teil 2**: Content processing and metadata extraction
- **Teil 3**: GoBD-compliant archiving (10-year retention)

#### 08. Kundenkommunikation (Customer Communication)

**Path**: `test-workflows/08-Kundenkommunikation/`

- **Teil 1**: Automated trigger detection (overdue, events)
- **Teil 2**: Personalized message generation
- **Teil 3**: Multi-channel communication delivery

### 🚀 Quick Template Import

```bash
# Import all workflows to your n8n instance
node tools/start-n8n-workflows.js

# Or import specific category
node tools/start-n8n-workflows.js --category 01-Belegerfassung
```

### 🔧 Template Features

- **n8n 1.101.1 Compatible** - Latest n8n version support
- **Modular Architecture** - 3-part workflow structure for maintainability
- **Error Handling** - Comprehensive error management and notifications
- **German Business Logic** - Tailored for German accounting standards (SKR03, GoBD)
- **Webhook Integration** - Inter-workflow communication
- **Audit Trail** - Complete compliance tracking
- **Scalable Design** - Production-ready implementations

### 📊 Template Architecture

Each workflow category follows a consistent 3-part pattern:

```
Category/
├── Teil1-[Process]/     # Data input and initial processing
├── Teil2-[Core]/        # Main business logic and transformations
├── Teil3-[Output]/      # Results processing and distribution
└── README.md           # Category-specific documentation
```

### ⚙️ Configuration Requirements

Before using the templates:

1. **SevDesk Credentials** - Configure your API access
2. **Email Settings** - SMTP for notifications
3. **File Paths** - Adjust paths for your environment
4. **Webhook URLs** - Update inter-workflow communication endpoints

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
		throw new Error(
			"Invalid API credentials. Please check your SevDesk API key.",
		);
	} else if (error.statusCode === 429) {
		throw new Error(
			"Rate limit exceeded. Please wait before making more requests.",
		);
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

### Commands

```bash
docker exec -u root <container_name> chown -R 1000:1000 "/home/node/.npm"
```

### Contributing

## 📚 API Reference

### Supported Operations by Resource

| Resource | Create | Read | Update | Delete | List | Custom Operations                      |
| -------- | ------ | ---- | ------ | ------ | ---- | -------------------------------------- |
| Contact  | ✅     | ✅   | ✅     | ✅     | ✅   | checkCustomerNumber, findByCustomField |
| Invoice  | ✅     | ✅   | ✅     | ✅     | ✅   | sendViaEmail, markAsSent, bookAmount   |
| Order    | ✅     | ✅   | ✅     | ✅     | ✅   | convertToInvoice                       |
| Voucher  | ✅     | ✅   | ✅     | ✅     | ✅   | uploadDocument                         |
| Part     | ✅     | ✅   | ✅     | ✅     | ✅   | updateStock                            |
| Tag      | ✅     | ✅   | ✅     | ✅     | ✅   | -                                      |
| Category | ✅     | ✅   | ✅     | ✅     | ✅   | -                                      |

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

## ⚠️ Disclaimer

Context7 projects are community-contributed and while we strive to maintain high quality, we cannot guarantee the accuracy, completeness, or security of all library documentation. Projects listed in Context7 are developed and maintained by their respective owners, not by Context7. If you encounter any suspicious, inappropriate, or potentially harmful content, please use the "Report" button on the project page to notify us immediately. We take all reports seriously and will review flagged content promptly to maintain the integrity and safety of our platform. By using Context7, you acknowledge that you do so at your own discretion and risk.

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
