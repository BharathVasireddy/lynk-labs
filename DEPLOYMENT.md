# Lynk Labs - Deployment Guide

## 🚀 Deployment Overview

This guide provides comprehensive instructions for deploying Lynk Labs to different environments. We support multiple deployment strategies to ensure flexibility and scalability.

## 🏗 Deployment Architecture

### **Recommended Production Architecture**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vercel Edge   │    │  Next.js App    │    │   PostgreSQL    │
│     Network     │────│   (Vercel)      │────│  (Vercel DB)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
    ┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
    │   AWS S3        │    │ Upstash Redis   │    │     Sentry      │
    │ (File Storage)  │    │   (Caching)     │    │  (Monitoring)   │
    └─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🌍 Environment Setup

### **Environment Hierarchy**
1. **Development** - Local development environment
2. **Staging** - Pre-production testing environment
3. **Production** - Live production environment

### **Environment Variables Configuration**

#### **Development (.env.local)**
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/lynklabs_dev"
REDIS_URL="redis://localhost:6379"

# Authentication
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="development-secret-key-change-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# AWS S3
AWS_ACCESS_KEY_ID="your-aws-access-key"
AWS_SECRET_ACCESS_KEY="your-aws-secret-key"
AWS_REGION="ap-south-1"
AWS_BUCKET_NAME="lynklabs-dev-uploads"

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Razorpay
RAZORPAY_KEY_ID="rzp_test_..."
RAZORPAY_KEY_SECRET="your-razorpay-secret"

# Twilio
TWILIO_ACCOUNT_SID="AC..."
TWILIO_AUTH_TOKEN="your-twilio-token"
TWILIO_PHONE_NUMBER="+1234567890"

# SendGrid
SENDGRID_API_KEY="SG...."
SENDGRID_FROM_EMAIL="noreply@lynklabs.com"

# Monitoring
SENTRY_DSN="https://your-sentry-dsn"
```

#### **Staging (.env.staging)**
```bash
# Database
DATABASE_URL="postgresql://username:password@staging-db/lynklabs_staging"
REDIS_URL="rediss://staging-redis-url"

# Authentication
NEXTAUTH_URL="https://staging.lynklabs.com"
NEXTAUTH_SECRET="staging-secret-key-different-from-dev"

# ... rest of the variables with staging values
```

#### **Production (.env.production)**
```bash
# Database
DATABASE_URL="postgresql://username:password@production-db/lynklabs_prod"
REDIS_URL="rediss://production-redis-url"

# Authentication
NEXTAUTH_URL="https://lynklabs.com"
NEXTAUTH_SECRET="production-secret-key-very-secure"

# ... rest of the variables with production values
```

---

## 🏠 Local Development Setup

### **Prerequisites**
- Node.js 18+ installed
- PostgreSQL 14+ installed
- Redis installed (optional, for caching)
- Git installed

### **Step 1: Clone Repository**
```bash
git clone https://github.com/your-org/lynk-labs.git
cd lynk-labs
```

### **Step 2: Install Dependencies**
```bash
npm install
```

### **Step 3: Database Setup**
```bash
# Start PostgreSQL service
sudo service postgresql start

# Create database
createdb lynklabs_dev

# Copy environment file
cp .env.example .env.local

# Edit .env.local with your database URL and other settings
```

### **Step 4: Database Migration**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma db push

# Seed database with initial data
npx prisma db seed
```

### **Step 5: Start Development Server**
```bash
npm run dev
```

### **Step 6: Verify Installation**
- Open `http://localhost:3000`
- Check that all pages load correctly
- Test user registration and login
- Verify database connections

---

## 🚀 Vercel Deployment (Recommended)

### **Why Vercel?**
- Seamless Next.js integration
- Automatic deployments from Git
- Global CDN with edge caching
- Serverless functions
- Built-in analytics and monitoring

