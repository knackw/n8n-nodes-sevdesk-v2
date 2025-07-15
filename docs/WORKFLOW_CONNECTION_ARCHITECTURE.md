# SevDesk Workflow Connection Architecture

## ✅ **PHASE 1 ABGESCHLOSSEN** - Node ID Management

### **Systematische Node-ID-Aktualisierung - 24/24 Workflows**

#### **Naming Convention Implementiert:**

- Format: `{CAT}{TEIL}_{FUNC}_{NUM}`
- Beispiel: `011_TRG_01`, `012_SVC_01`, `013_VAL_01`

#### **Function Codes:**

- **TRG**: Triggers (scheduleTrigger, webhook, localFileTrigger)
- **MRG**: Merge operations
- **EXT**: Extract/Parse (code nodes extracting data)
- **VAL**: Validate/Check (if nodes for validation)
- **SVC**: Service/API calls (sevDesk, httpRequest to APIs)
- **TRF**: Transform/Process (code nodes transforming data)
- **FWD**: Forward/Send (httpRequest forwarding to next part)
- **ERR**: Error handling (if nodes for error detection)
- **LOG**: Logging/Monitoring (code nodes for logging)
- **NOT**: Notifications (emailSend, signal)
- **DOC**: Documentation (stickyNote)
- **SPL**: Split operations (splitInBatches)
- **FIL**: File operations (file reading, writing)
- **OUT**: Output operations (final data export)

#### **Vollständige Kategorien-Abdeckung:**

- **01-Belegerfassung**: `011_*`, `012_*`, `013_*` ✅
- **02-Rechnungsstellung**: `021_*`, `022_*`, `023_*` ✅
- **03-Mahnwesen**: `031_*`, `032_*`, `033_*` ✅
- **04-Steuerberater-Export**: `041_*`, `042_*`, `043_*` ✅
- **05-Banktransaktionen**: `051_*`, `052_*`, `053_*` ✅
- **06-Reporting**: `061_*`, `062_*`, `063_*` ✅
- **07-Dokumentenmanagement**: `071_*`, `072_*`, `073_*` ✅
- **08-Kundenkommunikation**: `081_*`, `082_*`, `083_*` ✅

---

## 🔄 **PHASE 2** - Workflow Connection Architecture Design

### **Inter-Workflow-Verbindungen**

#### **Workflow-Ketten-Struktur:**

**1. Belegerfassung → Dokumentenmanagement**

```
011_FWD_01 → 071_TRG_01 (Archivierung)
012_FWD_01 → 072_TRG_01 (Verarbeitung)
013_OUT_01 → 073_TRG_01 (Compliance)
```

**2. Rechnungsstellung → Mahnwesen**

```
021_FWD_01 → 031_TRG_01 (Überfälligkeits-Check)
022_FWD_01 → 032_TRG_01 (Mahnung generieren)
023_OUT_01 → 033_TRG_01 (Versand-Status)
```

**3. Alle Workflows → Steuerberater-Export**

```
*_LOG_* → 041_TRG_01 (Monatlicher Sammel-Export)
*_OUT_* → 042_TRG_01 (Datenaufbereitung)
```

**4. Banktransaktionen → Belegerfassung**

```
051_OUT_01 → 011_TRG_02 (Automatische Buchung)
052_FWD_01 → 012_TRG_01 (Kategorisierung)
```

**5. Reporting ← Alle Workflows**

```
*_LOG_* → 061_TRG_01 (Datenextraktion)
*_OUT_* → 062_TRG_01 (Analyse)
```

**6. Kundenkommunikation ← Ereignis-getrieben**

```
013_ERR_01 → 081_TRG_01 (Fehler-Benachrichtigung)
023_OUT_01 → 082_TRG_01 (Rechnungs-Versand)
033_OUT_01 → 083_TRG_01 (Mahnungs-Versand)
```

### **Webhook-Endpunkte für Inter-Workflow-Kommunikation**

#### **Standardisierte Webhook-URLs:**

