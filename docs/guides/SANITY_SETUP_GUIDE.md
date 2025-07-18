# 🚀 Sanity Studio Setup Guide for Lynk Labs Blog

## 📝 **Where You'll Write Your Blog Content**

You'll write and manage all your blog content through **Sanity Studio** - a beautiful, user-friendly content management interface that looks like this:

![Sanity Studio Interface](https://cdn.sanity.io/images/3do82whm/next/4c0e3fdb2dd8d9bb1dfe6ee4c7c6c8a1c3f8d7e1-1200x800.png)

## 🎯 **Step-by-Step Setup (5 minutes)**

### **Step 1: Create Sanity Account**
1. Go to [sanity.io](https://sanity.io)
2. Click "Get Started for Free"
3. Sign up with Google/GitHub or email
4. Verify your email

### **Step 2: Create New Project**
1. Click "Create New Project"
2. Name it: **"Lynk Labs Health Blog"**
3. Choose dataset: **"production"**
4. Select region: **"Asia Pacific (Singapore)"** (closest to Hyderabad)
5. **Copy your Project ID** (you'll need this)

### **Step 3: Add Environment Variables**
Add these to your `.env.local` file:

```env
# Sanity (Blog System)
NEXT_PUBLIC_SANITY_PROJECT_ID="your-project-id-here"
NEXT_PUBLIC_SANITY_DATASET="production"
SANITY_API_TOKEN="your-api-token-here"
```

### **Step 4: Generate API Token**
1. In Sanity dashboard, go to **Settings** → **API**
2. Click **"Add API Token"**
3. Name: "Lynk Labs Website"
4. Permissions: **"Editor"**
5. **Copy the token** and add to `.env.local`

### **Step 5: Set Up Content Schemas**
In your Sanity Studio, create these document types:

#### **Blog Post Schema:**
```javascript
{
  name: 'blogPost',
  title: 'Blog Post',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: Rule => Rule.required().max(100)
    },
    {
      name: 'slug',
      title: 'URL Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: Rule => Rule.required()
    },
    {
      name: 'excerpt',
      title: 'Excerpt (Short Description)',
      type: 'text',
      rows: 3,
      validation: Rule => Rule.required().max(160),
      description: 'Brief summary for search engines and social media'
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        {
          type: 'block'
        },
        {
          type: 'image',
          options: {
            hotspot: true
          }
        }
      ]
    },
    {
      name: 'mainImage',
      title: 'Featured Image',
      type: 'image',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alt Text (for accessibility)',
        }
      ]
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      validation: Rule => Rule.required()
    },
    {
      name: 'readTime',
      title: 'Read Time (minutes)',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(60)
    },
    {
      name: 'featured',
      title: 'Featured Post',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'published',
      title: 'Published',
      type: 'boolean',
      initialValue: false
    },
    {
      name: 'seoTitle',
      title: 'SEO Title (for search engines)',
      type: 'string',
      validation: Rule => Rule.max(60)
    },
    {
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      rows: 2,
      validation: Rule => Rule.max(160)
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: {type: 'author'}
    },
    {
      name: 'category',
      title: 'Category',
      type: 'reference',
      to: {type: 'blogCategory'},
      validation: Rule => Rule.required()
    }
  ]
}
```

## 🎨 **What the Writing Experience Looks Like**

### **1. Rich Text Editor**
- **WYSIWYG Editor**: What you see is what you get
- **Markdown Support**: For technical users
- **Image Upload**: Drag & drop images directly
- **Formatting Tools**: Bold, italic, lists, headers
- **Live Preview**: See how it looks on your website

### **2. SEO Helper**
- **Title Length Indicator**: Shows if your title is SEO-friendly
- **Meta Description Counter**: Ensures optimal length
- **Slug Generator**: Auto-creates SEO-friendly URLs
- **Preview Cards**: See how it looks on Google/social media

### **3. Content Organization**
- **Categories**: Lab Tests, Preventive Care, Women's Health, etc.
- **Tags**: Hyderabad, Blood Tests, Diabetes, etc.
- **Draft/Published Status**: Control when content goes live
- **Featured Posts**: Highlight important articles

## 👥 **Team Collaboration Features**

### **Multiple Authors**
- Add doctors, lab technicians, content writers
- Each person gets their own login
- Track who wrote what
- Review and approval workflow

### **Content Calendar**
- Schedule posts for future publishing
- See what's coming up
- Plan content around health awareness days
- Batch content creation

## 📱 **Mobile-Friendly Writing**

- **Mobile App Available**: Write on the go
- **Responsive Interface**: Works on tablets
- **Auto-Save**: Never lose your work
- **Offline Drafts**: Write without internet

## 🎯 **Content Templates for Lynk Labs**

I'll create templates for common blog post types:

### **1. Test Guide Template**
```
Title: "Complete Guide to [Test Name] in Hyderabad"
Category: Lab Tests
SEO Focus: "[test name] Hyderabad"

Structure:
- What is [Test Name]?
- Why is it important in Hyderabad's climate?
- How to prepare
- Understanding results
- Where to get tested (Lynk Labs)
```

### **2. Health Tips Template**
```
Title: "[Number] Essential Health Tips for Hyderabad Residents"
Category: Preventive Care
SEO Focus: "health tips Hyderabad"

Structure:
- Introduction to health challenges in Hyderabad
- Tip 1 with explanation
- Tip 2 with explanation
- How regular testing helps
- Call-to-action for health checkup
```

### **3. Condition Awareness Template**
```
Title: "Understanding [Condition]: Early Detection in Hyderabad"
Category: Health Awareness
SEO Focus: "[condition] testing Hyderabad"

Structure:
- What is [condition]?
- Risk factors in Hyderabad population
- Symptoms to watch for
- Diagnostic tests available
- Prevention strategies
```

## 🚀 **Getting Started Checklist**

- [ ] Create Sanity account
- [ ] Set up project and get Project ID
- [ ] Add environment variables
- [ ] Create content schemas
- [ ] Write your first blog post
- [ ] Test the preview on your website
- [ ] Publish and share!

## 💡 **Pro Tips for Success**

### **SEO Best Practices**
1. **Always include "Hyderabad"** in titles and content
2. **Use local keywords**: "Banjara Hills", "HITEC City", etc.
3. **Write 800+ words** for better search rankings
4. **Include internal links** to your test pages
5. **Add alt text** to all images

### **Content Ideas**
1. **Seasonal Health**: "Monsoon Health Checkups in Hyderabad"
2. **Age-Specific**: "Health Tests Every 40+ Hyderabadi Should Take"
3. **Lifestyle**: "IT Professional Health Checkups in HITEC City"
4. **Women's Health**: "Essential Tests for Women in Hyderabad"
5. **Preventive Care**: "Annual Health Screening Packages"

## 📞 **Need Help?**

- **Sanity Documentation**: [sanity.io/docs](https://sanity.io/docs)
- **Video Tutorials**: Available in Sanity Studio
- **Community Support**: [sanity.io/help](https://sanity.io/help)

**Your blog system is ready to boost Lynk Labs' SEO and establish you as Hyderabad's leading health authority!** 🎯 