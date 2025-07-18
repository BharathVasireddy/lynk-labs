'use client';

import { BuilderComponent } from '@/components/builder/BuilderComponent';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowRight, Edit3, Eye, Palette, Zap, Code, Settings } from 'lucide-react';

export default function VisualLandingPage() {
  const [isBuilderMode, setIsBuilderMode] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Demo Header - Shows how to switch between Builder.io and coded content */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3">
        <div className="container-padding">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Palette className="h-5 w-5" />
              <span className="font-medium">Visual Page Builder Demo</span>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                Elementor-like Experience
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isBuilderMode ? "secondary" : "outline"}
                size="sm"
                onClick={() => setIsBuilderMode(!isBuilderMode)}
                className="text-white border-white/30 hover:bg-white/20"
              >
                {isBuilderMode ? <Eye className="h-4 w-4 mr-2" /> : <Edit3 className="h-4 w-4 mr-2" />}
                {isBuilderMode ? 'Preview Mode' : 'Edit Mode'}
              </Button>
              <Button asChild variant="secondary" size="sm">
                <a href="https://builder.io" target="_blank" rel="noopener noreferrer">
                  Try Builder.io
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Builder.io Editable Hero Section */}
      <BuilderComponent model="page" />

      {/* Instructions Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">How to Use Visual Page Builder</h2>
              <p className="text-xl text-gray-600">
                Transform your Next.js development with Elementor-like visual editing
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                    <Edit3 className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Visual Editing</h3>
                    <p className="text-gray-600">Like WordPress Elementor</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Drag and drop components</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Real-time preview</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>No coding required</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <span>Custom components library</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Zap className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold">Next.js Benefits</h3>
                    <p className="text-gray-600">Better than WordPress</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Lightning fast performance</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Perfect SEO scores</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Unlimited customization</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    <span>Enterprise security</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Setup Steps */}
            <div className="bg-white p-8 rounded-xl shadow-sm border">
              <h3 className="text-2xl font-bold mb-6 text-center">Quick Setup (5 Minutes)</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    1
                  </div>
                  <h4 className="font-semibold mb-2">Sign Up</h4>
                  <p className="text-sm text-gray-600">Create free Builder.io account</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    2
                  </div>
                  <h4 className="font-semibold mb-2">Get API Key</h4>
                  <p className="text-sm text-gray-600">Copy your public API key</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    3
                  </div>
                  <h4 className="font-semibold mb-2">Add to .env</h4>
                  <p className="text-sm text-gray-600">NEXT_PUBLIC_BUILDER_API_KEY</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold">
                    4
                  </div>
                  <h4 className="font-semibold mb-2">Start Editing</h4>
                  <p className="text-sm text-gray-600">Use BuilderComponent</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Components Showcase */}
      <section className="py-16 bg-white">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pre-built Components</h2>
            <p className="text-xl text-gray-600">
              Professional components ready for your health business
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Hero Section',
                description: 'Professional hero with CTAs, background images, and trust indicators',
                icon: <Zap className="h-6 w-6" />,
                features: ['Custom backgrounds', 'Multiple CTAs', 'Trust badges', 'Responsive design']
              },
              {
                name: 'Feature Grid',
                description: 'Display your services with icons, titles, and descriptions',
                icon: <Code className="h-6 w-6" />,
                features: ['Icon selection', 'Custom layouts', 'Background options', 'Hover effects']
              },
              {
                name: 'Health Packages',
                description: 'Beautiful package cards with pricing and features',
                icon: <Settings className="h-6 w-6" />,
                features: ['Popular badges', 'Feature lists', 'Custom pricing', 'CTA buttons']
              },
              {
                name: 'Statistics',
                description: 'Showcase your achievements with animated counters',
                icon: <ArrowRight className="h-6 w-6" />,
                features: ['Custom numbers', 'Labels', 'Background styles', 'Grid layouts']
              },
              {
                name: 'Testimonials',
                description: 'Customer reviews with ratings and photos',
                icon: <Edit3 className="h-6 w-6" />,
                features: ['Star ratings', 'Customer photos', 'Test details', 'Professional styling']
              },
              {
                name: 'CTA Sections',
                description: 'Call-to-action sections with multiple styles',
                icon: <Palette className="h-6 w-6" />,
                features: ['Gradient backgrounds', 'Image overlays', 'Multiple buttons', 'Custom text']
              }
            ].map((component, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                    {component.icon}
                  </div>
                  <h3 className="text-lg font-semibold">{component.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{component.description}</p>
                <ul className="space-y-1">
                  {component.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="text-sm text-gray-500 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comparison Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-padding">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">WordPress vs Next.js + Builder.io</h2>
              <p className="text-xl text-gray-600">
                Why upgrade from WordPress Elementor
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white p-8 rounded-xl shadow-sm border">
                <h3 className="text-xl font-bold mb-6 text-center text-gray-700">WordPress + Elementor</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Easy drag-and-drop editing</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                    <span>Slow loading times</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                    <span>Plugin conflicts</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                    <span>Security vulnerabilities</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                    </div>
                    <span>Limited customization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-yellow-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-yellow-600 rounded-full"></div>
                    </div>
                    <span>Hosting costs $20-100/month</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-primary/5 to-blue-50 p-8 rounded-xl shadow-sm border border-primary/20">
                <h3 className="text-xl font-bold mb-6 text-center text-primary">Next.js + Builder.io</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Same drag-and-drop experience</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Lightning-fast performance</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Enterprise-grade security</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Perfect SEO scores</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Unlimited customization</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                    </div>
                    <span>Free hosting on Vercel</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-blue-600 text-white">
        <div className="container-padding text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Upgrade Your Website?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            Get the power of visual editing with the performance and security of Next.js
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="px-8 py-4 text-base font-semibold" asChild>
              <a href="https://builder.io" target="_blank" rel="noopener noreferrer">
                Start Free Trial
              </a>
            </Button>
            <Button size="lg" variant="outline" className="px-8 py-4 text-base font-semibold border-white text-white hover:bg-white hover:text-primary" asChild>
              <Link href="/visual-editor-demo">
                See More Examples
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 