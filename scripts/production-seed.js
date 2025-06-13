require('dotenv').config({ path: '.env.local' });
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function seedProductionData() {
  try {
    console.log('🌱 Seeding production data...');

    // Essential categories for a medical lab
    const categories = [
      {
        name: 'Blood Tests',
        slug: 'blood-tests',
        description: 'Complete blood count, blood sugar, and other blood-related tests',
        icon: '🩸'
      },
      {
        name: 'Diabetes',
        slug: 'diabetes',
        description: 'Blood sugar, HbA1c, and diabetes monitoring tests',
        icon: '🍯'
      },
      {
        name: 'Heart Health',
        slug: 'heart-health',
        description: 'Cholesterol, lipid profile, and cardiovascular health tests',
        icon: '❤️'
      },
      {
        name: 'Liver Function',
        slug: 'liver-function',
        description: 'Liver enzymes and liver health assessment tests',
        icon: '🫀'
      },
      {
        name: 'Kidney Function',
        slug: 'kidney-function',
        description: 'Creatinine, urea, and kidney health tests',
        icon: '🫘'
      },
      {
        name: 'Thyroid',
        slug: 'thyroid',
        description: 'TSH, T3, T4, and thyroid function tests',
        icon: '🦋'
      },
      {
        name: 'Vitamins & Minerals',
        slug: 'vitamins-minerals',
        description: 'Vitamin D, B12, iron, and essential nutrient tests',
        icon: '💊'
      },
      {
        name: 'Women\'s Health',
        slug: 'womens-health',
        description: 'Hormonal tests and women-specific health screenings',
        icon: '👩‍⚕️'
      }
    ];

    console.log('📂 Creating categories...');
    const createdCategories = [];
    for (const category of categories) {
      const created = await prisma.category.create({
        data: category
      });
      createdCategories.push(created);
      console.log(`✅ Created category: ${category.name}`);
    }

    // Essential tests for each category
    const tests = [
      // Blood Tests
      {
        name: 'Complete Blood Count (CBC)',
        slug: 'complete-blood-count-cbc',
        description: 'Comprehensive blood test including RBC, WBC, platelets, and hemoglobin levels',
        price: 299,
        discountPrice: 249,
        preparationInstructions: 'No special preparation required',
        reportTime: '4-6 hours',
        categorySlug: 'blood-tests'
      },
      {
        name: 'Blood Group & Rh Factor',
        slug: 'blood-group-rh-factor',
        description: 'Determines your blood type (A, B, AB, O) and Rh factor (positive/negative)',
        price: 199,
        discountPrice: 149,
        preparationInstructions: 'No special preparation required',
        reportTime: '2-4 hours',
        categorySlug: 'blood-tests'
      },

      // Diabetes
      {
        name: 'Fasting Blood Sugar (FBS)',
        slug: 'fasting-blood-sugar-fbs',
        description: 'Measures blood glucose levels after 8-12 hours of fasting',
        price: 149,
        discountPrice: 99,
        preparationInstructions: 'Fast for 8-12 hours before the test',
        reportTime: '2-4 hours',
        categorySlug: 'diabetes'
      },
      {
        name: 'HbA1c (Glycated Hemoglobin)',
        slug: 'hba1c-glycated-hemoglobin',
        description: 'Shows average blood sugar levels over the past 2-3 months',
        price: 399,
        discountPrice: 349,
        preparationInstructions: 'No fasting required',
        reportTime: '4-6 hours',
        categorySlug: 'diabetes'
      },

      // Heart Health
      {
        name: 'Lipid Profile',
        slug: 'lipid-profile',
        description: 'Complete cholesterol test including HDL, LDL, and triglycerides',
        price: 499,
        discountPrice: 399,
        preparationInstructions: 'Fast for 9-12 hours before the test',
        reportTime: '6-8 hours',
        categorySlug: 'heart-health'
      },

      // Liver Function
      {
        name: 'Liver Function Test (LFT)',
        slug: 'liver-function-test-lft',
        description: 'Comprehensive liver health assessment including enzymes and proteins',
        price: 599,
        discountPrice: 499,
        preparationInstructions: 'Fast for 8-12 hours before the test',
        reportTime: '6-8 hours',
        categorySlug: 'liver-function'
      },

      // Kidney Function
      {
        name: 'Kidney Function Test (KFT)',
        slug: 'kidney-function-test-kft',
        description: 'Assesses kidney health through creatinine, urea, and other markers',
        price: 549,
        discountPrice: 449,
        preparationInstructions: 'No special preparation required',
        reportTime: '6-8 hours',
        categorySlug: 'kidney-function'
      },

      // Thyroid
      {
        name: 'Thyroid Profile (TSH, T3, T4)',
        slug: 'thyroid-profile-tsh-t3-t4',
        description: 'Complete thyroid function assessment',
        price: 699,
        discountPrice: 599,
        preparationInstructions: 'No special preparation required',
        reportTime: '8-12 hours',
        categorySlug: 'thyroid'
      },

      // Vitamins & Minerals
      {
        name: 'Vitamin D (25-OH)',
        slug: 'vitamin-d-25-oh',
        description: 'Measures vitamin D levels in blood',
        price: 899,
        discountPrice: 749,
        preparationInstructions: 'No special preparation required',
        reportTime: '24-48 hours',
        categorySlug: 'vitamins-minerals'
      },
      {
        name: 'Vitamin B12',
        slug: 'vitamin-b12',
        description: 'Measures vitamin B12 levels to detect deficiency',
        price: 799,
        discountPrice: 649,
        preparationInstructions: 'No special preparation required',
        reportTime: '24-48 hours',
        categorySlug: 'vitamins-minerals'
      },

      // Women's Health
      {
        name: 'Women\'s Health Package',
        slug: 'womens-health-package',
        description: 'Comprehensive health screening for women including hormonal tests',
        price: 1999,
        discountPrice: 1599,
        preparationInstructions: 'Consult with our team for specific preparation instructions',
        reportTime: '24-48 hours',
        categorySlug: 'womens-health'
      }
    ];

    console.log('🧪 Creating tests...');
    for (const test of tests) {
      const category = createdCategories.find(c => c.slug === test.categorySlug);
      if (category) {
        await prisma.test.create({
          data: {
            name: test.name,
            slug: test.slug,
            description: test.description,
            price: test.price,
            discountPrice: test.discountPrice,
            preparationInstructions: test.preparationInstructions,
            reportTime: test.reportTime,
            categoryId: category.id,
            isActive: true
          }
        });
        console.log(`✅ Created test: ${test.name}`);
      }
    }

    // Verify the seeded data
    const categoryCount = await prisma.category.count();
    const testCount = await prisma.test.count();
    const userCount = await prisma.user.count();

    console.log('\n📊 Production data seeded successfully:');
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Tests: ${testCount}`);
    console.log(`- Users: ${userCount} (admin only)`);
    console.log('\n✅ Ready for production use!');

  } catch (error) {
    console.error('❌ Error seeding production data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

seedProductionData(); 