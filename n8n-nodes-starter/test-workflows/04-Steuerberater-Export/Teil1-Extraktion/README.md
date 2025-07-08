# Steuerberater-Export - Teil 1: Extraktion (v2)

Dieser Workflow-Teil ist für die zeitgesteuerte Extraktion von Buchhaltungsdaten aus SevDesk zuständig.

## Funktionsweise

1. **Auslöser**:
   - Zeitgesteuerter Trigger (monatlich, quartalsweise oder jährlich)
   - Manueller Trigger für bedarfsgesteuerte Exporte
   - Webhook für Integration mit anderen Systemen

2. **Lizenzvalidierung**:
   - Überprüfung der SevDesk-Lizenz über Supabase
   - Sicherstellung gültiger API-Zugriffe

3. **Workflow-Konfiguration**:
   - Laden der Konfiguration aus Supabase
   - Dynamische Anpassung der Exportparameter

3. **Zeitraum-Bestimmung**:
   - Automatische Erkennung des relevanten Exportzeitraums
   - Berücksichtigung von Geschäftsjahr und steuerlichen Perioden
   - Unterstützung für verschiedene Zeiträume (Monat, Quartal, Jahr)

4. **Datenextraktion aus SevDesk**:
   - Abruf aller Belege im Zeitraum
   - Abruf aller Rechnungen (ein- und ausgehend)
   - Abruf aller Kontobewegungen
   - Abruf von Stammdaten (Kunden, Lieferanten, Konten)
   - Abruf von Anlagegütern und Abschreibungen

5. **Metadaten-Erfassung**:
   - Sammlung von Informationen zum Unternehmen
   - Erfassung der Steuerberater-Kontaktdaten
   - Dokumentation des Exportzeitraums und -umfangs

6. **Weiterleitung**:
   - Übermittlung der extrahierten Daten an Teil 2 (Aufbereitung) via Webhook
   - Sicherung der Übertragung durch Webhook-Key

8. **Fehlerbehandlung**:
   - Protokollierung in n8n-Workflow-Logs
   - E-Mail-Benachrichtigung an Support
   - Signal-Benachrichtigung für kritische Fehler

## Technische Details

- **Trigger**: Schedule (monatlich, quartalsweise, jährlich), Manual, Webhook
- **SevDesk-API**: Umfassender Datenabruf über verschiedene Endpunkte
- **Datenübertragung**: Webhook mit Sicherheitsvalidierung
- **Fehlerbehandlung**: PostgreSQL-Logging, E-Mail, Signal

## Steuerliche Aspekte

- Berücksichtigung des Geschäftsjahres (kann vom Kalenderjahr abweichen)
- Unterstützung verschiedener Unternehmensformen (Einzelunternehmen, GmbH, etc.)
- Anpassung an EÜR oder Bilanzierung
- Berücksichtigung von Umsatzsteuervoranmeldungszeiträumen

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur steuerlich relevante Daten extrahiert
- **Verschlüsselung**: Alle Daten werden verschlüsselt übertragen
- **Zugriffskontrollen**: Webhook-Key-Validierung für sichere Datenübertragung
- **Audit-Trail**: Lückenlose Dokumentation aller Extraktionsschritte

## Konfiguration

Die Workflow-Konfiguration wird aus n8n-Umgebungsvariablen geladen und enthält folgende Parameter:

- `exportPeriods`: Konfiguration der Exportzeiträume
  - `type`: Art des Exports (monatlich, quartalsweise, jährlich)
  - `fiscalYearStart`: Beginn des Geschäftsjahres (Monat)
- `taxAdvisorInfo`: Informationen zum Steuerberater
- `companyInfo`: Unternehmensinformationen
- `webhookUrls`: URLs für die Weiterleitung an andere Workflow-Teile

## Verbindung zu anderen Workflow-Teilen

- **Output**: Sendet Daten an Teil 2 (Aufbereitung) via Webhook
