# SevDesk Node Dokumentation

## Inhaltsverzeichnis

1. [Übersicht](#übersicht)
2. [Installation](#installation)
3. [Konfiguration](#konfiguration)
4. [Ressourcen](#ressourcen)
5. [Operationen](#operationen)
6. [Beispiele](#beispiele)
7. [Fehlerbehebung](#fehlerbehebung)
8. [API-Referenz](#api-referenz)
9. [Best Practices](#best-practices)
10. [Entwicklung](#entwicklung)

## Übersicht

Der SevDesk Node für n8n bietet eine umfassende Integration mit der SevDesk Buchhaltungsplattform. SevDesk ist eine beliebte deutsche Buchhaltungssoftware, die eine robuste API für Automatisierung und Integration bietet.

### Hauptfunktionen

- **Vollständige CRUD-Operationen**: Erstellen, lesen, aktualisieren und löschen für alle wichtigen Entitäten
- **API v2 Unterstützung**: Neueste API-Version mit Rückwärtskompatibilität
- **Umfassende Filterung**: Erweiterte Such- und Filterfunktionen
- **Dateiverwaltung**: Upload und Download von Dokumenten
- **Batch-Operationen**: Effiziente Verarbeitung mehrerer Elemente
- **Fehlerbehandlung**: Robuste Fehlerbehandlung mit detailliertem Feedback

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

### Voraussetzungen

- Node.js 16.0.0 oder höher
- n8n-Instanz (selbst gehostet oder Cloud)
- SevDesk-Konto mit API-Zugang

### Installationsschritte

1. **Paket installieren**:
   ```bash
   npm install n8n-nodes-sevdesk-v2
   ```

2. **n8n neu starten**:
   ```bash
   n8n restart
   ```

3. **Installation überprüfen**:
   - Der "SevDesk" Node sollte in der Node-Liste erscheinen
   - Verfügbar unter der Kategorie "Output"

## Konfiguration

### Anmeldedaten einrichten

1. **API-Schlüssel erhalten**:
   - Melden Sie sich in Ihrem SevDesk-Konto an
   - Navigieren Sie zu Einstellungen → API
   - Kopieren Sie Ihren API-Schlüssel

2. **In n8n konfigurieren**:
   - Gehen Sie zu Anmeldedaten in n8n
   - Fügen Sie neue Anmeldedaten vom Typ "SevDesk API" hinzu
   - Geben Sie Ihren API-Schlüssel ein
   - Wählen Sie API-Version (v2 empfohlen)
   - Testen Sie die Verbindung

### API-Versionen

- **v1 (Legacy)**: Ursprüngliche API, weiterhin unterstützt
- **v2 (Empfohlen)**: Neueste API mit verbesserten Funktionen

## Ressourcen

### Kontakte

Kontakte repräsentieren Kunden, Lieferanten und andere Geschäftspartner.

#### Operationen
- **Erstellen**: Neuen Kontakt erstellen
- **Abrufen**: Einzelnen Kontakt anhand ID abrufen
- **Viele abrufen**: Mehrere Kontakte mit Filterung abrufen
- **Aktualisieren**: Bestehenden Kontakt aktualisieren
- **Löschen**: Kontakt löschen
- **Kundennummer-Verfügbarkeit prüfen**: Überprüfen, ob eine Kundennummer verfügbar ist
- **Nächste Kundennummer abrufen**: Nächste verfügbare Kundennummer abrufen
- **Nach benutzerdefiniertem Feldwert suchen**: Kontakte nach benutzerdefinierten Feldwerten suchen
- **Anzahl der Elemente abrufen**: Anzahl verwandter Elemente abrufen
- **Löschbar prüfen**: Überprüfen, ob ein Kontakt löschbar ist

#### Felder
- **Name**: Organisationsname (erforderlich für Organisationen)
- **Vorname**: Vorname (für Einzelpersonen)
- **Nachname**: Nachname (für Einzelpersonen)
- **Kundennummer**: Eindeutige Kundenkennung
- **Kategorie**: Kontaktkategorie (erforderlich)
- **Status**: Kontaktstatus (100=Lead, 500=Ausstehend, 1000=Aktiv)
- **Adressen**: Kontaktadressen
- **Benutzerdefinierte Felder**: Benutzerdefinierte Feldwerte

### Rechnungen

Rechnungen repräsentieren Verkaufsdokumente mit Positionen und Rabatten.

#### Operationen
- **Erstellen und aktualisieren**: Rechnungen mit Positionen erstellen oder aktualisieren
- **Abrufen**: Einzelne Rechnung abrufen
- **Viele abrufen**: Mehrere Rechnungen mit Filterung abrufen
- **Positionen abrufen**: Rechnungspositionen abrufen
- **Rechnungs-PDF abrufen**: Rechnung als PDF herunterladen
- **Rechnung rendern**: PDF für Rechnung generieren
- **Per E-Mail senden**: Rechnung per E-Mail senden
- **Als gesendet markieren**: Rechnung als gesendet markieren
- **Buchen**: Rechnung auf Zahlungskonto buchen
- **Stornieren**: Rechnung stornieren (erstellt Stornorechnung)
- **Teilweise bezahlt prüfen**: Zahlungsstatus überprüfen

#### Felder
- **Kontakt**: Kundenkontakt (erforderlich)
- **Rechnungsdatum**: Datum der Rechnung
- **Kopfzeile**: Rechnungskopftext
- **Kopftext**: Zusätzlicher Kopftext
- **Fußtext**: Fußzeilentext
- **Adressland**: Land für Adresse
- **Status**: Rechnungsstatus
- **Kleine Abrechnung**: Kleine Abrechnungsflagge
- **Steuersatz**: Standardsteuersatz
- **Steuertext**: Steuertext
- **Steuertyp**: Steuertyp
- **Währung**: Währungscode
- **Lieferdatum**: Lieferdatum
- **Lieferdatum bis**: Lieferdatum bis

### Aufträge

Aufträge repräsentieren Bestellungen und Verkaufsaufträge.

#### Operationen
- **Erstellen**: Neuen Auftrag erstellen
- **Abrufen**: Einzelnen Auftrag abrufen
- **Viele abrufen**: Mehrere Aufträge mit Filterung abrufen
- **Aktualisieren**: Bestehenden Auftrag aktualisieren
- **Löschen**: Auftrag löschen
- **Positionen abrufen**: Auftragspositionen abrufen
- **Auftrags-PDF abrufen**: Auftrag als PDF herunterladen
- **Per E-Mail senden**: Auftrag per E-Mail senden
- **Als gesendet markieren**: Auftrag als gesendet markieren

### Belege

Belege repräsentieren Quittungen und Buchhaltungsdokumente.

#### Operationen
- **Erstellen**: Neuen Beleg erstellen
- **Abrufen**: Einzelnen Beleg abrufen
- **Viele abrufen**: Mehrere Belege mit Filterung abrufen
- **Aktualisieren**: Bestehenden Beleg aktualisieren
- **Löschen**: Beleg löschen
- **Beleg buchen**: Beleg zur Finalisierung buchen
- **Datei hochladen**: Datei hochladen und an Beleg anhängen
- **Beleg-PDF abrufen**: Beleg als PDF herunterladen

### Artikel

Artikel repräsentieren Lagerartikel und Produkte.

#### Operationen
- **Erstellen**: Neuen Artikel erstellen
- **Abrufen**: Einzelnen Artikel abrufen
- **Viele abrufen**: Mehrere Artikel mit Filterung abrufen
- **Aktualisieren**: Bestehenden Artikel aktualisieren
- **Aktuellen Bestand abrufen**: Aktuellen Bestandsstand abrufen

#### Felder
- **Name**: Artikelname (erforderlich)
- **Artikelnummer**: Artikelnummer (erforderlich)
- **Bestand**: Aktueller Bestandsstand (erforderlich)
- **Einheit**: Maßeinheit (erforderlich)
- **Steuersatz**: Steuersatz (erforderlich)
- **Preis**: Preis pro Einheit
- **Nettopreis**: Nettopreis
- **Bruttopreis**: Bruttopreis

## Operationen

### Allgemeine Operationen

#### Erstellungsoperationen
Alle Erstellungsoperationen folgen einem ähnlichen Muster:
1. Ressource auswählen
2. "Erstellen" Operation wählen
3. Erforderliche Felder ausfüllen
4. Optionale Felder nach Bedarf hinzufügen
5. Node ausführen

#### Abrufoperationen
Abrufoperationen holen Daten von SevDesk:
- **Abrufen**: Ruft ein einzelnes Element anhand ID ab
- **Viele abrufen**: Ruft mehrere Elemente mit optionaler Filterung ab

#### Aktualisierungsoperationen
Aktualisierungsoperationen ändern bestehende Daten:
1. Element-ID angeben
2. Zu aktualisierende Felder angeben
3. Node ausführen

#### Löschoperationen
Löschoperationen entfernen Elemente:
1. Element-ID angeben
2. Löschung bestätigen
3. Node ausführen

### Filterung

Die meisten "Viele abrufen" Operationen unterstützen Filterung:

#### Allgemeine Filter
- **Limit**: Maximale Anzahl zurückzugebender Elemente
- **Offset**: Anzahl zu überspringender Elemente
- **Order By**: Sortierreihenfolge für Ergebnisse
- **Datumsfilter**: Filterung nach Erstellungs- oder Aktualisierungsdaten

#### Ressourcenspezifische Filter
Jede Ressource hat spezifische Filter:
- **Kontakte**: Kategorie, Stadt, Kundennummer, Tags
- **Rechnungen**: Status, Kontakt, Datumsbereich, Betrag
- **Aufträge**: Status, Kontakt, Datumsbereich
- **Artikel**: Name, Artikelnummer, Bestandsstand

### Paginierung

Für große Datensätze verwenden Sie Paginierung:
1. Setzen Sie ein angemessenes Limit (z.B. 50-100)
2. Verwenden Sie Offset für nachfolgende Seiten
3. Fahren Sie fort, bis alle Daten abgerufen sind

## Beispiele

### Kontakt erstellen

```json
{
  "resource": "contact",
  "operation": "create",
  "name": "Musterfirma GmbH",
  "customerNumber": "KUND001",
  "category": {
    "id": "1",
    "objectName": "Category"
  },
  "status": 1000,
  "vatNumber": "DE123456789",
  "taxNumber": "123/456/78901"
}
```

### Rechnungen mit Filtern abrufen

```json
{
  "resource": "invoice",
  "operation": "getMany",
  "filters": {
    "status": "100",
    "createAfter": "2024-01-01",
    "createBefore": "2024-12-31",
    "limit": 50,
    "offset": 0
  }
}
```

### Rechnung per E-Mail senden

```json
{
  "resource": "invoice",
  "operation": "sendViaEmail",
  "invoiceId": "12345",
  "email": "kunde@beispiel.de",
  "subject": "Ihre Rechnung #RE-2024-001",
  "text": "Bitte finden Sie Ihre Rechnung im Anhang. Zahlung ist innerhalb von 30 Tagen fällig."
}
```

### Rechnung mit Positionen erstellen

```json
{
  "resource": "invoice",
  "operation": "create",
  "contact": {
    "id": "123",
    "objectName": "Contact"
  },
  "invoiceDate": "2024-01-15",
  "header": "Rechnung für Dienstleistungen",
  "status": "100",
  "positions": [
    {
      "name": "Beratungsdienstleistungen",
      "quantity": 10,
      "price": 100.00,
      "unity": {
        "id": "1",
        "objectName": "Unity"
      },
      "taxRate": 19
    }
  ]
}
```

### Batch-Kontakterstellung

```javascript
// Beispiel-Workflow für Batch-Kontakterstellung
const contacts = [
  { name: "Firma A", customerNumber: "KUND001" },
  { name: "Firma B", customerNumber: "KUND002" },
  { name: "Firma C", customerNumber: "KUND003" }
];

// Schleife verwenden, um Kontakte zu erstellen
for (const contact of contacts) {
  // Kontakt-Node-Konfiguration erstellen
  const contactConfig = {
    resource: "contact",
    operation: "create",
    ...contact,
    category: { id: "1", objectName: "Category" }
  };
  
  // Kontakterstellung ausführen
  // Antwort und Fehler behandeln
}
```

## Fehlerbehebung

### Häufige Probleme

#### Authentifizierungsfehler
**Problem**: "401 Unauthorized" oder "403 Forbidden"
**Lösung**:
1. API-Schlüssel korrekt überprüfen
2. API-Schlüssel-Berechtigungen in SevDesk überprüfen
3. Sicherstellen, dass API-Schlüssel nicht abgelaufen ist
4. API-Versionsauswahl überprüfen

#### Rate Limiting
**Problem**: "429 Too Many Requests"
**Lösung**:
1. Request-Throttling implementieren
2. Batch-Operationen verwenden, wenn möglich
3. Verzögerungen zwischen Anfragen hinzufügen
4. API-Nutzungslimits überwachen

#### Fehlende erforderliche Felder
**Problem**: "400 Bad Request" mit Feldvalidierungsfehlern
**Lösung**:
1. Erforderliche Felder für die Operation überprüfen
2. Feldformate überprüfen (Daten, Zahlen, etc.)
3. Sicherstellen, dass Objektreferenzen korrekt sind
4. API-Dokumentation für Feldanforderungen überprüfen

#### Netzwerkprobleme
**Problem**: Verbindungstimeouts oder Netzwerkfehler
**Lösung**:
1. Internetverbindung überprüfen
2. SevDesk API-Status überprüfen
3. Firewall/Proxy-Einstellungen überprüfen
4. Mit exponentieller Wiederholung versuchen

### Fehlerbehandlung

#### Best Practices
1. **Antworten immer überprüfen**: Erfolgsstatus verifizieren
2. **Fehler elegant behandeln**: Ordentliche Fehlerbehandlung implementieren
3. **Fehler protokollieren**: Protokolle für Debugging aufbewahren
4. **Wiederholungslogik**: Wiederholung für vorübergehende Fehler implementieren
5. **Daten validieren**: Daten vor dem Senden überprüfen

#### Fehlerantwortformat
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Fehlerbeschreibung",
    "details": {
      "field": "Zusätzliche Fehlerdetails"
    }
  }
}
```

### Debugging

#### Debug-Protokollierung aktivieren
1. Protokollstufe in n8n auf DEBUG setzen
2. Node-Ausführungsprotokolle überprüfen
3. Netzwerkanfragen überwachen
4. Datentransformationen verifizieren

#### Häufige Debug-Schritte
1. **Anmeldedaten testen**: API-Verbindung verifizieren
2. **Feldwerte überprüfen**: Korrekte Datentypen sicherstellen
3. **IDs validieren**: Objektreferenzen verifizieren
4. **Mit minimalen Daten testen**: Mit erforderlichen Feldern beginnen

## API-Referenz

### Base URL
- **v1**: `https://my.sevdesk.de/api/v1/`
- **v2**: `https://my.sevdesk.de/api/v2/`

### Authentifizierung
```http
Authorization: YOUR_API_KEY
Content-Type: application/json
Accept: application/json
```

### Antwortformat
```json
{
  "objects": [
    {
      "id": "123",
      "objectName": "Contact",
      "additionalProperties": "..."
    }
  ],
  "meta": {
    "total": 1,
    "limit": 50,
    "offset": 0
  }
}
```

### Rate Limits
- **Anfragen pro Minute**: Variiert je nach Plan
- **Burst-Limit**: Überprüfen Sie Ihren SevDesk-Plan
- **Rate-Limit-Header**: Verfügbar in Antwort-Headern

## Best Practices

### Performance
1. **Paginierung verwenden**: Ergebnismengen begrenzen
2. **Batch-Operationen**: Mehrere Elemente zusammen verarbeiten
3. **Daten cachen**: Häufig abgerufene Daten cachen
4. **Abfragen optimieren**: Spezifische Filter verwenden
5. **Nutzung überwachen**: API-Verbrauch verfolgen

### Datenverwaltung
1. **Eingabe validieren**: Daten vor dem Senden überprüfen
2. **Duplikate behandeln**: Duplikaterkennung implementieren
3. **Daten sichern**: Lokale Backups aufbewahren
4. **Versionskontrolle**: Datenänderungen verfolgen
5. **Daten bereinigen**: Veraltete Datensätze entfernen

### Sicherheit
1. **API-Schlüssel sichern**: Schlüssel sicher speichern
2. **Berechtigungen begrenzen**: Minimale erforderliche Berechtigungen verwenden
3. **Zugriff überwachen**: API-Nutzung verfolgen
4. **Schlüssel rotieren**: API-Schlüssel regelmäßig aktualisieren
5. **Audit-Protokolle**: Zugriffsprotokolle aufbewahren

### Workflow-Design
1. **Fehlerbehandlung**: Ordentliche Fehlerbehandlung implementieren
2. **Wiederholungslogik**: Wiederholung für fehlgeschlagene Operationen hinzufügen
3. **Datenvalidierung**: Daten in jedem Schritt validieren
4. **Protokollierung**: Umfassende Protokollierung hinzufügen
5. **Testing**: Workflows gründlich testen

## Entwicklung

### Lokale Entwicklungsumgebung einrichten

1. **Repository klonen**:
   ```bash
   git clone https://github.com/knackw/n8n-nodes-sevdesk-v2.git
   cd n8n-nodes-sevdesk-v2
   ```

2. **Abhängigkeiten installieren**:
   ```bash
   npm install
   ```

3. **Projekt bauen**:
   ```bash
   npm run build
   ```

4. **Tests ausführen**:
   ```bash
   npm test
   ```

5. **Entwicklung starten**:
   ```bash
   npm run dev
   ```

### Codestruktur

```
n8n-nodes-sevdesk-v2/
├── credentials/
│   └── SevDeskApi.credentials.ts
├── nodes/
│   └── SevDesk/
│       ├── SevDesk.node.ts
│       └── descriptions/
│           ├── index.ts
│           ├── ContactDescription.ts
│           ├── InvoiceDescription.ts
│           └── ...
├── tests/
│   └── setup.ts
├── package.json
├── tsconfig.json
└── README.md
```

### Neue Ressourcen hinzufügen

1. **Beschreibungsdatei erstellen**:
   ```typescript
   // nodes/SevDesk/descriptions/NewResourceDescription.ts
   export const newResourceOperations: INodeProperties[] = [
     // Operationen definieren
   ];
   
   export const newResourceFields: INodeProperties[] = [
     // Felder definieren
   ];
   ```

2. **Index-Datei aktualisieren**:
   ```typescript
   // nodes/SevDesk/descriptions/index.ts
   export * from './NewResourceDescription';
   ```

3. **Hauptnode aktualisieren**:
   ```typescript
   // nodes/SevDesk/SevDesk.node.ts
   import { newResourceOperations, newResourceFields } from './descriptions';
   
   // Zu properties-Array hinzufügen
   ...newResourceOperations,
   ...newResourceFields,
   ```

4. **Tests hinzufügen**:
   ```typescript
   // tests/NewResource.test.ts
   describe('NewResource', () => {
     // Testfälle hinzufügen
   });
   ```

### Testing

#### Tests ausführen
```bash
# Alle Tests ausführen
npm test

# Tests im Watch-Modus ausführen
npm run test:watch

# Tests mit Coverage ausführen
npm run test:coverage
```

#### Tests schreiben
```typescript
import { INodeType, INodeTypeDescription } from 'n8n-workflow';
import { SevDesk } from '../SevDesk.node';

describe('SevDesk Node', () => {
  let node: SevDesk;

  beforeEach(() => {
    node = new SevDesk();
  });

  it('should have correct description', () => {
    const description: INodeTypeDescription = node.description;
    expect(description.displayName).toBe('sevDesk');
    expect(description.name).toBe('sevDesk');
  });
});
```

### Beitragen

1. **Repository forken**
2. **Feature-Branch erstellen**: `git checkout -b feature/new-feature`
3. **Änderungen vornehmen**: Feature implementieren
4. **Tests hinzufügen**: Tests für neue Funktionalität schreiben
5. **Tests ausführen**: Sicherstellen, dass alle Tests bestehen
6. **PR einreichen**: Pull Request mit Beschreibung erstellen

### Code-Stil

- **TypeScript**: Strenge TypeScript-Konfiguration verwenden
- **ESLint**: ESLint-Regeln befolgen
- **Prettier**: Prettier für Formatierung verwenden
- **Kommentare**: JSDoc-Kommentare für Funktionen hinzufügen
- **Namensgebung**: Beschreibende Namen für Variablen und Funktionen verwenden

---

## Support

Für zusätzlichen Support:

- **GitHub Issues**: [Bugs melden oder Features anfordern](https://github.com/knackw/n8n-nodes-sevdesk-v2/issues)
- **n8n Community**: [Community-Forum](https://community.n8n.io/)
- **SevDesk API Docs**: [Offizielle API-Dokumentation](https://api.sevdesk.de/)
- **Entwickler-Kontakt**: harald@schwankl.info

## Lizenz

Dieses Projekt ist unter der MIT-Lizenz lizenziert - siehe die [LICENSE](LICENSE) Datei für Details. 