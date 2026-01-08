"use client";

import Image from "next/image";
import { Star, Quote, CheckCircle, BadgeCheck } from "lucide-react";

const testimonials = [
    {
        id: 1,
        name: "Lakshmi Venkatesh",
        location: "Hyderabad",
        image: "/images/indian_customer_1_1767874102475.png",
        rating: 5,
        comment: "The home collection service was incredibly convenient. The phlebotomist was professional and gentle. I got my reports within 24 hours, exactly as promised. Highly recommend Lynk Labs for anyone looking for hassle-free diagnostic services!",
        testType: "Complete Blood Count",
        verified: true
    },
    {
        id: 2,
        name: "Rajesh Krishnamurthy",
        location: "Bengaluru",
        image: "/images/indian_customer_2_1767874119618.png",
        rating: 5,
        comment: "As a busy IT professional, I barely have time for health checkups. Lynk Labs made it so easy - booked online, they came to my home at 7 AM before work, and I had my detailed reports by evening. Excellent service!",
        testType: "Executive Health Package",
        verified: true
    },
    {
        id: 3,
        name: "Padmavathi Reddy",
        location: "Chennai",
        image: "/images/indian_customer_3_1767874137551.png",
        rating: 5,
        comment: "My elderly parents needed regular health monitoring. The staff was extremely patient and caring with them. The reports are detailed and easy to understand. We have been using Lynk Labs for over a year now and could not be happier.",
        testType: "Senior Citizen Package",
        verified: true
    }
];

export function TestimonialsSection() {
    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white relative overflow-hidden">
            {/* Background decorations */}
            <div className="absolute top-20 left-10 opacity-5">
                <Quote className="w-40 h-40 text-primary" />
            </div>
            <div className="absolute bottom-20 right-10 opacity-5 rotate-180">
                <Quote className="w-32 h-32 text-primary" />
            </div>

            <div className="container-padding relative">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">
                        ⭐ Customer Stories
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Trusted by 50,000+ Happy Customers
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Real stories from families across India who trust Lynk Labs for their healthcare needs
                    </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.id} className="group bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl border border-slate-100 hover:border-primary/20 transition-all duration-300 relative">
                            {/* Quote icon */}
                            <div className="absolute top-6 right-6 opacity-10">
                                <Quote className="w-12 h-12 text-primary" />
                            </div>

                            {/* Rating */}
                            <div className="flex items-center gap-1 mb-6">
                                {[...Array(testimonial.rating)].map((_, i) => (
                                    <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
                                ))}
                                <span className="text-sm text-slate-500 ml-2">5.0</span>
                            </div>

                            {/* Quote */}
                            <p className="text-slate-600 mb-6 leading-relaxed text-base">
                                &ldquo;{testimonial.comment}&rdquo;
                            </p>

                            {/* Test badge */}
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/5 text-primary text-sm font-medium rounded-full mb-6">
                                <CheckCircle className="h-4 w-4" />
                                {testimonial.testType}
                            </div>

                            {/* Author */}
                            <div className="flex items-center gap-4 pt-6 border-t border-slate-100">
                                <div className="relative">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        width={64}
                                        height={64}
                                        className="w-16 h-16 rounded-full object-cover ring-4 ring-white shadow-lg"
                                    />
                                    {testimonial.verified && (
                                        <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1">
                                            <BadgeCheck className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold text-slate-900 text-lg">{testimonial.name}</h4>
                                    <p className="text-sm text-slate-500">{testimonial.location}, India</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Overall rating */}
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-16 p-8 bg-gradient-to-r from-primary/5 via-white to-teal-500/5 rounded-2xl border border-slate-100 max-w-2xl mx-auto">
                    <div className="flex">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="h-8 w-8 fill-amber-400 text-amber-400" />
                        ))}
                    </div>
                    <div className="text-center sm:text-left">
                        <div className="flex items-baseline gap-2">
                            <span className="text-4xl font-bold text-slate-900">4.9</span>
                            <span className="text-slate-500">/5 rating</span>
                        </div>
                        <p className="text-slate-500">Based on 2,500+ verified reviews</p>
                    </div>
                </div>
            </div>
        </section>
    );
}
