import type { Metadata } from 'next'
import { Plus_Jakarta_Sans } from 'next/font/google'
import './globals.css'
import { ConditionalLayout } from '@/components/layout/ConditionalLayout'
import { Toaster } from '@/components/ui/toaster'
import { AuthProvider } from '@/contexts/auth-context'
import { ToastProvider } from '@/contexts/toast-context'
import { GoogleAnalytics } from '@next/third-parties/google'

const plusJakartaSans = Plus_Jakarta_Sans({ 
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta-sans',
})

export const metadata: Metadata = {
  title: {
    template: '%s | Lynk Labs - Hyderabad\'s #1 Diagnostic Lab',
    default: 'Lynk Labs - Best Medical Tests & Health Checkups in Hyderabad | NABL Accredited Lab'
  },
  description: 'Hyderabad\'s leading diagnostic laboratory offering comprehensive medical tests, health checkup packages, and free home sample collection. NABL accredited labs with 24-48 hours results. Serving Banjara Hills, Jubilee Hills, HITEC City, Gachibowli, Secunderabad and all areas of Hyderabad, Telangana.',
  keywords: 'medical tests Hyderabad, lab tests Hyderabad, health checkup packages Hyderabad, diagnostic services Hyderabad, blood tests Hyderabad, NABL accredited labs Hyderabad, home collection Hyderabad, pathology lab Hyderabad, clinical laboratory Hyderabad, medical testing Hyderabad, health screening Hyderabad, preventive health checkup Hyderabad, executive health checkup Hyderabad, comprehensive health package Hyderabad, diagnostic lab Banjara Hills, medical tests Jubilee Hills, lab tests HITEC City, health checkup Gachibowli, diagnostic services Secunderabad, medical laboratory Telangana, India',
  authors: [{ name: 'Lynk Labs' }],
  creator: 'Lynk Labs',
  publisher: 'Lynk Labs',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://lynklabs.in'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Lynk Labs - Best Medical Tests & Health Checkups in Hyderabad | NABL Accredited',
    description: 'Hyderabad\'s leading diagnostic laboratory with NABL accredited labs, free home sample collection, and 24-48 hours results. Comprehensive health checkup packages available.',
    type: 'website',
    locale: 'en_IN',
    url: 'https://lynklabs.in',
    siteName: 'Lynk Labs',
    images: [
      {
        url: '/images/og-lynk-labs-hyderabad.jpg',
        width: 1200,
        height: 630,
        alt: 'Lynk Labs - Best Diagnostic Lab in Hyderabad'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lynk Labs - Hyderabad\'s #1 Diagnostic Laboratory',
    description: 'NABL accredited diagnostic lab in Hyderabad with free home sample collection, comprehensive health checkup packages, and fastest results.',
    images: ['/images/twitter-lynk-labs-hyderabad.jpg'],
    creator: '@lynklabs',
    site: '@lynklabs'
  },
  robots: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
    'max-video-preview': -1,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code'
  },
  other: {
    'geo.region': 'IN-TG',
    'geo.placename': 'Hyderabad',
    'geo.position': '17.4485;78.3908',
    'ICBM': '17.4485, 78.3908',
    'business:contact_data:street_address': 'Hi-Tech City',
    'business:contact_data:locality': 'Hyderabad',
    'business:contact_data:region': 'Telangana',
    'business:contact_data:postal_code': '500081',
    'business:contact_data:country_name': 'India',
    'business:contact_data:phone_number': '+91-1800-123-4567',
    'business:contact_data:email': 'support@lynklabs.in'
  }
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
        <link rel="canonical" href="https://lynklabs.in" />
        
        {/* Preconnect to external domains for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="preconnect" href="https://images.unsplash.com" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//checkout.razorpay.com" />
        <link rel="dns-prefetch" href="//api.lynklabs.in" />
        
        {/* Structured Data for Organization */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": ["MedicalBusiness", "DiagnosticLab", "HealthcareBusiness"],
              "name": "Lynk Labs",
              "description": "Leading diagnostic laboratory and health checkup services in Hyderabad",
              "url": "https://lynklabs.in",
              "logo": "https://lynklabs.in/images/logo.png",
              "image": "https://lynklabs.in/images/lynk-labs-hyderabad.jpg",
              "telephone": "+91-1800-123-4567",
              "email": "support@lynklabs.in",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Hi-Tech City",
                "addressLocality": "Hyderabad",
                "addressRegion": "Telangana",
                "postalCode": "500081",
                "addressCountry": "IN"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "17.4485",
                "longitude": "78.3908"
              },
              "areaServed": [
                {
                  "@type": "City",
                  "name": "Hyderabad",
                  "containedInPlace": {
                    "@type": "State",
                    "name": "Telangana",
                    "containedInPlace": {
                      "@type": "Country",
                      "name": "India"
                    }
                  }
                }
              ],
              "serviceArea": {
                "@type": "GeoCircle",
                "geoMidpoint": {
                  "@type": "GeoCoordinates",
                  "latitude": "17.4485",
                  "longitude": "78.3908"
                },
                "geoRadius": "50000"
              },
              "openingHours": "Mo-Su 06:00-22:00",
              "priceRange": "₹₹",
              "currenciesAccepted": "INR",
              "paymentAccepted": "Cash, Credit Card, Debit Card, UPI, Net Banking",
              "medicalSpecialty": [
                "Pathology",
                "Clinical Laboratory",
                "Diagnostic Imaging",
                "Preventive Medicine"
              ],
              "availableService": [
                {
                  "@type": "MedicalTest",
                  "name": "Blood Tests",
                  "description": "Comprehensive blood testing services"
                },
                {
                  "@type": "MedicalTest", 
                  "name": "Health Checkup Packages",
                  "description": "Complete health screening packages"
                },
                {
                  "@type": "Service",
                  "name": "Home Sample Collection",
                  "description": "Free home sample collection across Hyderabad"
                }
              ],
              "hasCredential": [
                {
                  "@type": "EducationalOccupationalCredential",
                  "credentialCategory": "NABL Accreditation",
                  "recognizedBy": {
                    "@type": "Organization",
                    "name": "National Accreditation Board for Testing and Calibration Laboratories"
                  }
                },
                {
                  "@type": "EducationalOccupationalCredential", 
                  "credentialCategory": "ISO 15189 Certification",
                  "recognizedBy": {
                    "@type": "Organization",
                    "name": "International Organization for Standardization"
                  }
                }
              ],
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "2847",
                "bestRating": "5",
                "worstRating": "1"
              },
              "sameAs": [
                "https://www.facebook.com/lynklabs",
                "https://www.instagram.com/lynklabs",
                "https://www.linkedin.com/company/lynklabs",
                "https://twitter.com/lynklabs"
              ]
            })
          }}
        />
        
        {/* Website Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              "name": "Lynk Labs",
              "url": "https://lynklabs.in",
              "description": "Leading diagnostic laboratory and health checkup services in Hyderabad, Telangana",
              "publisher": {
                "@type": "Organization",
                "name": "Lynk Labs",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://lynklabs.in/images/logo.png"
                }
              },
              "potentialAction": {
                "@type": "SearchAction",
                "target": "https://lynklabs.in/tests?search={search_term_string}",
                "query-input": "required name=search_term_string"
              }
            })
          }}
        />
      </head>
      <body className={`${plusJakartaSans.className} antialiased`}>
        <AuthProvider>
          <ToastProvider>
            <ConditionalLayout>
              {children}
            </ConditionalLayout>
            <Toaster />
            <div id="modal-root" />
          </ToastProvider>
        </AuthProvider>
        <GoogleAnalytics gaId="G-YOUR-MEASUREMENT-ID" />
      </body>
    </html>
  )
} 