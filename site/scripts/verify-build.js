#!/usr/bin/env node

/**
 * Build verification script for Rahual Rai's academic website
 * Ensures all critical files are generated and meet quality standards
 */

import { existsSync, readFileSync, statSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DIST_DIR = join(__dirname, '../dist');

// Colors for terminal output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const fullPath = join(DIST_DIR, filePath);
  if (existsSync(fullPath)) {
    const stats = statSync(fullPath);
    const sizeKB = (stats.size / 1024).toFixed(2);
    log(`✅ ${description}: ${sizeKB}KB`, 'green');
    return true;
  } else {
    log(`❌ Missing: ${description} (${filePath})`, 'red');
    return false;
  }
}

function checkHTMLContent(filePath, checks) {
  const fullPath = join(DIST_DIR, filePath);
  if (!existsSync(fullPath)) {
    log(`❌ Cannot check content: ${filePath} not found`, 'red');
    return false;
  }
  
  const content = readFileSync(fullPath, 'utf-8');
  let passed = 0;
  let total = checks.length;
  
  for (const check of checks) {
    if (content.includes(check.text)) {
      log(`  ✅ ${check.description}`, 'green');
      passed++;
    } else {
      log(`  ❌ Missing: ${check.description}`, 'red');
    }
  }
  
  return passed === total;
}

async function verifyBuild() {
  log('\n📋 Verifying Academic Website Build', 'blue');
  log('=' .repeat(50), 'blue');
  
  // Check if dist directory exists
  if (!existsSync(DIST_DIR)) {
    log('❌ Build directory not found. Run npm run build first.', 'red');
    process.exit(1);
  }
  
  let errors = 0;
  
  // Critical files check
  log('\n🔍 Checking Critical Files:', 'blue');
  const criticalFiles = [
    ['index.html', 'Main homepage'],
    ['404.html', 'Error page'],
    ['cv.pdf', 'Academic CV'],
    ['sitemap-index.xml', 'Sitemap'],
    ['robots.txt', 'Robots.txt']
  ];
  
  for (const [file, desc] of criticalFiles) {
    if (!checkFile(file, desc)) errors++;
  }
  
  // Content verification
  log('\n📝 Verifying Homepage Content:', 'blue');
  const contentChecks = [
    { text: 'Rahual Rai', description: 'Personal name' },
    { text: 'Howard University', description: 'University affiliation' },
    { text: '4.0 GPA', description: 'Academic achievement' },
    { text: 'Computer Science', description: 'Major field' },
    { text: 'Princeton Alliance', description: 'Research experience' },
    { text: 'rahual.rai@bison.howard.edu', description: 'Contact email' },
    { text: 'schema.org', description: 'Structured data' },
    { text: 'viewport', description: 'Mobile optimization' }
  ];
  
  if (!checkHTMLContent('index.html', contentChecks)) {
    errors++;
  }
  
  // Performance checks
  log('\n⚡ Performance Verification:', 'blue');
  const indexPath = join(DIST_DIR, 'index.html');
  if (existsSync(indexPath)) {
    const htmlContent = readFileSync(indexPath, 'utf-8');
    const htmlSize = Buffer.byteLength(htmlContent, 'utf8');
    const htmlSizeKB = (htmlSize / 1024).toFixed(2);
    
    if (htmlSizeKB < 100) {
      log(`✅ HTML size optimized: ${htmlSizeKB}KB`, 'green');
    } else {
      log(`⚠️  HTML size large: ${htmlSizeKB}KB`, 'yellow');
    }
    
    // Check for performance optimizations
    const perfChecks = [
      { text: 'display=swap', description: 'Font loading optimization' },
      { text: 'preconnect', description: 'DNS prefetching' },
      { text: 'theme-color', description: 'Mobile theming' },
      { text: 'viewport-fit=cover', description: 'Mobile viewport optimization' }
    ];
    
    let perfPassed = 0;
    for (const check of perfChecks) {
      if (htmlContent.includes(check.text)) {
        log(`  ✅ ${check.description}`, 'green');
        perfPassed++;
      } else {
        log(`  ❌ Missing: ${check.description}`, 'red');
      }
    }
    
    if (perfPassed < perfChecks.length) errors++;
  }
  
  // SEO verification
  log('\n🔍 SEO Verification:', 'blue');
  if (existsSync(join(DIST_DIR, 'index.html'))) {
    const htmlContent = readFileSync(join(DIST_DIR, 'index.html'), 'utf-8');
    const seoChecks = [
      { text: 'meta name="description"', description: 'Meta description' },
      { text: 'og:title', description: 'Open Graph title' },
      { text: 'twitter:card', description: 'Twitter card' },
      { text: 'application/ld+json', description: 'Structured data' }
    ];
    
    let seoPassed = 0;
    for (const check of seoChecks) {
      if (htmlContent.includes(check.text)) {
        log(`  ✅ ${check.description}`, 'green');
        seoPassed++;
      } else {
        log(`  ❌ Missing: ${check.description}`, 'red');
      }
    }
    
    if (seoPassed < seoChecks.length) errors++;
  }
  
  // Final summary
  log('\n📊 Build Verification Summary:', 'blue');
  log('=' .repeat(50), 'blue');
  
  if (errors === 0) {
    log('🎉 All checks passed! Website ready for deployment.', 'green');
    log('\n🚀 Next steps:', 'blue');
    log('  • Test on multiple devices and browsers', 'yellow');
    log('  • Run Lighthouse audit for performance', 'yellow');
    log('  • Deploy to production environment', 'yellow');
    process.exit(0);
  } else {
    log(`❌ ${errors} issue(s) found. Please fix before deployment.`, 'red');
    process.exit(1);
  }
}

// Run verification
verifyBuild().catch(console.error);