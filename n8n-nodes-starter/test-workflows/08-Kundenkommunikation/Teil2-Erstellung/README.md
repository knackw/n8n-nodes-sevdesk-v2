# Kundenkommunikation - Teil 2: Erstellung (v2)

Dieser Workflow-Teil erstellt personalisierte Nachrichten basierend auf SevDesk-Daten und Trigger-Informationen.

## Funktionsweise

1. **Trigger-Verarbeitung**:
   - Empfang von Webhook-Daten aus Teil 1 (Auslöser)
   - Validierung der eingehenden Daten
   - Sicherheitsüberprüfung durch Webhook-Key

2. **SevDesk-Datenabfrage**:
   - Abruf aktueller Kundendaten
   - Sammlung relevanter Geschäftsdaten
   - Prüfung auf Datenaktualität

3. **Template-Auswahl**:
   - Automatische Template-Selektion basierend auf Ereignistyp
   - Kundensegment-spezifische Vorlagen
   - Kommunikationskanal-optimierte Templates

4. **Personalisierung**:
   - Dynamische Inhalte basierend auf SevDesk-Daten
   - Personalisierte Ansprache und Inhalte
   - Kundenhistorie-basierte Anpassungen

5. **Content-Generierung**:
   - Erstellung der finalen Nachricht
   - Multi-Format-Support (E-Mail, SMS, WhatsApp)
   - Qualitätskontrolle der generierten Inhalte

6. **Weiterleitung**:
   - Übermittlung der fertigen Nachricht an Teil 3 (Versand) via Webhook
   - Beifügung aller relevanten Metadaten

## Technische Details

- **Input**: Webhook von Teil 1 mit Trigger-Daten
- **SevDesk-Integration**: Direkte API v2-Aufrufe für Kundendaten
- **Template-Engine**: Dynamische Content-Generierung
- **Output**: Webhook an Teil 3 mit fertiger Nachricht
- **Fehlerbehandlung**: Retry-Logik und Fallback-Templates

## Template-Kategorien

### Ereignisbasierte Templates
- **Rechnungsstellung**: Rechnungsversand, Zahlungserinnerung
- **Auftragsmanagement**: Auftragsbestätigung, Statusupdates
- **Projektabschluss**: Abschlussmitteilungen, Feedback-Anfragen
- **Zahlungseingang**: Dankesnachrichten, Quittungsbestätigungen

### Zeitgesteuerte Templates
- **Geburtstage**: Personalisierte Geburtstagswünsche
- **Jubiläen**: Geschäftsjubiläen und Kundenbeziehung
- **Saisonale Grüße**: Feiertage und besondere Anlässe
- **Newsletter**: Regelmäßige Updates und Informationen

### Kundenspezifische Templates
- **VIP-Kunden**: Exklusive Kommunikation und Angebote
- **Neue Kunden**: Willkommensnachrichten und Onboarding
- **Stammkunden**: Loyalitätsprogramme und Anerkennungen
- **Support**: Serviceorientierte Kommunikation

## Personalisierungsfelder

### Kundendaten aus SevDesk
- Name, Firma und Ansprechpartner
- Adresse und Kontaktinformationen
- Kundenummer und Kundenstatus
- Geschäftsbeziehungsdauer

### Transaktionsdaten
- Rechnungs- und Auftragsinformationen
- Zahlungshistorie und -verhalten
- Produktkäufe und Dienstleistungen
- Umsatzentwicklung

### Kontextuelle Informationen
- Aktuelle Saison und Datum
- Branche und Geschäftsbereich
- Kommunikationspräferenzen
- Vorherige Kommunikation

## Konfiguration

Die Workflow-Konfiguration erfolgt direkt in n8n und umfasst:

- `templateSettings`: Template-Konfiguration
  - `templateLibrary`: Verfügbare Templates nach Kategorie
  - `selectionRules`: Regeln für automatische Template-Auswahl
  - `fallbackTemplates`: Standard-Templates bei Fehlern

- `personalizationRules`: Personalisierungseinstellungen
  - `dataMapping`: Zuordnung von SevDesk-Feldern zu Template-Variablen
  - `contentRules`: Regeln für dynamische Inhalte
  - `formatSettings`: Format-spezifische Anpassungen

- `qualityControl`: Qualitätssicherung
  - `contentValidation`: Validierungsregeln für Inhalte
  - `lengthLimits`: Längenbeschränkungen nach Kanal
  - `approvalWorkflow`: Optionale Freigabeprozesse

- `sevdeskIntegration`: SevDesk-spezifische Einstellungen
  - `dataQueries`: Vordefinierte Abfragen für Kundendaten
  - `cacheSettings`: Caching-Einstellungen für Performance
  - `apiLimits`: Rate-Limiting-Konfiguration

## Content-Generation

### E-Mail-Nachrichten
- HTML und Plain-Text-Versionen
- Responsive Design für mobile Geräte
- Automatische Link-Verfolgung
- Personalisierte Betreffzeilen

### SMS-Nachrichten
- Zeichenlimit-optimierte Inhalte
- URL-Verkürzung für Links
- Opt-out-Mechanismen
- Zeitzonengerechte Zustellung

### WhatsApp Business
- Rich Media Support (Bilder, PDFs)
- Template-konforme Nachrichten
- Interactive Messages
- Chatbot-Integration

## Performance-Optimierung

- Template-Caching für häufig verwendete Vorlagen
- Batch-Verarbeitung für mehrere Nachrichten
- Asynchrone SevDesk-API-Aufrufe
- Intelligente Priorisierung nach Dringlichkeit

## Monitoring

- Verfolgung der Template-Performance
- Monitoring der Generierungszeiten
- Qualitätskontrolle der erstellten Inhalte
- Fehlerprotokollierung und Alerting

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt Trigger-Daten von Teil 1 (Auslöser) via Webhook
- **Output**: Sendet fertige Nachrichten an Teil 3 (Versand) via Webhook
- **Integration**: Nutzt SevDesk-Daten für Personalisierung

## Skalierbarkeit

- **Kleine Unternehmen**: 50-200 Nachrichten/Tag
- **Mittlere Unternehmen**: 500-2000 Nachrichten/Tag
- **Große Unternehmen**: 5000+ Nachrichten/Tag mit optimierter Template-Engine
