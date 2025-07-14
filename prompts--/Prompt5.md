Ziel: Führe ein umfassendes Audit aller n8n-Workflows im Verzeichnis test-workflows durch. Du agierst als Senior n8n Automation Consultant. Der Fokus liegt auf der korrekten Verwendung des n8n-nodes-sevdesk-v2 Knotens, der Einhaltung von Best Practices und der Identifizierung von potenziellen Fehlern oder Ineffizienzen.

Kontext: Ich habe dir die Dokumentation für den SevDesk-Knoten und die MCP-Server zur Verfügung gestellt. Alle zu prüfenden Workflows sind als .json-Dateien im Verzeichnis test-workflows gespeichert.

Bitte folge den unten stehenden Schritten methodisch.

Schritt 1: Planungsphase mit Sequential Thinking

Benutze zuerst das @sequential-thinking-Tool, um deinen gesamten Audit-Prozess zu skizzieren. Dein Plan muss beschreiben, wie du vorgehen wirst, um jeden Workflow systematisch zu analysieren.

Dein Plan sollte mindestens folgende Punkte umfassen:

Auflisten aller Workflow-Dateien im Verzeichnis test-workflows.

Definieren einer Schleife oder eines sequenziellen Prozesses, um jede Datei einzeln zu bearbeiten.

Für jede Datei: Inhalt lesen, mit @n8n-Tools validieren und auf Best Practices prüfen.

Sammeln der Ergebnisse für den Abschlussbericht.

Schritt 2: Systematische Workflow-Analyse

Führe nun deinen Plan aus.

Workflows auflisten: Verwende das @filesystem-Tool mit der Funktion list_directory, um eine Liste aller .json-Dateien im Pfad test-workflows/ zu erhalten.

Jeden Workflow einzeln prüfen: Führe für jede gefundene Workflow-Datei die folgenden Analysen durch:

Datei einlesen: Lese den Inhalt der Workflow-JSON-Datei mit @filesystem.read_file.

Technische Validierung mit @n8n:

validate_workflow: Überprüfe die grundlegende Struktur und Syntax des gesamten Workflows.

validate_workflow_connections: Stelle sicher, dass alle Knoten korrekt miteinander verbunden sind und es keine losen Enden gibt.

validate_workflow_expressions: Prüfe alle n8n-Expressions (z.B. {{ $json.body.id }}) auf syntaktische Korrektheit.

Best-Practice- und Logik-Audit (Analyse des Inhalts):

Fehlerbehandlung: Gibt es eine angemessene Fehlerbehandlung? Werden die "Settings" eines Knotens wie "Continue on Fail" oder "Retry on Fail" sinnvoll genutzt? Gibt es Error-Workflow-Pfade?

Effizienz: Werden unnötige Schleifen oder "Split in Batches"-Knoten verwendet, wo eine Operation alles auf einmal verarbeiten könnte? Werden beim Abrufen von Daten aus dem SevDesk-Knoten Filter (Filters) genutzt oder werden große Datenmengen geladen und dann in n8n gefiltert?

Sicherheit: Werden sensible Daten wie API-Schlüssel oder Passwörter hartcodiert in Knoten (z.B. im "Set"-Knoten) gespeichert, anstatt n8n-Credentials zu verwenden?

Lesbarkeit: Sind die Knoten sinnvoll benannt oder haben sie Standardnamen wie "SevDesk", "SevDesk1", "Set2"? Sind Notizen (notes) zur Erklärung komplexer Schritte vorhanden?

Schritt 3: Abschlussbericht und Empfehlungen

Fasse deine Ergebnisse in einem strukturierten Bericht zusammen. Der Bericht sollte für jeden geprüften Workflow (.json-Datei) einen eigenen Abschnitt haben.

Jeder Abschnitt muss enthalten:

Workflow-Name: Der Name der überprüften Datei.

Zusammenfassung: Eine kurze Beschreibung, was der Workflow zu tun scheint.

Validierungs-Checkliste:

Struktur und Syntax: OK / Fehlerhaft

Verbindungen: OK / Fehlerhaft

Expressions: OK / Fehlerhaft

Gefundene Probleme und Verbesserungspotenziale: Eine klare Liste aller identifizierten Schwachstellen aus dem Best-Practice-Audit (z.B. "Keine Fehlerbehandlung bei HTTP-Request", "Ineffiziente Datenfilterung im SevDesk-Knoten 'Get Many Invoices'", "Hartcodierter API-Schlüssel gefunden").

Konkrete Handlungsempfehlungen: Klare Anweisungen, wie die gefundenen Probleme behoben werden können (z.B. "Füge einen Error-Trigger-Pfad hinzu", "Setze den Filter 'status' direkt in den Parametern des SevDesk-Knotens", "Verschiebe den API-Schlüssel in ein n8n-Credential").
