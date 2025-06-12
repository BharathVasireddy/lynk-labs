# Lynk Labs - Project Structure

## 📋 Overview

Lynk Labs is a comprehensive lab testing platform built with Next.js 14, providing end-to-end diagnostic testing services similar to PharmEasy, Tata 1mg, and Vijaya Diagnostic. The platform follows modern web development practices with a focus on scalability, security, and user experience.

## 🏗 Architecture Overview

```
lynk-labs/
├── 📁 src/                          # Source code
│   ├── 📁 app/                      # Next.js App Router
│   │   ├── 📁 (auth)/               # Authentication routes group
│   │   │   ├── 📁 login/            # Login page
│   │   │   ├── 📁 register/         # Registration page
│   │   │   ├── 📁 forgot-password/  # Password reset
│   │   │   └── 📁 verify-otp/       # OTP verification
│   │   ├── 📁 (dashboard)/          # Protected dashboard routes
│   │   │   ├── 📁 profile/          # User profile management
│   │   │   ├── 📁 orders/           # Order history and tracking
│   │   │   ├── 📁 reports/          # Lab reports download
│   │   │   └── 📁 addresses/        # Address management
│   │   ├── 📁 (admin)/              # Admin panel routes
│   │   │   ├── 📁 dashboard/        # Admin dashboard
│   │   │   ├── 📁 orders/           # Order management
│   │   │   ├── 📁 users/            # User management
│   │   │   ├── 📁 tests/            # Test catalog management
│   │   │   ├── 📁 home-visits/      # Home visit scheduling
│   │   │   ├── 📁 reports/          # Report upload/management
│   │   │   └── 📁 analytics/        # Business analytics
│   │   ├── 📁 api/                  # API routes
│   │   │   ├── 📁 auth/             # Authentication endpoints
│   │   │   ├── 📁 users/            # User management API
│   │   │   ├── 📁 tests/            # Test catalog API
│   │   │   ├── 📁 categories/       # Category management API
│   │   │   ├── 📁 cart/             # Shopping cart API
│   │   │   ├── 📁 orders/           # Order management API
│   │   │   ├── 📁 payments/         # Payment processing API
│   │   │   ├── 📁 home-visits/      # Home visit API
│   │   │   ├── 📁 reports/          # Report management API
│   │   │   ├── 📁 notifications/    # Notification API
│   │   │   ├── 📁 coupons/          # Coupon management API
│   │   │   └── 📁 analytics/        # Analytics API
│   │   ├── 📁 tests/                # Test catalog pages
│   │   │   ├── 📁 [category]/       # Category-wise test listing
│   │   │   └── 📁 [slug]/           # Individual test details
│   │   ├── 📁 cart/                 # Shopping cart page
│   │   ├── 📁 checkout/             # Checkout process
│   │   ├── 📁 payment/              # Payment processing
│   │   ├── 📁 success/              # Order success page
│   │   ├── 📁 search/               # Test search results
│   │   ├── globals.css              # Global styles
│   │   ├── layout.tsx               # Root layout
│   │   ├── page.tsx                 # Homepage
│   │   ├── loading.tsx              # Global loading UI
│   │   ├── error.tsx                # Global error UI
│   │   └── not-found.tsx            # 404 page
│   ├── 📁 components/               # Reusable UI components
│   │   ├── 📁 ui/                   # Base UI components (shadcn/ui)
│   │   │   ├── button.tsx           # Button component
│   │   │   ├── input.tsx            # Input component
│   │   │   ├── card.tsx             # Card component
│   │   │   ├── dialog.tsx           # Modal/Dialog component
│   │   │   ├── form.tsx             # Form components
│   │   │   ├── table.tsx            # Table component
│   │   │   ├── badge.tsx            # Badge component
│   │   │   ├── alert.tsx            # Alert component
│   │   │   └── ...                  # Other UI primitives
│   │   ├── 📁 forms/                # Form components
│   │   │   ├── login-form.tsx       # Login form
│   │   │   ├── register-form.tsx    # Registration form
│   │   │   ├── checkout-form.tsx    # Checkout form
│   │   │   ├── address-form.tsx     # Address form
│   │   │   └── profile-form.tsx     # Profile update form
│   │   ├── 📁 layout/               # Layout components
│   │   │   ├── header.tsx           # Site header
│   │   │   ├── footer.tsx           # Site footer
│   │   │   ├── navbar.tsx           # Navigation bar
│   │   │   ├── sidebar.tsx          # Admin sidebar
│   │   │   └── breadcrumb.tsx       # Breadcrumb navigation
│   │   ├── 📁 test/                 # Test-related components
│   │   │   ├── test-card.tsx        # Test display card
│   │   │   ├── test-list.tsx        # Test listing
│   │   │   ├── category-grid.tsx    # Category display
│   │   │   ├── test-filters.tsx     # Search/filter components
│   │   │   └── test-search.tsx      # Test search component
│   │   ├── 📁 cart/                 # Cart-related components
│   │   │   ├── cart-item.tsx        # Cart item component
│   │   │   ├── cart-summary.tsx     # Cart total summary
│   │   │   ├── add-to-cart.tsx      # Add to cart button
│   │   │   └── cart-drawer.tsx      # Cart side drawer
│   │   ├── 📁 order/                # Order-related components
│   │   │   ├── order-card.tsx       # Order display card
│   │   │   ├── order-status.tsx     # Order status indicator
│   │   │   ├── order-timeline.tsx   # Order progress timeline
│   │   │   └── order-tracking.tsx   # Order tracking component
│   │   ├── 📁 admin/                # Admin-specific components
│   │   │   ├── dashboard-stats.tsx  # Dashboard statistics
│   │   │   ├── order-management.tsx # Order management table
│   │   │   ├── user-management.tsx  # User management interface
│   │   │   ├── test-management.tsx  # Test catalog management
│   │   │   └── analytics-charts.tsx # Analytics visualizations
│   │   └── 📁 common/               # Common components
│   │       ├── loading-spinner.tsx  # Loading component
│   │       ├── error-boundary.tsx   # Error boundary
│   │       ├── pagination.tsx       # Pagination component
│   │       ├── search-bar.tsx       # Global search
│   │       └── notification.tsx     # Notification component
│   ├── 📁 lib/                      # Utilities and configurations
│   │   ├── 📁 auth/                 # Authentication utilities
│   │   │   ├── config.ts            # Auth configuration
│   │   │   ├── providers.ts         # Auth providers setup
│   │   │   └── utils.ts             # Auth helper functions
│   │   ├── 📁 db/                   # Database utilities
│   │   │   ├── connection.ts        # Database connection
│   │   │   ├── migrations.ts        # Migration utilities
│   │   │   └── seed.ts              # Database seeding
│   │   ├── 📁 payment/              # Payment processing
│   │   │   ├── stripe.ts            # Stripe integration
│   │   │   ├── razorpay.ts          # Razorpay integration
│   │   │   └── webhook.ts           # Payment webhooks
│   │   ├── 📁 notification/         # Notification services
│   │   │   ├── email.ts             # Email service (SendGrid)
│   │   │   ├── sms.ts               # SMS service (Twilio)
│   │   │   └── whatsapp.ts          # WhatsApp service
│   │   ├── 📁 storage/              # File storage utilities
│   │   │   ├── aws-s3.ts            # AWS S3 integration
│   │   │   └── upload.ts            # File upload utilities
│   │   ├── utils.ts                 # General utilities
│   │   ├── constants.ts             # App constants
│   │   ├── validations.ts           # Zod validation schemas
│   │   └── hooks.ts                 # Custom React hooks
│   ├── 📁 hooks/                    # Custom React hooks
│   │   ├── use-auth.ts              # Authentication hook
│   │   ├── use-cart.ts              # Cart management hook
│   │   ├── use-orders.ts            # Order management hook
│   │   ├── use-tests.ts             # Test catalog hook
│   │   └── use-notifications.ts     # Notifications hook
│   ├── 📁 store/                    # State management (Zustand)
│   │   ├── auth-store.ts            # Authentication state
│   │   ├── cart-store.ts            # Shopping cart state
│   │   ├── user-store.ts            # User profile state
│   │   └── app-store.ts             # Global app state
│   └── 📁 types/                    # TypeScript type definitions
│       ├── auth.d.ts                # Authentication types
│       ├── user.d.ts                # User-related types
│       ├── test.d.ts                # Test catalog types
│       ├── order.d.ts               # Order-related types
│       ├── payment.d.ts             # Payment types
│       ├── api.d.ts                 # API response types
│       └── global.d.ts              # Global type definitions
├── 📁 prisma/                       # Database schema and migrations
│   ├── schema.prisma                # Prisma schema definition
│   ├── 📁 migrations/               # Database migrations
│   ├── seed.ts                      # Database seeding script
│   └── 📁 data/                     # Seed data files
├── 📁 public/                       # Static assets
│   ├── 📁 images/                   # Image assets
│   │   ├── 📁 logos/                # Company and partner logos
│   │   ├── 📁 tests/                # Test-related images
│   │   ├── 📁 categories/           # Category icons
│   │   └── 📁 ui/                   # UI graphics
│   ├── 📁 icons/                    # Icon files
│   ├── favicon.ico                  # Favicon
│   └── robots.txt                   # SEO robots file
├── 📁 docs/                         # Additional documentation
│   ├── 📁 api/                      # API documentation
│   ├── 📁 deployment/               # Deployment guides
│   └── 📁 user-guides/              # User documentation
├── 📁 tests/                        # Test files
│   ├── 📁 __mocks__/                # Mock files
│   ├── 📁 api/                      # API tests
│   ├── 📁 components/               # Component tests
│   ├── 📁 pages/                    # Page tests
│   └── setup.ts                     # Test setup
├── 📁 scripts/                      # Utility scripts
│   ├── setup-db.sh                  # Database setup script
│   ├── deploy.sh                    # Deployment script
│   └── seed-data.ts                 # Data seeding script
├── .env.example                     # Environment variables template
├── .gitignore                       # Git ignore file
├── next.config.js                   # Next.js configuration
├── tailwind.config.js               # Tailwind CSS configuration
├── tsconfig.json                    # TypeScript configuration
├── package.json                     # Dependencies and scripts
├── README.md                        # Project documentation
├── PROJECT_STRUCTURE.md             # This file
├── DESIGN_SYSTEM.md                 # Design system documentation
├── API_DOCUMENTATION.md             # API documentation
├── DEVELOPMENT_GUIDE.md             # Development guide
├── TECH_STACK.md                    # Technology stack details
├── DEPLOYMENT.md                    # Deployment instructions
└── .cursorrules                     # Cursor AI rules
```

