# 🚀 Startup Guide for SevDesk Node

**Version:** 2.4.1  
**Updated:** 2025-07-14  
**Status:** Production Ready

The `npm start` command provides a fully automated solution for development with the SevDesk node.

## ✨ Features

The startup script automatically performs the following steps:

1. **🔨 Node Build** - Compiles the TypeScript code
2. **🐳 Docker Management** - Checks and manages Docker containers
3. **📊 Workflow Management** - Backup, delete and upload workflows
4. **🌐 Browser Start** - Opens n8n automatically in browser

## 🎯 Usage

### Quick Start

```bash
# One-time: Create .env file
cp ENV-TEMPLATE.md .env
# Edit .env file with your values

# Start n8n
npm start
```

### Complete Workflow

```bash
# 1. Install dependencies
npm install

# 2. Configure .env (see ENV-TEMPLATE.md)
# 3. Start SevDesk node
npm start
```

## 🔄 Detailed Process

### Step 1: Build

```
✅ 1. Create build...
   → npm run build
   → Compile TypeScript
   → Create icons
```

### Step 2: Docker Check

```
✅ 2. Check Docker status...
   → Docker available?
   → Check container status
```

### Step 3: Container Management

```
❓ 3. n8n container already running...
   → Stop container? (y/N)
   → Automatic stop if selected
```

### Step 4: Container Start

```
✅ 4. Start Docker container...
   → docker-compose up -d
   → Automatically install SevDesk node
   → Wait for n8n (up to 60 seconds)
```

### Step 5: Workflow Analysis

```
✅ 5. Check existing workflows...
   → n8n API connection
   → Number of existing workflows
```

### Step 6: Backup (if workflows exist)

```
❓ 6. Create backup of existing workflows? (Y/n)
   → Backup in ./backup/backup-TIMESTAMP/ folder
   → Each workflow as separate JSON file
```

### Step 7: Deletion (if workflows exist)

```
❓ 8. Delete existing workflows? (y/N)
   → Delete all workflows via API
   → Prepare clean test environment
```

### Step 8: Test Workflows

```
✅ 9. Search test workflows...
   → Scan ./test-workflows/ directory
   → Upload JSON files directly OR
   → Offer directories for selection
```

### Step 9: Browser Start

```
✅ 11. Open n8n in browser...
   → Automatically open http://localhost:5678
   → Ready to use immediately!
```

## 📁 Test Workflow Management

### Automatic Detection

The script searches in `./test-workflows/` for:

1. **Direct JSON files:**

   ```
   test-workflows/
   ├── workflow1.json
   ├── workflow2.json
   └── workflow3.json
   ```

2. **Directories with workflows:**
   ```
   test-workflows/
   ├── 01-Belegerfassung/
   │   ├── erfassung.json
   │   └── verarbeitung.json
   ├── 02-Rechnungsstellung/
   │   └── erstellung.json
   └── 03-Mahnwesen/
       └── versand.json
   ```

### Interactive Selection

For multiple directories:

```
📁 Available Workflow Directories:
1. 01-Belegerfassung (2 Workflows)
2. 02-Rechnungsstellung (1 Workflow)
3. 03-Mahnwesen (1 Workflow)
4. All Directories
0. Cancel

❓ Choose a directory (number):
```

## 🔑 API Key Configuration

### First Use (without API Key)

1. **Script starts n8n** without workflow management
2. **Open n8n:** http://localhost:5678
3. **Create API key:**
   - Settings → API → Create API Key
4. **Add key to .env:**
   ```bash
   N8N_API_KEY=your-new-api-key
   ```
5. **Start script again:** `npm start`

### With API Key

All workflow management functions available:

- ✅ Create backup
- ✅ Delete workflows
- ✅ Upload test workflows
- ✅ Full automation

## 🛠️ Error Handling

### Common Issues

**Docker not available:**

```
❌ Docker is not available. Please start Docker.
```

**Solution:** Start Docker Desktop

**n8n not reachable:**

```
❌ n8n is not reachable
```

**Solution:**

- Check container logs: `docker-compose logs -f`
- Restart container: `docker-compose restart`

**API key missing:**

```
⚠️ N8N_API_KEY is not set
```

**Solution:** Create API key in n8n and add to .env

**Build error:**

```
❌ Error during build
```

**Solution:**

- Install dependencies: `npm install`
- Fix TypeScript errors

## 🔧 Advanced Configuration

### .env Variables

```bash
# Basic configuration
N8N_HOST=localhost          # n8n hostname
N8N_PORT=5678              # n8n port
N8N_PROTOCOL=http          # http or https
NODE_ENV=development       # development or production

# API configuration
N8N_API_KEY=...            # n8n API key
N8N_API_URL=...            # n8n API URL

# Docker configuration
INSTALL_LOCAL_SEVDESK_NODE=true    # Install SevDesk node
SEVDESK_NODE_PATH=/sevdesk-node    # Container path
```

### Production Environment

```bash
N8N_HOST=yourdomain.com
N8N_PORT=443
N8N_PROTOCOL=https
NODE_ENV=production
N8N_API_URL=https://yourdomain.com/api/v1
```

## 📊 Backup System

### Automatic Backups

- **Folder:** `./backup/backup-YYYY-MM-DDTHH-mm-ss/`
- **Format:** `WorkflowName_ID.json`
- **Content:** Complete workflow definition

### Backup Structure

```
backup/
├── backup-2024-01-15T10-30-45/
│   ├── Belegerfassung_123.json
│   ├── Rechnungsstellung_124.json
│   └── Mahnwesen_125.json
└── backup-2024-01-15T14-20-10/
    └── Test_Workflow_126.json
```

## 🎯 Developer Workflow

### Typical Development Process

1. **Change code** in `nodes/` or `credentials/`
2. **Run npm start**
3. **Automatically:** Build, Docker update, test workflows
4. **Test** in n8n browser
5. **Repeat**

### Quick Iteration

For pure code changes without workflow management:

```bash
# Build and Docker restart only
npm run build && docker-compose restart
```

## 🚀 CI/CD Integration

The startup script can also be used in automated environments:

```bash
# Non-interactive mode (set environment variables)
export NON_INTERACTIVE=true
npm start
```

**Note:** Non-interactive mode is not yet implemented, but can be added if needed.

## 📈 Performance Tips

1. **Docker Volume Cache:** Node modules are cached
2. **Incremental Builds:** Only compile changed files
3. **Parallel Uploads:** Multiple workflows simultaneously
4. **Container Reuse:** Use existing containers

## 🎉 Success Message

On successful start you will see:

```
🎉 Start process completed!
✅ SevDesk node is available
🌐 Browser opened: http://localhost:5678
```

The SevDesk node is now ready for use! 🚀
