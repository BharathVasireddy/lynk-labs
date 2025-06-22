'use client';

import { builder, Builder } from '@builder.io/react';
import { useState, useEffect } from 'react';

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
          ],
          component: ({ title, price, originalPrice, tests, description, features, image }) => (
            <div className="medical-card-hover p-6 rounded-lg border">
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
                <ul className="space-y-1">
                  {features.map((item: any, index: number) => (
                    <li key={index} className="text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-primary rounded-full"></span>
                      {item.feature}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ),
        },
        {
          name: 'TestimonialCard',
          inputs: [
            { name: 'name', type: 'string' },
            { name: 'location', type: 'string' },
            { name: 'rating', type: 'number', defaultValue: 5 },
            { name: 'comment', type: 'longText' },
            { name: 'image', type: 'file' },
          ],
          component: ({ name, location, rating, comment, image }) => (
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
                  <span key={i}>⭐</span>
                ))}
              </div>
              <p className="text-muted-foreground italic">"{comment}"</p>
            </div>
          ),
        },
      ]}
    />
  );
} 