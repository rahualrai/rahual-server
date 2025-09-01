#!/bin/bash

# Production deployment script for Rahual Rai's Academic Website
# This script builds the Astro site and deploys it to production

set -e  # Exit on any error

echo "🚀 Starting production deployment for hi.rahual.com"
echo "=================================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "docker-compose.yml" ]; then
    print_error "docker-compose.yml not found. Please run from the rahual-server directory."
    exit 1
fi

if [ ! -d "site" ]; then
    print_error "site directory not found."
    exit 1
fi

print_status "Step 1: Building Astro website..."
cd site

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing npm dependencies..."
    npm install
fi

# Build the site
print_status "Running production build..."
npm run build

# Verify the build
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not found"
    exit 1
fi

print_status "Running build verification..."
npm run verify
if [ $? -ne 0 ]; then
    print_error "Build verification failed. Please fix issues before deployment."
    exit 1
fi

print_success "Build completed and verified successfully"

cd ..

print_status "Step 2: Deploying to production..."

# Check if Docker services are running
if ! docker-compose ps | grep -q "web.*Up"; then
    print_status "Starting web service..."
    docker-compose up -d web
else
    print_status "Restarting web service with new build..."
    docker-compose restart web
fi

# Wait for service to be ready
print_status "Waiting for web service to be ready..."
sleep 3

# Check if service is healthy
if docker-compose ps web | grep -q "Up"; then
    print_success "Web service is running"
else
    print_error "Web service failed to start"
    docker-compose logs web
    exit 1
fi

print_status "Step 3: Verifying deployment..."

# Test local access
if curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 | grep -q "200"; then
    print_success "Local access confirmed (http://localhost:3000)"
else
    print_warning "Local access test failed"
fi

# Check if cloudflared is running for external access
if systemctl is-active --quiet cloudflared; then
    print_success "Cloudflare tunnel is active"
    print_success "Website should be accessible at: https://hi.rahual.com"
else
    print_warning "Cloudflare tunnel is not running"
    print_status "To enable external access, run: sudo systemctl start cloudflared"
fi

print_status "Step 4: Cleanup and final checks..."

# Show disk usage
SITE_SIZE=$(du -sh site/dist 2>/dev/null | cut -f1 || echo "Unknown")
print_status "Built site size: $SITE_SIZE"

# Show running containers
print_status "Current container status:"
docker-compose ps web

echo ""
print_success "🎉 Deployment completed successfully!"
echo "=================================================="
print_status "Your academic website is now live at:"
echo "  • Local: http://localhost:3000"
echo "  • Public: https://hi.rahual.com (via Cloudflare tunnel)"
echo ""
print_status "To update the website in the future:"
echo "  1. Make changes to files in site/"
echo "  2. Run: ./deploy-website.sh"
echo ""
print_status "To view logs: docker-compose logs -f web"
print_status "To stop: docker-compose stop web"