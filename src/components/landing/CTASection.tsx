"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
    return (
        <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
            <div className="absolute bottom-10 right-10 w-96 h-96 bg-teal-500/5 rounded-full blur-3xl" />

            <div className="container-padding relative">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Left - Image Stack with Real Photos */}
                    <div className="relative">
                        <div className="relative">
                            {/* Main image - Home Collection */}
                            <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="/images/home_collection_1767874204736.png"
                                    alt="Home sample collection service"
                                    width={600}
                                    height={500}
                                    className="w-full h-auto object-cover"
                                />
                            </div>

                            {/* Floating lab technician card */}
                            <div className="absolute -bottom-8 -right-8 z-20 max-w-[200px] hidden md:block">
                                <div className="bg-white rounded-2xl shadow-2xl p-4 border border-slate-100">
                                    <Image
                                        src="/images/lab_technician_1767874184793.png"
                                        alt="Lab technician"
                                        width={180}
                                        height={120}
                                        className="w-full h-28 object-cover rounded-xl mb-3"
                                    />
                                    <p className="text-sm font-bold text-slate-900">Expert Lab Team</p>
                                    <p className="text-xs text-slate-500">NABL certified professionals</p>
                                </div>
                            </div>

                            {/* Floating stats card */}
                            <div className="absolute -top-4 -left-4 z-20 hidden md:block">
                                <div className="bg-gradient-to-br from-primary to-teal-500 rounded-2xl shadow-2xl p-5 text-white">
                                    <div className="flex items-center gap-2 mb-2">
                                        <CheckCircle className="w-5 h-5" />
                                        <span className="font-bold">Results Ready</span>
                                    </div>
                                    <p className="text-3xl font-bold">24 hrs</p>
                                    <p className="text-sm text-white/80">Average delivery time</p>
                                </div>
                            </div>

                            {/* Decorative background */}
                            <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-primary/10 to-teal-500/10 rounded-3xl -z-10" />
                        </div>
                    </div>

                    {/* Right - CTA Content */}
                    <div className="text-center lg:text-left">
                        <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-6">
                            🏥 Start Your Health Journey
                        </span>

                        <h2 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-slate-900 mb-6 leading-tight">
                            Ready to Take Control of Your Health?
                        </h2>

                        <p className="text-lg text-slate-600 mb-8 max-w-lg mx-auto lg:mx-0">
                            Book your lab tests today and get accurate results delivered with our convenient home collection service in Hyderabad.
                        </p>

                        <div className="space-y-4 mb-10">
                            {[
                                "Free home sample collection in Hyderabad",
                                "Reports delivered within 24-48 hours",
                                "Expert pathologist consultation available",
                                "100% accurate & NABL certified results"
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 justify-center lg:justify-start">
                                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                    </div>
                                    <span className="text-slate-700">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <Button size="lg" className="bg-gradient-to-r from-primary to-teal-500 hover:from-primary/90 hover:to-teal-500/90 text-white px-8 py-6 text-base font-semibold rounded-xl shadow-xl shadow-primary/25" asChild>
                                <Link href="/tests">
                                    Book Tests Now
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold rounded-xl border-2" asChild>
                                <Link href="/contact">Talk to an Expert</Link>
                            </Button>
                        </div>

                        {/* Trust indicator */}
                        <div className="flex items-center gap-3 justify-center lg:justify-start mt-8 pt-8 border-t border-slate-100">
                            <div className="flex -space-x-2">
                                <Image src="/images/indian_customer_1_1767874102475.png" alt="Customer" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                                <Image src="/images/indian_customer_2_1767874119618.png" alt="Customer" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                                <Image src="/images/indian_customer_3_1767874137551.png" alt="Customer" width={36} height={36} className="w-9 h-9 rounded-full border-2 border-white object-cover" />
                            </div>
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                                ))}
                            </div>
                            <span className="text-sm text-slate-600">Rated 4.9/5 by 50,000+ customers</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
