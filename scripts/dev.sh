#!/bin/bash

# Lynk Labs Development Script
# This script sets the correct environment variables and starts the development server

echo "🚀 Starting Lynk Labs Development Server..."
echo "📊 Database: SQLite (dev.db)"
echo "🔐 Environment: Development"
echo ""

# Set environment variables
export DATABASE_URL="file:./dev.db"
export NEXTAUTH_URL="http://localhost:3000"
export NEXTAUTH_SECRET="dev-secret-key-change-in-production"
export JWT_SECRET="dev-jwt-secret-key-change-in-production"
export NODE_ENV="development"

# Start the development server
npm run dev 