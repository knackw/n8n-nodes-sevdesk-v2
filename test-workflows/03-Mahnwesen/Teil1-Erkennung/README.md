# Mahnwesen Teil 1: Erkennung überfälliger Rechnungen

Dieser Workflow ist der erste Teil des automatisierten Mahnwesens und identifiziert überfällige Rechnungen in SevDesk.

## Funktionsweise

1. **Regelmäßige Überprüfung**:
   - Täglicher Scan aller offenen Rechnungen in SevDesk
   - Filterung nach Fälligkeitsdatum
   - Kategorisierung nach Überfälligkeitsdauer

2. **Intelligente Klassifizierung**:
   - Einteilung in Mahnstufen (1., 2., 3. Mahnung)
   - Berücksichtigung von Kundenkategorien und Sonderregeln
   - Prüfung auf Teilzahlungen

3. **Datenaufbereitung**:
   - Sammlung aller relevanten Rechnungs- und Kundendaten
   - Berechnung von Verzugszinsen gemäß gesetzlicher Vorgaben
   - Vorbereitung der Daten für die Weiterverarbeitung

4. **Weiterleitung**:
   - Übergabe der Daten an Teil 2 (Verarbeitung) via Webhook
   - Speicherung der identifizierten Fälle in der Datenbank
   - Protokollierung für Audit-Zwecke

## DSGVO-Konformität

- Datensparsamkeit: Es werden nur die notwendigen Daten für die Mahnerkennung verarbeitet
- Zugriffskontrollen: Beschränkter Zugriff auf sensible Kundendaten
- Protokollierung: Nachvollziehbare Dokumentation aller Verarbeitungsschritte

## Technische Komponenten

- Schedule-Trigger für tägliche Ausführung
- SevDesk-Integration für Rechnungsabfrage
- PostgreSQL für Datenspeicherung
- Webhook-Verbindung zu Teil 2 (Verarbeitung)

## Workflow-Datei

Die `erkennung.json` enthält den n8n-Workflow zum Import in Ihre n8n-Instanz.
