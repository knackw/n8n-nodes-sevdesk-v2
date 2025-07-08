# Migrationsleitfaden: Von Platzhalter- zur Produktionsimplementierung

Dieser Leitfaden hilft Ihnen bei der Migration von Platzhalterimplementierungen zur vollständig funktionsfähigen SevDesk API-Integration in n8n-nodes-sevdesk-v2.

## Überblick

Der n8n-nodes-sevdesk-v2 Knoten hat sich von Platzhalterimplementierungen zu einer vollständig funktionsfähigen SevDesk API-Integration entwickelt. Dieser Leitfaden behandelt:

- **Was sich geändert hat**: Hauptunterschiede zwischen Platzhalter- und Produktionsversionen
- **Migrationsschritte**: Wie Sie Ihre Workflows aktualisieren
- **Breaking Changes**: Was möglicherweise angepasst werden muss
- **Neue Features**: Erweiterte Funktionen, die jetzt verfügbar sind
- **Best Practices**: Empfehlungen für optimale Nutzung

## Was sich geändert hat

### 1. API-Integration

**Vorher (Platzhalter):**
```javascript
// Gab Mock-Daten zurück
return [
  {
    json: {
      id: 'mock-123',
      name: 'Mock Contact',
      status: 'placeholder'
    }
  }
];
```

**Nachher (Produktion):**
```javascript
// Führt tatsächliche SevDesk API-Aufrufe durch
const response = await this.helpers.httpRequestWithAuthentication.call(
  this,
  'sevDeskApi',
  {
    method: 'GET',
    url: '/Contact',
    headers: {
      'Authorization': `Token ${credentials.apiKey}`,
      'Content-Type': 'application/json'
    }
  }
);
```

### 2. Authentifizierung

**Vorher:**
- Keine tatsächliche API-Authentifizierung
- Anmeldedaten wurden ignoriert
- Alle Operationen gaben Mock-Daten zurück

**Nachher:**
- Vollständige SevDesk API-Authentifizierung
- API-Schlüssel-Validierung
- Ordnungsgemäße Fehlerbehandlung für Auth-Fehler

### 3. Datenvalidierung

**Vorher:**
- Minimale Eingabevalidierung
- Keine Geschäftsregeldurchsetzung
- Generische Fehlermeldungen

**Nachher:**
- Umfassende Eingabevalidierung
- Deutsche Geschäftsregelkonformität
- Detaillierte Fehlermeldungen mit Vorschlägen

### 4. Fehlerbehandlung

**Vorher:**
```javascript
// Generische Fehlerbehandlung
throw new Error('Operation failed');
```

**Nachher:**
```javascript
// Spezifische SevDesk-Fehlerbehandlung
if (error.response?.status === 401) {
  throw new SevDeskAuthenticationError('Invalid API key', error);
} else if (error.response?.status === 422) {
  throw new SevDeskValidationError('Business rule violation', error);
}
```

## Migrationsschritte

### Schritt 1: Anmeldedaten aktualisieren

**Erforderliche Aktion:** Überprüfen Sie Ihre SevDesk API-Anmeldedaten

1. **API-Schlüssel-Format prüfen**
   ```json
   {
     "apiKey": "ihr-tatsächlicher-sevdesk-api-schlüssel",
     "apiVersion": "v1"
   }
   ```

2. **Anmeldedaten testen**
   - Erstellen Sie einen einfachen Test-Workflow
   - Verwenden Sie die `basics`-Ressource mit `get`-Operation
   - Überprüfen Sie erfolgreiche Authentifizierung

**Test-Workflow:**
```json
{
  "resource": "basics",
  "operation": "get"
}
```

### Schritt 2: Workflow-Logik überprüfen

**Erforderliche Aktion:** Workflows aktualisieren, die auf Platzhalterverhalten angewiesen waren

**Häufige erforderliche Änderungen:**

1. **Antwortdatenstruktur**
   - Echte API-Antworten können andere Feldnamen haben
   - Zusätzliche Metadatenfelder sind jetzt enthalten
   - Verschachtelte Objekte folgen der SevDesk API-Struktur

