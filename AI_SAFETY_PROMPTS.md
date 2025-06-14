# Lynk Labs - AI Safety Prompts

## 🤖 **SAFE AI INTERACTION GUIDE**

> Use these templates when working with AI assistants to protect your production system

---

## ✅ **SAFE PROMPT TEMPLATES**

### **Template 1: Adding New Features**
```markdown
CONTEXT: I'm working on Lynk Labs, a medical lab platform in production.

SAFETY CONSTRAINTS:
- This is a feature branch, not main branch
- Do not modify existing database schema (prisma/schema.prisma)
- Do not change authentication system (src/lib/auth-utils.ts)
- Do not modify payment processing (src/app/api/payments/)
- Do not change order system (src/app/api/orders/)
- Use only existing design system components from DESIGN_SYSTEM.md
- Add new functionality without breaking existing features

TASK: [Your specific request here]

EXAMPLE: "Create a new user dashboard page that shows order history using existing components"
```

### **Template 2: Bug Fixes**
```markdown
CONTEXT: I need to fix a specific bug in Lynk Labs production system.

SAFETY CONSTRAINTS:
- Only fix the specific issue mentioned
- Do not refactor or change other parts of the code
- Do not modify database schema
- Do not change authentication or payment systems
- Test the fix thoroughly

BUG DESCRIPTION: [Describe the specific bug]
EXPECTED BEHAVIOR: [What should happen]
CURRENT BEHAVIOR: [What's happening now]

TASK: Fix only this specific bug without changing other functionality
```

### **Template 3: UI Improvements**
```markdown
CONTEXT: I want to improve the UI of Lynk Labs while maintaining all existing functionality.

SAFETY CONSTRAINTS:
- Use only colors and components from DESIGN_SYSTEM.md
- Do not change any business logic or API calls
- Do not modify database interactions
- Maintain all existing functionality
- Keep the same URL structure and navigation

TASK: [Your UI improvement request]

EXAMPLE: "Improve the visual design of the test listing page using existing medical design system"
```

---

## ❌ **DANGEROUS PROMPTS TO AVOID**

### **Never Say These:**
```markdown
❌ "Redesign the entire checkout system"
❌ "Change the database schema to improve performance"
❌ "Update all components to use a new design system"
❌ "Refactor the authentication system"
❌ "Optimize the payment processing"
❌ "Change how orders are created"
❌ "Update all the styling across the app"
❌ "Migrate to a different database"
❌ "Change the API structure"
❌ "Remove old functionality and replace with new"
```

### **Why These Are Dangerous:**
- They can break existing functionality
- They might affect user data
- They could compromise security
- They may break payment processing
- They might affect user authentication
- They could cause data loss

---

## 🛡️ **PROTECTION PHRASES**

### **Always Include These in Your Prompts:**
```markdown
"Do not modify existing database schema"
"Do not change authentication or payment systems"
"Use only existing design system components"
"Do not break existing functionality"
"This is a feature branch, not production"
"Test all changes thoroughly"
```

### **Emergency Stop Phrases:**
```markdown
If AI suggests dangerous changes, say:
"STOP - Do not modify core systems"
"STOP - Only work on the specific feature I mentioned"
"STOP - Do not change existing working functionality"
```

---

## 📋 **SAFE FEATURE REQUEST EXAMPLES**

### **✅ Good Examples:**

#### **Adding a New Page:**
```markdown
CONTEXT: Lynk Labs production system, working on feature branch.

CONSTRAINTS: Use existing components, don't modify core systems.

TASK: Create a new "Help & Support" page at /help that includes:
- FAQ section using existing card components
- Contact form using existing form components
- Support ticket status checker
- Use medical design system colors and typography

Do not modify authentication, database, or payment systems.
```

#### **Improving Existing UI:**
```markdown
CONTEXT: Lynk Labs production system, working on feature branch.

CONSTRAINTS: Keep all existing functionality, use design system only.

TASK: Improve the visual design of the user profile page:
- Better spacing and layout
- Use existing medical card components
- Improve form styling with existing form components
- Add loading states using existing patterns

Do not change any API calls, authentication logic, or data handling.
```

#### **Adding New Component:**
```markdown
CONTEXT: Lynk Labs production system, working on feature branch.

CONSTRAINTS: Create new component only, don't modify existing ones.

TASK: Create a new "TestResultCard" component that:
- Displays test results in a professional medical format
- Uses existing design system colors and typography
- Includes proper accessibility features
- Follows existing component patterns

Place in src/components/ui/ and don't modify any existing components.
```

