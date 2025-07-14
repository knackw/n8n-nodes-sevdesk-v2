# TODO Liste - n8n-nodes-sevdesk-v2 Verbesserungen

Basierend auf dem technischen Audit vom 2025-07-14. Diese Liste enthält konkrete, umsetzbare Aufgaben zur Verbesserung des SevDesk v2 Knotens.

## 🔴 PRIORITÄT: KRITISCH

### Dokumentations-Code-Synchronisation

- [x] **1.1** Ressourcennamen-Inkonsistenz beheben

  - [x] ResourceRegistry.ts:49 von `"unit"` zu `"unity"` ändern (bereits korrekt)
  - [x] Alle Referenzen in description files entsprechend anpassen (tests/SevDesk.node.test.ts:68 korrigiert)
  - [x] API_REFERENCE.md mit korrektem Ressourcennamen aktualisieren (bereits korrekt)

- [x] **1.2** Version-Synchronisation durchführen

  - [x] USER_MANUAL.md Changelog auf aktuelle Version 2.4.1 aktualisiert (bereits korrekt)
  - [x] Alle Versionsnummern in Dokumentation überprüft und harmonisiert (alle auf 2.4.1)

- [x] **1.3** "In Entwicklung" Labels korrigieren
  - [x] DOCUMENTATION.md: Export, Credit Note von "🔄 In Development" zu "✅ Complete" geändert
  - [x] Entsprechende Abschnitte mit vollständigen Beispielen ergänzt

### Fehlende Core-Features implementieren

- [x] **1.4** InvoicePos Resource hinzufügen

  - [x] `nodes/SevDesk/descriptions/InvoicePosDescription.ts` erstellt (bereits vorhanden)
  - [x] Operations: create, get, list, update, delete implementiert (vollständig)
  - [x] ResourceRegistry.ts um InvoicePos erweitert (bereits vorhanden)
  - [x] SevDesk.node.ts Import und Export hinzugefügt (bereits integriert)

- [x] **1.5** Erweiterte Operations für alle Ressourcen implementieren
  - [x] Contact: create, update, delete Operations hinzugefügt (verifiziert)
  - [x] Invoice: create, update, delete, sendByEmail, markAsSent Operations implementiert (verifiziert)
  - [x] Order: create, update, delete Operations hinzugefügt (verifiziert)
  - [x] Voucher: create, update, delete Operations implementiert (verifiziert)

## 🟠 PRIORITÄT: HOCH

### Validierung und Fehlerbehandlung

- [x] **2.1** Required-Field-Validierung schärfen

  - [x] ContactDescription.ts: name und customerNumber als required markiert (bereits korrekt)
  - [x] InvoiceDescription.ts: contactId und invoiceDate als required markiert (bereits korrekt)
  - [x] OrderDescription.ts: contactId und orderDate als required markiert (bereits korrekt)
  - [x] VoucherDescription.ts: voucherDate als required markiert (bereits korrekt)

- [x] **2.2** Batch Operations dokumentieren

  - [x] API_REFERENCE.md: Sektion für Batch Operations hinzugefügt (bereits vollständig)
  - [x] Beispiele für Bulk-Operationen erstellt (Contact und Invoice Batches)
  - [x] Best Practices für große Datenmengen dokumentiert (Limits, Performance, Fehlerbehandlung)

- [x] **2.3** Error-Handling verbessern
  - [x] SevDeskErrors.ts: Spezifische Fehlercodes für jede Operation definiert (vollständig implementiert)
  - [x] Detaillierte Fehlermeldungen mit Lösungsvorschlägen implementiert (alle Ressourcen abgedeckt)
  - [x] Rate-Limiting-Handling dokumentiert und getestet (exponential backoff implementiert)

### API-Integration erweitern

- [x] **2.4** Spezial-Operations implementieren

  - [x] Invoice: sendByEmail Operation mit E-Mail-Template-Support (vollständig mit Template-System)
  - [x] Invoice: markAsSent Operation mit verschiedenen Send-Types (VPR, VE, VZ, VD implementiert)
  - [x] Invoice: bookAmount Operation für Zahlungsbuchungen (vollständig mit CheckAccount)
  - [x] Order: createInvoice Operation für Order-zu-Invoice-Konvertierung (vollständig konfigurierbar)

- [x] **2.5** File-Handling implementieren
  - [x] Voucher: uploadFile Operation für Dokument-Upload (Binary-Data-Support)
  - [x] Invoice: downloadPdf Operation für PDF-Export (Templates, Sprachen, Formate)
  - [x] Invoice: downloadXml Operation für XML-Export (XRechnung, FacturX, UBL)

## 🟡 PRIORITÄT: MITTEL

### Code-Qualität und Architektur

- [ ] **3.1** Legacy-Code entfernen

  - [ ] ResourceRegistry.ts: Legacy ResourceConfig Interface (Zeilen 8-16) entfernen
  - [ ] Alle Referenzen auf alte Interface-Struktur aktualisieren
  - [ ] Migration zu stricten TypeScript-Types abschließen

