import { Metadata } from 'next';
import { CheckCircle, Heart, Shield, Users, Clock, Award, Phone, Mail, Star, ArrowRight, Calendar, FileText, Stethoscope, Activity, Eye, Brain, Zap, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Health Packages - Lynk Labs | Comprehensive Health Checkup Packages',
  description: 'Explore our comprehensive health packages designed for different age groups and health needs. From basic checkups to advanced screenings, find the perfect health package for you.',
};

export default function PackagesPage() {
  const packages = [
    {
      id: 'basic-health',
      name: 'Basic Health Checkup',
      subtitle: 'Essential Health Screening',
      price: 1299,
      originalPrice: 1699,
      tests: 45,
      description: 'Perfect for annual health monitoring and basic wellness assessment',
      popular: false,
      features: [
        'Complete Blood Count (CBC)',
        'Lipid Profile',
        'Blood Sugar (Fasting & PP)',
        'Liver Function Tests',
        'Kidney Function Tests',
        'Thyroid Profile (T3, T4, TSH)',
        'Vitamin D3',
        'Vitamin B12',
        'Iron Studies',
        'Urine Analysis'
      ],
      idealFor: 'Adults 18-40 years, Annual health checkup',
      reportTime: '24-48 hours',
      homeCollection: true
    },
    {
      id: 'comprehensive-health',
      name: 'Comprehensive Health Package',
      subtitle: 'Complete Health Assessment',
      price: 2899,
      originalPrice: 3799,
      tests: 85,
      description: 'Comprehensive screening covering all major health parameters',
      popular: true,
      features: [
        'All Basic Health tests',
        'Cancer Screening Markers',
        'Cardiac Risk Assessment',
        'Diabetes Panel (HbA1c)',
        'Arthritis Panel',
        'Allergy Panel (Common)',
        'Hepatitis B & C',
        'HIV Screening',
        'Electrolyte Panel',
        'Protein Studies'
      ],
      idealFor: 'Adults 30-50 years, Comprehensive screening',
      reportTime: '24-48 hours',
      homeCollection: true
    },
    {
      id: 'senior-citizen',
      name: 'Senior Citizen Package',
      subtitle: 'Specialized for 50+ Age Group',
      price: 3499,
      originalPrice: 4599,
      tests: 95,
      description: 'Tailored for seniors with focus on age-related health concerns',
      popular: false,
      features: [
        'All Comprehensive tests',
        'Bone Health (Calcium, Phosphorus)',
        'Advanced Cardiac Markers',
        'Prostate Health (PSA)',
        'Tumor Markers Panel',
        'Rheumatoid Factor',
        'C-Reactive Protein',
        'Homocysteine',
        'Advanced Kidney Function',
        'Cognitive Health Markers'
      ],
      idealFor: 'Adults 50+ years, Age-specific screening',
      reportTime: '48-72 hours',
      homeCollection: true
    },
    {
      id: 'womens-health',
      name: "Women's Health Package",
      subtitle: 'Comprehensive Women Wellness',
      price: 2599,
      originalPrice: 3399,
      tests: 75,
      description: 'Specialized package addressing women-specific health needs',
      popular: false,
      features: [
        'All Basic Health tests',
        'Hormonal Profile',
        'PCOS/PCOD Screening',
        'Breast Cancer Markers',
        'Cervical Cancer Screening',
        'Bone Density Markers',
        'Iron Deficiency Panel',
        'Pregnancy Hormones',
        'Menopause Panel',
        'Reproductive Health'
      ],
      idealFor: 'Women 18-60 years, Hormonal health',
      reportTime: '24-48 hours',
      homeCollection: true
    },
    {
      id: 'cardiac-health',
      name: 'Cardiac Health Package',
      subtitle: 'Heart Health Assessment',
      price: 1899,
      originalPrice: 2499,
      tests: 55,
      description: 'Focused on cardiovascular health and heart disease prevention',
      popular: false,
      features: [
        'Advanced Lipid Profile',
        'Cardiac Enzymes',
        'ECG Analysis',
        'Blood Pressure Monitoring',
        'Homocysteine',
        'CRP (High Sensitivity)',
        'Troponin I',
        'NT-proBNP',
        'Electrolyte Balance',
        'Coagulation Studies'
      ],
      idealFor: 'Adults with cardiac risk factors',
      reportTime: '24-48 hours',
      homeCollection: true
    },
    {
      id: 'executive-health',
      name: 'Executive Health Package',
      subtitle: 'Premium Comprehensive Screening',
      price: 4999,
      originalPrice: 6499,
      tests: 120,
      description: 'Most comprehensive package with advanced diagnostics',
      popular: false,
      features: [
        'All Senior Citizen tests',
        'Advanced Cancer Screening',
        'Genetic Predisposition Tests',
        'Heavy Metal Analysis',
        'Food Intolerance Panel',
        'Stress Hormone Analysis',
        'Advanced Imaging Markers',
        'Metabolic Syndrome Panel',
        'Autoimmune Disorders',
        'Executive Health Consultation'
      ],
      idealFor: 'Executives, High-stress professionals',
      reportTime: '48-72 hours',
      homeCollection: true
    }
  ];

  const features = [
    {
      icon: Shield,
      title: 'NABL Accredited Labs',
      description: 'All tests performed in NABL accredited laboratories ensuring highest quality standards'
    },
    {
      icon: Clock,
      title: 'Fast Results',
      description: 'Get your reports within 24-48 hours with detailed analysis and recommendations'
    },
    {
      icon: Users,
      title: 'Expert Consultation',
      description: 'Free consultation with our healthcare experts to understand your reports'
    },
    {
      icon: Heart,
      title: 'Comprehensive Care',
      description: 'Packages designed by medical experts covering all essential health parameters'
    }
  ];

  const howItWorks = [
    {
      step: 1,
      icon: Target,
      title: 'Choose Package',
      description: 'Select the health package that best suits your needs and age group'
    },
    {
      step: 2,
      icon: Calendar,
      title: 'Schedule Collection',
      description: 'Book a convenient time slot for home sample collection'
    },
    {
      step: 3,
      icon: Activity,
      title: 'Sample Collection',
      description: 'Our trained phlebotomist visits your home for safe sample collection'
    },
    {
      step: 4,
      icon: FileText,
      title: 'Get Results',
      description: 'Receive detailed reports with expert consultation and recommendations'
    }
  ];

  const faqs = [
    {
      question: 'How long does it take to get results?',
      answer: 'Most packages provide results within 24-48 hours. Complex packages may take up to 72 hours for comprehensive analysis.'
    },
    {
      question: 'Is home sample collection available for all packages?',
      answer: 'Yes, all our health packages include free home sample collection at your convenience.'
    },
    {
      question: 'Can I customize a package according to my needs?',
      answer: 'While our packages are expertly designed, you can contact our team to discuss specific requirements or additional tests.'
    },
    {
      question: 'Are the results reviewed by doctors?',
      answer: 'Yes, all reports are reviewed by qualified pathologists and include expert recommendations when needed.'
    },
    {
      question: 'What if I need to reschedule my appointment?',
      answer: 'You can reschedule your appointment up to 2 hours before the scheduled time through our customer support.'
    },
    {
      question: 'Do you provide consultation after receiving reports?',
      answer: 'Yes, we provide free consultation with healthcare experts to help you understand your reports and next steps.'
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="medical-background py-16">
        <div className="container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <div className="medical-badge-primary mb-6 inline-flex">
              <Stethoscope className="w-4 h-4 mr-2" />
              Comprehensive Health Packages
            </div>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-foreground">
              Complete Health Checkup Packages
            </h1>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Choose from our expertly curated health packages designed for different age groups and health needs. 
              Get comprehensive health insights with convenient home sample collection.
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>NABL Accredited Labs</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Home Sample Collection</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <CheckCircle className="h-5 w-5 text-primary" />
                <span>Expert Consultation</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Grid */}
      <div className="container-padding py-16">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-8">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className={`medical-card-hover relative ${
                pkg.popular ? 'ring-2 ring-primary shadow-lg' : ''
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
                {/* Header */}
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground text-sm mb-4">{pkg.subtitle}</p>
                  
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

                  {/* Test Count */}
                  <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground mb-4">
                    <div className="flex items-center gap-1">
                      <FileText className="h-4 w-4" />
                      <span>{pkg.tests} Tests</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>{pkg.reportTime}</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground text-center mb-6">{pkg.description}</p>

                {/* Key Features */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Key Tests Included:</h4>
                  <div className="space-y-2">
                    {pkg.features.slice(0, 5).map((feature, index) => (
                      <div key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{feature}</span>
                      </div>
                    ))}
                    {pkg.features.length > 5 && (
                      <div className="text-sm text-primary font-medium">
                        +{pkg.features.length - 5} more tests included
                      </div>
                    )}
                  </div>
                </div>

                {/* Ideal For */}
                <div className="bg-primary/5 rounded-lg p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="font-medium text-foreground">Ideal For:</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{pkg.idealFor}</p>
                </div>

                {/* Actions */}
                <div className="space-y-3">
                  <Button className="w-full medical-button-primary">
                    Book Package - ₹{pkg.price.toLocaleString()}
                  </Button>
                  <Button variant="outline" className="w-full medical-button-outline text-sm">
                    View All {pkg.tests} Tests
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="bg-muted/30 py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose Lynk Labs Health Packages?</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Our health packages are designed by medical experts to provide comprehensive health assessment at affordable prices
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <feature.icon className="h-8 w-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple 4-step process to get your comprehensive health checkup done
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {howItWorks.map((step, index) => (
              <div key={index} className="text-center relative">
                {index < 3 && (
                  <div className="hidden lg:block absolute top-12 left-full w-full h-0.5 bg-border -translate-y-1/2 z-0"></div>
                )}
                
                <div className="relative z-10">
                  <div className="relative w-16 h-16 bg-primary rounded-full flex items-center justify-center mb-6 mx-auto">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-secondary text-secondary-foreground rounded-full flex items-center justify-center text-xs font-bold">
                      {step.step}
                    </div>
                  </div>
                  <h3 className="text-xl font-semibold mb-4 text-foreground">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-muted/30 py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Get answers to common questions about our health packages
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, index) => (
              <div key={index} className="medical-card p-6">
                <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-primary text-primary-foreground py-16">
        <div className="container-padding text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Charge of Your Health?</h2>
          <p className="text-xl mb-8 opacity-90">
            Book your health package today and get comprehensive health insights with expert consultation
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-base font-semibold">
              Book Health Package
            </Button>
            <div className="flex items-center gap-6 text-primary-foreground/80">
              <div className="flex items-center gap-2">
                <Phone className="h-5 w-5" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5" />
                <span>support@lynklabs.com</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 