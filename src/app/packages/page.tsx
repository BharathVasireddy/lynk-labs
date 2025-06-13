import { Metadata } from 'next';
import { CheckCircle, Heart, Shield, Users, Clock, Award, Phone, Mail } from 'lucide-react';

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
      duration: '6-8 hours fasting required',
      ageGroup: '18+ years',
      popular: false,
      category: 'Basic',
      description: 'Comprehensive basic health screening covering essential parameters for overall health assessment.',
      includes: [
        'Complete Blood Count (CBC) - 28 parameters',
        'Comprehensive Metabolic Panel (CMP) - 14 parameters',
        'Lipid Profile Complete - 8 parameters',
        'Liver Function Test (LFT) - 12 parameters',
        'Kidney Function Test (KFT) - 6 parameters',
        'Thyroid Profile (TSH, T3, T4) - 3 parameters',
        'Diabetes Screening (FBS, HbA1c) - 2 parameters',
        'Urine Analysis Complete - 10 parameters',
        'Vitamin D3 (25-OH)',
        'Vitamin B12'
      ],
      benefits: [
        'Early disease detection',
        'Baseline health assessment',
        'Preventive care guidance',
        'Annual health monitoring'
      ],
      color: 'blue'
    },
    {
      id: 'comprehensive-health',
      name: 'Comprehensive Health Package',
      subtitle: 'Complete Wellness Assessment',
      price: 2899,
      originalPrice: 3799,
      tests: 85,
      duration: '12 hours fasting required',
      ageGroup: '25+ years',
      popular: true,
      category: 'Premium',
      description: 'Our most popular package offering comprehensive health screening with advanced biomarkers and cancer screening.',
      includes: [
        'Complete Blood Count with ESR - 29 parameters',
        'Comprehensive Metabolic Panel - 14 parameters',
        'Advanced Lipid Profile with Ratios - 12 parameters',
        'Liver Function Test Complete - 12 parameters',
        'Kidney Function Test with eGFR - 8 parameters',
        'Complete Thyroid Profile (TSH, T3, T4, Anti-TPO) - 4 parameters',
        'Diabetes Panel (FBS, PPBS, HbA1c, Insulin) - 4 parameters',
        'Iron Studies Complete - 5 parameters',
        'Vitamin Profile (D3, B12, Folate) - 3 parameters',
        'Cardiac Risk Markers (CRP-HS, Homocysteine) - 2 parameters',
        'Cancer Screening Markers (CEA, AFP, CA 19.9) - 3 parameters',
        'Urine Analysis with Microscopy - 15 parameters',
        'Stool Analysis - 8 parameters'
      ],
      benefits: [
        'Comprehensive disease screening',
        'Cancer risk assessment',
        'Cardiovascular health evaluation',
        'Nutritional status analysis',
        'Detailed health report with recommendations'
      ],
      color: 'primary'
    },
    {
      id: 'executive-health',
      name: 'Executive Health Package',
      subtitle: 'Premium Health Assessment',
      price: 4999,
      originalPrice: 6499,
      tests: 120,
      duration: '12 hours fasting + ECG',
      ageGroup: '35+ years',
      popular: false,
      category: 'Executive',
      description: 'Premium health package designed for busy executives with comprehensive screening and additional diagnostic tests.',
      includes: [
        'Complete Blood Count with Peripheral Smear - 32 parameters',
        'Comprehensive Metabolic Panel Extended - 16 parameters',
        'Advanced Lipid Profile with ApoB/ApoA1 - 15 parameters',
        'Liver Function Test with GGT - 13 parameters',
        'Kidney Function Test Complete - 10 parameters',
        'Complete Thyroid Profile with Antibodies - 6 parameters',
        'Advanced Diabetes Panel with C-Peptide - 6 parameters',
        'Complete Iron Studies with Ferritin - 6 parameters',
        'Comprehensive Vitamin Panel (D3, B12, Folate, B6) - 4 parameters',
        'Cardiac Risk Assessment (CRP-HS, Homocysteine, Troponin-I) - 3 parameters',
        'Comprehensive Cancer Screening (CEA, AFP, CA 19.9, PSA/CA 125) - 4 parameters',
        'Hormone Panel (Testosterone/Estradiol, Cortisol) - 2 parameters',
        'Autoimmune Markers (ANA, RF) - 2 parameters',
        'Complete Urine Analysis with Culture - 20 parameters',
        'Stool Analysis with Occult Blood - 10 parameters',
        'ECG (Electrocardiogram)',
        'Chest X-Ray'
      ],
      benefits: [
        'Executive health assessment',
        'Stress-related health monitoring',
        'Advanced cancer screening',
        'Cardiovascular risk evaluation',
        'Hormone level assessment',
        'Priority appointment scheduling',
        'Detailed consultation with specialist'
      ],
      color: 'purple'
    },
    {
      id: 'womens-health',
      name: "Women's Health Package",
      subtitle: 'Specialized Care for Women',
      price: 2499,
      originalPrice: 3199,
      tests: 75,
      duration: '8 hours fasting required',
      ageGroup: '21+ years',
      popular: false,
      category: 'Specialized',
      description: 'Comprehensive health package specifically designed for women\'s unique health needs and concerns.',
      includes: [
        'Complete Blood Count with ESR - 29 parameters',
        'Comprehensive Metabolic Panel - 14 parameters',
        'Lipid Profile Complete - 10 parameters',
        'Liver & Kidney Function Tests - 18 parameters',
        'Complete Thyroid Profile - 4 parameters',
        'Diabetes Screening Panel - 3 parameters',
        'Iron Studies with Ferritin - 5 parameters',
        'Vitamin Profile (D3, B12, Folate) - 3 parameters',
        'Women\'s Hormone Panel (Estradiol, Progesterone, LH, FSH) - 4 parameters',
        'Reproductive Health Markers (Prolactin, AMH) - 2 parameters',
        'Women\'s Cancer Screening (CA 125, CA 15.3, CEA) - 3 parameters',
        'Bone Health (Calcium, Phosphorus, ALP) - 3 parameters',
        'Complete Urine Analysis - 12 parameters',
        'Pap Smear (Cervical Cancer Screening)',
        'Breast Examination Consultation'
      ],
      benefits: [
        'Reproductive health assessment',
        'Hormonal balance evaluation',
        'Cancer screening specific to women',
        'Bone health monitoring',
        'Fertility assessment',
        'Menstrual health evaluation'
      ],
      color: 'pink'
    },
    {
      id: 'mens-health',
      name: "Men's Health Package",
      subtitle: 'Comprehensive Care for Men',
      price: 2299,
      originalPrice: 2999,
      tests: 70,
      duration: '8 hours fasting required',
      ageGroup: '25+ years',
      popular: false,
      category: 'Specialized',
      description: 'Tailored health package addressing men\'s specific health concerns and risk factors.',
      includes: [
        'Complete Blood Count with ESR - 29 parameters',
        'Comprehensive Metabolic Panel - 14 parameters',
        'Advanced Lipid Profile - 12 parameters',
        'Liver & Kidney Function Tests - 18 parameters',
        'Complete Thyroid Profile - 4 parameters',
        'Diabetes Screening Panel - 3 parameters',
        'Iron Studies Complete - 5 parameters',
        'Vitamin Profile (D3, B12) - 2 parameters',
        'Men\'s Hormone Panel (Total & Free Testosterone, DHEA-S) - 3 parameters',
        'Prostate Health (PSA Total & Free, DRE consultation) - 2 parameters',
        'Cardiac Risk Markers (CRP-HS, Homocysteine) - 2 parameters',
        'Men\'s Cancer Screening (CEA, AFP, PSA) - 3 parameters',
        'Complete Urine Analysis - 12 parameters',
        'Fitness Assessment Consultation'
      ],
      benefits: [
        'Prostate health monitoring',
        'Testosterone level assessment',
        'Cardiovascular risk evaluation',
        'Cancer screening for men',
        'Fitness and vitality assessment',
        'Lifestyle counseling'
      ],
      color: 'indigo'
    },
    {
      id: 'senior-citizen',
      name: 'Senior Citizen Package',
      subtitle: 'Comprehensive Care for 60+',
      price: 3799,
      originalPrice: 4899,
      tests: 95,
      duration: '12 hours fasting + ECG',
      ageGroup: '60+ years',
      popular: false,
      category: 'Age-Specific',
      description: 'Specialized health package designed for senior citizens with focus on age-related health concerns.',
      includes: [
        'Complete Blood Count with Peripheral Smear - 32 parameters',
        'Comprehensive Metabolic Panel - 16 parameters',
        'Advanced Lipid Profile with Ratios - 12 parameters',
        'Liver & Kidney Function Tests Complete - 20 parameters',
        'Complete Thyroid Profile - 4 parameters',
        'Advanced Diabetes Panel - 5 parameters',
        'Iron Studies with Ferritin - 6 parameters',
        'Comprehensive Vitamin Panel (D3, B12, Folate) - 3 parameters',
        'Cardiac Risk Assessment Complete - 4 parameters',
        'Senior Cancer Screening Panel - 5 parameters',
        'Bone Health Assessment (Calcium, Phosphorus, Vitamin D) - 3 parameters',
        'Cognitive Health Markers (B12, Folate, TSH) - 3 parameters',
        'Inflammatory Markers (ESR, CRP) - 2 parameters',
        'Complete Urine Analysis - 15 parameters',
        'Stool Analysis with Occult Blood - 8 parameters',
        'ECG (Electrocardiogram)',
        'Blood Pressure Monitoring',
        'Geriatric Consultation'
      ],
      benefits: [
        'Age-related disease screening',
        'Cognitive health assessment',
        'Bone health monitoring',
        'Cardiovascular evaluation',
        'Cancer screening',
        'Medication interaction check',
        'Geriatric specialist consultation'
      ],
      color: 'emerald'
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

  const getColorClasses = (color: string) => {
    const colorMap = {
      blue: 'border-blue-500 bg-blue-50',
      primary: 'border-primary bg-primary/5',
      purple: 'border-purple-500 bg-purple-50',
      pink: 'border-pink-500 bg-pink-50',
      indigo: 'border-indigo-500 bg-indigo-50',
      emerald: 'border-emerald-500 bg-emerald-50'
    };
    return colorMap[color as keyof typeof colorMap] || 'border-gray-300 bg-gray-50';
  };

  const getButtonColorClasses = (color: string) => {
    const colorMap = {
      blue: 'bg-blue-600 hover:bg-blue-700',
      primary: 'bg-primary hover:bg-primary/90',
      purple: 'bg-purple-600 hover:bg-purple-700',
      pink: 'bg-pink-600 hover:bg-pink-700',
      indigo: 'bg-indigo-600 hover:bg-indigo-700',
      emerald: 'bg-emerald-600 hover:bg-emerald-700'
    };
    return colorMap[color as keyof typeof colorMap] || 'bg-gray-600 hover:bg-gray-700';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Comprehensive Health Packages
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Choose from our expertly curated health packages designed for different age groups and health needs
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>NABL Accredited Labs</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                <span>Home Sample Collection</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
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
              className={`medical-card relative overflow-hidden ${
                pkg.popular ? 'ring-2 ring-primary shadow-xl' : ''
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-primary text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </span>
                </div>
              )}

              <div className={`h-2 ${getColorClasses(pkg.color).split(' ')[1]}`}></div>

              <div className="p-6">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getColorClasses(pkg.color)}`}>
                      {pkg.category}
                    </span>
                    <span className="text-sm text-muted-foreground">{pkg.ageGroup}</span>
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                  <p className="text-muted-foreground mb-4">{pkg.subtitle}</p>
                  
                  <div className="flex items-center justify-center gap-3 mb-2">
                    <span className="text-3xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
                    <span className="text-lg text-muted-foreground line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                  </div>
                  <p className="text-green-600 font-medium">
                    Save ₹{(pkg.originalPrice - pkg.price).toLocaleString()} ({Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% off)
                  </p>
                </div>

                {/* Package Info */}
                <div className="grid grid-cols-2 gap-4 mb-6 p-4 bg-muted/30 rounded-lg">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary">{pkg.tests}</div>
                    <div className="text-sm text-muted-foreground">Tests Included</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm font-medium text-foreground">Fasting</div>
                    <div className="text-xs text-muted-foreground">{pkg.duration}</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-muted-foreground mb-6">{pkg.description}</p>

                {/* Key Benefits */}
                <div className="mb-6">
                  <h4 className="font-semibold text-foreground mb-3">Key Benefits:</h4>
                  <ul className="space-y-2">
                    {pkg.benefits.slice(0, 4).map((benefit, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA Button */}
                <button className={`w-full ${getButtonColorClasses(pkg.color)} text-white py-3 px-4 rounded-lg font-medium transition-colors duration-200 mb-4`}>
                  Book This Package
                </button>

                {/* View Details Link */}
                <button className="w-full text-primary hover:text-primary/80 text-sm font-medium transition-colors">
                  View Detailed Test List →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-white py-16">
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
                <div className="medical-icon-container mb-4">
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
      <div className="bg-gradient-to-r from-blue-50 to-green-50 py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Simple steps to get your health checkup done</p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                step: '1',
                title: 'Choose Package',
                description: 'Select the health package that suits your needs and age group'
              },
              {
                step: '2',
                title: 'Book Online',
                description: 'Book your appointment online and choose convenient time slot'
              },
              {
                step: '3',
                title: 'Sample Collection',
                description: 'Our trained phlebotomist will collect samples at your home'
              },
              {
                step: '4',
                title: 'Get Results',
                description: 'Receive detailed reports with expert consultation within 24-48 hours'
              }
            ].map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-white py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">Frequently Asked Questions</h2>
          </div>

          <div className="max-w-4xl mx-auto space-y-6">
            {[
              {
                question: 'How long does fasting require before the test?',
                answer: 'Most packages require 8-12 hours of fasting. You can drink water during the fasting period. Specific fasting requirements are mentioned for each package.'
              },
              {
                question: 'Are the test results accurate and reliable?',
                answer: 'Yes, all our tests are performed in NABL accredited laboratories using state-of-the-art equipment. Our labs follow strict quality control measures to ensure accurate results.'
              },
              {
                question: 'Can I customize a health package according to my needs?',
                answer: 'Yes, we offer customized health packages. You can speak with our healthcare experts who will recommend tests based on your health concerns and medical history.'
              },
              {
                question: 'Is home sample collection available for all packages?',
                answer: 'Yes, we provide free home sample collection for all our health packages across all serviceable areas. Our trained phlebotomists ensure safe and hygienic sample collection.'
              },
              {
                question: 'Do you provide consultation after receiving reports?',
                answer: 'Yes, we provide free consultation with our healthcare experts to help you understand your reports and provide recommendations for maintaining good health.'
              }
            ].map((faq, index) => (
              <div key={index} className="medical-card p-6">
                <h3 className="font-semibold text-foreground mb-3">{faq.question}</h3>
                <p className="text-muted-foreground">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary to-blue-600 text-white py-16">
        <div className="container-padding text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Take Charge of Your Health?</h2>
          <p className="text-xl mb-8 text-blue-100">
            Book your health package today and get comprehensive health insights
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button className="medical-button-primary bg-white text-primary hover:bg-gray-100">
              Book Health Package
            </button>
            <div className="flex items-center gap-4 text-blue-100">
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