### **Step 1: Vercel Account Setup**
1. Create account at [vercel.com](https://vercel.com)
2. Install Vercel CLI: `npm i -g vercel`
3. Login: `vercel login`

### **Step 2: Database Setup (Vercel Postgres)**
```bash
# Create Vercel Postgres database
vercel postgres create lynklabs-db

# Get connection string
vercel postgres env lynklabs-db
```

### **Step 3: Environment Variables Setup**
```bash
# Set production environment variables
vercel env add DATABASE_URL production
vercel env add NEXTAUTH_SECRET production
vercel env add GOOGLE_CLIENT_ID production
# ... add all required environment variables
```

### **Step 4: Deploy to Vercel**
```bash
# Deploy to staging
vercel --env staging

# Deploy to production
vercel --prod
```

### **Step 5: Domain Configuration**
1. Go to Vercel dashboard
2. Navigate to your project settings
3. Add custom domain under "Domains"
4. Configure DNS records as instructed

### **Step 6: Database Migration on Vercel**
```bash
# Connect to Vercel environment
vercel env pull .env.vercel

# Run migrations
npx prisma db push --preview-feature

# Seed production database (if needed)
npx prisma db seed
```

---

## ☁️ AWS Deployment (Alternative)

### **Architecture Components**
- **EC2**: Application hosting
- **RDS**: PostgreSQL database
- **ElastiCache**: Redis caching
- **S3**: File storage
- **CloudFront**: CDN
- **Route 53**: DNS management

### **Step 1: AWS Infrastructure Setup**

#### **Create EC2 Instance**
```bash
# Launch EC2 instance with Ubuntu 22.04
# Instance type: t3.medium (minimum)
# Security groups: HTTP (80), HTTPS (443), SSH (22)
```

#### **Setup Database (RDS)**
```bash
# Create PostgreSQL instance
# Instance class: db.t3.micro (minimum)
# Storage: 20GB SSD
# Multi-AZ: Yes (for production)
```

#### **Setup Redis (ElastiCache)**
```bash
# Create Redis cluster
# Node type: cache.t3.micro
# Number of nodes: 1
```

### **Step 2: Server Configuration**

#### **Connect to EC2 Instance**
```bash
ssh -i your-key.pem ubuntu@your-ec2-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install PM2
sudo npm install -g pm2

# Install PostgreSQL client
sudo apt install postgresql-client
```

#### **Deploy Application**
```bash
# Clone repository
git clone https://github.com/your-org/lynk-labs.git
cd lynk-labs

# Install dependencies
npm install

# Build application
npm run build

# Create environment file
sudo nano .env.production
# Add all production environment variables

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push
```

### **Step 3: Process Management with PM2**

#### **Create PM2 Ecosystem File**
```javascript
// ecosystem.config.js
module.exports = {
  apps: [{
    name: 'lynk-labs',
    script: 'npm',
    args: 'start',
    cwd: '/home/ubuntu/lynk-labs',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    instances: 'max',
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    log_file: '/var/log/lynk-labs/combined.log',
    out_file: '/var/log/lynk-labs/out.log',
    error_file: '/var/log/lynk-labs/error.log',
    time: true
  }]
};
```

#### **Start Application**
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
```

### **Step 4: Nginx Configuration**

#### **Install Nginx**
```bash
sudo apt install nginx
```

#### **Configure Nginx**
```nginx
# /etc/nginx/sites-available/lynklabs
server {
    listen 80;
    server_name lynklabs.com www.lynklabs.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name lynklabs.com www.lynklabs.com;

    ssl_certificate /etc/letsencrypt/live/lynklabs.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/lynklabs.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

#### **Enable Site**
```bash
# Link configuration
sudo ln -s /etc/nginx/sites-available/lynklabs /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

### **Step 5: SSL Certificate Setup**
```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d lynklabs.com -d www.lynklabs.com

# Auto-renewal setup
sudo crontab -e
# Add: 0 12 * * * /usr/bin/certbot renew --quiet
```

---

## 🔄 CI/CD Pipeline Setup

### **GitHub Actions Workflow**

#### **Create Workflow File**
```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v4
    
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm test
    
    - name: Run linting
      run: npm run lint
    
    - name: Type check
      run: npm run type-check

  deploy-staging:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel Staging
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        scope: ${{ secrets.TEAM_ID }}

  deploy-production:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
    - uses: actions/checkout@v4
    
    - name: Deploy to Vercel Production
      uses: amondnet/vercel-action@v25
      with:
        vercel-token: ${{ secrets.VERCEL_TOKEN }}
        vercel-org-id: ${{ secrets.ORG_ID }}
        vercel-project-id: ${{ secrets.PROJECT_ID }}
        vercel-args: '--prod'
        scope: ${{ secrets.TEAM_ID }}
```

### **Setup GitHub Secrets**
1. Go to GitHub repository settings
2. Navigate to Secrets and variables > Actions
3. Add the following secrets:
   - `VERCEL_TOKEN`
   - `ORG_ID`
   - `PROJECT_ID`
   - `TEAM_ID`

---

## 📊 Monitoring & Analytics Setup

### **Sentry Error Monitoring**

#### **Install Sentry**
```bash
npm install @sentry/nextjs
```

#### **Configure Sentry**
```javascript
// sentry.client.config.js
import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV,
  tracesSampleRate: 1.0,
});
```

#### **Add to Next.js Config**
```javascript
// next.config.js
const { withSentryConfig } = require('@sentry/nextjs');

