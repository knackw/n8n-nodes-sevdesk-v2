# Reporting - Teil 2: Analyse (v2)

Dieser Workflow-Teil analysiert die extrahierten SevDesk-Daten und berechnet aussagekräftige Kennzahlen und Trends.

## Funktionsweise

1. **Datenempfang**:
   - Empfang strukturierter Rohdaten von Teil 1 (Datenextraktion) via Webhook
   - Validierung der Datenqualität und -vollständigkeit
   - Sicherheitsüberprüfung durch Webhook-Key

2. **Datenvereinheitlichung**:
   - Standardisierung verschiedener Datenformate
   - Bereinigung von Inkonsistenzen und Duplikaten
   - Währungsumrechnung und Einheitenkonvertierung
   - Zeitzonenabgleich für Datumswerte

3. **KPI-Berechnung**:
   - Berechnung finanzieller Kennzahlen
   - Ermittlung operationeller Metriken
   - Trend-Analysen über verschiedene Zeiträume
   - Comparative Analytics zwischen Perioden

4. **Segmentierung**:
   - Kundengruppierung nach verschiedenen Kriterien
   - Produktkategorisierung und -analyse
   - Geografische und zeitliche Segmentierung
   - Profitabilitätsanalysen nach Segmenten

5. **Prognoseerstellung**:
   - Vorhersage-Modelle für Umsatz und Cashflow
   - Trend-Extrapolation für Planungszwecke
   - Seasonality-Berücksichtigung in Prognosen
   - Confidence-Intervalle für Unsicherheitsabschätzung

6. **Weiterleitung**:
   - Übermittlung analysierter Daten an Teil 3 (Verteilung) via Webhook
   - Strukturierte Ergebnisdaten mit Metainformationen
   - Qualitätsindikatoren für Analyseergebnisse

## Technische Details

- **Input**: Webhook von Teil 1 mit strukturierten Rohdaten
- **Verarbeitung**: Advanced Analytics Engine mit statistischen Methoden
- **Berechnung**: Multi-Thread-Verarbeitung für komplexe Kalkulationen
- **Output**: Webhook an Teil 3 mit analysierten Ergebnissen
- **Performance**: In-Memory-Processing für große Datenmengen

## Analysebereiche

### Finanzanalyse

#### Umsatzanalyse
- **Umsatzentwicklung**: Zeitreihenanalyse der Umsätze
- **Umsatzverteilung**: Nach Kunden, Produkten, Regionen
- **Wachstumsraten**: YoY, MoM, QoQ Vergleiche
- **Saisonalität**: Erkennung saisonaler Muster

#### Profitabilitätsanalyse
- **Gross Margin**: Bruttomargen nach Produkten/Kunden
- **EBITDA**: Betriebsergebnis vor Zinsen, Steuern, Abschreibungen
- **Contribution Margin**: Deckungsbeiträge verschiedener Segmente
- **Cost Analysis**: Kostenstruktur-Analyse

#### Liquiditätsanalyse
- **Cash Flow**: Operating, Investing, Financing Cash Flows
- **Working Capital**: Betriebskapital-Entwicklung
- **DSO/DPO**: Days Sales Outstanding, Days Payable Outstanding
- **Burn Rate**: Liquiditätsverbrauch und -prognose

### Kundenanalyse

#### Customer Value
- **Customer Lifetime Value**: CLV-Berechnungen
- **Average Order Value**: Durchschnittliche Bestellwerte
- **Purchase Frequency**: Kauffrequenz-Analysen
- **Churn Rate**: Kundenabwanderungsraten

#### Customer Segmentation
- **RFM-Analyse**: Recency, Frequency, Monetary Segmentierung
- **Behavior-based**: Verhaltensbasierte Gruppierung
- **Demographic**: Demografische Segmentierung
- **Geographic**: Geografische Verteilung

#### Customer Journey
- **Acquisition**: Kundenakquisitions-Metriken
- **Retention**: Kundenbindungsraten
- **Expansion**: Cross-/Upselling-Erfolg
- **Satisfaction**: Zufriedenheits-Indikatoren

### Operationelle Analyse

#### Projektanalyse
- **Project Profitability**: Projektrentabilität
- **Resource Utilization**: Ressourcenauslastung
- **Project Duration**: Projektlaufzeit-Analysen
- **Success Metrics**: Projekterfolgs-KPIs

#### Produktanalyse
- **Product Performance**: Produktleistung-Metriken
- **Inventory Turnover**: Lagerumschlag
- **Product Mix**: Produktmix-Optimierung
- **Pricing Analysis**: Preisanalysen

## KPI-Definitionen

### Financial KPIs
- **Revenue**: Gesamtumsatz und Umsatzwachstum
- **Gross Profit Margin**: (Umsatz - COGS) / Umsatz
- **Net Profit Margin**: Nettogewinn / Umsatz
- **ROI**: Return on Investment
- **ROIC**: Return on Invested Capital

