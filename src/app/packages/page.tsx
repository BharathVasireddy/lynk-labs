"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, Clock, Home, FileText, User, TestTube, Star, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const packages = [
  {
    id: 'basic-health',
    name: 'Basic Health Checkup',
    subtitle: 'Essential Health Screening',
    price: 1299,
    originalPrice: 1699,
    tests: 45,
    ageGroup: '18-40 years',
    reportTime: '24 hours',
    popular: false,
    image: '/images/package_basic_health_1767879134142.png',
    features: [
      'Complete Blood Count (CBC)',
      'Lipid Profile',
      'Blood Sugar (Fasting & PP)',
      'Liver Function Tests',
      'Kidney Function Tests',
      'Thyroid Profile',
      'Vitamin D3 & B12',
      'Urine Analysis'
    ]
  },
  {
    id: 'comprehensive-health',
    name: 'Comprehensive Health Checkup',
    subtitle: 'Complete Health Assessment',
    price: 2899,
    originalPrice: 3799,
    tests: 85,
    ageGroup: '25-55 years',
    reportTime: '24-48 hours',
    popular: true,
    image: '/images/package_comprehensive_1767879153776.png',
    features: [
      'All Basic Health Checkup tests',
      'Cancer Screening Markers',
      'Advanced Cardiac Assessment',
      'Diabetes Panel (HbA1c)',
      'Hepatitis B & C Screening',
      'Complete Electrolyte Panel',
      'Arthritis Panel',
      'Advanced Protein Studies'
    ]
  },
  {
    id: 'senior-citizen',
    name: 'Senior Citizen Health Checkup',
    subtitle: 'For 50+ Age Group',
    price: 3499,
    originalPrice: 4599,
    tests: 95,
    ageGroup: '50+ years',
    reportTime: '48 hours',
    popular: false,
    image: '/images/package_senior_health_1767879172754.png',
    features: [
      'All Comprehensive tests',
      'Bone Health Assessment',
      'Advanced Cardiac Markers',
      'Prostate Health (PSA)',
      'Complete Tumor Markers',
      'Rheumatoid Factor',
      'CRP (Inflammation)',
      'Cognitive Health Markers'
    ]
  },
  {
    id: 'womens-health',
    name: "Women's Health Checkup",
    subtitle: 'Comprehensive Women Wellness',
    price: 2599,
    originalPrice: 3399,
    tests: 75,
    ageGroup: '18-60 years',
    reportTime: '24-48 hours',
    popular: false,
    image: '/images/package_womens_health_1767879199743.png',
    features: [
      'All Basic Health tests',
      'Complete Hormonal Profile',
      'PCOS/PCOD Screening',
      'Breast Cancer Markers',
      'Bone Density Markers',
      'Iron & Anemia Panel',
      'Menopause Panel',
      'Reproductive Health'
    ]
  },
  {
    id: 'cardiac-health',
    name: 'Cardiac Health Checkup',
    subtitle: 'Heart Health Assessment',
    price: 1899,
    originalPrice: 2499,
    tests: 55,
    ageGroup: '30+ years',
    reportTime: '24 hours',
    popular: false,
    image: '/images/package_cardiac_1767879219805.png',
    features: [
      'Advanced Lipid Profile',
      'Cardiac Enzymes',
      'ECG Analysis',
      'Blood Pressure Check',
      'Homocysteine',
      'CRP High Sensitivity',
      'Troponin I',
      'NT-proBNP'
    ]
  },
  {
    id: 'executive-health',
    name: 'Executive Health Checkup',
    subtitle: 'Premium Comprehensive Screening',
    price: 4999,
    originalPrice: 6499,
    tests: 120,
    ageGroup: '30-60 years',
    reportTime: '48-72 hours',
    popular: false,
    image: '/images/package_executive_1767879236102.png',
    features: [
      'All Senior Citizen tests',
      'Advanced Cancer Screening',
      'Heavy Metal Analysis',
      'Food Intolerance Panel',
      'Stress Hormone Analysis',
      'Autoimmune Screening',
      'Metabolic Syndrome Panel',
      'Specialist Consultation'
    ]
  }
];

const categories = [
  { id: 'all', name: 'All Packages' },
  { id: 'basic', name: 'Basic' },
  { id: 'comprehensive', name: 'Comprehensive' },
  { id: 'senior', name: 'Senior Citizens' },
  { id: 'women', name: "Women's Health" },
  { id: 'cardiac', name: 'Cardiac' },
  { id: 'executive', name: 'Executive' }
];

export default function PackagesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredPackages = packages.filter(pkg => {
    const matchesSearch = searchQuery === '' ||
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.features.some(f => f.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || pkg.id.includes(selectedCategory);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header Section */}
      <section className="relative py-12 lg:py-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/95 to-teal-600" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-padding relative">
          <div className="max-w-3xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-4">
              <TestTube className="w-4 h-4 text-white" />
              <span className="text-sm font-medium text-white">Health Packages</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Health Checkup Packages
            </h1>
            <p className="text-white/80 mb-6">
              Choose from our expertly curated packages with free home collection in Hyderabad
            </p>

            {/* Search */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Search packages or tests..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 rounded-xl bg-white border-0 shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b py-4 shadow-sm">
        <div className="container-padding">
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${selectedCategory === cat.id
                  ? 'bg-primary text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="container-padding py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={pkg.image}
                  alt={pkg.name}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3 bg-green-500 text-white px-2 py-1 rounded-lg text-xs font-bold">
                  {Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100)}% OFF
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="mb-3">
                  <h3 className="text-lg font-bold text-slate-900">{pkg.name}</h3>
                  <p className="text-sm text-slate-500">{pkg.subtitle}</p>
                </div>

                {/* Meta Info */}
                <div className="flex flex-wrap gap-3 mb-4 text-xs text-slate-500">
                  <div className="flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5" />
                    <span>{pkg.tests} Tests</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{pkg.reportTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="w-3.5 h-3.5" />
                    <span>{pkg.ageGroup}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Home className="w-3.5 h-3.5" />
                    <span>Free Collection</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <div className="grid grid-cols-1 gap-1.5">
                    {pkg.features.slice(0, 4).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm text-slate-600">
                        <CheckCircle className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>
                  {pkg.features.length > 4 && (
                    <p className="text-xs text-primary font-medium mt-2">
                      +{pkg.features.length - 4} more tests
                    </p>
                  )}
                </div>

                {/* Pricing */}
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-2xl font-bold text-primary">₹{pkg.price.toLocaleString()}</span>
                  <span className="text-sm text-slate-400 line-through">₹{pkg.originalPrice.toLocaleString()}</span>
                </div>

                {/* Action */}
                <Button className="w-full bg-gradient-to-r from-primary to-teal-600 hover:from-primary/90 hover:to-teal-600/90 text-white rounded-xl" asChild>
                  <Link href={`/checkout?package=${pkg.id}`}>
                    Book Package
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {filteredPackages.length === 0 && (
          <div className="text-center py-16">
            <TestTube className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No packages found</h3>
            <p className="text-slate-500 mb-4">Try adjusting your search or filter</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}