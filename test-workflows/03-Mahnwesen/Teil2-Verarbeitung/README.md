# Mahnwesen Teil 2: Verarbeitung von Mahnungen

Dieser Workflow ist der zweite Teil des automatisierten Mahnwesens und verarbeitet die von Teil 1 identifizierten überfälligen Rechnungen.

## Funktionsweise

1. **Webhook-Empfang**:
   - Empfang der Mahndaten von Teil 1 (Erkennung)
   - Validierung der Eingangsdaten
   - Authentifizierung über Webhook-Secret

2. **Mahnungserstellung**:
   - Generierung der Mahntexte basierend auf Mahnstufe
   - Berechnung von Verzugszinsen und Mahngebühren
   - Erstellung des Mahndokuments in SevDesk

3. **Dokumentenerstellung**:
   - Generierung der Mahnungs-PDF
   - Anpassung des Layouts je nach Mahnstufe
   - Speicherung in SevDesk und Cloud-Storage

4. **Weiterleitung**:
   - Übergabe der Daten an Teil 3 (Versand) via Webhook
   - Aktualisierung des Mahnstatus in der Datenbank
   - Protokollierung für Audit-Zwecke

## DSGVO-Konformität

- Verschlüsselung: Sichere Verarbeitung der Mahndaten
- Zweckbindung: Daten werden nur für den Mahnprozess verwendet
- Protokollierung: Nachvollziehbare Dokumentation aller Verarbeitungsschritte

## Technische Komponenten

- Webhook-Trigger für Empfang der Daten aus Teil 1
- SevDesk-Integration für Mahnungserstellung
- IONOS AI Hub für intelligente Mahntextgenerierung
- Cloud Storage für Dokumentenarchivierung
- PostgreSQL für Datenspeicherung
- Webhook-Verbindung zu Teil 3 (Versand)

## Workflow-Datei

Die `verarbeitung.json` enthält den n8n-Workflow zum Import in Ihre n8n-Instanz.
