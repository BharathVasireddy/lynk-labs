"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Search, Calendar, User, Tag, ArrowRight, TrendingUp, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  authorName: string;
  categoryTitle: string;
  categorySlug: { current: string };
  mainImage?: string;
  mainImageAlt?: string;
}

interface BlogCategory {
  _id: string;
  title: string;
  slug: { current: string };
  postCount: number;
}

const mockPosts: BlogPost[] = [
  {
    _id: '1',
    title: 'Complete Guide to Blood Tests in Hyderabad: What You Need to Know',
    slug: { current: 'complete-guide-blood-tests-hyderabad' },
    excerpt: 'Everything you need to know about blood tests available in Hyderabad, from preparation to understanding results. Expert insights from NABL accredited labs.',
    publishedAt: '2024-01-15T10:00:00Z',
    readTime: 8,
    featured: true,
    authorName: 'Dr. Priya Sharma',
    categoryTitle: 'Lab Tests',
    categorySlug: { current: 'lab-tests' },
    mainImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    mainImageAlt: 'Blood test vials in laboratory setting'
  },
  {
    _id: '2',
    title: 'Preventive Health Checkups: Why Regular Screening Matters in Hyderabad',
    slug: { current: 'preventive-health-checkups-hyderabad' },
    excerpt: 'Discover the importance of regular health screenings and how preventive care can help detect health issues early in Hyderabad\'s climate and lifestyle.',
    publishedAt: '2024-01-12T14:30:00Z',
    readTime: 6,
    featured: true,
    authorName: 'Dr. Rajesh Kumar',
    categoryTitle: 'Preventive Care',
    categorySlug: { current: 'preventive-care' },
    mainImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    mainImageAlt: 'Doctor consulting with patient about preventive care'
  },
  {
    _id: '3',
    title: 'Understanding Diabetes: Early Detection Through Lab Tests',
    slug: { current: 'understanding-diabetes-early-detection-lab-tests' },
    excerpt: 'Learn about diabetes risk factors, symptoms, and how early detection through proper lab testing can help manage this condition effectively.',
    publishedAt: '2024-01-10T09:15:00Z',
    readTime: 10,
    featured: false,
    authorName: 'Dr. Anita Reddy',
    categoryTitle: 'Diabetes Care',
    categorySlug: { current: 'diabetes-care' },
    mainImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop',
    mainImageAlt: 'Diabetes testing equipment and glucose meter'
  },
  {
    _id: '4',
    title: 'Heart Health: Essential Cardiac Tests for Hyderabad Residents',
    slug: { current: 'heart-health-essential-cardiac-tests-hyderabad' },
    excerpt: 'Comprehensive guide to cardiac health screening tests available in Hyderabad. Learn when and why you need heart health checkups.',
    publishedAt: '2024-01-08T11:45:00Z',
    readTime: 7,
    featured: false,
    authorName: 'Dr. Suresh Nair',
    categoryTitle: 'Cardiac Health',
    categorySlug: { current: 'cardiac-health' },
    mainImage: 'https://images.unsplash.com/photo-1559757175-0eb30cd8c063?w=800&h=400&fit=crop',
    mainImageAlt: 'ECG heart monitoring equipment'
  },
  {
    _id: '5',
    title: 'Women\'s Health: Essential Tests Every Woman in Hyderabad Should Know',
    slug: { current: 'womens-health-essential-tests-hyderabad' },
    excerpt: 'Comprehensive guide to women\'s health screening tests, from routine checkups to specialized tests for different life stages.',
    publishedAt: '2024-01-05T16:20:00Z',
    readTime: 9,
    featured: false,
    authorName: 'Dr. Kavitha Menon',
    categoryTitle: 'Women\'s Health',
    categorySlug: { current: 'womens-health' },
    mainImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop',
    mainImageAlt: 'Women\'s health consultation and testing'
  },
  {
    _id: '6',
    title: 'Home Sample Collection: Convenient Lab Testing in Hyderabad',
    slug: { current: 'home-sample-collection-convenient-lab-testing-hyderabad' },
    excerpt: 'Learn about the benefits of home sample collection services in Hyderabad and how to prepare for tests at home.',
    publishedAt: '2024-01-03T13:10:00Z',
    readTime: 5,
    featured: false,
    authorName: 'Dr. Ramesh Gupta',
    categoryTitle: 'Home Collection',
    categorySlug: { current: 'home-collection' },
    mainImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop',
    mainImageAlt: 'Healthcare professional collecting samples at home'
  }
];

