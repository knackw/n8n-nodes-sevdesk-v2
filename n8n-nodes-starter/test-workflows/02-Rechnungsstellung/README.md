# Modularer Rechnungsstellung-Workflow für SevDesk

Dieser Workflow automatisiert den Prozess der Rechnungserstellung und des Rechnungsversands in SevDesk unter Einhaltung der DSGVO-Richtlinien. Der Workflow ist in drei separate Module aufgeteilt, die über Webhooks miteinander kommunizieren.

## Modulare Struktur

Der Rechnungsstellung-Workflow besteht aus drei separaten Teilen:

1. **[Teil1-Erfassung](./Teil1-Erfassung/README.md)**: Erfasst Rechnungsdaten aus verschiedenen Quellen und bereitet sie für die Verarbeitung vor
2. **[Teil2-Erstellung](./Teil2-Erstellung/README.md)**: Erstellt Rechnungen in SevDesk mit KI-unterstützter Inhaltsgenerierung
3. **[Teil3-Versand](./Teil3-Versand/README.md)**: Versendet Rechnungen über verschiedene Kanäle und verfolgt die Zustellung

Diese modulare Struktur bietet mehrere Vorteile:
- Bessere Übersichtlichkeit und Wartbarkeit
- Vermeidung von Timeout-Problemen bei komplexen Workflows
- Einfachere Fehlerbehandlung und Wiederaufnahme bei Unterbrechungen
- Möglichkeit zur parallelen Verarbeitung
- Flexibilität bei Änderungen und Erweiterungen

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

## Workflow-Dateien

Jeder Teil des Workflows hat seine eigene JSON-Datei zum Import in Ihre n8n-Instanz:

- `Teil1-Erfassung.json`
- `Teil2-Erstellung.json`
- `Teil3-Versand.json`
