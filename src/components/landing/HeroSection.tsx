"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Shield, Star, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/50 to-teal-50/30">
      {/* Decorative elements */}
      <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 left-10 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl" />

      <div className="container-padding relative py-24 lg:py-32">
        <div className="max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm border border-primary/20 rounded-full mb-8 shadow-sm">
            <Shield className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">NABL & ISO 15189 Accredited Laboratory</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-slate-900 mb-6 leading-[1.1]">
            Your Health,
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-teal-500 to-primary"> Our Priority</span>
          </h1>

          {/* Subheadline */}
          <p className="text-lg md:text-xl lg:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
            Book lab tests online with home sample collection, get fast accurate results,
            and take control of your health journey with Lynk Labs.
          </p>

          {/* Key benefits */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-10">
            {[
              "Free Home Collection",
              "500+ Tests Available",
              "Reports in 24-48 hrs"
            ].map((benefit, index) => (
              <div key={index} className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <span className="text-slate-700 font-medium">{benefit}</span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button size="lg" className="bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-white px-10 py-7 text-lg font-semibold rounded-xl shadow-xl shadow-primary/25" asChild>
              <Link href="/tests">
                Book Lab Tests
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" className="px-10 py-7 text-lg font-semibold rounded-xl border-2 hover:bg-white" asChild>
              <Link href="/packages">View Health Packages</Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8 border-t border-slate-200/50">
            <div className="flex items-center gap-3">
              <div className="flex -space-x-3">
                <Image
                  src="/images/indian_customer_1_1767874102475.png"
                  alt="Happy customer"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md"
                />
                <Image
                  src="/images/indian_customer_2_1767874119618.png"
                  alt="Happy customer"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md"
                />
                <Image
                  src="/images/indian_customer_3_1767874137551.png"
                  alt="Happy customer"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md"
                />
                <Image
                  src="/images/indian_customer_4_1767874166512.png"
                  alt="Happy customer"
                  width={44}
                  height={44}
                  className="w-11 h-11 rounded-full border-2 border-white object-cover shadow-md"
                />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">50,000+</p>
                <p className="text-xs text-slate-500">Happy Customers</p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">4.9/5</p>
                <p className="text-xs text-slate-500">2,500+ Reviews</p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block" />

            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="text-left">
                <p className="text-sm font-bold text-slate-900">Email Support</p>
                <p className="text-xs text-slate-500">Quick Response</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
