# Banktransaktionen - Teil 2: Kategorisierung (v2)

Dieser Workflow-Teil ist für die KI-gestützte Analyse und Kategorisierung der importierten Banktransaktionen zuständig.

## Funktionsweise

1. **Webhook-Empfang**:
   - Empfang der importierten Transaktionen von Teil 1 (Import)
   - Validierung des Webhook-Keys für sichere Datenübertragung

2. **Lizenzvalidierung**:
   - Überprüfung der SevDesk-Lizenz über Supabase
   - Sicherstellung gültiger API-Zugriffe

3. **Workflow-Konfiguration**:
   - Laden der Konfiguration aus Supabase
   - Dynamische Anpassung der Kategorisierungsparameter

4. **KI-basierte Analyse**:
   - Analyse der Transaktionsdaten mit IONOS AI Hub
   - Extraktion relevanter Informationen aus Verwendungszwecken
   - Erkennung von Zahlungsreferenzen und Rechnungsnummern
   - Identifikation von Zahlungsempfängern und -sendern

5. **Automatische Kategorisierung**:
   - Zuordnung zu Buchungskategorien basierend auf KI-Analyse
   - Anwendung vordefinierter Kategorisierungsregeln
   - Berücksichtigung historischer Zuordnungen
   - Lernfähiges System für kontinuierliche Verbesserung

6. **Mustererkennung**:
   - Identifikation wiederkehrender Transaktionen
   - Erkennung von Abonnements und regelmäßigen Zahlungen
   - Analyse von Zahlungsmustern und -trends
   - Vorschläge für Automatisierungsregeln

7. **Zuordnung zu Belegen und Rechnungen**:
   - Matching mit offenen Rechnungen in SevDesk
   - Zuordnung zu vorhandenen Belegen
   - Erkennung von Teil- und Sammelzahlungen
   - Behandlung von Sonderfällen (Skonto, Mahngebühren, etc.)

8. **Zuordnung zu Geschäftspartnern**:
   - Identifikation von Kunden und Lieferanten
   - Abgleich mit SevDesk-Stammdaten
   - Vorschläge für neue Geschäftspartner
   - Aktualisierung von Kontaktinformationen

9. **Datenbank-Aktualisierung**:
   - Protokollierung der Kategorisierungsergebnisse in Supabase
   - Speicherung von Lernmustern für zukünftige Kategorisierungen
   - Aktualisierung des Transaktionsstatus

10. **Weiterleitung**:
    - Übermittlung der kategorisierten Transaktionen an Teil 3 (Buchung) via Webhook
    - Sicherung der Übertragung durch Webhook-Key

11. **Fehlerbehandlung**:
    - Protokollierung von Fehlern in Supabase
    - E-Mail-Benachrichtigung an Support
    - Signal-Benachrichtigung für kritische Fehler

## Technische Details

- **Trigger**: Webhook von Teil 1 (Import)
- **KI-Integration**: IONOS AI Hub für Transaktionsanalyse und Kategorisierung
- **Datenbank**: Supabase PostgreSQL für Logging und Lernmuster
- **Datenübertragung**: Webhook mit Sicherheitsvalidierung
- **Fehlerbehandlung**: PostgreSQL-Logging, E-Mail, Signal

## Buchhalterische Aspekte

- Unterstützung verschiedener Kontenrahmen (SKR03, SKR04)
- Berücksichtigung von EÜR oder Bilanzierung
- Korrekte Behandlung von Umsatzsteuer und Vorsteuer
- Unterscheidung zwischen privaten und geschäftlichen Transaktionen

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur buchhalterisch relevante Daten verarbeitet
- **Verschlüsselung**: Alle Daten werden verschlüsselt übertragen und gespeichert
- **Zugriffskontrollen**: Webhook-Key-Validierung und rollenbasierte Zugriffsrechte
- **Audit-Trail**: Lückenlose Dokumentation aller Kategorisierungsschritte

## Konfiguration

Die Workflow-Konfiguration wird aus Supabase geladen und enthält folgende Parameter:

- `categoryRules`: Regeln für die automatische Kategorisierung
  - `patterns`: Muster für die Erkennung (Regex, Schlüsselwörter)
  - `categories`: Zuordnung zu SevDesk-Kategorien
  - `taxRates`: Zuordnung zu Steuersätzen
- `matchingRules`: Regeln für die Zuordnung zu Belegen und Rechnungen
  - `referencePatterns`: Muster für Zahlungsreferenzen
  - `thresholds`: Schwellenwerte für Matching-Genauigkeit
- `aiHubSettings`: Konfiguration für die KI-Analyse
- `webhookUrls`: URLs für die Weiterleitung an andere Workflow-Teile

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt Daten von Teil 1 (Import) via Webhook
- **Output**: Sendet Daten an Teil 3 (Buchung) via Webhook
