"use client";

import { Award, Shield, CheckCircle, BadgeCheck } from "lucide-react";

const certifications = [
    { name: "NABL Accredited", icon: Award, description: "National Board Certified" },
    { name: "ISO 15189", icon: Shield, description: "International Standards" },
    { name: "CAP Approved", icon: CheckCircle, description: "Quality Assurance" },
    { name: "HIPAA Compliant", icon: BadgeCheck, description: "Data Protection" }
];

export function TrustIndicatorsSection() {
    return (
        <section className="py-16 bg-white border-y border-slate-100">
            <div className="container-padding">
                <div className="text-center mb-10">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                        Trusted by Healthcare Professionals
                    </h3>
                    <p className="text-slate-500">
                        Our certifications ensure the highest standards of quality and reliability
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
                    {certifications.map((cert, index) => {
                        const Icon = cert.icon;
                        return (
                            <div key={index} className="group text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:border-primary/30 group-hover:shadow-lg group-hover:shadow-primary/5 transition-all duration-300 group-hover:scale-105">
                                    <Icon className="h-8 w-8 text-primary" />
                                </div>
                                <div className="font-bold text-slate-900 mb-1">{cert.name}</div>
                                <div className="text-xs text-slate-500">{cert.description}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
