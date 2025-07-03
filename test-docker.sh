#!/bin/bash

# Test-Skript für SevDesk-Node Docker Installation
# Prüft ob der Node korrekt installiert wurde

echo "🧪 SevDesk-Node Docker Test"
echo "=========================="

# Prüfe ob Docker läuft
if ! docker --version > /dev/null 2>&1; then
    echo "❌ Docker ist nicht installiert oder läuft nicht"
    exit 1
fi

echo "✅ Docker ist verfügbar"

# Prüfe ob docker-compose verfügbar ist
if ! docker-compose --version > /dev/null 2>&1; then
    echo "❌ docker-compose ist nicht installiert"
    exit 1
fi

echo "✅ docker-compose ist verfügbar"

# Prüfe notwendige Dateien
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml nicht gefunden"
    exit 1
fi

if [ ! -f "install-packages.sh" ]; then
    echo "❌ install-packages.sh nicht gefunden"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json nicht gefunden"
    exit 1
fi

echo "✅ Alle notwendigen Dateien vorhanden"

# Starte Container
echo "🚀 Starte Docker-Container..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Fehler beim Starten des Containers"
    exit 1
fi

echo "✅ Container gestartet"

# Warte auf Initialisierung
echo "⏳ Warte auf Container-Initialisierung (30 Sekunden)..."
sleep 30

# Prüfe ob Container läuft
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Container läuft nicht"
    docker-compose logs
    exit 1
fi

echo "✅ Container läuft"

# Prüfe n8n-Erreichbarkeit
echo "🌐 Prüfe n8n-Erreichbarkeit..."
if curl -s http://localhost:5678 > /dev/null; then
    echo "✅ n8n ist erreichbar auf http://localhost:5678"
else
    echo "❌ n8n ist nicht erreichbar"
    echo "📋 Container-Logs:"
    docker-compose logs --tail=20
    exit 1
fi

# Prüfe SevDesk-Node Installation
echo "🔍 Prüfe SevDesk-Node Installation..."
if docker-compose exec -T n8n sh -c "ls /home/node/.n8n/nodes/ | grep sevdesk" > /dev/null 2>&1; then
    echo "✅ SevDesk-Node ist installiert"
else
    echo "❌ SevDesk-Node nicht gefunden"
    echo "📋 Verfügbare Nodes:"
    docker-compose exec -T n8n sh -c "ls -la /home/node/.n8n/nodes/"
fi

# Prüfe npm link
echo "🔗 Prüfe npm-Link..."
if docker-compose exec -T n8n sh -c "npm list -g n8n-nodes-sevdesk-v2" > /dev/null 2>&1; then
    echo "✅ SevDesk-Node ist global verlinkt"
else
    echo "⚠️  SevDesk-Node nicht global verlinkt (möglicherweise normal)"
fi

echo ""
echo "🎉 Test abgeschlossen!"
echo ""
echo "📋 Nächste Schritte:"
echo "1. Öffnen Sie http://localhost:5678 in Ihrem Browser"
echo "2. Erstellen Sie einen neuen Workflow"
echo "3. Suchen Sie nach 'SevDesk' in der Node-Liste"
echo "4. Falls der Node nicht sichtbar ist, führen Sie aus: docker-compose restart"
echo ""
echo "🛠️  Debugging-Kommandos:"
echo "   docker-compose logs -f     # Logs anzeigen"
echo "   docker-compose ps          # Container-Status"
echo "   docker-compose restart     # Container neustarten"
echo "   docker-compose down        # Container stoppen" 