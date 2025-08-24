# Rahual Server Infrastructure

Personal server infrastructure configuration and code history for a self-hosted home lab environment.

## Repository Contents

This repository contains Docker Compose configurations and related files for managing containerized services including web hosting, password management, file sharing, monitoring, and productivity applications.

### Services Configuration
- **Web Server** - Caddy static file server
- **Vaultwarden** - Self-hosted password manager
- **Portainer** - Docker container management interface
- **FileBrowser** - File management and sharing
- **Immich** - Photo management with machine learning features
- **Grafana** - Data visualization and monitoring dashboards
- **Prometheus** - Metrics collection system
- **cAdvisor** - Container resource monitoring
- **Node Exporter** - System metrics collection
- **N8N** - Workflow automation platform
- **Mealie** - Recipe management system
- **Watchtower** - Automated container updates

### Key Files
- `docker-compose.yml` - Main service orchestration configuration
- `Caddyfile` - Web server configuration
- `prometheus.yml` - Monitoring system configuration
- `example.env` - Environment variable template
- `site/` - Static website files
- Various data directories for persistent storage

### External Access
Services are made available externally through Cloudflare Tunnel with custom domain mappings.

## Purpose

This repository serves as version control for personal infrastructure configurations and maintains a history of changes to the home lab setup.