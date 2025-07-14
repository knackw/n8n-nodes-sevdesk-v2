# Sequential Thinking MCP Server für n8n-Workflows

Absolut! Hier ist eine ausführliche Schritt-für-Schritt-Anleitung, die Ihnen zeigt, wie Sie den Sequential Thinking MCP Server als Ihren persönlichen Co-Piloten für die Entwicklung komplexer n8n-Workflows nutzen können. Dies ist nicht nur eine technische Anleitung, sondern ein strategischer Leitfaden, um Klarheit und Struktur in Ihre Automatisierungsprojekte zu bringen – die Kirsche auf der Sahnetorte für professionelle Workflow-Entwickler.

Die Anleitung basiert auf der von Ihnen bereitgestellten README-Datei und überträgt das Konzept auf die anspruchsvolle Aufgabe der Workflow-Entwicklung mit n8n, bei der ein klarer Plan oft über Erfolg oder stundenlanges Debugging entscheidet.

## Die Philosophie: Warum dieser Ansatz für n8n?

n8n-Workflows können schnell zu einem unübersichtlichen "Spaghetti-Monster" aus Nodes und Verbindungen werden. Bevor Sie auch nur eine einzige Node auf die Canvas ziehen, zwingt Sie der Sequential-Thinking-Ansatz dazu, den gesamten Prozess zu durchdenken:

- **Klarheit von Anfang an**: Sie definieren das Ziel und die notwendigen Schritte, bevor Sie sich in den Details verlieren.
- **Fehlervermeidung**: Logische Fehler werden im Planungsstadium erkannt, nicht erst, wenn der Workflow fehlschlägt.
- **Dokumentation als Nebenprodukt**: Der Denkprozess dient als perfekte Dokumentation für Sie und Ihr Team.
- **Skalierbarkeit**: Komplexe Verzweigungen und Fehlerbehandlungen werden systematisch geplant und nicht nachträglich "angeflickt".

## Voraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie Folgendes installiert haben:

- Das Claude CLI-Tool
- Entweder Node.js und npm (für die npx-Methode) ODER Docker (für die Docker-Methode). Für die meisten Anwender ist die npx-Methode einfacher, wenn Node.js bereits vorhanden ist.

## Schritt 1: Den MCP-Server für Claude CLI konfigurieren

Sie müssen dem Claude CLI mitteilen, wie es den sequential-thinking Server starten kann. Dies geschieht über eine JSON-Konfigurationsdatei. Die README beschreibt dies für "Claude Desktop" und "VS Code", aber das Prinzip ist für das CLI identisch.

Erstellen Sie eine Konfigurationsdatei für Ihr Claude CLI. Der genaue Name und Speicherort hängt von Ihrem spezifischen CLI-Tool ab (prüfen Sie dessen Dokumentation), aber oft wird eine Datei wie `claude_config.json` im Projektverzeichnis oder im Home-Verzeichnis Ihres Benutzers verwendet.

Fügen Sie einen der folgenden Blöcke in Ihre Konfigurationsdatei ein.

### Option A: Mit npx (empfohlen für Einfachheit)

Diese Option lädt das Skript bei Bedarf herunter und führt es aus.

```json
{
  "mcpServers": {
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/server-sequential-thinking"
      ]
    }
  }
}
```

### Option B: Mit Docker

Diese Option führt den Server in einem isolierten Docker-Container aus.

```json
{
  "mcpServers": {
    "sequentialthinking": {
      "command": "docker",
      "args": [
        "run",
        "--rm",
        "-i",
        "mcp/sequentialthinking"
      ]
    }
  }
}
```

> **Wichtig**: Der Name, den Sie hier als Schlüssel verwenden ("sequential-thinking"), ist der Name, mit dem Sie das Tool später im Claude CLI aufrufen.

## Schritt 2: Den sequential_thinking Server für die n8n-Planung nutzen

Jetzt kommt der spannende Teil. Wir planen einen n8n-Workflow nicht durch "Trial und Error", sondern durch einen geführten Denkprozess.

### Szenario

Wir wollen einen n8n-Workflow erstellen, der stündlich neue GitHub-Issues aus einem bestimmten Repository abruft. Wenn ein Issue das Label "bug" enthält, soll eine dringende Nachricht an einen Discord-Kanal gesendet werden; andernfalls wird eine E-Mail an das Entwicklerteam gesendet.

### 1. Der initiale Prompt

Beginnen Sie mit einer klaren Anweisung an Claude, das Tool zu benutzen.

**Dein Prompt**:

