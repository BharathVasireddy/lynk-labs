# Lynk Labs - Project Structure

## 📁 Project Overview

Lynk Labs follows a modern Next.js 14 App Router structure with TypeScript, organized for scalability, maintainability, and developer experience. The project uses a feature-based organization with clear separation of concerns.

## 🏗 Root Directory Structure

```
lynk-labs/
├── 📁 prisma/                    # Database schema and migrations
│   ├── schema.prisma             # Prisma database schema
│   ├── dev.db                    # SQLite development database
│   └── migrations/               # Database migration files
├── 📁 public/                    # Static assets
│   ├── images/                   # Image assets
│   └── uploads/                  # User uploaded files
├── 📁 scripts/                   # Build and deployment scripts
├── 📁 src/                       # Source code (main application)
├── 📄 .cursorrules               # AI assistant rules and guidelines
├── 📄 .env.local                 # Environment variables (gitignored)
├── 📄 .env.example               # Environment variables template
├── 📄 API_DOCUMENTATION.md       # API endpoints documentation
├── 📄 CHECKOUT_SYSTEM.md         # Checkout system documentation
├── 📄 DESIGN_SYSTEM.md           # Design system and components
├── 📄 DEPLOYMENT.md              # Deployment instructions
├── 📄 PROJECT_STRUCTURE.md       # This file
├── 📄 TECH_STACK.md              # Technology stack documentation
├── 📄 README.md                  # Project overview and setup
├── 📄 components.json            # shadcn/ui configuration
├── 📄 middleware.ts              # Next.js middleware for auth/routing
├── 📄 next.config.js             # Next.js configuration
├── 📄 package.json               # Dependencies and scripts
├── 📄 tailwind.config.js         # Tailwind CSS configuration
├── 📄 tsconfig.json              # TypeScript configuration
└── 📄 vercel.json                # Vercel deployment configuration
```

## 📂 Source Code Structure (`src/`)

```
src/
├── 📁 app/                       # Next.js App Router pages and API routes
│   ├── 📁 (auth)/               # Auth route group
│   ├── 📁 (dashboard)/          # Dashboard route group
│   ├── 📁 about/                # About page
│   ├── 📁 addresses/            # Address management
│   ├── 📁 admin/                # Admin panel
│   ├── 📁 api/                  # API routes
│   ├── 📁 auth/                 # Authentication pages
│   ├── 📁 checkout/             # Checkout system ⭐ NEW
│   ├── 📁 contact/              # Contact page
│   ├── 📁 help/                 # Help and support
│   ├── 📁 orders/               # Order management
│   ├── 📁 packages/             # Test packages
│   ├── 📁 privacy/              # Privacy policy
│   ├── 📁 profile/              # User profile
│   ├── 📁 reports/              # Lab reports
│   ├── 📁 terms/                # Terms of service
│   ├── 📁 tests/                # Test catalog
│   ├── 📁 track-order/          # Order tracking
│   ├── 📄 globals.css           # Global styles
│   ├── 📄 layout.tsx            # Root layout component
│   └── 📄 page.tsx              # Home page
├── 📁 components/               # Reusable UI components
│   ├── 📁 auth/                 # Authentication components
│   ├── 📁 forms/                # Form components ⭐ ENHANCED
│   ├── 📁 layout/               # Layout components
│   └── 📁 ui/                   # Base UI components ⭐ ENHANCED
├── 📁 contexts/                 # React contexts
├── 📁 hooks/                    # Custom React hooks
├── 📁 lib/                      # Utility libraries
├── 📁 store/                    # State management (Zustand)
└── 📁 types/                    # TypeScript type definitions
```

## 🛒 Checkout System Structure (NEW)

### Checkout Page (`src/app/checkout/`)
```
checkout/
└── 📄 page.tsx                  # Main checkout page component
```

**Key Features:**
- Enterprise-level error handling
- Authentication guard with login redirect
- Real-time form validation
- Mobile-responsive design
- Comprehensive state management

### Enhanced UI Components (`src/components/ui/`)
```
ui/
├── 📄 alert.tsx                 # Professional alert system ⭐ NEW
├── 📄 badge.tsx                 # Status badges
├── 📄 button.tsx                # Button variants
├── 📄 card.tsx                  # Card components
├── 📄 input.tsx                 # Form inputs
├── 📄 label.tsx                 # Form labels
├── 📄 select.tsx                # Select dropdowns
├── 📄 textarea.tsx              # Text areas
└── ... (other shadcn/ui components)
```

### Form Components (`src/components/forms/`)
```
forms/
├── 📄 smart-form-field.tsx      # Enhanced form field ⭐ NEW
├── 📄 progress-indicator.tsx    # Checkout progress ⭐ NEW
├── 📄 trust-indicators.tsx      # Security badges ⭐ NEW
├── 📄 mobile-checkout-footer.tsx # Mobile footer ⭐ NEW
└── ... (other form components)
```

