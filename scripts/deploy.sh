#!/bin/bash

# Production Deployment Script
# Generated: 2024-01-15
# Author: Vibe Coding Demo

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="expense-manager"
DOCKER_COMPOSE_FILE="docker-compose.prod.yml"
ENV_FILE=".env.production"

echo -e "${GREEN}🚀 Starting deployment of $APP_NAME...${NC}"

# Check if .env.production exists
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Error: $ENV_FILE not found!${NC}"
    echo -e "${YELLOW}Please create $ENV_FILE with production environment variables.${NC}"
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Error: Docker is not running!${NC}"
    exit 1
fi

# Check if Docker Compose is available
if ! command -v docker-compose &> /dev/null; then
    echo -e "${RED}❌ Error: Docker Compose is not installed!${NC}"
    exit 1
fi

# Create necessary directories
echo -e "${YELLOW}📁 Creating necessary directories...${NC}"
mkdir -p logs
mkdir -p uploads
mkdir -p nginx/ssl

# Stop existing containers
echo -e "${YELLOW}🛑 Stopping existing containers...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE down --remove-orphans || true

# Build and start services
echo -e "${YELLOW}🔨 Building and starting services...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE up --build -d

# Wait for services to be ready
echo -e "${YELLOW}⏳ Waiting for services to be ready...${NC}"
sleep 30

# Check service health
echo -e "${YELLOW}🏥 Checking service health...${NC}"

# Check database
if docker-compose -f $DOCKER_COMPOSE_FILE exec -T postgres pg_isready -U expense_user -d expense_manager_prod > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Database is ready${NC}"
else
    echo -e "${RED}❌ Database is not ready${NC}"
    exit 1
fi

# Check Redis
if docker-compose -f $DOCKER_COMPOSE_FILE exec -T redis redis-cli ping > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Redis is ready${NC}"
else
    echo -e "${RED}❌ Redis is not ready${NC}"
    exit 1
fi

# Check backend API
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Backend API is ready${NC}"
else
    echo -e "${RED}❌ Backend API is not ready${NC}"
    exit 1
fi

# Check frontend
if curl -f http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Frontend is ready${NC}"
else
    echo -e "${RED}❌ Frontend is not ready${NC}"
    exit 1
fi

# Run database migrations
echo -e "${YELLOW}🗄️ Running database migrations...${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE exec -T app npx prisma migrate deploy

# Show service status
echo -e "${YELLOW}📊 Service status:${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE ps

echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${GREEN}🌐 Frontend: http://localhost:5173${NC}"
echo -e "${GREEN}🔧 Backend API: http://localhost:3000${NC}"
echo -e "${GREEN}📊 Health Check: http://localhost:3000/health${NC}"

# Show logs
echo -e "${YELLOW}📝 Recent logs:${NC}"
docker-compose -f $DOCKER_COMPOSE_FILE logs --tail=20
