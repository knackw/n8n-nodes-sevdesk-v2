# SevDesk Node für n8n - Benutzerhandbuch

Diese n8n Community Node ermöglicht es Ihnen, direkt mit der SevDesk API zu interagieren. SevDesk ist ein deutsches Buchhaltungstool für kleine und mittlere Unternehmen.

## Installation

### Installation über n8n Community Nodes

1. Öffnen Sie Ihre n8n-Instanz
2. Gehen Sie zu **Settings** > **Community Nodes**
3. Klicken Sie auf **Install a community node**
4. Geben Sie `n8n-nodes-sevdesk-v2` ein
5. Klicken Sie auf **Install**

### Manuelle Installation

Für eine manuelle Installation können Sie das Paket über npm installieren:

```bash
npm install n8n-nodes-sevdesk-v2
```

## Konfiguration

### SevDesk API-Schlüssel

Um die SevDesk-Node zu verwenden, benötigen Sie einen SevDesk API-Schlüssel:

1. Melden Sie sich bei Ihrem SevDesk-Konto an
2. Gehen Sie zu **Einstellungen** > **Benutzerverwaltung** > **API**
3. Erstellen Sie einen neuen API-Schlüssel
4. Kopieren Sie den API-Schlüssel für die Verwendung in n8n

### Credentials in n8n konfigurieren

1. Gehen Sie zu **Credentials** in n8n
2. Klicken Sie auf **Create New**
3. Wählen Sie **SevDesk API** aus der Liste
4. Füllen Sie die erforderlichen Felder aus:
   - **API Key**: Ihr SevDesk API-Schlüssel
   - **API Version**: Wählen Sie v2 (empfohlen) oder v1 (Legacy)

**Das war's! Keine weiteren Konfigurationen erforderlich.** Die Node arbeitet direkt mit der SevDesk API ohne externe Abhängigkeiten.

## Verfügbare Ressourcen

Die SevDesk-Node unterstützt die folgenden Ressourcen der SevDesk API:

### ✅ **Vollständig unterstützt**
- **Contact** - Kontakte verwalten (Kunden, Lieferanten)
- **Invoice** - Rechnungen erstellen und verwalten
- **Voucher** - Belege verwalten
- **Order** - Aufträge verwalten
- **Part** - Artikel verwalten
- **CheckAccount** - Kassenkonten verwalten
- **CheckAccountTransaction** - Transaktionen verwalten
- **CommunicationWay** - Kommunikationswege (E-Mail, Telefon)
- **Country** - Länder
- **Category** - Kategorien
- **Tag** - Tags verwalten
- **Unit** - Einheiten
- **Report** - Berichte erstellen

### 🔄 **In Entwicklung**
- **Export** - Datenexporte
- **Layout** - Vorlagen
- **Credit Note** - Gutschriften
- **Basic** - Grundlegende Systemfunktionen

## Beispiel-Workflows

### Neuen Kontakt erstellen

1. Fügen Sie eine SevDesk-Node zu Ihrem Workflow hinzu
2. Wählen Sie folgende Konfiguration:
   - **Ressource**: Contact
   - **Operation**: Create
   - **Name**: Name des Kontakts
   - **Customer Number**: Eindeutige Kundennummer
   - **Category**: Kontaktkategorie (Kunde, Lieferant, etc.)

**Beispiel:**
```javascript
{
  "name": "Max Mustermann GmbH",
  "customerNumber": "CUST-001",
  "category": { "id": "3" }, // Kunde
  "description": "Hauptkunde für Beratungsleistungen"
}
```

### Rechnung erstellen

1. Fügen Sie eine SevDesk-Node hinzu
2. Konfigurieren Sie sie wie folgt:
   - **Ressource**: Invoice
   - **Operation**: Create
   - **Contact**: Wählen Sie den Kontakt aus
   - **Invoice Date**: Rechnungsdatum
   - **Due Date**: Fälligkeitsdatum
   - **Invoice Type**: "RE" für Rechnung

