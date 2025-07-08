# Example: Customizing the Starter Template

This file shows how to customize the starter template for your specific API.

## Example: Creating a GitHub API Node

Here's how you would modify the starter template to create a GitHub API integration:

### 1. Update package.json

```json
{
  "name": "n8n-nodes-github-api",
  "description": "n8n community node for GitHub API integration",
  "keywords": ["n8n-community-node-package", "github", "api", "git"],
  "n8n": {
    "credentials": ["dist/credentials/GitHubApi.credentials.js"],
    "nodes": ["dist/nodes/GitHub/GitHub.node.js"]
  }
}
```

### 2. Update Credentials (credentials/GitHubApi.credentials.ts)

```typescript
export class GitHubApi implements ICredentialType {
  name = "gitHubApi";
  displayName = "GitHub API";
  documentationUrl = "https://docs.github.com/en/rest";
  
  properties: INodeProperties[] = [
    {
      displayName: "Access Token",
      name: "accessToken",
      type: "string",
      typeOptions: { password: true },
      default: "",
      required: true,
      description: "GitHub Personal Access Token",
    },
  ];

  authenticate: IAuthenticateGeneric = {
    type: "generic",
    properties: {
      headers: {
        Authorization: "token ={{$credentials.accessToken}}",
      },
    },
  };

  test: ICredentialTestRequest = {
    request: {
      baseURL: "https://api.github.com",
      url: "/user",
    },
  };
}
```

### 3. Update Node (nodes/GitHub/GitHub.node.ts)

```typescript
export class GitHub implements INodeType {
  description: INodeTypeDescription = {
    displayName: "GitHub",
    name: "gitHub",
    group: ["output"],
    version: 1,
    description: "Interact with GitHub API",
    defaults: { name: "GitHub" },
    inputs: [NodeConnectionType.Main],
    outputs: [NodeConnectionType.Main],
    credentials: [{ name: "gitHubApi", required: true }],
    requestDefaults: {
      baseURL: "https://api.github.com",
      headers: {
        Accept: "application/vnd.github.v3+json",
        "User-Agent": "n8n-github-node",
      },
    },
    properties: [
      {
        displayName: "Resource",
        name: "resource",
        type: "options",
        default: "repository",
        options: [
          { name: "Repository", value: "repository" },
          { name: "Issue", value: "issue" },
          { name: "Pull Request", value: "pullRequest" },
        ],
      },
      // Add more properties...
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Implementation here...
  }
}
```

### 4. Update API Endpoints

Modify the private methods to use GitHub API endpoints:

```typescript
private async getRepository(itemIndex: number) {
  const owner = this.getNodeParameter("owner", itemIndex) as string;
  const repo = this.getNodeParameter("repo", itemIndex) as string;
  
  const options: IHttpRequestOptions = {
    method: "GET",
    url: `/repos/${owner}/${repo}`,
  };

  return await this.helpers.httpRequestWithAuthentication.call(
    this, 
    "gitHubApi", 
    options
  );
}
```

## Tips for Customization

1. **Start Small**: Begin with 1-2 resources and basic operations
2. **Follow API Patterns**: Study your target API's structure and conventions
3. **Add Validation**: Validate required fields and provide helpful error messages
4. **Test Thoroughly**: Test all operations with real API calls
5. **Document Well**: Add clear descriptions for all fields and operations

## Common Patterns

### Pagination
```typescript
private async getAllWithPagination(endpoint: string, itemIndex: number) {
  const limit = this.getNodeParameter("limit", itemIndex, 100) as number;
  let page = 1;
  const allResults = [];

  while (allResults.length < limit) {
    const options: IHttpRequestOptions = {
      method: "GET",
      url: endpoint,
      qs: { page, per_page: Math.min(100, limit - allResults.length) },
    };

    const results = await this.helpers.httpRequestWithAuthentication.call(
      this, "gitHubApi", options
    );

    if (!results || results.length === 0) break;
    allResults.push(...results);
    page++;
  }

  return allResults.slice(0, limit);
}
```

### Error Handling
```typescript
try {
  const response = await this.makeApiCall(endpoint, method, data);
  return response;
} catch (error) {
  if (error.response?.status === 404) {
    throw new NodeOperationError(
      this.getNode(),
      `Resource not found: ${endpoint}`,
      { itemIndex }
    );
  }
  throw error;
}
```

This example shows how to adapt the starter template for any API. The key is to understand your target API's authentication, endpoints, and data structures, then modify the template accordingly.
