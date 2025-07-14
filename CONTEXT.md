# Project Overview and Goals

The n8n-nodes-sevdesk-v2 project is a professional n8n Community Node implementation for direct integration with the SevDesk API (Version 2.0). It enables complete automation of accounting and invoicing processes through n8n workflows. The goal is to provide simple, reliable and comprehensive integration with all important SevDesk functionalities, without external dependencies or complex configurations.

**Version:** 2.4.1  
**Status:** Production Ready  
**API Compatibility:** SevDesk API v2.0  
**n8n Compatibility:** 1.101.1+

# Technologies and Libraries Used

- **TypeScript**: Main programming language for type-safe development
- **n8n-workflow**: Core library for n8n node development
- **n8n-core**: Advanced n8n functionalities for node implementation
- **SevDesk API v2**: REST API for accounting and invoice management
- **Node.js**: Runtime environment for JavaScript/TypeScript
- **Jest**: Testing framework for unit and integration tests
- **HTTP/HTTPS**: Direct API communication with SevDesk services
- **JSON**: Data format for API communication and configuration
- **Docker**: Containerized development environment

# Project Structure and Directory Layout

- **credentials/**: SevDesk API authentication configurations (API key and version only)
- **nodes/**: Main implementation of the SevDesk node
  - **SevDesk/**: Node implementation and descriptions
    - **descriptions/**: Field and operation definitions for all resources
    - **SevDesk.node.ts**: Main node implementation (declarative)
- **tests/**: Jest tests for node and credential functionalities
- **scripts/**: Automation scripts for development and deployment
  - **tools/start-n8n.js**: Fully automated setup with Docker and workflow management
- **test-workflows/**: Pre-built workflow examples for various use cases
- **docker-compose.yml**: Docker configuration for development environment
- **package.json**: NPM package definition with minimal dependencies
- **tsconfig.json**: TypeScript configuration

# Features and Main Logic

- **Direct SevDesk API Integration**: Complete integration with SevDesk API v2 without middleware
- **Invoice Management**: Creation, editing and management of invoices with PDF generation
- **Contact Management**: Comprehensive management of customers and suppliers
- **Product Management**: Management of articles and services with inventory tracking
- **Document Management**: Automated document capture and processing
- **Banking**: Integration of bank accounts and transactions
- **Export Functions**: Data export in various formats
- **Credential Management**: Simple and secure management of API keys
- **Error Handling**: Robust error handling with automatic retry mechanisms
- **Docker Integration**: Fully automated development environment
- **Workflow Automation**: Advanced start scripts with backup and upload functionality

# Code Styles and Conventions Used

- **TypeScript Strict Mode**: Complete typing with strict compiler options
- **n8n Community Standards**: Adherence to official n8n Community Node Guidelines
- **Declarative Node Architecture**: Modern n8n node implementation without execute method
- **Modular Architecture**: Separation of node logic, descriptions and helper functions
- **API-First Design**: Structure based on SevDesk API endpoints
- **Defensive Programming**: Comprehensive validation and error handling
- **Standalone Design**: No external dependencies or complex configurations

# Dependencies and Interfaces

- **SevDesk API v2**: REST API for all accounting functionalities
- **n8n-workflow**: Core library for n8n node development
- **n8n-core**: Advanced n8n functionalities
- **HTTP Client**: For direct API communication with SevDesk
- **Authentication**: API key-based authentication (simplified)
- **JSON Processing**: Processing of API responses and requests
- **Docker**: Containerized development and test environment

# Best Practices

- **Code Organization**:

  - Clear separation of node implementation and descriptions
  - Modular structure for different SevDesk functionalities
  - Consistent naming conventions for all operations
  - Declarative node definition for better performance

- **Security**:

  - Secure credential management with n8n standards
  - Validation of all API inputs
  - Protection against injection attacks
  - Secure handling of authentication data
  - Rate limiting for API requests

- **Performance**:

  - Efficient API calls with retry mechanisms
  - Optimized data structures for API responses
  - Batch operations for large datasets
  - Direct API communication without middleware overhead

- **Maintainability**:

  - Comprehensive TypeScript typing for all API interfaces
  - Automated tests for all node functionalities
  - Clear documentation of all API integrations
  - Versioning of API changes
  - Comprehensive error logging for debugging
  - Regular updates for API compatibility
  - Docker-based development environment for consistency

- **Developer Experience**:
  - One-command setup with `npm start`
  - Automated workflow management (backup, upload, delete)
  - Interactive test workflow selection
  - Fully automated Docker container management
  - Browser integration for immediate access to n8n
