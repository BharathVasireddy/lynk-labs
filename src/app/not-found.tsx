"use client";

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, TestTube } from 'lucide-react';

export default function NotFound() {
  // Set page metadata on client side
  useEffect(() => {
    document.title = 'Page Not Found - Lynk Labs';
    
    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', 'The page you are looking for could not be found. Return to Lynk Labs homepage or browse our lab tests.');
    }
    
    // Update robots meta
    const metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', 'noindex, follow');
    }
  }, []);

  return (
    <div className="min-h-screen medical-background flex items-center justify-center">
      <div className="container-padding w-full">
        <div className="max-w-2xl mx-auto text-center">
          {/* 404 Number */}
          <div className="inline-flex items-center justify-center w-32 h-32 bg-primary/10 rounded-full mb-6">
            <span className="text-6xl font-bold text-primary">404</span>
          </div>
          
          {/* Title and Description */}
          <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4">Page Not Found</h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            We couldn't find the page you're looking for. It might have been moved, deleted, or you entered the wrong URL.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/" className="medical-button-primary h-12 px-6 py-3">
              <Home className="h-4 w-4 mr-2" />
              Go to Homepage
            </Link>
            <Link href="/tests" className="medical-button-outline h-12 px-6 py-3">
              <TestTube className="h-4 w-4 mr-2" />
              Browse Lab Tests
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 