## 🔗 API Routes Structure (`src/app/api/`)

```
api/
├── 📁 addresses/                # Address management
│   ├── 📄 route.ts             # GET, POST addresses
│   └── 📁 [id]/                # Individual address operations
├── 📁 admin/                    # Admin-only endpoints
├── 📁 auth/                     # Authentication endpoints
│   ├── 📁 login/               # User login
│   ├── 📁 register/            # User registration
│   ├── 📁 logout/              # User logout
│   └── 📁 me/                  # Current user info
├── 📁 categories/               # Test categories
├── 📁 coupons/                  # Coupon management
├── 📁 orders/                   # Order management ⭐ ENHANCED
│   ├── 📄 route.ts             # Order creation with validation
│   └── 📁 [id]/                # Individual order operations
├── 📁 payments/                 # Payment processing ⭐ ENHANCED
│   ├── 📁 create-order/        # Razorpay order creation
│   └── 📁 verify/              # Payment verification
├── 📁 tests/                    # Test catalog
└── 📁 webhooks/                 # External service webhooks
```

## 🎨 Component Organization Principles

### 1. **Feature-Based Organization**
Components are organized by feature/domain rather than by type:
```
✅ Good: components/checkout/, components/orders/
❌ Avoid: components/buttons/, components/forms/
```

### 2. **Atomic Design Principles**
```
ui/           # Atoms (basic elements)
forms/        # Molecules (form combinations)
layout/       # Organisms (complex components)
pages/        # Templates (page layouts)
```

### 3. **Naming Conventions**
```
PascalCase    # Components: CheckoutPage, SmartFormField
camelCase     # Functions: processOrder, validateForm
kebab-case    # Files: checkout-page.tsx, smart-form-field.tsx
UPPER_CASE    # Constants: API_ENDPOINTS, ERROR_MESSAGES
```

## 📱 Page Structure Patterns

### Standard Page Structure
```typescript
// src/app/[feature]/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Page Title - Lynk Labs',
  description: 'Page description for SEO'
};

interface PageProps {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default function Page({ params, searchParams }: PageProps) {
  return (
    <div className="container-padding">
      {/* Page content */}
    </div>
  );
}
```

### API Route Structure
```typescript
// src/app/api/[endpoint]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth-utils';

export async function GET(request: NextRequest) {
  try {
    // Authentication check
    const user = await verifyAuth(request);
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Business logic
    const data = await fetchData();

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

## 🔧 Utility Libraries (`src/lib/`)

```
lib/
├── 📄 auth-utils.ts             # Authentication utilities ⭐ ENHANCED
├── 📄 db.ts                     # Database connection (Prisma)
├── 📄 utils.ts                  # General utilities (cn, etc.)
├── 📄 validations.ts            # Zod validation schemas
├── 📄 constants.ts              # Application constants
├── 📄 email.ts                  # Email service utilities
├── 📄 payment.ts                # Payment gateway utilities
└── 📄 upload.ts                 # File upload utilities
```

## 🏪 State Management (`src/store/`)

```
store/
├── 📄 cart-store.ts             # Shopping cart state ⭐ ENHANCED
├── 📄 auth-store.ts             # Authentication state
├── 📄 ui-store.ts               # UI state (modals, etc.)
└── 📄 order-store.ts            # Order management state
```

### Cart Store Structure
```typescript
interface CartStore {
  items: CartItem[];
  addItem: (test: Test) => void;
  removeItem: (testId: string) => void;
  updateQuantity: (testId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}
```

## 📝 Type Definitions (`src/types/`)

```
types/
├── 📄 auth.d.ts                 # Authentication types
├── 📄 api.d.ts                  # API response types
├── 📄 checkout.d.ts             # Checkout system types ⭐ NEW
├── 📄 database.d.ts             # Database model types
├── 📄 forms.d.ts                # Form-related types
└── 📄 global.d.ts               # Global type definitions
```

### Checkout Types (NEW)
```typescript
// src/types/checkout.d.ts
interface CheckoutFormData {
  addressId: string;
  selectedDate: string;
  selectedTime: string;
  paymentMethod: 'razorpay' | 'cod';
}

interface OrderCreateRequest {
  items: Array<{
    testId: string;
    quantity: number;
    price: number;
  }>;
  addressId: string;
  scheduledDate: string;
  scheduledTime: string;
  paymentMethod: string;
  totalAmount: number;
}
```

## 🎨 Styling Organization

### Global Styles (`src/app/globals.css`)
```css
/* Tailwind directives */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Medical design system variables */
:root {
  --primary: 220 70% 50%;
  --medical-success: 142 76% 36%;
  --medical-warning: 38 92% 50%;
  --medical-error: 0 84% 60%;
}

/* Custom component classes */
@layer components {
  .medical-card {
    @apply bg-white rounded-lg border border-medical-border shadow-sm;
  }
  
  .container-padding {
    @apply px-4 sm:px-6 lg:px-8;
  }
}
```

### Tailwind Configuration (`tailwind.config.js`)
```javascript
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Medical color system
        'medical-success': 'hsl(142 76% 36%)',
        'medical-warning': 'hsl(38 92% 50%)',
        'medical-error': 'hsl(0 84% 60%)',
      }
    }
  }
}
```

## 🔐 Authentication Flow

### Middleware (`middleware.ts`)
```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Protected routes
  const protectedPaths = ['/checkout', '/profile', '/orders'];
  
  // Admin routes
  const adminPaths = ['/admin'];
  
  // Authentication logic
  // ...
}
```

### Auth Context (`src/contexts/auth-context.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
}
```

## 📊 Database Schema Organization

### Prisma Schema (`prisma/schema.prisma`)
```prisma
// Core entities
model User { ... }
model Test { ... }
model Category { ... }

