# ⚡ SevDesk-Node Quick Reference

## 🚀 Start Commands

```bash
# 🎯 MAIN COMMAND - Everything automatic
npm start

# 🔧 Development
npm run build          # Compile only
npm run dev            # Watch mode
npm test              # Run tests

# 🐳 Docker
docker-compose up -d   # Start containers
docker-compose down    # Stop containers
docker-compose logs -f # Show logs
docker-compose restart # Restart
```

## ⚙️ Configuration

### Create .env file
```bash
# Copy template
cp ENV-TEMPLATE.md .env

# Important variables:
N8N_HOST=localhost
N8N_PORT=5678
N8N_API_KEY=your-api-key-here
INSTALL_LOCAL_SEVDESK_NODE=true
```

### Create API Key
1. Open n8n: http://localhost:5678
2. Settings → API → Create API Key
3. Add key to .env: `N8N_API_KEY=your-key`

## 📁 Directory Structure

```
├── .env                     # Configuration (create this!)
├── package.json             # npm start available
├── docker-compose.yml       # Docker configuration
├── tools/start-n8n.js     # Start script
├── test-workflows/          # Test workflows
├── backup/                  # Workflow backups
├── nodes/SevDesk/          # SevDesk node code
└── credentials/            # Credential definition
```

## 🔄 Typical Workflow

### 1. Initial Setup
```bash
git clone <repository>
cd n8n-nodes-sevdesk-v2
npm install
cp ENV-TEMPLATE.md .env     # Edit .env!
npm start                   # Automatic start
```

### 2. Development
```bash
# Change code in nodes/ or credentials/
npm start                   # Automatic build & restart
```

### 3. Manage Test Workflows
```bash
npm start                   # Interactive workflow selection
# Or manually:
# - Backup: Yes/No
# - Delete: Yes/No  
# - Upload: Choose directory
```

## 📊 Workflow Management

### Automatic Detection
- **JSON files** in `test-workflows/` → Direct upload
- **Directories** with workflows → Interactive selection

### Backup System
- **Automatic** before each upload (optional)
- **Path:** `./backup/backup-YYYY-MM-DDTHH-mm-ss/`
- **Format:** `WorkflowName_ID.json`

### Directory Selection
```
📁 Available Workflow Directories:
1. 01-Belegerfassung (2 Workflows)
2. 02-Rechnungsstellung (1 Workflow) 
3. 03-Mahnwesen (1 Workflow)
4. All Directories
0. Cancel
```

## 🔧 SevDesk Node Configuration

### Credentials (in n8n)
- **API Key:** Your SevDesk API key
- **API Version:** v2 (recommended)

### Supported Resources
- Contact (Contacts)
- Invoice (Invoices)
- Voucher (Vouchers)
- Order (Orders)
- Part (Parts)
- CheckAccount (Bank Accounts)
- Tag (Tags)
- Report (Reports)
- +more...

## 🚨 Troubleshooting

### Docker Issues
```bash
# Check Docker
docker --version
docker-compose --version

# Container status
docker-compose ps
docker-compose logs -f n8n
```

### n8n Issues
```bash
# Check availability
curl http://localhost:5678/healthz

# Restart container
docker-compose restart
```

### Build Issues
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check TypeScript errors
npm run build
```

### API Issues
```bash
# Check API key
# - In n8n: Settings → API
# - In .env: N8N_API_KEY=...

# Test API access
curl -H "X-N8N-API-KEY: your-key" http://localhost:5678/api/v1/workflows
```

## 📋 Checklist for New Users

- [ ] Repository cloned
- [ ] `npm install` executed
- [ ] `.env` file created (from ENV-TEMPLATE.md)
- [ ] Docker Desktop started
- [ ] `npm start` executed
- [ ] n8n opened (http://localhost:5678)
- [ ] API key created (Settings → API)
- [ ] API key added to .env
- [ ] `npm start` again for full functionality
- [ ] SevDesk node available in workflow ✅

## 🎯 Helpful Links

- **Startup Guide:** [STARTUP-GUIDE.md](STARTUP-GUIDE.md)
- **Docker Setup:** [DOCKER.md](DOCKER.md)
- **Environment Variables:** [ENV-TEMPLATE.md](ENV-TEMPLATE.md)
- **Tests:** [tests/](tests/)
- **Workflows:** [test-workflows/](test-workflows/)

## 🆘 Support

For issues:
1. **Check logs:** `docker-compose logs -f`
2. **Restart container:** `docker-compose restart`  
3. **Issues:** GitHub Issues
4. **Community:** n8n Community Forum

**Happy Coding! 🚀**
