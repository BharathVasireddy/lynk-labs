# Lynk Labs Design System

## 🎨 Overview
Lynk Labs uses a professional, healthcare-focused design system built with **Plus Jakarta Sans** typography, medical-grade color palette, and accessibility-first components. The design emphasizes trust, professionalism, and ease of use for medical diagnostics.

## 🎯 Core Principles

### 1. **Trust & Reliability**
- Medical-grade precision in information display
- Consistent visual hierarchy
- Clear data presentation
- Professional color palette

### 2. **Accessibility First**
- WCAG 2.1 AA compliance
- High contrast ratios
- Keyboard navigation support
- Screen reader optimization

### 3. **Mobile-First Design**
- Responsive across all devices
- Touch-friendly interactions
- Optimized for various screen sizes
- Progressive enhancement

### 4. **Performance-Focused**
- Lightweight components
- Optimized asset loading
- Efficient animations
- Fast interaction feedback

## 🎨 Color System

### Primary Colors
```css
/* Primary Healthcare Blues */
--color-primary-50: #eff6ff;
--color-primary-100: #dbeafe;
--color-primary-200: #bfdbfe;
--color-primary-300: #93c5fd;
--color-primary-400: #60a5fa;
--color-primary-500: #3b82f6;  /* Main Primary */
--color-primary-600: #2563eb;
--color-primary-700: #1d4ed8;
--color-primary-800: #1e40af;
--color-primary-900: #1e3a8a;
--color-primary-950: #172554;
```

### Secondary Colors
```css
/* Healthcare Green (Success) */
--color-secondary-50: #f0fdf4;
--color-secondary-100: #dcfce7;
--color-secondary-200: #bbf7d0;
--color-secondary-300: #86efac;
--color-secondary-400: #4ade80;
--color-secondary-500: #22c55e;  /* Main Secondary */
--color-secondary-600: #16a34a;
--color-secondary-700: #15803d;
--color-secondary-800: #166534;
--color-secondary-900: #14532d;
--color-secondary-950: #052e16;
```

### Semantic Colors
```css
/* Success */
--color-success-50: #f0fdf4;
--color-success-500: #22c55e;
--color-success-600: #16a34a;

/* Warning */
--color-warning-50: #fffbeb;
--color-warning-500: #f59e0b;
--color-warning-600: #d97706;

/* Error */
--color-error-50: #fef2f2;
--color-error-500: #ef4444;
--color-error-600: #dc2626;

/* Info */
--color-info-50: #eff6ff;
--color-info-500: #3b82f6;
--color-info-600: #2563eb;
```

### Neutral Colors
```css
/* Grays */
--color-gray-50: #f9fafb;
--color-gray-100: #f3f4f6;
--color-gray-200: #e5e7eb;
--color-gray-300: #d1d5db;
--color-gray-400: #9ca3af;
--color-gray-500: #6b7280;
--color-gray-600: #4b5563;
--color-gray-700: #374151;
--color-gray-800: #1f2937;
--color-gray-900: #111827;
--color-gray-950: #030712;
```

### Background Colors
```css
/* Backgrounds */
--color-background: #ffffff;
--color-background-secondary: #f9fafb;
--color-background-tertiary: #f3f4f6;
--color-background-accent: #eff6ff;
```

## ✏️ Typography

### Font Stack
```css
/* Primary Font - Inter */
--font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'sans-serif';

/* Monospace Font */
--font-mono: 'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace;
```