**Beispiel:**
```javascript
{
  "contact": { "id": "123" },
  "invoiceDate": "2024-01-15",
  "header": "Rechnung für Beratungsleistungen",
  "invoiceType": "RE",
  "status": "100" // Entwurf
}
```

### Belege abrufen und filtern

1. Fügen Sie eine SevDesk-Node hinzu
2. Konfigurieren Sie sie wie folgt:
   - **Ressource**: Voucher
   - **Operation**: Get Many
   - **Filters**: Verwenden Sie erweiterte Filter

**Beispiel für Filterung:**
```javascript
{
  "status": "50", // Nur genehmigte Belege
  "voucherDate[gte]": "2024-01-01", // Ab diesem Datum
  "voucherDate[lte]": "2024-12-31", // Bis zu diesem Datum
  "limit": "50" // Maximale Anzahl Ergebnisse
}
```

### Artikel mit Bestand verwalten

1. **Artikel erstellen:**
   - **Ressource**: Part
   - **Operation**: Create
   - **Name**: Artikelname
   - **Part Number**: Artikelnummer
   - **Price**: Verkaufspreis

2. **Bestand aktualisieren:**
   - **Ressource**: Part
   - **Operation**: Update
   - **Stock**: Neuer Bestand

### Batch-Operationen für große Datenmengen

Für die Verarbeitung vieler Datensätze verwenden Sie Loop-Nodes:

```javascript
// In einem Function-Node vor der SevDesk-Node
const contacts = [
  { name: "Kunde 1", customerNumber: "K001" },
  { name: "Kunde 2", customerNumber: "K002" },
  { name: "Kunde 3", customerNumber: "K003" }
];

return contacts.map(contact => ({ json: contact }));
```

## API-Versionen

### v2 (Empfohlen)

Die v2 API ist die neueste Version der SevDesk API und wird für neue Implementierungen empfohlen:

- ✅ Verbesserte Performance
- ✅ Konsistentere Datenstrukturen
- ✅ Erweiterte Funktionalitäten
- ✅ Bessere Fehlerbehandlung
- ✅ Neue Features und Updates

### v1 (Legacy)

Die v1 API wird noch unterstützt, ist aber als Legacy gekennzeichnet:

- ⚠️ Keine neuen Features
- ⚠️ Langsamere Performance
- ⚠️ Wird langfristig abgeschaltet

**Empfehlung:** Nutzen Sie v2 für alle neuen Projekte!

## Best Practices

### 1. **Fehlerbehandlung**
Verwenden Sie immer Error-Nodes für robuste Workflows:

```javascript
try {
  // SevDesk API-Aufruf
  const result = await sevDeskCall();
  return result;
} catch (error) {
  // Fehler protokollieren und weiterleiten
  console.error('SevDesk Fehler:', error.message);
  throw error;
}
```

### 2. **Rate Limiting beachten**
SevDesk hat API-Limits:
- **Standard**: 1000 Anfragen/Stunde
- **Premium**: 5000 Anfragen/Stunde

Fügen Sie Pausen zwischen großen Batch-Operationen ein.

### 3. **Datenvalidierung**
Validieren Sie Eingabedaten vor API-Aufrufen:

```javascript
// Pflichtfelder prüfen
if (!contactName || !customerNumber) {
  throw new Error('Name und Kundennummer sind erforderlich');
}

// Format prüfen
if (!/^[A-Z0-9-]+$/.test(customerNumber)) {
  throw new Error('Kundennummer enthält ungültige Zeichen');
}
```

### 4. **Effiziente Filterung**
Nutzen Sie API-Filter statt lokaler Filterung:

```javascript
// ✅ Gut: API-Filter verwenden
{
  "contact.customerNumber": "CUST-001",
  "invoiceDate[gte]": "2024-01-01"
}

// ❌ Schlecht: Alle Daten laden und lokal filtern
```