const nextConfig = {
  // your config
};

module.exports = withSentryConfig(nextConfig, {
  silent: true,
  org: "your-org",
  project: "lynk-labs",
});
```

### **Vercel Analytics**
```bash
npm install @vercel/analytics
```

```javascript
// app/layout.tsx
import { Analytics } from '@vercel/analytics/react';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
```

---

## 🔐 Security Checklist

### **Pre-Deployment Security**
- [ ] All environment variables secured
- [ ] No hardcoded secrets in code
- [ ] HTTPS enforced in production
- [ ] Database connections encrypted
- [ ] API endpoints authenticated
- [ ] Input validation implemented
- [ ] Rate limiting configured
- [ ] CORS properly configured

### **Post-Deployment Security**
- [ ] Security headers configured
- [ ] SSL certificates installed
- [ ] Database access restricted
- [ ] Regular security updates scheduled
- [ ] Monitoring and alerting setup
- [ ] Backup and recovery tested

---

## 🧪 Testing Deployment

### **Deployment Verification Checklist**
- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Test catalog displays
- [ ] Cart functionality works
- [ ] Checkout process completes
- [ ] Payment processing works
- [ ] Email notifications sent
- [ ] File uploads work
- [ ] Admin dashboard accessible
- [ ] API endpoints respond correctly
- [ ] Database operations succeed
- [ ] Error monitoring active

### **Performance Testing**
```bash
# Install testing tools
npm install -g lighthouse artillery

# Run Lighthouse audit
lighthouse https://lynklabs.com --output html --output-path ./lighthouse-report.html

# Load testing with Artillery
artillery quick --count 10 --num 10 https://lynklabs.com
```

---

## 🔄 Backup and Recovery

### **Database Backup**
```bash
# Automated daily backup script
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
pg_dump $DATABASE_URL > /backups/lynklabs_backup_$DATE.sql
aws s3 cp /backups/lynklabs_backup_$DATE.sql s3://lynklabs-backups/
```

### **File Storage Backup**
```bash
# Sync S3 bucket to backup location
aws s3 sync s3://lynklabs-uploads s3://lynklabs-backup-uploads
```

### **Recovery Procedures**
```bash
# Database restore
psql $DATABASE_URL < backup_file.sql

# File restore
aws s3 sync s3://lynklabs-backup-uploads s3://lynklabs-uploads
```

---

## 📞 Troubleshooting

### **Common Deployment Issues**

#### **Build Failures**
```bash
# Check Node.js version
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check for TypeScript errors
npm run type-check
```

#### **Database Connection Issues**
```bash
# Test database connection
npx prisma db push --preview-feature

# Check environment variables
echo $DATABASE_URL
```

#### **Performance Issues**
```bash
# Check application logs
pm2 logs lynk-labs

# Monitor system resources
htop
```

### **Emergency Rollback Procedures**
```bash
# Vercel rollback
vercel rollback [deployment-url]

# AWS EC2 rollback
git checkout [previous-commit]
npm run build
pm2 restart lynk-labs
```

---

## 📝 Deployment Checklist

### **Pre-Deployment**
- [ ] Code reviewed and tested
- [ ] Environment variables configured
- [ ] Database migrations prepared
- [ ] Build succeeds locally
- [ ] Tests pass
- [ ] Security scan completed

### **During Deployment**
- [ ] Monitor deployment progress
- [ ] Check for any errors
- [ ] Verify all services start correctly
- [ ] Test critical functionality

### **Post-Deployment**
- [ ] Run smoke tests
- [ ] Check monitoring dashboards
- [ ] Verify SSL certificates
- [ ] Test payment processing
- [ ] Update documentation
- [ ] Notify team of successful deployment

This deployment guide ensures a smooth and secure deployment process for the Lynk Labs platform across different environments. 