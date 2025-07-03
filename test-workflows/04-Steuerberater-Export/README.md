# Automatisierter Steuerberater-Export mit SevDesk (v2)

Dieser Workflow automatisiert die Aufbereitung und den Export von Buchhaltungsdaten aus SevDesk für den Steuerberater unter Einhaltung der DSGVO-Richtlinien.

## Modulare Workflow-Struktur

Der Steuerberater-Export-Workflow wurde in drei separate Module aufgeteilt, die über Webhooks miteinander kommunizieren:

1. **Teil 1: Extraktion** - Zeitgesteuerte Extraktion von Buchhaltungsdaten aus SevDesk
2. **Teil 2: Aufbereitung** - Validierung, Formatierung und Erstellung von DATEV-konformen Exportdateien
3. **Teil 3: Übermittlung** - Sichere Übermittlung an den Steuerberater und Dokumentation

Diese modulare Struktur verbessert die Wartbarkeit und verhindert Timeout-Probleme bei komplexen Workflows.

## Funktionsweise

1. **Zeitgesteuerte Datenextraktion**:
   - Monatliche, quartalsweise oder jährliche Ausführung
   - Extraktion aller relevanten Buchhaltungsdaten aus SevDesk
   - Berücksichtigung des Geschäftsjahres und steuerlicher Zeiträume

2. **Datenaufbereitung und -validierung**:
   - Prüfung auf Vollständigkeit und Konsistenz der Daten
   - Automatische Korrekturvorschläge bei Unstimmigkeiten
   - KI-gestützte Analyse zur Identifikation von Optimierungspotenzial

3. **Formatierung und Export**:
   - Erstellung von DATEV-konformen Export-Dateien
   - Generierung von Auswertungen und Berichten
   - Zusammenstellung aller relevanten Dokumente und Belege

4. **Sichere Übermittlung**:
   - Verschlüsselte Übertragung an den Steuerberater
   - Optionale Integration mit DATEV-Schnittstellen
   - Dokumentation der Übermittlung für Compliance-Zwecke

5. **Archivierung und Nachverfolgung**:
   - Revisionssichere Speicherung aller exportierten Daten
   - Protokollierung des gesamten Export-Prozesses
   - Erinnerungen für ausstehende Aufgaben und Rückmeldungen

## Erweiterte Funktionen (v2)

- **Lizenzvalidierung**: Überprüfung der SevDesk-Lizenz vor der Verarbeitung
- **Workflow-Konfiguration**: Dynamische Konfiguration über Supabase
- **KI-Integration**: Analyse und Optimierungsvorschläge mit IONOS AI Hub
- **Cloud-Speicher**: Revisionssichere Archivierung in Google Cloud Storage
- **Fehlerbehandlung**: Umfassende Fehlerprotokollierung und Support-Benachrichtigungen
- **DSGVO-konformes Messaging**: Benachrichtigungen über Signal

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur steuerlich relevante Daten exportiert
- **Verschlüsselung**: Ende-zu-Ende-Verschlüsselung bei der Datenübermittlung
- **Zugriffskontrollen**: Rollenbasierte Zugriffsrechte für sensible Steuerdaten
- **Aufbewahrungsfristen**: Automatische Löschung nach gesetzlichen Aufbewahrungsfristen
- **Audit-Trail**: Lückenlose Dokumentation aller Exportvorgänge

## Steuerliche Aspekte

- Berücksichtigung aktueller steuerlicher Anforderungen
- Unterstützung verschiedener Unternehmensformen (Einzelunternehmen, GmbH, etc.)
- Anpassung an EÜR oder Bilanzierung
- Umsatzsteuervoranmeldung und Jahreserklärungen
- Gewinnermittlung und Abschreibungen

## Technische Voraussetzungen

- n8n-Installation (Version 0.214.0+)
- SevDesk-Node (v2)
- IONOS AI Hub API-Zugang
- Supabase PostgreSQL-Datenbank
- Google Cloud Storage oder Azure Blob Storage
- Signal-API für Benachrichtigungen
- Optional: DATEV-API-Zugang

## Konfiguration

1. API-Schlüssel für SevDesk in n8n hinterlegen
2. Export-Zeiträume und -Formate festlegen
3. Kontaktdaten des Steuerberaters konfigurieren
4. Übertragungswege und Verschlüsselung einrichten
5. Signal-Webhook für Benachrichtigungen konfigurieren

## Workflow-Datei

Die `steuerberater-export.json` enthält den kompletten n8n-Workflow zum Import in Ihre n8n-Instanz.
