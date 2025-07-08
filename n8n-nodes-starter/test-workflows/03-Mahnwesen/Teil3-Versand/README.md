# Mahnwesen Teil 3: Versand von Mahnungen

Dieser Workflow ist der dritte Teil des automatisierten Mahnwesens und übernimmt den Versand der erstellten Mahnungen an Kunden.

## Funktionsweise

1. **Webhook-Empfang**:
   - Empfang der Mahndaten von Teil 2 (Verarbeitung)
   - Validierung der Eingangsdaten
   - Authentifizierung über Webhook-Secret

2. **Versandkanal-Auswahl**:
   - Intelligente Auswahl des optimalen Versandkanals basierend auf:
     - Mahnstufe (E-Mail für 1. Mahnung, Brief für 2. Mahnung, Einschreiben für 3. Mahnung)
     - Kundeneinstellungen und -präferenzen
     - Vorherigen Interaktionen und Erfolgsraten

3. **E-Mail-Versand**:
   - Automatische E-Mail-Erstellung mit angepassten Texten
   - Anhängen der Mahnungs-PDF
   - Tracking von Öffnungs- und Klickraten

4. **Briefversand-Vorbereitung** (für höhere Mahnstufen):
   - Generierung von Druckdateien
   - Anbindung an Briefversanddienste
   - Tracking der Zustellung

5. **Nachverfolgung und Dokumentation**:
   - Aktualisierung des Mahnstatus in der Datenbank
   - Protokollierung aller Versandaktivitäten
   - Erinnerungen für Folgeaktionen

## DSGVO-Konformität

- Sichere Übertragung: Verschlüsselte Kommunikation bei allen Versandkanälen
- Datensparsamkeit: Nur notwendige Daten werden übermittelt
- Nachweisbarkeit: Dokumentation aller Versandschritte für rechtliche Zwecke
- Löschkonzept: Automatische Löschung nach gesetzlichen Aufbewahrungsfristen

## Technische Komponenten

- Webhook-Trigger für Empfang der Daten aus Teil 2
- E-Mail-Dienst für elektronischen Versand
- API-Anbindung an Briefversanddienste
- PostgreSQL für Datenspeicherung und Tracking
- Signal-Integration für Benachrichtigungen

## Workflow-Datei

Die `versand.json` enthält den n8n-Workflow zum Import in Ihre n8n-Instanz.