2. **Fehlerbehandlung**
   - Ordnungsgemäße try-catch-Blöcke hinzufügen
   - Spezifische SevDesk-Fehlercodes behandeln
   - Retry-Logik für vorübergehende Ausfälle implementieren

**Beispiel-Update:**
```javascript
// Vorher: Erwartete Mock-Datenstruktur
const contactName = items[0].json.name;

// Nachher: Echte API-Antwortstruktur behandeln
const contactName = items[0].json.objects?.[0]?.name || items[0].json.name;
```

### Schritt 3: Ressourcenoperationen aktualisieren

**Erforderliche Aktion:** Ressourcenspezifische Operationen überprüfen und aktualisieren

#### Kontaktoperationen

**Vorher:**
```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Test Contact"
}
```

**Nachher:**
```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Test Contact",
  "category": {
    "id": 3,
    "objectName": "Category"
  },
  "customerNumber": "K-001"
}
```

#### Rechnungsoperationen

**Vorher:**
```json
{
  "resource": "invoice",
  "operation": "create",
  "amount": 100
}
```

**Nachher:**
```json
{
  "resource": "invoice",
  "operation": "create",
  "contact": {
    "id": 123,
    "objectName": "Contact"
  },
  "invoiceDate": "2025-01-15",
  "status": 100,
  "invoiceType": "RE",
  "currency": "EUR"
}
```

### Schritt 4: Neue Pflichtfelder behandeln

**Erforderliche Aktion:** Pflichtfelder hinzufügen, die in der Platzhalterversion nicht benötigt wurden

#### Häufige Pflichtfelder nach Ressource:

**Kontakt:**
- `category` (Objekt mit id und objectName)
- `customerNumber` (für Kunden)

**Rechnung:**
- `contact` (Objektreferenz)
- `invoiceDate` (ISO-Datumsformat)
- `status` (numerischer Statuscode)
- `invoiceType` (RE, AN, etc.)

**Beleg:**
- `voucherDate` (ISO-Datumsformat)
- `supplier` (Kontakt-Objektreferenz)
- `voucherType` (VOU, etc.)

**Auftrag:**
- `contact` (Objektreferenz)
- `orderDate` (ISO-Datumsformat)
- `orderType` (AN, etc.)

### Schritt 5: Datenformate aktualisieren

**Erforderliche Aktion:** Sicherstellen, dass Datenformate den SevDesk API-Anforderungen entsprechen

#### Datumsformate

**Vorher:** Jedes Datumsformat akzeptiert
```
"date": "15.01.2025"
```

**Nachher:** ISO-Datumsformat erforderlich
```
"date": "2025-01-15"
```

#### Objektreferenzen

**Vorher:** Einfache ID-Referenz
```
"categoryId": 3
```

**Nachher:** Objektreferenzformat
```
"category": {
  "id": 3,
  "objectName": "Category"
}
```

#### Währung und Beträge

**Vorher:** Einfache Zahl
```
"amount": 100
```

**Nachher:** Ordnungsgemäßes Dezimalformat
```
"amount": 100.00,
"currency": "EUR"
```

## Breaking Changes

### 1. Änderungen der Antwortstruktur

**Auswirkung:** Workflows, die Antwortdaten parsen

**Vorher:**
```json
{
  "id": "123",
  "name": "Contact Name",
  "email": "test@example.com"
}
```

**Nachher:**
```json
{
  "objects": [
    {
      "id": "123",
      "objectName": "Contact",
      "name": "Contact Name",
      "email": "test@example.com",
      "create": "2025-01-15T10:00:00Z",
      "update": "2025-01-15T10:00:00Z"
    }
  ],
  "total": 1
}
```

**Migration:**
```javascript
// Datenextraktionslogik aktualisieren
const contacts = response.objects || [response];
const contact = contacts[0];
```

### 2. Änderungen der Fehlerantworten

**Auswirkung:** Fehlerbehandlungslogik

