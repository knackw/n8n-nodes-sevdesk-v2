# Belegerfassung - Teil 1: Erfassung

Dieser Workflow ist der erste Baustein des modularen Belegerfassungs-Systems und übernimmt die Eingangsverarbeitung von Dokumenten aus verschiedenen Quellen.

## 🎯 **Hauptfunktionen**

### **Dokumentenquellen:**

- **Zeitgesteuerte Ordnerüberwachung** - Stündliche Überprüfung von Scan-Ordnern
- **Webhook-Endpoints** - Sofortige Verarbeitung bei externen Uploads
- **E-Mail-Anhänge** - Automatische Extraktion aus E-Mail-Postfächern
- **Manuelle Uploads** - API-basierte Dokumentenübertragung

### **Datenverarbeitung:**

- **Format-Erkennung** - Automatische Bestimmung von PDF, JPG, PNG Dateien
- **Metadaten-Extraktion** - Dateiname, Größe, Zeitstempel, Quelle
- **Datenvalidierung** - Prüfung auf vollständige und konsistente Informationen
- **Standardisierung** - Einheitliches JSON-Format für nachgelagerte Prozesse

## 🔄 **Workflow-Ablauf**

```
[Trigger] → [Merge] → [Datenextraktion] → [Aufbereitung] → [Weiterleitung an Teil 2]
     ↓                                                           ↓
[Fehlerbehandlung] ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← [Error Handling]
```

### **1. Trigger-Phase**

Drei parallel laufende Trigger erfassen Dokumente:

**Schedule Trigger (Stündlich):**

- Überwacht konfigurierte Eingabe-Ordner
- Erkennt neue Dateien seit letzter Ausführung
- Verhindert Überlastung durch zeitgesteuerte Batches

**Webhook Trigger:**

- Empfängt POST-Requests mit Dokumenten-Payload
- Ermöglicht Echtzeit-Integration mit externen Systemen
- Sicherer Endpoint mit konfigurierbarer Authentication

**Directory Listing:**

- Scannt E-Mail-Anhang-Ordner auf neue Dateien
- Unterstützt verschiedene Dateiformate (PDF, JPG, PNG)
- Automatische Archivierung verarbeiteter Dateien

### **2. Datenextraktion**

Vereinheitlichung der Eingabedaten verschiedener Trigger:

```javascript
// Webhook-Daten
{
  source: 'webhook',
  fileName: 'rechnung.pdf',
  fileData: base64EncodedContent,
  fileType: 'application/pdf',
  metadata: { uploadMethod: 'api', uploadTime: '2024-01-15T10:30:00Z' }
}

// File-System-Daten
{
  source: 'file_system',
  fileName: 'scan001.pdf',
  filePath: '/uploads/scan001.pdf',
  fileType: 'application/pdf',
  metadata: { uploadMethod: 'directory_scan', fileSize: 245760 }
}
```

### **3. Datenaufbereitung**

Strukturierung für optimale SevDesk-Verarbeitung:

```javascript
{
  document: {
    fileName: 'rechnung.pdf',
    filePath: '/path/to/file.pdf',
    fileType: 'application/pdf',
    source: 'webhook'
  },
  processing: {
    stage: 'Teil1-Completed',
    workflowVersion: 'v2',
    nextStep: 'Teil2-Verarbeitung'
  },
  sevdesk: {
    category: 'Eingangsrechnung',
    status: 'pending_processing',
    requiresValidation: true
  }
}
```

### **4. Weiterleitung**

Automatische Übertragung an Teil 2 über HTTP-Webhook:

- **POST-Request** an konfigurierbare Webhook-URL
- **JSON-Payload** mit vollständigen Dokumentendaten
- **Custom Headers** für Workflow-Tracking
- **30s Timeout** für zuverlässige Übertragung

## ⚙️ **Konfiguration**

### **Node-ID-System:**

Systematische Namenskonvention mit `011_*` für Teil 1 der Belegerfassung:

