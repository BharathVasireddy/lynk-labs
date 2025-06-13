#!/usr/bin/env node

/**
 * Production Deployment Script for Lynk Labs
 * Helps set up environment variables and deploy to Vercel
 */

console.log('🚀 Lynk Labs - Production Deployment Guide');
console.log('==========================================');

console.log('\n📋 Step 1: Set Environment Variables in Vercel');
console.log('Go to your Vercel dashboard and add these environment variables:');
console.log('');

const envVars = [
  {
    name: 'DATABASE_URL',
    value: 'postgresql://postgres.qdnqffpbdqjhbpbezmhm:Bharath@2103@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1',
    description: 'Supabase database connection URL'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_URL',
    value: 'https://qdnqffpbdqjhbpbezmhm.supabase.co',
    description: 'Supabase project URL'
  },
  {
    name: 'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    value: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbnFmZnBiZHFqaGJwYmV6bWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDAwNzIsImV4cCI6MjA2NTM3NjA3Mn0.bUx7ub7rfugKwgaekk8He5cfe-vA8aS0N_MPdDOvFjM',
    description: 'Supabase anonymous key'
  },
  {
    name: 'NEXTAUTH_URL',
    value: 'https://your-app-name.vercel.app',
    description: 'Your production URL (replace with actual URL)'
  },
  {
    name: 'NEXTAUTH_SECRET',
    value: 'lynklabs-production-secret-key-generate-new-32chars',
    description: 'NextAuth secret (generate a new one for production)'
  },
  {
    name: 'NODE_ENV',
    value: 'production',
    description: 'Environment mode'
  }
];

envVars.forEach((envVar, index) => {
  console.log(`${index + 1}. ${envVar.name}`);
  console.log(`   Value: ${envVar.value}`);
  console.log(`   Description: ${envVar.description}`);
  console.log('');
});

console.log('\n📋 Step 2: Deploy to Vercel');
console.log('Run these commands:');
console.log('');
console.log('1. Install Vercel CLI (if not already installed):');
console.log('   npm i -g vercel');
console.log('');
console.log('2. Login to Vercel:');
console.log('   vercel login');
console.log('');
console.log('3. Deploy to production:');
console.log('   vercel --prod');
console.log('');

console.log('\n📋 Step 3: Run Database Migration on Production');
console.log('After deployment, run this command to set up the database:');
console.log('');
console.log('vercel env pull .env.production');
console.log('DATABASE_URL="your_production_db_url" npm run db:push');
console.log('DATABASE_URL="your_production_db_url" npm run db:seed');
console.log('');

console.log('\n🎯 Quick Deployment Commands:');
console.log('');
console.log('# If you have Vercel CLI installed:');
console.log('vercel --prod');
console.log('');
console.log('# Or push to GitHub and auto-deploy via Vercel integration');
console.log('git add .');
console.log('git commit -m "Add comprehensive test data and production setup"');
console.log('git push origin main');
console.log('');

console.log('\n✅ After Deployment:');
console.log('1. Your admin dashboard will be available at: https://your-app.vercel.app/admin/dashboard');
console.log('2. Login with: +919999999999 / password123');
console.log('3. Test all features with the comprehensive test data');
console.log('');

console.log('\n📊 What\'s Now Available:');
console.log('- 10 Categories of tests');
console.log('- 27 Different tests');
console.log('- 10 Users (1 admin, 5 customers, 4 agents)');
console.log('- 5 Orders with different statuses');
console.log('- 4 Home visits scheduled/completed');
console.log('- 7 Reports in various states');
console.log('');

console.log('🎉 Your Lynk Labs platform is ready for production!'); 