### Typography Scale
```css
/* Headings */
.text-h1 {
  font-size: 3rem;      /* 48px */
  line-height: 1.1;
  font-weight: 800;
  letter-spacing: -0.025em;
}

.text-h2 {
  font-size: 2.25rem;   /* 36px */
  line-height: 1.2;
  font-weight: 700;
  letter-spacing: -0.025em;
}

.text-h3 {
  font-size: 1.875rem;  /* 30px */
  line-height: 1.2;
  font-weight: 600;
}

.text-h4 {
  font-size: 1.5rem;    /* 24px */
  line-height: 1.3;
  font-weight: 600;
}

.text-h5 {
  font-size: 1.25rem;   /* 20px */
  line-height: 1.4;
  font-weight: 600;
}

.text-h6 {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.4;
  font-weight: 600;
}

/* Body Text */
.text-lg {
  font-size: 1.125rem;  /* 18px */
  line-height: 1.6;
}

.text-base {
  font-size: 1rem;      /* 16px */
  line-height: 1.6;
}

.text-sm {
  font-size: 0.875rem;  /* 14px */
  line-height: 1.5;
}

.text-xs {
  font-size: 0.75rem;   /* 12px */
  line-height: 1.4;
}

/* Captions */
.text-caption {
  font-size: 0.6875rem; /* 11px */
  line-height: 1.3;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 500;
}
```

### Text Colors
```css
.text-primary { color: var(--color-gray-900); }
.text-secondary { color: var(--color-gray-600); }
.text-tertiary { color: var(--color-gray-500); }
.text-disabled { color: var(--color-gray-400); }
.text-inverse { color: var(--color-gray-50); }
```

## 🔳 Spacing System

### Spacing Scale
```css
/* Spacing Variables */
--space-0: 0;
--space-px: 1px;
--space-0-5: 0.125rem;  /* 2px */
--space-1: 0.25rem;     /* 4px */
--space-1-5: 0.375rem;  /* 6px */
--space-2: 0.5rem;      /* 8px */
--space-2-5: 0.625rem;  /* 10px */
--space-3: 0.75rem;     /* 12px */
--space-3-5: 0.875rem;  /* 14px */
--space-4: 1rem;        /* 16px */
--space-5: 1.25rem;     /* 20px */
--space-6: 1.5rem;      /* 24px */
--space-7: 1.75rem;     /* 28px */
--space-8: 2rem;        /* 32px */
--space-9: 2.25rem;     /* 36px */
--space-10: 2.5rem;     /* 40px */
--space-11: 2.75rem;    /* 44px */
--space-12: 3rem;       /* 48px */
--space-14: 3.5rem;     /* 56px */
--space-16: 4rem;       /* 64px */
--space-20: 5rem;       /* 80px */
--space-24: 6rem;       /* 96px */
--space-28: 7rem;       /* 112px */
--space-32: 8rem;       /* 128px */
```

## 🔘 Component Library

### Buttons

#### Primary Button
```tsx
<button className="btn-primary">
  Book Test
</button>
```

```css
.btn-primary {
  @apply inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold;
  @apply bg-primary-600 text-white border border-transparent rounded-lg;
  @apply hover:bg-primary-700 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-all duration-200 ease-in-out;
}
```

#### Secondary Button
```tsx
<button className="btn-secondary">
  View Details
</button>
```

```css
.btn-secondary {
  @apply inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold;
  @apply bg-white text-primary-700 border border-primary-200 rounded-lg;
  @apply hover:bg-primary-50 focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-all duration-200 ease-in-out;
}
```

#### Outline Button
```tsx
<button className="btn-outline">
  Cancel
</button>
```

```css
.btn-outline {
  @apply inline-flex items-center justify-center px-4 py-2.5 text-sm font-semibold;
  @apply bg-transparent text-gray-700 border border-gray-300 rounded-lg;
  @apply hover:bg-gray-50 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2;
  @apply disabled:opacity-50 disabled:cursor-not-allowed;
  @apply transition-all duration-200 ease-in-out;
}
```

#### Button Sizes
```css
.btn-xs { @apply px-2.5 py-1.5 text-xs; }
.btn-sm { @apply px-3 py-2 text-sm; }
.btn-md { @apply px-4 py-2.5 text-sm; }  /* Default */
.btn-lg { @apply px-6 py-3 text-base; }
.btn-xl { @apply px-8 py-4 text-lg; }
```

### Form Elements

#### Input Field
```tsx
<input className="input-field" type="text" placeholder="Enter your name" />
```

