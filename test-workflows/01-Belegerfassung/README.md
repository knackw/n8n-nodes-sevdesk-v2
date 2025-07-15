# Automatische Belegerfassung mit SevDesk (v2)

Dieser Workflow automatisiert die Erfassung und Verarbeitung von Belegen in SevDesk für eine effiziente Buchhaltung.

## Produktionsreife Modulare Workflow-Struktur

Der Belegerfassungs-Workflow wurde in drei separate Module aufgeteilt, die über standardisierte Webhooks miteinander kommunizieren:

### **Teil 1: Erfassung (Node-IDs: 011\_\***)\*\*

- **Zweck**: Überwacht verschiedene Quellen, extrahiert Dokumentendaten und leitet sie zur Verarbeitung weiter
- **Webhook-Ausgang**: `webhook/document-processing`
- **Hauptnodes**: `011_TRG_01` (Schedule), `011_TRG_02` (Webhook), `011_FWD_01` (Forward)

### **Teil 2: Verarbeitung (Node-IDs: 012\_\***)\*\*

- **Zweck**: Erstellt Belege in SevDesk und verwaltet die Dokumentenablage
- **Webhook-Eingang**: `webhook/document-processing`
- **Webhook-Ausgang**: `webhook/document-validation`
- **Hauptnodes**: `012_TRG_01` (Webhook), `012_SVC_01` (SevDesk API), `012_FWD_01` (Forward)

### **Teil 3: Validierung (Node-IDs: 013\_\***)\*\*

- **Zweck**: Führt Validierung durch und aktualisiert den Belegstatus
- **Webhook-Eingang**: `webhook/document-validation`
- **Hauptnodes**: `013_TRG_01` (Webhook), `013_VAL_01` (Validation), `013_OUT_01` (Output)

### **Vorteile der systematischen Node-IDs:**

- **Wartbarkeit**: Sofortige Erkennung von Funktion und Zugehörigkeit
- **Debugging**: Einfache Verfolgung von Datenflüssen zwischen Teilen
- **Skalierbarkeit**: Systematische Erweiterung ohne Namenskonflikte
- **Teamarbeit**: Eindeutige Referenzierung bei Änderungen und Reviews

## Funktionsweise

### 1. **Belegeingang überwachen** aus verschiedenen Quellen:

- **E-Mail-Anhänge**: PDF-Rechnungen aus dem E-Mail-Postfach
- **Ordner-Überwachung**: Scan-Ordner auf dem Server
- **Webhook-Upload**: Direkte Datenübertragung von externen Systemen
- **Manuelle Uploads**: Benutzer-initiierte Dokument-Uploads

### 2. **Dokumentenverarbeitung**:

- **Dateiformate**: Unterstützung für PDF, JPG, PNG
- **Metadaten-Extraktion**: Dateiname, Größe, Upload-Zeitpunkt
- **Kategorisierung**: Automatische Klassifizierung nach Dokumenttyp
- **Datenvalidierung**: Prüfung auf Vollständigkeit und Format

### 3. **SevDesk-Integration**:

- **Beleg-Erstellung**: Automatische Erstellung von Belegen in SevDesk
- **Kontakt-Verknüpfung**: Zuordnung zu bestehenden Lieferanten/Kunden
- **Kategorie-Zuordnung**: Klassifizierung nach Buchungskategorien
- **Dokument-Upload**: Verknüpfung der Original-Dokumente

### 4. **Validierung und Workflow**:

- **Datenprüfung**: Validierung der extrahierten Informationen
- **Status-Management**: Verfolgen des Verarbeitungsstatus
- **Fehlerbehandlung**: Automatische Retry-Mechanismen
- **Benachrichtigungen**: E-Mail-Alerts bei Problemen

## Vorteile der Automatisierung

- **Zeitersparnis**: Bis zu 80% Reduktion der manuellen Eingabezeit
- **Fehlerreduzierung**: Minimierung von Tippfehlern und Übertragungsfehlern
- **Konsistenz**: Einheitliche Datenqualität und -struktur
- **Nachverfolgbarkeit**: Vollständiger Audit-Trail aller Verarbeitungsschritte
- **Skalierbarkeit**: Verarbeitung großer Dokumentenmengen

## Technische Voraussetzungen

### **Grundausstattung:**

