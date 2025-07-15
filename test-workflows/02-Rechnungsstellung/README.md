# Modularer Rechnungsstellung-Workflow für SevDesk

Dieser Workflow automatisiert den Prozess der Rechnungserstellung und des Rechnungsversands in SevDesk unter Einhaltung der DSGVO-Richtlinien. Der Workflow ist in drei separate Module aufgeteilt, die über Webhooks miteinander kommunizieren.

## Produktionsreife Modulare Struktur

Der Rechnungsstellung-Workflow besteht aus drei separaten Teilen mit systematischen Node-IDs:

### **Teil 1: Erfassung (Node-IDs: 021\_\***)\*\*

- **[Detaillierte Dokumentation](./Teil1-Erfassung/README.md)**
- **Zweck**: Erfasst Rechnungsdaten aus verschiedenen Quellen und bereitet sie für die Verarbeitung vor
- **Webhook-Ausgang**: `webhook/invoice-creation`
- **Hauptnodes**: `021_TRG_01` (Schedule), `021_TRG_02` (Webhook), `021_FWD_01` (Forward)

### **Teil 2: Erstellung (Node-IDs: 022\_\***)\*\*

- **[Detaillierte Dokumentation](./Teil2-Erstellung/README.md)**
- **Zweck**: Erstellt Rechnungen in SevDesk mit KI-unterstützter Inhaltsgenerierung
- **Webhook-Eingang**: `webhook/invoice-creation`
- **Webhook-Ausgang**: `webhook/invoice-sending`
- **Hauptnodes**: `022_TRG_01` (Webhook), `022_SVC_01` (SevDesk API), `022_FWD_01` (Forward)

### **Teil 3: Versand (Node-IDs: 023\_\***)\*\*

- **[Detaillierte Dokumentation](./Teil3-Versand/README.md)**
- **Zweck**: Versendet Rechnungen über verschiedene Kanäle und verfolgt die Zustellung
- **Webhook-Eingang**: `webhook/invoice-sending`
- **Hauptnodes**: `023_TRG_01` (Webhook), `023_SVC_01` (E-Mail Service), `023_OUT_01` (Output)

### **Vorteile der systematischen Node-IDs:**

- **Bessere Übersichtlichkeit und Wartbarkeit** durch eindeutige Namenskonventionen
- **Vermeidung von Timeout-Problemen** bei komplexen Workflows
- **Einfachere Fehlerbehandlung** und Wiederaufnahme bei Unterbrechungen
- **Möglichkeit zur parallelen Verarbeitung** durch modulare Struktur
- **Flexibilität bei Änderungen** und Erweiterungen ohne Namenskonflikte
- **Eindeutige Referenzierung** bei Debugging und Code-Reviews

## Funktionsweise

### Teil 1: Erfassung

- Erkennt Auslöser für Rechnungserstellung (zeitbasiert, ereignisbasiert, manuell)
- Validiert die SevDesk-Lizenz über Supabase
- Lädt die Workflow-Konfiguration aus Supabase
- Erfasst Rechnungsdaten aus verschiedenen Quellen
- Bereitet Daten für die Rechnungserstellung vor
- Leitet Daten über Webhook an Teil 2 weiter

### Teil 2: Erstellung

- Empfängt Daten über Webhook
- Validiert Webhook-Key und SevDesk-Lizenz
- Lädt die Workflow-Konfiguration aus Supabase
- Erstellt KI-generierte Rechnungstexte mit IONOS AI Hub
- Erstellt Rechnungen in SevDesk mit allen Positionen
- Generiert PDF-Rechnungen
- Leitet Daten über Webhook an Teil 3 weiter

### Teil 3: Versand

- Empfängt Daten über Webhook
- Validiert Webhook-Key und SevDesk-Lizenz
- Lädt die Workflow-Konfiguration aus Supabase
- Versendet Rechnungen über verschiedene Kanäle (E-Mail, Post)
- Speichert Rechnungen revisionssicher in Cloud-Storage
- Aktualisiert den Rechnungsstatus in SevDesk
- Protokolliert alle Aktionen für Audit-Zwecke
- Sendet Benachrichtigungen über Signal

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur die für die Rechnungsstellung notwendigen Kundendaten verwendet
- **Transparenz**: Klare Dokumentation der Datenverarbeitung
- **Aufbewahrungsfristen**: Automatische Löschung nach gesetzlichen Aufbewahrungsfristen
- **Verschlüsselung**: Alle Rechnungsdokumente werden verschlüsselt gespeichert und übertragen
- **Zugriffskontrollen**: Rollenbasierte Zugriffsrechte für alle Systeme
- **Audit-Trails**: Lückenlose Dokumentation aller Verarbeitungsschritte

## Technische Voraussetzungen

- n8n-Installation (Version 0.214.0+)
- SevDesk-Node (v2)
- IONOS AI Hub API-Zugang für KI-generierte Texte
- Supabase PostgreSQL-Datenbank für Lizenzvalidierung und Konfiguration
- E-Mail-Server oder -Dienst für den Versand
- Google Cloud Storage oder Azure Blob Storage für die Archivierung
- Signal-API für Benachrichtigungen

## Konfiguration

Die Workflow-Konfiguration wird zentral in Supabase gespeichert und enthält:

- API-Schlüssel für SevDesk und andere Dienste
- E-Mail-Vorlagen und Rechnungstexte
- Regeln für die Rechnungserstellung
- Benachrichtigungsempfänger
- Logging- und Audit-Einstellungen

Diese zentrale Konfiguration ermöglicht eine einfache Anpassung des Workflows ohne direkte Änderungen an den Workflow-Dateien.

## Produktionsreife Workflow-Dateien

Jeder Teil des Workflows hat seine eigene JSON-Datei mit systematischen Node-IDs:

### **Teil 1: `Teil1-Erfassung/erfassung.json`**

- **Rechnungsdaten-Erfassung und -vorbereitung**
- **Node-ID-Schema**: `021_*` (Kategorie 02, Teil 1)
- **Webhook-Ausgang**: `webhook/invoice-creation`
- **Status**: ✅ Produktionsbereit

### **Teil 2: `Teil2-Erstellung/erstellung.json`**

- **SevDesk-Integration und Rechnungserstellung**
- **Node-ID-Schema**: `022_*` (Kategorie 02, Teil 2)
- **Webhook-Eingang**: `webhook/invoice-creation`
- **Webhook-Ausgang**: `webhook/invoice-sending`
- **Status**: ✅ Produktionsbereit

### **Teil 3: `Teil3-Versand/versand.json`**

- **Rechnungsversand und -verfolgung**
- **Node-ID-Schema**: `023_*` (Kategorie 02, Teil 3)
- **Webhook-Eingang**: `webhook/invoice-sending`
- **Status**: ✅ Produktionsbereit

### **Konfigurationshinweise:**

- **Webhook-URLs**: Anpassung an Ihre n8n-Installation erforderlich
- **API-Credentials**: SevDesk, IONOS AI Hub, E-Mail-Server
- **Supabase-Konfiguration**: Lizenzvalidierung und zentrale Einstellungen
- **Node-IDs**: Bereits systematisch implementiert - keine Änderungen erforderlich
