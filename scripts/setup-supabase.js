#!/usr/bin/env node

/**
 * Supabase Setup Script for Lynk Labs
 * This script helps set up the Supabase database connection
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Lynk Labs - Supabase Setup');
console.log('================================');

// Check if .env.local exists
const envPath = path.join(process.cwd(), '.env.local');
const envExists = fs.existsSync(envPath);

console.log('\n📋 Setup Instructions:');
console.log('1. Go to your Supabase project dashboard');
console.log('2. Navigate to Settings > Database');
console.log('3. Copy the "Connection string" under "Connection pooling"');
console.log('4. Replace [YOUR_DB_PASSWORD] with your actual database password');

const envTemplate = `# Lynk Labs - Development Environment Variables

# =============================================================================
# DATABASE CONFIGURATION (Supabase)
# =============================================================================
# Replace [YOUR_DB_PASSWORD] with your actual Supabase database password
DATABASE_URL="postgresql://postgres.qdnqffpbdqjhbpbezmhm:[YOUR_DB_PASSWORD]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true&connection_limit=1"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://qdnqffpbdqjhbpbezmhm.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkbnFmZnBiZHFqaGJwYmV6bWhtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDAwNzIsImV4cCI6MjA2NTM3NjA3Mn0.bUx7ub7rfugKwgaekk8He5cfe-vA8aS0N_MPdDOvFjM

# =============================================================================
# AUTHENTICATION CONFIGURATION
# =============================================================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="lynklabs-dev-secret-key-change-in-production-32chars"

# =============================================================================
# APPLICATION CONFIGURATION
# =============================================================================
NODE_ENV="development"
APP_URL="http://localhost:3000"

# =============================================================================
# PAYMENT GATEWAY CONFIGURATION (Development)
# =============================================================================
# Razorpay Test Keys (replace with your test keys)
RAZORPAY_KEY_ID="rzp_test_your_key_id"
RAZORPAY_KEY_SECRET="your_razorpay_test_secret"

# =============================================================================
# COMMUNICATION SERVICES (Development)
# =============================================================================
# Twilio Test Configuration
TWILIO_ACCOUNT_SID="test_account_sid"
TWILIO_AUTH_TOKEN="test_auth_token"
TWILIO_PHONE_NUMBER="+15005550006"
TWILIO_WHATSAPP_NUMBER="whatsapp:+14155238886"

# =============================================================================
# SECURITY CONFIGURATION
# =============================================================================
JWT_SECRET="lynklabs-jwt-secret-key-change-in-production-32chars"

# =============================================================================
# FEATURE FLAGS
# =============================================================================
ENABLE_WHATSAPP_NOTIFICATIONS="false"
ENABLE_SMS_NOTIFICATIONS="false"
ENABLE_EMAIL_NOTIFICATIONS="false"
ENABLE_HOME_VISITS="true"
ENABLE_ONLINE_PAYMENTS="true"

# =============================================================================
# DEVELOPMENT FLAGS
# =============================================================================
DEBUG_MODE="true"
VERBOSE_LOGGING="true"
ENABLE_SEED_DATA="true"
`;

if (!envExists) {
  fs.writeFileSync(envPath, envTemplate);
  console.log('\n✅ Created .env.local file');
} else {
  console.log('\n⚠️  .env.local already exists');
}

console.log('\n🔧 Next Steps:');
console.log('1. Edit .env.local and replace [YOUR_DB_PASSWORD] with your actual password');
console.log('2. Run: npm run db:push');
console.log('3. Run: npm run db:seed');
console.log('4. Run: npm run dev');

console.log('\n📝 To get your database password:');
console.log('1. Go to https://supabase.com/dashboard/project/qdnqffpbdqjhbpbezmhm');
console.log('2. Settings > Database');
console.log('3. Copy the password from "Database password" section'); 