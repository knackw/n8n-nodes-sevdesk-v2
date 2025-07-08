# ⚡ Schnellreferenz SevDesk-Node

## 🚀 Start-Kommandos

```bash
# 🎯 HAUPTKOMMANDO - Alles automatisch
npm start

# 🔧 Entwicklung
npm run build          # Nur kompilieren
npm run dev            # Watch-Modus
npm test              # Tests ausführen

# 🐳 Docker
docker-compose up -d   # Container starten
docker-compose down    # Container stoppen
docker-compose logs -f # Logs anzeigen
docker-compose restart # Neustart
```

## ⚙️ Konfiguration

### .env-Datei erstellen
```bash
# Vorlage kopieren
cp ENV-TEMPLATE.md .env

# Wichtige Variablen:
N8N_HOST=localhost
N8N_PORT=5678
N8N_API_KEY=your-api-key-here
INSTALL_LOCAL_SEVDESK_NODE=true
```

### API-Key erstellen
1. n8n öffnen: http://localhost:5678
2. Settings → API → Create API Key
3. Key in .env eintragen: `N8N_API_KEY=ihr-key`

## 📁 Verzeichnisstruktur

```
├── .env                     # Konfiguration (erstellen!)
├── package.json             # npm start verfügbar
├── docker-compose.yml       # Docker-Konfiguration
├── tools/start-n8n.js       # Start-Skript
├── test-workflows/          # Test-Workflows
├── backup/                  # Workflow-Backups
├── nodes/SevDesk/          # SevDesk-Node Code
└── credentials/            # Credential-Definition
```

## 🔄 Typischer Workflow

### 1. Erste Einrichtung
```bash
git clone <repository>
cd n8n-nodes-sevdesk-v2
npm install
cp ENV-TEMPLATE.md .env     # .env bearbeiten!
npm start                   # Automatischer Start
```

### 2. Entwicklung
```bash
# Code ändern in nodes/ oder credentials/
npm start                   # Automatischer Build & Restart
```

### 3. Test-Workflows verwalten
```bash
npm start                   # Interaktive Workflow-Auswahl
# Oder manuell:
# - Backup: Ja/Nein
# - Löschen: Ja/Nein  
# - Upload: Verzeichnis wählen
```

## 📊 Workflow-Management

### Automatische Erkennung
- **JSON-Dateien** in `test-workflows/` → Direkter Upload
- **Verzeichnisse** mit Workflows → Interaktive Auswahl

### Backup-System
- **Automatisch** vor jedem Upload (optional)
- **Pfad:** `./backup/backup-YYYY-MM-DDTHH-mm-ss/`
- **Format:** `WorkflowName_ID.json`

### Verzeichnis-Auswahl
```
📁 Verfügbare Workflow-Verzeichnisse:
1. 01-Belegerfassung (2 Workflows)
2. 02-Rechnungsstellung (1 Workflow) 
3. 03-Mahnwesen (1 Workflow)
4. Alle Verzeichnisse
0. Abbrechen
```

## 🔧 SevDesk-Node Konfiguration

### Credentials (in n8n)
- **API Key:** Ihr SevDesk API-Schlüssel
- **API Version:** v2 (empfohlen)

### Unterstützte Ressourcen
- Contact (Kontakte)
- Invoice (Rechnungen)
- Voucher (Belege)
- Order (Aufträge)
- Part (Artikel)
- CheckAccount (Bankkonten)
- Tag (Tags)
- Report (Berichte)
- +weitere...

## 🚨 Fehlerbehandlung

### Docker-Probleme
```bash
# Docker prüfen
docker --version
docker-compose --version

# Container-Status
docker-compose ps
docker-compose logs -f n8n
```

### n8n-Probleme
```bash
# Erreichbarkeit prüfen
curl http://localhost:5678/healthz

# Container neustarten
docker-compose restart
```

### Build-Probleme
```bash
# Dependencies reinstallieren
rm -rf node_modules package-lock.json
npm install

# TypeScript-Fehler prüfen
npm run build
```

### API-Probleme
```bash
# API-Key prüfen
# - In n8n: Settings → API
# - In .env: N8N_API_KEY=...

# API-Zugriff testen
curl -H "X-N8N-API-KEY: your-key" http://localhost:5678/api/v1/workflows
```

## 📋 Checkliste für neue Nutzer

- [ ] Repository geklont
- [ ] `npm install` ausgeführt
- [ ] `.env`-Datei erstellt (aus ENV-TEMPLATE.md)
- [ ] Docker Desktop gestartet
- [ ] `npm start` ausgeführt
- [ ] n8n geöffnet (http://localhost:5678)
- [ ] API-Key erstellt (Settings → API)
- [ ] API-Key in .env eingetragen
- [ ] `npm start` erneut für volle Funktionalität
- [ ] SevDesk-Node im Workflow verfügbar ✅

## 🎯 Hilfreiche Links

- **Start-Anleitung:** [STARTUP-GUIDE.md](STARTUP-GUIDE.md)
- **Docker-Setup:** [DOCKER.md](DOCKER.md)
- **Umgebungsvariablen:** [ENV-TEMPLATE.md](ENV-TEMPLATE.md)
- **Tests:** [tests/](tests/)
- **Workflows:** [test-workflows/](test-workflows/)

## 🆘 Support

Bei Problemen:
1. **Logs prüfen:** `docker-compose logs -f`
2. **Container neustarten:** `docker-compose restart`  
3. **Issues:** GitHub Issues
4. **Community:** n8n Community Forum

**Happy Coding! 🚀** 