- n8n-Installation (Version 0.214.0+)
- SevDesk-Node (v2) mit gültigen API-Credentials
- Stabile Internetverbindung für API-Zugriffe

### **Optionale Komponenten:**

- E-Mail-Server-Zugang für automatischen Anhang-Import
- Netzwerk-Ordner für Scan-to-Folder-Funktionalität
- SMTP-Server für Benachrichtigungen

## Konfiguration

### 1. **SevDesk-Verbindung einrichten:**

```json
{
	"apiKey": "Ihr-SevDesk-API-Schlüssel",
	"apiVersion": "v2"
}
```

### 2. **Ordner-Überwachung konfigurieren:**

- Eingabe-Ordner für neue Dokumente
- Archiv-Ordner für verarbeitete Dateien
- Fehler-Ordner für problematische Dokumente

### 3. **Webhook-Endpoints konfigurieren:**

**Vollständig implementierte Inter-Workflow-Kommunikation:**

- **Teil 1 → Teil 2**: `webhook/document-processing`
  - Node `011_FWD_01` sendet an `012_TRG_01`
  - JSON-Payload mit Dokumentendaten und Metadaten
- **Teil 2 → Teil 3**: `webhook/document-validation`
  - Node `012_FWD_01` sendet an `013_TRG_01`
  - Erweiterte Daten mit SevDesk-Integration
- **Fehler-Handler**: Integriert in jeden Workflow-Teil
  - Nodes `01X_ERR_01` für Fehlerbehandlung
  - Nodes `01X_NOT_01` für Benachrichtigungen

### 4. **Benachrichtigungen einrichten:**

- E-Mail-Adressen für Success/Error-Meldungen
- Eskalations-Regeln bei wiederholten Fehlern

## Workflow-Anpassungen

### **Für verschiedene Unternehmensgrößen:**

**Kleine Unternehmen (< 50 Belege/Monat):**

- Einfache Ordner-Überwachung
- Manuelle Validierung
- E-Mail-Benachrichtigungen

**Mittlere Unternehmen (50-500 Belege/Monat):**

- Multi-Channel-Eingang
- Teilautomatisierte Validierung
- Dashboard-Integration

**Große Unternehmen (> 500 Belege/Monat):**

- Vollautomatisierte Verarbeitung
- Erweiterte Fehlerbehandlung
- Performance-Monitoring

## Datenschutz und Sicherheit

- **Lokale Verarbeitung**: Dokumente verbleiben in Ihrem n8n-System
- **API-Sicherheit**: Verschlüsselte Übertragung zu SevDesk
- **Zugriffskontrollen**: Rollenbasierte Berechtigungen
- **Audit-Logs**: Lückenlose Dokumentation aller Aktionen

## Produktionsreife Workflow-Dateien

Die Belegerfassung besteht aus drei separaten n8n-Workflows mit systematischen Node-IDs:

### **Teil 1: `Teil1-Erfassung/erfassung.json`**

- **Dokumenteneingang und -vorbereitung**
- **Node-ID-Schema**: `011_*` (Kategorie 01, Teil 1)
- **Webhook-Ausgang**: `webhook/document-processing`
- **Status**: ✅ Produktionsbereit

### **Teil 2: `Teil2-Verarbeitung/verarbeitung.json`**

- **SevDesk-Integration und Speicherung**
- **Node-ID-Schema**: `012_*` (Kategorie 01, Teil 2)
- **Webhook-Eingang**: `webhook/document-processing`
- **Webhook-Ausgang**: `webhook/document-validation`
- **Status**: ✅ Produktionsbereit

### **Teil 3: `Teil3-Validierung/validierung-basic.json`**

- **Validierung und Freigabe**
- **Node-ID-Schema**: `013_*` (Kategorie 01, Teil 3)
- **Webhook-Eingang**: `webhook/document-validation`
- **Status**: ✅ Produktionsbereit

### **Konfigurationshinweise:**

- **Webhook-URLs**: Anpassung an Ihre n8n-Installation erforderlich
- **Credentials**: SevDesk API-Schlüssel und SMTP-Einstellungen
- **Ordnerpfade**: Lokale Pfade für Dokumentenverarbeitung
- **Node-IDs**: Bereits systematisch implementiert - keine Änderungen erforderlich