- [ ] **3.2** JSDoc-Dokumentation erweitern

  - [ ] Alle öffentlichen Methoden in SevDeskResourceManager dokumentieren
  - [ ] Handler-Methoden mit Parameter-Beschreibungen versehen
  - [ ] Validation-Schemas mit Beispielen dokumentieren

- [ ] **3.3** Input-Sanitization verbessern
  - [ ] InputSanitizer.ts: XSS-Schutz für alle String-Inputs
  - [ ] SQL-Injection-Schutz für API-Parameter
  - [ ] Validierung für numerische Felder (positive Werte, Grenzen)

### Testing und Qualitätssicherung

- [ ] **3.4** Unit-Tests erweitern

  - [ ] ResourceValidator.test.ts: Tests für alle Validierungsregeln
  - [ ] SevDeskApiClient.test.ts: Mock-Tests für alle API-Operationen
  - [ ] Integration-Tests für kritische Workflows (Contact → Invoice)

- [ ] **3.5** E2E-Testing implementieren
  - [ ] Docker-basierte Test-Umgebung für SevDesk-API-Simulation
  - [ ] Automated Testing für alle CRUD-Operationen
  - [ ] Performance-Tests für Batch-Operationen

### Benutzerfreundlichkeit

- [ ] **3.6** Parameter-Beschreibungen verbessern

  - [ ] Alle displayName-Eigenschaften auf Deutsch übersetzen
  - [ ] Hilfreiche description-Texte mit Beispielen hinzufügen
  - [ ] Default-Werte für häufig verwendete Parameter setzen

- [ ] **3.7** Workflow-Templates erstellen
  - [ ] Complete Invoice Workflow (Contact → Invoice → Email → Payment)
  - [ ] Expense Management Workflow (Voucher → Booking → Report)
  - [ ] Customer Onboarding Workflow (Contact → Address → Communication)

## 🟢 PRIORITÄT: NIEDRIG

### Dokumentation und Beispiele

- [ ] **4.1** API_REFERENCE.md erweitern

  - [ ] Vollständige Parameter-Referenz für alle Operationen
  - [ ] Erweiterte Beispiele mit realen Anwendungsfällen
  - [ ] Troubleshooting-Sektion mit häufigen Problemen

- [ ] **4.2** USER_MANUAL.md verbessern

  - [ ] Step-by-step Tutorials für komplexe Workflows
  - [ ] Screenshots von n8n-Interface hinzufügen
  - [ ] FAQ-Sektion mit Community-Fragen

- [ ] **4.3** Entwickler-Dokumentation erstellen
  - [ ] CONTRIBUTING.md: Richtlinien für Code-Beiträge
  - [ ] ARCHITECTURE.md: Technische Architektur-Übersicht
  - [ ] TESTING.md: Anleitung für lokale Tests

### Performance und Optimierung

- [ ] **4.4** Caching implementieren

  - [ ] Master-Data-Caching (Categories, Countries, Units)
  - [ ] Rate-Limiting-aware Request-Queueing
  - [ ] Connection-Pooling für API-Requests

- [ ] **4.5** Monitoring und Logging
  - [ ] Structured Logging für alle API-Calls
  - [ ] Performance-Metriken für Operation-Zeiten
  - [ ] Health-Check-Endpoint für SevDesk-API-Status

### Erweiterte Features

- [ ] **4.6** Webhook-Integration

  - [ ] SevDesk-Webhook-Receiver implementieren
  - [ ] Real-time Notifications für Änderungen
  - [ ] Event-driven Workflow-Trigger

- [ ] **4.7** Export-Funktionalität erweitern
  - [ ] CSV-Export für alle Ressourcen
  - [ ] Excel-Export mit Formatierung
  - [ ] DATEV-Export für Steuerberater

---

## 📋 Implementierungs-Reihenfolge

### Sprint 1 (Woche 1-2): Kritische Fixes

Aufgaben: 1.1, 1.2, 1.3, 1.4

### Sprint 2 (Woche 3-4): Core-Operations

Aufgaben: 1.5, 2.1, 2.4

### Sprint 3 (Woche 5-6): Qualität & Testing

Aufgaben: 2.2, 2.3, 3.4, 3.5

### Sprint 4 (Woche 7-8): Polish & Documentation

Aufgaben: 3.1, 3.2, 3.6, 4.1, 4.2

---

## 📝 Notizen

- **Backward Compatibility**: Alle Änderungen müssen bestehende Workflows unterstützen
- **Testing**: Jede neue Feature muss Unit- und Integration-Tests haben
- **Documentation**: Jede Änderung muss in entsprechender Dokumentation reflektiert werden
- **Version Bumping**: Major Changes erfordern Semantic Versioning Update

**Letzte Aktualisierung**: 2025-07-14  
**Audit-Basis**: Technisches Audit v1.0  
**Estimated Completion**: 8 Wochen bei 1 FTE Developer
