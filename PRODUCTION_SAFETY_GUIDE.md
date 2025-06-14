# Lynk Labs - Production Safety Guide

## 🚨 **CRITICAL SAFETY RULES - READ FIRST**

### ⚠️ **GOLDEN RULES - NEVER BREAK THESE**

1. **NEVER work directly on the main branch when live**
2. **NEVER give AI access to production database credentials**
3. **NEVER deploy without testing locally first**
4. **NEVER delete or modify existing functionality without backup**
5. **ALWAYS create feature branches for new work**
6. **ALWAYS test thoroughly before merging**

---

## 🔒 **PRODUCTION SAFEGUARDS**

### **Step 1: Environment Separation**

#### **Development Environment (.env.local)**
```env
# DEVELOPMENT ONLY - Safe to share with AI
DATABASE_URL="postgres://dev_user:dev_pass@localhost:5432/lynk_labs_dev"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="dev-secret-change-me"
JWT_SECRET="dev-jwt-secret"
NODE_ENV="development"
```

#### **Production Environment (Vercel/Server)**
```env
# PRODUCTION - NEVER SHARE THESE WITH AI
DATABASE_URL="postgres://prod_user:SECURE_PASSWORD@prod-server/lynk_labs_prod"
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="super-secure-production-secret-32-chars-minimum"
JWT_SECRET="super-secure-jwt-secret-32-chars-minimum"
NODE_ENV="production"
```

### **Step 2: Git Branch Strategy**

```bash
# Your safe workflow:
main branch          # PRODUCTION - Protected, no direct pushes
├── staging branch   # PRE-PRODUCTION - Testing environment
├── feature/checkout # NEW FEATURES - Safe to experiment
├── feature/reports  # NEW FEATURES - Safe to experiment
└── hotfix/bug-123   # URGENT FIXES - Minimal changes only
```

---

## 🛠️ **SAFE DEVELOPMENT WORKFLOW**

### **For New Features (ALWAYS follow this):**

#### **Step 1: Create Feature Branch**
```bash
# Start from main branch
git checkout main
git pull origin main

# Create new feature branch
git checkout -b feature/new-feature-name

# Now you're safe to experiment!
```

#### **Step 2: Work with AI Safely**
```markdown
When asking AI for help, ALWAYS include:

"IMPORTANT: This is a feature branch. Do not modify:
- Database schema (prisma/schema.prisma) 
- Authentication system (src/lib/auth-utils.ts)
- Payment processing (src/app/api/payments/)
- Order system (src/app/api/orders/)
- Existing UI components in production

Only add NEW components or modify the specific feature I'm working on."
```

#### **Step 3: Test Locally**
```bash
# Test your changes
npm run dev
npm run build  # MUST pass before deploying
npm run type-check  # MUST pass
```

#### **Step 4: Safe Merge Process**
```bash
# When feature is ready and tested:
git add .
git commit -m "feat: add new feature description"
git push origin feature/new-feature-name

# Create Pull Request (don't merge directly to main)
# Review changes carefully
# Test on staging environment
# Only then merge to main
```

---

## 📋 **AI INTERACTION SAFETY PROTOCOL**

### **Safe Prompts for AI:**
```markdown
✅ GOOD: "Add a new component for displaying test results. 
Don't modify existing components or database schema."

✅ GOOD: "Create a new page for user settings. 
Use existing design system components only."

✅ GOOD: "Fix this specific bug in the checkout form validation. 
Don't change the order creation logic."
```

### **Dangerous Prompts to AVOID:**
```markdown
❌ DANGEROUS: "Redesign the entire checkout system"
❌ DANGEROUS: "Change the database schema"
❌ DANGEROUS: "Update all components to use new styling"
❌ DANGEROUS: "Refactor the authentication system"
```

### **AI Safety Instructions Template:**
```markdown
CONTEXT: I'm working on [specific feature] in a production system.

CONSTRAINTS:
- This is a feature branch, not main
- Do not modify existing database schema
- Do not change authentication or payment systems
- Use only existing design system components
- Add new functionality without breaking existing features

TASK: [Your specific request]
```

