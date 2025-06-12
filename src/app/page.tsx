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



export default function HomePage() {
  const [popularTests, setPopularTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCartStore();

  useEffect(() => {
    fetchPopularTests();
  }, []);

  const fetchPopularTests = async () => {
    try {
      const response = await fetch("/api/tests?page=1&limit=6&sortBy=popular");
      const data = await response.json();
      setPopularTests(data.tests);
    } catch (error) {
      console.error("Error fetching popular tests:", error);
    } finally {
      setLoading(false);
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
                <div key={index} className="medical-card-hover text-center p-6 group page-transition" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 liquid-hover">
                    <Icon className="medical-icon-lg scale-hover" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Popular Tests Section */}
      <section className="py-20 bg-muted/30">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">Popular Lab Tests</h2>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Most booked tests with special discounts
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="medical-card-hover p-6 loading-shimmer">
                  <div className="h-6 bg-muted rounded mb-4"></div>
                  <div className="h-4 bg-muted rounded mb-6 w-3/4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                </div>
              ))
            ) : (
              popularTests.map((test, index) => (
                <div key={test.id} className="medical-card-hover p-6 group page-transition" style={{animationDelay: `${index * 0.1}s`}}>
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      <Link href={`/tests/${test.slug}`} className="hover:text-primary liquid-hover">
                        {test.name}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground">{test.category.name}</p>
                  </div>
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl font-bold text-primary liquid-hover">
                        ₹{test.discountPrice || test.price}
                      </span>
                      {test.discountPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{test.price}
                        </span>
                      )}
                    </div>
                    {test.discountPrice && (
                      <div className="medical-badge-success scale-hover">
                        {calculateDiscount(test.price, test.discountPrice)}% OFF
                      </div>
                    )}
                  </div>
                  <Button 
                    className="w-full medical-button-outline"
                    onClick={() => addToCart(test)}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Book Now
                  </Button>
                </div>
              ))
            )}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" className="medical-button-primary px-8 py-4 text-base font-semibold" asChild>
              <Link href="/tests">
                View All Tests
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container-padding text-center relative">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 leading-tight">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 text-primary-foreground/90 max-w-2xl mx-auto leading-relaxed">
            Join thousands of satisfied customers who trust Lynk Labs for their diagnostic needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-base font-semibold bg-primary-foreground text-primary hover:bg-primary-foreground/90" asChild>
              <Link href="/tests">Book Your Test Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-base font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
              <Link href="/contact">Talk to Expert</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 