"use client";

import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Users, Target, Award, Clock, Activity, CheckCircle, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { label: 'Happy Patients', value: '50k+' },
    { label: 'Diagnostic Tests', value: '100+' },
    { label: 'Lab Partners', value: '25+' },
    { label: 'Cities Covered', value: '10+' },
  ];

  const values = [
    {
      icon: Target,
      title: "Accuracy First",
      description: "We adhere to the highest standards of precision in every test we conduct. Our NABL accredited labs ensure 100% reliable results."
    },
    {
      icon: Clock,
      title: "Time is Vital",
      description: "We understand that in healthcare, time is everything. Our logistics are optimized to deliver reports within the promised turnaround time."
    },
    {
      icon: Users,
      title: "Patient Centric",
      description: "Healthcare is about people. Our phlebotomists are trained to be gentle, professional, and empathetic to patient needs."
    },
    {
      icon: Shield,
      title: "Ethical Practice",
      description: "Integrity is our core value. We maintain complete transparency in our pricing, testing procedures, and reporting."
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative py-20 lg:py-28 overflow-hidden bg-gradient-to-r from-primary via-primary/95 to-teal-600">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="container-padding relative z-10 text-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-white/20 bg-white/10 text-white text-sm font-medium mb-6 backdrop-blur-sm">
            About Lynk Labs
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Redefining Diagnostic <br className="hidden md:block" /> Excellence
          </h1>
          <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto mb-10 leading-relaxed">
            We are on a mission to make high-quality diagnostic services accessible, affordable, and convenient for everyone in Hyderabad.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="py-16 lg:py-24">
        <div className="container-padding">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="relative">
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/about_hero.png"
                  alt="Modern Diagnostic Lab"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-white p-4 rounded-xl shadow-xl hidden md:block">
                <div className="w-full h-full bg-slate-50 rounded-lg flex flex-col items-center justify-center border border-slate-100 text-center p-4">
                  <Award className="w-10 h-10 text-primary mb-2" />
                  <span className="font-bold text-3xl text-slate-900">10+</span>
                  <span className="text-xs text-slate-500 font-medium uppercase tracking-wide mt-1">Years of<br />Excellence</span>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-6">Bridging the Gap Between Care and Convenience</h2>
              <div className="space-y-4 text-lg text-slate-600 leading-relaxed">
                <p>
                  Founded with a vision to simplify healthcare, Lynk Labs has evolved into Hyderabad's most trusted home diagnostic service. We recognized that the traditional process of visiting a lab was often inconvenient, time-consuming, and stressful.
                </p>
                <p>
                  Today, we combine cutting-edge technology with the warmth of human care. Our network of NABL accredited labs is powered by state-of-the-art automation, ensuring that every report we generate is accurate and reliable.
                </p>
                <p>
                  But we are more than just a lab. We are your health partners. From the phlebotomist who visits your home to the pathologist who interprets your results, every member of our team is dedicated to your well-being.
                </p>
              </div>

              <div className="mt-8 pt-8 border-t border-slate-100 grid grid-cols-2 gap-8">
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Our Vision</h4>
                  <p className="text-sm text-slate-600">To be India's most patient-centric diagnostic network.</p>
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 mb-1">Our Promise</h4>
                  <p className="text-sm text-slate-600">Accuracy, Affordability, and Actionable Insights.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-slate-50 border-y border-slate-100">
        <div className="container-padding">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, idx) => (
              <div key={idx} className="text-center">
                <p className="text-4xl lg:text-5xl font-bold text-primary mb-2">{stat.value}</p>
                <p className="text-slate-600 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16 lg:py-24">
        <div className="container-padding">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 text-lg">
              These principles guide every test we conduct and every interaction we have with our patients.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => {
              const Icon = value.icon;
              return (
                <div key={idx} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">{value.title}</h3>
                  <p className="text-slate-600 leading-relaxed text-sm">
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team/CTA Section */}
      <section className="py-16 lg:py-24 bg-slate-900 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(30deg, #ffffff 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        <div className="container-padding relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Partnering in Your Health Journey</h2>
              <p className="text-slate-300 text-lg mb-8 leading-relaxed">
                Whether you need a routine checkup or specialized testing, our team is ready to serve you with the highest standards of care. Experience the difference of accurate diagnostics delivered with convenience.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-slate-900 hover:bg-slate-100" asChild>
                  <Link href="/packages">Explore Health Packages</Link>
                </Button>
                <Button size="lg" variant="outline" className="border-slate-700 hover:bg-slate-800 text-white" asChild>
                  <Link href="/contact">Contact Us</Link>
                </Button>
              </div>
            </div>
            <div className="relative h-[400px] rounded-2xl overflow-hidden shadow-2xl border border-white/10">
              <Image
                src="/images/about_team.png"
                alt="Lynk Labs Team"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
              <div className="absolute bottom-6 left-6">
                <p className="font-bold text-xl">Our Medical Team</p>
                <p className="text-slate-300 text-sm">Certified Professionals</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}