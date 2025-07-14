#!/bin/bash

# Script for automatic installation of n8n Community Packages and local Nodes
# Executed when Docker Container starts

echo "🚀 n8n Community Package & Local Node Installer started..."

# Create necessary directories
mkdir -p /home/node/.n8n/nodes
mkdir -p /home/node/.n8n/custom

# Default Community Packages to be installed
DEFAULT_PACKAGES="n8n-nodes-base,n8n-nodes-advanced-flow-blocks,n8n-nodes-puppeteer,n8n-nodes-firecrawl,n8n-nodes-elevenlabs,@brave/n8n-nodes-brave-search"

# Use N8N_COMMUNITY_PACKAGES if set, otherwise DEFAULT_PACKAGES
PACKAGES_TO_INSTALL="${N8N_COMMUNITY_PACKAGES:-$DEFAULT_PACKAGES}"

echo "📦 Installing Community Packages: $PACKAGES_TO_INSTALL"

# Install each package individually
IFS=',' read -ra PACKAGES <<< "$PACKAGES_TO_INSTALL"
for package in "${PACKAGES[@]}"; do
    # Remove whitespace
    package=$(echo "$package" | xargs)
    
    if [ ! -z "$package" ]; then
        echo "🔧 Installing: $package"
        
        # Try global installation
        if npm install -g "$package" --no-fund --no-audit; then
            echo "✅ $package successfully installed"
        else
            echo "❌ Error installing $package"
            
            # Fallback: Try local installation in nodes directory
            echo "🔄 Trying local installation..."
            cd /home/node/.n8n/nodes
            if npm install "$package" --no-fund --no-audit; then
                echo "✅ $package locally installed"
            else
                echo "❌ Local installation also failed for $package"
            fi
        fi
    fi
done

# Installation of local SevDesk-Node
echo "🔧 Installing local SevDesk-Node..."

if [ "$INSTALL_LOCAL_SEVDESK_NODE" = "true" ] && [ -d "$SEVDESK_NODE_PATH" ]; then
    echo "📂 Found: $SEVDESK_NODE_PATH"
    
    # Change to SevDesk-Node directory
    cd "$SEVDESK_NODE_PATH"
    
    # Check if package.json exists
    if [ ! -f "package.json" ]; then
        echo "❌ No package.json found in $SEVDESK_NODE_PATH"
        exit 1
    fi
    
    echo "📥 Installing Node Dependencies..."
    if npm install --no-fund --no-audit; then
        echo "✅ Dependencies installed"
    else
        echo "❌ Error installing dependencies"
        exit 1
    fi
    
    echo "🔨 Compiling SevDesk-Node..."
    if npm run build; then
        echo "✅ Build successful"
    else
        echo "❌ Build failed"
        exit 1
    fi
    
    echo "🔗 Linking SevDesk-Node globally..."
    if npm link; then
        echo "✅ Global link created"
    else
        echo "❌ Global link failed"
        exit 1
    fi
    
    # Install in n8n custom nodes directory
    echo "📁 Installing in n8n nodes directory..."
    cd /home/node/.n8n/nodes
    
    if npm link n8n-nodes-sevdesk-v2; then
        echo "✅ SevDesk-Node successfully installed in n8n!"
    else
        echo "❌ Error installing in n8n"
        # Fallback: Copy dist directory directly
        echo "🔄 Trying direct copy..."
        if [ -d "$SEVDESK_NODE_PATH/dist" ]; then
            cp -r "$SEVDESK_NODE_PATH/dist" "/home/node/.n8n/nodes/n8n-nodes-sevdesk-v2"
            echo "✅ SevDesk-Node copied directly"
        else
            echo "❌ No dist directory found"
            exit 1
        fi
    fi
    
    # Create/Update package.json in nodes directory
    echo "📝 Updating nodes package.json..."
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
    echo "ℹ️  Local SevDesk-Node not found or disabled"
fi

# Update package.json in nodes directory (if not already present)
echo "📝 Ensuring package.json exists..."
cd /home/node/.n8n/nodes

# Create package.json if not present
if [ ! -f "package.json" ]; then
    cat > package.json << EOF
{
  "name": "installed-nodes",
  "private": true,
  "dependencies": {}
}
EOF
fi

# Set correct permissions
echo "🔐 Setting permissions..."
chown -R node:node /home/node/.n8n
chmod -R 755 /home/node/.n8n

echo "🎉 Installation completed!"
echo "ℹ️  Installed Community Packages:"
npm list -g --depth=0 | grep n8n-nodes || echo "No global n8n-nodes found"

echo "ℹ️  Local Packages in /home/node/.n8n/nodes:"
cd /home/node/.n8n/nodes && npm list --depth=0 2>/dev/null || echo "No local packages found"

echo "ℹ️  SevDesk-Node Status:"
if [ -d "/home/node/.n8n/nodes/n8n-nodes-sevdesk-v2" ] || npm list n8n-nodes-sevdesk-v2 >/dev/null 2>&1; then
    echo "✅ SevDesk-Node is available"
else
    echo "❌ SevDesk-Node not found"
fi 