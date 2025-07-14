# n8n-Workflows mit Claude und dem MCP-Server erstellen

Dieses Dokument erklärt, welche Anweisungen (Prompts) du dem Claude CLI geben musst, um den n8n-MCP-Server effektiv zu nutzen. Das Ziel ist es, Claude zu einem Experten für die Erstellung, Validierung und Verwaltung deiner n8n-Workflows zu machen.

## Das Grundprinzip

Der n8n-MCP-Server fungiert als "Gehirn" für Claude. Er gibt Claude Zugriff auf das gesamte Wissen über mehr als 500 n8n-Nodes, deren Eigenschaften, Operationen und Dokumentationen. Anstatt dass Claude rät, welche Einstellungen ein Node benötigt, kann es den MCP-Server direkt fragen.

Deine Aufgabe ist es, Claude anzuweisen, diese Werkzeuge in der richtigen Reihenfolge zu benutzen.

## Der Kernprozess: Vom Konzept zum fertigen Workflow

Folge diesem schrittweisen Prozess, wenn du Claude bittest, einen neuen Workflow zu erstellen.

### 1. Die Entdeckungsphase (Discovery)

Hier geht es darum, die richtigen Bausteine (Nodes) für deine Idee zu finden.

**Anweisung an Claude**: 
> "Finde die passenden n8n-Nodes, um [DEIN ZIEL] zu erreichen. Ich möchte [AKTION DURCHFÜHREN], wenn [TRIGGER EREIGNIS] eintritt."

**Werkzeuge, die Claude nutzen wird:**

- `search_nodes({query: 'Suchbegriff'})`: Um nach Nodes zu suchen, die zu einer Funktion passen (z.B. 'send email', 'read google sheet', 'http request').
- `list_nodes({category: 'trigger'})`: Um Nodes nach Kategorien zu durchsuchen (z.B. trigger, action).
- `list_ai_tools()`: Um spezielle KI-fähige Nodes zu finden.

**Beispiel-Anweisung:**

> "Ich möchte einen Workflow erstellen, der jede Stunde die neuesten Top-Artikel von Hacker News abruft und den Titel und die URL in eine Google Sheets-Tabelle schreibt. Finde die dafür notwendigen Nodes."

### 2. Die Konfigurations- und Validierungsphase

Sobald die Nodes gefunden sind, muss Claude herausfinden, wie man sie konfiguriert. Dies ist der wichtigste Schritt, um Fehler zu vermeiden.

**Anweisung an Claude**:
> "Hole dir die wichtigsten Konfigurationsdetails für die gefundenen Nodes und validiere die Einstellungen, bevor du den Workflow baust."

**Werkzeuge, die Claude nutzen wird:**

- `get_node_essentials('node-name')`: Holt nur die 10-20 wichtigsten Eigenschaften eines Nodes. Das ist viel effizienter als die komplette Konfiguration.
- `validate_node_minimal(...)`: Überprüft, ob alle Pflichtfelder für einen Node ausgefüllt sind.
- `validate_node_operation(...)`: Eine tiefere Prüfung, die auch die gewählte Operation (z.B. "send message" bei Slack) berücksichtigt.

**Beispiel-Anweisung:**

> "Okay, wir brauchen den 'Schedule Trigger', 'HTTP Request' und 'Google Sheets' Node. Hol dir jetzt die essentials für jeden dieser Nodes. Validiere danach die Konfiguration für den Google Sheets Node, um sicherzustellen, dass wir eine neue Zeile hinzufügen können (append operation)."

### 3. Die Erstellungsphase (Building)

Nachdem alle Einzelteile validiert sind, kann Claude den kompletten Workflow als JSON-Struktur zusammenbauen.