```css
.input-field {
  @apply block w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg;
  @apply bg-white text-gray-900 placeholder-gray-500;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  @apply disabled:bg-gray-50 disabled:text-gray-500;
  @apply transition-colors duration-200;
}

.input-field-error {
  @apply border-red-300 focus:ring-red-500 focus:border-red-500;
}
```

#### Select Field
```tsx
<select className="select-field">
  <option>Choose an option</option>
</select>
```

```css
.select-field {
  @apply block w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg;
  @apply bg-white text-gray-900 focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  @apply disabled:bg-gray-50 disabled:text-gray-500;
  @apply transition-colors duration-200;
}
```

#### Textarea
```tsx
<textarea className="textarea-field" rows={4} placeholder="Enter description"></textarea>
```

```css
.textarea-field {
  @apply block w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg;
  @apply bg-white text-gray-900 placeholder-gray-500;
  @apply focus:ring-2 focus:ring-primary-500 focus:border-primary-500;
  @apply resize-vertical min-h-[100px];
  @apply transition-colors duration-200;
}
```

### Cards

#### Basic Card
```tsx
<div className="card">
  <div className="card-body">
    Content goes here
  </div>
</div>
```

```css
.card {
  @apply bg-white border border-gray-200 rounded-xl shadow-sm;
  @apply transition-shadow duration-200;
}

.card:hover {
  @apply shadow-md;
}

.card-body {
  @apply p-6;
}

.card-header {
  @apply px-6 py-4 border-b border-gray-200;
}

.card-footer {
  @apply px-6 py-4 border-t border-gray-200 bg-gray-50;
}
```

#### Test Card
```tsx
<div className="test-card">
  <div className="test-card-header">
    <h3 className="test-card-title">Complete Blood Count</h3>
    <span className="test-card-price">₹299</span>
  </div>
  <div className="test-card-body">
    <p className="test-card-description">Comprehensive blood analysis...</p>
  </div>
  <div className="test-card-footer">
    <button className="btn-primary">Add to Cart</button>
  </div>
</div>
```

```css
.test-card {
  @apply card hover:shadow-lg hover:border-primary-200;
  @apply transition-all duration-300;
}

.test-card-header {
  @apply flex justify-between items-start p-4;
}

.test-card-title {
  @apply text-lg font-semibold text-gray-900;
}

.test-card-price {
  @apply text-xl font-bold text-primary-600;
}

.test-card-body {
  @apply px-4 pb-4;
}

.test-card-description {
  @apply text-sm text-gray-600 line-clamp-2;
}

.test-card-footer {
  @apply p-4 pt-0;
}
```

### Badges

#### Status Badge
```tsx
<span className="badge badge-success">Available</span>
<span className="badge badge-warning">Processing</span>
<span className="badge badge-error">Unavailable</span>
```

```css
.badge {
  @apply inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full;
}

.badge-success {
  @apply bg-green-100 text-green-800;
}

.badge-warning {
  @apply bg-yellow-100 text-yellow-800;
}

.badge-error {
  @apply bg-red-100 text-red-800;
}

.badge-info {
  @apply bg-blue-100 text-blue-800;
}

.badge-neutral {
  @apply bg-gray-100 text-gray-800;
}
```

### Alerts

#### Alert Component
```tsx
<div className="alert alert-info">
  <div className="alert-icon">ℹ️</div>
  <div className="alert-content">
    <h4 className="alert-title">Information</h4>
    <p className="alert-message">Your test has been scheduled successfully.</p>
  </div>
</div>
```

```css
.alert {
  @apply flex items-start p-4 border rounded-lg;
}

.alert-info {
  @apply bg-blue-50 border-blue-200 text-blue-800;
}

.alert-success {
  @apply bg-green-50 border-green-200 text-green-800;
}

.alert-warning {
  @apply bg-yellow-50 border-yellow-200 text-yellow-800;
}

.alert-error {
  @apply bg-red-50 border-red-200 text-red-800;
}

.alert-icon {
  @apply flex-shrink-0 mr-3 text-lg;
}

.alert-content {
  @apply flex-1;
}

.alert-title {
  @apply font-semibold mb-1;
}

.alert-message {
  @apply text-sm;
}
```

