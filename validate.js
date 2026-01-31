#!/usr/bin/env node

/**
 * Project Validation Script
 * Verifies that all required files are in place and correctly configured
 */

const fs = require('fs');
const path = require('path');

const REQUIRED_FILES = [
  // Root configuration
  'package.json',
  'hardhat.config.js',
  '.env.example',
  '.gitignore',
  'Dockerfile',
  'docker-compose.yml',
  'README.md',
  'DEPLOYMENT.md',
  'QUICKSTART.md',
  
  // Smart contract
  'contracts/MyNFT.sol',
  
  // Scripts
  'scripts/deploy.js',
  'scripts/generate-merkle.js',
  
  // Tests
  'test/MyNFT.test.js',
  
  // Allowlist
  'allowlist.json',
  
  // Frontend - Config
  'frontend/package.json',
  'frontend/next.config.js',
  'frontend/tsconfig.json',
  'frontend/tailwind.config.js',
  'frontend/postcss.config.js',
  
  // Frontend - Pages
  'frontend/pages/_app.tsx',
  'frontend/pages/index.tsx',
  'frontend/pages/_document.tsx',
  
  // Frontend - Components
  'frontend/components/WalletButton.tsx',
  'frontend/components/MintingComponent.tsx',
  'frontend/components/StatsDisplay.tsx',
  
  // Frontend - Context
  'frontend/context/WalletContext.tsx',
  'frontend/context/ContractContext.tsx',
  
  // Frontend - Styles
  'frontend/styles/globals.css',
  
  // Frontend - Public
  'frontend/public/contracts/MyNFT.json',
];

const projectRoot = process.cwd();

console.log('🔍 Validating NFT Launchpad Project Structure...\n');

let missingFiles = [];
let foundFiles = [];

REQUIRED_FILES.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    foundFiles.push(file);
    console.log(`✓ ${file}`);
  } else {
    missingFiles.push(file);
    console.log(`✗ ${file} (MISSING)`);
  }
});

console.log('\n' + '='.repeat(50));
console.log(`\nResults: ${foundFiles.length}/${REQUIRED_FILES.length} files found`);

if (missingFiles.length === 0) {
  console.log('\n✅ Project structure is valid!\n');
  process.exit(0);
} else {
  console.log(`\n⚠️  Missing ${missingFiles.length} file(s):\n`);
  missingFiles.forEach(file => {
    console.log(`  - ${file}`);
  });
  console.log('\n');
  process.exit(1);
}
