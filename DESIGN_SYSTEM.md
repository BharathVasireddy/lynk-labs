# Lynk Labs - Design System

## 🎨 Design System Overview

The Lynk Labs Design System is a comprehensive collection of reusable components, design tokens, and guidelines that ensure consistency across our healthcare platform. Built with accessibility, usability, and medical industry standards in mind.

## 🏥 Medical Design Principles

### 1. **Trust & Reliability**
- Clean, professional aesthetics
- Consistent visual hierarchy
- Clear information architecture
- Minimal cognitive load

### 2. **Accessibility First**
- WCAG 2.1 AA compliance
- High contrast ratios
- Keyboard navigation support
- Screen reader compatibility

### 3. **Data Clarity**
- Clear data presentation
- Logical grouping of information
- Progressive disclosure
- Error prevention and handling

## 🎯 Color System

### Primary Colors
```css
/* Medical Blue Palette */
--primary: 220 70% 50%;           /* #2563eb - Primary blue */
--primary-foreground: 210 40% 98%; /* #f8fafc - Light text on primary */

/* Medical Green Palette */
--medical-success: 142 76% 36%;    /* #16a34a - Success green */
--medical-warning: 38 92% 50%;     /* #eab308 - Warning amber */
--medical-error: 0 84% 60%;        /* #ef4444 - Error red */
```

### Medical Card System
```css
/* Professional Medical Cards */
--medical-card: 0 0% 100%;         /* #ffffff - Clean white background */
--medical-card-hover: 220 14% 96%; /* #f1f5f9 - Subtle hover state */
--medical-border: 220 13% 91%;     /* #e2e8f0 - Professional borders */
```

### Button System
```css
/* Medical Button Variants */
--medical-button-primary: 220 70% 50%;    /* Primary actions */
--medical-button-secondary: 220 13% 91%;  /* Secondary actions */
--medical-button-outline: transparent;     /* Outline buttons */
--medical-button-destructive: 0 84% 60%;  /* Destructive actions */
```

### Typography Colors
```css
--foreground: 222.2 84% 4.9%;      /* #020817 - Primary text */
--muted-foreground: 215.4 16.3% 46.9%; /* #64748b - Secondary text */
--medical-text-light: 215 20.2% 65.1%; /* #94a3b8 - Light text */
```

## 📐 Spacing & Layout

### Container System
```css
/* Consistent container padding */
.container-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

/* Medical card spacing */
.medical-card-padding {
  @apply p-6 sm:p-8;
}

/* Form spacing */
.form-spacing {
  @apply space-y-6;
}
```

### Grid System
```css
/* Responsive grid layouts */
.medical-grid-2 {
  @apply grid grid-cols-1 md:grid-cols-2 gap-6;
}

.medical-grid-3 {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

## 🧩 Component Library

### Core Components

#### Alert Component
Professional alert system for medical applications:

```typescript
interface AlertProps {
  variant?: 'default' | 'destructive' | 'warning' | 'success';
  title?: string;
  children: React.ReactNode;
  className?: string;
}

// Usage
<Alert variant="destructive" title="Error">
  Please check your input and try again.
</Alert>
```

#### SmartFormField Component
Enhanced form field with validation and medical styling:

```typescript
interface SmartFormFieldProps {
  label: string;
  error?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
}

// Usage
<SmartFormField 
  label="Patient Name" 
  error={errors.name} 
  required
>
  <Input {...register('name')} />
</SmartFormField>
```

#### ProgressIndicator Component
Step-by-step progress for medical workflows:

```typescript
interface ProgressIndicatorProps {
  steps: Array<{
    number: number;
    title: string;
    description: string;
  }>;
  currentStep: number;
}

// Usage
<ProgressIndicator 
  steps={checkoutSteps} 
  currentStep={currentStep} 
/>
```

### Checkout System Components

#### TrustIndicators Component
Security and trust badges for medical transactions:

```typescript
interface TrustIndicatorsProps {
  className?: string;
}

