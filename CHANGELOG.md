# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [2.4.1] - 2025-07-14

### 🔧 Technical Improvements

- **Documentation Updates:** Comprehensive documentation overhaul across all files
- **Project Structure:** Improved organization and clarity of project documentation
- **Development Tools:** Enhanced tooling and configuration management

## [2.4.0] - 2025-07-14

### 🚀 Major Feature Enhancements

#### 📧 Advanced Email & Template System

- **Email Template System:** Added comprehensive template support for invoice email sending
  - 5 predefined templates: Standard, Reminder, Final Notice, Payment Confirmation, Custom
  - Placeholder support: `{{invoiceNumber}}`, `{{companyName}}`, `{{contactName}}`, `{{amount}}`, `{{dueDate}}`
  - Enhanced `sendByEmail` operation with conditional template/manual mode
- **Extended Send Types:** Added 8 delivery methods with tracking support
  - Print, Email (VMail), Fax (VMSC), Standard Post (VP), Registered Post (VPR)
  - Express (VE), Priority (VZ), Digital (VD) delivery options
- **Advanced markAsSent Operation:** Enhanced with tracking codes, send costs, and detailed metadata

#### 📄 Professional File Handling

- **Enhanced PDF Export:** Advanced customization options for invoice PDFs
  - 5 templates: Default, Standard, Modern, Classic, Minimal
  - Multi-language support: German, English, French, Spanish, Italian
  - Letter paper format, draft mode with watermark
- **E-Invoice XML Export:** Comprehensive e-invoicing standards support
  - 5 formats: XRechnung, ZUGFeRD, FacturX, UBL, Standard
  - Version control (1.0, 2.0, 2.1, 3.0) and schema validation
  - Attachment integration for compliant e-invoicing
- **Smart Document Upload:** Enhanced voucher file handling
  - OCR integration for text extraction
  - Document categorization system (Invoice, Receipt, Credit Note, Contract, Other)
  - MIME type detection and file size monitoring

#### 🔧 Advanced Order-to-Invoice Conversion

- **Enhanced createInvoice Operation:** Professional invoice generation from orders
  - Invoice date, delivery date, and status configuration
  - Small business and tax rate options
  - Dunning level configuration (4 levels: No Dunning, First Reminder, Second Reminder, Final Notice)

### 🔒 Enhanced Error Handling & Validation

#### 📋 Comprehensive Error Management

- **Resource-Specific Error Classes:** Specialized error handling for each operation type
  - `SevDeskContactError`, `SevDeskInvoiceError`, `SevDeskOrderError`, `SevDeskVoucherError`
  - `SevDeskBatchError`, `SevDeskFileError` with operation-specific guidance
- **Enhanced Error Factory:** Intelligent error creation with context-aware suggestions
- **Security Features:** Advanced error message sanitization for production safety

#### ✅ Strengthened Field Validation

- **Required Field Enforcement:** Critical fields now properly validated
  - Contact: `name` and `customerNumber` required
  - Invoice: `invoiceDate` required (contact was already required)
  - Order: `contactId` and `orderDate` required
  - Voucher: `voucherDate` required

### 📚 Enhanced Documentation & API Integration

#### 🔄 Batch Operations Framework

- **Comprehensive Batch Documentation:** Professional bulk operation guidelines
  - Best practices for batch sizes (25-50 operations optimal)
  - Error handling strategies for partial failures
  - Performance optimization patterns
- **Rate Limiting Intelligence:** Advanced request management
  - Account-tier specific limits (Standard: 1000/h, Premium: 5000/h, Professional: 10000/h)
  - Exponential backoff with retry strategies
  - Header monitoring and peak-time optimization

#### 📊 Complete Resource Coverage

- **InvoicePos Resource:** Full CRUD operations for invoice line items
  - Create, Get, Get Many, Update, Delete operations
  - Comprehensive field support for quantity, price, name, position numbers
  - Advanced filtering by invoice ID and part ID

### 🔧 Technical Infrastructure Improvements

#### 🏗️ Code Quality & Architecture

- **Resource Registry Consistency:** Fixed unity/unit naming inconsistency across all files
- **Version Synchronization:** All documentation updated to v2.4.0
- **Status Label Accuracy:** Corrected "In Development" labels to "Fully Supported (Extended)"

### 📖 Documentation Updates

- **API Reference:** Enhanced with batch operations, rate limiting, and file handling examples
- **User Manual:** Updated feature status and version information
- **Error Handling Guide:** Comprehensive error management documentation

## [2.2.1] - 2024-12-19

### 🔄 API Compliance & Compatibility Updates

- **SevDesk API v2.0 Tax System Migration:** Migrated from deprecated `taxType` to modern `taxRule` system
  - Updated `InvoiceDescription.ts` with comprehensive tax rule options (1-21)
  - Updated `VoucherDescription.ts` with expense-specific tax rules (8-14)
  - Updated `CreditNoteDescription.ts` with sales tax rule options
  - Maintained backward compatibility with deprecated taxType fields
- **Validation Schema Enhancement:** Updated `ValidationSchemas.ts` to support both taxRule and legacy taxType validation
- **n8n@1.101.0 Compatibility:** Removed deprecated `executionOrder: "v1"` settings from test workflows
- **API Resource Completeness:** Verified all 21 SevDesk API resources are fully implemented and current

### 📊 Test Suite & Workflow Updates

- **Test Workflows:** Updated 9 test workflow files for n8n@1.101.0 compatibility
- **Node Type References:** Updated legacy `sevDesk` node type references to `n8n-nodes-sevdesk-v2.sevDesk`
- **Workflow Metadata:** Added n8nVersion metadata to all test workflows

