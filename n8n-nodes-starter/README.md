# n8n Starter Node Template

This is a simplified starter template for creating n8n community nodes, based on the structure of n8n-nodes-sevdesk-v2. It provides a clean, well-documented foundation for building your own n8n integrations.

## 🚀 Features

- **Simple CRUD Operations**: Create, Read, Update, Delete operations
- **API Authentication**: Basic API key authentication pattern
- **Error Handling**: Proper error handling and user feedback
- **TypeScript Support**: Full TypeScript implementation with type safety
- **Code Quality**: ESLint configuration for consistent code style
- **Documentation**: Comprehensive inline documentation and examples

## 📁 Project Structure

```
n8n-nodes-starter/
├── credentials/
│   └── StarterApi.credentials.ts    # API authentication configuration
├── nodes/
│   └── Starter/
│       └── Starter.node.ts          # Main node implementation
├── package.json                     # Node package configuration
├── tsconfig.json                    # TypeScript configuration
├── .eslintrc.js                     # ESLint configuration
├── tools/gulpfile.js                      # Build configuration
└── README.md                        # This file
```

## 🛠️ Getting Started

### Prerequisites

- Node.js >= 18.0.0
- npm (comes with Node.js)
- Basic understanding of TypeScript and n8n

### Installation

1. **Copy this starter template** to your new project directory
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Build the project**:
   ```bash
   npm run build
   ```

### Development

```bash
# Start development mode with file watching
npm run dev

# Build for production
npm run build

# Run linting
npm run lint

# Auto-fix linting issues
npm run lintfix

# Format code
npm run format
```

## 🔧 Customization Guide

### 1. Update Package Information

Edit `package.json`:
- Change `name` to your node package name
- Update `description`, `keywords`, `author`
- Modify the `n8n` section to point to your files

### 2. Customize Credentials

Edit `credentials/StarterApi.credentials.ts`:
- Change the class name and credential name
- Update authentication method (API key, OAuth, etc.)
- Modify credential fields as needed
- Update the test endpoint

### 3. Customize the Node

Edit `nodes/Starter/Starter.node.ts`:
- Change the class name and display name
- Update resources and operations
- Modify the API endpoints
- Add custom logic for your API

### 4. Add Custom Icon (Optional)

- Add your SVG icon to `nodes/Starter/`
- Update the `icon` property in the node description
- The gulpfile will copy it to the dist folder

## 📚 Node Implementation Examples

### Basic API Call Pattern

```typescript
private async makeApiCall(endpoint: string, method: string, data?: any) {
    const options: IHttpRequestOptions = {
        method: method,
        url: endpoint,
        body: data,
    };

    return await this.helpers.httpRequestWithAuthentication.call(
        this, 
        "starterApi", 
        options
    );
}
```

### Adding New Operations

1. Add the operation to the `options` array in the node description
2. Add a case in the `execute` method switch statement
3. Implement the operation method

### Error Handling

The template includes proper error handling:
- API errors are caught and handled gracefully
- Users can choose to continue on failure
- Error messages are returned in the output

## 🔐 Authentication Patterns

### API Key Authentication (Current)

```typescript
authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
        headers: {
            Authorization: "Bearer ={{$credentials.apiKey}}",
        },
    },
};
```

### OAuth2 Authentication (Example)

```typescript
authenticate: IAuthenticateGeneric = {
    type: "oauth2",
    properties: {},
};
```

## 📝 Best Practices

1. **Use TypeScript**: Leverage type safety for better development experience
2. **Handle Errors**: Always implement proper error handling
3. **Document Code**: Add clear comments and documentation
4. **Follow n8n Conventions**: Use n8n naming conventions and patterns
5. **Test Thoroughly**: Test all operations and edge cases
6. **Validate Input**: Validate user input before making API calls

## 🧪 Testing Your Node

1. **Build the project**: `npm run build`
2. **Link to n8n**: 
   ```bash
   # In your node directory
   npm link

   # In your n8n installation directory
   npm link n8n-nodes-starter
   ```
3. **Restart n8n** and look for your node in the node palette

## 📖 Resources

- [n8n Node Development Documentation](https://docs.n8n.io/integrations/creating-nodes/)
- [n8n Community Nodes](https://docs.n8n.io/integrations/community-nodes/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details

## 🆘 Support

If you encounter issues:
1. Check the n8n documentation
2. Review the error logs
3. Ensure all dependencies are installed
4. Verify your API credentials are correct

---

**Happy coding! 🎉**

This starter template provides a solid foundation for building n8n community nodes. Customize it according to your API requirements and follow n8n best practices for the best user experience.
