import { prisma } from '@/lib/db';
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    // Get all active tests
    const tests = await prisma.test.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    });

    // Get all active categories
    const categories = await prisma.category.findMany({
      where: { isActive: true },
      select: { slug: true, updatedAt: true }
    });

    // Base URLs with enhanced SEO priorities
    const baseUrls = [
      {
        url: 'https://lynklabs.in',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
      {
        url: 'https://lynklabs.in/health-checkup-packages-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.95,
      },
      {
        url: 'https://lynklabs.in/blog',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: 'https://lynklabs.in/tests',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 0.9,
      },
      {
        url: 'https://lynklabs.in/packages',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.85,
      },
      {
        url: 'https://lynklabs.in/about',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: 'https://lynklabs.in/contact',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      },
      {
        url: 'https://lynklabs.in/help',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.6,
      },
      {
        url: 'https://lynklabs.in/privacy',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      },
      {
        url: 'https://lynklabs.in/terms',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.4,
      },
      {
        url: 'https://lynklabs.in/track-order',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.6,
      }
    ];

    // Test URLs
    const testUrls = tests.map((test) => ({
      url: `https://lynklabs.in/tests/${test.slug}`,
      lastModified: test.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));

    // Blog URLs for SEO
    const blogUrls = [
      {
        url: 'https://lynklabs.in/blog/complete-guide-blood-tests-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: 'https://lynklabs.in/blog/preventive-health-checkups-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.8,
      },
      {
        url: 'https://lynklabs.in/blog/understanding-diabetes-early-detection-lab-tests',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      },
      {
        url: 'https://lynklabs.in/blog/heart-health-essential-cardiac-tests-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      },
      {
        url: 'https://lynklabs.in/blog/womens-health-essential-tests-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      },
      {
        url: 'https://lynklabs.in/blog/home-sample-collection-convenient-lab-testing-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.75,
      }
    ];

    // Location-specific URLs for better local SEO
    const locationUrls = [
      {
        url: 'https://lynklabs.in/medical-tests-banjara-hills-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      },
      {
        url: 'https://lynklabs.in/health-checkup-jubilee-hills-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      },
      {
        url: 'https://lynklabs.in/diagnostic-services-hitec-city-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      },
      {
        url: 'https://lynklabs.in/lab-tests-gachibowli-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      },
      {
        url: 'https://lynklabs.in/blood-tests-secunderabad-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.75,
      },
      {
        url: 'https://lynklabs.in/home-collection-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
      },
      {
        url: 'https://lynklabs.in/nabl-accredited-labs-hyderabad',
        lastModified: new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }
    ];

    return [...baseUrls, ...testUrls, ...blogUrls, ...locationUrls];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    // Return basic sitemap if database fails
    return [
      {
        url: 'https://lynklabs.in',
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
      },
    ];
  }
} 