### 🛠️ Technical Improvements

- **Resource Registry:** Confirmed complete coverage of all SevDesk API v2.0 endpoints
- **Error Handling:** Enhanced validation error messages for taxRule system
- **Documentation Consistency:** All documentation reflects standalone v2.0 architecture

### ✅ Validation Results

- **API Coverage:** 100% - All 21 resources from scraped SevDesk API implemented
- **Tax System:** ✅ Fully migrated to taxRule system with backward compatibility
- **n8n Compatibility:** ✅ Compatible with n8n@1.101.0
- **Test Coverage:** ✅ All workflows updated and validated
- **Documentation:** ✅ Complete and consistent

### 🔧 Developer Experience

- **Migration Guide:** Clear upgrade path from taxType to taxRule
- **Validation:** Comprehensive error messages for both systems
- **Examples:** Updated all workflow examples to use new tax system

## [2.2.0] - 2024-12-19

### Added

- **Extended Documentation**: Added comprehensive German documentation
- **Migration Guide**: Detailed migration guide for users
- **Improved Test Workflows**: Extended example workflows for tax advisor export
- **User Manual**: Complete German user manual

### Changed

- **Code Quality**: Improved TypeScript typing and error handling
- **Test Coverage**: Extended test suite with better mock data
- **Documentation Structure**: Reorganized documentation for better user experience

### Fixed

- **Build Stability**: Fixed various build issues
- **Typing**: Fixed TypeScript errors in test utilities
- **Documentation**: Corrected inconsistencies in documentation

## [2.0.0] - 2024-01-15

### 🎉 **Complete Redesign for Maximum Simplicity**

### Removed (Breaking Changes)

- **License Management**: Complete removal of Supabase-based license validation
- **Supabase Integration**: Removal of all external database dependencies
- **AI Integration**: Removal of IONOS AI Hub integration
- **Cloud Storage Integration**: Removal of Google Cloud/Azure/S3 integrations
- **Signal Messaging**: Removal of Signal integration
- **Complex Configuration**: Removal of workflow-specific configuration storage
- **Execute Method**: Migration to declarative node architecture
- **Helper Classes**: LicenseValidator and SupabaseManager removed

### Added

- **Standalone Architecture**: Completely standalone node without external dependencies
- **Simplified Credentials**: Only API key and API version required
- **Docker Integration**: Fully automated development environment with docker-compose
- **Start Script**: One-command setup with `npm start` for complete automation
- **Workflow Management**: Automated backup, upload, and delete functions for test workflows
- **Interactive Selection**: User-friendly directory selection for workflow upload
- **Browser Integration**: Automatic opening of n8n after successful start
- **Extended Test Workflows**: Comprehensive example workflows for all use cases
- **Complete Documentation**: Updated docs for simplified architecture

### Changed

- **Node Architecture**: Migration from programmatic to declarative node implementation
- **Credential Structure**: Reduction from 7 to 2 essential properties (apiKey, apiVersion)
- **Package.json**: Removal of @supabase/supabase-js and other external dependencies
- **Build Process**: Optimization for Docker-based development
- **Error Handling**: Simplification without external error reporting
- **Performance**: Direct API communication without middleware overhead
- **Test Framework**: Focus on core SevDesk functionality

### Fixed

- **TypeScript Errors**: Fixed all compilation errors after architecture simplification
- **Import Issues**: Removal of unused imports and dependencies
- **Docker Setup**: Reliable container configuration for development
- **Test Stability**: Cleanup and simplification of test suite

### Migration from v1.x

**Automatic Migration:**

- Existing workflows continue to work without changes
- SevDesk API calls remain unchanged
- All resources and operations are still available

**Manual Steps:**

1. **Update Credentials**: Remove licenseCode, workflowId, userId, supabaseApiKey, supabaseUrl
2. **Keep Only**: apiKey and apiVersion
3. **Use Docker**: Utilize the new Docker development environment with `npm start`

**No Longer Available:**

- License-based functions (all functions are now freely available)
- Supabase configuration storage (use local n8n configuration)
- AI-assisted functions (implement these in separate nodes if needed)

## [0.4.0] - 2024-01-XX

### Added

- **API v2 Support**: Complete support for SevDesk API v2 with backward compatibility
- **Dynamic Base URL**: Base URL now configurable via credentials
- **Extended Credentials**: API version selection and better descriptions
- **Improved Package.json**: Better keywords, scripts and metadata
- **Comprehensive Tests**: Jest test suite with coverage reporting
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Code Quality Tools**: Husky, lint-staged and improved linting
- **Better Documentation**: Improved README with examples and troubleshooting

### Changed

- **Credential Management**: Added API version selection (v1/v2)
- **Error Handling**: Improved error messages and validation
- **Build Process**: Added clean scripts and better build pipeline
- **Development Experience**: Better development tools and scripts

### Fixed

- **TypeScript Issues**: Fixed various TypeScript compilation problems
- **Linting Errors**: Corrected ESLint and Prettier configuration
- **Documentation**: Updated and improved all documentation

## [0.3.0] - 2023-XX-XX

### Added

- Support for credit notes, exports and layouts
- Improved tag relationship management
- Enhanced report generation

### Changed

- Optimized resource coverage
- Improved error handling

## [0.2.0] - 2023-XX-XX

### Added

- Comprehensive resource coverage
- Implementation of batch operations
- Support for file upload/download

### Changed

- Improved API integration
- Extended documentation

## [0.1.0] - 2023-XX-XX

### Added

- Initial release with basic functionality
- Support for contacts, invoices and vouchers
- Basic API integration
