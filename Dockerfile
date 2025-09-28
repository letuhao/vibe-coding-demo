# Multi-stage Dockerfile for Production
# Generated: 2024-01-15
# Author: Vibe Coding Demo

# Stage 1: Build Frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY apps/frontend/package*.json ./
RUN npm ci --only=production
COPY apps/frontend/ ./
RUN npm run build

# Stage 2: Build Backend
FROM node:18-alpine AS backend-builder
WORKDIR /app/backend
COPY apps/backend/package*.json ./
RUN npm ci --only=production
COPY apps/backend/ ./
RUN npm run build

# Stage 3: Production Runtime
FROM node:18-alpine AS production
WORKDIR /app

# Install PM2 globally
RUN npm install -g pm2

# Copy built applications
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist
COPY --from=backend-builder /app/backend/dist ./backend/dist
COPY --from=backend-builder /app/backend/node_modules ./backend/node_modules
COPY --from=backend-builder /app/backend/package*.json ./backend/

# Copy PM2 configuration
COPY ecosystem.config.js ./

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nestjs -u 1001
RUN chown -R nestjs:nodejs /app
USER nestjs

# Expose ports
EXPOSE 3000 5173

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/health || exit 1

# Start application
CMD ["pm2-runtime", "start", "ecosystem.config.js"]
