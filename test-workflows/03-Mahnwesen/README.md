# Automatisiertes Mahnwesen mit SevDesk

Dieser Workflow automatisiert das Mahnwesen in SevDesk unter Einhaltung der DSGVO-Richtlinien und rechtlichen Anforderungen.

## Funktionsweise

1. **Überwachung überfälliger Zahlungen**:
   - Tägliche Prüfung aller offenen Rechnungen in SevDesk
   - Identifikation überfälliger Zahlungen nach definierten Zeiträumen
   - Kategorisierung nach Mahnstufen (1., 2., 3. Mahnung)

2. **Intelligente Mahnstrategie**:
   - Kundenspezifische Mahnregeln (z.B. VIP-Kunden, Stammkunden)
   - Berücksichtigung von Teilzahlungen
   - Automatische Eskalation bei wiederholtem Zahlungsverzug
   - KI-basierte Prognose der Zahlungswahrscheinlichkeit

3. **Mahnungserstellung in SevDesk**:
   - Automatische Erstellung der Mahnung mit korrekten Kundendaten
   - Berechnung von Mahngebühren und Verzugszinsen gemäß gesetzlicher Vorgaben
   - Generierung der Mahnungs-PDF mit angepassten Texten

4. **Mahnungsversand**:
   - Stufenweiser Versand (E-Mail, Brief, Einschreiben)
   - Eskalationsmanagement für hartnäckige Fälle
   - Dokumentation aller Mahnaktivitäten für rechtliche Zwecke

5. **Nachverfolgung und Reporting**:
   - Speicherung aller Mahnaktivitäten in PostgreSQL
   - Erinnerungen für manuelle Nachverfolgung
   - Automatische Benachrichtigungen bei Zahlungseingang
   - Regelmäßige Berichte über offene Posten

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur die für das Mahnwesen notwendigen Daten verarbeitet
- **Transparenz**: Klare Dokumentation aller Mahnaktivitäten
- **Löschfristen**: Automatische Löschung nach gesetzlichen Aufbewahrungsfristen
- **Zugriffskontrollen**: Rollenbasierte Zugriffsrechte für sensible Mahndaten
- **Audit-Trail**: Lückenlose Dokumentation aller Mahnschritte

## Rechtliche Aspekte

- Einhaltung gesetzlicher Verzugszinsregelungen (§§ 286, 288 BGB)
- Korrekte Berechnung von Mahngebühren
- Rechtskonforme Mahnformulierungen
- Berücksichtigung von Sonderfällen (Verbraucher vs. Unternehmen)

## Technische Voraussetzungen

- n8n-Installation mit sevDesk-Node (v2)
- IONOS AI Hub API-Zugang für Zahlungsprognosen
- PostgreSQL-Datenbank mit pgvector-Erweiterung
- E-Mail-Server oder -Dienst für den Versand
- Google Cloud Storage oder Azure Blob Storage für die Archivierung
- Signal-API für Benachrichtigungen

## Konfiguration

1. API-Schlüssel für SevDesk in n8n hinterlegen
2. Mahntext-Vorlagen in der Datenbank speichern
3. Mahnregeln und Eskalationsstufen konfigurieren
4. Verzugszinssätze und Mahngebühren festlegen
5. Signal-Webhook für Benachrichtigungen konfigurieren

## Workflow-Datei

Die `mahnwesen.json` enthält den kompletten n8n-Workflow zum Import in Ihre n8n-Instanz.
