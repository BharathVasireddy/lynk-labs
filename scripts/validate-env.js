#!/usr/bin/env node

/**
 * Environment Variable Validation Script
 * Run this script to validate your environment configuration
 * 
 * Usage:
 *   node scripts/validate-env.js
 *   npm run validate-env
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🔍 Lynk Labs - Environment Validation Script');
console.log('='.repeat(50));

try {
  // Load environment variables
  console.log('📁 Loading environment variables...');
  
  // Check if .env.local exists
  const fs = require('fs');
  const envPath = path.join(process.cwd(), '.env.local');
  
  if (!fs.existsSync(envPath)) {
    console.warn('⚠️  .env.local file not found. Using system environment variables only.');
    console.log('💡 Create .env.local file based on env.example for local development.');
  } else {
    console.log('✅ Found .env.local file');
    
    // Load .env.local
    require('dotenv').config({ path: envPath });
  }

  console.log('\n🧪 Running validation...\n');

  // Run the validation using Node.js to import our TypeScript validation
  const validationScript = `
    const { validateEnvironmentVariables, logValidationResults } = require('${path.join(process.cwd(), 'src/lib/env-validation.ts')}');
    
    try {
      const result = validateEnvironmentVariables();
      logValidationResults(result);
      
      if (!result.isValid) {
        process.exit(1);
      }
    } catch (error) {
      console.error('Validation script error:', error);
      process.exit(1);
    }
  `;

  // Use ts-node to run TypeScript validation
  try {
    execSync(`npx ts-node -e "${validationScript}"`, { 
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    console.log('\n✅ Environment validation completed successfully!');
    console.log('🚀 Your application should start without environment issues.');
    
  } catch (error) {
    console.error('\n❌ Validation failed. Please fix the issues above.');
    process.exit(1);
  }

} catch (error) {
  console.error('💥 Script execution failed:', error.message);
  console.log('\n📋 Manual validation checklist:');
  console.log('  1. Copy env.example to .env.local');
  console.log('  2. Fill in all required environment variables');
  console.log('  3. Ensure NEXTAUTH_SECRET is at least 32 characters');
  console.log('  4. Use proper DATABASE_URL format');
  console.log('  5. Validate all URLs start with http:// or https://');
  
  process.exit(1);
} 