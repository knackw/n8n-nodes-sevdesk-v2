# Automatische Belegerfassung mit SevDesk (v2)

Dieser Workflow automatisiert die Erfassung und Verarbeitung von Belegen in SevDesk für eine effiziente Buchhaltung.

## Modulare Workflow-Struktur

Der Belegerfassungs-Workflow wurde in drei separate Module aufgeteilt, die über Webhooks miteinander kommunizieren:

1. **Teil 1: Erfassung** - Überwacht verschiedene Quellen, extrahiert Dokumentendaten und leitet sie zur Verarbeitung weiter
2. **Teil 2: Verarbeitung** - Erstellt Belege in SevDesk und verwaltet die Dokumentenablage
3. **Teil 3: Validierung** - Führt Validierung durch und aktualisiert den Belegstatus

Diese modulare Struktur verbessert die Wartbarkeit und verhindert Timeout-Probleme bei komplexen Workflows.

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

### 3. **Webhook-Endpoints definieren:**
- Teil-1-zu-Teil-2: `/webhook/document-processing`
- Teil-2-zu-Teil-3: `/webhook/document-validation`
- Fehler-Handler: `/webhook/error-handling`

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

## Workflow-Dateien

Die Belegerfassung besteht aus drei separaten n8n-Workflows:

- `Teil1-Erfassung/erfassung.json` - Dokumenteneingang und -vorbereitung
- `Teil2-Verarbeitung/verarbeitung.json` - SevDesk-Integration und Speicherung  
- `Teil3-Validierung/validierung-basic.json` - Validierung und Freigabe

Jeder Teil kann separat importiert und an Ihre Anforderungen angepasst werden.