// Features:
// - SSL security badge
// - HIPAA compliance indicator
// - Secure payment icons
// - Data protection assurance
```

#### MobileCheckoutFooter Component
Mobile-optimized checkout footer:

```typescript
interface MobileCheckoutFooterProps {
  totalAmount: number;
  onPlaceOrder: () => void;
  isLoading?: boolean;
  disabled?: boolean;
}

// Features:
// - Sticky positioning on mobile
// - Clear total display
// - Prominent action button
// - Loading states
```

## 🎨 Design Patterns

### Medical Card Pattern
```tsx
// Standard medical information card
<div className="bg-white rounded-lg border border-medical-border p-6 shadow-sm hover:shadow-md transition-shadow">
  <div className="flex items-start justify-between mb-4">
    <h3 className="text-lg font-semibold text-foreground">Card Title</h3>
    <Badge variant="secondary">Status</Badge>
  </div>
  <div className="space-y-3">
    {/* Card content */}
  </div>
</div>
```

### Form Validation Pattern
```tsx
// Consistent form validation with medical styling
<div className="space-y-6">
  <SmartFormField 
    label="Required Field" 
    error={errors.field}
    required
  >
    <Input 
      className={cn(
        "transition-colors",
        errors.field && "border-medical-error focus:border-medical-error"
      )}
      {...register('field')}
    />
  </SmartFormField>
</div>
```

### Loading State Pattern
```tsx
// Professional loading states for medical data
<div className="flex items-center justify-center p-8">
  <div className="text-center">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
    <p className="text-muted-foreground">Loading medical data...</p>
  </div>
</div>
```

## 📱 Responsive Design

### Breakpoints
```css
/* Mobile First Approach */
sm: '640px',   /* Small devices */
md: '768px',   /* Medium devices */
lg: '1024px',  /* Large devices */
xl: '1280px',  /* Extra large devices */
2xl: '1536px'  /* 2X large devices */
```

### Mobile Patterns
```tsx
// Mobile-optimized medical forms
<div className="space-y-4 sm:space-y-6">
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {/* Form fields */}
  </div>
</div>

// Mobile checkout footer
<div className="fixed bottom-0 left-0 right-0 bg-white border-t border-medical-border p-4 sm:relative sm:border-0 sm:p-0">
  {/* Mobile checkout actions */}
</div>
```

## ♿ Accessibility Guidelines

### ARIA Labels
```tsx
// Proper ARIA labeling for medical forms
<button 
  aria-label="Place order for medical tests"
  aria-describedby="order-total"
>
  Place Order
</button>

<div id="order-total" className="sr-only">
  Total amount: ₹{totalAmount}
</div>
```

### Focus Management
```tsx
// Proper focus management for medical workflows
<div className="focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2">
  {/* Focusable content */}
</div>
```

### Error Handling
```tsx
// Accessible error messages
<div role="alert" aria-live="polite">
  {error && (
    <Alert variant="destructive">
      <AlertTriangle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{error}</AlertDescription>
    </Alert>
  )}
</div>
```

## 🔧 Implementation Guidelines

### Component Structure
```tsx
// Standard component structure
interface ComponentProps {
  className?: string;
  children?: React.ReactNode;
  // ... other props
}

export function Component({ 
  className, 
  children, 
  ...props 
}: ComponentProps) {
  return (
    <div 
      className={cn("base-classes", className)} 
      {...props}
    >
      {children}
    </div>
  );
}
```

### Styling Conventions
```tsx
// Use cn() utility for conditional classes
className={cn(
  "base-classes",
  variant === "primary" && "primary-classes",
  error && "error-classes",
  className
)}

// Prefer design system colors
className="bg-medical-card border-medical-border text-foreground"

// Use semantic spacing
className="space-y-6 p-6"
```

### State Management
```tsx
// Consistent loading states
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<string>("");

