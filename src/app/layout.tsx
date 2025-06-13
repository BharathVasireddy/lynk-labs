import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'Lynk Labs - Professional Lab Testing Services',
    template: '%s | Lynk Labs'
  },
  description: 'Professional lab testing services with home sample collection, fast results, and comprehensive health checkups. Book your lab tests online with Lynk Labs.',
  keywords: [
    'lab tests',
    'blood tests',
    'health checkup',
    'diagnostic tests',
    'home sample collection',
    'medical tests',
    'pathology',
    'laboratory services'
  ],
  authors: [{ name: 'Lynk Labs' }],
  creator: 'Lynk Labs',
  publisher: 'Lynk Labs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lynklabs.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://lynklabs.com',
    title: 'Lynk Labs - Professional Lab Testing Services',
    description: 'Professional lab testing services with home sample collection, fast results, and comprehensive health checkups.',
    siteName: 'Lynk Labs',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Lynk Labs - Professional Lab Testing Services',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lynk Labs - Professional Lab Testing Services',
    description: 'Professional lab testing services with home sample collection, fast results, and comprehensive health checkups.',
    images: ['/og-image.jpg'],
    creator: '@lynklabs',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={plusJakartaSans.variable}>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="theme-color" content="#0ea5e9" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={`${plusJakartaSans.className} antialiased`}>
        <AuthProvider>
          <ConditionalLayout>
            {children}
          </ConditionalLayout>
          <Toaster />
          <div id="modal-root" />
        </AuthProvider>
      </body>
    </html>
  )
} 