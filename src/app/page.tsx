"use client";

import Head from "next/head";
import {
  HeroSection,
  StatsSection,
  CategoriesSection,
  PopularTestsSection,
  WhyChooseUsSection,
  TestimonialsSection,
  HowItWorksSection,
  TrustIndicatorsSection,
  CTASection
} from "@/components/landing";

export default function HomePage() {
  return (
    <div className="flex flex-col">
      <Head>
        <title>Lynk Labs - Trusted Diagnostic Services | Home Sample Collection</title>
        <meta name="description" content="Lynk Labs is a leading provider of diagnostic services. Book lab tests online with home sample collection, get fast accurate results, and take control of your health journey with Lynk Labs." />
        <meta name="keywords" content="Lynk Labs, lab tests, home sample collection, fast accurate results, health journey, NABL accredited lab, ISO 15189 standards, expert care, pathologists, healthcare professionals, blood tests, diabetes panel, thyroid function test, comprehensive health checkup packages, health packages, healthcare services, Hyderabad, India" />
        <meta name="author" content="Lynk Labs" />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Lynk Labs - Trusted Diagnostic Services" />
        <meta property="og:description" content="Book lab tests online with home sample collection. Get fast, accurate results from NABL accredited labs." />
        <meta property="og:image" content="https://www.lynklabs.com/og-image.jpg" />
        <meta property="og:url" content="https://www.lynklabs.com" />
        <meta property="og:site_name" content="Lynk Labs" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@lynklabs" />
        <meta name="twitter:title" content="Lynk Labs - Trusted Diagnostic Services" />
        <meta name="twitter:description" content="Book lab tests online with home sample collection. Get fast, accurate results from NABL accredited labs." />
        <meta name="twitter:image" content="https://www.lynklabs.com/twitter-card.jpg" />
      </Head>

      {/* Hero Section with trust indicators */}
      <HeroSection />

      {/* Stats Banner */}
      <StatsSection />

      {/* Test Categories */}
      <CategoriesSection />

      {/* Popular Tests */}
      <PopularTestsSection />

      {/* Why Choose Us */}
      <WhyChooseUsSection />

      {/* Customer Testimonials */}
      <TestimonialsSection />

      {/* How It Works */}
      <HowItWorksSection />

      {/* Trust Indicators / Certifications */}
      <TrustIndicatorsSection />

      {/* Final CTA */}
      <CTASection />
    </div>
  );
}