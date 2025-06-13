# Lynk Labs - Comprehensive Lab Testing Platform

Welcome to **Lynk Labs**, a modern, scalable lab testing platform that provides end-to-end diagnostic testing services similar to PharmEasy, Tata 1mg, and Vijaya Diagnostic.

## 🚀 Production Status

🎉 **Status: PRODUCTION READY & LIVE**  
🌐 **Live URL:** https://lynklabs.cloud9digital.in/  
📊 **Version:** 1.0.0  
🏥 **Tests Available:** 26 medical tests across 10 categories

## 🏗 Project Structure

```
lynk-labs/
├── src/
│   ├── app/              # Next.js App Router pages
│   ├── components/       # Reusable UI components
│   ├── lib/             # Utilities and configurations
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand state management
│   └── types/           # TypeScript definitions
├── prisma/              # Database schema and migrations
├── public/              # Static assets
└── scripts/             # Utility scripts
```

## 🛠 Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: Neon PostgreSQL (Serverless)
- **Authentication**: NextAuth.js, JWT, WhatsApp OTP
- **Payments**: Razorpay, Stripe
- **File Storage**: Local Storage (Vercel)
- **Deployment**: Vercel (Production)

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/your-org/lynk-labs.git
cd lynk-labs

# Install dependencies
npm install

# Set up environment variables
cp env.example .env.local
# Edit .env.local with your configuration

# Set up database
npx prisma generate
npx prisma db push
npx prisma db seed

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the application.

## 🎯 Core Features

### Customer Features
- **User Authentication**: WhatsApp OTP-based login
- **Test Catalog**: Browse 26 medical tests across 10 categories
- **Shopping Cart**: Add/remove tests with quantity management
- **Address Management**: Multiple delivery addresses
- **Home Visit Booking**: Schedule sample collection
- **Order Tracking**: Real-time status updates
- **Report Access**: Secure download and WhatsApp delivery

### Admin Features
- **Dashboard Analytics**: Business metrics and insights
- **Order Management**: Complete order lifecycle control
- **User Management**: Customer and agent administration
- **Report Delivery**: Upload and distribution system
- **Test Catalog**: Manage tests and pricing
- **Home Visit Management**: Agent assignment and tracking

## 📚 Essential Documentation

- **[API Documentation](./API_DOCUMENTATION.md)** - Complete API endpoints reference
- **[Tech Stack Details](./TECH_STACK.md)** - Technology choices and architecture
- **[Deployment Guide](./DEPLOYMENT.md)** - Production deployment instructions
- **[Cursor Rules](./.cursorrules)** - AI assistant development guidelines

## 👥 Admin Access

```
Phone: +919999999999
Role: ADMIN
Access: Use WhatsApp OTP for secure login
```

## 🔧 Development Commands

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npm run db:push      # Push schema changes
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # TypeScript checking
```

## 🚦 Development Status

- ✅ **Phase 1**: Foundation Setup - **COMPLETE**
- ✅ **Phase 2**: Core Features - **COMPLETE**
- ✅ **Phase 3**: Advanced Features - **COMPLETE**
- ✅ **Phase 4**: Admin & Analytics - **COMPLETE**
- ✅ **Phase 5**: Production Deployment - **COMPLETE**

## 📈 Future Roadmap

### Q1 2025 - User Experience
- Mobile app development (React Native)
- AI-powered test recommendations
- Multi-language support
- Advanced analytics dashboard

### Q2 2025 - Business Growth
- Multi-city expansion features
- Corporate health programs
- Partnership integrations
- Advanced reporting features

## 🤝 Contributing

1. Follow the [Cursor Rules](./.cursorrules) for consistent development
2. Check the [API Documentation](./API_DOCUMENTATION.md) for endpoint guidelines
3. Ensure code follows TypeScript best practices
4. Test thoroughly before submitting PRs

## 📝 License

This project is proprietary software owned by Lynk Labs.

## 📞 Support

For technical support or questions, contact the development team at dev@lynklabs.com 