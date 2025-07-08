# 🔧 Umgebungsvariablen-Konfiguration

Erstellen Sie eine `.env`-Datei im Root-Verzeichnis mit folgenden Variablen:

## 📋 .env Vorlage

```bash
# n8n Docker-Container Konfiguration für SevDesk-Node

# n8n Basis Konfiguration
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http
NODE_ENV=development

# n8n API Konfiguration für Workflow-Management
# WICHTIG: Nach dem ersten Start von n8n einen API-Key erstellen!
# 1. Öffnen Sie n8n: http://localhost:5678
# 2. Gehen Sie zu Settings → API
# 3. Erstellen Sie einen neuen API-Key
# 4. Tragen Sie den Key hier ein:
N8N_API_KEY=your-api-key-here
N8N_API_URL=http://localhost:5678/api/v1

# SevDesk-Node Installation
INSTALL_LOCAL_SEVDESK_NODE=true
SEVDESK_NODE_PATH=/sevdesk-node

# Community Packages (optional - standardmäßig installiert)
N8N_COMMUNITY_PACKAGES=n8n-nodes-base,n8n-nodes-advanced-flow-blocks,n8n-nodes-puppeteer,n8n-nodes-firecrawl,n8n-nodes-elevenlabs,@brave/n8n-nodes-brave-search

# Beispiel für produktive Umgebung:
# N8N_HOST=ihredomain.de
# N8N_PORT=443
# N8N_PROTOCOL=https
# NODE_ENV=production
# N8N_API_URL=https://ihredomain.de/api/v1
```

## 🚀 Schnellstart

1. **Erstellen Sie die .env-Datei:**
   ```bash
   cp ENV-TEMPLATE.md .env
   # Bearbeiten Sie die .env-Datei mit Ihren Werten
   ```

2. **Starten Sie n8n:**
   ```bash
   npm start
   ```

3. **API-Key erstellen (beim ersten Start):**
   - Das Skript startet n8n ohne API-Key
   - Öffnen Sie http://localhost:5678
   - Gehen Sie zu Settings → API → Create API Key
   - Kopieren Sie den Key in Ihre .env-Datei: `N8N_API_KEY=ihr-api-key`
   - Starten Sie das Skript erneut: `npm start`

## 🔑 API-Key konfigurieren

Der API-Key wird für folgende Funktionen benötigt:

- ✅ **Workflow-Backup erstellen**
- ✅ **Vorhandene Workflows löschen** 
- ✅ **Test-Workflows hochladen**
- ✅ **Workflow-Verwaltung**

**Ohne API-Key:**
- ✅ n8n startet normal
- ✅ SevDesk-Node ist verfügbar
- ❌ Keine automatische Workflow-Verwaltung

## 🛠️ Fehlerbehandlung

**Problem:** `N8N_API_KEY ist nicht gesetzt`
- **Lösung:** Erstellen Sie einen API-Key in n8n und tragen Sie ihn in die .env ein

**Problem:** `Fehler beim Abrufen der Workflows`
- **Lösung:** Prüfen Sie die n8n-URL und den API-Key

**Problem:** `Docker ist nicht verfügbar`
- **Lösung:** Starten Sie Docker Desktop oder Docker-Service

## 📁 Verzeichnisstruktur

```
├── .env                    # Ihre Konfiguration (nicht in Git!)
├── ENV-TEMPLATE.md         # Diese Vorlage
├── scripts/
│   └── tools/start-n8n.js       # Start-Skript
├── test-workflows/         # Test-Workflows für Upload
└── backup/                 # Workflow-Backups (wird erstellt)
```

## 🔒 Sicherheit

- Fügen Sie `.env` zu Ihrer `.gitignore` hinzu
- Teilen Sie niemals Ihre API-Keys
- Verwenden Sie verschiedene Keys für Development/Production 