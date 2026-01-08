"use client";

import { Mail, MapPin, Clock } from "lucide-react";

const contactItems = [
    {
        icon: Mail,
        title: "Email Us",
        subtitle: "Quick Response",
        value: "support@lynklabs.in",
        href: "mailto:support@lynklabs.in"
    },
    {
        icon: MapPin,
        title: "Visit Us",
        subtitle: "Main Laboratory",
        value: "Hyderabad, India",
        href: "/contact"
    },
    {
        icon: Clock,
        title: "Working Hours",
        subtitle: "Mon - Sun",
        value: "24/7 Available",
        href: "/contact"
    }
];

export function ContactSection() {
    return (
        <section className="py-16 bg-gradient-to-r from-primary via-primary/95 to-teal-600 relative overflow-hidden">
            {/* Decorative pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
                    backgroundSize: '40px 40px'
                }} />
            </div>

            <div className="container-padding relative">
                <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                    {contactItems.map((item, index) => {
                        const Icon = item.icon;
                        return (
                            <a
                                key={index}
                                href={item.href}
                                className="group flex items-center gap-4 p-6 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/10 hover:bg-white/20 hover:border-white/30 transition-all duration-300"
                            >
                                <div className="w-14 h-14 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-colors">
                                    <Icon className="h-7 w-7 text-white" />
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-0.5">{item.title}</h4>
                                    <p className="text-white/70 text-sm mb-1">{item.subtitle}</p>
                                    <p className="text-white font-semibold">{item.value}</p>
                                </div>
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
