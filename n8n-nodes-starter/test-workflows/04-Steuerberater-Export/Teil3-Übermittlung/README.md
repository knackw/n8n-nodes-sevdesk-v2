# Steuerberater-Export - Teil 3: Übermittlung (v2)

Dieser Workflow-Teil ist für die sichere Übermittlung der aufbereiteten Buchhaltungsdaten an den Steuerberater zuständig.

## Funktionsweise

1. **Webhook-Empfang**:
   - Empfang der aufbereiteten Daten von Teil 2 (Aufbereitung)
   - Validierung des Webhook-Keys für sichere Datenübertragung

2. **Workflow-Konfiguration**:
   - Laden der Konfiguration aus n8n-Umgebungsvariablen
   - Dynamische Anpassung der Übermittlungsparameter

3. **Übermittlungsvorbereitung**:
   - Zusammenstellung aller Exportdateien und Berichte
   - Erstellung einer Übersicht der übermittelten Dokumente
   - Generierung eines Begleitschreibens mit KI-Unterstützung

4. **Verschlüsselung**:
   - Ende-zu-Ende-Verschlüsselung aller zu übermittelnden Daten
   - Verwendung der öffentlichen Schlüssel des Steuerberaters
   - Sicherstellung der DSGVO-Konformität

5. **Übermittlungswege**:
   - Auswahl des konfigurierten Übermittlungswegs:
     - Verschlüsselte E-Mail mit Anhängen
     - DATEV-Schnittstelle (direkte Übermittlung)
     - Sicherer Cloud-Speicher mit Zugriffslink
     - Andere konfigurierte Übermittlungswege

6. **Übermittlungsbestätigung**:
   - Anforderung von Lesebestätigungen
   - Protokollierung der erfolgreichen Übermittlung
   - Erstellung von Nachweisen für Compliance-Zwecke

7. **Datenbank-Aktualisierung**:
   - Protokollierung des Übermittlungsstatus in n8n-Workflow-Logs
   - Aktualisierung des Audit-Trails
   - Speicherung von Übermittlungsnachweisen

8. **Benachrichtigungen**:
   - E-Mail-Benachrichtigung an Unternehmensverantwortliche
   - Signal-Benachrichtigung über erfolgreiche Übermittlung
   - DSGVO-konforme Kommunikation

9. **Nachverfolgung**:
   - Erstellung von Erinnerungen für ausstehende Rückmeldungen
   - Planung des nächsten Exportzyklus
   - Dokumentation offener Punkte für den Steuerberater

10. **Fehlerbehandlung**:
    - Protokollierung von Fehlern in n8n-Workflow-Logs
    - E-Mail-Benachrichtigung an Support
    - Signal-Benachrichtigung für kritische Fehler
    - Automatische Wiederholungsversuche bei Übermittlungsfehlern

## Technische Details

- **Trigger**: Webhook von Teil 2 (Aufbereitung)
- **KI-Integration**: IONOS AI Hub für Begleitschreiben-Generierung
- **Verschlüsselung**: PGP/GPG für Ende-zu-Ende-Verschlüsselung
- **Übermittlung**: E-Mail, DATEV-API, Cloud-Speicher-Links
- **Datenbank**: n8n-Workflow-Logs für Logging und Audit-Trail
- **Kommunikation**: E-Mail für Bestätigungen, Signal für Benachrichtigungen
- **Fehlerbehandlung**: n8n-Workflow-Logging, E-Mail, Signal

## Steuerliche Aspekte

- Einhaltung gesetzlicher Fristen für Steuerberater-Übermittlungen
- Dokumentation der Übermittlung für Nachweiszwecke
- Berücksichtigung besonderer Anforderungen je nach Steuerart
- Unterstützung für verschiedene Steuerberater-Systeme

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur steuerlich relevante Daten übermittelt
- **Verschlüsselung**: Ende-zu-Ende-Verschlüsselung bei der Datenübermittlung
- **Zugriffskontrollen**: Sichere Übermittlungswege mit Authentifizierung
- **Audit-Trail**: Lückenlose Dokumentation aller Übermittlungsschritte
- **Löschkonzept**: Automatische Löschung temporärer Übermittlungsdaten

## Konfiguration

Die Workflow-Konfiguration wird aus n8n-Umgebungsvariablen geladen und enthält folgende Parameter:

- `taxAdvisorInfo`: Informationen zum Steuerberater
  - `name`: Name des Steuerberaters/der Kanzlei
  - `email`: E-Mail-Adresse für Übermittlung
  - `publicKey`: Öffentlicher Schlüssel für Verschlüsselung
  - `preferredMethod`: Bevorzugter Übermittlungsweg
- `datevSettings`: Konfiguration für DATEV-Übermittlung
- `emailSettings`: Konfiguration für E-Mail-Übermittlung
- `notificationRecipients`: E-Mail-Empfänger für Benachrichtigungen
- `reminderSettings`: Konfiguration für Nachverfolgung und Erinnerungen

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt Daten von Teil 2 (Aufbereitung) via Webhook
