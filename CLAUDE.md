# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Overview

This is a self-hosted infrastructure stack for home lab services. The repository contains Docker Compose configurations and related files for running multiple containerized services including photo management, password management, file sharing, monitoring, and other productivity tools.

## Architecture

### Core Services Stack

The main stack is orchestrated via `docker-compose.yml` and includes:

**Web & Reverse Proxy:**
- Caddy (`web` service) - Web server serving static content from `./site` on port 3000, with clean URL rewriting for HTML files

**Infrastructure Services:**
- Vaultwarden - Password manager (port 3010)
- Portainer - Docker management UI (port 9000)
- Watchtower - Automatic container updates (daily schedule)
- FileBrowser - File management interface (port 8082)

**Monitoring Stack:**
- Grafana - Visualization dashboard (port 3001)
- Prometheus - Metrics collection (port 9090) 
- cAdvisor - Container metrics (port 8085)
- Node Exporter - System metrics (port 9100)

**Photo Management (Immich):**
- Immich Server - Photo management API (port 2283)
- Immich Machine Learning - AI processing for photos
- Redis (Valkey) - Caching layer
- PostgreSQL - Database with vector extensions

**Productivity Apps:**
- N8N - Workflow automation (port 5678)
- Mealie - Recipe management (port 9925) with dedicated PostgreSQL

### Separate Immich Stack

There's a standalone Immich deployment in `./immich/docker-compose.yml` following the official Immich installation pattern. This appears to be a reference/backup configuration.

### Configuration Management

**Environment Variables:**
- `.env` - Main environment file (not in repo)
- `example.env` - Template showing required variables for all services
- `immich/.env` - Immich-specific environment variables

**Service Configurations:**
- `prometheus.yml` - Prometheus scraping configuration for cAdvisor, node-exporter, and rpi-exporter
- `Caddyfile` - Web server configuration with clean URL rewriting and proper file serving
- `site/` - Static website files including modern academic website with component architecture

## Common Development Commands

### Service Management
```bash
# Start all services
docker-compose up -d

# Start specific service
docker-compose up -d [service-name]

# Stop all services
docker-compose down

# View logs
docker-compose logs [service-name]

# Restart service
docker-compose restart [service-name]

# Pull latest images
docker-compose pull
```

### Monitoring and Debugging
```bash
# Check service status
docker-compose ps

# View resource usage
docker stats

# Access container shell
docker-compose exec [service-name] /bin/bash

# View container logs in real-time
docker-compose logs -f [service-name]
```

### Backup and Maintenance
```bash
# Backup Immich database (automated daily at 2 AM)
# Backups stored in ./immich/backups/

# View Watchtower logs for auto-updates
docker-compose logs watchtower

# Manual image updates
docker-compose pull && docker-compose up -d
```

## Data Persistence

**Volume Mappings:**
- `./vaultwarden-data` - Vaultwarden database and attachments
- `./portainer-data` - Portainer configuration
- `./grafana` - Grafana configuration and dashboards
- `./files` - FileBrowser shared files
- `./immich-data/uploads` - Immich photo storage
- `./postgres` - Immich PostgreSQL data
- `./n8n-data` - N8N workflows and configuration
- `./mealie/` - Mealie recipes and data

## Port Allocation

| Service | Port | Purpose |
|---------|------|---------|
| Caddy Web | 3000 | Static website |
| Grafana | 3001 | Monitoring dashboards |
| Vaultwarden | 3010 | Password manager |
| FileBrowser | 8082 | File management |
| cAdvisor | 8085 | Container metrics |
| Portainer | 9000 | Docker management |
| Prometheus | 9090 | Metrics database |
| Node Exporter | 9100 | System metrics |
| Immich | 2283 | Photo management |
| N8N | 5678 | Workflow automation |
| Mealie | 9925 | Recipe management |

## Security Considerations

- All services requiring authentication use environment variables for credentials
- Vaultwarden has signups disabled and uses admin tokens
- Services are configured with restart policies for reliability
- Sensitive data (API keys, passwords) should never be committed to the repository
- Use the `example.env` template to create your local `.env` file

## Cloudflare Tunnel Configuration

The server uses Cloudflare Tunnel for secure external access to services. Configuration is managed outside the Docker stack:

**Tunnel Configuration:**
- Config file: `/etc/cloudflared/config.yml`
- Tunnel ID: `04f8d702-9a4a-4c95-b3c8-0cec50d844c7`
- Credentials: `/etc/cloudflared/site-tunnel.json`

**Domain Mappings:**
- `port.rahual.com` → Portainer (localhost:9000)
- `hi.rahual.com` → Main site (localhost:3000)
- `vault.rahual.com` → Vaultwarden (localhost:3010)
- `files.rahual.com` → FileBrowser (localhost:8082)
- `dash.rahual.com` → Grafana (localhost:3001)
- `photos.rahual.com` → Immich (localhost:2283)
- `n8n.rahual.com` → N8N (localhost:5678)
- `meal.rahual.com` → Mealie (localhost:9925)

**Cloudflared Service Management:**
```bash
# Check tunnel status
sudo systemctl status cloudflared

# Start/stop/restart tunnel
sudo systemctl start cloudflared
sudo systemctl stop cloudflared
sudo systemctl restart cloudflared

# View tunnel logs
sudo journalctl -u cloudflared -f

# Enable/disable auto-start
sudo systemctl enable cloudflared
sudo systemctl disable cloudflared
```

## Development Notes

- This is primarily a configuration-driven infrastructure repository
- No traditional build processes or package management
- Changes typically involve updating service configurations or Docker Compose definitions
- Test configuration changes in development environment before production deployment
- Monitor resource usage as this stack can be resource-intensive with all services running
- Cloudflare Tunnel provides secure external access without exposing local ports directly

## Git Configuration

Git is configured with credential storage for seamless authentication:
- Credentials stored in `~/.git-credentials` 
- Global user configuration set for the repository
- Automatic authentication for push/pull operations

## Recent Infrastructure Changes

- **Mailcow Removal**: All mail services (mailserver, roundcube, mailcow-mysql, mailcow-redis) have been completely removed
- **Website Upgrade**: Site upgraded from simple HTML to modern academic website with component architecture
- **Docker Cleanup**: Regular cleanup maintains optimal resource usage (~3.2GB reclaimed)
- **Configuration Updates**: Caddyfile enhanced with clean URL rewriting, gitignore updated for current services