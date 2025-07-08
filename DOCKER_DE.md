# 🐳 Docker Setup für SevDesk-Node

Dieses Dokument erklärt, wie Sie den SevDesk-Node mit Docker verwenden.

## 🚀 Schnellstart

1. **Repository klonen:**
   ```bash
   git clone <repository-url>
   cd n8n-nodes-sevdesk-v2
   ```

2. **Docker-Container starten:**
   ```bash
   docker-compose up -d
   ```

3. **n8n öffnen:**
   - Öffnen Sie http://localhost:5678 in Ihrem Browser
   - Der SevDesk-Node ist automatisch verfügbar!

## ⚙️ Konfiguration

### Umgebungsvariablen

Sie können die folgenden Umgebungsvariablen in der `docker-compose.yml` anpassen:

```yaml
environment:
  # n8n Basis-Konfiguration
  - N8N_HOST=localhost              # Ihr Hostname
  - N8N_PORT=5678                   # Port für n8n
  - N8N_PROTOCOL=http               # http oder https
  - NODE_ENV=development            # development oder production
  
  # SevDesk-Node Konfiguration
  - INSTALL_LOCAL_SEVDESK_NODE=true # Automatische Installation
  - SEVDESK_NODE_PATH=/sevdesk-node # Pfad zum Node-Code im Container
```

### Produktive Umgebung

Für eine produktive Umgebung ändern Sie:

```yaml
environment:
  - N8N_HOST=ihredomain.de
  - N8N_PORT=443
  - N8N_PROTOCOL=https
  - NODE_ENV=production
```

## 🔧 Automatische Installation

Der Docker-Container führt beim Start automatisch folgende Schritte aus:

1. **Build-Tools installieren:** Python3, make, g++
2. **Community Packages installieren:** Standardmäßig definierte Packages
3. **SevDesk-Node kompilieren:**
   - Dependencies installieren (`npm install`)
   - TypeScript kompilieren (`npm run build`)
   - Node global verlinken (`npm link`)
4. **In n8n verfügbar machen:** Node im n8n-Verzeichnis installieren

## 📁 Verzeichnisstruktur

```
├── docker-compose.yml           # Docker Konfiguration
├── tools/install-packages.sh          # Installations-Skript
├── n8n_data/                   # n8n Daten (wird erstellt)
│   ├── .n8n/
│   │   ├── nodes/              # Installierte Nodes
│   │   └── custom/             # Custom Nodes
└── dist/                       # Kompilierte Node-Dateien
```

## 🐛 Debugging

### Logs anzeigen

```bash
# Alle Container-Logs
docker-compose logs -f

# Nur n8n-Logs
docker-compose logs -f n8n
```

### Container-Status prüfen

```bash
# Laufende Container anzeigen
docker-compose ps

# Container neustarten
docker-compose restart
```

### SevDesk-Node Status prüfen

Nach dem Start sollten Sie diese Meldungen sehen:

```
✅ SevDesk node successfully installed!
✅ SevDesk-Node ist verfügbar
🎉 Starting n8n...
```

### Häufige Probleme

**Problem:** `❌ Failed to install SevDesk node`
- **Lösung:** Prüfen Sie die Build-Logs und stellen Sie sicher, dass alle Dependencies verfügbar sind

**Problem:** Node nicht in n8n sichtbar
- **Lösung:** Container neustarten: `docker-compose restart`

**Problem:** Permission-Fehler
- **Lösung:** Der Container läuft als root und setzt automatisch die richtigen Berechtigungen

## 🔄 Entwicklung

### Node-Code ändern

1. **Änderungen am Code vornehmen**
2. **Container neustarten:** `docker-compose restart`
3. **Der Node wird automatisch neu kompiliert und installiert**

### Nur neu kompilieren (ohne Neustart)

```bash
# In den Container einsteigen
docker-compose exec n8n sh

# Node neu kompilieren
cd /sevdesk-node
npm run build
npm link
cd /home/node/.n8n/nodes
npm link n8n-nodes-sevdesk-v2
```

## 🌐 Produktion

### HTTPS konfigurieren

1. **SSL-Zertifikat hinzufügen**
2. **Reverse-Proxy (nginx) konfigurieren**
3. **Umgebungsvariablen anpassen:**
   ```yaml
   - N8N_PROTOCOL=https
   - N8N_HOST=ihredomain.de
   ```

### Daten-Backup

Wichtige Daten werden in `./n8n_data` gespeichert. Sichern Sie dieses Verzeichnis regelmäßig:

```bash
# Backup erstellen
tar -czf n8n-backup-$(date +%Y%m%d).tar.gz n8n_data/

# Backup wiederherstellen
tar -xzf n8n-backup-YYYYMMDD.tar.gz
```

## 📋 Kommandos-Übersicht

```bash
# Container starten
docker-compose up -d

# Container stoppen
docker-compose down

# Logs anzeigen
docker-compose logs -f

# Container neustarten
docker-compose restart

# Container und Volumes löschen
docker-compose down -v

# In Container einsteigen
docker-compose exec n8n sh
```

## ✅ Verifikation

Nach erfolgreichem Start:

1. **Öffnen Sie n8n:** http://localhost:5678
2. **Erstellen Sie einen neuen Workflow**
3. **Suchen Sie nach "SevDesk"** in der Node-Liste
4. **Der SevDesk-Node sollte verfügbar sein** 🎉 