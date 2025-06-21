# n8n-nodes-sevdesk-v2

[![Version](https://img.shields.io/npm/v/n8n-nodes-sevdesk-v2.svg)](https://www.npmjs.com/package/n8n-nodes-sevdesk-v2)
[![Downloads](https://img.shields.io/npm/dm/n8n-nodes-sevdesk-v2.svg)](https://www.npmjs.com/package/n8n-nodes-sevdesk-v2)
[![Tests](https://github.com/knackw/n8n-nodes-sevdesk-v2/workflows/CI/badge.svg)](https://github.com/knackw/n8n-nodes-sevdesk-v2/actions)
[![License](https://img.shields.io/npm/l/n8n-nodes-sevdesk-v2.svg)](https://github.com/knackw/n8n-nodes-sevdesk-v2/blob/main/LICENSE)

Dies ist ein n8n Community Node, der eine umfassende Integration mit der SevDesk API v2 bietet. SevDesk ist ein beliebtes Buchhaltungsprogramm aus Deutschland. Weitere Informationen finden Sie auf der [Website](https://sevdesk.de/).

[n8n](https://n8n.io/) ist eine [Fair-Code lizenzierte](https://docs.n8n.io/reference/license/) Workflow-Automatisierungsplattform.

## 🚀 Funktionen

- **Vollständige CRUD-Operationen** für alle wichtigen SevDesk-Entitäten
- **API v2 Unterstützung** mit Rückwärtskompatibilität zu v1
- **Umfassende Filterung** und Suchfunktionen
- **Datei-Upload/Download** Unterstützung für Dokumente
- **Batch-Operationen** für effiziente Datenverarbeitung
- **Fehlerbehandlung** mit detailliertem Feedback
- **Umfassende Tests** mit Jest und Coverage-Reporting
- **CI/CD Pipeline** mit automatisiertem Testing und Deployment
- **Code-Qualitäts-Tools** mit Husky und lint-staged

## 📋 Unterstützte Ressourcen

### ✅ Vollständig implementiert
- **Kontakte** - Vollständiges Kontaktmanagement mit Adressen und benutzerdefinierten Feldern
- **Rechnungen** - Vollständiger Rechnungslebenszyklus einschließlich PDF-Generierung und E-Mail-Versand
- **Aufträge** - Auftragsverwaltung mit Positionen und Rabatten
- **Belege** - Belegverwaltung mit Dateianhängen
- **Artikel** - Lagerverwaltung mit Bestandsverfolgung
- **Bankwesen** - Bankkonten und Transaktionen
- **Tags** - Flexibles Tagging-System
- **Berichte** - PDF-Berichtsgenerierung

### 🔄 In Bearbeitung
- **Gutschriften** - Gutschriftenverwaltung
- **Exporte** - Datenexport-Funktionalität
- **Layouts** - Dokumentlayout-Verwaltung

## 🛠 Installation

Folgen Sie der [Installationsanleitung](https://docs.n8n.io/integrations/community-nodes/installation/) in der n8n Community Nodes Dokumentation.

```bash
npm install n8n-nodes-sevdesk-v2
```

## 🔑 Einrichtung

### 1. API-Schlüssel erhalten
1. Melden Sie sich in Ihrem SevDesk-Konto an
2. Gehen Sie zu **Einstellungen** → **API**
3. Kopieren Sie Ihren API-Schlüssel

### 2. Anmeldedaten konfigurieren
1. Gehen Sie in n8n zu **Anmeldedaten**
2. Fügen Sie neue Anmeldedaten vom Typ **SevDesk API** hinzu
3. Geben Sie Ihren API-Schlüssel ein
4. Wählen Sie API-Version (v2 empfohlen)
5. Testen Sie die Verbindung

![Anmeldedaten Setup](./images/credentials-success.png)

## 📖 Verwendungsbeispiele

### Kontakt erstellen
```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Max Mustermann",
  "customerNumber": "KUND001",
  "category": {
    "id": "1",
    "objectName": "Contact"
  }
}
```

### Rechnungen mit Filtern abrufen
```json
{
  "resource": "invoice",
  "operation": "getMany",
  "filters": {
    "status": "100",
    "createAfter": "2024-01-01",
    "limit": 50
  }
}
```

### Rechnung per E-Mail senden
```json
{
  "resource": "invoice",
  "operation": "sendViaEmail",
  "invoiceId": "12345",
  "email": "kunde@beispiel.de",
  "subject": "Ihre Rechnung",
  "text": "Bitte finden Sie Ihre Rechnung im Anhang."
}
```

## 🔧 Konfiguration

### API-Versionen
- **v1 (Legacy)**: Ursprüngliche API, weiterhin unterstützt
- **v2 (Empfohlen)**: Neueste API mit verbesserten Funktionen und Performance

### Rate Limiting
Der Node respektiert SevDesks Rate Limits und enthält automatische Wiederholungslogik für fehlgeschlagene Anfragen.

## 🧪 Testing

### Tests ausführen
```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Modus ausführen
npm run test:watch

# Tests mit Coverage ausführen
npm run test:coverage
```

### Test-Coverage
Das Projekt umfasst umfassende Test-Coverage für:
- Node-Funktionalität
- Anmeldedaten-Validierung
- API-Operationen
- Fehlerbehandlung

## 🤝 Beitragen

Beiträge sind willkommen! Bitte erstellen Sie gerne einen Pull Request.

### Entwicklungsumgebung einrichten
```bash
git clone https://github.com/knackw/n8n-nodes-sevdesk-v2.git
cd n8n-nodes-sevdesk-v2
npm install
npm run build
```

### Code-Qualität
Das Projekt verwendet mehrere Tools zur Aufrechterhaltung der Code-Qualität:
- **ESLint** für Code-Linting
- **Prettier** für Code-Formatierung
- **Husky** für Git-Hooks
- **lint-staged** für Pre-Commit-Prüfungen

### Pull Request Prozess
1. Repository forken
2. Feature-Branch erstellen
3. Änderungen vornehmen
4. Tests für neue Funktionalität hinzufügen
5. Sicherstellen, dass alle Tests bestehen
6. Pull Request einreichen

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- **Dokumentation**: [SevDesk API Docs](https://api.sevdesk.de/)
- **Community**: [n8n Community](https://community.n8n.io/)
- **Entwickler-Kontakt**: harald@schwankl.info

## 📚 Dokumentation

Für detaillierte Dokumentation siehe:
- [DOCUMENTATION_DE.md](DOCUMENTATION_DE.md) - Umfassende Anleitung
- [CHANGELOG_DE.md](CHANGELOG_DE.md) - Versionshistorie und Änderungen

## 👨‍💻 Entwickler

Hallo, ich bin Harald, ein unabhängiger Berater mit Leidenschaft für Open-Source-Software.

Meine Nodes sind kostenlos nutzbar, aber bitte erwägen Sie eine [Spende](https://coff.ee/knackw), wenn Sie sie hilfreich finden.

### Angebotene Dienstleistungen
- Node-Entwicklung
- Workflow-Entwicklung  
- Mentoring
- Support

## 📄 Lizenz

[MIT](LICENSE)

## 🙏 Danksagungen

- [Nico Kowalczyk](https://github.com/nico-kow) - Grundlegende Arbeit am ursprünglichen Node
- [GitCedric](https://github.com/gitcedric) - Erste n8n-Integration
- [Bram](https://github.com/bramkn) - Community-Führung und README-Vorlage
- [n8n Team](https://github.com/n8n-io/n8n) - Erstaunliche Automatisierungsplattform

## 📈 Versionshistorie

### v0.4.0 (Aktuell)
- ✅ API v2 Unterstützung mit Rückwärtskompatibilität hinzugefügt
- ✅ Verbessertes Anmeldedaten-Management mit API-Versionsauswahl
- ✅ Umfassende Test-Suite mit Jest
- ✅ CI/CD Pipeline mit GitHub Actions
- ✅ Code-Qualitäts-Tools (Husky, lint-staged)
- ✅ Verbesserte Dokumentation und Beispiele
- ✅ Bessere Fehlerbehandlung und Validierung

### v0.3.0
- Gutschriften, Exporte und Layouts hinzugefügt
- Verbesserte Tag-Beziehungsverwaltung
- Verbesserte Berichtsgenerierung

### v0.2.0
- Umfassende Ressourcenabdeckung hinzugefügt
- Batch-Operationen implementiert
- Datei-Upload/Download-Unterstützung hinzugefügt

### v0.1.0
- Erste Version mit grundlegender Funktionalität 