// Order system ⭐ ENHANCED
model Order { ... }
model OrderItem { ... }
model HomeVisit { ... }

// Supporting entities
model Address { ... }
model Report { ... }
model Coupon { ... }
```

## 🚀 Build and Deployment

### Package Scripts (`package.json`)
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "type-check": "tsc --noEmit",
    "db:push": "prisma db push",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate"
  }
}
```

### Environment Configuration
```bash
# Development
.env.local          # Local environment variables
.env.example        # Template for environment variables

# Production
vercel.json         # Vercel deployment configuration
```

## 📁 File Naming Conventions

### Components
```
PascalCase.tsx      # React components
kebab-case.tsx      # File names (alternative)
index.tsx           # Barrel exports
```

### Pages (App Router)
```
page.tsx            # Page components
layout.tsx          # Layout components
loading.tsx         # Loading UI
error.tsx           # Error UI
not-found.tsx       # 404 UI
route.ts            # API routes
```

### Utilities and Libraries
```
camelCase.ts        # Utility functions
kebab-case.ts       # File names
constants.ts        # Constants
types.d.ts          # Type definitions
```

## 🔍 Import Organization

### Import Order
```typescript
// 1. React and Next.js
import React from 'react';
import { NextRequest, NextResponse } from 'next/server';

// 2. Third-party libraries
import { z } from 'zod';
import { prisma } from '@prisma/client';

// 3. Internal components
import { Button } from '@/components/ui/button';
import { SmartFormField } from '@/components/forms/smart-form-field';

// 4. Utilities and hooks
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';

// 5. Types
import type { User, Order } from '@/types/database';
```

### Path Aliases (`tsconfig.json`)
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/types/*": ["./src/types/*"]
    }
  }
}
```

## 📈 Scalability Considerations

### Feature Modules
```
src/features/
├── checkout/
│   ├── components/
│   ├── hooks/
│   ├── types/
│   └── utils/
├── orders/
└── tests/
```

### Micro-Frontend Preparation
```
src/modules/
├── checkout-module/
├── admin-module/
└── patient-module/
```

## 🧪 Testing Structure

```
__tests__/
├── components/
├── pages/
├── api/
└── utils/

# Or co-located
src/components/
├── Button.tsx
├── Button.test.tsx
└── Button.stories.tsx
```

## 📚 Documentation Structure

```
docs/
├── API_DOCUMENTATION.md         # API endpoints
├── CHECKOUT_SYSTEM.md           # Checkout system
├── DESIGN_SYSTEM.md             # Design system
├── DEPLOYMENT.md                # Deployment guide
├── PROJECT_STRUCTURE.md         # This file
└── TECH_STACK.md                # Technology stack
```

---

## 🎯 Quick Reference

### Key Directories
- `src/app/` - Pages and API routes (App Router)
- `src/components/` - Reusable UI components
- `src/lib/` - Utility functions and configurations
- `src/store/` - State management (Zustand)
- `src/types/` - TypeScript type definitions

### New Checkout System Files
- `src/app/checkout/page.tsx` - Main checkout page
- `src/components/ui/alert.tsx` - Alert component
- `src/components/forms/smart-form-field.tsx` - Enhanced form field
- `src/components/forms/progress-indicator.tsx` - Progress indicator
- `src/components/forms/trust-indicators.tsx` - Security badges
- `src/components/forms/mobile-checkout-footer.tsx` - Mobile footer

### Configuration Files
- `tailwind.config.js` - Tailwind CSS configuration
- `next.config.js` - Next.js configuration
- `tsconfig.json` - TypeScript configuration
- `prisma/schema.prisma` - Database schema
- `middleware.ts` - Route protection and authentication

This structure ensures maintainability, scalability, and developer productivity while following Next.js 14 best practices and medical industry standards. 