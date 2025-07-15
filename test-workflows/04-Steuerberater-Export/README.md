# Automatisierter Steuerberater-Export mit SevDesk (v2)

Dieser Workflow automatisiert die Aufbereitung und den Export von Buchhaltungsdaten aus SevDesk für den Steuerberater unter Einhaltung der DSGVO-Richtlinien.

## Produktionsreife Modulare Struktur

Der Steuerberater-Export-Workflow besteht aus drei separaten Teilen mit systematischen Node-IDs:

### **Teil 1: Extraktion (Node-IDs: 041\_\***)\*\*

- **Zweck**: Zeitgesteuerte Extraktion von Buchhaltungsdaten aus SevDesk
- **Webhook-Ausgang**: `webhook/steuerberater-aufbereitung`
- **Hauptnodes**: `041_TRG_01` (Schedule), `041_SVC_01` (SevDesk API), `041_FWD_01` (Forward)

### **Teil 2: Aufbereitung (Node-IDs: 042\_\***)\*\*

- **Zweck**: Validierung, Formatierung und Erstellung von DATEV-konformen Exportdateien
- **Webhook-Eingang**: `webhook/steuerberater-aufbereitung`
- **Webhook-Ausgang**: `webhook/steuerberater-uebermittlung`
- **Hauptnodes**: `042_TRG_01` (Webhook), `042_TRF_01` (DATEV Transform), `042_FWD_01` (Forward)

### **Teil 3: Übermittlung (Node-IDs: 043\_\***)\*\*

- **Zweck**: Sichere Übermittlung an den Steuerberater und Dokumentation
- **Webhook-Eingang**: `webhook/steuerberater-uebermittlung`
- **Hauptnodes**: `043_TRG_01` (Webhook), `043_SVC_01` (Secure Transfer), `043_OUT_01` (Output)

### **Vorteile der systematischen Node-IDs:**

- **Compliance-Tracking** für steuerliche Nachweise
- **Revisionssichere Prozesse** durch eindeutige Nachverfolgung
- **Automatisierte Qualitätskontrolle** mit klaren Validierungsschritten
- **Skalierbare Exportstrategien** ohne Namenskonflikte

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

## Produktionsreife Workflow-Dateien

Der Steuerberater-Export-Workflow besteht aus drei separaten n8n-Workflows mit systematischen Node-IDs:

### **Teil 1: `Teil1-Extraktion/extraktion.json`**

- **Buchhaltungsdaten aus SevDesk extrahieren**
- **Node-ID-Schema**: `041_*` (Kategorie 04, Teil 1)
- **Webhook-Ausgang**: `webhook/steuerberater-aufbereitung`
- **Status**: ✅ Produktionsbereit

### **Teil 2: `Teil2-Aufbereitung/aufbereitung.json`**

- **DATEV-konforme Formatierung und Validierung**
- **Node-ID-Schema**: `042_*` (Kategorie 04, Teil 2)
- **Webhook-Eingang**: `webhook/steuerberater-aufbereitung`
- **Webhook-Ausgang**: `webhook/steuerberater-uebermittlung`
- **Status**: ✅ Produktionsbereit

### **Teil 3: `Teil3-Übermittlung/uebermittlung.json`**

- **Sichere Übermittlung und Archivierung**
- **Node-ID-Schema**: `043_*` (Kategorie 04, Teil 3)
- **Webhook-Eingang**: `webhook/steuerberater-uebermittlung`
- **Status**: ✅ Produktionsbereit

### **Konfigurationshinweise:**

- **Webhook-URLs**: Anpassung an Ihre n8n-Installation erforderlich
- **API-Credentials**: SevDesk, IONOS AI Hub, Cloud Storage, DATEV (optional)
- **Steuerliche Parameter**: Geschäftsjahr, Unternehmensform, Steuernummer
- **Node-IDs**: Bereits systematisch implementiert - keine Änderungen erforderlich
