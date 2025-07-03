# Belegerfassung - Teil 3: Validierung (v2)

Dieser Workflow-Teil ist für die Validierung der erstellten Belege und deren Freigabe in SevDesk zuständig.

## Funktionsweise

1. **Webhook-Empfang**:
   - Empfang der Beleg-Daten von Teil 2 (Verarbeitung)
   - Validierung des Webhook-Keys für sichere Datenübertragung

2. **Lizenzvalidierung**:
   - Überprüfung der SevDesk-Lizenz über Supabase
   - Sicherstellung gültiger API-Zugriffe

3. **Workflow-Konfiguration**:
   - Laden der Konfiguration aus Supabase
   - Dynamische Anpassung der Validierungsparameter

4. **Validierungsdaten-Vorbereitung**:
   - Analyse der Beleg-Daten
   - Bestimmung des Validierungsstatus (automatisch/manuell)

5. **Automatische Validierung**:
   - Freigabe von Belegen mit hoher Konfidenz
   - Aktualisierung des Beleg-Status in SevDesk

6. **Manuelle Validierungsanforderung**:
   - E-Mail-Benachrichtigung an Buchhaltung für manuelle Prüfung
   - Bereitstellung aller relevanten Beleg-Informationen

7. **Datenbank-Aktualisierung**:
   - Protokollierung des Validierungsstatus in Supabase
   - Aktualisierung des Audit-Trails

8. **Benachrichtigungen**:
   - Signal-Benachrichtigung über Validierungsstatus
   - DSGVO-konforme Kommunikation

9. **Fehlerbehandlung**:
   - Protokollierung von Fehlern in Supabase
   - E-Mail-Benachrichtigung an Support
   - Signal-Benachrichtigung für kritische Fehler

## Technische Details

- **Trigger**: Webhook von Teil 2 (Verarbeitung)
- **SevDesk-API**: Beleg-Status-Aktualisierung
- **Datenbank**: Supabase PostgreSQL für Logging und Audit-Trail
- **Kommunikation**: E-Mail für Validierungsanfragen, Signal für Benachrichtigungen
- **Fehlerbehandlung**: PostgreSQL-Logging, E-Mail, Signal

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur die für die Validierung notwendigen Daten verarbeitet
- **Verschlüsselung**: Alle Kommunikation erfolgt verschlüsselt
- **Zugriffskontrollen**: Webhook-Key-Validierung und rollenbasierte Zugriffsrechte
- **Audit-Trail**: Lückenlose Dokumentation aller Validierungsschritte

## Konfiguration

Die Workflow-Konfiguration wird aus Supabase geladen und enthält folgende Parameter:

- `autoValidation`: Einstellungen für automatische Validierung
  - `enabled`: Aktivierung der automatischen Validierung
  - `confidenceThreshold`: Schwellenwert für automatische Freigabe (0.0-1.0)
- `notificationRecipients`: E-Mail-Empfänger für manuelle Validierungsanfragen

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt Daten von Teil 2 (Verarbeitung) via Webhook
