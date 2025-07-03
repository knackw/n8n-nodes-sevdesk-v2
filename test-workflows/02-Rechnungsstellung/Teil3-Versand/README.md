# Rechnungsstellung: Teil 3 - Versand

Dieser Workflow ist der dritte Teil des modularen Rechnungsstellung-Workflows und verantwortlich für den Versand der Rechnungen über verschiedene Kanäle sowie die revisionssichere Archivierung.

## Funktionsweise

Der Workflow empfängt Daten von Teil 2 (Erstellung) über einen Webhook und versendet die Rechnung an den Kunden:

1. **Datenempfang**:
   - Empfang der Rechnungsdaten über Webhook
   - Validierung des Webhook-Keys zur Sicherstellung der Authentizität
   - Extraktion der Rechnungsdaten und PDF-URL aus dem JSON-Payload

2. **Lizenzvalidierung**:
   - Überprüfung der SevDesk-Lizenz über Supabase
   - Sicherstellung, dass der Workflow nur für gültige Lizenzen ausgeführt wird
   - Protokollierung der Lizenzprüfung

3. **Workflow-Konfiguration**:
   - Laden der aktuellen Workflow-Konfiguration aus Supabase
   - Anwendung kundenspezifischer Einstellungen für den Versand
   - Berücksichtigung von Sonderregeln und Versandpräferenzen

4. **Versandvorbereitung**:
   - Bestimmung des optimalen Versandkanals basierend auf Kundeneinstellungen
   - Vorbereitung der E-Mail-Vorlagen oder Briefpost-Daten
   - Anpassung der Betreffzeilen und Anschreiben
   - Hinzufügen von Anhängen und Zusatzinformationen

5. **Rechnungsversand**:
   - E-Mail-Versand mit PDF-Anhang
   - Optional: Versand per Post über Drittanbieter-API
   - Versand von Zahlungserinnerungen über verschiedene Kanäle
   - Berücksichtigung von Kundenpräferenzen

6. **Archivierung**:
   - Revisionssichere Speicherung der Rechnung in Google Cloud Storage
   - Verschlüsselung sensibler Daten
   - Einhaltung gesetzlicher Aufbewahrungsfristen
   - Metadaten-Indexierung für schnellen Zugriff

7. **Nachverfolgung und Dokumentation**:
   - Aktualisierung des Rechnungsstatus in SevDesk
   - Protokollierung des Versands in Supabase
   - Erstellung eines Audit-Trails für DSGVO-Konformität
   - Benachrichtigung über Signal bei erfolgreichem Versand

## Technische Details

### Eingabedaten

JSON-Struktur mit folgenden Hauptelementen:
- `invoice_id`: SevDesk-Rechnungs-ID
- `invoice_number`: Generierte Rechnungsnummer
- `pdf_url`: URL zur generierten PDF-Rechnung
- `customer`: Kundendaten mit Kontaktinformationen
- `items`: Verarbeitete Rechnungspositionen
- `metadata`: Zusätzliche Informationen für die Verarbeitung
- `webhook_key`: Sicherheitsschlüssel für die Kommunikation

### Ausgabedaten

- Protokolleinträge in Supabase mit Versandstatus
- Aktualisierte Rechnungsdaten in SevDesk
- Archivierte Dokumente in Cloud Storage
- Benachrichtigungen über Signal

### Integrationen

- SevDesk API v2 für die Statusaktualisierung
- E-Mail-Server oder -Dienst für den Versand
- API für Briefpost-Versand (optional)
- Google Cloud Storage oder Azure Blob Storage für die Archivierung
- Signal-API für Benachrichtigungen
- Supabase für Lizenzvalidierung, Konfiguration und Logging

## Versandkanäle

1. **E-Mail**:
   - Personalisierte E-Mail-Vorlagen
   - PDF-Rechnung als Anhang
   - Tracking von Öffnungs- und Klickraten
   - Automatische Wiederholung bei Zustellproblemen

2. **Briefpost** (optional):
   - Integration mit Drittanbieter-APIs für den physischen Versand
   - Tracking der Zustellung
   - Automatische Adressvalidierung

3. **Kundenportal** (optional):
   - Bereitstellung der Rechnung im Kundenportal
   - Benachrichtigung des Kunden über neue Dokumente
   - Sicherer Zugriff mit Authentifizierung

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur die für den Versand notwendigen Daten verwendet
- **Zweckbindung**: Daten werden ausschließlich für den Rechnungsversand verwendet
- **Transparenz**: Klare Dokumentation des Versandprozesses
- **Verschlüsselung**: Alle Daten werden verschlüsselt übertragen und gespeichert
- **Aufbewahrungsfristen**: Automatische Löschung nach gesetzlichen Aufbewahrungsfristen
- **Audit-Trails**: Lückenlose Dokumentation aller Versandaktivitäten

## Konfiguration

Die Konfiguration erfolgt über die zentrale Supabase-Datenbank und umfasst:

1. **Versandeinstellungen**:
   - E-Mail-Server-Konfiguration
   - API-Schlüssel für Briefpost-Dienste
   - Versandpräferenzen pro Kunde

2. **E-Mail-Vorlagen**:
   - Personalisierte Vorlagen für verschiedene Kundengruppen
   - Mehrsprachige Vorlagen
   - Corporate Design-Elemente

3. **Archivierungseinstellungen**:
   - Cloud-Storage-Zugangsdaten
   - Aufbewahrungsfristen
   - Verschlüsselungseinstellungen

4. **Benachrichtigungen**:
   - Signal-Kontakte für Benachrichtigungen
   - Benachrichtigungsregeln und -schwellenwerte

## Fehlerbehandlung

- Umfassende Protokollierung aller Fehler in Supabase
- Automatische Benachrichtigung bei kritischen Fehlern über Signal
- Wiederholungsversuche bei temporären Versandproblemen
- Fallback-Mechanismen für alternative Versandwege bei Ausfällen
