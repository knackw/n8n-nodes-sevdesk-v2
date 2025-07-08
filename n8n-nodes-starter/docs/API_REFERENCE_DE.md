# SevDesk API Operationen Referenz

Dieses Dokument bietet eine umfassende Dokumentation für alle unterstützten SevDesk API-Operationen im n8n-nodes-sevdesk-v2 Knoten.

## Überblick

Der SevDesk-Knoten unterstützt eine breite Palette von Operationen über mehrere Ressourcentypen hinweg und ermöglicht eine vollständige Workflow-Automatisierung für deutsche Buchhaltungsprozesse. Alle Operationen erfordern gültige SevDesk API-Anmeldedaten.

## Authentifizierung

Alle API-Operationen erfordern:
- **API-Schlüssel**: Ihr SevDesk API-Schlüssel
- **API-Version**: Typischerweise `v1` oder `v2` (in den Anmeldedaten konfiguriert)

## Unterstützte Ressourcen

### 1. Kontaktverwaltung

#### Kontakt
Primäre Kunden- und Lieferantenverwaltungsressource.

**Operationen:**
- `create` - Neuen Kontakt erstellen
- `get` - Bestimmten Kontakt per ID abrufen
- `list` - Alle Kontakte mit optionaler Filterung auflisten
- `update` - Bestehenden Kontakt aktualisieren
- `delete` - Kontakt löschen

**Beispiel - Kontakt erstellen:**
```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Max Mustermann GmbH",
  "customerNumber": "K-001",
  "category": {
    "id": 3,
    "objectName": "Category"
  },
  "description": "Hauptkundenkontakt"
}
```

**Beispiel - Kontakte auflisten:**
```json
{
  "resource": "contact",
  "operation": "list",
  "limit": 50,
  "offset": 0,
  "depth": 1
}
```

#### Kontaktadresse
Adressen verwalten, die mit Kontakten verknüpft sind.

**Operationen:**
- `create` - Neue Adresse zu Kontakt hinzufügen
- `get` - Bestimmte Adresse abrufen
- `list` - Adressen für Kontakt auflisten
- `update` - Adressinformationen aktualisieren
- `delete` - Adresse entfernen

#### Kontakt Benutzerdefinierte Felder
Benutzerdefinierte Felddaten für Kontakte verwalten.

**Operationen:**
- `create` - Benutzerdefinierten Feldwert erstellen
- `get` - Benutzerdefinierten Feldwert abrufen
- `list` - Benutzerdefinierte Feldwerte auflisten
- `update` - Benutzerdefinierten Feldwert aktualisieren
- `delete` - Benutzerdefinierten Feldwert löschen

### 2. Rechnungsverwaltung

#### Rechnung
Kernfunktionalität für die Rechnungsstellung an Kunden.

**Operationen:**
- `create` - Neue Rechnung erstellen
- `get` - Rechnung per ID abrufen
- `list` - Rechnungen mit Filterung auflisten
- `update` - Rechnungsdetails aktualisieren
- `delete` - Rechnung löschen
- `sendByEmail` - Rechnung per E-Mail versenden
- `markAsSent` - Rechnung als versendet markieren
- `bookAmount` - Zahlungsbetrag buchen

