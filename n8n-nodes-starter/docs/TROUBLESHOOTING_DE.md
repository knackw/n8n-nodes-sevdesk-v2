# SevDesk API Fehlerbehebungsanleitung

Diese Anleitung hilft Ihnen bei der Diagnose und Lösung häufiger Probleme bei der Verwendung des n8n-nodes-sevdesk-v2 Knotens.

## Schnelldiagnose

### Bezieht sich Ihr Problem auf:
- **Authentifizierung** → [Authentifizierungsprobleme](#authentifizierungsprobleme)
- **API-Fehler** → [Häufige API-Fehler](#häufige-api-fehler)
- **Datenvalidierung** → [Datenvalidierungsfehler](#datenvalidierungsfehler)
- **Performance** → [Performance-Probleme](#performance-probleme)
- **Konfiguration** → [Konfigurationsprobleme](#konfigurationsprobleme)

## Authentifizierungsprobleme

### 1. Ungültiger API-Schlüssel Fehler

**Fehlermeldung:**
```
401 Unauthorized: Invalid API key
```

**Ursachen & Lösungen:**

✅ **API-Schlüssel Format prüfen**
- Stellen Sie sicher, dass Ihr API-Schlüssel korrekt formatiert ist
- SevDesk API-Schlüssel beginnen typischerweise mit bestimmten Präfixen
- Entfernen Sie zusätzliche Leerzeichen oder Zeichen

✅ **API-Schlüssel Gültigkeit überprüfen**
- Melden Sie sich in Ihrem SevDesk-Konto an
- Navigieren Sie zu Einstellungen → API
- Generieren Sie bei Bedarf einen neuen API-Schlüssel
- Stellen Sie sicher, dass der Schlüssel die entsprechenden Berechtigungen hat

✅ **API-Version prüfen**
- Überprüfen Sie, ob Sie die korrekte API-Version verwenden (v1 oder v2)
- Aktualisieren Sie die API-Version in Ihren Anmeldedaten falls nötig

**Beispiel-Lösung:**
```json
{
  "apiKey": "ihr-gültiger-api-schlüssel-hier",
  "apiVersion": "v1"
}
```

### 2. Rate Limit überschritten

**Fehlermeldung:**
```
429 Too Many Requests: Rate limit exceeded
```

**Lösungen:**
- Implementieren Sie Verzögerungen zwischen Anfragen
- Verwenden Sie Batch-Operationen für Massendaten
- Upgraden Sie auf einen höheren SevDesk-Plan für erhöhte Limits
- Der Knoten behandelt automatisch Wiederholungen mit exponentieller Backoff-Strategie

## Häufige API-Fehler

### 1. Ressource nicht gefunden (404)

**Fehlermeldung:**
```
404 Not Found: Contact with ID 123 not found
```

**Debugging-Schritte:**
1. Überprüfen Sie, ob die Ressourcen-ID in SevDesk existiert
2. Prüfen Sie, ob die Ressource gelöscht wurde
3. Stellen Sie sicher, dass Sie Berechtigung zum Zugriff auf die Ressource haben
4. Verwenden Sie die List-Operation, um gültige IDs zu finden

**Beispiel Debug-Abfrage:**
```json
{
  "resource": "contact",
  "operation": "list",
  "limit": 10
}
```

### 2. Validierungsfehler (400)

**Fehlermeldung:**
```
400 Bad Request: Field 'email' is required
```

**Häufige Validierungsprobleme:**

✅ **Erforderliche Felder fehlen**
- Prüfen Sie die SevDesk API-Dokumentation für erforderliche Felder
- Stellen Sie sicher, dass alle Pflichtfelder angegeben sind
- Verwenden Sie die richtigen Datentypen (string, number, boolean)

✅ **Ungültiges Datenformat**
- Daten müssen im ISO-Format sein: `YYYY-MM-DD`
- E-Mail-Adressen müssen gültig sein
- Telefonnummern sollten dem deutschen Format folgen
- Umsatzsteuer-Nummern müssen für deutsche Unternehmen gültig sein

✅ **Feldlängenbegrenzungen**
- Kontaktnamen: max. 255 Zeichen
- Beschreibungen: max. 1000 Zeichen
- Benutzerdefinierte Felder: spezifische Limits prüfen

**Beispiel gültiger Kontakt:**
```json
{
  "name": "Max Mustermann GmbH",
  "customerNumber": "K-001",
  "category": {
    "id": 3,
    "objectName": "Category"
  },
  "email": "max@example.com",
  "phone": "+49 30 12345678"
}
```

### 3. Geschäftslogik-Fehler

**Fehlermeldung:**
```
422 Unprocessable Entity: Invoice cannot be deleted - already sent
```

**Häufige Geschäftsregeln:**
- Rechnungen können nach dem Versenden nicht gelöscht werden
- Kontakte mit bestehenden Rechnungen können nicht gelöscht werden
- Belege müssen gültige Buchungszuordnungen haben
- Bestellungen müssen mindestens eine Position haben

**Lösungen:**
- Prüfen Sie den Ressourcenstatus vor Operationen
- Verwenden Sie entsprechende Operationen (z.B. stornieren statt löschen)
- Befolgen Sie deutsche Buchhaltungsvorschriften

## Datenvalidierungsfehler

### 1. Deutsche Umsatzsteuer-Nummer Validierung

**Fehlermeldung:**
```
Invalid VAT number format for German business
```

**Gültige Formate:**
- Deutsche USt-IdNr.: `DE123456789`
- EU-USt-IdNr.: Ländercode + Nummer
- Keine USt-IdNr.: Feld leer lassen

### 2. Adressvalidierung

**Fehlermeldung:**
```
Invalid postal code for German address
```

**Anforderungen:**
- Deutsche Postleitzahlen: 5 Ziffern (z.B. `10115`)
- Straßenadressen müssen Hausnummer enthalten
- Städtenamen müssen gültige deutsche Städte sein

**Beispiel gültige Adresse:**
```json
{
  "street": "Musterstraße 123",
  "zip": "10115",
  "city": "Berlin",
  "country": {
    "id": 1,
    "objectName": "Country"
  }
}
```

### 3. Währungs- und Betragsvalidierung

**Fehlermeldung:**
```
Invalid currency code or amount format
```

**Anforderungen:**
- Verwenden Sie ISO-Währungscodes (EUR, USD, etc.)
- Beträge müssen positive Zahlen sein
- Maximal 2 Dezimalstellen für die meisten Währungen
- Verwenden Sie das richtige Dezimaltrennzeichen (Punkt, nicht Komma)

## Performance-Probleme

### 1. Langsame Antwortzeiten

**Symptome:**
- Anfragen dauern länger als 30 Sekunden
- Timeouts bei großen Datenoperationen

**Lösungen:**

✅ **Abfragen optimieren**
- Verwenden Sie Paginierung für große Datensätze
- Begrenzen Sie den `depth`-Parameter zur Reduzierung der Datengröße
- Filtern Sie Ergebnisse auf nur benötigte Daten

✅ **Batch-Operationen**
- Verwenden Sie Batch-Endpunkte für Massenoperationen
- Verarbeiten Sie Daten in kleineren Blöcken
- Implementieren Sie ordnungsgemäße Fehlerbehandlung für Teilausfälle

**Beispiel optimierte Abfrage:**
```json
{
  "resource": "contact",
  "operation": "list",
  "limit": 50,
  "depth": 0,
  "embed": "category"
}
```

### 2. Speicherprobleme

**Symptome:**
- Speicher-Fehler
- Knoten-Abstürze bei großen Operationen

**Lösungen:**
- Verarbeiten Sie Daten in kleineren Batches
- Verwenden Sie Streaming für große Dateioperationen
- Löschen Sie Variablen nach der Verarbeitung
- Überwachen Sie die Speichernutzung

## Konfigurationsprobleme

### 1. Falsche Basis-URL

**Fehlermeldung:**
```
Connection refused or DNS resolution failed
```

**Lösungen:**
- Überprüfen Sie die SevDesk API Basis-URL
- Prüfen Sie Ihre Internetverbindung
- Stellen Sie sicher, dass die Firewall HTTPS-Verbindungen erlaubt
- Verwenden Sie den korrekten regionalen Endpunkt

**Korrekte Basis-URLs:**
- Produktion: `https://my.sevdesk.de/api/v1/`
- Sandbox: `https://my.sevdesk.de/api/v1/` (mit Test-Anmeldedaten)

### 2. SSL/TLS-Probleme

**Fehlermeldung:**
```
SSL certificate verification failed
```

**Lösungen:**
- Aktualisieren Sie Node.js auf die neueste Version
- Prüfen Sie den System-Zertifikatsspeicher
- Überprüfen Sie, ob die Systemzeit korrekt ist
- Kontaktieren Sie IT-Support bei Unternehmens-Firewalls

### 3. Proxy-Konfiguration

**Fehlermeldung:**
```
Connection timeout through proxy
```

**Lösungen:**
- Konfigurieren Sie Proxy-Einstellungen in n8n
- Setzen Sie SevDesk-Domains auf die Whitelist im Proxy
- Verwenden Sie wenn möglich eine direkte Verbindung
- Prüfen Sie die Proxy-Authentifizierung

## Debugging-Techniken

### 1. Debug-Protokollierung aktivieren

Fügen Sie Debug-Informationen zu Ihren Workflows hinzu:

```javascript
// In einem Code-Knoten vor SevDesk-Operationen
console.log('Eingabedaten:', $input.all());
console.log('Anmeldedaten-Test:', $credentials.sevDeskApi);
return $input.all();
```

### 2. API-Konnektivität testen

Erstellen Sie einen einfachen Test-Workflow:

```json
{
  "resource": "basics",
  "operation": "get"
}
```

### 3. Daten Schritt für Schritt validieren

Teilen Sie komplexe Operationen in kleinere Schritte auf:
1. Authentifizierung testen
2. Eingabedaten validieren
3. Einzelne Operationen testen
4. Zu vollständigem Workflow kombinieren

### 4. SevDesk API-Dokumentation verwenden

- Prüfen Sie die offizielle API-Dokumentation: https://api.sevdesk.de/
- Überprüfen Sie Feldanforderungen und -formate
- Testen Sie Operationen im SevDesk API-Explorer

## Fehlercode-Referenz

| Code | Bedeutung | Häufige Ursachen | Lösungen |
|------|-----------|------------------|----------|
| 400 | Bad Request | Ungültige Parameter, fehlende Pflichtfelder | Eingabedaten validieren, API-Dokumentation prüfen |
| 401 | Unauthorized | Ungültiger API-Schlüssel, abgelaufene Anmeldedaten | API-Schlüssel aktualisieren, Berechtigungen prüfen |
| 403 | Forbidden | Unzureichende Berechtigungen | Kontoberechtigungen prüfen, SevDesk-Support kontaktieren |
| 404 | Not Found | Ressource existiert nicht, falsche ID | Ressource existiert überprüfen, ID-Format prüfen |
| 422 | Unprocessable Entity | Geschäftslogik-Verletzung | Deutsche Buchhaltungsregeln befolgen, Ressourcenstatus prüfen |
| 429 | Too Many Requests | Rate Limit überschritten | Verzögerungen implementieren, Batch-Operationen verwenden |
| 500 | Internal Server Error | SevDesk-Serverprobleme | Anfrage wiederholen, SevDesk-Support kontaktieren |
| 502/503 | Service Unavailable | SevDesk-Wartung | Warten und wiederholen, SevDesk-Statusseite prüfen |

## Hilfe erhalten

### 1. Protokolle prüfen
- n8n-Ausführungsprotokolle überprüfen
- Nach detaillierten Fehlermeldungen suchen
- Netzwerkkonnektivitätsprotokolle prüfen

### 2. Community-Support
- n8n Community Forum: https://community.n8n.io/
- SevDesk Support: https://sevdesk.de/support/
- GitHub Issues: Projekt-Repository

### 3. Professioneller Support
- n8n Cloud-Support für gehostete Instanzen
- SevDesk Premium-Support für API-Probleme
- Beratungsdienstleistungen für komplexe Integrationen

### 4. Nützliche Ressourcen
- [SevDesk API-Dokumentation](https://api.sevdesk.de/)
- [n8n-Dokumentation](https://docs.n8n.io/)
- [Deutsche Buchhaltungsvorschriften](https://www.bundesfinanzministerium.de/)

## Präventions-Tipps

### 1. Regelmäßige Wartung
- API-Schlüssel vor Ablauf aktualisieren
- Rate-Limit-Nutzung überwachen
- Knoten-Version aktuell halten
- Workflows regelmäßig testen

### 2. Fehlerbehandlung
- Ordnungsgemäße try-catch-Blöcke implementieren
- Retry-Logik für vorübergehende Ausfälle hinzufügen
- Fehler für Debugging protokollieren
- Benutzerfreundliche Fehlermeldungen bereitstellen

### 3. Datenqualität
- Daten vor API-Aufrufen validieren
- Konsistente Datenformate verwenden
- Datenbereinigung implementieren
- Regelmäßige Datenqualitätsprüfungen

### 4. Performance-Überwachung
- Antwortzeiten überwachen
- Fehlerquoten verfolgen
- Warnungen für Ausfälle einrichten
- Regelmäßige Performance-Reviews

---

## Schnellreferenz-Befehle

### API-Verbindung testen
```json
{
  "resource": "basics",
  "operation": "get"
}
```

### Verfügbare Ressourcen auflisten
```json
{
  "resource": "category",
  "operation": "list"
}
```

### Kontaktdaten validieren
```json
{
  "resource": "contact",
  "operation": "list",
  "limit": 1
}
```

### Rate Limits prüfen
Überwachen Sie Response-Header für Rate-Limit-Informationen.

---

*Diese Fehlerbehebungsanleitung wird regelmäßig aktualisiert. Für die neuesten Informationen prüfen Sie die Projektdokumentation und SevDesk API-Updates.*
