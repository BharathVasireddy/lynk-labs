"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Shield, Clock, Home, Users, Star, CheckCircle, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";

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

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  _count: {
    tests: number;
  };
}

export default function HomePage() {
  const [popularTests, setPopularTests] = useState<Test[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchPopularTests();
    fetchCategories();
  }, []);

  const fetchPopularTests = async () => {
    try {
      const response = await fetch("/api/tests?page=1&limit=6&sortBy=popular");
      const data = await response.json();
      setPopularTests(data.tests || []);
    } catch (error) {
      console.error("Error fetching popular tests:", error);
      setPopularTests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      const data = await response.json();
      // Get the top 6 categories with most tests
      const sortedCategories = (data.categories || [])
        .sort((a: Category, b: Category) => b._count.tests - a._count.tests)
        .slice(0, 6);
      setCategories(sortedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const addToCart = (test: Test) => {
    addItem({
      id: test.id,
      name: test.name,
      slug: test.slug,
      price: test.price,
      discountPrice: test.discountPrice,
      category: {
        name: test.category.name,
      },
    });
  };

  const calculateDiscount = (price: number, discountPrice: number | null) => {
    if (!discountPrice) return 0;
    return Math.round(((price - discountPrice) / price) * 100);
  };

  const features = [
    {
      icon: Home,
      title: "Home Sample Collection",
      description: "Professional phlebotomists collect samples from your doorstep at your convenience."
    },
    {
      icon: Shield,
      title: "NABL Accredited",
      description: "All tests performed in NABL accredited labs ensuring highest quality standards."
    },
    {
      icon: Clock,
      title: "Fast Results",
      description: "Get your reports within 24-48 hours via WhatsApp, email, or download from portal."
    },
    {
      icon: Users,
      title: "Expert Care",
      description: "Experienced lab technicians and pathologists ensure accurate diagnostics."
    }
  ];

  const stats = [
    { value: "50,000+", label: "Happy Customers" },
    { value: "100+", label: "Cities Covered" },
    { value: "500+", label: "Tests Available" },
    { value: "24-48hrs", label: "Report Delivery" }
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative medical-background py-20 lg:py-32 overflow-hidden">
        <div className="container-padding relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="page-transition">
              <div className="medical-badge-primary mb-6 inline-flex scale-hover">
                <Shield className="w-4 h-4 mr-2" />
                NABL Accredited Lab
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your Health,
                <span className="text-primary block lg:inline"> Our Priority</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg leading-relaxed">
                Book lab tests online with home sample collection, get fast accurate results, 
                and take control of your health journey with Lynk Labs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="medical-button-primary px-8 py-4 text-base font-semibold liquid-hover" asChild>
                  <Link href="/tests">
                    Book Lab Tests
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button variant="outline" size="lg" className="medical-button-outline px-8 py-4 text-base font-semibold" asChild>
                  <Link href="/packages">View Health Packages</Link>
                </Button>
              </div>
              
              {/* Trust Indicators */}
              <div className="flex items-center gap-6 mt-8 pt-8 border-t">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">50,000+ customers trust us</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-semibold">4.8</span>
                  <span className="text-sm text-gray-600">(2,500+ reviews)</span>
                </div>
              </div>
            </div>
            
            <div className="relative page-transition">
              <div className="medical-card-hover p-8 bg-card/95 backdrop-blur-sm">
                <h3 className="text-2xl font-bold mb-6 text-foreground">Quick Test Booking</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 liquid-hover">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 scale-hover" />
                    <span className="text-foreground font-medium">Choose from 500+ tests</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 liquid-hover">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 scale-hover" />
                    <span className="text-foreground font-medium">Schedule home collection</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 liquid-hover">
                    <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 scale-hover" />
                    <span className="text-foreground font-medium">Get reports in 24-48 hours</span>
                  </div>
                </div>
                <Button className="w-full mt-6 medical-button-primary py-3 text-base font-semibold" size="lg" asChild>
                  <Link href="/tests">Start Booking Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container-padding">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-primary-foreground/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Test Categories Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">Browse Test Categories</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Explore our comprehensive range of diagnostic tests organized by health categories.
            </p>
          </div>
          
          {categoriesLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/tests?category=${category.id}`}
                  className="group bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-3xl bg-primary/10 p-3 rounded-lg group-hover:bg-primary/20 transition-colors">
                      {category.icon || '🧪'}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                        {category.name}
                      </h3>
                      <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
                        {category.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-primary font-medium">
                          {category._count.tests} tests available
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8 py-4 text-base font-semibold" asChild>
              <Link href="/tests">
                View All Tests
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-background">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">Why Choose Lynk Labs?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We combine cutting-edge technology with expert care to deliver the best diagnostic experience.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="medical-icon-container mb-6 mx-auto scale-hover">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Tests Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">Popular Lab Tests</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Most frequently booked tests by our customers for comprehensive health monitoring.
            </p>
          </div>
          
          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div key={index} className="bg-white p-6 rounded-xl shadow-sm animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {popularTests.map((test) => (
                <div key={test.id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">{test.name}</h3>
                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{test.description}</p>
                    <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                      {test.category.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      {test.discountPrice && (
                        <span className="text-lg font-bold text-foreground">₹{test.discountPrice}</span>
                      )}
                      <span className={`${test.discountPrice ? 'text-sm text-muted-foreground line-through' : 'text-lg font-bold text-foreground'}`}>
                        ₹{test.price}
                      </span>
                      {test.discountPrice && (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          {calculateDiscount(test.price, test.discountPrice)}% OFF
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex-1"
                      asChild
                    >
                      <Link href={`/tests/${test.slug}`}>View Details</Link>
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => addToCart(test)}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button size="lg" className="px-8 py-4 text-base font-semibold" asChild>
              <Link href="/tests">
                View All Tests
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Book your lab tests today and get accurate results delivered to your doorstep.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-base font-semibold" asChild>
              <Link href="/tests">Book Tests Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-base font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 