**Beispiel - Rechnung erstellen:**
```json
{
  "resource": "invoice",
  "operation": "create",
  "invoiceNumber": "RE-2025-001",
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

**Beispiel - Rechnung per E-Mail versenden:**
```json
{
  "resource": "invoice",
  "operation": "sendByEmail",
  "invoiceId": 456,
  "sendToEmail": "kunde@example.com",
  "subject": "Ihre Rechnung RE-2025-001",
  "text": "Bitte finden Sie Ihre Rechnung im Anhang."
}
```

### 3. Auftragsverwaltung

#### Auftrag
Kundenaufträge und Angebote verwalten.

**Operationen:**
- `create` - Neuen Auftrag erstellen
- `get` - Auftragsdetails abrufen
- `list` - Aufträge auflisten
- `update` - Auftrag aktualisieren
- `delete` - Auftrag löschen

**Beispiel - Auftrag erstellen:**
```json
{
  "resource": "order",
  "operation": "create",
  "orderNumber": "AN-2025-001",
  "contact": {
    "id": 123,
    "objectName": "Contact"
  },
  "orderDate": "2025-01-15",
  "status": 100,
  "orderType": "AN"
}
```

#### Auftragspositionen
Positionen innerhalb von Aufträgen verwalten.

**Operationen:**
- `create` - Position zu Auftrag hinzufügen
- `get` - Positionsdetails abrufen
- `list` - Auftragspositionen auflisten
- `update` - Position aktualisieren
- `delete` - Position entfernen

### 4. Belegverwaltung

#### Beleg
Belege, Ausgaben und Dokumentenverwaltung handhaben.

**Operationen:**
- `create` - Neuen Beleg erstellen
- `get` - Beleg abrufen
- `list` - Belege auflisten
- `update` - Beleg aktualisieren
- `delete` - Beleg löschen
- `upload` - Belegdokument hochladen

**Beispiel - Beleg erstellen:**
```json
{
  "resource": "voucher",
  "operation": "create",
  "voucherDate": "2025-01-15",
  "supplier": {
    "id": 789,
    "objectName": "Contact"
  },
  "description": "Büromaterial",
  "voucherType": "VOU",
  "status": 50
}
```

#### Belegpositionen
Buchungspositionen innerhalb von Belegen verwalten.

**Operationen:**
- `create` - Position zu Beleg hinzufügen
- `get` - Position abrufen
- `list` - Belegpositionen auflisten
- `update` - Position aktualisieren
- `delete` - Position entfernen

### 5. Gutschriftenverwaltung

#### Gutschrift
Gutschriften und Rückerstattungen verwalten.

**Operationen:**
- `create` - Gutschrift erstellen
- `get` - Gutschrift abrufen
- `list` - Gutschriften auflisten
- `update` - Gutschrift aktualisieren
- `delete` - Gutschrift löschen

**Beispiel - Gutschrift erstellen:**
```json
{
  "resource": "creditNote",
  "operation": "create",
  "creditNoteNumber": "GS-2025-001",
  "contact": {
    "id": 123,
    "objectName": "Contact"
  },
  "creditNoteDate": "2025-01-15",
  "status": 100
}
```

### 6. Buchhaltungsverwaltung

#### Sachkonto
Kontenplan und Buchungskategorien verwalten.

**Operationen:**
- `create` - Konto erstellen
- `get` - Konto abrufen
- `list` - Konten auflisten
- `update` - Konto aktualisieren
- `delete` - Konto löschen

#### Sachkonto-Transaktion
Einzelne Buchungstransaktionen verwalten.

**Operationen:**
- `create` - Transaktion erstellen
- `get` - Transaktion abrufen
- `list` - Transaktionen auflisten
- `update` - Transaktion aktualisieren
- `delete` - Transaktion löschen

### 7. Stammdatenverwaltung

#### Kategorie
Kontakt- und Artikelkategorien verwalten.

**Operationen:**
- `get` - Kategorie abrufen
- `list` - Kategorien auflisten

**Beispiel - Kategorien auflisten:**
```json
{
  "resource": "category",
  "operation": "list",
  "objectType": "Contact"
}
```

#### Artikel
Produkte und Dienstleistungen verwalten.

**Operationen:**
- `create` - Artikel/Produkt erstellen
- `get` - Artikel abrufen
- `list` - Artikel auflisten
- `update` - Artikel aktualisieren
- `delete` - Artikel löschen

**Beispiel - Artikel erstellen:**
```json
{
  "resource": "part",
  "operation": "create",
  "name": "Beratungsstunde",
  "partNumber": "CONS-001",
  "price": 120.00,
  "unity": {
    "id": 1,
    "objectName": "Unity"
  }
}
```

#### Einheit
Maßeinheiten verwalten.

**Operationen:**
- `get` - Einheit abrufen
- `list` - Einheiten auflisten

#### Land
Auf Länderstammdaten zugreifen.

**Operationen:**
- `get` - Land abrufen
- `list` - Länder auflisten

### 8. Kommunikationsverwaltung

#### Kommunikationsweg
Kontakt-Kommunikationsmethoden verwalten (E-Mail, Telefon, etc.).

**Operationen:**
- `create` - Kommunikationsmethode hinzufügen
- `get` - Kommunikationsmethode abrufen
- `list` - Kommunikationsmethoden auflisten
- `update` - Kommunikationsmethode aktualisieren
- `delete` - Kommunikationsmethode löschen

### 9. Tag-Verwaltung

#### Tag
Ressourcen mit Tags organisieren.

**Operationen:**
- `create` - Tag erstellen
- `get` - Tag abrufen
- `list` - Tags auflisten
- `update` - Tag aktualisieren
- `delete` - Tag löschen

#### Tag-Beziehung
Tag-Zuweisungen zu Ressourcen verwalten.

**Operationen:**
- `create` - Tag zu Ressource zuweisen
- `get` - Tag-Beziehung abrufen
- `list` - Tag-Beziehungen auflisten
- `delete` - Tag-Zuweisung entfernen

### 10. Berichtswesen & Export

#### Bericht
Verschiedene Geschäftsberichte generieren.

**Operationen:**
- `generate` - Bericht generieren
- `get` - Bericht abrufen
- `list` - Verfügbare Berichte auflisten

#### Export
Daten in verschiedenen Formaten exportieren.

**Operationen:**
- `create` - Export-Job erstellen
- `get` - Export-Status abrufen
- `download` - Export-Datei herunterladen

### 11. Layout-Verwaltung

#### Layout
Dokumentvorlagen und Layouts verwalten.

**Operationen:**
- `get` - Layout abrufen
- `list` - Layouts auflisten

### 12. Batch-Operationen

#### Batch
Massenoperationen effizient durchführen.

**Operationen:**
- `create` - Batch-Job erstellen
- `get` - Batch-Status abrufen
- `list` - Batch-Jobs auflisten

### 13. System-Operationen

#### Grundlagen
Auf grundlegende Systeminformationen und Einstellungen zugreifen.

**Operationen:**
- `get` - Grundlegende Informationen abrufen
- `list` - Grundeinstellungen auflisten

## Allgemeine Parameter

### Paginierung
Die meisten List-Operationen unterstützen Paginierung:
- `limit` - Anzahl der zurückzugebenden Datensätze (Standard: 50, max: 1000)
- `offset` - Anzahl der zu überspringenden Datensätze (Standard: 0)

### Filterung
Viele Operationen unterstützen Filterung:
- `depth` - Verwandte Objekte einschließen (0-2)
- `embed` - Kommagetrennte Liste von einzuschließenden Beziehungen

### Sortierung
List-Operationen unterstützen oft Sortierung:
- `orderBy` - Feld zum Sortieren
- `orderDirection` - `ASC` oder `DESC`

## Fehlerbehandlung

Der Knoten behandelt verschiedene SevDesk API-Fehler:

- **400 Bad Request** - Ungültige Parameter oder Daten
- **401 Unauthorized** - Ungültige API-Anmeldedaten
- **403 Forbidden** - Unzureichende Berechtigungen
- **404 Not Found** - Ressource nicht gefunden
- **429 Too Many Requests** - Rate Limit überschritten
- **500 Internal Server Error** - SevDesk-Serverfehler

## Rate Limits

Die SevDesk API hat Rate Limits:
- Standard: 1000 Anfragen pro Stunde
- Premium: Höhere Limits verfügbar

Der Knoten behandelt automatisch Rate Limiting mit exponentieller Backoff-Strategie.

## Best Practices

1. **Batch-Operationen verwenden** für Massendatenverarbeitung
2. **Paginierung implementieren** für große Datensätze
3. **Stammdaten cachen** (Kategorien, Länder, Einheiten)
4. **Fehler elegant behandeln** mit ordnungsgemäßer Retry-Logik
5. **Webhooks verwenden** für Echtzeit-Datensynchronisation
6. **Daten validieren** vor API-Aufrufen zur Fehlervermeidung

## Beispiele nach Anwendungsfall

### Vollständiger Rechnungs-Workflow
1. Kontakt erstellen/abrufen
2. Rechnung mit Positionen erstellen
3. Rechnung per E-Mail versenden
4. Zahlungsstatus verfolgen
5. Berichte generieren

### Ausgabenverwaltung
1. Belegdokument hochladen
2. Beleg mit Positionen erstellen
3. Entsprechenden Konten zuweisen
4. Ausgabenberichte generieren

### Kundenverwaltung
1. Kontakt mit Adressen erstellen
2. Kommunikationsmethoden einrichten
3. Kategorien und Tags zuweisen
4. Interaktionsverlauf verfolgen

## Support

Für zusätzliche Hilfe:
- Prüfen Sie die [SevDesk API-Dokumentation](https://api.sevdesk.de/)
- Besuchen Sie das [n8n Community Forum](https://community.n8n.io/)
- Reichen Sie Issues im Projekt-Repository ein

---

*Diese Dokumentation deckt alle unterstützten Operationen ab Stand Januar 2025 ab. Für die aktuellsten API-Features verweisen Sie auf die offizielle SevDesk API-Dokumentation.*
