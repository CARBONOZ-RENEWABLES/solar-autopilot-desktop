#!/bin/bash

echo "🌞 Starting CARBONOZ SolarAutopilot Application..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose &> /dev/null; then
    echo "❌ docker-compose not found. Please install docker-compose."
    exit 1
fi

# Create necessary directories
mkdir -p logs data nginx/ssl

# Set permissions
chmod +x start.sh

echo "🚀 Building and starting services..."

# Build and start all services
docker-compose up --build -d

echo "⏳ Waiting for services to start..."
sleep 30

# Check service status
echo "📊 Service Status:"
docker-compose ps

echo ""
echo "✅ SolarAutopilot Application Started!"
echo ""
echo "🌐 Access URLs:"
echo "   Frontend:  http://localhost"
echo "   Backend:   http://localhost/api"
echo "   Grafana:   http://localhost/grafana (admin/solarautopilot123)"
echo "   InfluxDB:  http://localhost:8086"
echo ""
echo "📝 To view logs: docker-compose logs -f [service_name]"
echo "🛑 To stop: docker-compose down"
echo "🔄 To restart: docker-compose restart"