# CARBONOZ SolarAutopilot - Production Docker Image
FROM node:18-alpine

# Install dependencies
RUN apk add --no-cache \
    python3 \
    make \
    g++ \
    curl \
    nginx

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

# Setup nginx
RUN mkdir -p /etc/nginx/conf.d /var/www/html
RUN cp -r frontend/dist/* /var/www/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Create data directories
RUN mkdir -p /app/data /app/logs

# Create startup script
RUN printf '#!/bin/sh\nnginx -g "daemon off;" &\nnode server.js' > /start.sh && chmod +x /start.sh

# Expose ports
EXPOSE 80 6789

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:80 || exit 1

# Start application
CMD ["/start.sh"]
