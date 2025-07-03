# Dokumentenmanagement - Teil 2: Verarbeitung (v2)

Dieser Workflow-Teil verarbeitet die erfassten Dokumentendaten und erstellt SevDesk-Einträge.

## Funktionsweise

1. **Datenempfang**:
   - Empfang strukturierter Dokumentendaten von Teil 1 (Erfassung) via Webhook
   - Validierung der übertragenen Daten
   - Sicherheitsüberprüfung durch Webhook-Key

2. **SevDesk-Abgleich**:
   - Abgleich mit bestehenden SevDesk-Kontakten
   - Erkennung von Duplikaten und Referenzdokumenten
   - Automatische Zuordnung zu bestehenden Projekten
   - Prüfung auf Dateninkonsistenzen

3. **Datenvalidierung**:
   - Vollständigkeitsprüfung der erforderlichen Felder
   - Plausibilitätsprüfung von Beträgen und Daten
   - Validierung von Steuersätzen und Berechnungen
   - Konsistenzprüfung mit SevDesk-Stammdaten

4. **Automatische Zuordnung**:
   - Intelligente Kontozuordnung basierend auf Dokumententyp
   - Kostenstellen- und Projektzuordnung
   - Kategorisierung nach Geschäftsprozessen
   - Steuerliche Klassifizierung

5. **SevDesk-Integration**:
   - Erstellung von Rechnungen, Belegen oder Kontakten
   - Upload der Original-Dokumente als Anhänge
   - Verknüpfung mit bestehenden Datensätzen
   - Aktualisierung von Kontakt- und Projektdaten

6. **Weiterleitung**:
   - Übermittlung verarbeiteter Daten an Teil 3 (Archivierung) via Webhook
   - Statusmeldungen für Erfolg oder Fehler
   - Referenz-IDs der erstellten SevDesk-Einträge

## Technische Details

- **Input**: Webhook von Teil 1 mit strukturierten Dokumentendaten
- **SevDesk-Integration**: Vollständige API v2-Integration
- **Datenverarbeitung**: Intelligente Zuordnung und Validierung
- **Output**: Webhook an Teil 3 mit SevDesk-Referenzen
- **Fehlerbehandlung**: Automatische Korrekturen und manuelle Review-Queue

## Verarbeitungslogik

### Dokumententyp-spezifische Verarbeitung

#### Eingangsrechnungen
- **Lieferantenerstellung**: Automatische Kontakterstellung bei Neukunden
- **Rechnungserstellung**: Vollständige Eingangsrechnung in SevDesk
- **Steuerbehandlung**: Automatische Umsatzsteuer-Zuordnung
- **Zahlungsreferenz**: Vorbereitung für Zahlungsabgleich

#### Belege und Quittungen
- **Belegbuchung**: Direkte Buchung auf entsprechende Konten
- **Kostenstellen**: Automatische Zuordnung nach Belegtyp
- **Reisekosten**: Spezielle Behandlung für Reisekostenabrechnungen
- **Kleinbetragsregelung**: Berücksichtigung steuerlicher Vereinfachungen

#### Banktransaktionen
- **Kontenbuchung**: Direkte Buchung auf Bankkonten
- **Referenzzuordnung**: Verknüpfung mit offenen Rechnungen
- **Saldenabgleich**: Konsistenzprüfung mit SevDesk-Kontoständen
- **Zahlungsverkehr**: Aufspaltung von Sammelbuchungen

### Automatisierungsregeln

#### Kontakt-Matching
- **Fuzzy-Matching**: Intelligente Ähnlichkeitserkennung
- **Adressabgleich**: Vergleich von Adressdaten
- **Steuer-ID-Abgleich**: Eindeutige Zuordnung über Steuernummern
- **Historischer Abgleich**: Berücksichtigung früherer Transaktionen

#### Konto-Zuordnung
- **Pattern-Recognition**: Automatische Erkennung basierend auf Beschreibungen
- **Machine Learning**: Lernende Algorithmen für bessere Zuordnung
- **Rule-Based**: Konfigurierbare Geschäftsregeln
- **Fallback-Mechanismen**: Standard-Konten bei unklaren Fällen

#### Projekt-Assignment
- **Keyword-Matching**: Erkennung von Projektbezug in Dokumenten
- **Kundenzuordnung**: Automatische Projektzuordnung über Kontakte
- **Zeitraum-basiert**: Zuordnung basierend auf Projektlaufzeiten
- **Default-Projekte**: Standard-Projekte für verschiedene Dokumententypen

## Konfiguration

Die Workflow-Konfiguration erfolgt direkt in n8n und umfasst:

