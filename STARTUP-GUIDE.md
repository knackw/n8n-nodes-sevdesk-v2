# 🚀 Startup Script for SevDesk Node

The new `npm start` command provides a fully automated solution for development with the SevDesk node.

## ✨ Features

The startup script automatically performs the following steps:

1. **🔨 Node Build** - Compiles the TypeScript code
2. **🐳 Docker Management** - Checks and manages Docker containers  
3. **📊 Workflow Management** - Backup, delete and upload workflows
4. **🌐 Browser Start** - Opens n8n automatically in browser

## 🎯 Usage

### Quick Start

```bash
# One-time: Create .env file (see ENV-TEMPLATE.md)
# Start n8n
npm start
```

## 🔄 Interactive Process

### 1. Build & Docker Start
- ✅ **Compile TypeScript**
- ✅ **Check/start Docker containers**
- ✅ **Automatically install SevDesk node**

### 2. Workflow Management
- 📊 **Analyze existing workflows**
- ❓ **Create backup?** (Y/n)
- ❓ **Delete workflows?** (y/N)

### 3. Load Test Workflows
- 📁 **Automatic directory detection**
- 🎯 **Interactive selection for multiple folders**
- ⬆️ **Upload selected workflows**

### 4. Browser Start
- 🌐 **Automatically open n8n**
- ✅ **SevDesk node immediately available**

## 📁 Test Workflow Structure

The script supports various organizational forms:

### Direct JSON Files
```
test-workflows/
├── workflow1.json
├── workflow2.json
└── workflow3.json
```

### Categorized Directories
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
```
📁 Available Workflow Directories:
1. 01-Belegerfassung (2 Workflows)
2. 02-Rechnungsstellung (1 Workflow)
3. 03-Mahnwesen (1 Workflow)
4. All Directories
0. Cancel

❓ Choose a directory (number): 
```

## 🔑 API Key Setup

### First Use

1. **Start without API key:** `npm start`
2. **n8n opens automatically**
3. **Create API key:** Settings → API → Create API Key
4. **Add key to .env:** `N8N_API_KEY=your-key`
5. **Start again:** `npm start`

**Without API key:** Basic functions available
**With API key:** Complete workflow automation

## 🛠️ Configuration

Create a `.env` file (see `ENV-TEMPLATE.md`):

```bash
# Basic configuration
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http

# API for workflow management
N8N_API_KEY=your-api-key
N8N_API_URL=http://localhost:5678/api/v1

# Docker configuration  
INSTALL_LOCAL_SEVDESK_NODE=true
SEVDESK_NODE_PATH=/sevdesk-node
```

## 📊 Backup System

### Automatic Backups
- **Path:** `./backup/backup-YYYY-MM-DDTHH-mm-ss/`
- **Format:** `WorkflowName_ID.json`
- **Structure:** One folder per backup session

```
backup/
└── backup-2024-01-15T10-30-45/
    ├── Belegerfassung_123.json
    ├── Rechnungsstellung_124.json
    └── Mahnwesen_125.json
```

## 🎯 Developer Workflow

### Typical Iteration
1. **Change code** in `nodes/` or `credentials/`
2. **Run `npm start`**
3. **Automatically:** Build, Docker update, test workflows
4. **Test** in n8n
5. **Repeat**

### Quick Iteration (without workflows)
```bash
npm run build && docker-compose restart
```

## 🚨 Error Handling

### Docker Issues
```
❌ Docker is not available
→ Start Docker Desktop
```

### n8n Connection
```
❌ n8n is not reachable  
→ docker-compose logs -f
→ docker-compose restart
```

### API Access
```
⚠️ N8N_API_KEY is not set
→ Create API key in n8n
→ Add key to .env
```

## ✅ Success Message

On successful start:

```
🎉 Start process completed!
✅ SevDesk node is available  
🌐 Browser opened: http://localhost:5678
```

**The SevDesk node is ready! 🚀**

## 📋 Command Overview

```bash
npm start              # Complete automated start
npm run build          # Compile only
npm run dev            # Development mode with watch
docker-compose up -d   # Start Docker only
docker-compose logs -f # Show container logs
```
