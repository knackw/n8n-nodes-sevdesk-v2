# SevDesk Node Dokumentation

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Installation](#installation)
3. [Konfiguration](#konfiguration)
4. [Ressourcen](#ressourcen)
5. [Operationen](#operationen)
6. [Erweiterte Funktionen](#erweiterte-funktionen)
7. [Beispiele](#beispiele)
8. [Fehlerbehebung](#fehlerbehebung)
9. [API-Referenz](#api-referenz)
10. [Best Practices](#best-practices)
11. [Entwicklung](#entwicklung)

## Übersicht

Der SevDesk Node für n8n bietet eine direkte Integration mit der SevDesk Buchhaltungsplattform. SevDesk ist eine beliebte deutsche Buchhaltungssoftware, die eine robuste API für Automatisierung und Integration bietet.

### Hauptfunktionen

- **Vollständige CRUD-Operationen**: Erstellen, lesen, aktualisieren und löschen für alle wichtigen Entitäten
- **API v2 Unterstützung**: Neueste API-Version mit Rückwärtskompatibilität
- **Umfassende Filterung**: Erweiterte Such- und Filterfunktionen
- **Dateiverwaltung**: Upload und Download von Dokumenten
- **Batch-Operationen**: Effiziente Verarbeitung mehrerer Elemente
- **Fehlerbehandlung**: Robuste Fehlerbehandlung mit detailliertem Feedback
- **Direkte API-Integration**: Keine externen Abhängigkeiten oder Zwischenschichten
- **Einfache Konfiguration**: Nur API-Schlüssel und Version erforderlich

### Unterstützte Ressourcen

| Ressource | Status | Beschreibung |
|-----------|--------|--------------|
| Kontakte | ✅ Vollständig | Kontaktverwaltung mit Adressen und benutzerdefinierten Feldern |
| Rechnungen | ✅ Vollständig | Vollständiger Rechnungslebenszyklus einschließlich PDF-Generierung |
| Aufträge | ✅ Vollständig | Auftragsverwaltung mit Positionen |
| Belege | ✅ Vollständig | Belegverwaltung mit Dateianhängen |
| Artikel | ✅ Vollständig | Lagerverwaltung mit Bestandsverfolgung |
| Bankwesen | ✅ Vollständig | Bankkonten und Transaktionen |
| Tags | ✅ Vollständig | Flexibles Tagging-System |
| Berichte | ✅ Vollständig | PDF-Berichtsgenerierung |
| Gutschriften | 🔄 In Bearbeitung | Gutschriftenverwaltung |
| Exporte | 🔄 In Bearbeitung | Datenexport-Funktionalität |

## Installation

### Über n8n Community Nodes

```bash
npm install n8n-nodes-sevdesk-v2
```

### Manuelle Installation

1. Repository klonen
2. Dependencies installieren: `npm install`
3. Build erstellen: `npm run build`
4. Node verlinken: `npm link`

## Konfiguration

### SevDesk API-Credentials

Die SevDesk-Node benötigt nur zwei einfache Konfigurationsparameter:

1. **API Key**: Ihr SevDesk API-Schlüssel
2. **API Version**: v2 (empfohlen) oder v1 (Legacy)

#### API-Schlüssel erstellen

1. Melden Sie sich bei SevDesk an
2. Gehen Sie zu **Einstellungen** > **Benutzerverwaltung** > **API**
3. Erstellen Sie einen neuen API-Schlüssel
4. Konfigurieren Sie die Credentials in n8n

## Erweiterte Funktionen

### Bulk-Operationen

Für effiziente Verarbeitung großer Datenmengen unterstützt der Node Batch-Operationen:

```javascript
// Mehrere Kontakte gleichzeitig erstellen
const contacts = [
  { name: "Kunde 1", customerNumber: "K001" },
  { name: "Kunde 2", customerNumber: "K002" },
  { name: "Kunde 3", customerNumber: "K003" }
];

// Batch-Verarbeitung mit Fehlerbehandlung
for (const contact of contacts) {
  try {
    await sevDeskApi.createContact(contact);
  } catch (error) {
    console.error(`Fehler beim Erstellen von ${contact.name}:`, error);
  }
}
```

### Datei-Upload/Download

Der SevDesk Node unterstützt den Upload und Download von Dokumenten:

```javascript
// Beleg mit Anhang hochladen
const voucher = {
  date: "2024-01-15",
  supplier: { id: "123" },
  voucherType: "VOU",
  status: "50",
  attachment: {
    filename: "rechnung.pdf",
    content: base64Content
  }
};
```

### Fehlerbehandlung

Umfassende Fehlerbehandlung mit automatischen Retry-Mechanismen:

```javascript
// Automatische Wiederholung bei temporären Fehlern
const maxRetries = 3;
let attempt = 0;

while (attempt < maxRetries) {
  try {
    const result = await sevDeskApi.createInvoice(invoiceData);
    return result;
  } catch (error) {
    attempt++;
    if (attempt >= maxRetries) throw error;
    await sleep(1000 * attempt); // Exponential backoff
  }
}
```

## Beispiele

### Einfacher Rechnungs-Workflow

```javascript
// 1. Neuen Kontakt erstellen
const contact = await sevDesk.contact.create({
  name: "Max Mustermann",
  customerNumber: "CUST-001",
  category: { id: "3" }
});

// 2. Artikel erstellen
const part = await sevDesk.part.create({
  name: "Beratungsleistung",
  partNumber: "BER-001",
  price: 100.00,
  unity: { id: "1" }
});

// 3. Rechnung erstellen
const invoice = await sevDesk.invoice.create({
  contact: { id: contact.id },
  invoiceDate: new Date().toISOString().split('T')[0],
  status: "100",
  invoiceType: "RE"
});

// 4. Rechnungsposition hinzufügen
const invoicePos = await sevDesk.invoicePos.create({
  invoice: { id: invoice.id },
  part: { id: part.id },
  quantity: 1,
  price: 100.00
});

// 5. Rechnung finalisieren und versenden
const finalInvoice = await sevDesk.invoice.sendBy({
  id: invoice.id,
  sendType: "VPR" // Per E-Mail
});
```

### Belegerkennung und -verarbeitung

```javascript
// PDF-Beleg aus E-Mail-Anhang verarbeiten
const attachment = $input.item.binary.attachment;

// Beleg in SevDesk erstellen
const voucher = await sevDesk.voucher.create({
  date: extractedData.date,
  supplier: { id: supplierId },
  sumNet: extractedData.netAmount,
  sumTax: extractedData.taxAmount,
  sumGross: extractedData.grossAmount,
  voucherType: "VOU",
  status: "50"
});

// PDF-Datei anhängen
const document = await sevDesk.voucherPos.createDocument({
  voucher: { id: voucher.id },
  filename: attachment.fileName,
  content: attachment.data
});
```

### Mahnwesen-Automation

```javascript
// Überfällige Rechnungen finden
const overdueInvoices = await sevDesk.invoice.getMany({
  'status[lt]': '200', // Nicht bezahlt
  'dueDate[lt]': new Date().toISOString().split('T')[0]
});

// Mahnungen erstellen
for (const invoice of overdueInvoices) {
  const daysOverdue = calculateDaysOverdue(invoice.dueDate);
  
  if (daysOverdue > 30) {
    // 3. Mahnung
    await createDunningNotice(invoice, 3);
  } else if (daysOverdue > 14) {
    // 2. Mahnung
    await createDunningNotice(invoice, 2);
  } else if (daysOverdue > 7) {
    // 1. Mahnung
    await createDunningNotice(invoice, 1);
  }
}
```

## API-Referenz

### Standard-Operationen

Alle Ressourcen unterstützen die folgenden Basis-Operationen:

- **Create**: Neue Entität erstellen
- **Get**: Einzelne Entität abrufen
- **Get Many**: Multiple Entitäten abrufen (mit Filterung)
- **Update**: Entität aktualisieren
- **Delete**: Entität löschen

### Erweiterte Operationen

Zusätzliche Operationen je nach Ressource:

- **Send By Email**: Dokumente per E-Mail versenden
- **Render PDF**: PDF-Dokumente generieren
- **Book**: Buchungen durchführen
- **Cancel**: Stornierungen
- **Copy**: Entitäten duplizieren

### Filter-Parameter

Umfassende Filteroptionen für Get Many-Operationen:

```javascript
// Erweiterte Filterung
const invoices = await sevDesk.invoice.getMany({
  'contact.id': '123',                    // Spezifischer Kontakt
  'invoiceDate[gte]': '2024-01-01',      // Datum größer gleich
  'invoiceDate[lte]': '2024-12-31',      // Datum kleiner gleich
  'status[in]': ['100', '200'],          // Status in Liste
  'sumGross[gt]': '1000',                // Betrag größer als
  'orderBy': 'invoiceDate',              // Sortierung
  'orderType': 'DESC',                   // Sortierreihenfolge
  'limit': '50',                         // Anzahl Ergebnisse
  'offset': '0'                          // Offset für Pagination
});
```

## Best Practices

### Performance-Optimierung

1. **Batch-Verarbeitung**: Verwenden Sie Schleifen für große Datenmengen
2. **Caching**: Vermeiden Sie wiederholte API-Aufrufe für statische Daten
3. **Pagination**: Nutzen Sie limit/offset für große Datensätze
4. **Rate Limiting**: Beachten Sie SevDesk API-Limits

### Fehlerbehandlung

1. **Retry-Mechanismen**: Implementieren Sie Wiederholungslogik
2. **Validierung**: Prüfen Sie Eingabedaten vor API-Aufrufen
3. **Logging**: Protokollieren Sie Fehler für Debugging
4. **Fallback**: Definieren Sie Fallback-Strategien

### Sicherheit

1. **API-Key-Schutz**: Verwenden Sie n8n Credentials für sichere Speicherung
2. **Datenvalidierung**: Validieren Sie alle Eingaben
3. **Minimal Privileges**: Verwenden Sie API-Keys mit minimalen Berechtigungen
4. **Audit Trail**: Protokollieren Sie alle Änderungen

## Entwicklung

### Setup für Entwickler

```bash
# Repository klonen
git clone <repository-url>
cd n8n-nodes-sevdesk-v2

# Dependencies installieren
npm install

# TypeScript kompilieren
npm run build

# Tests ausführen
npm test

# Docker-Entwicklungsumgebung starten
npm start
```

### Architektur

```
nodes/
├── SevDesk/
│   ├── SevDesk.node.ts              # Haupt-Node-Implementation
│   ├── SevDeskResourceManager.ts    # API-Management
│   └── descriptions/                # Ressourcen-Beschreibungen
│       ├── ContactDescription.ts
│       ├── InvoiceDescription.ts
│       └── ...
credentials/
└── SevDeskApi.credentials.ts        # Credential-Definition
```

### Testing

```bash
# Unit Tests
npm run test:unit

# Integration Tests
npm run test:integration

# E2E Tests
npm run test:e2e

# Coverage Report
npm run test:coverage
```

### Beitragen

1. Fork das Repository
2. Feature-Branch erstellen
3. Tests hinzufügen
4. Pull Request erstellen

## Fehlerbehebung

### Häufige Probleme

| Problem | Lösung |
|---------|--------|
| "Unauthorized" | API-Key überprüfen |
| "Rate Limit" | Anfragen reduzieren/verzögern |
| "Not Found" | Ressourcen-ID überprüfen |
| Timeout | Netzwerkverbindung prüfen |

### Debug-Modus

```javascript
// Debugging aktivieren
const sevDesk = new SevDeskResourceManager(credentials, {
  debug: true,
  logRequests: true,
  logResponses: true
});
```

### Support

- **GitHub Issues**: Für Bugs und Feature-Requests
- **Community Forum**: Für allgemeine Fragen
- **SevDesk Docs**: Für API-spezifische Fragen