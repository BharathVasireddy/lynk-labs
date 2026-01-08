"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Category {
    id: string;
    name: string;
    slug: string;
    description: string | null;
    icon: string | null;
    _count?: {
        tests: number;
    };
}

export function CategoriesSection() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch("/api/categories?includeTestCount=true&limit=6");
            const data = await response.json();
            const sortedCategories = (data.categories || [])
                .filter((cat: Category) => cat._count?.tests > 0)
                .sort((a: Category, b: Category) => (b._count?.tests || 0) - (a._count?.tests || 0))
                .slice(0, 6);
            setCategories(sortedCategories);
        } catch (error) {
            console.error("Error fetching categories:", error);
            setCategories([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <section className="py-20 lg:py-28 bg-white">
            <div className="container-padding">
                <div className="text-center mb-16">
                    <span className="inline-block px-4 py-1.5 bg-primary/10 text-primary text-sm font-semibold rounded-full mb-4">
                        Test Categories
                    </span>
                    <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">
                        Browse Our Diagnostic Services
                    </h2>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        Comprehensive range of tests organized by health categories for easy navigation
                    </p>
                </div>

                {loading ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, index) => (
                            <div key={index} className="bg-slate-50 p-6 rounded-2xl animate-pulse">
                                <div className="w-14 h-14 bg-slate-200 rounded-xl mb-4" />
                                <div className="h-6 bg-slate-200 rounded mb-2 w-3/4" />
                                <div className="h-4 bg-slate-200 rounded mb-4 w-full" />
                                <div className="h-4 bg-slate-200 rounded w-24" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <Link
                                key={category.id}
                                href={`/tests?category=${category.id}`}
                                className="group relative bg-gradient-to-br from-slate-50 to-white p-6 rounded-2xl border border-slate-100 hover:border-primary/30 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300"
                            >
                                <div className="flex items-start gap-4">
                                    <div className="text-3xl bg-white p-4 rounded-xl shadow-sm group-hover:shadow-md group-hover:scale-105 transition-all">
                                        {category.icon || '🧪'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-primary transition-colors">
                                            {category.name}
                                        </h3>
                                        <p className="text-slate-500 text-sm mb-3 line-clamp-2">
                                            {category.description || "Comprehensive diagnostic tests"}
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-semibold text-primary">
                                                {category._count?.tests || 0} tests
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-slate-400 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

                <div className="text-center mt-12">
                    <Button size="lg" variant="outline" className="px-8 py-6 text-base font-semibold rounded-xl border-2" asChild>
                        <Link href="/tests">
                            View All Categories
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </Button>
                </div>
            </div>
        </section>
    );
}