---

## 🗄️ **DATABASE SAFETY**

### **Database Schema Protection:**

#### **1. Schema Backup Before Changes**
```bash
# Before any database changes:
npx prisma db pull  # Backup current schema
cp prisma/schema.prisma prisma/schema.backup.prisma
```

#### **2. Safe Schema Changes**
```bash
# ONLY add new fields, never remove existing ones
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  # ✅ SAFE: Adding new optional field
  newField  String?  @default("")
  
  # ❌ DANGEROUS: Never remove existing fields in production
  # phone     String  # Don't delete this!
}
```

#### **3. Migration Safety**
```bash
# Test migrations locally first
npx prisma migrate dev --name add-new-field

# Only deploy to production after local testing
npx prisma migrate deploy  # Production only
```

### **Database Credentials Security:**

#### **Development Database (Safe to share with AI):**
```env
# Local development - OK to share
DATABASE_URL="postgres://dev_user:dev_pass@localhost:5432/lynk_dev"
```

#### **Production Database (NEVER share with AI):**
```env
# Store in secure location, never in code
DATABASE_URL="postgres://prod_user:SECURE_PASS@prod.server.com/lynk_prod"
```

---

## 📁 **CRITICAL FILES PROTECTION**

### **Files to NEVER let AI modify without explicit permission:**

```
🔒 PROTECTED FILES:
├── prisma/schema.prisma           # Database schema
├── src/lib/auth-utils.ts          # Authentication
├── src/app/api/auth/              # Auth endpoints
├── src/app/api/orders/route.ts    # Order processing
├── src/app/api/payments/          # Payment processing
├── middleware.ts                  # Route protection
├── .env.local                     # Environment variables
└── package.json                   # Dependencies
```

### **Safe Files for AI to modify:**
```
✅ SAFE TO MODIFY:
├── src/components/ui/             # UI components (with caution)
├── src/app/[new-pages]/          # New pages only
├── src/components/forms/          # Form components
├── Documentation files (*.md)     # Documentation
└── Styling files                  # CSS/Tailwind
```

---

## 🚀 **DEPLOYMENT SAFETY**

### **Pre-Deployment Checklist:**
```markdown
□ Code builds successfully (npm run build)
□ TypeScript compiles without errors
□ All tests pass (if you have tests)
□ Feature tested locally
□ Database migrations tested locally
□ No breaking changes to existing APIs
□ Environment variables updated (if needed)
□ Backup of current production state
```

### **Safe Deployment Process:**
```bash
# 1. Final local test
npm run build
npm run start  # Test production build locally

# 2. Commit and push
git add .
git commit -m "feat: safe feature addition"
git push origin feature/branch-name

# 3. Create Pull Request
# 4. Review changes carefully
# 5. Test on staging (if available)
# 6. Merge to main
# 7. Monitor deployment
```

---

## 📊 **MONITORING & ROLLBACK**

### **Post-Deployment Monitoring:**
```markdown
After each deployment, check:
□ Website loads correctly
□ User authentication works
□ Order placement works
□ Payment processing works
□ No console errors
□ Database connections stable
```

### **Emergency Rollback:**
```bash
# If something breaks, immediately rollback:
git log --oneline  # Find last working commit
git revert HEAD    # Revert last commit
git push origin main  # Deploy rollback

# Or reset to last working state:
git reset --hard LAST_WORKING_COMMIT_HASH
git push --force origin main  # Emergency only!
```

---

## 🔐 **CREDENTIAL MANAGEMENT**

### **What to Store Securely:**

#### **1. Database Credentials**
```markdown
Production Database:
- Host: [SECURE LOCATION]
- Username: [SECURE LOCATION]
- Password: [SECURE LOCATION]
- Database Name: [SECURE LOCATION]

Development Database:
- Can be stored in .env.local (gitignored)
```

#### **2. API Keys & Secrets**
```markdown
Store in secure password manager:
- NEXTAUTH_SECRET (production)
- JWT_SECRET (production)
- RAZORPAY_KEY_SECRET
- Email service API keys
- Any third-party service keys
```

