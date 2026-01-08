"use client";

import Image from "next/image";
import { Globe, Calendar, Microscope, FileText, ArrowRight } from "lucide-react";

const steps = [
    {
        step: "01",
        icon: Globe,
        title: "Book Online",
        description: "Choose your tests from our comprehensive catalog and book online in minutes. Select a convenient time slot.",
        image: "/images/book_online_1767877364242.png"
    },
    {
        step: "02",
        icon: Calendar,
        title: "Home Collection",
        description: "Our trained phlebotomist visits your home at the scheduled time for safe and hygienic sample collection.",
        image: "/images/home_collection_1767874204736.png"
    },
    {
        step: "03",
        icon: Microscope,
        title: "Lab Processing",
        description: "Samples are processed in our NABL accredited labs using advanced technology for accurate results.",
        image: "/images/lab_technician_1767874184793.png"
    },
    {
        step: "04",
        icon: FileText,
        title: "Get Reports",
        description: "Receive detailed reports via WhatsApp, email, or download directly from our secure patient portal.",
        image: "/images/get_reports_indian_1767877544956.png"
    }
];

export function HowItWorksSection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Decorative elements */}
            <div className="absolute inset-0 opacity-30">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-3xl" />
            </div>

            <div className="container-padding relative">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-semibold rounded-full mb-4">
                        📋 Simple 4-Step Process
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-slate-300 max-w-2xl mx-auto">
                        Getting your lab tests done is simple and convenient with our streamlined process
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative group">
                                {/* Connector line */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:flex absolute top-14 left-[60%] w-[80%] items-center justify-center">
                                        <div className="w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                                        <ArrowRight className="absolute right-0 w-5 h-5 text-primary/50" />
                                    </div>
                                )}

                                <div className="relative bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:bg-white/10 hover:border-primary/30 transition-all duration-300 h-full">
                                    {/* Step image if available */}
                                    {step.image && (
                                        <div className="relative h-40 overflow-hidden">
                                            <Image
                                                src={step.image}
                                                alt={step.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent" />
                                        </div>
                                    )}

                                    <div className="p-8">
                                        {/* Step number badge */}
                                        <div className="absolute top-4 right-4 text-4xl font-bold text-white/5 group-hover:text-primary/10 transition-colors">
                                            {step.step}
                                        </div>

                                        <div className={`${step.image ? 'relative -mt-12' : ''}`}>
                                            <div className="w-16 h-16 bg-gradient-to-br from-primary to-teal-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/25 group-hover:scale-110 transition-transform">
                                                <Icon className="h-8 w-8 text-white" />
                                            </div>

                                            <h3 className="text-xl font-bold text-white mb-3">
                                                {step.title}
                                            </h3>

                                            <p className="text-slate-400 leading-relaxed">
                                                {step.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