// Clear errors on input change
const clearError = () => setError("");
```

## 📊 Medical Data Presentation

### Test Results Layout
```tsx
// Consistent test result presentation
<div className="bg-medical-card rounded-lg border border-medical-border p-6">
  <div className="flex items-center justify-between mb-4">
    <h3 className="font-semibold text-foreground">Test Name</h3>
    <Badge variant={status === 'normal' ? 'success' : 'warning'}>
      {status}
    </Badge>
  </div>
  <div className="grid grid-cols-3 gap-4 text-sm">
    <div>
      <p className="text-muted-foreground">Value</p>
      <p className="font-medium">{value}</p>
    </div>
    <div>
      <p className="text-muted-foreground">Range</p>
      <p className="font-medium">{range}</p>
    </div>
    <div>
      <p className="text-muted-foreground">Unit</p>
      <p className="font-medium">{unit}</p>
    </div>
  </div>
</div>
```

### Order Status Flow
```tsx
// Visual order status progression
const statusSteps = [
  { status: 'PENDING', label: 'Order Placed', color: 'blue' },
  { status: 'CONFIRMED', label: 'Confirmed', color: 'blue' },
  { status: 'SAMPLE_COLLECTION_SCHEDULED', label: 'Sample Collection Scheduled', color: 'blue' },
  { status: 'SAMPLE_COLLECTED', label: 'Sample Collected', color: 'blue' },
  { status: 'PROCESSING', label: 'Processing', color: 'yellow' },
  { status: 'COMPLETED', label: 'Completed', color: 'green' }
];
```

## 🚀 Performance Guidelines

### Image Optimization
```tsx
// Use Next.js Image component
import Image from 'next/image';

<Image
  src="/medical-icon.png"
  alt="Medical test icon"
  width={48}
  height={48}
  className="rounded-lg"
/>
```

### Code Splitting
```tsx
// Lazy load heavy components
const HeavyMedicalChart = lazy(() => import('./HeavyMedicalChart'));

<Suspense fallback={<ChartSkeleton />}>
  <HeavyMedicalChart data={chartData} />
</Suspense>
```

## 📝 Documentation Standards

### Component Documentation
```tsx
/**
 * SmartFormField - Enhanced form field with validation
 * 
 * @param label - Field label text
 * @param error - Error message to display
 * @param required - Whether field is required
 * @param children - Form input element
 * @param className - Additional CSS classes
 * 
 * @example
 * <SmartFormField label="Patient Name" error={errors.name} required>
 *   <Input {...register('name')} />
 * </SmartFormField>
 */
```

### Usage Examples
Always provide clear usage examples with medical context:

```tsx
// ✅ Good - Medical context
<Alert variant="warning" title="Lab Result Notice">
  Your test results are ready for review. Please consult with your healthcare provider.
</Alert>

// ❌ Avoid - Generic context
<Alert variant="warning">
  Something happened.
</Alert>
```

## 🔄 Version Control

### Component Versioning
- Major version: Breaking changes
- Minor version: New features
- Patch version: Bug fixes

### Changelog Format
```markdown
## [1.2.0] - 2024-01-15
### Added
- New TrustIndicators component for checkout
- Enhanced SmartFormField with medical validation

### Changed
- Updated Alert component with medical variants
- Improved mobile responsiveness for checkout flow

### Fixed
- Fixed form validation error states
- Resolved accessibility issues in ProgressIndicator
```

---

## 🎯 Quick Reference

### Essential Classes
```css
/* Cards */
.medical-card { @apply bg-white rounded-lg border border-medical-border shadow-sm; }
.medical-card-hover { @apply hover:shadow-md transition-shadow; }

/* Buttons */
.medical-button-primary { @apply bg-primary text-primary-foreground hover:bg-primary/90; }
.medical-button-outline { @apply border border-input bg-background hover:bg-accent; }

/* Forms */
.medical-form-field { @apply space-y-2; }
.medical-form-error { @apply text-sm text-medical-error; }

/* Layout */
.container-padding { @apply px-4 sm:px-6 lg:px-8; }
.medical-grid { @apply grid gap-6; }
```

### Color Variables
```css
:root {
  --primary: 220 70% 50%;
  --medical-success: 142 76% 36%;
  --medical-warning: 38 92% 50%;
  --medical-error: 0 84% 60%;
  --medical-card: 0 0% 100%;
  --medical-border: 220 13% 91%;
}
```

This design system ensures consistency, accessibility, and professional medical aesthetics across the entire Lynk Labs platform. 