# Kundenkommunikation - Teil 1: Auslöser (v2)

Dieser Workflow-Teil überwacht SevDesk-Ereignisse und identifiziert Kommunikationsanlässe.

## Funktionsweise

1. **Ereignisüberwachung**:
   - Regelmäßige Abfrage von SevDesk-Daten
   - Erkennung von Änderungen und neuen Ereignissen
   - Zeitgesteuerte Auslöser für geplante Kommunikation

2. **Kommunikationsanlässe identifizieren**:
   - Neue Rechnungen, Aufträge oder Angebote
   - Zahlungseingänge oder überfällige Rechnungen
   - Geburtstage und Jubiläen von Kunden
   - Statusänderungen bei Projekten

3. **Auslöser konfigurieren**:
   - Ereignisbasierte Trigger
   - Zeitgesteuerte Trigger
   - Kundenspezifische Trigger-Regeln

4. **Kundensegmentierung**:
   - Automatische Kategorisierung nach SevDesk-Daten
   - Filterung nach Kundengruppen
   - Priorisierung nach Kundenwert
   - Berücksichtigung von Kommunikationspräferenzen

5. **Datenaufbereitung**:
   - Sammlung relevanter Kundendaten aus SevDesk
   - Anreicherung mit Kontextinformationen
   - Vorbereitung für Nachrichtenerstellung
   - Qualitätsprüfung der Daten

6. **Weiterleitung**:
   - Übermittlung der Trigger-Daten an Teil 2 (Erstellung) via Webhook
   - Sicherung der Übertragung durch Webhook-Key

## Technische Details

- **Trigger**: Schedule, Event-based, API-triggered
- **SevDesk-Integration**: Direkte API v2-Aufrufe
- **Datenverarbeitung**: Event-Detection und Kundensegmentierung
- **Datenübertragung**: Webhook mit Sicherheitsvalidierung
- **Fehlerbehandlung**: Umfassende Protokollierung

## Auslöser-Kategorien

### Ereignisbasierte Auslöser
- **Dokumentenerstellung**: Neue Rechnungen, Angebote, Aufträge
- **Zahlungsevents**: Zahlungseingänge, Überfälligkeiten, Mahnungen
- **Statusänderungen**: Projektabschlüsse, Auftragsstatusänderungen
- **Kundenereignisse**: Neue Kontakte, Adressänderungen

### Zeitgesteuerte Auslöser
- **Geburtstage**: Automatische Geburtstagswünsche
- **Jubiläen**: Kundenjubiläen und Geschäftsjubiläen
- **Erinnerungen**: Wartungstermine, Vertragsablauf
- **Periodische Kommunikation**: Newsletter, Statusupdates

### Kundenspezifische Auslöser
- **VIP-Kunden**: Besondere Behandlung wichtiger Kunden
- **Neue Kunden**: Willkommensnachrichten und Onboarding
- **Inaktive Kunden**: Reaktivierungskampagnen
- **Problemkunden**: Spezielle Betreuung bei Zahlungsproblemen

## Konfiguration

Die Workflow-Konfiguration erfolgt direkt in n8n und umfasst:

- `triggerSettings`: Konfiguration der Auslöser
  - `eventTriggers`: Ereignisbasierte Auslöser
  - `timeTriggers`: Zeitgesteuerte Auslöser
  - `customerTriggers`: Kundenspezifische Auslöser

- `segmentationRules`: Regeln für Kundensegmentierung
  - `vipCustomers`: Definition von VIP-Kunden
  - `customerCategories`: Kundenkategorien
  - `communicationPreferences`: Kommunikationspräferenzen

- `sevdeskIntegration`: SevDesk-spezifische Einstellungen
  - `pollInterval`: Abfrageintervall für Events
  - `dataFilters`: Filter für relevante Daten
  - `apiLimits`: API-Rate-Limiting-Konfiguration

- `webhookSettings`: Weiterleitung an Teil 2
  - `webhookUrl`: URL für Teil 2 (Erstellung)
  - `securityKey`: Webhook-Sicherheitsschlüssel
  - `retrySettings`: Wiederholungslogik bei Fehlern

## Performance-Optimierung

- Effiziente SevDesk-API-Abfragen mit Filterung
- Caching von Kundendaten zur Reduzierung von API-Aufrufen
- Batch-Verarbeitung für mehrere Ereignisse
- Intelligente Priorisierung nach Ereignistyp

## Monitoring

- Verfolgung der erkannten Ereignisse
- Monitoring der SevDesk-API-Performance
- Überwachung der Segmentierungsregeln
- Fehlerprotokollierung und Alerting

## Verbindung zu anderen Workflow-Teilen

- **Output**: Sendet Trigger-Daten an Teil 2 (Erstellung) via Webhook
- **Integration**: Verwendet SevDesk-Daten für Event-Detection

## Skalierbarkeit

- **Kleine Unternehmen**: 10-50 Events/Tag
- **Mittlere Unternehmen**: 100-500 Events/Tag  
- **Große Unternehmen**: 1000+ Events/Tag mit optimierter Verarbeitung