## Fehlerbehebung

### Häufige Probleme und Lösungen

| Problem | Mögliche Ursache | Lösung |
|---------|-----------------|--------|
| "Unauthorized" (401) | Ungültiger API-Schlüssel | Überprüfen Sie Ihren API-Schlüssel in den SevDesk-Einstellungen |
| "Not Found" (404) | Ressource existiert nicht | Überprüfen Sie die ID der angeforderten Ressource |
| "Bad Request" (400) | Ungültige Parameter | Prüfen Sie Ihre Eingabedaten auf Vollständigkeit und Format |
| Timeout-Fehler | Langsame API-Antwort | Versuchen Sie es erneut oder reduzieren Sie die Datenmenge |
| Rate Limit (429) | Zu viele Anfragen | Warten Sie kurz und versuchen Sie es erneut |

### Debugging-Tipps

1. **HTTP-Request-Node verwenden:**
   Für detailliertes Debugging verwenden Sie einen HTTP-Request-Node parallel zur SevDesk-Node

2. **Logs überprüfen:**
   Aktivieren Sie Logging in n8n für detaillierte Fehlermeldungen

3. **SevDesk API-Dokumentation:**
   Konsultieren Sie die [offizielle SevDesk API-Docs](https://api.sevdesk.de/) für Feldanforderungen

### API-Limits verstehen

```javascript
// API-Limits in Ihren Workflows berücksichtigen
const RATE_LIMIT_DELAY = 1000; // 1 Sekunde zwischen Anfragen

for (const item of largeDataSet) {
  await processSevDeskItem(item);
  await sleep(RATE_LIMIT_DELAY); // Pause zwischen Anfragen
}
```

## Erweiterte Funktionen

### 1. **Webhooks für Echtzeit-Updates**
Kombinieren Sie SevDesk-Nodes mit Webhook-Nodes für Event-driven Workflows.

### 2. **Datei-Upload/Download**
Nutzen Sie Binary-Data für Dokument-Management:

```javascript
// PDF-Rechnung herunterladen
{
  "resource": "Invoice",
  "operation": "Render PDF",
  "id": "12345"
}
```

### 3. **Reporting und Analytics**
Erstellen Sie automatisierte Berichte durch Kombination mehrerer API-Aufrufe.

## Support und Community

### Hilfe erhalten

1. **GitHub Issues**: [n8n-nodes-sevdesk-v2 Issues](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
2. **n8n Community Forum**: Für allgemeine n8n-Fragen
3. **SevDesk Support**: Für API-spezifische Fragen

### Beitragen

Beiträge sind willkommen! Siehe [CONTRIBUTING.md](../CONTRIBUTING.md) für Details.

## Changelog

### Version 2.2.1 - Aktuell

**🎉 Neugestaltung für maximale Einfachheit:**

- ✅ **Entfernung komplexer Lizenzvalidierung** - Direkte Nutzung ohne externe Systeme
- ✅ **Keine Supabase-Abhängigkeit** - Standalone-Betrieb
- ✅ **Vereinfachte Credentials** - Nur API-Key und Version erforderlich
- ✅ **Verbesserte Performance** - Direkte API-Kommunikation ohne Middleware
- ✅ **Bessere Dokumentation** - Klare Beispiele und Best Practices
- ✅ **Docker-Integration** - Automatisierte Entwicklungsumgebung
- ✅ **Erweiterte Test-Workflows** - Umfassende Beispiele für alle Anwendungsfälle

**Migration von v1.x:**
- Entfernen Sie alle Lizenz-bezogenen Konfigurationen
- Aktualisieren Sie Ihre Credentials auf das neue einfache Format
- Ihre bestehenden Workflows funktionieren ohne Änderungen weiter

## Lizenz

Dieses Projekt steht unter der MIT-Lizenz. Details finden Sie in der LICENSE-Datei.
