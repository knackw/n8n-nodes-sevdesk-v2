# 🔧 Environment Configuration

**Version:** 2.4.1  
**Updated:** 2025-07-14

Create a `.env` file in the root directory with the following variables for optimal n8n-nodes-sevdesk-v2 development experience:

## 📋 .env Template

```bash
# n8n SevDesk Node Development Environment

# Node Environment
NODE_ENV=development

# n8n Configuration
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
N8N_API_URL=http://localhost:5678/api/v1

# n8n API Key (optional - create after first n8n start)
# 1. Open n8n: http://localhost:5678
# 2. Go to Settings → API
# 3. Create a new API Key
# 4. Add the key here:
N8N_API_KEY=your-api-key-here

# Debug & Logging
DEBUG=false
LOG_LEVEL=info

# SevDesk Node Development
INSTALL_LOCAL_SEVDESK_NODE=true
SEVDESK_NODE_PATH=/sevdesk-node

# Production Example:
# NODE_ENV=production
# N8N_HOST=yourdomain.com
# N8N_PORT=443
# N8N_PROTOCOL=https
# N8N_API_URL=https://yourdomain.com/api/v1
# DEBUG=false
# LOG_LEVEL=error
```

## 🚀 Quick Start

1. **Create the .env file:**

   ```bash
   cp ENV-TEMPLATE.md .env
   # Edit the .env file with your values
   ```

2. **Start development:**

   ```bash
   npm start
   ```

3. **Create API Key (first start):**
   - Open http://localhost:5678
   - Go to Settings → API → Create API Key
   - Copy the key to your .env file: `N8N_API_KEY=your-api-key`

## 🔑 API Key Configuration

The API key is required for:

- ✅ **Workflow management**
- ✅ **Test workflow uploads**
- ✅ **Automated testing**

**Without API Key:**

- ✅ n8n starts normally
- ✅ SevDesk Node is available
- ❌ No automated workflow management

## 🛠️ Troubleshooting

**Problem:** `N8N_API_KEY is not set`

- **Solution:** Create an API key in n8n and add it to your .env file

**Problem:** `Cannot connect to n8n`

- **Solution:** Check n8n URL and API key configuration

## 📁 Directory Structure

```
├── .env                    # Your configuration (not in Git!)
├── ENV-TEMPLATE.md         # This template
├── tools/
│   └── start-n8n.js       # Start script
├── test-workflows/         # Test workflows
└── backup/                 # Workflow backups (created automatically)
```

## 🔒 Security

- Add `.env` to your `.gitignore`
- Never share your API keys
- Use different keys for development/production
