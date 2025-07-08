# Steuerberater-Export - Teil 2: Aufbereitung (v2)

Dieser Workflow-Teil ist für die Aufbereitung, Validierung und Formatierung der extrahierten Buchhaltungsdaten zuständig.

## Funktionsweise

1. **Webhook-Empfang**:
   - Empfang der extrahierten Daten von Teil 1 (Extraktion)
   - Validierung des Webhook-Keys für sichere Datenübertragung

2. **Lizenzvalidierung**:
   - Überprüfung der SevDesk-Lizenz über Supabase
   - Sicherstellung gültiger API-Zugriffe

3. **Workflow-Konfiguration**:
   - Laden der Konfiguration aus Supabase
   - Dynamische Anpassung der Aufbereitungsparameter

3. **Datenvalidierung**:
   - Prüfung auf Vollständigkeit der extrahierten Daten
   - Identifikation von Unstimmigkeiten und Inkonsistenzen
   - Automatische Korrektur einfacher Fehler

4. **KI-basierte Analyse**:
   - Analyse der Buchhaltungsdaten mit IONOS AI Hub
   - Identifikation von steuerlichen Optimierungsmöglichkeiten
   - Erstellung von Hinweisen für den Steuerberater

5. **DATEV-konforme Formatierung**:
   - Umwandlung der Daten in DATEV-kompatible Formate
   - Erstellung von CSV-Exportdateien
   - Generierung von Buchungssätzen nach SKR03/SKR04

6. **Berichterstellung**:
   - Generierung von Auswertungen und Berichten
   - Erstellung von Zusammenfassungen für verschiedene Zeiträume
   - Aufbereitung von Kennzahlen und Statistiken

8. **Cloud-Speicher-Integration**:
   - Speicherung aller Exportdateien in Google Cloud Storage
   - Strukturierte Ablage nach Zeitraum und Dokumenttyp
   - Revisionssichere Archivierung

9. **Datenbank-Aktualisierung**:
   - Protokollierung in n8n-Workflow-Logs PostgreSQL
   - Speicherung von Metadaten für Audit-Trail

10. **Weiterleitung**:
    - Übermittlung der aufbereiteten Daten an Teil 3 (Übermittlung) via Webhook
    - Sicherung der Übertragung durch Webhook-Key

11. **Fehlerbehandlung**:
    - Protokollierung in n8n-Workflow-Logs
    - E-Mail-Benachrichtigung an Support
    - Signal-Benachrichtigung für kritische Fehler

## Technische Details

- **Trigger**: Webhook von Teil 1 (Extraktion)
- **KI-Integration**: IONOS AI Hub für Datenanalyse und Optimierungsvorschläge
- **Cloud-Speicher**: Google Cloud Storage für revisionssichere Archivierung
- **Datenbank**: Supabase PostgreSQL für Logging und Audit-Trail
- **Datenübertragung**: Webhook mit Sicherheitsvalidierung
- **Fehlerbehandlung**: PostgreSQL-Logging, E-Mail, Signal

## Steuerliche Aspekte

- Unterstützung verschiedener Kontenrahmen (SKR03, SKR04)
- Berücksichtigung von EÜR oder Bilanzierung
- Aufbereitung für Umsatzsteuervoranmeldung und Jahreserklärungen
- Korrekte Behandlung von GWG, Anlagegütern und Abschreibungen

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur steuerlich relevante Daten verarbeitet
- **Verschlüsselung**: Alle Daten werden verschlüsselt gespeichert und übertragen
- **Zugriffskontrollen**: Webhook-Key-Validierung und rollenbasierte Zugriffsrechte
- **Audit-Trail**: Lückenlose Dokumentation aller Aufbereitungsschritte

## Konfiguration

Die Workflow-Konfiguration wird aus n8n-Umgebungsvariablen geladen und enthält folgende Parameter:

- `datevSettings`: Konfiguration für DATEV-Export
  - `accountingSystem`: Kontenrahmen (SKR03/SKR04)
  - `clientNumber`: DATEV-Mandantennummer
  - `consultantNumber`: DATEV-Beraternummer
- `reportingSettings`: Konfiguration für Berichterstellung
- `cloudStorage`: Konfiguration für Google Cloud Storage
- `webhookUrls`: URLs für die Weiterleitung an andere Workflow-Teile
- `aiHubSettings`: Konfiguration für die KI-Analyse

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt Daten von Teil 1 (Extraktion) via Webhook
- **Output**: Sendet Daten an Teil 3 (Übermittlung) via Webhook