## 🎭 Animation & Transitions

### Standard Transitions
```css
/* Standard easing curves */
--ease-in: cubic-bezier(0.4, 0, 1, 1);
--ease-out: cubic-bezier(0, 0, 0.2, 1);
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1);

/* Standard durations */
--duration-fast: 150ms;
--duration-normal: 250ms;
--duration-slow: 350ms;
```

### Common Animations
```css
.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}

.slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out);
}

.scale-in {
  animation: scaleIn var(--duration-fast) var(--ease-out);
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { transform: translateY(20px); opacity: 0; }
  to { transform: translateY(0); opacity: 1; }
}

@keyframes scaleIn {
  from { transform: scale(0.95); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}
```

## 📱 Responsive Breakpoints

```css
/* Breakpoint system */
--breakpoint-sm: 640px;   /* Mobile landscape */
--breakpoint-md: 768px;   /* Tablet */
--breakpoint-lg: 1024px;  /* Desktop */
--breakpoint-xl: 1280px;  /* Large desktop */
--breakpoint-2xl: 1536px; /* Extra large desktop */
```

### Responsive Utilities
```css
/* Mobile-first responsive classes */
.mobile-only { @apply block sm:hidden; }
.tablet-up { @apply hidden sm:block; }
.desktop-up { @apply hidden lg:block; }
.mobile-tablet { @apply block lg:hidden; }
```

## ♿ Accessibility Guidelines

### Focus States
```css
.focus-ring {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}

.focus-ring-inset {
  @apply focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-inset;
}
```

### Color Contrast
- **AA Standard**: Minimum 4.5:1 for normal text
- **AA Standard**: Minimum 3:1 for large text
- **AAA Standard**: Minimum 7:1 for normal text

### Interactive Elements
- Minimum touch target size: 44x44px
- Clear hover and focus states
- Keyboard navigation support
- Screen reader friendly labels

## 🔧 Implementation Guidelines

### CSS Custom Properties Usage
```css
/* Always use CSS custom properties for consistency */
.component {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  padding: var(--space-4);
  border-radius: var(--radius-lg);
}
```

### Tailwind Configuration
```javascript
// tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: 'var(--color-primary-50)',
          500: 'var(--color-primary-500)',
          // ... other shades
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '0.5': 'var(--space-0-5)',
        '1': 'var(--space-1)',
        // ... other spacing values
      }
    }
  }
}
```

### Component Development Standards
1. **Always use TypeScript interfaces**
2. **Include className prop for customization**
3. **Follow naming conventions**
4. **Add proper accessibility attributes**
5. **Include error and loading states**
6. **Test on multiple devices and screen readers**

This design system ensures consistency, accessibility, and maintainability across the entire Lynk Labs platform. 

## 📝 Typography

### Font Family
- **Primary Font**: Plus Jakarta Sans (Google Fonts)
- **Fallback**: system-ui, sans-serif
- **Implementation**: CSS variable `--font-plus-jakarta-sans`

### Typography Scale
```css
h1: text-3xl md:text-4xl lg:text-5xl font-bold (48-80px)
h2: text-2xl md:text-3xl lg:text-4xl font-semibold (32-64px)
h3: text-xl md:text-2xl lg:text-3xl font-semibold (24-48px)
h4: text-lg md:text-xl lg:text-2xl font-semibold (20-32px)
Body: text-base leading-relaxed (16px, 1.625 line-height)
Small: text-sm (14px)
Caption: text-xs (12px)
```

### Font Weights
- **Regular**: 400
- **Medium**: 500
- **Semibold**: 600
- **Bold**: 700

## 🎨 Color Palette

