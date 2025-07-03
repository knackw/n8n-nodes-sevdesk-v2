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
# Einmalig: .env-Datei erstellen
cp ENV-TEMPLATE.md .env
# .env-Datei mit Ihren Werten bearbeiten

# n8n starten
npm start
```

### Vollständiger Workflow

```bash
# 1. Dependencies installieren
npm install

# 2. .env konfigurieren (siehe ENV-TEMPLATE.md)
# 3. SevDesk-Node starten
npm start
```

## 🔄 Ablauf im Detail

### Schritt 1: Build
```
✅ 1. Erstelle Build...
   → npm run build
   → TypeScript kompilieren
   → Icons erstellen
```

### Schritt 2: Docker-Prüfung
```
✅ 2. Prüfe Docker-Status...
   → Docker verfügbar?
   → Container-Status prüfen
```

### Schritt 3: Container-Management
```
❓ 3. n8n Container läuft bereits...
   → Container stoppen? (j/N)
   → Automatisches Stoppen falls gewählt
```

### Schritt 4: Container-Start
```
✅ 4. Starte Docker Container...
   → docker-compose up -d
   → SevDesk-Node automatisch installieren
   → Warten auf n8n (bis zu 60 Sekunden)
```

### Schritt 5: Workflow-Analyse
```
✅ 5. Prüfe vorhandene Workflows...
   → n8n API-Verbindung
   → Anzahl existierender Workflows
```

### Schritt 6: Backup (bei vorhandenen Workflows)
```
❓ 6. Backup der vorhandenen Workflows erstellen? (J/n)
   → Backup im ./backup/backup-TIMESTAMP/ Ordner
   → Jeder Workflow als separate JSON-Datei
```

### Schritt 7: Löschung (bei vorhandenen Workflows)
```
❓ 8. Vorhandene Workflows löschen? (j/N)
   → Alle Workflows über API löschen
   → Vorbereitung für saubere Test-Umgebung
```

### Schritt 8: Test-Workflows
```
✅ 9. Suche Test-Workflows...
   → ./test-workflows/ Verzeichnis scannen
   → JSON-Dateien direkt hochladen ODER
   → Verzeichnisse zur Auswahl anbieten
```

### Schritt 9: Browser-Start
```
✅ 11. Öffne n8n im Browser...
   → Automatisches Öffnen von http://localhost:5678
   → Sofort einsatzbereit!
```

## 📁 Test-Workflow-Verwaltung

### Automatische Erkennung

Das Skript sucht in `./test-workflows/` nach:

1. **Direkte JSON-Dateien:**
   ```
   test-workflows/
   ├── workflow1.json
   ├── workflow2.json
   └── workflow3.json
   ```

2. **Verzeichnisse mit Workflows:**
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

Bei mehreren Verzeichnissen:

```
📁 Verfügbare Workflow-Verzeichnisse:
1. 01-Belegerfassung (2 Workflows)
2. 02-Rechnungsstellung (1 Workflow)
3. 03-Mahnwesen (1 Workflow)
4. Alle Verzeichnisse
0. Abbrechen

❓ Wählen Sie ein Verzeichnis (Nummer): 
```

## 🔑 API-Key Konfiguration

### Erste Verwendung (ohne API-Key)

1. **Skript startet n8n** ohne Workflow-Management
2. **Öffnen Sie n8n:** http://localhost:5678
3. **Erstellen Sie API-Key:**
   - Settings → API → Create API Key
4. **Tragen Sie Key in .env ein:**
   ```bash
   N8N_API_KEY=ihr-neuer-api-key
   ```
5. **Skript erneut starten:** `npm start`

### Mit API-Key

Alle Workflow-Management-Funktionen verfügbar:
- ✅ Backup erstellen
- ✅ Workflows löschen  
- ✅ Test-Workflows hochladen
- ✅ Vollautomatisierung

## 🛠️ Fehlerbehandlung

### Häufige Probleme

**Docker nicht verfügbar:**
```
❌ Docker ist nicht verfügbar. Bitte starten Sie Docker.
```
**Lösung:** Docker Desktop starten

**n8n nicht erreichbar:**
```
❌ n8n ist nicht erreichbar
```
**Lösung:** 
- Container-Logs prüfen: `docker-compose logs -f`
- Container neustarten: `docker-compose restart`

**API-Key fehlt:**
```
⚠️ N8N_API_KEY ist nicht gesetzt
```
**Lösung:** API-Key in n8n erstellen und in .env eintragen

**Build-Fehler:**
```
❌ Fehler beim Build
```
**Lösung:**
- Dependencies installieren: `npm install`
- TypeScript-Fehler beheben

## 🔧 Erweiterte Konfiguration

### .env-Variablen

```bash
# Basis-Konfiguration
N8N_HOST=localhost          # n8n Hostname
N8N_PORT=5678              # n8n Port
N8N_PROTOCOL=http          # http oder https
NODE_ENV=development       # development oder production

# API-Konfiguration
N8N_API_KEY=...            # n8n API-Key
N8N_API_URL=...            # n8n API-URL

# Docker-Konfiguration
INSTALL_LOCAL_SEVDESK_NODE=true    # SevDesk-Node installieren
SEVDESK_NODE_PATH=/sevdesk-node    # Container-Pfad
```

### Produktive Umgebung

```bash
N8N_HOST=ihredomain.de
N8N_PORT=443
N8N_PROTOCOL=https
NODE_ENV=production
N8N_API_URL=https://ihredomain.de/api/v1
```

## 📊 Backup-System

### Automatische Backups

- **Ordner:** `./backup/backup-YYYY-MM-DDTHH-mm-ss/`
- **Format:** `WorkflowName_ID.json`
- **Inhalt:** Vollständige Workflow-Definition

### Backup-Struktur

```
backup/
├── backup-2024-01-15T10-30-45/
│   ├── Belegerfassung_123.json
│   ├── Rechnungsstellung_124.json
│   └── Mahnwesen_125.json
└── backup-2024-01-15T14-20-10/
    └── Test_Workflow_126.json
```

## 🎯 Entwickler-Workflow

### Typischer Entwicklungsablauf

1. **Code ändern** in `nodes/` oder `credentials/`
2. **npm start** ausführen
3. **Automatisch:** Build, Docker-Update, Test-Workflows
4. **Testen** in n8n Browser
5. **Wiederholen**

### Schnelle Iteration

Für reine Code-Änderungen ohne Workflow-Management:

```bash
# Nur Build und Docker-Neustart
npm run build && docker-compose restart
```

## 🚀 Integration in CI/CD

Das Start-Skript kann auch in automatisierten Umgebungen verwendet werden:

```bash
# Nicht-interaktiver Modus (Environment-Variablen setzen)
export NON_INTERACTIVE=true
npm start
```

**Hinweis:** Nicht-interaktiver Modus ist noch nicht implementiert, kann aber bei Bedarf hinzugefügt werden.

## 📈 Performance-Tipps

1. **Docker Volume Cache:** Node-Module werden gecacht
2. **Inkrementelle Builds:** Nur geänderte Dateien kompilieren
3. **Parallele Uploads:** Mehrere Workflows gleichzeitig
4. **Container-Wiederverwendung:** Bestehende Container nutzen

## 🎉 Erfolgsmeldung

Bei erfolgreichem Start sehen Sie:

```
🎉 Start-Prozess abgeschlossen!
✅ SevDesk-Node ist verfügbar
🌐 Browser geöffnet: http://localhost:5678
```

Der SevDesk-Node ist jetzt bereit für die Verwendung! 🚀 