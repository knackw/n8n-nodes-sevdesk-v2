#!/bin/bash

# Script für automatische Installation von n8n Community Packages und lokalen Nodes
# Wird beim Docker Container Start ausgeführt

echo "🚀 n8n Community Package & Local Node Installer gestartet..."

# Erstelle notwendige Verzeichnisse
mkdir -p /home/node/.n8n/nodes
mkdir -p /home/node/.n8n/custom

# Standard Community Packages die installiert werden sollen
DEFAULT_PACKAGES="n8n-nodes-base,n8n-nodes-advanced-flow-blocks,n8n-nodes-puppeteer,n8n-nodes-firecrawl,n8n-nodes-elevenlabs,@brave/n8n-nodes-brave-search"

# Verwende N8N_COMMUNITY_PACKAGES falls gesetzt, ansonsten DEFAULT_PACKAGES
PACKAGES_TO_INSTALL="${N8N_COMMUNITY_PACKAGES:-$DEFAULT_PACKAGES}"

echo "📦 Installiere Community Packages: $PACKAGES_TO_INSTALL"

# Installiere jedes Package einzeln
IFS=',' read -ra PACKAGES <<< "$PACKAGES_TO_INSTALL"
for package in "${PACKAGES[@]}"; do
    # Entferne Leerzeichen
    package=$(echo "$package" | xargs)
    
    if [ ! -z "$package" ]; then
        echo "🔧 Installiere: $package"
        
        # Versuche globale Installation
        if npm install -g "$package" --no-fund --no-audit; then
            echo "✅ $package erfolgreich installiert"
        else
            echo "❌ Fehler beim Installieren von $package"
            
            # Fallback: Versuche lokale Installation im nodes Verzeichnis
            echo "🔄 Versuche lokale Installation..."
            cd /home/node/.n8n/nodes
            if npm install "$package" --no-fund --no-audit; then
                echo "✅ $package lokal installiert"
            else
                echo "❌ Auch lokale Installation fehlgeschlagen für $package"
            fi
        fi
    fi
done

# Installation des lokalen SevDesk-Nodes
echo "🔧 Installiere lokalen SevDesk-Node..."

if [ "$INSTALL_LOCAL_SEVDESK_NODE" = "true" ] && [ -d "$SEVDESK_NODE_PATH" ]; then
    echo "📂 Gefunden: $SEVDESK_NODE_PATH"
    
    # Wechsle in das SevDesk-Node Verzeichnis
    cd "$SEVDESK_NODE_PATH"
    
    # Prüfe ob package.json existiert
    if [ ! -f "package.json" ]; then
        echo "❌ Keine package.json gefunden in $SEVDESK_NODE_PATH"
        exit 1
    fi
    
    echo "📥 Installiere Node Dependencies..."
    if npm install --no-fund --no-audit; then
        echo "✅ Dependencies installiert"
    else
        echo "❌ Fehler beim Installieren der Dependencies"
        exit 1
    fi
    
    echo "🔨 Kompiliere SevDesk-Node..."
    if npm run build; then
        echo "✅ Build erfolgreich"
    else
        echo "❌ Build fehlgeschlagen"
        exit 1
    fi
    
    echo "🔗 Verlinke SevDesk-Node global..."
    if npm link; then
        echo "✅ Globaler Link erstellt"
    else
        echo "❌ Globaler Link fehlgeschlagen"
        exit 1
    fi
    
    # Installiere in n8n custom nodes Verzeichnis
    echo "📁 Installiere in n8n nodes Verzeichnis..."
    cd /home/node/.n8n/nodes
    
    if npm link n8n-nodes-sevdesk-v2; then
        echo "✅ SevDesk-Node erfolgreich in n8n installiert!"
    else
        echo "❌ Fehler beim Installieren in n8n"
        # Fallback: Kopiere dist Verzeichnis direkt
        echo "🔄 Versuche direktes Kopieren..."
        if [ -d "$SEVDESK_NODE_PATH/dist" ]; then
            cp -r "$SEVDESK_NODE_PATH/dist" "/home/node/.n8n/nodes/n8n-nodes-sevdesk-v2"
            echo "✅ SevDesk-Node direkt kopiert"
        else
            echo "❌ Kein dist Verzeichnis gefunden"
            exit 1
        fi
    fi
    
    # Erstelle/Aktualisiere package.json im nodes Verzeichnis
    echo "📝 Aktualisiere nodes package.json..."
    cat > /home/node/.n8n/nodes/package.json << EOF
{
  "name": "installed-nodes",
  "private": true,
  "dependencies": {
    "n8n-nodes-sevdesk-v2": "file:$SEVDESK_NODE_PATH"
  }
}
EOF

else
    echo "ℹ️  Lokaler SevDesk-Node nicht gefunden oder deaktiviert"
fi

# Aktualisiere package.json im nodes Verzeichnis (falls noch nicht vorhanden)
echo "📝 Stelle sicher, dass package.json existiert..."
cd /home/node/.n8n/nodes

# Erstelle package.json falls nicht vorhanden
if [ ! -f "package.json" ]; then
    cat > package.json << EOF
{
  "name": "installed-nodes",
  "private": true,
  "dependencies": {}
}
EOF
fi

# Setze korrekte Berechtigungen
echo "🔐 Setze Berechtigungen..."
chown -R node:node /home/node/.n8n
chmod -R 755 /home/node/.n8n

echo "🎉 Installation abgeschlossen!"
echo "ℹ️  Installierte Community Packages:"
npm list -g --depth=0 | grep n8n-nodes || echo "Keine globalen n8n-nodes gefunden"

echo "ℹ️  Lokale Packages in /home/node/.n8n/nodes:"
cd /home/node/.n8n/nodes && npm list --depth=0 2>/dev/null || echo "Keine lokalen Packages gefunden"

echo "ℹ️  SevDesk-Node Status:"
if [ -d "/home/node/.n8n/nodes/n8n-nodes-sevdesk-v2" ] || npm list n8n-nodes-sevdesk-v2 >/dev/null 2>&1; then
    echo "✅ SevDesk-Node ist verfügbar"
else
    echo "❌ SevDesk-Node nicht gefunden"
fi 