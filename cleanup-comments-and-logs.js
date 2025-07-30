#!/usr/bin/env node

// Simple Comment and Log Cleanup Script
// 
// Uses regex to remove:
// - Multi-line comments: /* ... */
// - Single-line comments: // ... (only when // is at the start of the line)
// - Console logs: console.* (entire line)

const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
  extensions: ['.ts', '.tsx', '.js', '.jsx'],
  skipDirs: ['node_modules', 'dist', 'build', '.next', '.git', 'coverage'],
  createBackups: false,
  dryRun: false
};

class SimpleCleanup {
  constructor(config = {}) {
    this.config = { ...CONFIG, ...config };
    this.stats = {
      filesProcessed: 0,
      linesRemoved: 0,
      errors: 0
    };
  }

  shouldSkipDirectory(dirPath) {
    const dirName = path.basename(dirPath);
    return this.config.skipDirs.some(skip => dirName.includes(skip));
  }

  shouldSkipFile(filePath) {
    const ext = path.extname(filePath);
    return !this.config.extensions.includes(ext);
  }

  processFile(filePath) {
    try {
      console.log(`Processing: ${path.relative(process.cwd(), filePath)}`);
      
      const originalContent = fs.readFileSync(filePath, 'utf8');
      let content = originalContent;
      let removedLines = 0;
      
      // Remove multi-line comments /* ... */
      const beforeMultiLine = content.split('\n').length;
      content = content.replace(/\/\*[\s\S]*?\*\//g, '');
      const afterMultiLine = content.split('\n').length;
      removedLines += beforeMultiLine - afterMultiLine;
      
      // Remove lines with single-line comments // (only if // is at the start of the line)
      const lines = content.split('\n');
      const filteredLines = lines.filter(line => {
        const trimmed = line.trim();
        if (trimmed.startsWith('//')) {
          removedLines++;
          return false;
        }
        return true;
      });
      content = filteredLines.join('\n');
      
      // Remove lines with console.*
      const consoleLinesFiltered = content.split('\n').filter(line => {
        const trimmed = line.trim();
        if (/console\.\w+/.test(trimmed)) {
          removedLines++;
          return false;
        }
        return true;
      });
      content = consoleLinesFiltered.join('\n');
      
      // Clean up excessive blank lines
      content = content.replace(/\n{3,}/g, '\n\n');
      
      // Update stats
      this.stats.linesRemoved += removedLines;
      
      // Check if file was modified
      if (content !== originalContent) {
        if (!this.config.dryRun) {
          fs.writeFileSync(filePath, content, 'utf8');
          console.log(`  ✓ Modified (${removedLines} lines removed)`);
        } else {
          console.log(`  ✓ Would be modified (${removedLines} lines would be removed)`);
        }
      } else {
        console.log(`  - No changes needed`);
      }
      
      this.stats.filesProcessed++;
      
    } catch (error) {
      console.error(`  ✗ Error processing ${filePath}: ${error.message}`);
      this.stats.errors++;
    }
  }

  processDirectory(dirPath) {
    try {
      const entries = fs.readdirSync(dirPath);
      
      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          if (!this.shouldSkipDirectory(fullPath)) {
            this.processDirectory(fullPath);
          }
        } else if (stat.isFile()) {
          if (!this.shouldSkipFile(fullPath)) {
            this.processFile(fullPath);
          }
        }
      }
    } catch (error) {
      console.error(`Error processing directory ${dirPath}: ${error.message}`);
      this.stats.errors++;
    }
  }

  cleanup(targetPath = '.') {
    console.log('🧹 Starting simple comment and log cleanup...\n');
    
    if (this.config.dryRun) {
      console.log('🔍 DRY RUN MODE - No files will be modified\n');
    }
    
    console.log('Will remove:');
    console.log('  - Multi-line comments: /* ... */');
    console.log('  - Lines with single-line comments starting with: // ...');
    console.log('  - Lines with console statements: console.*');
    console.log('');
    console.log('Will preserve:');
    console.log('  - URLs and inline comments (where // is not at line start)');
    console.log('');
    
    const startTime = Date.now();
    
    const stat = fs.statSync(targetPath);
    if (stat.isDirectory()) {
      this.processDirectory(targetPath);
    } else {
      this.processFile(targetPath);
    }
    
    const endTime = Date.now();
    
    console.log('\n📊 Cleanup Summary:');
    console.log(`  Files processed: ${this.stats.filesProcessed}`);
    console.log(`  Lines removed: ${this.stats.linesRemoved}`);
    console.log(`  Errors: ${this.stats.errors}`);
    console.log(`  Time taken: ${(endTime - startTime) / 1000}s`);
  }
}

// CLI Usage
if (require.main === module) {
  const args = process.argv.slice(2);
  const options = {};
  
  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dry-run':
        options.dryRun = true;
        break;
      case '--help':
        console.log(`
Simple Comment and Log Cleanup Script

Usage: node cleanup-comments-and-logs.js [options] [path]

Options:
  --dry-run       Show what would be changed without modifying files
  --help          Show this help message

What it removes:
  - Multi-line comments: /* ... */
  - Lines where // appears at the start (preserves URLs and inline comments)
  - Lines containing console statements: console.*

Examples:
  node cleanup-comments-and-logs.js --dry-run          # Test run
  node cleanup-comments-and-logs.js apps/pwa/src       # Clean specific directory
        `);
        process.exit(0);
    }
  }
  
  const targetPath = args.find(arg => !arg.startsWith('--')) || '.';
  
  const cleanup = new SimpleCleanup(options);
  cleanup.cleanup(targetPath);
}

module.exports = SimpleCleanup;