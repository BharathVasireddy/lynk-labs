import Head from 'next/head';

interface SEOHeadProps {
  title: string;
  description: string;
  keywords?: string;
  canonicalUrl: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'product';
  schemaData?: any;
  location?: string;
  businessType?: string;
  noindex?: boolean;
}

export function SEOHead({
  title,
  description,
  keywords = '',
  canonicalUrl,
  ogImage = '/images/og-default.jpg',
  ogType = 'website',
  schemaData,
  location = 'Hyderabad',
  businessType = 'HealthcareBusiness',
  noindex = false
}: SEOHeadProps) {
  const fullTitle = title.includes('Lynk Labs') ? title : `${title} | Lynk Labs`;
  const fullDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  
  // Enhanced keywords with Hyderabad focus
  const hyderabadKeywords = keywords 
    ? `${keywords}, Hyderabad, Telangana, India, medical tests Hyderabad, lab tests Hyderabad, diagnostic services Hyderabad`
    : `medical tests Hyderabad, lab tests Hyderabad, diagnostic services Hyderabad, health checkup Hyderabad, blood tests Hyderabad, NABL accredited labs Hyderabad, home collection Hyderabad, Telangana, India`;

  // Local Business Schema for Hyderabad
  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": ["MedicalBusiness", "DiagnosticLab", businessType],
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
    "review": [
      {
        "@type": "Review",
        "author": {
          "@type": "Person",
          "name": "Rajesh Kumar"
        },
        "reviewRating": {
          "@type": "Rating",
          "ratingValue": "5"
        },
        "reviewBody": "Excellent health checkup service in Hyderabad! Professional home collection and accurate results."
      }
    ]
  };

  // Breadcrumb Schema
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://lynklabs.in"
      },
      {
        "@type": "ListItem",
        "position": 2,
        "name": location,
        "item": canonicalUrl
      }
    ]
  };

  // Website Schema
  const websiteSchema = {
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
  };

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={fullDescription} />
      <meta name="keywords" content={hyderabadKeywords} />
      
      {/* Robots */}
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
      <meta name="googlebot" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1,max-video-preview:-1"} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={fullDescription} />
      <meta property="og:image" content={`https://lynklabs.in${ogImage}`} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:site_name" content="Lynk Labs" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={canonicalUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={fullDescription} />
      <meta property="twitter:image" content={`https://lynklabs.in${ogImage}`} />
      
      {/* Geographic Meta Tags */}
      <meta name="geo.region" content="IN-TG" />
      <meta name="geo.placename" content="Hyderabad" />
      <meta name="geo.position" content="17.4485;78.3908" />
      <meta name="ICBM" content="17.4485, 78.3908" />
      
      {/* Business Meta Tags */}
      <meta name="business:contact_data:street_address" content="Hi-Tech City" />
      <meta name="business:contact_data:locality" content="Hyderabad" />
      <meta name="business:contact_data:region" content="Telangana" />
      <meta name="business:contact_data:postal_code" content="500081" />
      <meta name="business:contact_data:country_name" content="India" />
      <meta name="business:contact_data:phone_number" content="+91-1800-123-4567" />
      <meta name="business:contact_data:email" content="support@lynklabs.in" />
      
      {/* Additional SEO Meta Tags */}
      <meta name="author" content="Lynk Labs" />
      <meta name="publisher" content="Lynk Labs" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="7 days" />
      <meta name="distribution" content="web" />
      <meta name="rating" content="general" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(localBusinessSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema)
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(websiteSchema)
        }}
      />
      {schemaData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schemaData)
          }}
        />
      )}
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link rel="preconnect" href="https://images.unsplash.com" />
      
      {/* DNS Prefetch */}
      <link rel="dns-prefetch" href="//checkout.razorpay.com" />
      <link rel="dns-prefetch" href="//api.lynklabs.in" />
    </Head>
  );
} 