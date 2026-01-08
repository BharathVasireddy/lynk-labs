"use client";

import { TrendingUp, MapPin, FlaskConical, Clock } from "lucide-react";

const stats = [
    { icon: TrendingUp, value: "50,000+", label: "Happy Customers", suffix: "" },
    { icon: MapPin, value: "Hyderabad", label: "& Surrounding Areas", suffix: "" },
    { icon: FlaskConical, value: "500+", label: "Tests Available", suffix: "" },
    { icon: Clock, value: "<24", label: "Hrs for Most Tests", suffix: "hrs" }
];

export function StatsSection() {
    return (
        <section className="relative py-16 overflow-hidden">
            {/* Gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-teal-600" />

            {/* Decorative pattern overlay */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                }} />
            </div>

            <div className="container-padding relative">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {stats.map((stat, index) => {
                        const Icon = stat.icon;
                        return (
                            <div key={index} className="text-center group">
                                <div className="inline-flex items-center justify-center w-14 h-14 bg-white/10 backdrop-blur-sm rounded-2xl mb-4 group-hover:bg-white/20 transition-colors">
                                    <Icon className="h-7 w-7 text-white" />
                                </div>
                                <div className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                    {stat.value}
                                    {stat.suffix && <span className="text-lg ml-1">{stat.suffix}</span>}
                                </div>
                                <div className="text-white/80 font-medium">{stat.label}</div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
