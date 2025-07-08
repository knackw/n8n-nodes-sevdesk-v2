# Änderungsprotokoll

Alle wichtigen Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/spec/v2.0.0.html).

## [Unreleased]

### Added

### Changed

### Fixed

## [2.2.1] - 2024-12-19

### 🔄 API Compliance & Compatibility Updates
- **SevDesk API v2.0 Tax System Migration:** Migrated from deprecated `taxType` to modern `taxRule` system
  - Updated `InvoiceDescription.ts` with comprehensive tax rule options (1-21)
  - Updated `VoucherDescription.ts` with expense-specific tax rules (8-14)
  - Updated `CreditNoteDescription.ts` with sales tax rule options
  - Maintained backward compatibility with deprecated taxType fields
- **Validation Schema Enhancement:** Updated `ValidationSchemas.ts` to support both taxRule and legacy taxType validation
- **n8n@1.101.0 Compatibility:** Removed deprecated `executionOrder: "v1"` settings from test workflows
- **API Resource Completeness:** Verified all 21 SevDesk API resources are fully implemented and current

### 📊 Test Suite & Workflow Updates
- **Test Workflows:** Updated 9 test workflow files for n8n@1.101.0 compatibility
- **Node Type References:** Updated legacy `sevDesk` node type references to `n8n-nodes-sevdesk-v2.sevDesk`
- **Workflow Metadata:** Added n8nVersion metadata to all test workflows

### 🛠️ Technical Improvements
- **Resource Registry:** Confirmed complete coverage of all SevDesk API v2.0 endpoints
- **Error Handling:** Enhanced validation error messages for taxRule system
- **Documentation Consistency:** All documentation reflects standalone v2.0 architecture

### ✅ Validation Results
- **API Coverage:** 100% - All 21 resources from scraped SevDesk API implemented
- **Tax System:** ✅ Fully migrated to taxRule system with backward compatibility
- **n8n Compatibility:** ✅ Compatible with n8n@1.101.0
- **Test Coverage:** ✅ All workflows updated and validated
- **Documentation:** ✅ Complete and consistent

### 🔧 Developer Experience
- **Migration Guide:** Clear upgrade path from taxType to taxRule
- **Validation:** Comprehensive error messages for both systems
- **Examples:** Updated all workflow examples to use new tax system

## [2.2.0] - 2024-12-19

### Hinzugefügt
- **Erweiterte Dokumentation**: Umfassende deutsche Dokumentation hinzugefügt
- **Migrationsleitfaden**: Detaillierter Migrationsleitfaden für Benutzer
- **Verbesserte Test-Workflows**: Erweiterte Beispiel-Workflows für Steuerberater-Export
- **Benutzerhandbuch**: Vollständiges deutsches Benutzerhandbuch

### Geändert
- **Code-Qualität**: Verbesserte TypeScript-Typisierung und Fehlerbehandlung
- **Test-Abdeckung**: Erweiterte Test-Suite mit besseren Mock-Daten
- **Dokumentationsstruktur**: Reorganisierte Dokumentation für bessere Benutzerfreundlichkeit

### Behoben
- **Build-Stabilität**: Verschiedene Build-Probleme behoben
- **Typisierung**: TypeScript-Fehler in Test-Utilities behoben
- **Dokumentation**: Inkonsistenzen in der Dokumentation korrigiert

## [2.0.0] - 2024-01-15

### 🎉 **Neugestaltung für maximale Einfachheit**

### Entfernt (Breaking Changes)
- **Lizenzmanagement**: Vollständige Entfernung der Supabase-basierten Lizenzvalidierung
- **Supabase-Integration**: Entfernung aller externen Datenbankabhängigkeiten
- **KI-Integration**: Entfernung der IONOS AI Hub Integration
- **Cloud-Speicher-Integration**: Entfernung der Google Cloud/Azure/S3 Integrationen
- **Signal-Messaging**: Entfernung der Signal-Integration
- **Komplexe Konfiguration**: Entfernung der workflow-spezifischen Konfigurationsspeicherung
- **Execute-Methode**: Migration zu deklarativer Node-Architektur
- **Helper-Klassen**: LicenseValidator und SupabaseManager entfernt

### Hinzugefügt
- **Standalone-Architektur**: Vollständig eigenständige Node ohne externe Abhängigkeiten
- **Vereinfachte Credentials**: Nur noch API-Key und API-Version erforderlich
- **Docker-Integration**: Vollautomatisierte Entwicklungsumgebung mit docker-compose
- **Start-Skript**: Ein-Kommando-Setup mit `npm start` für komplette Automatisierung
- **Workflow-Management**: Automatisierte Backup-, Upload- und Delete-Funktionen für Test-Workflows
- **Interaktive Auswahl**: Benutzerfreundliche Verzeichnis-Auswahl für Workflow-Upload
- **Browser-Integration**: Automatisches Öffnen von n8n nach erfolgreichem Start
- **Erweiterte Test-Workflows**: Umfassende Beispiel-Workflows für alle Anwendungsfälle
- **Vollständige Dokumentation**: Aktualisierte Docs für vereinfachte Architektur

