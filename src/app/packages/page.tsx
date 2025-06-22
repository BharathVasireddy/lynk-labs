"use client";

import { Metadata } from 'next';
import { useState, useEffect } from 'react';
import { CheckCircle, Heart, Shield, Users, Clock, Award, Phone, Mail, Star, ArrowRight, Calendar, FileText, Stethoscope, Activity, Eye, Brain, Zap, Target, Search, MapPin, User, Building, Home, TestTube, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import Image from 'next/image';

// Note: Since we can't use dynamic metadata in client components, we'll handle SEO differently
export default function HealthCheckupPackagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Filter packages based on search query
    console.log('Searching for:', searchQuery);
  };

  const packages = [
    {
      id: 'basic-health',
      name: 'Basic Health Checkup Package',
      subtitle: 'Essential Health Screening for Young Adults',
      price: 1299,
      originalPrice: 1699,
      tests: 45,
      description: 'Perfect for annual health monitoring and basic wellness assessment for adults aged 18-40',
      popular: false,
      category: 'basic',
      ageGroup: '18-40 years',
      features: [
        'Complete Blood Count (CBC)',
        'Lipid Profile (Cholesterol)',
        'Blood Sugar (Fasting & Post-meal)',
        'Liver Function Tests (SGPT, SGOT)',
        'Kidney Function Tests (Creatinine, Urea)',
        'Thyroid Profile (T3, T4, TSH)',
        'Vitamin D3 & B12',
        'Iron Studies (Hemoglobin, Ferritin)',
        'Urine Analysis (Complete)',
        'Blood Pressure Monitoring'
      ],
      idealFor: 'Young professionals, Annual checkups, Preventive screening',
      reportTime: '24 hours',
      homeCollection: true,
      image: '/images/medical/basic-checkup.jpg'
    },
    {
      id: 'comprehensive-health',
      name: 'Comprehensive Health Checkup Package',
      subtitle: 'Complete Health Assessment',
      price: 2899,
      originalPrice: 3799,
      tests: 85,
      description: 'Most comprehensive screening covering all major health parameters for adults',
      popular: true,
      category: 'comprehensive',
      ageGroup: '25-55 years',
      features: [
        'All Basic Health Checkup tests',
        'Cancer Screening Markers (PSA, CEA)',
        'Advanced Cardiac Risk Assessment',
        'Diabetes Panel (HbA1c, Insulin)',
        'Arthritis & Joint Health Panel',
        'Allergy Panel (Common allergens)',
        'Hepatitis B & C Screening',
        'HIV & STD Screening',
        'Complete Electrolyte Panel',
        'Advanced Protein Studies'
      ],
      idealFor: 'Adults with family history, Comprehensive screening, Health-conscious individuals',
      reportTime: '24-48 hours',
      homeCollection: true,
      image: '/images/medical/comprehensive-checkup.jpg'
    },
    {
      id: 'senior-citizen',
      name: 'Senior Citizen Health Checkup Package',
      subtitle: 'Specialized Health Package for 50+ Age Group',
      price: 3499,
      originalPrice: 4599,
      tests: 95,
      description: 'Tailored health checkup for seniors with focus on age-related health concerns and chronic conditions',
      popular: false,
      category: 'senior',
      ageGroup: '50+ years',
      features: [
        'All Comprehensive Health tests',
        'Bone Health Assessment (Calcium, Phosphorus)',
        'Advanced Cardiac Markers (Troponin, CK-MB)',
        'Prostate Health Screening (PSA)',
        'Complete Tumor Markers Panel',
        'Rheumatoid Factor & Arthritis Panel',
        'C-Reactive Protein (Inflammation)',
        'Homocysteine (Heart disease risk)',
        'Advanced Kidney Function Tests',
        'Cognitive Health Markers'
      ],
      idealFor: 'Senior citizens, Age-related health monitoring, Chronic disease management',
      reportTime: '48 hours',
      homeCollection: true,
      image: '/images/medical/senior-checkup.jpg'
    },
    {
      id: 'womens-health',
      name: "Women's Health Checkup Package",
      subtitle: 'Comprehensive Women Wellness Package',
      price: 2599,
      originalPrice: 3399,
      tests: 75,
      description: 'Specialized health checkup package addressing women-specific health needs and hormonal balance',
      popular: false,
      category: 'women',
      ageGroup: '18-60 years',
      features: [
        'All Basic Health Checkup tests',
        'Complete Hormonal Profile',
        'PCOS/PCOD Screening Panel',
        'Breast Cancer Markers (CA 15-3)',
        'Cervical Cancer Screening (Pap test)',
        'Bone Density Markers (Osteoporosis)',
        'Iron Deficiency & Anemia Panel',
        'Pregnancy Hormones (if applicable)',
        'Menopause Panel (FSH, LH)',
        'Reproductive Health Assessment'
      ],
      idealFor: 'Women of all ages, Hormonal health, Reproductive wellness',
      reportTime: '24-48 hours',
      homeCollection: true,
      image: '/images/medical/womens-health.jpg'
    },
    {
      id: 'cardiac-health',
      name: 'Cardiac Health Checkup Package',
      subtitle: 'Comprehensive Heart Health Assessment',
      price: 1899,
      originalPrice: 2499,
      tests: 55,
      description: 'Focused health checkup for cardiovascular health and heart disease prevention',
      popular: false,
      category: 'cardiac',
      ageGroup: '30+ years',
      features: [
        'Advanced Lipid Profile (LDL, HDL, VLDL)',
        'Cardiac Enzymes (CK-MB, LDH)',
        'ECG Analysis & Interpretation',
        'Blood Pressure Monitoring',
        'Homocysteine (Heart risk factor)',
        'CRP High Sensitivity (Inflammation)',
        'Troponin I (Heart damage marker)',
        'NT-proBNP (Heart failure marker)',
        'Complete Electrolyte Balance',
        'Coagulation Studies (PT, APTT)'
      ],
      idealFor: 'Adults with cardiac risk factors, Family history of heart disease, Chest pain concerns',
      reportTime: '24 hours',
      homeCollection: true,
      image: '/images/medical/cardiac-health.jpg'
    },
    {
      id: 'executive-health',
      name: 'Executive Health Checkup Package',
      subtitle: 'Premium Comprehensive Health Screening',
      price: 4999,
      originalPrice: 6499,
      tests: 120,
      description: 'Most comprehensive health checkup package with advanced diagnostics for busy executives',
      popular: false,
      category: 'executive',
      ageGroup: '30-60 years',
      features: [
        'All Senior Citizen Health tests',
        'Advanced Cancer Screening Panel',
        'Genetic Predisposition Tests',
        'Heavy Metal Analysis (Lead, Mercury)',
        'Food Intolerance Panel (50+ items)',
        'Stress Hormone Analysis (Cortisol)',
        'Advanced Imaging Markers',
        'Complete Metabolic Syndrome Panel',
        'Autoimmune Disorders Screening',
        'Executive Health Consultation with Specialist'
      ],
      idealFor: 'Executives, High-stress professionals, Comprehensive health assessment',
      reportTime: '48-72 hours',
      homeCollection: true,
      image: '/images/medical/executive-health.jpg'
    }
  ];

  const packageCategories = [
    { id: 'all', name: 'All Packages', count: packages.length },
    { id: 'basic', name: 'Basic Checkups', count: packages.filter(p => p.category === 'basic').length },
    { id: 'comprehensive', name: 'Comprehensive', count: packages.filter(p => p.category === 'comprehensive').length },
    { id: 'senior', name: 'Senior Citizens', count: packages.filter(p => p.category === 'senior').length },
    { id: 'women', name: 'Women\'s Health', count: packages.filter(p => p.category === 'women').length },
    { id: 'cardiac', name: 'Cardiac Health', count: packages.filter(p => p.category === 'cardiac').length },
    { id: 'executive', name: 'Executive', count: packages.filter(p => p.category === 'executive').length }
  ];

  const features = [
    {
      icon: Shield,
      title: 'NABL Accredited Labs',
      description: 'All health checkup packages are processed in NABL accredited laboratories ensuring highest quality standards and accurate results'
    },
    {
      icon: Home,
      title: 'Free Home Collection',
      description: 'Convenient sample collection from your home in Hyderabad at no extra cost with trained phlebotomists'
    },
    {
      icon: Clock,
      title: 'Fast Results',
      description: 'Get your health checkup reports within 24-48 hours with detailed analysis and expert recommendations'
    },
    {
      icon: Users,
      title: 'Expert Consultation',
      description: 'Free consultation with healthcare experts to understand your health checkup reports and next steps'
    },
    {
      icon: Award,
      title: 'Certified Quality',
      description: 'ISO 15189 certified processes ensuring international quality standards for all health checkup packages'
    },
    {
      icon: Heart,
      title: 'Comprehensive Care',
      description: 'Health checkup packages designed by medical experts covering all essential health parameters for Hyderabad residents'
    }
  ];

  const testimonials = [
    {
      name: 'Rajesh Kumar',
      age: 42,
      location: 'Banjara Hills, Hyderabad',
      rating: 5,
      package: 'Comprehensive Health Checkup Package',
      comment: 'Excellent health checkup service! The home collection in Hyderabad was very convenient and professional. The comprehensive health package helped detect early signs of diabetes. Highly recommend Lynk Labs for health checkups in Hyderabad.',
      image: '/images/testimonials/rajesh-kumar.jpg'
    },
    {
      name: 'Priya Sharma',
      age: 35,
      location: 'Jubilee Hills, Hyderabad',
      rating: 5,
      package: 'Women\'s Health Checkup Package',
      comment: 'The women\'s health checkup package was comprehensive and well-designed. The team in Hyderabad was very professional and the reports were detailed with clear explanations. Great value for money!',
      image: '/images/testimonials/priya-sharma.jpg'
    },
    {
      name: 'Dr. Venkat Reddy',
      age: 58,
      location: 'Secunderabad, Hyderabad',
      rating: 5,
      package: 'Senior Citizen Health Checkup Package',
      comment: 'As a senior citizen, I was looking for a comprehensive health checkup in Hyderabad. The senior citizen package covered all my concerns. The home collection service made it very convenient. Excellent service!',
      image: '/images/testimonials/venkat-reddy.jpg'
    }
  ];

  const faqs = [
    {
      question: 'What areas in Hyderabad do you provide home collection for health checkup packages?',
      answer: 'We provide free home collection for all health checkup packages across Hyderabad including Banjara Hills, Jubilee Hills, Secunderabad, Gachibowli, Madhapur, Kondapur, Kukatpally, Ameerpet, Begumpet, and all other areas within Hyderabad city limits.'
    },
    {
      question: 'How long does it take to get health checkup results in Hyderabad?',
      answer: 'Most health checkup packages provide results within 24-48 hours. Basic packages typically deliver results in 24 hours, while comprehensive packages may take up to 48 hours for detailed analysis. Executive packages may take 48-72 hours due to advanced testing.'
    },
    {
      question: 'Are the health checkup packages suitable for all age groups?',
      answer: 'Yes, we have specifically designed health checkup packages for different age groups: Basic packages for 18-40 years, Comprehensive for 25-55 years, Senior Citizen packages for 50+ years, and specialized packages for women\'s health and cardiac health.'
    },
    {
      question: 'What is included in the free home collection service in Hyderabad?',
      answer: 'Our free home collection service includes: trained phlebotomist visit to your location in Hyderabad, all necessary collection equipment, safe sample handling and transportation to our NABL accredited labs, and flexible timing as per your convenience.'
    },
    {
      question: 'Can I customize a health checkup package according to my specific needs?',
      answer: 'While our health checkup packages are expertly designed by medical professionals, you can contact our team to discuss specific requirements or add additional tests. We can create personalized health checkup packages based on your health concerns and family history.'
    },
    {
      question: 'Do you provide doctor consultation after health checkup results?',
      answer: 'Yes, all health checkup packages include free consultation with qualified healthcare experts. Our doctors will help you understand your health checkup reports, explain any abnormal values, and provide recommendations for lifestyle changes or further medical consultation if needed.'
    },
    {
      question: 'What makes Lynk Labs health checkup packages different in Hyderabad?',
      answer: 'Lynk Labs offers NABL accredited lab testing, free home collection across Hyderabad, fastest report delivery (24-48 hours), expert consultation, comprehensive packages designed by medical professionals, and the most competitive pricing for health checkup packages in Hyderabad.'
    },
    {
      question: 'Are there any special offers or discounts on health checkup packages?',
      answer: 'Yes, we regularly offer discounts up to 35% on health checkup packages. We also have special family packages, corporate health checkup discounts, and seasonal offers. Contact us for current promotions and bulk booking discounts for health checkups in Hyderabad.'
    }
  ];

  const filteredPackages = packages.filter(pkg => {
    const matchesCategory = selectedCategory === 'all' || pkg.category === selectedCategory;
    const matchesSearch = searchQuery === '' || 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.features.some(feature => feature.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative medical-background py-20 lg:py-32 overflow-hidden">
        <div className="container-padding relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="page-transition text-center lg:text-left">
              <div className="medical-badge-primary mb-6 inline-flex scale-hover">
                <MapPin className="w-4 h-4 mr-2" />
                Health Checkup Packages in Hyderabad
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                Comprehensive 
                <span className="text-primary block lg:inline"> Health Checkup Packages</span>
                <span className="block text-3xl lg:text-4xl mt-2 text-muted-foreground">in Hyderabad</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Book comprehensive health checkup packages in Hyderabad with free home sample collection. NABL accredited labs, expert consultation, and fastest results delivery.
              </p>
              
              {/* Search Bar */}
              <form onSubmit={handleSearch} className="mb-8">
                <div className="relative max-w-md mx-auto lg:mx-0">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-5 w-5" />
                  <Input
                    type="text"
                    placeholder="Search health checkup packages..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 text-base medical-input"
                  />
                  <Button 
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-4 medical-button-primary"
                  >
                    Search
                  </Button>
                </div>
              </form>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-8">
                <Button size="lg" className="medical-button-primary">
                  <TestTube className="w-5 h-5 mr-2" />
                  Book Health Checkup
                </Button>
                <Button variant="outline" size="lg" className="medical-button-outline">
                  <Phone className="w-5 h-5 mr-2" />
                  Call: 1800-123-4567
                </Button>
              </div>

              <div className="flex flex-wrap justify-center lg:justify-start gap-6 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>Free Home Collection in Hyderabad</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>NABL Accredited Labs</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  <span>24-48 Hours Reports</span>
                </div>
              </div>
            </div>
            
            <div className="relative page-transition">
              <div className="medical-card-hover p-8 bg-card/95 backdrop-blur-sm">
                <Image
                  src="/images/medical/health-checkup-hero.jpg"
                  alt="Health Checkup Packages in Hyderabad - Professional Medical Testing"
                  width={500}
                  height={400}
                  className="rounded-xl mb-6 w-full object-cover"
                  priority
                />
                <h3 className="text-2xl font-bold mb-6 text-foreground">Why Choose Our Health Checkup Packages?</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 liquid-hover">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 scale-hover" />
                    <span className="text-foreground font-medium">NABL Accredited Labs in Hyderabad</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 liquid-hover">
                    <Home className="h-5 w-5 text-primary flex-shrink-0 scale-hover" />
                    <span className="text-foreground font-medium">Free Home Collection Service</span>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10 liquid-hover">
                    <Clock className="h-5 w-5 text-primary flex-shrink-0 scale-hover" />
                    <span className="text-foreground font-medium">Fastest Results in 24-48 Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Package Categories Filter */}
      <section className="py-8 bg-muted/30">
        <div className="container-padding">
          <div className="flex flex-wrap justify-center gap-4">
            {packageCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                  selectedCategory === category.id
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'bg-background text-muted-foreground hover:bg-primary/10 hover:text-primary border border-border'
                }`}
              >
                {category.name} ({category.count})
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Health Checkup Packages Grid */}
      <section className="container-padding py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-foreground">
            Health Checkup Packages in Hyderabad
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Choose from our expertly curated health checkup packages designed for different age groups and health needs. 
            All packages include free home sample collection across Hyderabad.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`medical-card-hover relative ${
                pkg.popular ? 'ring-2 ring-primary shadow-lg scale-105' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <div className="medical-badge-primary px-4 py-2 rounded-full shadow-lg">
                    <Star className="w-3 h-3 mr-1" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="p-6">
                {/* Package Image */}
                <div className="mb-6">
                  <Image
                    src={pkg.image}
                    alt={`${pkg.name} - Health Checkup in Hyderabad`}
                    width={400}
                    height={200}
                    className="rounded-lg w-full h-48 object-cover"
                  />
                </div>

                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{pkg.subtitle}</p>
                  
                  {/* Age Group Badge */}
                  <div className="medical-badge-outline mb-4">
                    <User className="w-3 h-3 mr-1" />
                    Ideal for: {pkg.ageGroup}
                  </div>
                  
                  {/* Pricing */}
                  <div className="mb-4">
                    <div className="flex items-center justify-center gap-3 mb-2">
                      <span className="text-3xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
                      <span className="text-lg text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                    </div>
                    <div className="medical-badge-success">
                      Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()} ({Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF)
                    </div>
                  </div>

                  {/* Test Count & Report Time */}
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{pkg.tests} Tests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.reportTime}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Home className="h-4 w-4" />
                      <span>Free Collection</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-center mb-6 leading-relaxed">{pkg.description}</p>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3 text-center">Key Tests Included:</h4>
                  <div className="space-y-2">
                    {pkg.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                    {pkg.features.length > 5 && (
                      <div className="text-sm text-primary font-medium text-center pt-2">
                        +{pkg.features.length - 5} more tests included
                      </div>
                    )}
                  </div>
                </div>

                {/* Ideal For */}
                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Ideal For:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{pkg.idealFor}</p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full medical-button-primary text-base py-3">
                    Book Package - ₹{pkg.price.toLocaleString()}
                  </Button>
                  <Button variant="outline" className="w-full medical-button-outline text-sm">
                    View All {pkg.tests} Tests Details
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-12">
            <div className="medical-card p-8 max-w-md mx-auto">
              <TestTube className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-foreground mb-2">No packages found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-4 medical-button-outline"
              >
                Clear Filters
              </Button>
            </div>
          </div>
        )}
      </section>

      {/* Why Choose Section */}
      <section className="bg-muted/30 py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Why Choose Lynk Labs for Health Checkup Packages in Hyderabad?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              We are the most trusted provider of health checkup packages in Hyderabad with thousands of satisfied customers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="medical-card p-6 text-center group hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors scale-hover">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-4 text-foreground group-hover:text-primary transition-colors">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Our Customers Say About Health Checkup Packages in Hyderabad
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Read testimonials from thousands of satisfied customers who chose our health checkup packages in Hyderabad
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="medical-card p-6">
                <div className="flex items-center mb-4">
                  <Image
                    src={testimonial.image}
                    alt={`${testimonial.name} - Health Checkup Package Review`}
                    width={60}
                    height={60}
                    className="rounded-full mr-4 object-cover"
                  />
                  <div>
                    <div className="font-semibold text-foreground">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground">Age: {testimonial.age}, {testimonial.location}</div>
                  </div>
                </div>
                
                <div className="flex text-yellow-400 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                
                <div className="text-xs text-primary mb-3 font-medium">
                  Package: {testimonial.package}
                </div>
                
                <p className="text-muted-foreground leading-relaxed italic">
                  "{testimonial.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="bg-muted/30 py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Frequently Asked Questions About Health Checkup Packages in Hyderabad
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our health checkup packages and services in Hyderabad
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="medical-card">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                  className="w-full p-6 text-left flex items-center justify-between hover:bg-muted/50 transition-colors"
                >
                  <h3 className="font-semibold text-foreground pr-4">{faq.question}</h3>
                  {expandedFAQ === index ? (
                    <ChevronUp className="h-5 w-5 text-primary flex-shrink-0" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-primary flex-shrink-0" />
                  )}
                </button>
                {expandedFAQ === index && (
                  <div className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Book Your Health Checkup Package in Hyderabad?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Take control of your health today with our comprehensive health checkup packages. 
            Free home collection across Hyderabad, NABL accredited labs, and expert consultation included.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button size="lg" className="bg-secondary text-secondary-foreground hover:bg-secondary/80 scale-hover">
              <TestTube className="w-5 h-5 mr-2" />
              Book Health Checkup Now
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary scale-hover"
            >
              <Phone className="w-5 h-5 mr-2" />
              Call: 1800-123-4567
            </Button>
          </div>

          <div className="flex flex-wrap justify-center gap-8 text-sm opacity-90">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Free Home Collection in Hyderabad</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>NABL Accredited Labs</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>Expert Consultation Included</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              <span>24-48 Hours Results</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 