> Ich möchte einen n8n-Workflow entwerfen. Das Ziel ist, stündlich neue GitHub-Issues zu prüfen. Bei "bug"-Issues soll eine Discord-Nachricht gesendet werden, bei allen anderen eine E-Mail. Bitte benutze das sequential-thinking Tool, um den gesamten Workflow Node für Node zu planen, bevor wir die Details der Implementierung besprechen.

### 2. Claudes Denkprozess (mehrere Schritte)

Claude beginnt nun, den Workflow systematisch zu zerlegen.

**Claudes erste Antwort (Beispiel)**:

```json
sequential_thinking({
  "thought": "Okay, planen wir den n8n-Workflow. Der erste Schritt ist der Trigger. Wir benötigen einen 'Cron' Node, der den Workflow stündlich auslöst.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 1,
  "totalThoughts": 5
})
```

Sie antworten einfach mit "Weiter".

**Claudes zweiter Gedanke**:

```json
sequential_thinking({
  "thought": "Nach dem Trigger benötigen wir eine 'GitHub' Node. Sie soll die Operation 'issue:get_all' verwenden, um alle offenen Issues aus dem definierten Repository abzurufen.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 2,
  "totalThoughts": 5
})
```

**Claudes dritter Gedanke**:

```json
sequential_thinking({
  "thought": "Die GitHub-Node gibt eine Liste von Issues zurück. Wir müssen diese durchlaufen. Standardmäßig verarbeitet n8n jedes Element einzeln, das passt also. Als Nächstes brauchen wir eine 'IF' Node, um zu prüfen, ob die 'labels'-Liste eines Issues ein Objekt enthält, dessen 'name'-Eigenschaft 'bug' ist.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 3,
  "totalThoughts": 5
})
```

**Claudes vierter Gedanke**:

```json
sequential_thinking({
  "thought": "Jetzt planen wir die beiden Zweige der IF-Node. Am 'true'-Ausgang hängen wir eine 'Discord' Node. Sie sendet eine formatierte Nachricht mit dem Titel und der URL des Issues in den 'alerts'-Kanal.",
  "nextThoughtNeeded": true,
  "thoughtNumber": 4,
  "totalThoughts": 5
})
```

**Claudes fünfter Gedanke**:

```json
sequential_thinking({
  "thought": "Am 'false'-Ausgang der IF-Node verbinden wir eine 'Send Email' Node. Diese sendet eine E-Mail mit den Issue-Details an die Verteilerliste 'dev-team@example.com'. Der Plan ist nun vollständig.",
  "nextThoughtNeeded": false,
  "thoughtNumber": 5,
  "totalThoughts": 5
})
```

### 3. Die finale Ausgabe: Der fertige Workflow-Plan

Nachdem der Denkprozess abgeschlossen ist, hat Claude einen klaren, logischen Plan.

**Claudes finale Antwort (Beispiel)**:

> Der Plan für den n8n-Workflow ist fertig. Hier ist die Zusammenfassung der Node-Struktur:
>
> **Cron Node (Trigger)**:
> - Mode: Every Hour
>
> **GitHub Node (Daten holen)**:
> - Resource: Issue
> - Operation: get_all
> - Repository: [Dein-Username]/[Dein-Repo]
> - Options: `state: "open"`
>
> **IF Node (Logische Weiche)**:
> - Condition: `{{ $json.labels.some(label => label.name === 'bug') }}`
>
> **Discord Node (True-Pfad)**:
> - Webhook URL: [Deine Discord Webhook URL]
> - Message: `🚨 Neuer Bug gefunden: "{{ $json.title }}" - {{ $json.html_url }}`
>
> **Send Email Node (False-Pfad)**:
> - To: dev-team@example.com
> - Subject: `Neues GitHub Issue: {{ $json.title }}`
> - Body: `Ein neues Issue wurde erstellt: {{ $json.html_url }}`

Mit diesem Plan können Sie den Workflow jetzt gezielt und effizient in n8n umsetzen.

## Die Kirsche auf der Sahnetorte: Revision und Fehlerbehandlung

### Was, wenn sich die Anforderungen ändern?

**Dein Prompt**:

> Guter Plan, aber wir sollten auch Issues mit dem Label "critical" sofort per Discord melden. Bitte überarbeite den dritten Gedanken.

Claude wird nun gezielt diesen Schritt anpassen, ohne den Rest des Plans zu verwerfen. So bleiben Ihre Workflows auch bei Änderungen sauber und nachvollziehbar. Dieser iterative Prozess ist der wahre Mehrwert für komplexe Automatisierungsprojekte.
