# Banktransaktionen - Teil 3: Buchung (v2)

Dieser Workflow-Teil ist für die automatische oder manuelle Buchung der kategorisierten Banktransaktionen in SevDesk zuständig.

## Funktionsweise

1. **Webhook-Empfang**:
   - Empfang der kategorisierten Transaktionen von Teil 2 (Kategorisierung)
   - Validierung des Webhook-Keys für sichere Datenübertragung

2. **Lizenzvalidierung**:
   - Überprüfung der SevDesk-Lizenz über Supabase
   - Sicherstellung gültiger API-Zugriffe

3. **Workflow-Konfiguration**:
   - Laden der Konfiguration aus Supabase
   - Dynamische Anpassung der Buchungsparameter

3. **Buchungsvorschläge**:
   - Generierung von Buchungsvorschlägen basierend auf Kategorisierung
   - Berücksichtigung von Kontenrahmen und Buchungsregeln
   - Vorschläge für Kostenstellen und Projekte
   - Berechnung von Steuerbeträgen

4. **Validierung**:
   - Prüfung der Buchungsvorschläge auf Konsistenz
   - Validierung gegen Kontenrahmen und Steuerregeln
   - Identifikation potenzieller Probleme oder Unstimmigkeiten
   - Sicherstellung der Einhaltung buchhalterischer Standards

5. **Buchungsprozess**:
   - Automatische Buchung bei hoher Konfidenz
   - Weiterleitung an manuelle Prüfung bei Unsicherheiten
   - Erstellung von Buchungssätzen in SevDesk
   - Aktualisierung von Kontoständen

6. **Belegzuordnung**:
   - Verknüpfung der Buchungen mit relevanten Belegen
   - Markierung von Rechnungen als bezahlt
   - Aktualisierung des Zahlungsstatus in SevDesk
   - Dokumentation der Zuordnungen

8. **Dokumentation**:
   - Revisionssichere Dokumentation aller Buchungen
   - Speicherung von Buchungsbelegen in Google Cloud Storage
   - Erstellung eines Audit-Trails für alle Entscheidungen
   - DSGVO-konforme Archivierung

9. **Datenbank-Aktualisierung**:
   - Protokollierung in n8n-Workflow-Logs
   - Aktualisierung des Transaktionsstatus
   - Speicherung von Metadaten für Reporting

10. **Benachrichtigungen**:
    - E-Mail-Benachrichtigung über abgeschlossene Buchungen
    - Signal-Benachrichtigung bei manuellen Prüfungen
    - Hinweise auf besondere Transaktionen oder Auffälligkeiten

11. **Fehlerbehandlung**:
    - Protokollierung in n8n-Workflow-Logs
    - E-Mail-Benachrichtigung an Support
    - Signal-Benachrichtigung für kritische Fehler
    - Automatische Wiederholungsversuche bei API-Fehlern

## Technische Details

- **Trigger**: Webhook von Teil 2 (Kategorisierung)
- **SevDesk-API**: Erstellung von Buchungssätzen und Aktualisierung von Rechnungen
- **Cloud-Speicher**: Google Cloud Storage für revisionssichere Archivierung
- **Datenbank**: Supabase PostgreSQL für Logging und Audit-Trail
- **Kommunikation**: E-Mail für Bestätigungen, Signal für Benachrichtigungen
- **Fehlerbehandlung**: PostgreSQL-Logging, E-Mail, Signal

## Buchhalterische Aspekte

- Unterstützung verschiedener Kontenrahmen (SKR03, SKR04)
- Berücksichtigung von EÜR oder Bilanzierung
- Korrekte Behandlung von Umsatzsteuer und Vorsteuer
- Unterstützung für Kostenstellen und Projekte
- Behandlung von Fremdwährungen und Wechselkursen

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur buchhalterisch relevante Daten verarbeitet
- **Verschlüsselung**: Alle Daten werden verschlüsselt gespeichert
- **Zugriffskontrollen**: Rollenbasierte Zugriffsrechte für Buchungsdaten
- **Audit-Trail**: Lückenlose Dokumentation aller Buchungsschritte
- **Löschkonzept**: Automatische Löschung temporärer Buchungsdaten

## Konfiguration

Die Workflow-Konfiguration wird aus n8n-Umgebungsvariablen geladen und enthält folgende Parameter:

- `bookingRules`: Regeln für die automatische Buchung
  - `confidenceThreshold`: Schwellenwert für automatische Buchung
  - `accountingSystem`: Kontenrahmen (SKR03/SKR04)
  - `defaultAccounts`: Standard-Konten für verschiedene Kategorien
- `taxSettings`: Konfiguration für Steuerberechnung
  - `vatRates`: Verfügbare Umsatzsteuersätze
  - `vatAccounts`: Konten für Umsatzsteuer und Vorsteuer
- `approvalSettings`: Konfiguration für manuelle Prüfungen
  - `requireApprovalAbove`: Betragsschwelle für manuelle Prüfung
  - `approvers`: Benutzer mit Genehmigungsrechten
- `notificationRecipients`: E-Mail-Empfänger für Benachrichtigungen

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt Daten von Teil 2 (Kategorisierung) via Webhook

## Integration mit anderen Workflows

- **Belegerfassung**: Verknüpfung von Buchungen mit erfassten Belegen
- **Rechnungsstellung**: Aktualisierung des Zahlungsstatus von Rechnungen
- **Mahnwesen**: Berücksichtigung eingegangener Zahlungen im Mahnprozess
- **Steuerberater-Export**: Einbeziehung der Buchungen in Steuerberater-Exporte