---

## 🚨 **EMERGENCY PROCEDURES**

### **If AI Suggests Dangerous Changes:**

#### **Immediate Actions:**
1. **STOP** the conversation
2. **DO NOT** apply the suggested changes
3. **REVIEW** what was suggested
4. **RESTART** with safer constraints

#### **Safe Recovery:**
```markdown
"I need to restart this conversation with better safety constraints.

IMPORTANT: I'm working on a production medical platform. Please:
- Only suggest changes to the specific feature I mention
- Do not modify database schema, authentication, or payment systems
- Use only existing design system components
- Do not break any existing functionality
- Work only on new features or specific bug fixes

Let me re-explain what I need: [Your safe request]"
```

---

## 📝 **CHECKLIST BEFORE ASKING AI**

### **Before Each AI Interaction:**
```markdown
□ Am I working on a feature branch?
□ Have I clearly defined what should NOT be changed?
□ Have I specified to use existing design system only?
□ Have I mentioned this is a production system?
□ Have I limited the scope to specific files/features?
□ Have I included safety constraints?
□ Am I asking for something specific, not general?
```

### **After AI Response:**
```markdown
□ Does the response respect my safety constraints?
□ Are only the intended files being modified?
□ Is existing functionality preserved?
□ Are database/auth/payment systems untouched?
□ Can I test this safely in my feature branch?
□ Do I understand all the changes being made?
```

---

## 🎯 **SPECIFIC USE CASES**

### **Adding New Test Categories:**
```markdown
SAFE: "Add a new test category 'Cardiac Tests' to the existing category system without modifying the database schema or existing categories."

DANGEROUS: "Redesign the category system to be more efficient."
```

### **Improving Order Display:**
```markdown
SAFE: "Improve the visual layout of the order history page using existing card components and design system colors."

DANGEROUS: "Optimize the order system for better performance."
```

### **Adding User Features:**
```markdown
SAFE: "Add a 'Favorite Tests' feature that lets users bookmark tests using existing UI components."

DANGEROUS: "Improve the user system with better data management."
```

---

## 🔄 **REGULAR SAFETY REMINDERS**

### **Weekly Reminder:**
```markdown
Remember to:
□ Always work in feature branches
□ Use safety constraints in AI prompts
□ Test changes thoroughly
□ Keep production credentials secure
□ Document all changes
□ Review AI suggestions carefully
```

### **Before Major Features:**
```markdown
□ Plan the feature scope clearly
□ Identify which files will be affected
□ Ensure no core systems need modification
□ Prepare rollback plan
□ Set up proper AI constraints
□ Test in development environment first
```

---

## 📞 **WHEN TO ASK FOR HELP**

### **Ask for Human Help When:**
- AI suggests modifying core systems
- You're unsure about the safety of changes
- The feature requires database schema changes
- Authentication or payment systems need updates
- You're getting errors you don't understand
- The changes seem too complex or risky

### **Safe Places to Get Help:**
- Technical forums (Stack Overflow)
- Next.js documentation
- Prisma documentation
- Your technical consultant
- Developer communities (with anonymized questions)

---

## 🎓 **LEARNING SAFE AI INTERACTION**

### **Practice Safe Prompts:**
Start with small, specific requests and gradually build confidence:

1. **Week 1:** Only ask for documentation updates
2. **Week 2:** Ask for new UI components using existing patterns
3. **Week 3:** Request new pages with existing functionality
4. **Week 4:** Try small feature additions with strict constraints

### **Build Your Safety Habits:**
- Always include safety constraints
- Always work in feature branches
- Always test changes thoroughly
- Always review AI suggestions carefully
- Always have a rollback plan

---

## ⚠️ **FINAL REMINDERS**

### **The Golden Rules:**
1. **Specific is Safe** - Ask for specific, limited changes
2. **Constraints are Critical** - Always include safety constraints
3. **Test Everything** - Never deploy untested changes
4. **Document Changes** - Keep track of what was modified
5. **When in Doubt, Don't** - Better safe than sorry

### **Your Responsibility:**
- Your users depend on system stability
- Your business depends on data security
- Your reputation depends on reliability
- Always prioritize safety over speed

**Remember: A working system is better than a broken "improved" system.** 