**Vorher:**
```json
{
  "error": "Generic error message"
}
```

**Nachher:**
```json
{
  "error": {
    "message": "Specific SevDesk error",
    "code": 400,
    "details": {
      "field": "email",
      "issue": "Invalid email format"
    }
  }
}
```

### 3. Authentifizierungsanforderungen

**Auswirkung:** Alle Operationen erfordern jetzt gültige Anmeldedaten

**Vorher:** Operationen funktionierten ohne Anmeldedaten
**Nachher:** Alle Operationen erfordern gültigen SevDesk API-Schlüssel

**Migration:** Stellen Sie sicher, dass alle Workflows ordnungsgemäße Anmeldedatenkonfiguration haben

## Verfügbare neue Features

### 1. Echtzeit-Datensynchronisation

```json
{
  "resource": "contact",
  "operation": "list",
  "modifiedAfter": "2025-01-15T00:00:00Z"
}
```

### 2. Erweiterte Filterung

```json
{
  "resource": "invoice",
  "operation": "list",
  "status": 100,
  "contactId": 123,
  "dateFrom": "2025-01-01",
  "dateTo": "2025-01-31"
}
```

### 3. Batch-Operationen

```json
{
  "resource": "batch",
  "operation": "create",
  "operations": [
    {
      "method": "POST",
      "url": "/Contact",
      "data": { "name": "Contact 1" }
    },
    {
      "method": "POST", 
      "url": "/Contact",
      "data": { "name": "Contact 2" }
    }
  ]
}
```

### 4. Dokumentenverwaltung

```json
{
  "resource": "voucher",
  "operation": "upload",
  "file": "base64-encoded-document",
  "filename": "receipt.pdf"
}
```

### 5. E-Mail-Integration

```json
{
  "resource": "invoice",
  "operation": "sendByEmail",
  "invoiceId": 456,
  "sendToEmail": "kunde@example.com",
  "subject": "Ihre Rechnung",
  "text": "Bitte finden Sie im Anhang..."
}
```

## Migrations-Checkliste

### Vor der Migration
- [ ] Bestehende Workflows sichern
- [ ] Aktuelles Workflow-Verhalten dokumentieren
- [ ] Gültige SevDesk API-Anmeldedaten beschaffen
- [ ] Anmeldedaten mit einfachen Operationen testen

### Während der Migration
- [ ] Anmeldedatenkonfiguration aktualisieren
- [ ] Jeden Workflow Schritt für Schritt überprüfen und aktualisieren
- [ ] Ordnungsgemäße Fehlerbehandlung hinzufügen
- [ ] Datenextraktionslogik aktualisieren
- [ ] Jede Operation einzeln testen

### Nach der Migration
- [ ] End-to-End-Tests durchführen
- [ ] Auf Fehler und Performance-Probleme überwachen
- [ ] Dokumentation und Kommentare aktualisieren
- [ ] Benutzer in neuen Features schulen
- [ ] Überwachung und Warnungen einrichten

## Häufige Migrationsprobleme

### 1. Authentifizierungsfehler

**Symptom:** 401 Unauthorized-Fehler
**Lösung:** 
- API-Schlüssel-Format und -Gültigkeit überprüfen
- SevDesk-Kontoberechtigungen prüfen
- Sicherstellen, dass API-Zugriff in SevDesk aktiviert ist

### 2. Datenformatfehler

**Symptom:** 400 Bad Request-Fehler
**Lösung:**
- Daten in ISO-Format konvertieren (YYYY-MM-DD)
- Objektreferenzen statt einfacher IDs verwenden
- Pflichtfelder validieren

### 3. Geschäftslogik-Verletzungen

**Symptom:** 422 Unprocessable Entity-Fehler
**Lösung:**
- Deutsche Buchhaltungsvorschriften befolgen
- Ressourcenstatus vor Operationen prüfen
- Geschäftsbeziehungen validieren

### 4. Performance-Probleme

