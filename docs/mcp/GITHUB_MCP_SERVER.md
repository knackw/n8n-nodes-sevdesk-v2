# GitHub MCP Server mit Claude CLI für n8n Workflows

Dieses Dokument erklärt, wie Sie den lokalen GitHub MCP Server so konfigurieren, dass er mit Ihrer Claude CLI zusammenarbeitet. Das Ziel ist es, mithilfe von KI-Anweisungen Aktionen in Ihren GitHub-Repositories auszulösen, die wiederum n8n-Workflows starten oder direkt n8n-Workflow-Dateien erstellen.

## Grundvoraussetzungen

Bevor Sie beginnen, stellen Sie sicher, dass Sie die folgenden Punkte erfüllt haben, wie in der README-Datei beschrieben:

- **GitHub Personal Access Token (PAT)**: Sie benötigen einen gültigen PAT mit den entsprechenden Berechtigungen für die Aktionen, die Sie durchführen möchten (z. B. `repo` für Lese-/Schreibzugriff auf Repositories, `workflow` für GitHub Actions etc.)

- **Lokale Server-Methode**: Da Sie stdio erwähnt haben, konzentrieren wir uns auf die Methode "Build from source". Das bedeutet, Sie müssen:

  - Go auf Ihrem System installiert haben
  - Den GitHub MCP Server aus dem Quellcode kompilieren, was eine ausführbare Datei (z. B. `github-mcp-server`) erzeugt. Notieren Sie sich den Pfad zu dieser Datei.

## Konfiguration der Claude CLI

Ihre Claude CLI benötigt eine Konfigurationsdatei, in der Sie den MCP-Server deklarieren. Fügen Sie den folgenden JSON-Block in die entsprechende Konfigurationsdatei Ihrer Claude-Umgebung ein.

Dies ist die Konfiguration, die speziell auf Ihre Anforderung mit stdio zugeschnitten ist.

```json
{
  "mcp": {
    "servers": {
      "github": {
        "command": "/pfad/zu/ihrer/github-mcp-server",
        "args": ["stdio"],
        "env": {
          "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_IHR_PERSOENLICHER_ACCESS_TOKEN"
        }
      }
    }
  }
}
```

### Wichtige Anpassungen

- Ersetzen Sie `/pfad/zu/ihrer/github-mcp-server` durch den tatsächlichen, vollständigen Pfad zur kompilierten Server-Datei auf Ihrem System.
- Ersetzen Sie `ghp_IHR_PERSOENLICHER_ACCESS_TOKEN` durch Ihr echtes GitHub Personal Access Token.

## Alternative Konfiguration mit Docker

Falls Sie Docker installiert haben und diesen Weg bevorzugen, ist die Konfiguration etwas einfacher, da Sie den Server nicht selbst kompilieren müssen.

```json
{
  "mcpServers": {
    "github": {
      "command": "docker",
      "args": [
        "run",
        "-i",
        "--rm",
        "-e",
        "GITHUB_PERSONAL_ACCESS_TOKEN",
        "ghcr.io/github/github-mcp-server"
      ],
      "env": {
        "GITHUB_PERSONAL_ACCESS_TOKEN": "ghp_IHR_PERSOENLICHER_ACCESS_TOKEN"
      }
    }
  }
}
```

## Anweisungen an die Claude CLI für n8n-Workflows

Sobald die Konfiguration abgeschlossen ist und Ihre Claude CLI den github-Server kennt, können Sie Anweisungen geben. In der CLI wird das Tool typischerweise mit einem `@`-Symbol aufgerufen (z.B. `@github`).

Hier sind einige konkrete Beispiele für die Erstellung und Verwaltung von n8n-Workflows.

### Beispiel 1: Einen n8n-Workflow aus einer Beschreibung erstellen

**Ziel**: Sie beschreiben einen einfachen n8n-Workflow und Claude soll die entsprechende JSON-Datei erstellen und in Ihr Repository pushen.

**Notwendige Toolsets**: `repos`

**Anweisung an Claude CLI**:

```
@github Erstelle einen neuen n8n-Workflow. Der Workflow soll durch einen Webhook ausgelöst werden. Nach dem Start soll er die eingehenden Daten nehmen und eine E-Mail über den "Send Email"-Node senden. Der Betreff der E-Mail soll "Neuer Lead von der Webseite" lauten und der Inhalt soll die JSON-Daten des Webhooks enthalten.

Erstelle aus dieser Beschreibung eine gültige n8n-Workflow-JSON-Datei. Speichere diese Datei unter dem Namen neuer-lead-workflow.json im Repository mein-benutzer/n8n-workflows im main-Branch.
```

**Was im Hintergrund passiert:**

1. Claude analysiert Ihre Anforderung
2. Es nutzt sein Wissen über die n8n-JSON-Struktur, um den Workflow zu erstellen
3. Es verwendet das github-Tool (konkret eine Funktion wie `createFile` oder `updateFile` aus dem `repos`-Toolset), um die generierte JSON-Datei im angegebenen Repository zu speichern

### Beispiel 2: Einen GitHub Action Workflow erstellen, der einen n8n-Workflow triggert

**Ziel**: Bei jedem Push auf den main-Branch soll eine GitHub Action einen n8n-Webhook aufrufen, um z.B. eine Bereitstellung oder Benachrichtigung zu starten.

**Notwendige Toolsets**: `repos`, `actions`

**Anweisung an Claude CLI**:

```
@github Ich brauche eine neue GitHub Action für mein Projekt 'mein-benutzer/mein-projekt'. Erstelle eine Workflow-Datei unter .github/workflows/n8n-deploy.yml.

Diese Action soll bei jedem push auf den main-Branch ausgelöst werden. Der einzige Job in diesem Workflow soll einen curl-Befehl ausführen, um eine POST-Anfrage an meinen n8n-Produktions-Webhook zu senden. Die URL des Webhooks ist https://n8n.meine-domain.de/webhook/start-deployment.
```

**Was im Hintergrund passiert:**

1. Claude versteht, dass eine YAML-Datei für GitHub Actions benötigt wird
2. Es formuliert den korrekten YAML-Inhalt basierend auf Ihrer Beschreibung
3. Es nutzt das github-Tool, um die Datei `n8n-deploy.yml` im richtigen Verzeichnis Ihres Repositories zu erstellen

### Beispiel 3: Ein Issue erstellen, um einen neuen n8n-Workflow anzufordern

**Ziel**: Sie möchten die Entwicklung eines neuen n8n-Workflows als Aufgabe in Ihrem Projekt-Tracking festhalten.

**Notwendige Toolsets**: `issues`

**Anweisung an Claude CLI**:

```
@github Erstelle ein neues Issue im Repository 'mein-benutzer/n8n-projekt-planung'. Der Titel des Issues soll "Neuen n8n-Workflow für Rechnungsverarbeitung entwickeln" lauten.

Die Beschreibung soll lauten:
"Wir benötigen einen neuen Workflow, der eingehende Rechnungen per E-Mail verarbeitet, die PDF-Anhänge extrahiert, die Daten mit einer OCR-Software liest und das Ergebnis in einer Google-Tabelle speichert."

Weise das Issue dem Benutzer 'kollege-x' zu und füge die Labels 'n8n' und 'automatisierung' hinzu.
```

**Was im Hintergrund passiert:**

1. Claude identifiziert die Notwendigkeit, ein Issue zu erstellen
2. Es ruft die `createIssue`-Funktion aus dem `issues`-Toolset auf
3. Es übergibt alle von Ihnen genannten Parameter (Titel, Beschreibung, zugewiesene Person, Labels) an die GitHub-API