## 🎯 Core Features Architecture

### 1. User Management System
- **Authentication**: NextAuth.js with multiple providers
- **User Profiles**: Personal information, addresses, preferences
- **Role-based Access**: Customer, Admin, Lab Technician, Home Visit Agent

### 2. Test Catalog System
- **Categories**: Hierarchical test categorization
- **Test Details**: Comprehensive test information and pricing
- **Search & Filters**: Advanced search with multiple filters
- **Recommendations**: Personalized test suggestions

### 3. Shopping Cart & Checkout
- **Cart Management**: Add/remove tests, quantity handling
- **Checkout Process**: Multi-step checkout with validation
- **Address Management**: Multiple saved addresses
- **Slot Selection**: Available time slots for home visits
- **Coupon System**: Discount codes and promotional offers

### 4. Order Management
- **Order Processing**: Complete order lifecycle management
- **Status Tracking**: Real-time order status updates
- **Home Visit Scheduling**: Appointment booking and management
- **Sample Collection**: OTP-based verification system
- **Lab Processing**: Internal workflow management

### 5. Report Management
- **Report Upload**: Secure file upload system
- **Report Access**: Secure download with authentication
- **Multi-channel Delivery**: Email, WhatsApp, and portal access
- **Report History**: Complete test history tracking

### 6. Admin Dashboard
- **Analytics**: Comprehensive business metrics
- **Order Management**: Complete order processing workflow
- **User Management**: Customer and staff management
- **Test Management**: Catalog and pricing management
- **Home Visit Management**: Agent scheduling and tracking