- `011_TRG_01` - Schedule Trigger (Stündlich)
- `011_TRG_02` - Webhook Trigger
- `011_TRG_03` - Directory Listing
- `011_MRG_01` - Trigger-Zusammenführung
- `011_TRF_01` - Datenextraktion
- `011_TRF_02` - Dokumentenaufbereitung
- `011_FWD_01` - An Teil 2 weiterleiten
- `011_ERR_01` - Fehlerbehandlung
- `011_NOT_01` - Support-Benachrichtigung

### **Webhook-URLs anpassen:**

```javascript
// In Node "011_FWD_01"
url: "http://localhost:5678/webhook/document-processing";
```

### **Ordner-Pfade konfigurieren:**

```javascript
// In Node "011_TRG_03"
path: "/path/to/your/email/attachments";
```

### **E-Mail-Benachrichtigungen:**

```javascript
// In Node "011_NOT_01"
fromEmail: "workflow@your-company.com";
toEmail: "support@your-company.com";
```

## 🔍 **Monitoring und Debugging**

### **Erfolgs-Metriken:**

- **Verarbeitete Dokumente** - Anzahl erfolgreich weitergeleiteter Files
- **Verarbeitungszeit** - Durchschnittliche Latenz pro Dokument
- **Fehlerrate** - Prozentsatz fehlgeschlagener Verarbeitungen
- **Quelle-Verteilung** - Anteil der verschiedenen Input-Kanäle

### **Error-Handling:**

- **Automatische Retry** bei temporären Netzwerkfehlern
- **E-Mail-Alerts** bei kritischen Fehlern
- **Detaillierte Logs** mit Zeitstempel und Kontext
- **Graceful Degradation** bei partiellen Ausfällen

### **Debugging-Informationen:**

```javascript
// Erfolgs-Log Struktur
{
  timestamp: "2024-01-15T10:30:00Z",
  workflow: "Teil1-Erfassung",
  status: "success",
  document: {
    fileName: "rechnung.pdf",
    source: "webhook",
    fileType: "application/pdf"
  },
  processingTime: 1247 // milliseconds
}
```

## 🚀 **Performance-Optimierung**

### **Für verschiedene Lasten:**

**Low Volume (< 100 Dokumente/Tag):**

- Standard-Konfiguration ausreichend
- Stündliche Schedule-Ausführung
- Einfache Fehlerbehandlung

**Medium Volume (100-1000 Dokumente/Tag):**

- Webhook-basierte Echtzeit-Verarbeitung
- Parallele Verarbeitung aktivieren
- Erweiterte Monitoring-Dashboards

**High Volume (> 1000 Dokumente/Tag):**

- Batch-Processing mit größeren Intervallen
- Queue-basierte Architektur
- Dedicated n8n-Worker-Instances

## 🔐 **Sicherheitsaspekte**

### **DatenSchutz:**

- **Lokale Verarbeitung** - Dokumente verbleiben in Ihrem System
- **Verschlüsselte Übertragung** - HTTPS für alle API-Calls
- **Zugriffskontrollen** - Webhook-Authentifizierung
- **Audit-Trails** - Vollständige Nachverfolgbarkeit

### **API-Sicherheit:**

- **Rate Limiting** - Schutz vor Überlastung
- **Input Validation** - Prüfung aller Eingabedaten
- **Error Sanitization** - Keine sensiblen Daten in Logs
- **Credential Management** - Sichere Speicherung in n8n

## 📋 **Nächste Schritte**

Nach erfolgreichem Setup von Teil 1:

1. **Teil 2 (Verarbeitung)** importieren und konfigurieren
2. **Webhook-URLs** zwischen den Teilen synchronisieren
3. **Test-Dokumente** für End-to-End-Validierung
4. **Monitoring** für Produktiv-Betrieb einrichten
5. **Teil 3 (Validierung)** für vollständigen Workflow

---

**Hinweis**: Dieser Workflow-Teil fungiert als Eingangspunkt für das gesamte Belegerfassungs-System. Stellen Sie sicher, dass Teil 2 korrekt konfiguriert ist, bevor Sie Teil 1 produktiv einsetzen.
