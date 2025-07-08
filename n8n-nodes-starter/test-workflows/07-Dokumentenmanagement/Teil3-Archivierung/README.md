# Dokumentenmanagement - Teil 3: Archivierung (v2)

Dieser Workflow-Teil archiviert verarbeitete Dokumente und erstellt ein durchsuchbares Dokumentenarchiv.

## Funktionsweise

1. **Datenempfang**:
   - Empfang verarbeiteter Dokumentendaten von Teil 2 (Verarbeitung) via Webhook
   - Validierung der SevDesk-Referenzen und Metadaten
   - Sicherheitsüberprüfung durch Webhook-Key

2. **Dokumentenorganisation**:
   - Strukturierte Ablage nach konfigurierbaren Kriterien
   - Automatische Ordnerstruktur basierend auf Dokumententyp
   - Versionsverwaltung für geänderte Dokumente
   - Hierarchische Kategorisierung

3. **Archivierungsformate**:
   - Konvertierung in archivierungstaugliche Formate (PDF/A)
   - Komprimierung für Speicherplatz-Optimierung
   - Erstellung von Backup-Kopien
   - Sicherstellung der Langzeitlesbarkeit

4. **Metadaten-Management**:
   - Speicherung umfassender Metadaten
   - Verknüpfung mit SevDesk-Datensätzen
   - Erstellung von Suchindizes
   - Kategorisierung und Tagging

5. **Zugriffskontrolle**:
   - Implementierung von Berechtigungsstrukturen
   - Rollenbasierte Zugriffsbeschränkungen
   - Audit-Trail für Dokumentenzugriffe
   - Compliance-konforme Archivierung

6. **Recherche-Interface**:
   - Volltext-Suche in archivierten Dokumenten
   - Facettierte Suche nach Metadaten
   - Export-Funktionen für gefundene Dokumente
   - Integration in SevDesk-Oberfläche

## Technische Details

- **Input**: Webhook von Teil 2 mit verarbeiteten Dokumentendaten
- **Archivierung**: Lokales oder Cloud-basiertes Speichersystem
- **Formate**: PDF/A, komprimierte Archive, Metadaten-Datenbank
- **Suche**: Elasticsearch oder ähnliche Suchmaschine
- **Zugriff**: RESTful API für Dokumentenabruf
- **Compliance**: DSGVO-konforme Archivierung und Löschung

## Archivierungsstruktur

### Organisationshierarchie
- **Jahr**: Oberste Ebene nach Geschäftsjahren
- **Monat**: Unterebene für monatliche Organisation
- **Dokumententyp**: Kategorisierung nach Dokumentenarten
- **Kontakt/Projekt**: Zuordnung zu Geschäftspartnern oder Projekten

### Beispiel-Struktur
```
Archiv/
├── 2024/
│   ├── 01-Januar/
│   │   ├── Eingangsrechnungen/
│   │   ├── Belege/
│   │   └── Verträge/
│   └── 02-Februar/
├── 2023/
└── Indices/
    ├── Volltext/
    └── Metadaten/
```

### Naming-Conventions
- **Eindeutige IDs**: UUID-basierte Dokumenten-IDs
- **Sprechende Namen**: Kombination aus Datum, Typ und Referenz
- **Versionierung**: Automatische Versionsnummerierung
- **SevDesk-Referenz**: Verknüpfung mit SevDesk-Objekten

## Metadaten-Schema

### Basisdaten
- **Dokument-ID**: Eindeutige Identifikation
- **Erstellungsdatum**: Originalerstellungsdatum
- **Archivierungsdatum**: Zeitpunkt der Archivierung
- **Dokumententyp**: Klassifizierung des Dokuments
- **Status**: Aktueller Bearbeitungsstatus

### SevDesk-Verknüpfungen
- **SevDesk-Object-ID**: Referenz auf SevDesk-Datensatz
- **Contact-ID**: Zugehöriger Kontakt in SevDesk
- **Project-ID**: Zugehöriges Projekt (falls vorhanden)
- **Invoice-ID**: Zugehörige Rechnung (falls vorhanden)

### Inhaltliche Metadaten
- **Schlüsselwörter**: Automatisch extrahierte Begriffe
- **Kategorien**: Geschäftliche Kategorisierung
- **Beträge**: Finanzielle Kennzahlen
- **Personen**: Beteiligte Personen und Firmen
- **Zeiträume**: Relevante Datumsbereiche

### Technische Metadaten
- **Dateigröße**: Original- und archivierte Größe
- **Prüfsummen**: Integritätssicherung
- **Format-Info**: Ursprungs- und Archivformat
- **Qualitäts-Score**: OCR-Qualität und Vollständigkeit

## Konfiguration

Die Workflow-Konfiguration erfolgt direkt in n8n und umfasst:

