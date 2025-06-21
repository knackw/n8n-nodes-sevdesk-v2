# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Comprehensive test suite with Jest
- CI/CD pipeline with GitHub Actions
- Husky git hooks for code quality
- Lint-staged for automatic formatting
- Better error handling and validation
- API v2 support with backward compatibility

### Changed
- Improved credential management
- Enhanced documentation
- Better TypeScript configuration

### Fixed
- Various minor bugs and improvements

## [0.4.0] - 2024-01-XX

### Added
- **API v2 Support**: Full support for SevDesk API v2 with backward compatibility
- **Dynamic Base URL**: Base URL now configurable via credentials
- **Enhanced Credentials**: API version selection and better descriptions
- **Improved Package.json**: Better keywords, scripts, and metadata
- **Comprehensive Testing**: Jest test suite with coverage reporting
- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Code Quality Tools**: Husky, lint-staged, and improved linting
- **Better Documentation**: Enhanced README with examples and troubleshooting

### Changed
- **Credential Management**: Added API version selection (v1/v2)
- **Error Handling**: Improved error messages and validation
- **Build Process**: Added clean scripts and better build pipeline
- **Development Experience**: Better development tools and scripts

### Fixed
- **TypeScript Issues**: Resolved various TypeScript compilation issues
- **Linting Errors**: Fixed ESLint and Prettier configuration
- **Documentation**: Updated and improved all documentation

## [0.3.0] - 2023-XX-XX

### Added
- **Credit Notes**: Full CRUD operations for credit notes
- **Export Functionality**: Data export capabilities
- **Layout Management**: Document layout operations
- **Tag Relations**: Enhanced tag relationship management
- **Report Generation**: PDF report functionality

### Changed
- **API Coverage**: Extended support for more SevDesk entities
- **Performance**: Improved response handling and data processing

## [0.2.0] - 2023-XX-XX

### Added
- **Comprehensive Resource Coverage**: All major SevDesk entities
- **Batch Operations**: Efficient data processing for multiple items
- **File Upload/Download**: Support for document attachments
- **Advanced Filtering**: Enhanced search and filter capabilities

### Changed
- **Architecture**: Improved node structure and organization
- **Error Handling**: Better error messages and recovery

## [0.1.0] - 2023-XX-XX

### Added
- **Initial Release**: Basic SevDesk integration
- **Contact Management**: CRUD operations for contacts
- **Invoice Operations**: Basic invoice functionality
- **Authentication**: API key-based authentication

---

## Migration Guide

### From v0.3.0 to v0.4.0

1. **Update Credentials**: 
   - Existing credentials will continue to work with v1 API
   - For new implementations, select v2 API in credentials
   - No breaking changes for existing workflows

2. **API Version Selection**:
   - Choose API version in credentials (v1 or v2)
   - v2 is recommended for new implementations
   - v1 remains supported for backward compatibility

3. **Testing**:
   - Run `npm test` to ensure everything works correctly
   - Check coverage with `npm run test:coverage`

### From v0.2.0 to v0.3.0

- No breaking changes
- All existing workflows continue to work
- New features are additive only

### From v0.1.0 to v0.2.0

- Minor API changes in some operations
- Update field names if using custom workflows
- Check documentation for specific changes

---

## Contributing

When contributing to this project, please:

1. Follow the existing code style
2. Add tests for new features
3. Update documentation as needed
4. Follow the commit message format
5. Ensure all tests pass before submitting

## Support

For support and questions:
- [GitHub Issues](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- [n8n Community](https://community.n8n.io/)
- [SevDesk API Documentation](https://api.sevdesk.de/) 