**Symptom:** Langsame Antwortzeiten oder Timeouts
**Lösung:**
- Paginierung für große Datensätze implementieren
- Batch-Operationen für Massendaten verwenden
- Angemessene Verzögerungen zwischen Anfragen hinzufügen

## Ihre Migration testen

### 1. Grundlegender Konnektivitätstest

```json
{
  "resource": "basics",
  "operation": "get"
}
```

### 2. CRUD-Operationen-Test

```javascript
// Erstellen
const contact = await createContact({
  name: "Test Contact",
  category: { id: 3, objectName: "Category" }
});

// Lesen
const retrieved = await getContact(contact.id);

// Aktualisieren
const updated = await updateContact(contact.id, {
  description: "Aktualisierte Beschreibung"
});

// Löschen
await deleteContact(contact.id);
```

### 3. Fehlerbehandlungstest

```javascript
try {
  // Operation mit ungültigen Daten versuchen
  await createContact({ name: "" }); // Sollte fehlschlagen
} catch (error) {
  // Ordnungsgemäße Fehlerbehandlung überprüfen
  console.log('Fehler korrekt behandelt:', error.message);
}
```

## Best Practices nach der Migration

### 1. Fehlerbehandlung
- SevDesk-Operationen immer in try-catch-Blöcke einschließen
- Retry-Logik für vorübergehende Ausfälle implementieren
- Fehler für Debugging-Zwecke protokollieren

### 2. Datenvalidierung
- Eingabedaten vor API-Aufrufen validieren
- TypeScript-Interfaces für Typsicherheit verwenden
- Geschäftsregelvalidierung implementieren

### 3. Performance-Optimierung
- Paginierung für große Datensätze verwenden
- Caching für häufig abgerufene Daten implementieren
- API-Rate-Limits überwachen

### 4. Sicherheit
- Niemals sensible Daten protokollieren (API-Schlüssel, persönliche Informationen)
- Alle Benutzereingaben validieren
- Sichere Anmeldedatenspeicherung verwenden

## Hilfe erhalten

### Migrations-Support-Ressourcen

1. **Dokumentation**
   - [API-Referenz](./api-reference.md)
   - [Fehlerbehebungsanleitung](./troubleshooting.md)
   - [SevDesk API-Dokumentation](https://api.sevdesk.de/)

2. **Community-Support**
   - n8n Community Forum
   - GitHub Issues
   - SevDesk Support

3. **Professionelle Dienstleistungen**
   - Migrationsberatung
   - Individuelle Entwicklung
   - Schulung und Support

## Empfehlungen für Migrationszeitplan

### Kleine Workflows (1-5 Knoten)
- **Planung:** 1-2 Stunden
- **Migration:** 2-4 Stunden
- **Testen:** 1-2 Stunden
- **Gesamt:** 4-8 Stunden

### Mittlere Workflows (5-20 Knoten)
- **Planung:** 4-8 Stunden
- **Migration:** 8-16 Stunden
- **Testen:** 4-8 Stunden
- **Gesamt:** 16-32 Stunden

### Große Workflows (20+ Knoten)
- **Planung:** 1-2 Tage
- **Migration:** 2-5 Tage
- **Testen:** 1-2 Tage
- **Gesamt:** 4-9 Tage

## Fazit

Die Migration von Platzhalter- zur Produktionsimplementierung bietet:

✅ **Echte SevDesk-Integration** - Tatsächliche API-Konnektivität
✅ **Verbesserte Zuverlässigkeit** - Ordnungsgemäße Fehlerbehandlung und Validierung
✅ **Neue Features** - Erweiterte Operationen und Funktionen
✅ **Bessere Performance** - Für Produktionsnutzung optimiert
✅ **Compliance** - Deutsche Geschäftsregeleinhaltung

Der Migrationsprozess verbessert, obwohl er einigen Aufwand erfordert, die Funktionalität und Zuverlässigkeit Ihrer SevDesk-Workflows erheblich.

---

*Für zusätzliche Migrationsunterstützung konsultieren Sie die Projektdokumentation oder wenden Sie sich an die Community um Hilfe.*
