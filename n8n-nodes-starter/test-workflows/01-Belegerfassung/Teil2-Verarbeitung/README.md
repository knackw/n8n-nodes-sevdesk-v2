# Belegerfassung - Teil 2: Verarbeitung (v2)

Dieser Workflow-Teil ist für die Verarbeitung der erfassten Belege und deren Integration in SevDesk zuständig.

## Funktionsweise

1. **Webhook-Empfang**:
   - Empfang der Dokumentendaten von Teil 1 (Erfassung)
   - Validierung des Webhook-Keys für sichere Datenübertragung

2. **Workflow-Konfiguration**:
   - Laden der Konfiguration aus n8n-Umgebungsvariablen
   - Dynamische Anpassung der Verarbeitungsparameter

3. **Beleg-Daten-Vorbereitung**:
   - Bestimmung des Beleg-Typs basierend auf KI-Analyse
   - Extraktion von Lieferanten-, Datums- und Betrags-Informationen
   - Strukturierung der Daten für SevDesk

4. **KI-Beschreibungsgenerierung**:
   - Erstellung einer präzisen Belegbeschreibung mit IONOS AI Hub
   - Optimierung für Buchhaltungszwecke

5. **SevDesk-Beleg-Erstellung**:
   - Anlage eines neuen Belegs in SevDesk
   - Zuordnung zu korrektem Lieferanten und Belegtyp
   - Upload des Original-Dokuments

6. **Cloud-Speicher-Integration**:
   - Archivierung des Belegs in Google Cloud Storage
   - Strukturierte Ablage nach Lieferant und Datum

7. **Datenbank-Aktualisierung**:
   - Protokollierung in n8n-Workflow-Logs
   - Speicherung von Metadaten für Audit-Trail

8. **Weiterleitung**:
   - Übermittlung der Daten an Teil 3 (Validierung) via Webhook
   - Sicherung der Übertragung durch Webhook-Key

9. **Fehlerbehandlung**:
    - Protokollierung in n8n-Workflow-Logs
    - E-Mail-Benachrichtigung an Support
    - Signal-Benachrichtigung für kritische Fehler

## Technische Details

- **Trigger**: Webhook von Teil 1 (Erfassung)
- **KI-Integration**: IONOS AI Hub für Beschreibungsgenerierung
- **SevDesk-API**: Beleg-Erstellung und Dokumenten-Upload
- **Cloud-Speicher**: Google Cloud Storage für Dokumentenarchivierung
- **Datenbank**: n8n-Workflow-Logs für Logging und Audit-Trail
- **Datenübertragung**: Webhook mit Sicherheitsvalidierung
- **Fehlerbehandlung**: n8n-Workflow-Logging, E-Mail, Signal

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur die für die Buchhaltung notwendigen Daten verarbeitet
- **Verschlüsselung**: Alle Dokumente werden verschlüsselt gespeichert
- **Zugriffskontrollen**: Webhook-Key-Validierung und rollenbasierte Zugriffsrechte
- **Audit-Trail**: Lückenlose Dokumentation aller Verarbeitungsschritte

## Konfiguration

Die Workflow-Konfiguration wird aus n8n-Umgebungsvariablen geladen und enthält folgende Parameter:

- `cloudStorage`: Konfiguration für Google Cloud Storage
- `webhookUrls`: URLs für die Weiterleitung an andere Workflow-Teile
- `aiHubSettings`: Konfiguration für die KI-Beschreibungsgenerierung

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt Daten von Teil 1 (Erfassung) via Webhook
- **Output**: Sendet Daten an Teil 3 (Validierung) via Webhook