- `dataValidation`: Validierungsregeln
  - `requiredFields`: Pflichtfelder nach Dokumententyp
  - `formatValidation`: Format-Prüfungen für Felder
  - `plausibilityChecks`: Logische Konsistenzprüfungen
  - `businessRules`: Unternehmensspezifische Geschäftsregeln

- `mappingRules`: Zuordnungslogik
  - `contactMatching`: Algorithmen für Kontakt-Zuordnung
  - `accountMapping`: Automatische Konto-Zuordnung
  - `projectAssignment`: Projekt-Zuordnungsregeln
  - `taxClassification`: Steuerliche Klassifizierung

- `sevdeskIntegration`: SevDesk-spezifische Einstellungen
  - `apiSettings`: API-Konfiguration und Rate-Limiting
  - `dataStructures`: Mapping auf SevDesk-Datenstrukturen
  - `attachmentHandling`: Behandlung von Dokument-Anhängen
  - `errorHandling`: Fehlerbehandlung und Retry-Strategien

- `qualityControl`: Qualitätssicherung
  - `confidenceThresholds`: Mindest-Confidence für automatische Verarbeitung
  - `reviewQueues`: Konfiguration von manuellen Review-Prozessen
  - `approvalWorkflows`: Freigabeprozesse für kritische Dokumente
  - `auditTrails`: Nachvollziehbarkeit von Verarbeitungsschritten

## Fehlerbehandlung

### Automatische Korrekturen
- **Datenbereinigung**: Automatische Korrektur häufiger OCR-Fehler
- **Format-Standardisierung**: Einheitliche Formatierung von Daten
- **Referenz-Reparatur**: Wiederherstellung beschädigter Referenzen
- **Duplikat-Behandlung**: Intelligente Behandlung von Duplikaten

### Review-Prozesse
- **Confidence-basiert**: Manuelle Review bei niedriger Erkennungsqualität
- **Regelbasiert**: Review bei Verletzung von Geschäftsregeln
- **Ausnahme-basiert**: Review bei ungewöhnlichen Dokumenten
- **Lernfähigkeit**: Kontinuierliche Verbesserung durch Feedback

### Eskalation
- **Automatische Benachrichtigungen**: Alerts bei kritischen Fehlern
- **Workflow-Integration**: Einbindung in bestehende Approval-Prozesse
- **Deadline-Monitoring**: Überwachung von Bearbeitungszeiten
- **Prioritätsstufen**: Verschiedene Dringlichkeitsstufen

## Performance-Optimierung

### Verarbeitungseffizienz
- **Batch-Processing**: Verarbeitung mehrerer Dokumente gleichzeitig
- **Parallel-Processing**: Gleichzeitige Bearbeitung verschiedener Dokumententypen
- **Smart-Caching**: Zwischenspeicherung häufig benötigter SevDesk-Daten
- **Load-Balancing**: Verteilung der Last auf mehrere Verarbeitungsinstanzen

### API-Optimierung
- **Request-Batching**: Zusammenfassung mehrerer API-Aufrufe
- **Rate-Limiting**: Respektierung von SevDesk-API-Limits
- **Connection-Pooling**: Wiederverwendung von API-Verbindungen
- **Retry-Strategien**: Intelligente Wiederholung bei temporären Fehlern

## Monitoring

### Performance-Metriken
- **Verarbeitungszeiten**: Durchschnittliche Bearbeitungsdauer
- **Erfolgsquoten**: Anteil erfolgreich verarbeiteter Dokumente
- **Error-Rates**: Fehlerquoten nach Dokumententyp
- **API-Performance**: SevDesk-API-Antwortzeiten

### Qualitätsmetriken
- **Zuordnungsgenauigkeit**: Korrektheit automatischer Zuordnungen
- **Datenqualität**: Vollständigkeit und Konsistenz der Daten
- **Review-Quoten**: Anteil manuell zu prüfender Dokumente
- **Korrektur-Raten**: Häufigkeit nachträglicher Korrekturen

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt strukturierte Dokumentendaten von Teil 1 (Erfassung) via Webhook
- **Output**: Sendet verarbeitete Daten an Teil 3 (Archivierung) via Webhook
- **Integration**: Vollständige SevDesk-Integration für Datenerstellung und -verknüpfung
- **Feedback**: Liefert Lernmuster zurück an Teil 1 für bessere Erkennung

## Skalierbarkeit

- **Kleine Unternehmen**: 50-200 Dokumente/Tag mit Standard-Processing
- **Mittlere Unternehmen**: 500-2.000 Dokumente/Tag mit optimierten Workflows
- **Große Unternehmen**: 5.000+ Dokumente/Tag mit Hochleistungs-Setup
