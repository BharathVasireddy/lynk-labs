#!/bin/bash

# Lynk Labs Prisma Studio Script
# This script sets the correct environment variables and starts Prisma Studio

echo "🎨 Starting Prisma Studio..."
echo "📊 Database: SQLite (dev.db)"
echo "🌐 URL: http://localhost:5555"
echo ""

# Set environment variables
export DATABASE_URL="file:./dev.db"

# Start Prisma Studio
npx prisma studio 