### Geändert
- **Node-Architektur**: Migration von programmatischer zu deklarativer Node-Implementation
- **Credential-Struktur**: Reduzierung von 7 auf 2 essenzielle Eigenschaften (apiKey, apiVersion)
- **Package.json**: Entfernung von @supabase/supabase-js und anderen externen Dependencies
- **Build-Prozess**: Optimierung für Docker-basierte Entwicklung
- **Fehlerbehandlung**: Vereinfachung ohne externe Fehlerberichterstattung
- **Performance**: Direkte API-Kommunikation ohne Middleware-Overhead
- **Test-Framework**: Fokus auf Core-SevDesk-Funktionalität

### Behoben
- **TypeScript-Fehler**: Behebung aller Kompilierungsfehler nach Architektur-Vereinfachung
- **Import-Probleme**: Entfernung nicht verwendeter Imports und Dependencies
- **Docker-Setup**: Zuverlässige Container-Konfiguration für Entwicklung
- **Test-Stabilität**: Bereinigung und Vereinfachung der Test-Suite

### Migration von v1.x

**Automatische Migration:**
- Bestehende Workflows funktionieren ohne Änderungen weiter
- SevDesk API-Aufrufe bleiben unverändert
- Alle Ressourcen und Operationen sind weiterhin verfügbar

**Manuelle Schritte:**
1. **Credentials aktualisieren**: Entfernen Sie licenseCode, workflowId, userId, supabaseApiKey, supabaseUrl
2. **Behalten Sie nur**: apiKey und apiVersion
3. **Docker verwenden**: Nutzen Sie die neue Docker-Entwicklungsumgebung mit `npm start`

**Nicht mehr verfügbar:**
- Lizenz-basierte Funktionen (alle Funktionen sind jetzt frei verfügbar)
- Supabase-Konfigurationsspeicherung (nutzen Sie lokale n8n-Konfiguration)
- KI-gestützte Funktionen (implementieren Sie diese in separaten Nodes bei Bedarf)

## [0.4.0] - 2024-01-XX

### Hinzugefügt
- **API v2 Unterstützung**: Vollständige Unterstützung für SevDesk API v2 mit Abwärtskompatibilität
- **Dynamische Basis-URL**: Basis-URL jetzt über Credentials konfigurierbar
- **Erweiterte Credentials**: API-Versionsauswahl und bessere Beschreibungen
- **Verbessertes Package.json**: Bessere Schlüsselwörter, Skripte und Metadaten
- **Umfassende Tests**: Jest-Testsuite mit Coverage-Reporting
- **CI/CD-Pipeline**: GitHub Actions für automatisierte Tests und Deployment
- **Code-Qualitätstools**: Husky, lint-staged und verbessertes Linting
- **Bessere Dokumentation**: Verbessertes README mit Beispielen und Fehlerbehebung

### Geändert
- **Credential-Management**: API-Versionsauswahl hinzugefügt (v1/v2)
- **Fehlerbehandlung**: Verbesserte Fehlermeldungen und Validierung
- **Build-Prozess**: Clean-Skripte und bessere Build-Pipeline hinzugefügt
- **Entwicklungserfahrung**: Bessere Entwicklungstools und Skripte

### Behoben
- **TypeScript-Probleme**: Verschiedene TypeScript-Kompilierungsprobleme behoben
- **Linting-Fehler**: ESLint- und Prettier-Konfiguration korrigiert
- **Dokumentation**: Alle Dokumentationen aktualisiert und verbessert

## [0.3.0] - 2023-XX-XX

### Hinzugefügt
- Unterstützung für Gutschriften, Exporte und Layouts
- Verbesserte Tag-Beziehungsverwaltung
- Verbesserte Berichtgenerierung

### Geändert
- Optimierte Ressourcenabdeckung
- Verbesserte Fehlerbehandlung

## [0.2.0] - 2023-XX-XX

### Hinzugefügt
- Umfassende Ressourcenabdeckung
- Implementierung von Batch-Operationen
- Unterstützung für Datei-Upload/Download

### Geändert
- Verbesserte API-Integration
- Erweiterte Dokumentation

## [0.1.0] - 2023-XX-XX

### Hinzugefügt
- Erste Veröffentlichung mit grundlegender Funktionalität
- Unterstützung für Kontakte, Rechnungen und Belege
- Grundlegende API-Integration
