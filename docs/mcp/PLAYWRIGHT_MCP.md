Anleitung: Playwright MCP Server mit Claude CLI für die Browser-Automatisierung
Dieses Dokument erklärt, wie Sie den Playwright MCP Server konfigurieren, um mit Ihrer Claude CLI zu interagieren. Das Ziel ist es, einen Webbrowser mithilfe von einfachen, natürlichen Sprachbefehlen zu steuern, um Aufgaben auf Webseiten zu automatisieren, Daten zu extrahieren oder Interaktionen zu simulieren.

Schritt 1: Grundvoraussetzungen
Bevor Sie beginnen, stellen Sie sicher, dass die folgende Anforderung erfüllt ist:

Node.js: Sie benötigen Node.js in der Version 18 oder neuer auf Ihrem System.

Schritt 2: Konfiguration der Claude CLI
Fügen Sie den folgenden JSON-Block in die Konfigurationsdatei Ihrer Claude-Umgebung ein. Diese Konfiguration ist die einfachste Methode, um zu starten, da sie npx verwendet, um immer die neueste Version des Playwright MCP Servers herunterzuladen und auszuführen.

{
"mcpServers": {
"playwright": {
"command": "npx",
"args": [
"@playwright/mcp@latest"
]
}
}
}

Anpassung der Konfiguration
Sie können das Verhalten des Browsers durch Hinzufügen von Argumenten im args-Array steuern. Hier sind einige nützliche Beispiele:

Headless-Modus (ohne sichtbares Browserfenster):
"args": ["@playwright/mcp@latest", "--headless"]

Einen bestimmten Browser verwenden (z.B. Firefox):
"args": ["@playwright/mcp@latest", "--browser", "firefox"]

Ein bestimmtes Gerät emulieren (z.B. iPhone 15):
"args": ["@playwright/mcp@latest", "--device", "iPhone 15"]

Schritt 3: Anweisungen an die Claude CLI für die Browser-Automatisierung
Sobald die Konfiguration aktiv ist, können Sie den playwright-Server in Ihrer CLI ansprechen (typischerweise mit @playwright). Der Server interagiert mit Webseiten, indem er deren Struktur (Accessibility Tree) analysiert, anstatt Screenshots zu verwenden. Das macht die Interaktion sehr zuverlässig.

Hier sind einige praktische Beispiele:

Beispiel 1: Informationen von einer Webseite abrufen
Ziel: Eine Webseite besuchen und herausfinden, was die Hauptüberschrift ist.

Anweisung an Claude CLI:

@playwright Navigiere zu wikipedia.org. Mache dann einen Snapshot der Seite und sage mir, was in der Hauptüberschrift (H1) steht.

Was im Hintergrund passiert:

Claude ruft das playwright-Tool auf.

Es verwendet die Funktion browser_navigate mit der URL https://wikipedia.org.

Danach führt es browser_snapshot aus. Dies erzeugt eine strukturierte Momentaufnahme der Seite.

Claude analysiert diesen Snapshot, findet das H1-Element und gibt dessen Inhalt als Antwort zurück.

Beispiel 2: In eine Web-Anwendung einloggen (z.B. n8n)
Ziel: Sich bei Ihrer lokalen n8n-Instanz anmelden.

Anweisung an Claude CLI:

@playwright Öffne die Seite http://localhost:5678. Gib im Eingabefeld "Email" die E-Mail "admin@example.com" ein. Gib dann im Feld "Password" das Passwort "meinSuperSicheresPasswort" ein und klicke anschließend auf den Button "Sign In".

Was im Hintergrund passiert:

Navigation: browser_navigate wird aufgerufen, um die n8n-Login-Seite zu öffnen.

Snapshot: Ein browser_snapshot wird implizit oder explizit erstellt, damit Claude die Elemente der Seite kennt.

Texteingabe: Claude identifiziert die Eingabefelder anhand ihrer Beschriftung ("Email", "Password"). Es ruft zweimal die Funktion browser_type auf und übergibt dabei die Referenz (ref) des jeweiligen Elements aus dem Snapshot und den einzugebenden Text.

Klick: Claude findet den "Sign In"-Button und ruft browser_click mit der Referenz dieses Buttons auf.

Beispiel 3: Eine Suche durchführen und die Ergebnisse prüfen
Ziel: Auf GitHub nach etwas suchen und warten, bis die Ergebnisseite geladen ist.

Anweisung an Claude CLI:

@playwright Gehe zu github.com. Gib in das Suchfeld "n8n" ein und drücke die Enter-Taste. Warte danach, bis der Text "results for n8n" auf der Seite erscheint.

Was im Hintergrund passiert:

browser_navigate zu github.com.

browser_type wird verwendet, um "n8n" in das Suchfeld einzugeben. Der Parameter submit: true wird wahrscheinlich intern gesetzt, oder es wird ein separater browser_press_key mit dem Wert Enter ausgeführt.

browser_wait_for wird mit dem Parameter text: "results for n8n" aufgerufen. Das Skript pausiert, bis dieser Text auf der Seite erscheint, und stellt so sicher, dass die Ergebnisse geladen sind.

Beispiel 4: Einen Playwright-Test aus Aktionen generieren
Ziel: Eine Reihe von Aktionen durchführen und daraus automatisch ein wiederverwendbares Test-Skript erstellen lassen.

Anweisung an Claude CLI:

`@playwright Ich möchte einen Test aufzeichnen. Der Test heißt "n8n Login" und die Beschreibung ist "Prüft, ob der Login in n8n funktioniert".

Die Schritte sind:

Navigiere zu http://localhost:5678.

Gib "admin@example.com" in das E-Mail-Feld ein.

Gib "password123" in das Passwort-Feld ein.

Klicke auf den "Sign In" Button.

Warte, bis der Text "Workflows" auf der Seite sichtbar ist.

Generiere mir jetzt bitte den Playwright-Testcode dafür.`

Was im Hintergrund passiert:

Claude führt die Schritte nicht direkt aus, sondern nutzt die browser_generate_playwright_test-Funktion.

Es übergibt die von Ihnen beschriebenen Schritte als Parameter an diese Funktion.

Das Playwright MCP Tool generiert den entsprechenden Code für einen Playwright-Test in TypeScript/JavaScript, den Sie direkt in einem Projekt verwenden können.
