# n8n-nodes-sevdesk-v2

[![Version](https://img.shields.io/npm/v/n8n-nodes-sevdesk-v2.svg)](https://www.npmjs.com/package/n8n-nodes-sevdesk-v2)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-sevdesk-v2.svg)](https://www.npmjs.com/package/n8n-nodes-sevdesk-v2)
[![Tests](https://github.com/knackw/n8n-nodes-sevdesk-v2/workflows/CI/badge.svg)](https://github.com/knackw/n8n-nodes-sevdesk-v2/actions)
[![License](https://img.shields.io/npm/l/n8n-nodes-sevdesk-v2.svg)](https://github.com/knackw/n8n-nodes-sevdesk-v2/blob/main/LICENSE)

Dies ist ein n8n Community Node, der eine umfassende Integration mit der SevDesk API v2 bietet. SevDesk ist ein beliebtes Buchhaltungstool mit Sitz in Deutschland. Weitere Informationen finden Sie auf deren [Website](https://sevdesk.de/).

[n8n](https://n8n.io/) ist eine [fair-code lizenzierte](https://docs.n8n.io/reference/license/) Workflow-Automatisierungsplattform.

## 🚀 Funktionen

- **Vollständige CRUD-Operationen** für alle wichtigen SevDesk-Entitäten
- **API v2 Unterstützung** mit Abwärtskompatibilität zu v1
- **Umfassende Filterung** und Suchfunktionen
- **Datei-Upload/Download** Unterstützung für Dokumente
- **Batch-Operationen** für effiziente Datenverarbeitung
- **Fehlerbehandlung** mit detailliertem Feedback
- **Direkter API-Zugriff** ohne externe Abhängigkeiten
- **Einfache Konfiguration** mit nur API-Schlüssel und Version
- **Optimierte Performance** durch schlanke Architektur

## 📋 Unterstützte Ressourcen

### ✅ Vollständig implementiert
- **Kontakte** - Vollständige Kontaktverwaltung mit Adressen und benutzerdefinierten Feldern
- **Rechnungen** - Vollständiger Rechnungslebenszyklus einschließlich PDF-Generierung und E-Mail-Versand
- **Aufträge** - Auftragsverwaltung mit Positionen und Rabatten
- **Belege** - Belegverwaltung mit Dateianhängen
- **Artikel** - Lagerverwaltung mit Bestandsverfolgung
- **Bankwesen** - Bankkonten und Transaktionen prüfen
- **Tags** - Flexibles Tagging-System
- **Berichte** - PDF-Berichtsgenerierung

### 🔄 In Bearbeitung
- **Gutschriften** - Gutschriftenverwaltung
- **Exporte** - Datenexportfunktionalität
- **Layouts** - Dokumentenlayoutverwaltung

## 🛠 Installation

Folgen Sie der [Installationsanleitung](https://docs.n8n.io/integrations/community-nodes/installation/) in der n8n Community Nodes Dokumentation.

```bash
npm install n8n-nodes-sevdesk-v2@2.0.0
```

## ⚙️ Konfiguration

### SevDesk API-Schlüssel

1. Melden Sie sich bei Ihrem SevDesk-Konto an
2. Gehen Sie zu **Einstellungen** > **Benutzerverwaltung** > **API**
3. Erstellen Sie einen neuen API-Schlüssel
4. Konfigurieren Sie die Credentials in n8n:
   - **API Key**: Ihr SevDesk API-Schlüssel
   - **API Version**: v2 (empfohlen) oder v1 (Legacy)

## 🚀 Schnellstart

### Neuen Kontakt erstellen

```javascript
{
  "resource": "contact",
  "operation": "create",
  "name": "Max Mustermann",
  "customerNumber": "CUST-001"
}
```

### Rechnung erstellen

```javascript
{
  "resource": "invoice",
  "operation": "create",
  "contact": "{{ $('Previous Node').item.json.contact.id }}",
  "invoiceDate": "2023-12-01"
}
```

## 🏗️ Entwicklungsumgebung

### 🚀 Schnellstart für Entwickler

**Neu!** Ein-Kommando-Setup mit vollautomatischer Workflow-Verwaltung:

```bash
# 1. .env-Datei erstellen (siehe ENV-TEMPLATE.md)
# 2. Alles automatisch starten:
npm start
```

Das Start-Skript führt automatisch aus:
- ✅ TypeScript-Build
- ✅ Docker-Container-Management  
- ✅ SevDesk-Node-Installation
- ✅ Workflow-Backup und -Upload
- ✅ Browser-Start mit n8n

📖 **Vollständige Anleitung:** [STARTUP-GUIDE.md](STARTUP-GUIDE.md)

### Voraussetzungen

- Docker und Docker Compose müssen installiert sein
- Node.js und npm müssen installiert sein

### Erweiterte Docker-Entwicklung

#### Manuelle Befehle

```bash
# Nur Build
npm run build

# Nur Docker starten
docker-compose up -d

# Logs anzeigen
docker-compose logs -f

# Container neustarten
docker-compose restart
```

#### Zugriff auf n8n
- Öffne [http://localhost:5678](http://localhost:5678) in deinem Browser
- Der SevDesk-Node ist automatisch verfügbar! 🎉

## 📦 Publishing auf NPM

### Veröffentlichung neuer Versionen

Das Projekt bietet automatisierte Scripts für sichere Veröffentlichung auf npmjs.com:

```bash
# Patch-Version für Bugfixes (z.B. 2.0.0 → 2.0.1)
npm run publish:patch

# Minor-Version für neue Features (z.B. 2.0.0 → 2.1.0) 
npm run publish:minor

# Major-Version für Breaking Changes (z.B. 2.0.0 → 3.0.0)
npm run publish:major

# Manuell ohne Versionierung
npm run publish
```

### Automatische Qualitätssicherung

Alle Publish-Scripts führen automatisch aus:
- ✅ **Tests** - Vollständige Testsuite
- ✅ **Build** - TypeScript-Kompilierung und Icon-Build
- ✅ **Lint** - Code-Qualitätsprüfung
- ✅ **Publish** - Sichere Veröffentlichung auf npmjs.com

### Voraussetzungen für Publishing

```bash
# NPM-Login (einmalig)
npm login

# Überprüfung der Anmeldung
npm whoami
```

## 🧪 Testen und Entwicklung

### Vollständige Validierung

```bash
npm run preflight
```

### Test-Framework

Dieses Projekt verwendet **Jest** als primäres Test-Framework.

#### Test-Struktur
- **Framework**: Alle Tests werden mit Jest geschrieben
- **Dateispeicherort**: Test-Dateien (`*.test.ts`) befinden sich im `tests/` Verzeichnis
- **Konfiguration**: Test-Umgebung ist in `jest.config.js` definiert

## 📚 Dokumentation

Die gesamte Dokumentation ist im Ordner `documentation/` verfügbar:

- [Benutzerhandbuch](documentation/USER_MANUAL.md) - Erste Schritte und grundlegende Nutzung
- [Technische Dokumentation](documentation/DOCUMENTATION.md) - Detaillierte technische Dokumentation
- [Änderungsprotokoll](CHANGELOG.md) - Versionshistorie und Änderungen

## 📦 Verfügbare Ressourcen

- **Contact** - Kontakte verwalten
- **Invoice** - Rechnungen erstellen und verwalten
- **Voucher** - Belege verwalten
- **Order** - Aufträge verwalten
- **Part** - Artikel verwalten
- **CheckAccount** - Kassenkonten verwalten
- **CheckAccountTransaction** - Transaktionen verwalten
- **CommunicationWay** - Kommunikationswege
- **Country** - Länder
- **Category** - Kategorien
- **Export** - Datenexporte
- **Layout** - Vorlagen
- **Report** - Berichte
- **Tag** - Tags verwalten
- **Unit** - Einheiten
- **Credit Note** - Gutschriften
- **Basic** - Grundlegende Systemfunktionen

## 🛣️ Roadmap

### Version 2.1.0
- Erweiterte Filteroptionen
- Bessere Fehlerbehandlung
- Performance-Optimierungen

### Version 2.2.0
- Zusätzliche Ressourcen
- Batch-Upload-Funktionalität
- Webhooks für Echtzeit-Updates

## 🤝 Beitragen

Beiträge sind willkommen! Bitte lesen Sie unseren [Beitragsleitfaden](CONTRIBUTING.md) für Details.

1. Fork das Repository
2. Erstellen Sie einen Feature-Branch (`git checkout -b feature/AmazingFeature`)
3. Commit Ihre Änderungen (`git commit -m 'Add some AmazingFeature'`)
4. Push zum Branch (`git push origin feature/AmazingFeature`)
5. Öffnen Sie eine Pull Request

## 📝 Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Details finden Sie in der [LICENSE](LICENSE) Datei.

## 📞 Support

- [GitHub Issues](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- [SevDesk API-Dokumentation](https://api.sevdesk.de/)
- [n8n Community](https://community.n8n.io/)

## 📈 Changelog

### Version 2.0.0
- 🎉 **BREAKING CHANGE**: Vereinfachte Architektur ohne externe Abhängigkeiten
- ✨ Direkter SevDesk API-Zugriff ohne Lizenzvalidierung
- 🚀 Verbesserte Performance durch Entfernung von Supabase-Integration
- 🔧 Einfache Konfiguration mit nur API-Schlüssel und Version
- 📚 Überarbeitete Dokumentation
- 🧹 Code-Bereinigung und Optimierung
