import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'blood-tests' },
      update: {},
      create: {
        name: 'Blood Tests',
        slug: 'blood-tests',
        description: 'Comprehensive blood analysis and screening tests',
        icon: '🩸'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'diabetes' },
      update: {},
      create: {
        name: 'Diabetes',
        slug: 'diabetes',
        description: 'Blood sugar and diabetes monitoring tests',
        icon: '🍯'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'heart-health' },
      update: {},
      create: {
        name: 'Heart Health',
        slug: 'heart-health',
        description: 'Cardiovascular and lipid profile tests',
        icon: '❤️'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'thyroid' },
      update: {},
      create: {
        name: 'Thyroid',
        slug: 'thyroid',
        description: 'Thyroid function and hormone tests',
        icon: '🦋'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'liver-health' },
      update: {},
      create: {
        name: 'Liver Health',
        slug: 'liver-health',
        description: 'Liver function and health assessment tests',
        icon: '🫀'
      }
    }),
    prisma.category.upsert({
      where: { slug: 'kidney-health' },
      update: {},
      create: {
        name: 'Kidney Health',
        slug: 'kidney-health',
        description: 'Kidney function and urinalysis tests',
        icon: '🫘'
      }
    })
  ])

  console.log('✅ Categories created')

  // Create tests
  const tests = [
    {
      name: 'Complete Blood Count (CBC)',
      slug: 'complete-blood-count-cbc',
      description: 'Comprehensive blood test that evaluates overall health and detects various disorders',
      price: 299,
      discountPrice: 199,
      preparationInstructions: 'No special preparation required',
      reportTime: '24 hours',
      categorySlug: 'blood-tests'
    },
    {
      name: 'Lipid Profile',
      slug: 'lipid-profile',
      description: 'Measures cholesterol levels and assesses cardiovascular risk',
      price: 799,
      discountPrice: 599,
      preparationInstructions: '12-hour fasting required',
      reportTime: '24 hours',
      categorySlug: 'heart-health'
    },
    {
      name: 'Thyroid Function Test (TSH, T3, T4)',
      slug: 'thyroid-function-test',
      description: 'Complete thyroid hormone panel to assess thyroid function',
      price: 1199,
      discountPrice: 899,
      preparationInstructions: 'No special preparation required',
      reportTime: '48 hours',
      categorySlug: 'thyroid'
    },
    {
      name: 'HbA1c (Diabetes)',
      slug: 'hba1c-diabetes',
      description: 'Measures average blood sugar levels over the past 2-3 months',
      price: 599,
      discountPrice: 449,
      preparationInstructions: 'No fasting required',
      reportTime: '24 hours',
      categorySlug: 'diabetes'
    },
    {
      name: 'Liver Function Test (LFT)',
      slug: 'liver-function-test',
      description: 'Comprehensive liver health assessment panel',
      price: 899,
      discountPrice: 699,
      preparationInstructions: '8-hour fasting recommended',
      reportTime: '24 hours',
      categorySlug: 'liver-health'
    },
    {
      name: 'Kidney Function Test (KFT)',
      slug: 'kidney-function-test',
      description: 'Complete kidney health and function assessment',
      price: 849,
      discountPrice: 649,
      preparationInstructions: 'No special preparation required',
      reportTime: '24 hours',
      categorySlug: 'kidney-health'
    },
    {
      name: 'Fasting Blood Sugar (FBS)',
      slug: 'fasting-blood-sugar',
      description: 'Measures blood glucose levels after fasting',
      price: 199,
      discountPrice: 149,
      preparationInstructions: '8-12 hour fasting required',
      reportTime: '24 hours',
      categorySlug: 'diabetes'
    },
    {
      name: 'Vitamin D Test',
      slug: 'vitamin-d-test',
      description: 'Measures vitamin D levels in blood',
      price: 999,
      discountPrice: 799,
      preparationInstructions: 'No special preparation required',
      reportTime: '48 hours',
      categorySlug: 'blood-tests'
    }
  ]

  for (const testData of tests) {
    const category = categories.find(cat => cat.slug === testData.categorySlug)
    if (category) {
      await prisma.test.upsert({
        where: { slug: testData.slug },
        update: {},
        create: {
          name: testData.name,
          slug: testData.slug,
          description: testData.description,
          price: testData.price,
          discountPrice: testData.discountPrice,
          preparationInstructions: testData.preparationInstructions,
          reportTime: testData.reportTime,
          categoryId: category.id
        }
      })
    }
  }

  console.log('✅ Tests created')

  // Create sample coupons
  await prisma.coupon.upsert({
    where: { code: 'WELCOME25' },
    update: {},
    create: {
      code: 'WELCOME25',
      description: 'Welcome discount for new users',
      discountType: 'PERCENTAGE',
      discountValue: 25,
      minOrderAmount: 500,
      maxDiscount: 500,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      usageLimit: 1000,
      usedCount: 0
    }
  })

  await prisma.coupon.upsert({
    where: { code: 'HEALTH50' },
    update: {},
    create: {
      code: 'HEALTH50',
      description: 'Flat ₹50 off on orders above ₹1000',
      discountType: 'FIXED',
      discountValue: 50,
      minOrderAmount: 1000,
      validFrom: new Date(),
      validTo: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000), // 60 days from now
      usageLimit: 500,
      usedCount: 0
    }
  })

  console.log('✅ Coupons created')
  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 