## 🔐 Security Architecture

### Authentication & Authorization
- **NextAuth.js**: Secure authentication framework
- **JWT Tokens**: Stateless authentication
- **Role-based Permissions**: Granular access control
- **Session Management**: Secure session handling

### Data Protection
- **Input Validation**: Zod schema validation
- **SQL Injection Prevention**: Prisma ORM protection
- **XSS Protection**: Built-in Next.js security
- **CSRF Protection**: Token-based protection

### File Security
- **Secure Upload**: Validated file uploads
- **Access Control**: Authenticated file access
- **Encryption**: Sensitive data encryption
- **Audit Logging**: Complete activity tracking

## 🚀 Performance Architecture

### Frontend Optimization
- **Static Generation**: Pre-built pages for better performance
- **Image Optimization**: Next.js Image component
- **Code Splitting**: Automatic code splitting
- **Caching Strategy**: Intelligent caching implementation

### Backend Optimization
- **Database Indexing**: Optimized database queries
- **Connection Pooling**: Efficient database connections
- **Caching Layer**: Redis for session and data caching
- **Background Jobs**: Async processing for heavy tasks

### CDN & Storage
- **Static Assets**: CDN delivery for static files
- **File Storage**: AWS S3 for scalable file storage
- **Global Distribution**: Edge locations for better performance

## 📱 Responsive Design Architecture

### Mobile-First Approach
- **Responsive Grid**: Tailwind CSS grid system
- **Touch Optimization**: Mobile-friendly interactions
- **Progressive Enhancement**: Enhanced desktop experience
- **Offline Support**: Service worker implementation

### Cross-Platform Compatibility
- **Browser Support**: Modern browser compatibility
- **Device Testing**: Responsive across all devices
- **Accessibility**: WCAG 2.1 compliance
- **SEO Optimization**: Search engine friendly

## 🔧 Development Workflow

### Code Organization
- **Modular Structure**: Clear separation of concerns
- **Component Reusability**: Shared component library
- **Type Safety**: Full TypeScript implementation
- **Code Quality**: ESLint and Prettier integration

### Testing Strategy
- **Unit Testing**: Component and utility testing
- **Integration Testing**: API and workflow testing
- **E2E Testing**: Complete user journey testing
- **Performance Testing**: Load and stress testing

### Deployment Pipeline
- **CI/CD**: Automated testing and deployment
- **Environment Management**: Development, staging, production
- **Monitoring**: Application performance monitoring
- **Error Tracking**: Real-time error monitoring

## 📊 Data Architecture

### Database Design
- **Relational Structure**: PostgreSQL with proper relationships
- **Data Integrity**: Foreign key constraints and validations
- **Indexing Strategy**: Optimized query performance
- **Backup Strategy**: Automated backup and recovery

### API Design
- **RESTful APIs**: Standard HTTP methods and status codes
- **Documentation**: OpenAPI specification
- **Versioning**: API version management
- **Rate Limiting**: Request throttling and protection

This project structure provides a solid foundation for building a scalable, maintainable, and secure lab testing platform that can grow with your business needs. 