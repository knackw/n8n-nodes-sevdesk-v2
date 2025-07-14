Filesystem MCP Server mit Claude CLI für n8n-Workflows und API-Dokumentation
Dieses Dokument beschreibt, wie Sie den Filesystem MCP Server als Brücke zwischen der Claude CLI und Ihrem lokalen Dateisystem nutzen können. Das Ziel ist es, die Erstellung und Verwaltung von n8n-Workflows zu automatisieren und gleichzeitig gescrapte API-Dokumentationen im Markdown-Format für die Entwicklung bereitzustellen und durchsuchbar zu machen.

1. Grundlagen: Das Konzept
	 Die Kernidee ist, Claude die Fähigkeit zu geben, direkt mit Ihren lokalen Entwicklungsdateien zu interagieren.

Claude CLI: Ihre Schnittstelle zur KI. Sie geben Anweisungen in natürlicher Sprache.

Filesystem MCP Server: Der "Roboterarm" der KI. Er führt auf Befehl Dateioperationen (lesen, schreiben, auflisten, suchen) in vordefinierten, sicheren Verzeichnissen aus.

n8n-Workflows: Sind im Grunde strukturierte .json-Dateien. Claude kann diese erstellen, lesen und modifizieren.

API-Dokumentation: Sind .md-Dateien (Markdown). Claude kann diese speichern, durchsuchen und deren Inhalt zur Erstellung von Code oder n8n-Workflows verwenden.

2. Einrichtung: Dem Server Zugriff gewähren
	 Dies ist der wichtigste Schritt. Sie müssen dem MCP-Server explizit erlauben, auf die Verzeichnisse zuzugreifen, in denen Ihre n8n-Workflows und Ihre Dokumentationen liegen.

Identifizieren Sie Ihre Verzeichnisse:

n8n-Workflows: Standardmäßig oft unter ~/.n8n/workflows/.

API-Dokumentation: Erstellen Sie ein dediziertes Verzeichnis, z.B. ~/Dokumente/api-doku/.

Konfigurieren Sie den Server: Fügen Sie die Pfade zu Ihrer claude_desktop_config.json (oder einer ähnlichen Konfigurationsdatei) hinzu. Ersetzen Sie /Users/username durch Ihren tatsächlichen Benutzerpfad.

{
"mcpServers": {
"filesystem": {
"command": "npx",
"args": [
"-y",
"@modelcontextprotocol/server-filesystem",
"/Users/username/.n8n/workflows",
"/Users/username/Dokumente/api-doku"
]
}
}
}

Was passiert hier? Sie starten den Server und geben ihm die Erlaubnis, Lese- und Schreibvorgänge in genau diesen beiden Ordnern durchzuführen. Alle Anfragen für Pfade außerhalb dieser Verzeichnisse werden abgelehnt.

3. Anwendungsbeispiele: n8n-Workflows
	 Hier sind typische Anweisungen, die Sie Claude geben würden.

Szenario 1: Einen neuen Workflow erstellen
Ihre Anweisung: "Erstelle einen neuen n8n-Workflow namens 'Tägliche Zusammenfassung'. Er soll per Webhook ausgelöst werden und dann einen einzelnen 'Set'-Knoten enthalten, der eine Variable erledigt auf true setzt. Speichere ihn als taegliche-zusammenfassung.json."

Was Claude im Hintergrund tut (Tool-Aufruf):

filesystem.write_file(
path="/Users/username/.n8n/workflows/taegliche-zusammenfassung.json",
content="""
{
"name": "Tägliche Zusammenfassung",
"nodes": [
{
"parameters": {
"path": "summary-webhook",
"options": {}
},
"name": "Webhook",
"type": "n8n-nodes-base.webhook",
"typeVersion": 1,
"position": [240, 300]
},
{
"parameters": {
"values": { "boolean": [{ "name": "erledigt", "value": true }] },
"options": {}
},
"name": "Set",
"type": "n8n-nodes-base.set",
"typeVersion": 1,
"position": [460, 300]
}
],
"connections": {
"Webhook": { "main": [[{ "node": "Set", "type": "main" }]] }
}
}
"""
)

Szenario 2: Bestehende Workflows auflisten
Ihre Anweisung: "Welche n8n-Workflows habe ich bereits?"

Was Claude im Hintergrund tut:

filesystem.list_directory(path="/Users/username/.n8n/workflows")

4. Anwendungsbeispiele: API-Dokumentation
	 Jetzt nutzen wir das zweite Verzeichnis, das wir freigegeben haben.

Szenario 1: Gescrapte Dokumentation speichern
Ihre Anweisung: "Ich habe hier die API-Dokumentation für den 'Create Customer'-Endpunkt von Stripe. Speichere sie in einer Markdown-Datei namens `stripe_create
