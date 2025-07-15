# Automatisiertes Mahnwesen mit SevDesk (v2)

Dieser Workflow automatisiert das Mahnwesen in SevDesk unter Einhaltung der DSGVO-Richtlinien und rechtlichen Anforderungen.

## Produktionsreife Modulare Struktur

Der Mahnwesen-Workflow besteht aus drei separaten Teilen mit systematischen Node-IDs:

### **Teil 1: Erkennung (Node-IDs: 031\_\***)\*\*

- **Zweck**: Identifiziert überfällige Rechnungen und kategorisiert Mahnstufen
- **Webhook-Ausgang**: `webhook/mahnwesen-verarbeitung`
- **Hauptnodes**: `031_TRG_01` (Schedule), `031_SVC_01` (SevDesk API), `031_FWD_01` (Forward)

### **Teil 2: Verarbeitung (Node-IDs: 032\_\***)\*\*

- **Zweck**: Erstellt Mahnungen in SevDesk und berechnet Gebühren
- **Webhook-Eingang**: `webhook/mahnwesen-verarbeitung`
- **Webhook-Ausgang**: `webhook/mahnwesen-versand`
- **Hauptnodes**: `032_TRG_01` (Webhook), `032_SVC_01` (SevDesk API), `032_FWD_01` (Forward)

### **Teil 3: Versand (Node-IDs: 033\_\***)\*\*

- **Zweck**: Versendet Mahnungen und verfolgt Eskalationsstufen
- **Webhook-Eingang**: `webhook/mahnwesen-versand`
- **Hauptnodes**: `033_TRG_01` (Webhook), `033_SVC_01` (E-Mail Service), `033_OUT_01` (Output)

### **Vorteile der systematischen Node-IDs:**

- **Rechtssichere Dokumentation** durch eindeutige Nachverfolgung
- **Automatisierte Eskalation** mit klaren Workflow-Stufen
- **Compliance-Tracking** für Audit-Zwecke
- **Skalierbare Mahnstrategie** ohne Namenskonflikte

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

## Produktionsreife Workflow-Dateien

Der Mahnwesen-Workflow besteht aus drei separaten n8n-Workflows mit systematischen Node-IDs:

### **Teil 1: `Teil1-Erkennung/erkennung.json`**

- **Überfällige Rechnungen identifizieren**
- **Node-ID-Schema**: `031_*` (Kategorie 03, Teil 1)
- **Webhook-Ausgang**: `webhook/mahnwesen-verarbeitung`
- **Status**: ✅ Produktionsbereit

### **Teil 2: `Teil2-Verarbeitung/verarbeitung.json`**

- **Mahnungen erstellen und Gebühren berechnen**
- **Node-ID-Schema**: `032_*` (Kategorie 03, Teil 2)
- **Webhook-Eingang**: `webhook/mahnwesen-verarbeitung`
- **Webhook-Ausgang**: `webhook/mahnwesen-versand`
- **Status**: ✅ Produktionsbereit

### **Teil 3: `Teil3-Versand/versand.json`**

- **Mahnungsversand und Eskalation**
- **Node-ID-Schema**: `033_*` (Kategorie 03, Teil 3)
- **Webhook-Eingang**: `webhook/mahnwesen-versand`
- **Status**: ✅ Produktionsbereit

### **Konfigurationshinweise:**

- **Webhook-URLs**: Anpassung an Ihre n8n-Installation erforderlich
- **API-Credentials**: SevDesk, IONOS AI Hub, PostgreSQL, E-Mail-Server
- **Rechtliche Parameter**: Verzugszinssätze und Mahngebühren nach aktueller Rechtslage
- **Node-IDs**: Bereits systematisch implementiert - keine Änderungen erforderlich
