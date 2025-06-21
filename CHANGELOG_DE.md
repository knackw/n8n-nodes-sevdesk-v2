# Änderungsprotokoll

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt folgt der [Semantic Versioning](https://semver.org/spec/v2.0.0.html) Spezifikation.

## [Unveröffentlicht]

### Hinzugefügt
- Umfassende Test-Suite mit Jest
- CI/CD Pipeline mit GitHub Actions
- Husky Git-Hooks für Code-Qualität
- Lint-staged für automatische Formatierung
- Bessere Fehlerbehandlung und Validierung
- API v2 Unterstützung mit Rückwärtskompatibilität

### Geändert
- Verbessertes Anmeldedaten-Management
- Erweiterte Dokumentation
- Bessere TypeScript-Konfiguration

### Behoben
- Verschiedene kleinere Bugs und Verbesserungen

## [0.4.0] - 2024-01-XX

### Hinzugefügt
- **API v2 Unterstützung**: Vollständige Unterstützung für SevDesk API v2 mit Rückwärtskompatibilität
- **Dynamische Base URL**: Base URL jetzt konfigurierbar über Anmeldedaten
- **Erweiterte Anmeldedaten**: API-Versionsauswahl und bessere Beschreibungen
- **Verbesserte Package.json**: Bessere Keywords, Scripts und Metadaten
- **Umfassende Tests**: Jest Test-Suite mit Coverage-Reporting
- **CI/CD Pipeline**: GitHub Actions für automatisiertes Testing und Deployment
- **Code-Qualitäts-Tools**: Husky, lint-staged und verbessertes Linting
- **Bessere Dokumentation**: Erweiterte README mit Beispielen und Troubleshooting

### Geändert
- **Anmeldedaten-Management**: API-Versionsauswahl hinzugefügt (v1/v2)
- **Fehlerbehandlung**: Verbesserte Fehlermeldungen und Validierung
- **Build-Prozess**: Clean-Scripts und bessere Build-Pipeline hinzugefügt
- **Entwicklungserfahrung**: Bessere Entwicklungs-Tools und Scripts

### Behoben
- **TypeScript-Probleme**: Verschiedene TypeScript-Kompilierungsprobleme behoben
- **Linting-Fehler**: ESLint und Prettier-Konfiguration korrigiert
- **Dokumentation**: Alle Dokumentationen aktualisiert und verbessert

## [0.3.0] - 2023-XX-XX

### Hinzugefügt
- **Gutschriften**: Vollständige CRUD-Operationen für Gutschriften
- **Export-Funktionalität**: Datenexport-Fähigkeiten
- **Layout-Verwaltung**: Dokumentlayout-Operationen
- **Tag-Beziehungen**: Erweiterte Tag-Beziehungsverwaltung
- **Berichtsgenerierung**: PDF-Bericht-Funktionalität

### Geändert
- **API-Abdeckung**: Erweiterte Unterstützung für mehr SevDesk-Entitäten
- **Performance**: Verbesserte Antwortverarbeitung und Datenverarbeitung

## [0.2.0] - 2023-XX-XX

### Hinzugefügt
- **Umfassende Ressourcenabdeckung**: Alle wichtigen SevDesk-Entitäten
- **Batch-Operationen**: Effiziente Datenverarbeitung für mehrere Elemente
- **Datei-Upload/Download**: Unterstützung für Dokumentanhänge
- **Erweiterte Filterung**: Verbesserte Such- und Filterfunktionen

### Geändert
- **Architektur**: Verbesserte Node-Struktur und Organisation
- **Fehlerbehandlung**: Bessere Fehlermeldungen und Wiederherstellung

## [0.1.0] - 2023-XX-XX

### Hinzugefügt
- **Erste Version**: Grundlegende SevDesk-Integration
- **Kontaktverwaltung**: CRUD-Operationen für Kontakte
- **Rechnungsoperationen**: Grundlegende Rechnungsfunktionalität
- **Authentifizierung**: API-Schlüssel-basierte Authentifizierung

---

## Migrationsanleitung

### Von v0.3.0 zu v0.4.0

1. **Anmeldedaten aktualisieren**: 
   - Bestehende Anmeldedaten funktionieren weiterhin mit v1 API
   - Für neue Implementierungen wählen Sie v2 API in den Anmeldedaten
   - Keine Breaking Changes für bestehende Workflows

2. **API-Versionsauswahl**:
   - Wählen Sie API-Version in den Anmeldedaten (v1 oder v2)
   - v2 wird für neue Implementierungen empfohlen
   - v1 bleibt für Rückwärtskompatibilität unterstützt

3. **Testing**:
   - Führen Sie `npm test` aus, um sicherzustellen, dass alles korrekt funktioniert
   - Überprüfen Sie Coverage mit `npm run test:coverage`

### Von v0.2.0 zu v0.3.0

- Keine Breaking Changes
- Alle bestehenden Workflows funktionieren weiterhin
- Neue Features sind nur additiv

### Von v0.1.0 zu v0.2.0

- Kleinere API-Änderungen in einigen Operationen
- Feldnamen aktualisieren, wenn benutzerdefinierte Workflows verwendet werden
- Dokumentation für spezifische Änderungen überprüfen

---

## Beitragen

Beim Beitragen zu diesem Projekt bitte:

1. Dem bestehenden Code-Stil folgen
2. Tests für neue Features hinzufügen
3. Dokumentation bei Bedarf aktualisieren
4. Dem Commit-Message-Format folgen
5. Sicherstellen, dass alle Tests bestehen, bevor eingereicht wird

## Support

Für Support und Fragen:
- [GitHub Issues](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- [n8n Community](https://community.n8n.io/)
- [SevDesk API Dokumentation](https://api.sevdesk.de/) 