#!/usr/bin/env node

const { execSync } = require('child_process');

async function deploymentSeed() {
  console.log('🚀 Running deployment seed...');
  
  try {
    // Only run in production environment
    if (process.env.NODE_ENV === 'production' || process.env.VERCEL_ENV === 'production') {
      console.log('🌱 Production environment detected, running seed...');
      execSync('npm run db:seed', { stdio: 'inherit' });
      console.log('✅ Deployment seed completed successfully!');
    } else {
      console.log('🔧 Development environment, skipping deployment seed...');
    }
  } catch (error) {
    console.error('❌ Deployment seed failed:', error);
    // Don't fail the deployment if seeding fails
    process.exit(0);
  }
}

deploymentSeed(); 