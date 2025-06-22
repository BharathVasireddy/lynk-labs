import { createClient } from '@sanity/client';
import imageUrlBuilder from '@sanity/image-url';

// Sanity configuration
export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'kz12v92f',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  useCdn: true, // Enable CDN for faster response
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN, // Only needed for write operations
});

// Image URL builder
const builder = imageUrlBuilder(client);

export function urlForImage(source: any) {
  return builder.image(source);
}

// Blog post queries
export const blogQueries = {
  // Get all published blog posts with pagination
  getAllPosts: `*[_type == "blogPost" && published == true] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readTime,
    featured,
    seoTitle,
    seoDescription,
    seoKeywords,
    "authorName": author->name,
    "authorImage": author->image,
    "categoryTitle": category->title,
    "categorySlug": category->slug,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt
  }`,

  // Get posts with pagination
  getPostsWithPagination: (start: number, end: number) => `*[_type == "blogPost" && published == true] | order(publishedAt desc) [${start}...${end}] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readTime,
    featured,
    seoTitle,
    seoDescription,
    "authorName": author->name,
    "categoryTitle": category->title,
    "categorySlug": category->slug,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt
  }`,

  // Get single post by slug
  getPostBySlug: (slug: string) => `*[_type == "blogPost" && slug.current == "${slug}" && published == true][0] {
    _id,
    title,
    slug,
    content,
    excerpt,
    publishedAt,
    readTime,
    featured,
    seoTitle,
    seoDescription,
    seoKeywords,
    "authorName": author->name,
    "authorBio": author->bio,
    "authorImage": author->image,
    "categoryTitle": category->title,
    "categorySlug": category->slug,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt,
    tags[]->title
  }`,

  // Get featured posts
  getFeaturedPosts: `*[_type == "blogPost" && published == true && featured == true] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "authorName": author->name,
    "categoryTitle": category->title,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt
  }`,

  // Get posts by category
  getPostsByCategory: (categorySlug: string) => `*[_type == "blogPost" && published == true && category->slug.current == "${categorySlug}"] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    readTime,
    "authorName": author->name,
    "categoryTitle": category->title,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt
  }`,

  // Get related posts
  getRelatedPosts: (currentPostId: string, categorySlug: string) => `*[_type == "blogPost" && published == true && _id != "${currentPostId}" && category->slug.current == "${categorySlug}"] | order(publishedAt desc) [0...3] {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "authorName": author->name,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt
  }`,

  // Get all categories
  getAllCategories: `*[_type == "blogCategory"] | order(title asc) {
    _id,
    title,
    slug,
    description,
    "postCount": count(*[_type == "blogPost" && published == true && references(^._id)])
  }`,

  // Search posts
  searchPosts: (searchTerm: string) => `*[_type == "blogPost" && published == true && (title match "*${searchTerm}*" || excerpt match "*${searchTerm}*" || pt::text(content) match "*${searchTerm}*")] | order(publishedAt desc) {
    _id,
    title,
    slug,
    excerpt,
    publishedAt,
    "authorName": author->name,
    "categoryTitle": category->title,
    "mainImage": mainImage.asset->url,
    "mainImageAlt": mainImage.alt
  }`
};

// Type definitions
export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  content?: any;
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

export interface BlogCategory {
  _id: string;
  title: string;
  slug: { current: string };
  description?: string;
  postCount: number;
}

// Helper functions
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  return await client.fetch(blogQueries.getAllPosts);
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  return await client.fetch(blogQueries.getPostBySlug(slug));
}

export async function getFeaturedBlogPosts(): Promise<BlogPost[]> {
  return await client.fetch(blogQueries.getFeaturedPosts);
}

export async function getBlogCategories(): Promise<BlogCategory[]> {
  return await client.fetch(blogQueries.getAllCategories);
}

export async function getPostsByCategory(categorySlug: string): Promise<BlogPost[]> {
  return await client.fetch(blogQueries.getPostsByCategory(categorySlug));
}

export async function getRelatedPosts(currentPostId: string, categorySlug: string): Promise<BlogPost[]> {
  return await client.fetch(blogQueries.getRelatedPosts(currentPostId, categorySlug));
}

export async function searchBlogPosts(searchTerm: string): Promise<BlogPost[]> {
  return await client.fetch(blogQueries.searchPosts(searchTerm));
} 