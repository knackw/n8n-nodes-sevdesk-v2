# Rechnungsstellung - Teil 1: Erfassung (v2)

Dieser Workflow-Teil ist für die Erfassung und Validierung von Rechnungsdaten zuständig.

## Funktionsweise

1. **Auslöser**:
   - Zeitgesteuerter Trigger für wiederkehrende Rechnungen
   - Webhook für externe Anfragen
   - Manueller Trigger für direkte Eingaben

2. **Datenerfassung**:
   - Sammlung aller notwendigen Rechnungsinformationen
   - Validierung der Eingabedaten
   - Zuordnung zu SevDesk-Objekten (Kontakte, Artikel)

3. **Kundenvalidierung**:
   - Überprüfung der Kundendaten in SevDesk
   - Automatische Anlage neuer Kontakte bei Bedarf
   - Validierung der Rechnungsadresse

4. **Artikelvalidierung**:
   - Überprüfung der zu rechnenden Artikel/Dienstleistungen
   - Automatische Preisermittlung
   - Bestandsprüfung bei physischen Artikeln

5. **Rechnungslogik**:
   - Berechnung von Netto- und Bruttobeträgen
   - Ermittlung der korrekten Steuersätze
   - Anwendung von Rabatten und Sonderkonditionen

6. **Datenvalidierung**:
   - Vollständigkeitsprüfung aller Pflichtfelder
   - Plausibilitätsprüfung der Beträge
   - Format- und Datentyp-Validierung

7. **Weiterleitung**:
   - Übermittlung der validierten Daten an Teil 2 (Erstellung) via Webhook
   - Sicherung der Übertragung durch Webhook-Key

## Technische Details

- **Trigger**: Schedule, Webhook, manuell
- **Datenvalidierung**: Umfassende Prüfung aller Eingaben
- **SevDesk-Integration**: Direkte API v2-Aufrufe
- **Datenübertragung**: Webhook mit Sicherheitsvalidierung
- **Fehlerbehandlung**: Umfassende Protokollierung

## Eingabedaten

Der Workflow erwartet folgende Eingabedaten:

```json
{
  "customer": {
    "id": "123",
    "name": "Musterfirma GmbH",
    "address": "Musterstraße 1, 12345 Musterstadt"
  },
  "items": [
    {
      "partId": "456",
      "quantity": 2,
      "price": 100.00,
      "description": "Beratungsleistung"
    }
  ],
  "settings": {
    "paymentTerms": "14 Tage netto",
    "discount": 0,
    "notes": "Zusätzliche Hinweise"
  },
  "metadata": {
    "orderNumber": "ORD-2024-001",
    "project": "Kundenprojekt Alpha"
  }
}
```

### Ausgabedaten

Nach erfolgreicher Verarbeitung werden folgende Daten an Teil 2 weitergeleitet:

- `invoiceData`: Vollständige Rechnungsdaten für SevDesk
- `customer`: Validierte Kundendaten
- `items`: Validierte Artikeldaten mit aktuellen Preisen
- `calculations`: Berechnete Beträge (Netto, Steuer, Brutto)
- `settings`: Rechnungseinstellungen (Zahlungsbedingungen, Rabatte, etc.)
- `metadata`: Zusätzliche Informationen für die Verarbeitung
- `webhook_key`: Sicherheitsschlüssel für die Kommunikation

### Integrationen

- SevDesk API v2 für Kundendaten und Leistungen
- Webhook für die Weiterleitung an Teil 2

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur die für die Rechnungsstellung notwendigen Kundendaten erfasst
- **Zweckbindung**: Daten werden ausschließlich für die Rechnungsstellung verwendet
- **Transparenz**: Klare Dokumentation der Datenverarbeitung
- **Verschlüsselung**: Alle Daten werden verschlüsselt übertragen
- **Protokollierung**: Alle Zugriffe werden für Audit-Zwecke protokolliert

## Konfiguration

Die Konfiguration erfolgt direkt im n8n-Workflow und umfasst:

1. **API-Konfiguration**:
   - SevDesk API-Credentials
   - Webhook-URLs für die Kommunikation mit Teil 2

2. **Rechnungsregeln**:
   - Vorlagen für wiederkehrende Rechnungen
   - Regeln für automatische Rabatte
   - Zahlungsbedingungen

3. **Zeitpläne**:
   - Konfiguration der zeitbasierten Auslöser
   - Festlegung von Rechnungszyklen

4. **Benachrichtigungen**:
   - E-Mail-Adressen für Fehlerberichte
   - Erfolgsbenachrichtigungen

## Fehlerbehandlung

- Umfassende Protokollierung aller Fehler
- Automatische Benachrichtigung bei kritischen Fehlern
- Wiederholungsversuche bei temporären Fehlern
- Fallback-Mechanismen für fehlende Daten

## Verbindung zu anderen Workflow-Teilen

- **Output**: Sendet Daten an Teil 2 (Erstellung) via Webhook
- **Input**: Kann Daten von externen Systemen via Webhook empfangen

## Performance-Optimierung

- Caching von häufig verwendeten SevDesk-Daten
- Batch-Verarbeitung bei vielen gleichzeitigen Rechnungen
- Asynchrone Verarbeitung für bessere Responsivität
- Efficient API-Aufrufe mit Pagination bei großen Datenmengen

## Monitoring

- Verfolgung der Verarbeitungszeiten
- Monitoring der SevDesk API-Antwortzeiten
- Überwachung der Erfolgs- und Fehlerquoten
- Alerting bei Systemausfällen oder hohen Fehlerquoten
