# CARBONOZ SolarAutopilot - Production Docker Image
FROM node:18-alpine

# Install Docker CLI to manage sibling containers
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl \
    docker-cli

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install --production
RUN cd frontend && npm install && cd ..

# Copy application files
COPY . .

# Build frontend
RUN cd frontend && npm run build && cd ..

# Create data directories
RUN mkdir -p /app/data /app/logs /app/data/sessions

# Copy and set permissions for entrypoint
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose ports
EXPOSE 3000 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3000 || exit 1

# Start application with entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"]