### Healthcare Primary Colors
```css
/* Medical Blue - Primary Brand Color */
--primary: 199 89% 48% (#0ea5e9)
--primary-foreground: 0 0% 100% (#ffffff)

/* Trust & Professional Colors */
--foreground: 215 25% 27% (#3f4b5c)
--muted-foreground: 215 16% 47% (#6b7785)

/* Background Colors */
--background: 0 0% 100% (#ffffff)
--card: 0 0% 100% (#ffffff)
--muted: 210 40% 96% (#f1f5f9)

/* Border & Input Colors */
--border: 214 32% 91% (#e2e8f0)
--input: 214 32% 91% (#e2e8f0)
--ring: 199 89% 48% (#0ea5e9)
```

### Semantic Colors
```css
/* Success - Medical Green */
--success: 142 76% 36% (#16a34a)
--success-light: #f0fdf4

/* Warning - Medical Amber */
--warning: 35 91% 62% (#f59e0b)
--warning-light: #fffbeb

/* Error - Medical Red */
--error: 0 84% 60% (#ef4444)
--error-light: #fef2f2

/* Info - Medical Blue */
--info: 199 89% 48% (#0ea5e9)
--info-light: #f0f9ff
```

## 🧩 Component System

### Medical Cards
```css
.medical-card {
  /* Base card with healthcare styling */
  @apply bg-card border border-border rounded-xl shadow-sm hover:shadow-md transition-all duration-200;
}

.medical-card-hover {
  /* Interactive card with hover effects */
  @apply medical-card hover:border-primary/20 hover:shadow-lg hover:-translate-y-1;
}
```

### Medical Badges
```css
.medical-badge-primary {
  @apply inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20;
}

.medical-badge-success {
  @apply medical-badge bg-green-50 text-green-700 border border-green-200;
}

.medical-badge-warning {
  @apply medical-badge bg-amber-50 text-amber-700 border border-amber-200;
}

.medical-badge-error {
  @apply medical-badge bg-red-50 text-red-700 border border-red-200;
}
```

### Medical Buttons
```css
.medical-button-primary {
  @apply inline-flex items-center justify-center rounded-lg text-sm font-medium bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-md transition-all duration-200;
}

.medical-button-secondary {
  @apply medical-button bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border;
}

.medical-button-outline {
  @apply medical-button border border-primary text-primary hover:bg-primary hover:text-primary-foreground;
}
```

### Medical Inputs
```css
.medical-input {
  @apply flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2;
}
```

## 🎭 Visual Effects

### Gradients
```css
.medical-gradient {
  @apply bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5;
}

.trust-gradient {
  @apply bg-gradient-to-br from-blue-50 via-sky-50 to-cyan-50;
}
```

### Loading States
```css
.loading-shimmer {
  @apply animate-pulse bg-gradient-to-r from-muted via-muted/50 to-muted;
  animation: shimmer 1.5s infinite;
}
```

### Animations
```css
/* Fade in animation for page elements */
.animate-fade-in {
  animation: fadeIn 0.5s ease-out;
}

/* Slide in animation for sidebars */
.animate-slide-in {
  animation: slideIn 0.3s ease-out;
}
```

## 📐 Spacing & Layout

### Container System
```css
.section-padding {
  @apply px-4 sm:px-6 lg:px-8;
}

.container-padding {
  @apply max-w-7xl mx-auto section-padding;
}
```

### Spacing Scale
- **xs**: 0.25rem (4px)
- **sm**: 0.5rem (8px)
- **md**: 1rem (16px)
- **lg**: 1.5rem (24px)
- **xl**: 2rem (32px)
- **2xl**: 3rem (48px)
- **3xl**: 4rem (64px)

## 🎯 Healthcare Icons

### Icon Sizing
```css
.medical-icon {
  @apply w-5 h-5 text-primary;
}

.medical-icon-lg {
  @apply w-8 h-8 text-primary;
}
```

### Recommended Icons (Lucide React)
- **Medical**: Stethoscope, Heart, Activity, Pill, Syringe
- **Navigation**: Home, Search, User, ShoppingCart, Menu
- **Actions**: Plus, Minus, Edit, Trash, Download
- **Status**: CheckCircle, AlertCircle, XCircle, Clock
- **Interface**: ArrowRight, ChevronDown, Eye, EyeOff

