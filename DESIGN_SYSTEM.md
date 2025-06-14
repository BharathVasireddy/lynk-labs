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

### Offer Badge Pattern
Professional offer badges for medical pricing:

```tsx
// Medical Offer Badge - Professional gradient design
{test.discountPrice && (
  <div className="flex-shrink-0">
    <div className="relative">
      <div className="bg-gradient-to-r from-primary to-primary/80 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
        <div className="flex items-center gap-1">
          <span className="text-xs">💰</span>
          <span>{calculateDiscount(test.price, test.discountPrice)}% OFF</span>
        </div>
      </div>
      <div className="absolute -bottom-1 left-3 w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-primary/80"></div>
    </div>
  </div>
)}

// Features:
// - Medical blue gradient background (primary to primary/80)
// - White text for high contrast
// - Money emoji for visual appeal
// - Small arrow pointer for professional look
// - Shadow for depth
// - Responsive sizing
```

#### Offer Badge Guidelines
- **Color**: Use medical blue gradient instead of red/destructive variants
- **Typography**: White text on gradient background for readability
- **Icon**: Money emoji (💰) for instant recognition
- **Shape**: Rounded corners with subtle shadow
- **Positioning**: Top-right corner of product cards
- **Animation**: Subtle hover effects with scale-hover class

### Error Page Pattern
Professional error pages with helpful navigation:

```tsx
// 404 Page Structure
<div className="min-h-screen medical-background">
  <div className="container-padding py-12">
    <div className="max-w-4xl mx-auto">
      {/* Error Visual */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-32 h-32 bg-primary/10 rounded-full mb-6">
          <span className="text-6xl font-bold text-primary">404</span>
        </div>
        <h1 className="text-3xl lg:text-4xl font-bold text-foreground">
          Page Not Found
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Helpful error message explaining the situation
        </p>
      </div>

      {/* Navigation Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="medical-card medical-card-hover">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground">Section Title</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Description of what users can find here
            </p>
            <div className="space-y-2">
              <Link href="/path" className="block text-sm text-primary hover:text-primary/80 transition-colors">
                → Link Text
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</div>
```

#### Error Page Features
- **Professional Visual**: Large, clear error code with medical blue styling
- **Helpful Navigation**: Organized cards with relevant links
- **Search Functionality**: Integrated search to help users find what they need
- **Contact Information**: Clear support options with phone and email
- **Accessibility**: Proper heading hierarchy and ARIA labels
- **Mobile Responsive**: Optimized layout for all screen sizes
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

#### LoadingSpinner Component
Professional three-dot loading spinner with medical styling and accessibility:

```typescript
interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  text?: string;
  variant?: "primary" | "white" | "muted";
}

// Usage Examples:
// Full page loading
<LoadingSpinner size="xl" text="Loading medical data..." />

// Section loading
<LoadingSpinner size="lg" text="Processing results..." />

// Card loading
<LoadingSpinner size="md" />
```

#### InlineSpinner Component
Compact three-dot spinner for buttons and inline elements:

```typescript
interface InlineSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "primary" | "white" | "muted";
  className?: string;
}

// Usage Examples:
// Button loading state
<Button disabled={loading}>
  {loading ? (
    <div className="flex items-center gap-2">
      <InlineSpinner size="sm" variant="white" />
      Processing...
    </div>
  ) : (
    "Submit"
  )}
</Button>

// Refresh button
{refreshing ? (
  <InlineSpinner size="sm" variant="primary" className="mr-2" />
) : (
  <RefreshCw className="h-4 w-4 mr-2" />
)}
```

#### Loading State Sizes
```css
/* Spinner container sizes */
sm: "w-4 h-4"    /* For buttons and inline elements */
md: "w-6 h-6"    /* Default size for cards */
lg: "w-8 h-8"    /* For sections and pages */
xl: "w-12 h-12"  /* For full page loading */

/* Individual dot sizes */
sm: "w-1 h-1"    /* Small dots for buttons */
md: "w-1.5 h-1.5" /* Medium dots for cards */
lg: "w-2 h-2"    /* Large dots for sections */
xl: "w-3 h-3"    /* Extra large dots for pages */
```

#### Loading State Variants
```css
/* Spinner variants - Three pulsing dots */
primary: "bg-primary"           /* Default medical blue dots */
white: "bg-white"              /* White dots for dark backgrounds */
muted: "bg-muted-foreground"   /* Subtle gray dots */
```

#### Animation Details
- **Pattern**: Three dots with staggered pulse animation
- **Timing**: 1000ms duration with 200ms delays between dots
- **Professional**: Clean, medical-grade appearance
- **Accessible**: Proper ARIA labels and semantic markup

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