**Anweisung an Claude**:
> "Erstelle jetzt den vollständigen Workflow als JSON-Objekt. Verbinde die Nodes in der richtigen Reihenfolge und verwende die zuvor validierten Konfigurationen. Stelle sicher, dass die Daten vom HTTP-Request-Node korrekt an den Google-Sheets-Node übergeben werden, indem du n8n-Expressions wie `$json` oder `$node['NodeName'].json` verwendest."

**Ergebnis**: Claude wird dir einen JSON-Codeblock präsentieren. Diesen kannst du direkt kopieren und in deiner n8n-Instanz importieren.

### 4. Die finale Workflow-Validierung

Bevor du den Workflow importierst, sollte Claude ihn als Ganzes überprüfen.

**Anweisung an Claude**:
> "Validiere den gesamten Workflow, den du gerade erstellt hast. Überprüfe die Verbindungen zwischen den Nodes und die Syntax aller Expressions."

**Werkzeuge, die Claude nutzen wird:**

- `validate_workflow(WORKFLOW_JSON)`: Überprüft den gesamten Workflow.
- `validate_workflow_connections(WORKFLOW_JSON)`: Stellt sicher, dass die Nodes korrekt miteinander verbunden sind.
- `validate_workflow_expressions(WORKFLOW_JSON)`: Prüft alle `$json...`-Ausdrücke.

### 5. Die Bereitstellung (Deployment) - Optional

Wenn du deine n8n-Instanz in der Konfiguration des MCP-Servers hinterlegt hast, kann Claude den Workflow sogar direkt für dich erstellen oder aktualisieren.

**Anweisung an Claude**:
> "Der Workflow ist validiert. Erstelle ihn jetzt direkt in meiner n8n-Instanz."

**Werkzeuge, die Claude nutzen wird:**

- `n8n_create_workflow(WORKFLOW_JSON)`: Erstellt einen neuen Workflow.
- `n8n_update_partial_workflow(...)`: Aktualisiert einen bestehenden Workflow sehr effizient (spart 80-90% Tokens).

## Zusammenfassendes Beispiel: Kompletter Dialog mit Claude

**Du:**

> "Hallo Claude. Lass uns einen n8n-Workflow bauen. Ich möchte jede neue E-Mail in meinem Gmail-Posteingang, die das Label 'Rechnung' hat, nehmen und den Anhang (PDF) in einem bestimmten Google Drive Ordner speichern. Bitte starte, indem du die notwendigen Tools und Best Practices prüfst."

**Claude** (denkt nach und nutzt die Tools):

1. `tools_documentation()` -> Versteht die eigenen Fähigkeiten.
2. `search_nodes({query: 'gmail trigger new email'})` -> Findet n8n-nodes-base.gmailTrigger.
3. `search_nodes({query: 'google drive upload file'})` -> Findet n8n-nodes-base.googleDrive.
4. `get_node_essentials('n8n-nodes-base.gmailTrigger')` -> Holt Infos zum Gmail Trigger.
5. `get_node_essentials('n8n-nodes-base.googleDrive')` -> Holt Infos zum Google Drive Node.
6. `validate_node_operation(...)` -> Validiert die Konfiguration für beide Nodes.
7. Erstellt den Workflow-JSON.
8. `validate_workflow(...)` -> Prüft den fertigen JSON-Code.

**Claude** (antwortet dir):

> "Okay, ich habe einen Plan. Wir benötigen den 'Gmail Trigger' und den 'Google Drive' Node. Ich habe die Konfigurationen für beide validiert. Hier ist der fertige und geprüfte Workflow, den du direkt in n8n importieren kannst. Er wird auf neue E-Mails mit dem Label 'Rechnung' warten und den binären Anhangsdaten (`$binary.data`) an den Google Drive Node übergeben, um die Datei hochzuladen.

```json
{
  "nodes": [
    // ... JSON-Struktur des Workflows ...
  ],
  "connections": {
    // ... JSON-Struktur der Verbindungen ...
  }
}
```

Soll ich diesen Workflow direkt in deiner n8n-Instanz erstellen?"
