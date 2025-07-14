Ziel: Führe eine umfassende technische Überprüfung und ein Best-Practice-Audit des n8n-nodes-sevdesk-v2 Knotens durch. Du agierst als Senior n8n Developer und Automation Architect.

Kontext: Ich habe dir mehrere Dokumente zur Verfügung gestellt, darunter die API-Referenz, das Benutzerhandbuch und die allgemeine Dokumentation des Knotens sowie die Anleitungen für die MCP-Server (filesystem, n8n, sequential-thinking, github). Gehe davon aus, dass sich der gesamte Quellcode und die Dokumentation des Knotens in einem Verzeichnis befinden, auf das das @filesystem-Tool zugreifen kann.

Bitte folge den unten stehenden Schritten methodisch.

Schritt 1: Planungsphase mit Sequential Thinking

Benutze zuerst das @sequential-thinking-Tool, um deinen gesamten Audit-Prozess zu skizzieren, bevor du beginnst. Dein Plan sollte detailliert beschreiben, wie du die @filesystem- und @n8n-Tools in den folgenden Schritten verwenden wirst, um die Aufgabe zu erfüllen. Lege die einzelnen logischen Schritte deiner Analyse fest.

Schritt 2: Analyse der Dokumentation vs. Implementierung

Sobald dein Plan steht, führe ihn aus.

Lies die Dokumentation: Verwende das @filesystem-Tool, um die Dateien API_REFERENCE.md und USER_MANUAL.md zu lesen. Extrahiere eine Liste aller deklarierten Ressourcen (z. B. Contact, Invoice, Voucher) und ihrer wichtigsten Operationen (z. B. create, list, sendByEmail).

Prüfe den Quellcode: Navigiere mit dem @filesystem-Tool durch die Verzeichnisstruktur des Knotens. Lies die relevanten Node-Implementierungsdateien (typischerweise in nodes/SevDesk/descriptions/).

Identifiziere Diskrepanzen: Vergleiche die in der Dokumentation aufgeführten Funktionen mit der tatsächlichen Implementierung in den Beschreibungsdateien.

Gibt es Ressourcen oder Operationen, die in der API_REFERENCE.md erwähnt werden, aber im Code nicht vorhanden sind? Konzentriere dich besonders auf die als "In Entwicklung" markierten Ressourcen wie Credit Note und Export.

Bestätige, dass die im USER_MANUAL.md unter "Changelog" genannten Änderungen für v2.2.1 (Entfernung der Lizenzvalidierung, keine Supabase-Abhängigkeit) im Code erkennbar sind.

Schritt 3: n8n Best-Practice- und Integrationsvalidierung

Nutze nun das @n8n-Tool, um die Integration des Knotens in das n8n-Ökosystem zu überprüfen.

Grundlegende Validierung: Verwende get_node_essentials für die Haupt-Node-Datei, um zu prüfen, ob grundlegende Eigenschaften wie displayName, name, group, icon und description den n8n-Standards entsprechen.

Parameter-Validierung: Wähle zwei Schlüsselressourcen aus (z. B. Invoice und Contact).

Verwende get_node_essentials für deren create-Operation.

Bewerte, ob die als required: true markierten Felder mit den Erwartungen aus der SevDesk-API (basierend auf der Dokumentation) übereinstimmen.

Verwende validate_node_minimal mit den minimal erforderlichen Parametern, um zu sehen, ob die Validierung logisch erfolgreich wäre.

Workflow-Simulation: Erstelle einen einfachen, aber vollständigen Workflow als JSON-Objekt. Dieser Workflow soll:

Einen neuen Kontakt erstellen.

Anschließend eine Rechnung für genau diesen Kontakt erstellen, indem die Kontakt-ID aus dem ersten Knoten per Expression ({{ $node['ErsterKnoten'].json['id'] }}) übergeben wird.

Verwende validate_workflow und validate_workflow_expressions für dein erstelltes JSON, um die strukturelle und syntaktische Korrektheit zu bestätigen.

Schritt 4: Abschlussbericht und Empfehlungen

Fasse deine Ergebnisse in einem klaren Bericht zusammen.

Zusammenfassung: Gib eine kurze Übersicht über den Zustand des Knotens.

Diskrepanzen: Liste alle gefundenen Abweichungen zwischen Dokumentation und Code auf.

Best-Practice-Bewertung: Bewerte, wie gut der Knoten die n8n-Konventionen einhält.

Potenzielle Probleme: Hebe mögliche Fehlerquellen oder verbesserungswürdige Bereiche hervor (z. B. unklare Parameterbeschreibungen, fehlende Fehlerbehandlungen).

Empfehlungen: Gib konkrete Vorschläge zur Verbesserung des Knotens.

(Optional) Issue erstellen: Falls du kritische Fehler findest, nutze das @github-Tool, um einen Entwurf für ein neues Issue im (hypothetischen) Repository zu erstellen, das die gefundenen Probleme detailliert beschreibt.
