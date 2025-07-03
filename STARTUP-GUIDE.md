# 🚀 Start-Skript für SevDesk-Node

Das neue `npm start` Kommando bietet eine vollautomatisierte Lösung für die Entwicklung mit dem SevDesk-Node.

## ✨ Funktionen

Das Start-Skript führt automatisch folgende Schritte aus:

1. **🔨 Node Build** - Kompiliert den TypeScript-Code
2. **🐳 Docker-Management** - Prüft und verwaltet Docker-Container  
3. **📊 Workflow-Verwaltung** - Backup, Löschen und Upload von Workflows
4. **🌐 Browser-Start** - Öffnet n8n automatisch im Browser

## 🎯 Verwendung

### Schnellstart

```bash
# Einmalig: .env-Datei erstellen (siehe ENV-TEMPLATE.md)
# n8n starten
npm start
```

## 🔄 Interaktiver Ablauf

### 1. Build & Docker-Start
- ✅ **TypeScript kompilieren**
- ✅ **Docker-Container prüfen/starten**
- ✅ **SevDesk-Node automatisch installieren**

### 2. Workflow-Management
- 📊 **Vorhandene Workflows analysieren**
- ❓ **Backup erstellen?** (J/n)
- ❓ **Workflows löschen?** (j/N)

### 3. Test-Workflows laden
- 📁 **Automatische Verzeichnis-Erkennung**
- 🎯 **Interaktive Auswahl bei mehreren Ordnern**
- ⬆️ **Upload der gewählten Workflows**

### 4. Browser-Start
- 🌐 **Automatisches Öffnen von n8n**
- ✅ **SevDesk-Node sofort verfügbar**

## 📁 Test-Workflow-Struktur

Das Skript unterstützt verschiedene Organisationsformen:

### Direkte JSON-Dateien
```
test-workflows/
├── workflow1.json
├── workflow2.json
└── workflow3.json
```

### Kategorisierte Verzeichnisse
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

### Interaktive Auswahl
```
📁 Verfügbare Workflow-Verzeichnisse:
1. 01-Belegerfassung (2 Workflows)
2. 02-Rechnungsstellung (1 Workflow)
3. 03-Mahnwesen (1 Workflow)
4. Alle Verzeichnisse
0. Abbrechen

❓ Wählen Sie ein Verzeichnis (Nummer): 
```

## 🔑 API-Key Setup

### Erste Verwendung

1. **Starten Sie ohne API-Key:** `npm start`
2. **n8n öffnet sich automatisch**
3. **Erstellen Sie API-Key:** Settings → API → Create API Key
4. **Tragen Sie Key in .env ein:** `N8N_API_KEY=ihr-key`
5. **Starten Sie erneut:** `npm start`

**Ohne API-Key:** Basic-Funktionen verfügbar
**Mit API-Key:** Vollständige Workflow-Automatisierung

## 🛠️ Konfiguration

Erstellen Sie eine `.env`-Datei (siehe `ENV-TEMPLATE.md`):

```bash
# Basis-Konfiguration
N8N_HOST=localhost
N8N_PORT=5678
N8N_PROTOCOL=http

# API für Workflow-Management
N8N_API_KEY=ihr-api-key
N8N_API_URL=http://localhost:5678/api/v1

# Docker-Konfiguration  
INSTALL_LOCAL_SEVDESK_NODE=true
SEVDESK_NODE_PATH=/sevdesk-node
```

## 📊 Backup-System

### Automatische Backups
- **Pfad:** `./backup/backup-YYYY-MM-DDTHH-mm-ss/`
- **Format:** `WorkflowName_ID.json`
- **Struktur:** Ein Ordner pro Backup-Session

```
backup/
└── backup-2024-01-15T10-30-45/
    ├── Belegerfassung_123.json
    ├── Rechnungsstellung_124.json
    └── Mahnwesen_125.json
```

## 🎯 Entwickler-Workflow

### Typische Iteration
1. **Code ändern** in `nodes/` oder `credentials/`
2. **`npm start` ausführen**
3. **Automatisch:** Build, Docker-Update, Test-Workflows
4. **Testen** in n8n
5. **Wiederholen**

### Schnell-Iteration (ohne Workflows)
```bash
npm run build && docker-compose restart
```

## 🚨 Fehlerbehandlung

### Docker-Probleme
```
❌ Docker ist nicht verfügbar
→ Docker Desktop starten
```

### n8n-Verbindung
```
❌ n8n ist nicht erreichbar  
→ docker-compose logs -f
→ docker-compose restart
```

### API-Zugriff
```
⚠️ N8N_API_KEY ist nicht gesetzt
→ API-Key in n8n erstellen
→ Key in .env eintragen
```

## ✅ Erfolgsmeldung

Bei erfolgreichem Start:

```
🎉 Start-Prozess abgeschlossen!
✅ SevDesk-Node ist verfügbar  
🌐 Browser geöffnet: http://localhost:5678
```

**Der SevDesk-Node ist bereit! 🚀**

## 📋 Kommando-Übersicht

```bash
npm start              # Vollständiger automatisierter Start
npm run build          # Nur kompilieren
npm run dev            # Development-Modus mit Watch
docker-compose up -d   # Nur Docker starten
docker-compose logs -f # Container-Logs anzeigen
``` 