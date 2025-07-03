# Projektübersicht und Ziel

Das n8n-nodes-sevdesk-v2 Projekt ist eine n8n Community Node Implementation für die direkte Integration mit der SevDesk API (Version 2). Es ermöglicht die Automatisierung von Buchhaltungs- und Rechnungsprozessen durch n8n-Workflows. Das Ziel ist es, eine einfache, zuverlässige und vollständige Integration mit allen wichtigen SevDesk-Funktionalitäten zu bieten, ohne externe Abhängigkeiten oder komplexe Konfigurationen.

# Technologien und verwendete Bibliotheken

- **TypeScript**: Hauptprogrammiersprache für typsichere Entwicklung
- **n8n-workflow**: Kern-Bibliothek für n8n Node Entwicklung
- **n8n-core**: Erweiterte n8n Funktionalitäten für Node-Implementation
- **SevDesk API v2**: REST-API für Buchhaltungs- und Rechnungsmanagement
- **Node.js**: Laufzeitumgebung für JavaScript/TypeScript
- **Jest**: Testing-Framework für Unit- und Integrationstests
- **HTTP/HTTPS**: Direkte API-Kommunikation mit SevDesk-Services
- **JSON**: Datenformat für API-Kommunikation und Konfiguration
- **Docker**: Containerisierte Entwicklungsumgebung

# Projektstruktur und Ordneraufbau

- **credentials/**: SevDesk API-Authentifizierungskonfigurationen (nur API-Key und Version)
- **nodes/**: Hauptimplementierung des SevDesk-Nodes
  - **SevDesk/**: Node-Implementierung und Beschreibungen
    - **descriptions/**: Feld- und Operations-Definitionen für alle Ressourcen
    - **SevDesk.node.ts**: Haupt-Node-Implementation (deklarativ)
- **tests/**: Jest-Tests für Node- und Credential-Funktionalitäten
- **scripts/**: Automatisierungs-Skripte für Entwicklung und Deployment
  - **start-n8n.js**: Vollautomatisiertes Setup mit Docker und Workflow-Management
- **test-workflows/**: Vorgefertigte Workflow-Beispiele für verschiedene Anwendungsfälle
- **docker-compose.yml**: Docker-Konfiguration für Entwicklungsumgebung
- **package.json**: NPM-Paketdefinition mit minimalen Abhängigkeiten
- **tsconfig.json**: TypeScript-Konfiguration

# Funktionen und Hauptlogik

- **Direkte SevDesk API Integration**: Vollständige Integration mit SevDesk API v2 ohne Middleware
- **Rechnungsmanagement**: Erstellung, Bearbeitung und Verwaltung von Rechnungen mit PDF-Generierung
- **Kontaktverwaltung**: Umfassende Verwaltung von Kunden und Lieferanten
- **Produktverwaltung**: Verwaltung von Artikeln und Dienstleistungen mit Bestandsführung
- **Belegverwaltung**: Automatisierte Belegerfassung und -verarbeitung
- **Bankwesen**: Integration von Bankkonten und Transaktionen
- **Export-Funktionen**: Datenexport in verschiedene Formate
- **Credential-Management**: Einfache und sichere Verwaltung von API-Schlüsseln
- **Error-Handling**: Robuste Fehlerbehandlung mit automatischen Retry-Mechanismen
- **Docker-Integration**: Vollautomatisierte Entwicklungsumgebung
- **Workflow-Automation**: Erweiterte Start-Skripte mit Backup und Upload-Funktionalität

# Verwendete Code-Stile und Konventionen

- **TypeScript Strict Mode**: Vollständige Typisierung mit strengen Compiler-Optionen
- **n8n Community Standards**: Einhaltung der offiziellen n8n Community Node Guidelines
- **Deklarative Node-Architektur**: Moderne n8n-Node-Implementation ohne execute-Methode
- **Modulare Architektur**: Trennung von Node-Logik, Beschreibungen und Hilfsfunktionen
- **API-First Design**: Strukturierung basierend auf SevDesk API-Endpunkten
- **Defensive Programming**: Umfassende Validierung und Fehlerbehandlung
- **Standalone Design**: Keine externen Abhängigkeiten oder komplexe Konfigurationen

# Abhängigkeiten und Schnittstellen

- **SevDesk API v2**: REST-API für alle Buchhaltungsfunktionalitäten
- **n8n-workflow**: Kern-Bibliothek für n8n Node Entwicklung
- **n8n-core**: Erweiterte n8n Funktionalitäten
- **HTTP Client**: Für direkte API-Kommunikation mit SevDesk
- **Authentication**: API-Key-basierte Authentifizierung (vereinfacht)
- **JSON Processing**: Verarbeitung von API-Responses und -Requests
- **Docker**: Containerisierte Entwicklungs- und Test-Umgebung

# Best Practices

- **Code-Organisation**: 
  - Klare Trennung von Node-Implementierung und Beschreibungen
  - Modulare Struktur für verschiedene SevDesk-Funktionalitäten
  - Konsistente Namenskonventionen für alle Operationen
  - Deklarative Node-Definition für bessere Performance

- **Sicherheit**: 
  - Sichere Credential-Verwaltung mit n8n-Standards
  - Validierung aller API-Eingaben
  - Schutz vor Injection-Angriffen
  - Sichere Handhabung von Authentifizierungsdaten
  - Rate-Limiting für API-Requests

- **Performance**: 
  - Effiziente API-Aufrufe mit Retry-Mechanismen
  - Optimierte Datenstrukturen für API-Responses
  - Batch-Operationen für große Datenmengen
  - Direkte API-Kommunikation ohne Middleware-Overhead

- **Wartbarkeit**: 
  - Umfassende TypeScript-Typisierung für alle API-Interfaces
  - Automatisierte Tests für alle Node-Funktionalitäten
  - Klare Dokumentation aller API-Integrationen
  - Versionierung von API-Änderungen
  - Comprehensive Error-Logging für Debugging
  - Regelmäßige Updates für API-Kompatibilität
  - Docker-basierte Entwicklungsumgebung für Konsistenz

- **Entwicklererfahrung**:
  - Ein-Kommando-Setup mit `npm start`
  - Automatisierte Workflow-Verwaltung (Backup, Upload, Delete)
  - Interaktive Test-Workflow-Auswahl
  - Vollautomatische Docker-Container-Verwaltung
  - Browser-Integration für sofortigen Zugriff auf n8n