### Operational KPIs
- **Customer Acquisition Cost**: CAC
- **Monthly Recurring Revenue**: MRR
- **Annual Recurring Revenue**: ARR
- **Churn Rate**: Kundenabwanderungsrate
- **Net Promoter Score**: NPS (falls verfügbar)

### Efficiency KPIs
- **Revenue per Employee**: Umsatz pro Mitarbeiter
- **Cost per Acquisition**: Akquisitionskosten
- **Time to Cash**: Zeit von Rechnung bis Zahlung
- **Inventory Days**: Lagerreichweite in Tagen

## Konfiguration

Die Workflow-Konfiguration erfolgt direkt in n8n und umfasst:

- `analysisSettings`: Analyse-Konfiguration
  - `kpiDefinitions`: Definition zu berechnender KPIs
  - `calculationMethods`: Berechnungsmethoden und Formeln
  - `timeframes`: Analysezeiträume und Vergleichsperioden
  - `segmentationCriteria`: Kriterien für Datengruppierung

- `dataProcessing`: Datenverarbeitungs-Einstellungen
  - `cleansingRules`: Datenbereinigungsregeln
  - `normalizationRules`: Standardisierungsvorschriften
  - `validationChecks`: Qualitätsprüfungen
  - `aggregationLevels`: Aggregationsebenen

- `forecastingSettings`: Prognose-Konfiguration
  - `forecastModels`: Verwendete Vorhersagemodelle
  - `forecastHorizons`: Prognosezeiträume
  - `confidenceIntervals`: Unsicherheitsbereiche
  - `seasonalityFactors`: Saisonalitätsfaktoren

- `performanceSettings`: Performance-Optimierung
  - `processingThreads`: Anzahl Verarbeitungsthreads
  - `memoryLimits`: Speicherlimits für große Datensets
  - `cachingStrategy`: Caching-Strategien
  - `batchSizes`: Batch-Größen für Verarbeitung

## Advanced Analytics

### Statistical Methods
- **Regression Analysis**: Lineare und multiple Regression
- **Time Series Analysis**: ARIMA, Exponential Smoothing
- **Correlation Analysis**: Korrelationsanalysen zwischen Variablen
- **Variance Analysis**: Varianzanalysen und Standardabweichungen

### Machine Learning
- **Clustering**: K-Means für Kundensegmentierung
- **Classification**: Klassifikation von Kunden/Produkten
- **Anomaly Detection**: Erkennung ungewöhnlicher Muster
- **Predictive Modeling**: Vorhersagemodelle für Business Metrics

### Business Intelligence
- **Cohort Analysis**: Kohortenanalysen für Kundenbindung
- **Funnel Analysis**: Conversion-Trichter-Analysen
- **ABC Analysis**: Pareto-Analysen für Kunden/Produkte
- **Benchmarking**: Vergleiche mit Branchen-Benchmarks

## Qualitätssicherung

### Data Quality Checks
- **Completeness**: Vollständigkeitsprüfung der Analysedaten
- **Accuracy**: Genauigkeitsvalidierung der Berechnungen
- **Consistency**: Konsistenzprüfung zwischen KPIs
- **Timeliness**: Aktualität der verwendeten Daten

### Result Validation
- **Cross-Validation**: Kreuzvalidierung von Analyseergebnissen
- **Plausibility Checks**: Plausibilitätsprüfung der KPIs
- **Trend Validation**: Validierung von Trend-Berechnungen
- **Outlier Detection**: Erkennung von Ausreißern

## Monitoring

### Processing Metrics
- **Execution Time**: Dauer der Analyse-Prozesse
- **Memory Usage**: Speicherverbrauch bei Berechnungen
- **CPU Utilization**: Prozessorauslastung
- **Data Throughput**: Verarbeitete Datenmenge pro Zeit

### Quality Metrics
- **Calculation Accuracy**: Genauigkeit der KPI-Berechnungen
- **Data Coverage**: Abdeckung der Quelldaten
- **Prediction Accuracy**: Genauigkeit von Prognosen
- **Error Rates**: Fehlerquoten bei Berechnungen

## Verbindung zu anderen Workflow-Teilen

- **Input**: Empfängt strukturierte Rohdaten von Teil 1 (Datenextraktion) via Webhook
- **Output**: Sendet analysierte Ergebnisse an Teil 3 (Verteilung) via Webhook
- **Integration**: Kann zusätzliche SevDesk-Daten für Kontext-Anreicherung abrufen
- **Feedback**: Liefert Datenqualitäts-Feedback an Teil 1 zurück

## Skalierbarkeit

- **Kleine Unternehmen**: 10-50 KPIs mit täglicher Berechnung
- **Mittlere Unternehmen**: 100-500 KPIs mit Echtzeit-Analytics
- **Große Unternehmen**: 1.000+ KPIs mit Advanced Machine Learning und Predictive Analytics
