#!/bin/bash

echo "🔧 Fixing Grafana connectivity issue..."

# Stop and remove existing Grafana container
echo "🛑 Stopping existing Grafana container..."
docker stop carbonoz-grafana 2>/dev/null || true
docker rm carbonoz-grafana 2>/dev/null || true

# Recreate Grafana with proper port mapping
echo "📈 Creating Grafana with port 3001 exposed..."
docker run -d --name carbonoz-grafana \
    --network solarautopilot-network \
    -p 3001:3000 \
    -e GF_SECURITY_ADMIN_PASSWORD=admin \
    -e GF_AUTH_ANONYMOUS_ENABLED=true \
    -e GF_AUTH_ANONYMOUS_ORG_ROLE=Admin \
    -e GF_AUTH_BASIC_ENABLED=false \
    -e GF_AUTH_DISABLE_LOGIN_FORM=true \
    -e GF_SECURITY_ALLOW_EMBEDDING=true \
    -v solarautopilot-grafana-data:/var/lib/grafana \
    --restart unless-stopped \
    grafana/grafana:latest

echo "⏳ Waiting for Grafana to start..."
sleep 10

# Configure datasource
echo "🔧 Configuring Grafana datasource..."
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

docker cp /tmp/influxdb.yml carbonoz-grafana:/etc/grafana/provisioning/datasources/influxdb.yml
docker restart carbonoz-grafana

echo "⏳ Waiting for Grafana to restart..."
sleep 8

echo "✅ Grafana is now accessible at http://localhost:3001"
echo "🎯 Test it: curl http://localhost:3001/api/health"

# Test connection
curl -s http://localhost:3001/api/health && echo "✅ Grafana is responding!" || echo "❌ Grafana is not responding yet, wait a few more seconds"
