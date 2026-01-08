"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookTestButton } from "@/components/ui/book-test-button";

interface Test {
    id: string;
    name: string;
    slug: string;
    description: string;
    price: number;
    discountPrice: number | null;
    category: {
        id: string;
        name: string;
        slug: string;
    };
}

export function PopularTestsSection() {
    const [popularTests, setPopularTests] = useState<Test[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPopularTests();
    }, []);

    const fetchPopularTests = async () => {
        try {
            const response = await fetch("/api/tests", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ type: "popular" }),
            });
            const data = await response.json();
            setPopularTests(data.tests || []);
        } catch (error) {
            console.error("Error fetching popular tests:", error);
            setPopularTests([]);
        } finally {
            setLoading(false);
        }
    };

    const calculateDiscount = (price: number, discountPrice: number | null) => {
        if (!discountPrice) return 0;
        return Math.round(((price - discountPrice) / price) * 100);
    };

    return (
        <section className="py-20 lg:py-28 bg-gradient-to-b from-slate-50 to-white">
            <div className="container-padding">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-amber-100 text-amber-700 text-sm font-semibold rounded-full mb-4">
                        Most Booked
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Popular Lab Tests
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Our most frequently booked tests for comprehensive health monitoring
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-white p-6 rounded-2xl shadow-sm animate-pulse">
                                <div className="h-6 bg-slate-200 rounded mb-2 w-3/4" />
                                <div className="h-4 bg-slate-200 rounded mb-4 w-1/2" />
                                <div className="h-4 bg-slate-200 rounded mb-4 w-full" />
                                <div className="h-8 bg-slate-200 rounded w-24 mb-4" />
                                <div className="h-12 bg-slate-200 rounded" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {popularTests.map((test) => (
                            <div key={test.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-primary/20 transition-all duration-300 overflow-hidden flex flex-col">
                                <div className="p-6 flex-1">
                                    <div className="flex items-start justify-between gap-3 mb-4">
                                        <div className="flex-1 min-w-0">
                                            <Link href={`/tests/${test.slug}`}>
                                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                                                    {test.name}
                                                </h3>
                                            </Link>
                                            <span className="inline-block px-3 py-1 bg-slate-100 text-slate-600 text-xs font-medium rounded-full">
                                                {test.category.name}
                                            </span>
                                        </div>
                                        {test.discountPrice && (
                                            <div className="flex-shrink-0">
                                                <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                                                    {calculateDiscount(test.price, test.discountPrice)}% OFF
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">
                                        {test.description}
                                    </p>

                                    <div className="flex items-baseline gap-2">
                                        <span className="text-2xl font-bold text-primary">
                                            ₹{test.discountPrice || test.price}
                                        </span>
                                        {test.discountPrice && (
                                            <span className="text-sm text-slate-400 line-through">
                                                ₹{test.price}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                <div className="p-6 pt-0 mt-auto">
                                    <BookTestButton
                                        test={test}
                                        viewDetailsButton={
                                            <Button variant="outline" className="flex-1 text-xs px-3 rounded-lg" asChild>
                                                <Link href={`/tests/${test.slug}`}>Details</Link>
                                            </Button>
                                        }
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Button size="lg" className="px-8 py-6 text-base font-semibold rounded-xl shadow-lg shadow-primary/20" asChild>
                        <Link href="/tests">
                            View All Tests
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
