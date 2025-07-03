# Rechnungsstellung: Teil 2 - Erstellung

Dieser Workflow ist der zweite Teil des modularen Rechnungsstellung-Workflows und verantwortlich für die Erstellung von Rechnungen in SevDesk mit KI-unterstützter Inhaltsgenerierung.

## Funktionsweise

Der Workflow empfängt Daten von Teil 1 (Erfassung) über einen Webhook und erstellt die Rechnung in SevDesk:

1. **Datenempfang**:
   - Empfang der Rechnungsdaten über Webhook
   - Validierung des Webhook-Keys zur Sicherstellung der Authentizität
   - Extraktion der Rechnungsdaten aus dem JSON-Payload

2. **Lizenzvalidierung**:
   - Überprüfung der SevDesk-Lizenz über Supabase
   - Sicherstellung, dass der Workflow nur für gültige Lizenzen ausgeführt wird
   - Protokollierung der Lizenzprüfung

3. **Workflow-Konfiguration**:
   - Laden der aktuellen Workflow-Konfiguration aus Supabase
   - Anwendung kundenspezifischer Einstellungen
   - Berücksichtigung von Sonderregeln für die Rechnungserstellung

4. **KI-gestützte Textgenerierung**:
   - Analyse der Rechnungspositionen und Kundendaten
   - Generierung personalisierter Rechnungstexte mit IONOS AI Hub
   - Erstellung von kundenspezifischen Anmerkungen und Hinweisen
   - Mehrsprachige Texterstellung je nach Kundeneinstellung

5. **Rechnungserstellung in SevDesk**:
   - Erstellung der Rechnung mit korrekten Kundendaten
   - Hinzufügen aller Rechnungspositionen
   - Anwendung von Rabatten und Sonderkonditionen
   - Hinzufügen der KI-generierten Texte
   - Generierung der PDF-Rechnung

6. **Weiterleitung**:
   - Strukturierung der Rechnungsdaten im JSON-Format
   - Hinzufügen der SevDesk-Rechnungs-ID und PDF-URL
   - Generierung eines sicheren Webhook-Keys
   - Weiterleitung der Daten an Teil 3 (Versand) über Webhook

## Technische Details

### Eingabedaten

JSON-Struktur mit folgenden Hauptelementen:
- `customer`: Kundendaten (ID, Name, Adresse, etc.)
- `items`: Array mit Rechnungspositionen
- `settings`: Rechnungseinstellungen (Zahlungsbedingungen, Rabatte, etc.)
- `metadata`: Zusätzliche Informationen für die Verarbeitung
- `webhook_key`: Sicherheitsschlüssel für die Kommunikation

### Ausgabedaten

JSON-Struktur mit folgenden Hauptelementen:
- `invoice_id`: SevDesk-Rechnungs-ID
- `invoice_number`: Generierte Rechnungsnummer
- `pdf_url`: URL zur generierten PDF-Rechnung
- `customer`: Kundendaten
- `items`: Verarbeitete Rechnungspositionen
- `metadata`: Erweiterte Metadaten für die Verarbeitung
- `webhook_key`: Neuer Sicherheitsschlüssel für die Kommunikation mit Teil 3

### Integrationen

- SevDesk API v2 für die Rechnungserstellung
- IONOS AI Hub für KI-gestützte Textgenerierung
- Supabase für Lizenzvalidierung und Konfiguration
- Webhook für die Kommunikation mit Teil 1 und Teil 3

## DSGVO-Konformität

- **Datensparsamkeit**: Es werden nur die für die Rechnungserstellung notwendigen Daten verarbeitet
- **Zweckbindung**: Daten werden ausschließlich für die Rechnungserstellung verwendet
- **Transparenz**: Klare Dokumentation der Datenverarbeitung
- **Verschlüsselung**: Alle Daten werden verschlüsselt übertragen und gespeichert
- **Protokollierung**: Alle Verarbeitungsschritte werden für Audit-Zwecke protokolliert

## Konfiguration

Die Konfiguration erfolgt über die zentrale Supabase-Datenbank und umfasst:

1. **API-Konfiguration**:
   - SevDesk API-Schlüssel
   - IONOS AI Hub API-Credentials
   - Webhook-URLs für die Kommunikation mit Teil 3

2. **Rechnungsvorlagen**:
   - Vorlagen für Rechnungstexte
   - KI-Prompts für die Textgenerierung
   - Corporate Design-Elemente

3. **Rechnungseinstellungen**:
   - Standard-Zahlungsbedingungen
   - Steuereinstellungen
   - Rabattregeln

4. **KI-Konfiguration**:
   - Spracheinstellungen für die Textgenerierung
   - Tonalität und Stil der generierten Texte
   - Branchenspezifische Anpassungen

## Fehlerbehandlung

- Umfassende Protokollierung aller Fehler in Supabase
- Automatische Benachrichtigung bei kritischen Fehlern über Signal
- Wiederholungsversuche bei temporären API-Fehlern
- Fallback-Mechanismen für die Textgenerierung bei KI-Ausfällen