## 🌐 Responsive Design

### Breakpoints
```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

### Mobile-First Approach
All components are designed mobile-first with progressive enhancement:
```css
/* Mobile base styles */
.component {
  @apply text-sm p-4;
}

/* Tablet and up */
@media (min-width: 768px) {
  .component {
    @apply text-base p-6;
  }
}

/* Desktop and up */
@media (min-width: 1024px) {
  .component {
    @apply text-lg p-8;
  }
}
```

## ♿ Accessibility

### Focus States
All interactive elements have visible focus indicators:
```css
*:focus-visible {
  @apply outline-none ring-2 ring-primary ring-offset-2 ring-offset-background;
}
```

### Color Contrast
- All text meets WCAG AA standards (4.5:1 ratio minimum)
- Interactive elements have sufficient contrast
- Error states use both color and text indicators

### Semantic HTML
- Proper heading hierarchy (h1 → h2 → h3)
- Semantic landmarks (header, nav, main, footer)
- ARIA labels for complex interactions
- Alt text for all images

## 🎨 Dark Mode Support

The design system includes comprehensive dark mode support:
```css
.dark {
  --background: 215 28% 17%;
  --foreground: 210 40% 98%;
  --primary: 199 89% 48%;
  /* ... additional dark mode variables */
}
```

## 📱 Component Usage Examples

### Test Card
```tsx
<div className="medical-card-hover p-6 group">
  <h3 className="text-lg font-semibold text-foreground mb-2">
    Complete Blood Count (CBC)
  </h3>
  <div className="flex items-center gap-3 mb-4">
    <span className="text-2xl font-bold text-primary">₹299</span>
    <span className="text-sm text-muted-foreground line-through">₹399</span>
  </div>
  <div className="medical-badge-success mb-4">25% OFF</div>
  <Button className="w-full medical-button-primary">
    Add to Cart
  </Button>
</div>
```

### Feature Section
```tsx
<section className="py-20 bg-background">
  <div className="container-padding">
    <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground text-center">
      Why Choose Lynk Labs?
    </h2>
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
      {/* Feature cards */}
    </div>
  </div>
</section>
```

## 🔧 Implementation Guidelines

### CSS Custom Properties
Always use CSS custom properties for colors:
```css
/* ✅ Correct */
color: hsl(var(--primary));

/* ❌ Incorrect */
color: #0ea5e9;
```

### Component Composition
Build components using the medical design system classes:
```tsx
// ✅ Correct
<Button className="medical-button-primary px-8 py-4">
  Book Test
</Button>

// ❌ Incorrect
<Button className="bg-blue-500 text-white px-8 py-4">
  Book Test
</Button>
```

### Consistent Spacing
Use the spacing scale consistently:
```css
/* ✅ Correct */
@apply mb-6 p-4 gap-8;

/* ❌ Incorrect */
margin-bottom: 25px;
padding: 15px;
gap: 30px;
```

## 📋 Design Checklist

When creating new components, ensure:
- [ ] Uses Plus Jakarta Sans font family
- [ ] Follows healthcare color palette
- [ ] Includes proper focus states
- [ ] Responsive across all breakpoints
- [ ] Meets accessibility standards
- [ ] Uses semantic HTML
- [ ] Includes loading states where applicable
- [ ] Follows consistent spacing scale
- [ ] Uses medical design system classes
- [ ] Includes hover/interaction states

## 🚀 Performance Considerations

### Font Loading
Plus Jakarta Sans is loaded with `display: swap` for optimal performance:
```tsx
const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
})
```

### CSS Optimization
- Uses CSS custom properties for theming
- Leverages Tailwind's purging for minimal bundle size
- Implements efficient animations with `transform` and `opacity`
- Uses `backdrop-filter` for modern blur effects

This design system ensures a consistent, professional, and accessible healthcare experience across the entire Lynk Labs platform. 