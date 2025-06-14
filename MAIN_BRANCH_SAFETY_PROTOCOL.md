# MAIN BRANCH SAFETY PROTOCOL
## Critical Safety Measures for Direct Production Deployment

### 🚨 BEFORE EVERY PUSH TO MAIN

#### 1. LOCAL PRODUCTION TESTING (MANDATORY)
```bash
# Step 1: Clean install dependencies
rm -rf node_modules package-lock.json
npm install

# Step 2: Development testing
npm run dev
# ✅ Test ALL affected features manually
# ✅ Verify user authentication works
# ✅ Test payment flows (use test mode)
# ✅ Verify order creation/confirmation
# ✅ Test mobile responsiveness

# Step 3: Production build testing
npm run build
# ✅ MUST complete with 0 errors
# ✅ Check for any TypeScript errors
# ✅ Verify all pages compile

# Step 4: Production runtime testing
npm run start
# ✅ Test on localhost:3000
# ✅ Verify all critical paths work
# ✅ Test database connections
# ✅ Verify API endpoints respond
```

#### 2. CODE QUALITY VERIFICATION
```bash
# Check for TypeScript errors
npx tsc --noEmit

# Check for linting issues
npm run lint

# Security audit
npm audit --audit-level moderate
```

#### 3. DATABASE SAFETY (If Schema Changes)
```bash
# Validate schema
npx prisma validate

# Generate client
npx prisma generate

# Test migrations locally
npx prisma migrate dev --name "descriptive_name"
```

#### 4. COMMIT WITH SAFETY CONFIRMATION
```bash
# Required format with testing confirmation
git add .
git commit -m "type: description [tested-locally-prod]"

# Examples:
git commit -m "feat: add new payment method [tested-locally-prod]"
git commit -m "fix: resolve order bug [verified-user-flow]"
git commit -m "refactor: optimize queries [performance-tested]"
```

#### 5. FINAL SAFETY CHECK
```bash
# Verify you're on main branch
git branch --show-current

# Check what you're about to push
git log --oneline -3

# Push to production
git push origin main
```

### 🚨 IMMEDIATE POST-DEPLOYMENT MONITORING

#### Within 2 Minutes of Push:
```bash
# Check deployment status
curl -I https://your-vercel-url.com

# Verify critical pages
curl -I https://your-vercel-url.com/
curl -I https://your-vercel-url.com/tests
curl -I https://your-vercel-url.com/profile
```

#### Manual Verification Checklist:
- [ ] Homepage loads without errors
- [ ] User login/logout works
- [ ] Test booking flow completes
- [ ] Payment processing works
- [ ] No console errors in browser
- [ ] Mobile version responsive

### 🚨 EMERGENCY ROLLBACK (If Something Breaks)
```bash
# Immediate rollback
git revert HEAD --no-edit
git push origin main

# Verify rollback successful
curl -I https://your-vercel-url.com
```

### 🔴 FORBIDDEN ACTIONS
- ❌ NEVER push without local production testing
- ❌ NEVER push with TypeScript errors
- ❌ NEVER push with failing builds
- ❌ NEVER push on Fridays after 3 PM
- ❌ NEVER push without testing user flows
- ❌ NEVER push database changes without testing

### 🟢 REQUIRED ACTIONS
- ✅ ALWAYS test in local production mode first
- ✅ ALWAYS include testing confirmation in commit
- ✅ ALWAYS monitor immediately after deployment
- ✅ ALWAYS have rollback plan ready
- ✅ ALWAYS test critical user journeys

### 📊 RISK MITIGATION STRATEGIES

#### High-Risk Changes (Require Extra Caution)
- Database schema modifications
- Payment gateway changes
- Authentication system updates
- API endpoint modifications
- Third-party integrations

#### Medium-Risk Changes
- UI component updates
- New feature additions
- Performance optimizations
- Bug fixes in core functionality

#### Low-Risk Changes
- Documentation updates
- Styling improvements
- Minor text changes
- Configuration updates

### 🔧 DEPLOYMENT TIME RECOMMENDATIONS

#### ✅ SAFE DEPLOYMENT TIMES
- **Monday-Thursday**: 9 AM - 3 PM (business hours)
- **Emergency fixes**: Anytime with extra monitoring

#### ⚠️ CAUTION DEPLOYMENT TIMES
- **Friday**: 9 AM - 12 PM only
- **Monday**: After 10 AM (avoid Monday morning issues)

#### ❌ AVOID DEPLOYMENT TIMES
- **Friday after 3 PM**: Weekend monitoring limited
- **Late evenings**: Reduced support availability
- **Before holidays**: Limited team availability
- **During high traffic periods**: Risk of user impact

### 📱 MOBILE TESTING REQUIREMENTS

#### Before Every Deployment:
```bash
# Test responsive design
# Use browser dev tools or actual devices

# Critical mobile tests:
- [ ] Homepage loads correctly on mobile
- [ ] Navigation menu works on mobile
- [ ] Forms are usable on mobile
- [ ] Payment flow works on mobile
- [ ] Touch interactions work properly
```

### 🔍 PERFORMANCE MONITORING

#### Post-Deployment Performance Checks:
```bash
# Check page load times
# Monitor API response times
# Verify database query performance

# Tools to use:
- Browser DevTools Network tab
- Vercel Analytics
- Database monitoring dashboard
```

### 📞 EMERGENCY ESCALATION

#### If Production Breaks:
1. **Immediate Action** (0-2 minutes):
   - Execute rollback commands
   - Verify rollback successful

2. **Communication** (2-5 minutes):
   - Notify team/stakeholders
   - Document the incident

3. **Investigation** (5-30 minutes):
   - Identify root cause
   - Plan proper fix
   - Update safety protocols

### 🎯 SUCCESS METRICS

#### Deployment Success Indicators:
- [ ] Zero production errors post-deployment
- [ ] All critical user flows working
- [ ] Performance metrics within normal range
- [ ] No user complaints or support tickets
- [ ] Database queries performing normally

#### Monthly Review:
- Track deployment success rate
- Review any production incidents
- Update safety protocols based on learnings
- Improve testing procedures

---

**Remember: With great power comes great responsibility. Direct main branch deployment requires maximum diligence and testing.** 