const mockCategories: BlogCategory[] = [
  { _id: '1', title: 'Lab Tests', slug: { current: 'lab-tests' }, postCount: 15 },
  { _id: '2', title: 'Preventive Care', slug: { current: 'preventive-care' }, postCount: 12 },
  { _id: '3', title: 'Diabetes Care', slug: { current: 'diabetes-care' }, postCount: 8 },
  { _id: '4', title: 'Cardiac Health', slug: { current: 'cardiac-health' }, postCount: 10 },
  { _id: '5', title: 'Women\'s Health', slug: { current: 'womens-health' }, postCount: 9 },
  { _id: '6', title: 'Home Collection', slug: { current: 'home-collection' }, postCount: 6 }
];

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogPage() {
  const [posts] = useState(mockPosts);
  const [categories] = useState(mockCategories);
  const [searchTerm, setSearchTerm] = useState('');
  
  const featuredPosts = posts.filter(post => post.featured);
  const regularPosts = posts.filter(post => !post.featured);

  return (
    <div className="min-h-screen bg-gradient-to-b from-primary/5 to-white">
      {/* SEO Meta Tags */}
      <head>
        <title>Health Blog - Medical Insights & Health Tips | Lynk Labs Hyderabad</title>
        <meta name="description" content="Expert health articles, medical insights, and wellness tips from Hyderabad's leading diagnostic laboratory. Stay informed about preventive healthcare, lab tests, and health screening in Hyderabad." />
        <meta name="keywords" content="health blog Hyderabad, medical articles Hyderabad, health tips Hyderabad, preventive healthcare Hyderabad, lab test information, diagnostic insights, wellness blog Hyderabad, medical news Hyderabad, health screening tips, NABL lab insights" />
        <link rel="canonical" href="https://lynklabs.in/blog" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Health Blog - Medical Insights & Health Tips | Lynk Labs Hyderabad" />
        <meta property="og:description" content="Expert health articles and medical insights from Hyderabad's leading diagnostic laboratory." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://lynklabs.in/blog" />
        <meta property="og:image" content="https://lynklabs.in/images/blog-og-image.jpg" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Blog",
              "name": "Lynk Labs Health Blog",
              "description": "Expert health articles and medical insights from Hyderabad's leading diagnostic laboratory",
              "url": "https://lynklabs.in/blog",
              "publisher": {
                "@type": "Organization",
                "name": "Lynk Labs",
                "logo": "https://lynklabs.in/images/logo.png"
              },
              "mainEntityOfPage": {
                "@type": "WebPage",
                "@id": "https://lynklabs.in/blog"
              }
            })
          }}
        />
      </head>

      {/* Hero Section */}
      <section className="relative py-16 lg:py-24">
        <div className="container-padding">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
              <BookOpen className="h-4 w-4" />
              Health Blog
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold mb-6">
              Expert Health Insights from{' '}
              <span className="text-primary">Hyderabad's Leading Lab</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Stay informed with the latest medical insights, health tips, and diagnostic information from our team of expert doctors and lab professionals in Hyderabad.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search health topics..."
                className="pl-10 pr-4 py-3 rounded-full border-2"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16">
        <div className="container-padding">
          <div className="flex items-center gap-2 mb-8">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Featured Articles</h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-8">
            {featuredPosts.map((post) => (
              <article key={post._id} className="medical-card-hover group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={post.mainImage || '/images/blog-placeholder.jpg'}
                    alt={post.mainImageAlt || post.title}
                    width={600}
                    height={300}
                    className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Featured
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-4 w-4" />
                      {post.authorName}
                    </div>
                    <span>{post.readTime} min read</span>
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors">
                    <Link href={`/blog/${post.slug.current}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-2">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-medium">
                      {post.categoryTitle}
                    </span>
                    <Link href={`/blog/${post.slug.current}`}>
                      <Button variant="ghost" size="sm" className="group/btn">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-muted/30">
        <div className="container-padding">
          <div className="flex items-center gap-2 mb-8">
            <Tag className="h-5 w-5 text-primary" />
            <h2 className="text-2xl font-bold">Browse by Category</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                href={`/blog/category/${category.slug.current}`}
                className="medical-card text-center p-4 hover:shadow-lg transition-shadow group"
              >
                <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                  {category.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {category.postCount} articles
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* All Posts */}
      <section className="py-16">
        <div className="container-padding">
          <h2 className="text-2xl font-bold mb-8">Latest Health Articles</h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularPosts.map((post) => (
              <article key={post._id} className="medical-card-hover group">
                <div className="relative overflow-hidden rounded-t-lg">
                  <Image
                    src={post.mainImage || '/images/blog-placeholder.jpg'}
                    alt={post.mainImageAlt || post.title}
                    width={400}
                    height={200}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                <div className="p-6">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDate(post.publishedAt)}
                    </div>
                    <span>{post.readTime} min read</span>
                  </div>
                  
                  <h3 className="text-lg font-bold mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    <Link href={`/blog/${post.slug.current}`}>
                      {post.title}
                    </Link>
                  </h3>
                  
                  <p className="text-muted-foreground mb-4 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-medium">
                      {post.categoryTitle}
                    </span>
                    <Link href={`/blog/${post.slug.current}`}>
                      <Button variant="ghost" size="sm" className="group/btn">
                        Read More
                        <ArrowRight className="h-4 w-4 ml-1 group-hover/btn:translate-x-1 transition-transform" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              Load More Articles
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 bg-primary text-white">
        <div className="container-padding text-center">
          <div className="max-w-2xl mx-auto">
            <Heart className="h-12 w-12 mx-auto mb-6 text-white/80" />
            <h2 className="text-3xl font-bold mb-4">
              Stay Updated with Health Tips
            </h2>
            <p className="text-white/90 mb-8">
              Get the latest health insights, medical news, and wellness tips delivered to your inbox. 
              Expert advice from Hyderabad's leading diagnostic laboratory.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white text-gray-900 border-0"
              />
              <Button variant="secondary" size="lg">
                Subscribe
              </Button>
            </div>
            
            <p className="text-white/70 text-sm mt-4">
              No spam, unsubscribe anytime. We respect your privacy.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
} 