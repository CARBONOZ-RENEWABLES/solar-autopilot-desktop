#!/bin/sh
set -e

echo "🚀 Starting CARBONOZ SolarAutopilot..."

# Check if Docker socket is available
if [ -S /var/run/docker.sock ]; then
    echo "🐳 Docker socket detected, starting services..."
    
    # Create network if it doesn't exist
    docker network create solarautopilot-network 2>/dev/null || true
    
    # Connect this container to the network
    CONTAINER_ID=$(hostname)
    docker network connect solarautopilot-network $CONTAINER_ID 2>/dev/null || true
    
    # Start or restart InfluxDB
    if docker ps -a | grep -q carbonoz-influxdb; then
        echo "📊 Starting InfluxDB..."
        docker start carbonoz-influxdb || echo "⚠️  Failed to start InfluxDB"
    else
        echo "📊 Creating InfluxDB..."
        docker run -d --name carbonoz-influxdb \
            --network solarautopilot-network \
            -e INFLUXDB_DB=solarautopilot \
            -e INFLUXDB_HTTP_AUTH_ENABLED=false \
            -v solarautopilot-influxdb-data:/var/lib/influxdb \
            --restart unless-stopped \
            influxdb:1.8-alpine
    fi
    echo "⏳ Waiting for InfluxDB..."
    sleep 5
    
    # Start or restart Grafana
    if docker ps -a | grep -q carbonoz-grafana; then
        echo "📈 Starting Grafana..."
        docker start carbonoz-grafana || echo "⚠️  Failed to start Grafana"
    else
        echo "📈 Creating Grafana..."
        docker run -d --name carbonoz-grafana \
            --network solarautopilot-network \
            -e GF_SECURITY_ADMIN_PASSWORD=admin \
            -e GF_AUTH_ANONYMOUS_ENABLED=true \
            -e GF_AUTH_ANONYMOUS_ORG_ROLE=Admin \
            -e GF_AUTH_BASIC_ENABLED=false \
            -e GF_AUTH_DISABLE_LOGIN_FORM=true \
            -e GF_SECURITY_ALLOW_EMBEDDING=true \
            -v solarautopilot-grafana-data:/var/lib/grafana \
            --restart unless-stopped \
            grafana/grafana:latest
    fi
    
    echo "🔧 Configuring Grafana datasource..."
    # Update datasource config for Docker network
    cat > /tmp/influxdb.yml <<'EOF'
apiVersion: 1
datasources:
  - name: InfluxDB
    type: influxdb
    access: proxy
    url: http://carbonoz-influxdb:8086
    database: 'solarautopilot'
    jsonData:
      httpMode: GET
      timeInterval: "1s"
EOF
    docker cp /tmp/influxdb.yml carbonoz-grafana:/etc/grafana/provisioning/datasources/influxdb.yml 2>/dev/null
    docker cp /app/grafana/provisioning/dashboards carbonoz-grafana:/etc/grafana/provisioning/ 2>/dev/null
    # Also update the source file for Docker
    cp /tmp/influxdb.yml /app/grafana/provisioning/datasources/influxdb.yml 2>/dev/null || true
    docker restart carbonoz-grafana >/dev/null 2>&1
    echo "✓ Grafana configured"
    echo "⏳ Waiting for Grafana..."
    sleep 8
    
    echo "✅ All services started"
else
    echo "⚠️  Docker socket not available, using external services"
fi

echo "🎯 Starting SolarAutopilot application..."
# Set environment and start Node.js
export INFLUXDB_HOST=carbonoz-influxdb
export INFLUXDB_PORT=8086
export NODE_ENV=production
cd /app
exec node server.js
