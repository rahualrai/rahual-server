# Academic Website

This directory contains all files and scripts for Rahual Rai's academic website.

## Directory Structure

```
academic-website/
├── academic-site-static/     # Source files (edit content here)
├── academic-site-build/      # Build output (generated)
├── build-academic-site.sh    # Build script
├── deploy-academic-site.sh   # Deploy script
├── ACADEMIC-WEBSITE.md       # Full documentation
└── README.md                 # This file
```

## Quick Start

```bash
cd academic-website/

# Build the website
./build-academic-site.sh

# Deploy to production
./deploy-academic-site.sh

# Or build and deploy in one step
./build-academic-site.sh deploy
```

## Editing Content

1. Edit files in `academic-site-static/`
2. Run `./build-academic-site.sh`  
3. Run `./deploy-academic-site.sh`

## Full Documentation

See `ACADEMIC-WEBSITE.md` for complete documentation including:
- Content management guide
- SEO and analytics setup  
- Performance optimization
- Troubleshooting
- Security best practices

## Live Site

- Local: http://localhost:3000
- Production: https://rahual.com