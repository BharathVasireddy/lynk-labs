"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ArrowRight, Shield, Clock, Home, Users, Star, CheckCircle, ShoppingCart, Plus, Minus, Phone, Mail, MapPin, Award, Microscope, Heart, Activity, FileText, Calendar, Headphones, TrendingUp, Globe, Zap } from "lucide-react";
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

export default function HomePage() {
  const [popularTests, setPopularTests] = useState<Test[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);


  useEffect(() => {
    fetchPopularTests();
    fetchCategories();
  }, []);

  const fetchPopularTests = async () => {
    try {
      // Use the new optimized POST endpoint for popular tests
      const response = await fetch("/api/tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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

  const fetchCategories = async () => {
    try {
      // Use optimized categories endpoint with test count
      const response = await fetch("/api/categories?includeTestCount=true&limit=6");
      const data = await response.json();
      // Sort by test count and take top 6
      const sortedCategories = (data.categories || [])
        .filter((cat: Category) => cat._count?.tests > 0)
        .sort((a: Category, b: Category) => (b._count?.tests || 0) - (a._count?.tests || 0))
        .slice(0, 6);
      setCategories(sortedCategories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
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

  const whyChooseUs = [
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
      icon: Phone,
      title: "24/7 Support",
      description: "Round-the-clock customer support to assist you with bookings, reports, and queries."
    }
  ];

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      rating: 5,
      comment: "Excellent service! The home collection was very convenient and the reports were accurate and delivered on time. Highly recommended!",
      testType: "Complete Blood Count"
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi",
      rating: 5,
      comment: "Professional staff and quick results. The online booking process was seamless and the phlebotomist was very skilled.",
      testType: "Diabetes Panel"
    },
    {
      name: "Anita Patel",
      location: "Bangalore",
      rating: 5,
      comment: "Great experience with Lynk Labs. The reports were detailed and the doctor consultation helped me understand my results better.",
      testType: "Thyroid Function Test"
    }
  ];

  const healthPackages = [
    {
      name: "Basic Health Checkup",
      price: 1999,
      originalPrice: 2999,
      tests: 25,
      description: "Essential tests for overall health monitoring",
      popular: false
    },
    {
      name: "Comprehensive Health Package",
      price: 3999,
      originalPrice: 5999,
      tests: 65,
      description: "Complete health assessment with detailed analysis",
      popular: true
    },
    {
      name: "Executive Health Package",
      price: 7999,
      originalPrice: 11999,
      tests: 95,
      description: "Premium health package for busy professionals",
      popular: false
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
            <div className="page-transition text-center lg:text-left">
              <div className="medical-badge-primary mb-6 inline-flex scale-hover">
                <Shield className="w-4 h-4 mr-2" />
                NABL Accredited Lab
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Your Health,
                <span className="text-primary block lg:inline"> Our Priority</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Book lab tests online with home sample collection, get fast accurate results, 
                and take control of your health journey with Lynk Labs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
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
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 mt-8 pt-8 border-t">
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
                          {category._count?.tests || 0} tests available
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
                <div key={test.id} className="medical-card-hover bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-primary/20 overflow-hidden flex flex-col">
                  <div className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-3 mb-4">
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-semibold text-foreground mb-2">
                          <Link 
                            href={`/tests/${test.slug}`}
                            className="hover:text-primary liquid-hover"
                          >
                            {test.name}
                          </Link>
                        </h3>
                        <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-xs font-medium rounded-full">
                          {test.category.name}
                        </span>
                      </div>
                      {test.discountPrice && (
                        <div className="flex-shrink-0">
                          <div className="bg-primary text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-sm">
                            {calculateDiscount(test.price, test.discountPrice)}% OFF
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                      {test.description}
                    </p>

                    <div className="flex items-baseline gap-2 mb-4">
                      <span className="text-2xl font-bold text-primary">
                        ₹{test.discountPrice || test.price}
                      </span>
                      {test.discountPrice && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{test.price}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-6 pt-0 mt-auto">
                    <div className="flex flex-col gap-2">
                      <BookTestButton test={test} />
                      <Button variant="outline" className="w-full medical-button-outline text-sm" asChild>
                        <Link href={`/tests/${test.slug}`}>
                          View Details
                        </Link>
                      </Button>
                    </div>
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

      {/* Enhanced Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">Why Choose Lynk Labs?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              We are committed to providing the highest quality diagnostic services with cutting-edge technology, 
              expert care, and unmatched convenience for our patients.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((item, index) => {
              const Icon = item.icon;
              return (
                <div key={index} className="medical-card p-6 text-center group hover:shadow-lg transition-all duration-300">
                  <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors scale-hover">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Health Packages Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">Health Packages</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Comprehensive health checkup packages designed for different needs and budgets.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {healthPackages.map((pkg, index) => (
              <div key={index} className={`medical-card p-8 text-center relative ${pkg.popular ? 'border-2 border-primary shadow-lg scale-105' : ''}`}>
                {pkg.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <h3 className="text-2xl font-bold mb-4 text-foreground">{pkg.name}</h3>
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <span className="text-3xl font-bold text-primary">₹{pkg.price}</span>
                    <span className="text-lg text-muted-foreground line-through">₹{pkg.originalPrice}</span>
                  </div>
                  <div className="text-sm text-green-600 font-medium">
                    Save ₹{pkg.originalPrice - pkg.price} ({Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF)
                  </div>
                </div>
                
                <div className="mb-6">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <FileText className="h-5 w-5 text-primary" />
                    <span className="font-semibold">{pkg.tests} Tests Included</span>
                  </div>
                  <p className="text-muted-foreground">{pkg.description}</p>
                </div>
                
                <Button 
                  className={`w-full ${pkg.popular ? 'medical-button-primary' : 'medical-button-outline'}`}
                  size="lg"
                  asChild
                >
                  <Link href="/packages">View Details</Link>
                </Button>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button size="lg" variant="outline" className="px-8 py-4 text-base font-semibold" asChild>
              <Link href="/packages">
                View All Packages
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-background">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">What Our Customers Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Read testimonials from thousands of satisfied customers who trust Lynk Labs for their health needs.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="medical-card p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400 mr-2">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({testimonial.rating}.0)</span>
                </div>
                
                <p className="text-muted-foreground mb-6 leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
                
                <div className="border-t pt-4">
                  <div className="font-semibold text-foreground">{testimonial.name}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.location}</div>
                  <div className="text-xs text-primary mt-1">Tested: {testimonial.testType}</div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <div className="flex items-center justify-center gap-2 text-muted-foreground">
              <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
              <span className="font-semibold text-foreground">4.8/5</span>
              <span>based on 2,500+ reviews</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="container-padding">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Getting your lab tests done is simple and convenient with our 4-step process.
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: "1",
                icon: Globe,
                title: "Book Online",
                description: "Choose your tests and book online or call our helpline. Select convenient time slot."
              },
              {
                step: "2",
                icon: Calendar,
                title: "Schedule Collection",
                description: "Our trained phlebotomist will visit your home at the scheduled time for sample collection."
              },
              {
                step: "3",
                icon: Microscope,
                title: "Lab Processing",
                description: "Samples are processed in our NABL accredited labs using advanced technology."
              },
              {
                step: "4",
                icon: FileText,
                title: "Get Reports",
                description: "Receive your reports via WhatsApp, email, or download from our secure portal."
              }
            ].map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="text-center relative">
                  {index < 3 && (
                    <div className="hidden md:block absolute top-12 left-full w-full h-0.5 bg-primary/20 -translate-y-1/2 z-0"></div>
                  )}
                  
                  <div className="relative z-10">
                    <div className="relative w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto scale-hover">
                      <Icon className="h-8 w-8 text-primary-foreground" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                        {step.step}
                      </div>
                    </div>
                    <h3 className="text-xl font-semibold mb-4 text-foreground">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Indicators Section */}
      <section className="py-16 bg-background">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold mb-4 text-foreground">Trusted by Healthcare Professionals</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our certifications and partnerships ensure the highest standards of quality and reliability.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center">
            {[
              { name: "NABL Accredited", icon: Award },
              { name: "ISO 15189 Certified", icon: Shield },
              { name: "CAP Approved", icon: CheckCircle },
              { name: "HIPAA Compliant", icon: Users }
            ].map((cert, index) => {
              const Icon = cert.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-colors scale-hover">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
                    {cert.name}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Information Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container-padding">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Phone className="h-6 w-6 mr-3" />
                <h3 className="text-xl font-semibold">Call Us</h3>
              </div>
              <p className="opacity-90 mb-2">24/7 Customer Support</p>
              <p className="text-lg font-semibold">1800-123-4567</p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Mail className="h-6 w-6 mr-3" />
                <h3 className="text-xl font-semibold">Email Us</h3>
              </div>
              <p className="opacity-90 mb-2">Get Quick Response</p>
              <p className="text-lg font-semibold">support@lynklabs.com</p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <MapPin className="h-6 w-6 mr-3" />
                <h3 className="text-xl font-semibold">Visit Us</h3>
              </div>
              <p className="opacity-90 mb-2">Main Laboratory</p>
              <p className="text-lg font-semibold">Mumbai, India</p>
            </div>
            
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start mb-4">
                <Headphones className="h-6 w-6 mr-3" />
                <h3 className="text-xl font-semibold">Live Chat</h3>
              </div>
              <p className="opacity-90 mb-2">Instant Support</p>
              <Button variant="secondary" size="sm" className="mt-2">
                Start Chat
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Book your lab tests today and get accurate results delivered to your doorstep with our convenient home collection service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-base font-semibold scale-hover" asChild>
              <Link href="/tests">Book Tests Now</Link>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-base font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary scale-hover" asChild>
              <Link href="/contact">Contact Us</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 