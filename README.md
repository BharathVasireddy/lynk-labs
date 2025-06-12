# Lynk Labs - Comprehensive Lab Testing Platform

Welcome to **Lynk Labs**, a modern, scalable lab testing platform that provides end-to-end diagnostic testing services similar to PharmEasy, Tata 1mg, and Vijaya Diagnostic.

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/lynk-labs.git
cd lynk-labs

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 📚 Documentation

- **[Project Structure](./PROJECT_STRUCTURE.md)** - Complete project architecture and organization
- **[Design System](./DESIGN_SYSTEM.md)** - UI/UX guidelines, components, and styling rules
- **[Development Guide](./DEVELOPMENT_GUIDE.md)** - Step-by-step development tasks and timeline
- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API endpoints and usage
- **[Cursor Rules](./.cursorrules)** - AI assistant instructions for consistent development
- **[Tech Stack](./TECH_STACK.md)** - Technology choices and architecture decisions
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Node.js, Express.js, Prisma ORM
- **Database**: PostgreSQL, Redis
- **Authentication**: NextAuth.js, JWT
- **Payments**: Stripe
- **File Storage**: AWS S3
- **Communications**: Twilio (SMS/WhatsApp), SendGrid (Email)
- **Deployment**: Vercel/AWS

## 🏗 Project Structure

```
lynk-labs/
├── 📁 src/app/              # Next.js App Router
├── 📁 src/components/       # Reusable UI components
├── 📁 src/lib/             # Utilities and configurations
├── 📁 prisma/              # Database schema and migrations
├── 📁 public/              # Static assets
├── 📁 docs/                # Additional documentation
└── 📁 tests/               # Test files
```

## 🎯 Core Features

- **User Management**: Registration, authentication, profile management
- **Test Catalog**: Comprehensive lab test categories and individual tests
- **Shopping Cart**: Add/remove tests, quantity management, save for later
- **Checkout Process**: Slot selection, address management, coupon application
- **Order Management**: Real-time tracking, status updates, notifications
- **Home Visit Service**: Sample collection scheduling with OTP verification
- **Lab Processing**: Status tracking, quality control, result processing
- **Report Management**: Secure upload, download, WhatsApp delivery
- **Admin Dashboard**: Comprehensive analytics, user management, order processing
- **Payment System**: Multiple payment options, invoicing, refunds

## 🚦 Development Status

- [ ] **Phase 1**: Foundation Setup (Weeks 1-2)
- [ ] **Phase 2**: Core Features (Weeks 3-6)
- [ ] **Phase 3**: Advanced Features (Weeks 7-10)
- [ ] **Phase 4**: Admin & Analytics (Weeks 11-12)
- [ ] **Phase 5**: Testing & Deployment (Weeks 13-14)

## 🤝 Contributing

1. Read the [Development Guide](./DEVELOPMENT_GUIDE.md)
2. Follow the [Cursor Rules](./.cursorrules)
3. Check the [API Documentation](./API_DOCUMENTATION.md)
4. Ensure code follows the [Design System](./DESIGN_SYSTEM.md)

## 📝 License

This project is proprietary software owned by Lynk Labs.

## 📞 Support

For technical support or questions, contact the development team at dev@lynklabs.com 