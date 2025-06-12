#!/usr/bin/env node

/**
 * Lynk Labs - Deployment Verification Script
 * Checks if the application is ready for production deployment
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Lynk Labs - Deployment Verification\n');

const checks = [];

// Check 1: Package.json has correct build script
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const buildScript = packageJson.scripts.build;
  
  if (buildScript && buildScript.includes('prisma generate')) {
    checks.push({ name: 'Build script includes Prisma generation', status: '✅' });
  } else {
    checks.push({ name: 'Build script includes Prisma generation', status: '❌' });
  }
  
  if (packageJson.scripts.postinstall && packageJson.scripts.postinstall.includes('prisma generate')) {
    checks.push({ name: 'Postinstall script configured', status: '✅' });
  } else {
    checks.push({ name: 'Postinstall script configured', status: '❌' });
  }
} catch (error) {
  checks.push({ name: 'Package.json readable', status: '❌' });
}

// Check 2: Vercel.json exists and is minimal
try {
  const vercelConfig = JSON.parse(fs.readFileSync('vercel.json', 'utf8'));
  if (vercelConfig.framework === 'nextjs' && Object.keys(vercelConfig).length <= 2) {
    checks.push({ name: 'Vercel.json properly configured', status: '✅' });
  } else {
    checks.push({ name: 'Vercel.json properly configured', status: '⚠️' });
  }
} catch (error) {
  checks.push({ name: 'Vercel.json exists', status: '❌' });
}

// Check 3: Prisma schema exists
if (fs.existsSync('prisma/schema.prisma')) {
  checks.push({ name: 'Prisma schema exists', status: '✅' });
} else {
  checks.push({ name: 'Prisma schema exists', status: '❌' });
}

// Check 4: Next.js config exists
if (fs.existsSync('next.config.js')) {
  checks.push({ name: 'Next.js config exists', status: '✅' });
} else {
  checks.push({ name: 'Next.js config exists', status: '❌' });
}

// Check 5: Environment example exists
if (fs.existsSync('env.example')) {
  checks.push({ name: 'Environment example exists', status: '✅' });
} else {
  checks.push({ name: 'Environment example exists', status: '❌' });
}

// Check 6: Key directories exist
const requiredDirs = ['src/app', 'src/components', 'src/lib', 'prisma'];
requiredDirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    checks.push({ name: `Directory ${dir} exists`, status: '✅' });
  } else {
    checks.push({ name: `Directory ${dir} exists`, status: '❌' });
  }
});

// Display results
console.log('📋 Deployment Readiness Checklist:\n');
checks.forEach(check => {
  console.log(`${check.status} ${check.name}`);
});

const passedChecks = checks.filter(check => check.status === '✅').length;
const totalChecks = checks.length;

console.log(`\n📊 Score: ${passedChecks}/${totalChecks} checks passed\n`);

if (passedChecks === totalChecks) {
  console.log('🚀 SUCCESS: Your application is ready for deployment!');
  console.log('\nNext steps:');
  console.log('1. Add environment variables to Vercel Dashboard');
  console.log('2. Trigger deployment');
  console.log('3. Test the deployed application');
} else if (passedChecks >= totalChecks * 0.8) {
  console.log('⚠️  MOSTLY READY: Minor issues detected, but deployment should work');
} else {
  console.log('❌ NOT READY: Please fix the issues above before deploying');
}

console.log('\n📖 See scripts/setup-production.md for detailed instructions'); 