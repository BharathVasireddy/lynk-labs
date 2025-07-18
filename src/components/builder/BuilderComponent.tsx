'use client';

import { builder, Builder } from '@builder.io/react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight, Shield, Clock, Home, Users, Star, CheckCircle, Phone, Mail, Calendar, Award, Microscope, FileText } from 'lucide-react';

// Initialize Builder with your API key (you'll need to get this from builder.io)
builder.init(process.env.NEXT_PUBLIC_BUILDER_API_KEY || 'your-builder-api-key');

interface BuilderComponentProps {
  model: string;
  content?: any;
}

export function BuilderComponent({ model, content }: BuilderComponentProps) {
  const [builderContent, setBuilderContent] = useState(content);
  const [loading, setLoading] = useState(!content);

  useEffect(() => {
    if (!content) {
      builder
        .get(model, {
          url: window.location.pathname,
        })
        .promise()
        .then((content) => {
          setBuilderContent(content);
          setLoading(false);
        });
    }
  }, [model, content]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!builderContent) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-semibold text-muted-foreground">
          No content found for this page
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          Create content in Builder.io to see it here
        </p>
      </div>
    );
  }

  return (
    <Builder
      model={model}
      content={builderContent}
      // Custom components that can be used in Builder
      customComponents={[
        // Hero Section Component
        {
          name: 'HeroSection',
          inputs: [
            { name: 'title', type: 'string', defaultValue: 'Your Health, Our Priority' },
            { name: 'subtitle', type: 'longText', defaultValue: 'Book lab tests online with home sample collection, get fast accurate results, and take control of your health journey.' },
            { name: 'primaryButtonText', type: 'string', defaultValue: 'Book Lab Tests' },
            { name: 'primaryButtonLink', type: 'string', defaultValue: '/tests' },
            { name: 'secondaryButtonText', type: 'string', defaultValue: 'View Packages' },
            { name: 'secondaryButtonLink', type: 'string', defaultValue: '/packages' },
            { name: 'badgeText', type: 'string', defaultValue: 'NABL Accredited Lab' },
            { name: 'backgroundImage', type: 'file' },
            { name: 'showTrustIndicators', type: 'boolean', defaultValue: true },
          ],
          component: ({ title, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, badgeText, backgroundImage, showTrustIndicators }) => (
            <section className="relative medical-background py-20 lg:py-32 overflow-hidden" style={{
              backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}>
              <div className="container-padding relative">
                <div className="max-w-4xl mx-auto text-center">
                  {badgeText && (
                    <div className="medical-badge-primary mb-6 inline-flex scale-hover">
                      <Shield className="w-4 h-4 mr-2" />
                      {badgeText}
                    </div>
                  )}
                  <h1 className="text-4xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
                    {title}
                  </h1>
                  <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
                    {subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" className="medical-button-primary px-8 py-4 text-base font-semibold liquid-hover" asChild>
                      <Link href={primaryButtonLink}>
                        {primaryButtonText}
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="lg" className="medical-button-outline px-8 py-4 text-base font-semibold" asChild>
                      <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
                    </Button>
                  </div>
                  
                  {showTrustIndicators && (
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8 pt-8 border-t">
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
                  )}
                </div>
              </div>
            </section>
          ),
        },

        // Feature Grid Component
        {
          name: 'FeatureGrid',
          inputs: [
            { name: 'title', type: 'string', defaultValue: 'Why Choose Us?' },
            { name: 'subtitle', type: 'longText', defaultValue: 'We provide the best healthcare services with cutting-edge technology.' },
            { name: 'features', type: 'list', subFields: [
              { name: 'icon', type: 'string', enum: ['home', 'shield', 'clock', 'users', 'award', 'microscope', 'phone', 'mail'] },
              { name: 'title', type: 'string' },
              { name: 'description', type: 'longText' }
            ]},
            { name: 'backgroundColor', type: 'string', enum: ['white', 'gray', 'primary'], defaultValue: 'white' },
          ],
          component: ({ title, subtitle, features, backgroundColor }) => {
            const iconMap = {
              home: Home,
              shield: Shield,
              clock: Clock,
              users: Users,
              award: Award,
              microscope: Microscope,
              phone: Phone,
              mail: Mail,
            };

            const bgClass = backgroundColor === 'gray' ? 'bg-gray-50' : 
                            backgroundColor === 'primary' ? 'bg-primary text-primary-foreground' : 
                            'bg-background';

            return (
              <section className={`py-20 ${bgClass}`}>
                <div className="container-padding">
                  <div className="text-center mb-16">
                    <h2 className="text-3xl lg:text-4xl font-bold mb-6">{title}</h2>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                      {subtitle}
                    </p>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features?.map((feature: any, index: number) => {
                      const IconComponent = iconMap[feature.icon as keyof typeof iconMap] || Shield;
                      return (
                        <div key={index} className="medical-card p-6 text-center group hover:shadow-lg transition-all duration-300">
                          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-6 mx-auto group-hover:bg-primary/20 transition-colors scale-hover">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-xl font-semibold mb-4 group-hover:text-primary transition-colors">
                            {feature.title}
                          </h3>
                          <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </section>
            );
          },
        },

        // Health Package Card Component (Enhanced)
        {
          name: 'HealthPackageCard',
          inputs: [
            { name: 'title', type: 'string' },
            { name: 'price', type: 'number' },
            { name: 'originalPrice', type: 'number' },
            { name: 'tests', type: 'number' },
            { name: 'description', type: 'longText' },
            { name: 'features', type: 'list', subFields: [{ name: 'feature', type: 'string' }] },
            { name: 'image', type: 'file' },
            { name: 'isPopular', type: 'boolean', defaultValue: false },
            { name: 'buttonText', type: 'string', defaultValue: 'Book Now' },
            { name: 'buttonLink', type: 'string', defaultValue: '/packages' },
          ],
          component: ({ title, price, originalPrice, tests, description, features, image, isPopular, buttonText, buttonLink }) => (
            <div className={`medical-card-hover p-6 rounded-lg border relative ${isPopular ? 'border-2 border-primary shadow-lg scale-105' : ''}`}>
              {isPopular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold">
                    Most Popular
                  </span>
                </div>
              )}
              
              {image && (
                <img src={image} alt={title} className="w-full h-48 object-cover rounded-lg mb-4" />
              )}
              <h3 className="text-xl font-bold mb-2">{title}</h3>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-2xl font-bold text-primary">₹{price?.toLocaleString()}</span>
                {originalPrice && (
                  <span className="text-lg text-muted-foreground line-through">₹{originalPrice?.toLocaleString()}</span>
                )}
              </div>
              <p className="text-sm text-muted-foreground mb-2">{tests} tests included</p>
              <p className="text-muted-foreground mb-4">{description}</p>
              {features && (
                <ul className="space-y-1 mb-6">
                  {features.map((item: any, index: number) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-primary flex-shrink-0" />
                      {item.feature}
                    </li>
                  ))}
                </ul>
              )}
              <Button className={`w-full ${isPopular ? 'medical-button-primary' : 'medical-button-outline'}`} asChild>
                <Link href={buttonLink}>{buttonText}</Link>
              </Button>
            </div>
          ),
        },

        // Stats Section Component
        {
          name: 'StatsSection',
          inputs: [
            { name: 'stats', type: 'list', subFields: [
              { name: 'value', type: 'string' },
              { name: 'label', type: 'string' }
            ]},
            { name: 'backgroundColor', type: 'string', enum: ['primary', 'secondary', 'gray'], defaultValue: 'primary' },
          ],
          component: ({ stats, backgroundColor }) => {
            const bgClass = backgroundColor === 'primary' ? 'bg-primary text-primary-foreground' :
                            backgroundColor === 'secondary' ? 'bg-secondary text-secondary-foreground' :
                            'bg-gray-50';

            return (
              <section className={`py-16 ${bgClass}`}>
                <div className="container-padding">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                    {stats?.map((stat: any, index: number) => (
                      <div key={index} className="text-center">
                        <div className="text-3xl lg:text-4xl font-bold mb-2">{stat.value}</div>
                        <div className="opacity-80">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            );
          },
        },

        // CTA Section Component
        {
          name: 'CTASection',
          inputs: [
            { name: 'title', type: 'string', defaultValue: 'Ready to Take Control of Your Health?' },
            { name: 'subtitle', type: 'longText', defaultValue: 'Book your lab tests today and get accurate results delivered to your doorstep.' },
            { name: 'primaryButtonText', type: 'string', defaultValue: 'Book Tests Now' },
            { name: 'primaryButtonLink', type: 'string', defaultValue: '/tests' },
            { name: 'secondaryButtonText', type: 'string', defaultValue: 'Contact Us' },
            { name: 'secondaryButtonLink', type: 'string', defaultValue: '/contact' },
            { name: 'backgroundType', type: 'string', enum: ['gradient', 'solid', 'image'], defaultValue: 'gradient' },
            { name: 'backgroundImage', type: 'file' },
          ],
          component: ({ title, subtitle, primaryButtonText, primaryButtonLink, secondaryButtonText, secondaryButtonLink, backgroundType, backgroundImage }) => {
            const bgClass = backgroundType === 'gradient' ? 'bg-gradient-to-r from-primary to-primary/90 text-primary-foreground' :
                            backgroundType === 'solid' ? 'bg-primary text-primary-foreground' :
                            'bg-cover bg-center text-white';

            return (
              <section 
                className={`py-20 ${bgClass}`}
                style={{
                  backgroundImage: backgroundType === 'image' && backgroundImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${backgroundImage})` : undefined,
                }}
              >
                <div className="container-padding text-center">
                  <h2 className="text-3xl lg:text-4xl font-bold mb-6">{title}</h2>
                  <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                    {subtitle}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button size="lg" variant="secondary" className="px-8 py-4 text-base font-semibold scale-hover" asChild>
                      <Link href={primaryButtonLink}>{primaryButtonText}</Link>
                    </Button>
                    <Button size="lg" variant="outline" className="px-8 py-4 text-base font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary scale-hover" asChild>
                      <Link href={secondaryButtonLink}>{secondaryButtonText}</Link>
                    </Button>
                  </div>
                </div>
              </section>
            );
          },
        },

        // Testimonial Card Component (Enhanced)
        {
          name: 'TestimonialCard',
          inputs: [
            { name: 'name', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'rating', type: 'number', defaultValue: 5 },
            { name: 'comment', type: 'longText' },
            { name: 'image', type: 'file' },
            { name: 'testType', type: 'string' },
          ],
          component: ({ name, location, rating, comment, image, testType }) => (
            <div className="medical-card p-6">
              <div className="flex items-center mb-4">
                {image && (
                  <img src={image} alt={name} className="w-12 h-12 rounded-full mr-3 object-cover" />
                )}
                <div>
                  <div className="font-semibold">{name}</div>
                  <div className="text-sm text-muted-foreground">{location}</div>
                </div>
              </div>
              <div className="flex text-yellow-400 mb-3">
                {[...Array(rating || 5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-muted-foreground italic mb-4">"{comment}"</p>
              {testType && (
                <div className="text-xs text-primary font-medium">Tested: {testType}</div>
              )}
            </div>
          ),
        },

        // Contact Info Component
        {
          name: 'ContactInfo',
          inputs: [
            { name: 'phone', type: 'string', defaultValue: '1800-123-4567' },
            { name: 'email', type: 'string', defaultValue: 'support@lynklabs.in' },
            { name: 'address', type: 'string', defaultValue: 'Mumbai, India' },
            { name: 'showLiveChat', type: 'boolean', defaultValue: true },
          ],
          component: ({ phone, email, address, showLiveChat }) => (
            <section className="py-20 bg-primary text-primary-foreground">
              <div className="container-padding">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-4">
                      <Phone className="h-6 w-6 mr-3" />
                      <h3 className="text-xl font-semibold">Call Us</h3>
                    </div>
                    <p className="opacity-90 mb-2">24/7 Customer Support</p>
                    <p className="text-lg font-semibold">{phone}</p>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-4">
                      <Mail className="h-6 w-6 mr-3" />
                      <h3 className="text-xl font-semibold">Email Us</h3>
                    </div>
                    <p className="opacity-90 mb-2">Get Quick Response</p>
                    <p className="text-lg font-semibold">{email}</p>
                  </div>
                  
                  <div className="text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start mb-4">
                      <Calendar className="h-6 w-6 mr-3" />
                      <h3 className="text-xl font-semibold">Visit Us</h3>
                    </div>
                    <p className="opacity-90 mb-2">Main Laboratory</p>
                    <p className="text-lg font-semibold">{address}</p>
                  </div>
                  
                  {showLiveChat && (
                    <div className="text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start mb-4">
                        <Users className="h-6 w-6 mr-3" />
                        <h3 className="text-xl font-semibold">Live Chat</h3>
                      </div>
                      <p className="opacity-90 mb-2">Instant Support</p>
                      <Button variant="secondary" size="sm" className="mt-2">
                        Start Chat
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </section>
          ),
        },
      ]}
    />
  );
} 