- `archiveSettings`: Archivierungseinstellungen
  - `storageLocation`: Speicherort (lokal/cloud)
  - `folderStructure`: Organisationsstruktur
  - `namingConventions`: Benennungsregeln
  - `compressionSettings`: Komprimierungsoptionen

- `formatSettings`: Format-Konfiguration
  - `archiveFormats`: Zielformate für Archivierung
  - `conversionRules`: Konvertierungsregeln
  - `qualitySettings`: Qualitätseinstellungen
  - `backupSettings`: Backup-Strategien

- `metadataSettings`: Metadaten-Konfiguration
  - `metadataSchema`: Struktur der Metadaten
  - `extractionRules`: Regeln für Metadaten-Extraktion
  - `indexingSettings`: Einstellungen für Suchindizes
  - `taggingRules`: Automatische Verschlagwortung

- `accessControl`: Zugriffskontrolle
  - `userRoles`: Definition von Benutzerrollen
  - `permissions`: Berechtigungsmatrix
  - `auditSettings`: Audit-Trail-Konfiguration
  - `retentionPolicies`: Aufbewahrungsfristen

## Suchfunktionalität

### Volltext-Suche
- **OCR-basiert**: Suche in erkanntem Text
- **Metadaten-Suche**: Suche in strukturierten Daten
- **Fuzzy-Search**: Toleranz für Tippfehler
- **Phrase-Suche**: Suche nach exakten Begriffen

### Facettierte Suche
- **Zeitraum**: Filterung nach Datumsbereichen
- **Dokumententyp**: Filterung nach Kategorien
- **Kontakte**: Filterung nach Geschäftspartnern
- **Beträge**: Filterung nach Größenordnungen

### Erweiterte Features
- **Ähnlichkeitssuche**: Finden ähnlicher Dokumente
- **Trending**: Häufig gesuchte Begriffe
- **Autocomplete**: Vorschläge während der Eingabe
- **Export**: Suchergebnisse als Liste

## Compliance und Rechtliches

### DSGVO-Konformität
- **Recht auf Vergessenwerden**: Automatische Löschfunktionen
- **Datenminimierung**: Speicherung nur notwendiger Daten
- **Zweckbindung**: Verwendung nur für definierte Zwecke
- **Transparenz**: Nachvollziehbare Verarbeitungsprozesse

### Aufbewahrungsfristen
- **Steuerrechtlich**: 10 Jahre für steuerrelevante Dokumente
- **Handelsrechtlich**: 6 Jahre für Geschäftsbriefe
- **Projektbezogen**: Projektspezifische Aufbewahrung
- **Automatische Löschung**: Nach Ablauf der Fristen

### Audit-Trail
- **Zugriffsprotokolle**: Wer hat wann auf welche Dokumente zugegriffen
- **Änderungshistorie**: Dokumentation aller Änderungen
- **Systemereignisse**: Technische Ereignisse und Fehler
- **Compliance-Berichte**: Regelmäßige Compliance-Überprüfung

## Performance-Optimierung

### Speicher-Optimierung
- **Komprimierung**: Verlustfreie Komprimierung für Platzeinsparung
- **Deduplizierung**: Vermeidung von Duplikaten
- **Tiered-Storage**: Automatische Verlagerung älterer Dokumente
- **Cloud-Integration**: Skalierbare Cloud-Speicherlösungen

### Suchperformance
- **Indexierung**: Optimierte Suchindizes
- **Caching**: Zwischenspeicherung häufiger Suchanfragen
- **Parallel-Processing**: Parallele Suchverarbeitung
- **Load-Balancing**: Verteilung der Suchlast

## Monitoring

### Archivierungs-Metriken
- **Durchsatz**: Archivierte Dokumente pro Zeitraum
- **Speicherverbrauch**: Aktueller und prognostizierter Bedarf
- **Erfolgsquoten**: Erfolgreiche vs. fehlgeschlagene Archivierungen
- **Processing-Times**: Archivierungszeiten nach Dokumententyp

### Nutzungsstatistiken
- **Suchanfragen**: Häufigkeit und Muster von Suchanfragen
- **Zugriffshäufigkeit**: Welche Dokumente werden oft abgerufen
- **User-Aktivität**: Nutzungsverhalten verschiedener Benutzer
- **Performance-Metrics**: Antwortzeiten und System-Performance

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt verarbeitete Dokumentendaten von Teil 2 (Verarbeitung) via Webhook
- **Integration**: Vollständige Verknüpfung mit SevDesk-Datensätzen
- **API**: Bereitstellung von Such- und Abruf-APIs für andere Systeme
- **Reporting**: Lieferung von Archivierungs-Statistiken

## Skalierbarkeit

- **Kleine Unternehmen**: 1.000-10.000 Dokumente mit lokaler Speicherung
- **Mittlere Unternehmen**: 10.000-100.000 Dokumente mit Hybrid-Ansatz
- **Große Unternehmen**: 100.000+ Dokumente mit Enterprise-Cloud-Lösung
