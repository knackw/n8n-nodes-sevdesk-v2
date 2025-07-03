# Dokumentenmanagement - Teil 1: Erfassung (v2)

Dieser Workflow-Teil erfasst und verarbeitet eingehende Dokumente für die Integration in SevDesk.

## Funktionsweise

1. **Dokumenteneingang**:
   - E-Mail-Überwachung für eingehende Dokumente
   - Datei-Upload über Webhook-Interface
   - FTP/SFTP-Überwachung für automatischen Import
   - API-basierte Dokumentenübertragung

2. **Dokumentenerkennung**:
   - Automatische Dateityp-Erkennung
   - OCR-Verarbeitung für gescannte Dokumente
   - Metadaten-Extraktion aus Dateien
   - Validierung der Dokumentenintegrität

3. **Klassifizierung**:
   - Automatische Kategorisierung nach Dokumententyp
   - Erkennung von Rechnungen, Belegen, Verträgen
   - Zuordnung zu SevDesk-Dokumentenkategorien
   - Prioritätsbewertung für Verarbeitung

4. **Datenextraktion**:
   - Extraktion relevanter Geschäftsdaten
   - Rechnungsdaten, Beträge, Datum
   - Lieferanten- und Kundendaten
   - Vorbereitung für SevDesk-Import

5. **Qualitätskontrolle**:
   - Validierung der extrahierten Daten
   - Vollständigkeitsprüfung
   - Plausibilitätschecks
   - Fehlermarkierung für manuelle Überprüfung

6. **Weiterleitung**:
   - Übermittlung an Teil 2 (Verarbeitung) via Webhook
   - Strukturierte Datenübertragung
   - Dokumentenreferenzen und Metadaten

## Technische Details

- **Input**: E-Mail, File-Upload, FTP, API
- **OCR-Engine**: Tesseract oder Cloud-OCR-Services  
- **Dokumententypen**: PDF, JPG, PNG, TIFF
- **SevDesk-Integration**: Direkte API v2-Aufrufe
- **Output**: Webhook an Teil 2 mit strukturierten Daten
- **Fehlerbehandlung**: Retry-Logik und manuelle Eingriffe

## Dokumentenkategorien

### Eingangsrechnungen
- **Lieferantenrechnungen**: Automatische Lieferantenerkennung
- **Wiederkehrende Rechnungen**: Pattern-Erkennung für Abos
- **Gutschriften**: Negative Beträge und Storno-Kennzeichnung
- **Fremdwährung**: Währungserkennung und Umrechnung

### Belege und Quittungen
- **Kassenbelege**: OCR-optimiert für Thermodruck
- **Tankbelege**: Spezielle Erkennung für KFZ-Kosten
- **Reisebelege**: Kategorisierung für Reisekostenabrechnung
- **Online-Belege**: Screenshot und PDF-Verarbeitung

### Verträge und Dokumente
- **Kundenverträge**: Vertragsdaten und Laufzeiten
- **Lieferantenverträge**: Konditionen und Termine
- **Behördendokumente**: Spezielle Formatbehandlung
- **Korrespondenz**: E-Mail und Briefverkehr

### Bank- und Finanzdokumente
- **Kontoauszüge**: Transaktionsdatenextraktion
- **Kreditkartenabrechnungen**: Einzelpostenaufteilung
- **Finanzierungsdokumente**: Kredite und Leasing
- **Versicherungsdokumente**: Policen und Schadensmeldungen

## Datenextraktion

### OCR-Verarbeitung
- **Text-Recognition**: Hochpräzise Texterkennung
- **Layout-Analysis**: Struktur- und Tabellenerkennung
- **Confidence-Scoring**: Qualitätsbewertung der Erkennung
- **Multi-Language**: Unterstützung verschiedener Sprachen

### Datenfeld-Extraktion
- **Rechnungsnummer**: Pattern-basierte Erkennung
- **Datum**: Flexible Datumsformat-Erkennung
- **Beträge**: Brutto/Netto/Steuer-Aufteilung
- **Lieferant/Kunde**: Adress- und Kontaktdatenextraktion

### Validierung und Verbesserung
- **Plausibilitätsprüfung**: Mathematische Validierung
- **Duplikatserkennung**: Vermeidung von Doppelerfassung
- **Datenveredelung**: Anreicherung mit Stammdaten
- **Korrekturmöglichkeiten**: Interface für manuelle Anpassungen

## Konfiguration

Die Workflow-Konfiguration erfolgt direkt in n8n und umfasst:

- `inputChannels`: Konfiguration der Eingangswege
  - `email`: E-Mail-Server und Postfächer
  - `upload`: Webhook-Upload-Endpunkte
  - `ftp`: FTP/SFTP-Server-Zugriffe
  - `api`: API-Endpunkte für externe Systeme

- `ocrSettings`: OCR-Engine-Konfiguration
  - `engine`: Tesseract, Azure, Google, AWS
  - `languages`: Unterstützte Sprachen
  - `qualitySettings`: Auflösung und Erkennungsqualität
  - `preprocessing`: Bildverbesserung vor OCR

- `classificationRules`: Klassifizierungsregeln
  - `documentTypes`: Dokumententyp-Patterns
  - `categoryMapping`: Zuordnung zu SevDesk-Kategorien
  - `priorityRules`: Priorisierung nach Dokumententyp
  - `autoProcessing`: Regeln für automatische Verarbeitung

- `extractionSettings`: Datenextraktion-Konfiguration
  - `fieldDefinitions`: Zu extrahierende Datenfelder
  - `validationRules`: Validierungsregeln für Daten
  - `enhancementRules`: Datenanreicherung
  - `fallbackMethods`: Alternative Extraktionsmethoden

## Performance-Optimierung

- **Batch-Processing**: Verarbeitung mehrerer Dokumente gleichzeitig
- **Intelligente Priorisierung**: Wichtige Dokumente zuerst
- **Caching**: Wiederverwendung von OCR-Ergebnissen
- **Load-Balancing**: Verteilung auf mehrere OCR-Instanzen

## Qualitätssicherung

### Automatische Validierung
- **Datenvalidierung**: Format- und Plausibilitätsprüfung
- **Vollständigkeitsprüfung**: Erforderliche Felder vorhanden
- **Konsistenzprüfung**: Übereinstimmung von Daten
- **Duplikatsprüfung**: Vermeidung von Mehrfacherfassung

### Manuelle Überprüfung
- **Review-Queue**: Dokumente mit niedrigem Confidence-Score
- **Korrektur-Interface**: Einfache Bearbeitung fehlerhafter Daten
- **Lernfähigkeit**: Verbesserung durch manuelle Korrekturen
- **Audit-Trail**: Nachvollziehbarkeit aller Änderungen

## Monitoring

- **Verarbeitungsstatistiken**: Durchsatz und Erfolgsraten
- **OCR-Qualität**: Confidence-Scores und Fehlerquoten
- **Processing-Time**: Zeitmessung für Performance-Optimierung
- **Error-Tracking**: Kategorisierung und Analyse von Fehlern

## Verbindung zu anderen Workflow-Teilen

- **Output**: Sendet strukturierte Dokumentendaten an Teil 2 (Verarbeitung) via Webhook
- **Integration**: Nutzt SevDesk-Stammdaten für Datenanreicherung
- **Feedback**: Empfängt Verbesserungsvorschläge von Teil 2

## Skalierbarkeit

- **Kleine Unternehmen**: 20-100 Dokumente/Tag
- **Mittlere Unternehmen**: 200-1.000 Dokumente/Tag
- **Große Unternehmen**: 2.000+ Dokumente/Tag mit Multi-Instance-Setup
