import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@lynklabs.com' },
    update: {},
    create: {
      email: 'admin@lynklabs.com',
      name: 'Admin User',
      phone: '+919876543210',
      role: 'ADMIN',
      isActive: true,
    },
  })

  console.log('✅ Admin user created:', adminUser.email)

  // Create test categories
  const categories = [
    {
      name: 'Blood Tests',
      slug: 'blood-tests',
      description: 'Comprehensive blood analysis and testing',
      icon: '🩸',
    },
    {
      name: 'Urine Tests',
      slug: 'urine-tests',
      description: 'Urinalysis and kidney function tests',
      icon: '🧪',
    },
    {
      name: 'Cardiac Tests',
      slug: 'cardiac-tests',
      description: 'Heart health and cardiovascular screening',
      icon: '❤️',
    },
    {
      name: 'Diabetes Tests',
      slug: 'diabetes-tests',
      description: 'Blood sugar and diabetes monitoring',
      icon: '🍯',
    },
    {
      name: 'Liver Function',
      slug: 'liver-function',
      description: 'Liver health and function assessment',
      icon: '🫀',
    },
    {
      name: 'Thyroid Tests',
      slug: 'thyroid-tests',
      description: 'Thyroid hormone and function tests',
      icon: '🦋',
    },
  ]

  const createdCategories = []
  for (const category of categories) {
    const created = await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
    createdCategories.push(created)
    console.log('✅ Category created:', created.name)
  }

  // Create sample tests
  const tests = [
    // Blood Tests
    {
      name: 'Complete Blood Count (CBC)',
      slug: 'complete-blood-count-cbc',
      description: 'Comprehensive blood analysis including RBC, WBC, platelets, and hemoglobin levels',
      price: 299,
      discountPrice: 249,
      preparationInstructions: 'No special preparation required. Can be done at any time.',
      reportTime: '4-6 hours',
      categorySlug: 'blood-tests',
    },
    {
      name: 'Lipid Profile',
      slug: 'lipid-profile',
      description: 'Cholesterol and triglyceride levels assessment for heart health',
      price: 599,
      discountPrice: 499,
      preparationInstructions: '12-hour fasting required before the test.',
      reportTime: '6-8 hours',
      categorySlug: 'blood-tests',
    },
    {
      name: 'Basic Metabolic Panel',
      slug: 'basic-metabolic-panel',
      description: 'Essential blood chemistry tests including glucose, electrolytes, and kidney function',
      price: 799,
      discountPrice: 649,
      preparationInstructions: '8-hour fasting recommended.',
      reportTime: '4-6 hours',
      categorySlug: 'blood-tests',
    },

    // Urine Tests
    {
      name: 'Complete Urine Analysis',
      slug: 'complete-urine-analysis',
      description: 'Comprehensive urine examination for kidney health and infections',
      price: 199,
      discountPrice: 149,
      preparationInstructions: 'Collect first morning urine sample in provided container.',
      reportTime: '2-4 hours',
      categorySlug: 'urine-tests',
    },
    {
      name: 'Urine Culture & Sensitivity',
      slug: 'urine-culture-sensitivity',
      description: 'Bacterial culture test to identify urinary tract infections',
      price: 399,
      discountPrice: 329,
      preparationInstructions: 'Clean catch midstream urine sample required.',
      reportTime: '24-48 hours',
      categorySlug: 'urine-tests',
    },

    // Cardiac Tests
    {
      name: 'Troponin I',
      slug: 'troponin-i',
      description: 'Heart attack marker and cardiac muscle damage assessment',
      price: 899,
      discountPrice: 749,
      preparationInstructions: 'No special preparation required.',
      reportTime: '2-4 hours',
      categorySlug: 'cardiac-tests',
    },
    {
      name: 'CK-MB',
      slug: 'ck-mb',
      description: 'Creatine kinase test for heart muscle damage detection',
      price: 499,
      discountPrice: 399,
      preparationInstructions: 'No special preparation required.',
      reportTime: '4-6 hours',
      categorySlug: 'cardiac-tests',
    },

    // Diabetes Tests
    {
      name: 'HbA1c (Glycated Hemoglobin)',
      slug: 'hba1c-glycated-hemoglobin',
      description: '3-month average blood sugar level assessment',
      price: 599,
      discountPrice: 499,
      preparationInstructions: 'No fasting required. Can be done at any time.',
      reportTime: '4-6 hours',
      categorySlug: 'diabetes-tests',
    },
    {
      name: 'Fasting Blood Glucose',
      slug: 'fasting-blood-glucose',
      description: 'Blood sugar level measurement after overnight fasting',
      price: 149,
      discountPrice: 99,
      preparationInstructions: '8-12 hour fasting required before the test.',
      reportTime: '2-4 hours',
      categorySlug: 'diabetes-tests',
    },
    {
      name: 'Post Prandial Glucose',
      slug: 'post-prandial-glucose',
      description: 'Blood sugar level 2 hours after meal',
      price: 149,
      discountPrice: 99,
      preparationInstructions: 'Eat normal meal, then wait exactly 2 hours before test.',
      reportTime: '2-4 hours',
      categorySlug: 'diabetes-tests',
    },

    // Liver Function
    {
      name: 'Liver Function Test (LFT)',
      slug: 'liver-function-test-lft',
      description: 'Comprehensive liver health assessment including enzymes and proteins',
      price: 699,
      discountPrice: 599,
      preparationInstructions: '8-hour fasting recommended.',
      reportTime: '6-8 hours',
      categorySlug: 'liver-function',
    },
    {
      name: 'Bilirubin Total & Direct',
      slug: 'bilirubin-total-direct',
      description: 'Liver function and bile duct health assessment',
      price: 299,
      discountPrice: 249,
      preparationInstructions: 'No special preparation required.',
      reportTime: '4-6 hours',
      categorySlug: 'liver-function',
    },

    // Thyroid Tests
    {
      name: 'Thyroid Profile (T3, T4, TSH)',
      slug: 'thyroid-profile-t3-t4-tsh',
      description: 'Complete thyroid function assessment',
      price: 899,
      discountPrice: 749,
      preparationInstructions: 'No special preparation required. Avoid biotin supplements 3 days before test.',
      reportTime: '6-8 hours',
      categorySlug: 'thyroid-tests',
    },
    {
      name: 'TSH (Thyroid Stimulating Hormone)',
      slug: 'tsh-thyroid-stimulating-hormone',
      description: 'Primary thyroid function screening test',
      price: 399,
      discountPrice: 329,
      preparationInstructions: 'No special preparation required.',
      reportTime: '4-6 hours',
      categorySlug: 'thyroid-tests',
    },
  ]

  // Create tests with category relationships
  for (const testData of tests) {
    const category = createdCategories.find(cat => cat.slug === testData.categorySlug)
    if (category) {
      const { categorySlug, ...testCreateData } = testData
      const test = await prisma.test.upsert({
        where: { slug: testData.slug },
        update: {},
        create: {
          ...testCreateData,
          categoryId: category.id,
        },
      })
      console.log('✅ Test created:', test.name)
    }
  }

  // Create sample customer users
  const customers = [
    {
      email: 'john.doe@example.com',
      name: 'John Doe',
      phone: '+919876543211',
      role: 'CUSTOMER',
    },
    {
      email: 'jane.smith@example.com',
      name: 'Jane Smith',
      phone: '+919876543212',
      role: 'CUSTOMER',
    },
    {
      email: 'mike.johnson@example.com',
      name: 'Mike Johnson',
      phone: '+919876543213',
      role: 'CUSTOMER',
    },
  ]

  for (const customer of customers) {
    const created = await prisma.user.upsert({
      where: { email: customer.email },
      update: {},
      create: customer,
    })
    console.log('✅ Customer created:', created.email)
  }

  console.log('🎉 Database seeding completed successfully!')
  console.log(`📊 Created: ${createdCategories.length} categories, ${tests.length} tests, ${customers.length + 1} users`)
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 