```
http://localhost:5678/webhook/belegerfassung-verarbeitung
http://localhost:5678/webhook/rechnungsstellung-erstellung
http://localhost:5678/webhook/mahnwesen-verarbeitung
http://localhost:5678/webhook/steuerberater-aufbereitung
http://localhost:5678/webhook/banktransaktionen-kategorisierung
http://localhost:5678/webhook/reporting-analyse
http://localhost:5678/webhook/dokumentenmanagement-archivierung
http://localhost:5678/webhook/kundenkommunikation-versand
```

#### **Webhook-Sicherheit:**

- Einheitlicher Webhook-Key: `secret-key`
- Header-Authentifizierung: `X-Webhook-Key`
- Payload-Validierung in jedem Workflow

### **Datenfluss-Architektur**

#### **Zentrale Datenstrukturen:**

```json
{
	"workflowId": "CAT_TEIL_timestamp",
	"sourceWorkflow": "CAT_TEIL",
	"targetWorkflow": "CAT_TEIL",
	"data": {
		"documentId": "string",
		"customerId": "string",
		"amount": "number",
		"status": "string",
		"metadata": {}
	},
	"timestamp": "ISO-8601",
	"processed": "boolean"
}
```

#### **Error-Handling-Kette:**

```
Fehler → ERR_01 → NOT_01 → Support-Benachrichtigung
Fehler → ERR_01 → NOT_02 → Signal-Alert
Fehler → ERR_01 → LOG_01 → Audit-Trail
```

### **Monitoring und Observability**

#### **Workflow-Status-Tracking:**

- Jeder `*_FWD_*` Node loggt Übertragungen
- Jeder `*_ERR_*` Node protokolliert Fehler
- Jeder `*_OUT_*` Node bestätigt Abschluss

#### **Performance-Metriken:**

- Durchlaufzeit pro Workflow-Kategorie
- Fehlerrate pro Verbindung
- Durchsatz pro Stunde/Tag

### **Deployment-Strategie**

#### **Workflow-Aktivierung Reihenfolge:**

1. **Basis-Workflows** (ohne Abhängigkeiten)
2. **Datenverarbeitende Workflows** (mit Input-Abhängigkeiten)
3. **Reporting und Export** (mit Output-Abhängigkeiten)
4. **Kommunikations-Workflows** (Event-getrieben)

#### **Rollback-Verfahren:**

- Workflow-spezifische Deaktivierung
- Datenbank-Rollback für verarbeitete Datensätze
- Webhook-Replay für fehlgeschlagene Übertragungen

---

## 📊 **ERFOLGS-METRIKEN**

### **Technische Metriken:**

- ✅ **100% Eindeutige Node-IDs** (0 Duplikate)
- ✅ **24/24 Workflows** systematisch strukturiert
- ✅ **Skalierbare Namenskonvention** (bis 99 Nodes/Funktion)
- ✅ **Automatisierte Referenz-Aktualisierung**

### **Betriebsmetriken (Ziel):**

- **90% Reduzierung** manueller Buchführungs-Aufgaben
- **< 5 Sekunden** Antwortzeit für Webhook-Verarbeitung
- **99.9% Verfügbarkeit** für kritische Workflow-Ketten
- **100% Audit-Trail** für Finanztransaktionen

### **Compliance-Metriken:**

- **GoBD-konforme Archivierung** (07-Dokumentenmanagement)
- **DATEV-Export** (04-Steuerberater-Export)
- **Unveränderliche Belege** nach Freigabe
- **Vollständige Nachverfolgbarkeit** aller Änderungen

---

## 🎯 **NÄCHSTE SCHRITTE**

### **Phase 3: Feature-Implementierung**

- [ ] SevDesk API Integration Enhancement
- [ ] Multi-Channel Communication Features
- [ ] AI & OCR Pipeline Completion
- [ ] GoBD Compliance Features

### **Phase 4: Testing & Validation**

- [ ] End-to-End Workflow Testing
- [ ] Performance & Load Testing
- [ ] Security & Compliance Validation
- [ ] Production Deployment

---

**Status**: ✅ **KRITISCHE PHASE 1 ABGESCHLOSSEN**
**Zeitplan**: Beschleunigt von 6 Wochen auf 1 Session
**Nächste Priorität**: Feature-Implementierung und Testing

**Letzte Aktualisierung**: $(date)
**Architektur-Version**: v2.0.0
**Deployment-Status**: Bereit für Phase 3
