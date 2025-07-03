# n8n-nodes-sevdesk-v2 Development Guidelines

## Project Overview

This is an n8n community node for integrating with the SevDesk v2 API. SevDesk is a German accounting tool, and this node enables workflow automation for accounting processes, invoice management, contact handling, and more.

## Build & Configuration Instructions

### Prerequisites
- Node.js >= 18.0.0
- npm (comes with Node.js)
- TypeScript knowledge
- Basic understanding of n8n workflow automation

### Initial Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Build the project: `npm run build`

### Development Workflow
```bash
# Start development mode with file watching
npm run dev

# Build for production
npm run build

# Clean build artifacts
npm run clean

# Full rebuild
npm run prebuild && npm run build
```

### Build Configuration Details

**TypeScript Configuration (`tsconfig.json`)**:
- Target: ES2020
- Module: CommonJS
- Strict mode enabled
- Output directory: `./dist/`
- Includes: `credentials/**/*`, `nodes/**/*`, `package.json`

**Key Build Scripts**:
- `build`: Compiles TypeScript and processes icons with Gulp
- `dev`: Runs TypeScript compiler in watch mode
- `prebuild`: Automatically runs clean before build
- `clean`: Removes dist directory

## Testing Information

### Test Framework Setup
- **Framework**: Jest with TypeScript support (`ts-jest`)
- **Test Environment**: Node.js
- **Test Location**: `tests/` directory
- **Coverage**: Configured for `nodes/**/*.ts` and `credentials/**/*.ts`

### Running Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

### Test Structure Example
The project includes a comprehensive test utility (`tests/test-utils.ts`) with:
- `TestDataFactory` for creating mock data
- Mock credentials, contacts, invoices, and workflow settings
- Consistent test data patterns for SevDesk API responses

### Adding New Tests
1. Create test files in `tests/` directory with `.test.ts` extension
2. Use `TestDataFactory` for consistent mock data
3. Follow the existing pattern in `tests/simple-demo.test.ts`
4. Test both success and error scenarios
5. Mock external API calls appropriately

### Verified Working Test Example
```typescript
import { TestDataFactory } from './test-utils';

describe('Your Feature', () => {
  it('should create mock credentials', () => {
    const credentials = TestDataFactory.createMockCredentials();
    expect(credentials.apiKey).toBe('test-api-key-12345');
  });
});
```

## Code Style & Quality Guidelines

### ESLint Configuration
- Uses `@typescript-eslint/parser`
- Extends `plugin:n8n-nodes-base/community` for package.json
- Extends `plugin:n8n-nodes-base/credentials` for credential files
- Extends `plugin:n8n-nodes-base/nodes` for node files
- Ignores: `.eslintrc.js`, `**/*.js`, `**/node_modules/**`, `**/dist/**`

### Code Formatting
```bash
# Format code with Prettier
npm run format

# Run ESLint
npm run lint

# Auto-fix ESLint issues
npm run lintfix
```

### Pre-commit Hooks
- **Husky**: Configured for Git hooks
- **lint-staged**: Runs ESLint and Prettier on staged files
- Automatically formats `.ts`, `.json`, and `.md` files

### TypeScript Best Practices
- Use strict type checking
- Leverage ES2020+ features
- Implement proper error handling with try-catch
- Use async/await for asynchronous operations
- Define interfaces for API responses
- Use proper typing for n8n interfaces (`IExecuteFunctions`, `INodeExecutionData`, etc.)

## n8n Node Development Specifics

### Project Structure
```
├── credentials/           # API credential definitions
├── nodes/                # Node implementations
├── dist/                 # Compiled output
├── tests/                # Test files
├── documentation/        # Project documentation
└── package.json          # n8n node configuration
```

### n8n Configuration (`package.json`)
```json
{
  "n8n": {
    "n8nNodesApiVersion": 1,
    "credentials": ["dist/credentials/SevDeskApi.credentials.js"],
    "nodes": ["dist/nodes/SevDesk/SevDesk.node.js"]
  }
}
```

### Development Commands
```bash
# Test with interactive n8n workflow manager
npm run test:n8n-node

# Start development environment
npm start

# Restart Docker container (if using Docker setup)
npm run restart:docker
```

## Docker Integration

The project supports Docker-based development:
- Docker container management via npm scripts
- Isolated development environment
- Consistent testing across different systems

## API Integration Guidelines

### SevDesk API Specifics
- API Version: v2
- Authentication: API Key + License Code
- Base URL pattern for German accounting API
- Rate limiting considerations
- Error handling for German business logic

### Error Handling Patterns
- Implement retry logic for transient failures
- Handle API rate limits gracefully
- Provide meaningful error messages in German/English
- Log errors appropriately for debugging

## Dependencies Management

### Production Dependencies
- `axios`: HTTP client for API requests

### Development Dependencies
- TypeScript ecosystem (`typescript`, `@types/*`)
- Testing framework (`jest`, `ts-jest`, `@faker-js/faker`)
- Code quality (`eslint`, `prettier`, `husky`, `lint-staged`)
- Build tools (`gulp`, `rimraf`)
- n8n development (`n8n-core`, `n8n-nodes-base`, `n8n-workflow`)

## Troubleshooting Common Issues

### TypeScript Compilation Issues
- Ensure `tsconfig.json` is properly configured
- Check for missing type definitions
- Verify import paths are correct

### Test Failures
- Ensure all dependencies are installed
- Check that mock data matches expected API responses
- Verify test environment setup

### Build Issues
- Run `npm run clean` before rebuilding
- Check for TypeScript errors
- Ensure all required files are included in build

## Contributing Guidelines

1. Follow the established code style (ESLint + Prettier)
2. Write tests for new features
3. Update documentation when adding new functionality
4. Use conventional commit messages
5. Ensure all tests pass before submitting changes

## Performance Considerations

- Implement efficient API request batching
- Handle large datasets with pagination
- Use appropriate caching strategies
- Monitor memory usage for large operations
- Implement proper error recovery mechanisms

---

*This document should be updated whenever significant changes are made to the build process, testing setup, or development workflow.*
