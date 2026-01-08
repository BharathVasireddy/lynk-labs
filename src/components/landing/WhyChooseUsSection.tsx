"use client";

import { Award, Microscope, Users, Clock, Shield, Headphones } from "lucide-react";

const features = [
    {
        icon: Award,
        title: "NABL & ISO Certified",
        description: "Our labs are certified by National Accreditation Board for Testing and Calibration Laboratories (NABL) and ISO 15189 standards."
    },
    {
        icon: Microscope,
        title: "Advanced Technology",
        description: "State-of-the-art equipment and latest diagnostic technologies for precise and reliable results."
    },
    {
        icon: Users,
        title: "Expert Team",
        description: "Qualified pathologists, lab technicians, and healthcare professionals with years of experience."
    },
    {
        icon: Clock,
        title: "Quick Turnaround",
        description: "Fast processing with most results available within 24-48 hours of sample collection."
    },
    {
        icon: Shield,
        title: "Data Security",
        description: "Your health data is protected with bank-level security and HIPAA compliance standards."
    },
    {
        icon: Headphones,
        title: "24/7 Support",
        description: "Round-the-clock customer support to assist you with bookings, reports, and queries."
    }
];

export function WhyChooseUsSection() {
    return (
        <section className="py-20 lg:py-28 bg-white relative overflow-hidden">
            {/* Decorative background */}
            <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-gradient-to-bl from-primary/5 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-gradient-to-tr from-teal-500/5 to-transparent rounded-full blur-3xl" />

            <div className="container-padding relative">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-teal-100 text-teal-700 text-sm font-semibold rounded-full mb-4">
                        Why Choose Us
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Trusted by Thousands of Patients
                    </h2>
                    <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                        We are committed to providing the highest quality diagnostic services with cutting-edge technology,
                        expert care, and unmatched convenience.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <div key={index} className="group relative bg-gradient-to-br from-slate-50 to-white p-8 rounded-2xl border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300">
                                <div className="w-14 h-14 bg-gradient-to-br from-primary/10 to-teal-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <Icon className="h-7 w-7 text-primary" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-slate-600 leading-relaxed">{item.description}</p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