#### **3. Deployment Access**
```markdown
Store securely:
- Vercel account credentials
- GitHub repository access
- Domain registrar access
- SSL certificate details
```

---

## 📚 **DOCUMENTATION MAINTENANCE**

### **Keep These Updated:**
```markdown
□ API_DOCUMENTATION.md - When adding new endpoints
□ DESIGN_SYSTEM.md - When adding new components
□ CHECKOUT_SYSTEM.md - When modifying checkout
□ This file (PRODUCTION_SAFETY_GUIDE.md)
□ README.md - Setup instructions
```

### **Version Documentation:**
```markdown
For each major release, document:
- What changed
- What was added
- What was removed (if anything)
- Migration steps (if needed)
- Rollback procedures
```

---

## 🎯 **FEATURE INTRODUCTION WORKFLOW**

### **Safe Feature Addition Process:**

#### **Phase 1: Planning**
```markdown
1. Document what you want to add
2. Identify which files will be affected
3. Plan the feature without breaking existing functionality
4. Create feature branch
```

#### **Phase 2: Development**
```markdown
1. Work in feature branch only
2. Use AI with safety constraints
3. Test frequently during development
4. Keep changes small and focused
```

#### **Phase 3: Testing**
```markdown
1. Test new feature thoroughly
2. Test existing functionality still works
3. Test edge cases and error scenarios
4. Test on different devices/browsers
```

#### **Phase 4: Deployment**
```markdown
1. Code review (even if self-review)
2. Final testing
3. Merge to main
4. Monitor deployment
5. Document changes
```

---

## 🆘 **EMERGENCY PROCEDURES**

### **If Something Breaks:**

#### **Immediate Actions:**
```bash
1. Don't panic
2. Check error logs
3. If critical, rollback immediately:
   git revert HEAD
   git push origin main
4. Investigate issue in feature branch
5. Fix and test thoroughly
6. Redeploy fix
```

#### **Communication:**
```markdown
If users are affected:
1. Acknowledge the issue quickly
2. Provide estimated fix time
3. Keep users updated
4. Document what happened
5. Implement prevention measures
```

---

## 📝 **DAILY SAFETY PRACTICES**

### **Before Starting Work:**
```markdown
□ Pull latest changes from main
□ Create new feature branch
□ Backup important files
□ Set up AI safety constraints
```

### **During Development:**
```markdown
□ Commit changes frequently
□ Test changes immediately
□ Don't modify protected files
□ Keep changes focused and small
```

### **Before Deployment:**
```markdown
□ Run full build test
□ Test all critical functionality
□ Review all changes
□ Ensure rollback plan ready
```

---

## 🎓 **LEARNING RESOURCES**

### **Git Safety:**
```bash
# Learn these commands:
git status          # Check current state
git diff           # See changes
git log --oneline  # See commit history
git checkout -b    # Create branch
git revert         # Safe undo
```

### **Next.js Safety:**
```bash
# Always run these before deploying:
npm run build      # Test build
npm run type-check # Check TypeScript
npm run lint       # Check code quality
```

---

## 🔄 **REGULAR MAINTENANCE**

### **Weekly:**
```markdown
□ Review recent changes
□ Check for security updates
□ Monitor error logs
□ Backup database
□ Update documentation
```

### **Monthly:**
```markdown
□ Review and update dependencies
□ Check performance metrics
□ Review security practices
□ Update emergency contacts
□ Test rollback procedures
```

---

## 📞 **EMERGENCY CONTACTS**

```markdown
Keep these handy:
- Hosting provider support (Vercel)
- Database provider support (Neon)
- Domain registrar support
- Payment gateway support (Razorpay)
- Your technical advisor/consultant
```

---

## 🎯 **REMEMBER: SAFETY FIRST**

### **The Golden Rule:**
> "It's better to move slowly and keep the system working than to move fast and break things for your users."

### **When in Doubt:**
1. Create a backup
2. Work in a feature branch
3. Test thoroughly
4. Ask for help
5. Document everything

**Your users and company depend on system stability. Always prioritize safety over speed.** 