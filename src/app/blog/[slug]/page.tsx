"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, User, Clock, ArrowLeft, Share2, Facebook, Twitter, Linkedin, Copy, Tag, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  content: string;
  excerpt: string;
  publishedAt: string;
  readTime: number;
  featured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  authorName: string;
  authorBio?: string;
  authorImage?: string;
  categoryTitle: string;
  categorySlug: { current: string };
  mainImage?: string;
  mainImageAlt?: string;
  tags?: string[];
}

// Mock blog post data
const mockPost: BlogPost = {
  _id: '1',
  title: 'Complete Guide to Blood Tests in Hyderabad: What You Need to Know',
  slug: { current: 'complete-guide-blood-tests-hyderabad' },
  content: `
    <h2>Understanding Blood Tests: Your Health Window</h2>
    <p>Blood tests are one of the most important diagnostic tools available to healthcare professionals in Hyderabad. They provide valuable insights into your overall health, helping detect diseases early and monitor ongoing conditions.</p>
    
    <h3>Why Blood Tests Matter in Hyderabad's Climate</h3>
    <p>Hyderabad's unique climate and lifestyle factors make regular blood testing particularly important. The city's hot, humid summers and pollution levels can affect various health parameters that are easily detected through blood analysis.</p>
    
    <h3>Common Blood Tests Available in Hyderabad</h3>
    <ul>
      <li><strong>Complete Blood Count (CBC):</strong> Evaluates overall health and detects disorders like anemia, infection, and leukemia</li>
      <li><strong>Lipid Profile:</strong> Measures cholesterol levels - crucial given Hyderabad's lifestyle patterns</li>
      <li><strong>Blood Sugar Tests:</strong> Essential for diabetes screening, particularly important in South India</li>
      <li><strong>Liver Function Tests:</strong> Assess liver health and detect liver diseases</li>
      <li><strong>Kidney Function Tests:</strong> Monitor kidney health and detect early signs of kidney disease</li>
    </ul>
    
    <h3>Preparing for Your Blood Test</h3>
    <p>Proper preparation ensures accurate results. Here's what you need to know:</p>
    <ul>
      <li>Fast for 8-12 hours if required (your doctor will inform you)</li>
      <li>Stay hydrated by drinking water</li>
      <li>Avoid alcohol 24 hours before the test</li>
      <li>Inform your doctor about all medications you're taking</li>
      <li>Wear comfortable clothing with easy access to your arms</li>
    </ul>
    
    <h3>Understanding Your Results</h3>
    <p>Blood test results can seem confusing, but understanding the basics helps you take control of your health. Always discuss your results with a qualified healthcare professional who can interpret them in the context of your overall health.</p>
    
    <h3>NABL Accredited Labs in Hyderabad</h3>
    <p>When choosing a lab for your blood tests in Hyderabad, always opt for NABL (National Accreditation Board for Testing and Calibration Laboratories) accredited facilities. These labs maintain the highest standards of quality and accuracy.</p>
    
    <h3>Home Sample Collection Services</h3>
    <p>Many labs in Hyderabad now offer convenient home sample collection services. This is particularly beneficial for elderly patients, busy professionals, or those with mobility issues. The samples are collected by trained phlebotomists using sterile equipment.</p>
    
    <h3>When to Get Blood Tests</h3>
    <p>Regular blood testing is recommended for:</p>
    <ul>
      <li>Annual health checkups</li>
      <li>Monitoring chronic conditions like diabetes or hypertension</li>
      <li>Before starting new medications</li>
      <li>When experiencing unexplained symptoms</li>
      <li>As part of preventive healthcare</li>
    </ul>
    
    <p>Remember, early detection through regular blood testing can prevent serious health complications and ensure you maintain optimal health in Hyderabad's unique environment.</p>
  `,
  excerpt: 'Everything you need to know about blood tests available in Hyderabad, from preparation to understanding results. Expert insights from NABL accredited labs.',
  publishedAt: '2024-01-15T10:00:00Z',
  readTime: 8,
  featured: true,
  seoTitle: 'Complete Blood Test Guide Hyderabad | NABL Lab | Lynk Labs',
  seoDescription: 'Comprehensive guide to blood tests in Hyderabad. Learn about preparation, types, results interpretation from NABL accredited lab experts. Home collection available.',
  seoKeywords: ['blood tests Hyderabad', 'NABL lab Hyderabad', 'blood test preparation', 'home sample collection Hyderabad', 'diagnostic lab Hyderabad'],
  authorName: 'Dr. Priya Sharma',
  authorBio: 'Dr. Priya Sharma is a senior pathologist with over 15 years of experience in diagnostic medicine. She specializes in clinical pathology and laboratory medicine.',
  authorImage: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&crop=face',
  categoryTitle: 'Lab Tests',
  categorySlug: { current: 'lab-tests' },
  mainImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=1200&h=600&fit=crop',
  mainImageAlt: 'Blood test vials in laboratory setting with medical equipment',
  tags: ['Blood Tests', 'Diagnostic Lab', 'Health Screening', 'NABL Accredited', 'Home Collection']
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

export default function BlogPostPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="container-padding py-16">
        <h1 className="text-4xl font-bold mb-8">Blog Post Page</h1>
        <p>Individual blog post content will be displayed here.</p>
      </div>
    </div>
  );
} 