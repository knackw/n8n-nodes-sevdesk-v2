#!/bin/bash

# Test script for SevDesk-Node Docker installation
# Checks if the Node is correctly installed

echo "🧪 SevDesk-Node Docker Test"
echo "=========================="

# Check if Docker is running
if ! docker --version > /dev/null 2>&1; then
    echo "❌ Docker is not installed or not running"
    exit 1
fi

echo "✅ Docker is available"

# Check if docker-compose is available
if ! docker-compose --version > /dev/null 2>&1; then
    echo "❌ docker-compose is not installed"
    exit 1
fi

echo "✅ docker-compose is available"

# Check necessary files
if [ ! -f "docker-compose.yml" ]; then
    echo "❌ docker-compose.yml not found"
    exit 1
fi

if [ ! -f "install-packages.sh" ]; then
    echo "❌ install-packages.sh not found"
    exit 1
fi

if [ ! -f "package.json" ]; then
    echo "❌ package.json not found"
    exit 1
fi

echo "✅ All necessary files present"

# Start container
echo "🚀 Starting Docker container..."
docker-compose up -d

if [ $? -ne 0 ]; then
    echo "❌ Error starting container"
    exit 1
fi

echo "✅ Container started"

# Wait for initialization
echo "⏳ Waiting for container initialization (30 seconds)..."
sleep 30

# Check if container is running
if ! docker-compose ps | grep -q "Up"; then
    echo "❌ Container is not running"
    docker-compose logs
    exit 1
fi

echo "✅ Container is running"

# Check n8n reachability
echo "🌐 Checking n8n reachability..."
if curl -s http://localhost:5678 > /dev/null; then
    echo "✅ n8n is reachable at http://localhost:5678"
else
    echo "❌ n8n is not reachable"
    echo "📋 Container logs:"
    docker-compose logs --tail=20
    exit 1
fi

# Check SevDesk-Node installation
echo "🔍 Checking SevDesk-Node installation..."
if docker-compose exec -T n8n sh -c "ls /home/node/.n8n/nodes/ | grep sevdesk" > /dev/null 2>&1; then
    echo "✅ SevDesk-Node is installed"
else
    echo "❌ SevDesk-Node not found"
    echo "📋 Available nodes:"
    docker-compose exec -T n8n sh -c "ls -la /home/node/.n8n/nodes/"
fi

# Check npm link
echo "🔗 Checking npm link..."
if docker-compose exec -T n8n sh -c "npm list -g n8n-nodes-sevdesk-v2" > /dev/null 2>&1; then
    echo "✅ SevDesk-Node is globally linked"
else
    echo "⚠️  SevDesk-Node not globally linked (possibly normal)"
fi

echo ""
echo "🎉 Test completed!"
echo ""
echo "📋 Next steps:"
echo "1. Open http://localhost:5678 in your browser"
echo "2. Create a new workflow"
echo "3. Search for 'SevDesk' in the node list"
echo "4. If the node is not visible, run: docker-compose restart"
echo ""
echo "🛠️  Debugging commands:"
echo "   docker-compose logs -f     # Show logs"
echo "   docker-compose ps          # Container status"
echo "   docker-compose restart     # Restart container"
echo "   docker-compose down        # Stop container" 