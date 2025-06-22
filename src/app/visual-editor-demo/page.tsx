'use client';

import { BuilderComponent } from '@/components/builder/BuilderComponent';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function VisualEditorDemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header explaining the visual editor */}
      <section className="bg-gradient-to-r from-primary to-primary/90 text-primary-foreground py-12">
        <div className="container-padding text-center">
          <h1 className="text-3xl lg:text-4xl font-bold mb-4">
            Visual Page Builder Demo
          </h1>
          <p className="text-xl mb-6 opacity-90 max-w-2xl mx-auto">
            This page demonstrates how you can use Builder.io to create landing pages 
            with a drag-and-drop interface similar to WordPress Elementor.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild variant="secondary" size="lg">
              <a href="https://builder.io" target="_blank" rel="noopener noreferrer">
                Try Builder.io
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/health-checkup-packages-hyderabad">
                View Coded Version
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Builder.io Content Area */}
      <section className="py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Builder.io Visual Editor Content
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              The content below would be editable through Builder.io's visual interface. 
              You can drag and drop components, edit text, change images, and modify layouts 
              without touching code.
            </p>
          </div>

          {/* This component will load content from Builder.io */}
          <BuilderComponent model="page" />
        </div>
      </section>

      {/* How it works section */}
      <section className="bg-muted/30 py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              How Visual Page Building Works
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Design Visually</h3>
              <p className="text-muted-foreground">
                Use drag-and-drop interface to create layouts, add components, 
                and customize designs without writing code.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real-time Preview</h3>
              <p className="text-muted-foreground">
                See changes instantly as you edit. What you see in the editor 
                is exactly what your users will see.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4 mx-auto">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-semibold mb-2">Deploy Instantly</h3>
              <p className="text-muted-foreground">
                Changes are published immediately to your live site. 
                No build process or deployment delays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison section */}
      <section className="py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              WordPress Elementor vs Next.js Visual Builders
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="medical-card p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">WordPress + Elementor</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Easy drag-and-drop interface</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Lots of pre-made templates</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>No coding required</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Slower performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Limited customization</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-red-500">✗</span>
                  <span>Plugin dependencies</span>
                </div>
              </div>
            </div>

            <div className="medical-card p-6">
              <h3 className="text-xl font-semibold mb-4 text-center">Next.js + Builder.io</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Lightning-fast performance</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Unlimited customization</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>SEO optimized</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Custom components</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span>A/B testing built-in</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-500">~</span>
                  <span>Requires setup</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Setup instructions */}
      <section className="bg-muted/30 py-16">
        <div className="container-padding">
          <div className="text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">
              Quick Setup Guide
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Follow these steps to add visual editing to your Next.js project
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Sign up for Builder.io</h3>
                  <p className="text-muted-foreground">
                    Create a free account at builder.io and get your API key
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Install the packages</h3>
                  <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                    npm install @builder.io/react @builder.io/sdk
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Add your API key</h3>
                  <p className="text-muted-foreground mb-2">
                    Add your Builder.io API key to your environment variables:
                  </p>
                  <div className="bg-gray-100 rounded-lg p-3 font-mono text-sm">
                    NEXT_PUBLIC_BUILDER_API_KEY=your-api-key-here
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Use the BuilderComponent</h3>
                  <p className="text-muted-foreground">
                    Add the BuilderComponent to any page where you want visual editing
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-bold flex-shrink-0">
                  5
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Start designing!</h3>
                  <p className="text-muted-foreground">
                    Go to builder.io, create a new page, and start designing with the visual editor
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
        <div className="container-padding text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Try Visual Page Building?
          </h2>
          <p className="text-xl mb-8 opacity-90 max-w-2xl mx-auto">
            Transform your Next.js development workflow with visual editing capabilities
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" variant="secondary">
              <a href="https://builder.io" target="_blank" rel="noopener noreferrer">
                Start Free Trial
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
              <Link href="/health-checkup-packages-hyderabad">
                View Example Page
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
} 