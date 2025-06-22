import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Health Checkup Packages in Hyderabad | Comprehensive Medical Tests | Lynk Labs',
  description: 'Book comprehensive health checkup packages in Hyderabad with free home collection. NABL accredited labs, 24-48 hours results, expert consultation. Best prices on medical tests.',
  keywords: 'health checkup packages Hyderabad, medical tests Hyderabad, comprehensive health checkup, preventive health screening, blood tests Hyderabad, NABL accredited labs, home collection Hyderabad',
  openGraph: {
    title: 'Health Checkup Packages in Hyderabad | Lynk Labs',
    description: 'Comprehensive health checkup packages with free home collection in Hyderabad. NABL accredited labs, expert consultation, fastest results.',
    url: 'https://lynklabs.in/health-checkup-packages-hyderabad',
    type: 'website',
    images: [
      {
        url: '/images/medical/health-checkup-hyderabad-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Health Checkup Packages in Hyderabad - Lynk Labs'
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Health Checkup Packages in Hyderabad | Lynk Labs',
    description: 'Book comprehensive health checkup packages in Hyderabad with free home collection. NABL accredited labs, expert consultation.',
    images: ['/images/medical/health-checkup-hyderabad-og.jpg'],
  },
  alternates: {
    canonical: 'https://lynklabs.in/health-checkup-packages-hyderabad',
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
};

export default function HealthCheckupPackagesHyderabadLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
} 