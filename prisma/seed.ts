import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clear existing data (in correct order to avoid foreign key constraints)
  console.log('🧹 Cleaning existing data...')
  await prisma.orderItem.deleteMany()
  await prisma.homeVisit.deleteMany()
  await prisma.report.deleteMany()
  await prisma.order.deleteMany()
  await prisma.address.deleteMany()
  await prisma.test.deleteMany()
  await prisma.category.deleteMany()
  await prisma.user.deleteMany()

  // Create Categories
  console.log('📂 Creating categories...')
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Blood Tests',
        description: 'Complete blood analysis and related tests',
        slug: 'blood-tests',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Diabetes Tests',
        description: 'Blood sugar and diabetes monitoring tests',
        slug: 'diabetes-tests',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Heart Health',
        description: 'Cardiovascular health screening tests',
        slug: 'heart-health',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Liver Function',
        description: 'Liver health and function tests',
        slug: 'liver-function',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Kidney Function',
        description: 'Kidney health and function tests',
        slug: 'kidney-function',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Thyroid Tests',
        description: 'Thyroid function and hormone tests',
        slug: 'thyroid-tests',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vitamin Tests',
        description: 'Vitamin deficiency and nutritional tests',
        slug: 'vitamin-tests',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Cancer Screening',
        description: 'Early cancer detection and tumor marker tests',
        slug: 'cancer-screening',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Infectious Diseases',
        description: 'Tests for viral, bacterial, and other infections',
        slug: 'infectious-diseases',
        isActive: true,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Women\'s Health',
        description: 'Specialized tests for women\'s health concerns',
        slug: 'womens-health',
        isActive: true,
      },
    }),
  ])

  // Create Tests
  console.log('🧪 Creating tests...')
  const tests = await Promise.all([
    // Blood Tests
    prisma.test.create({
      data: {
        name: 'Complete Blood Count (CBC)',
        description: 'Comprehensive blood analysis including RBC, WBC, platelets, and hemoglobin levels',
        slug: 'complete-blood-count-cbc',
        price: 299,
        discountPrice: 249,
        preparationInstructions: 'No special preparation required. Can be done at any time.',
        reportTime: '24 hours',
        categoryId: categories[0].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'ESR (Erythrocyte Sedimentation Rate)',
        description: 'Measures inflammation in the body',
        slug: 'esr-erythrocyte-sedimentation-rate',
        price: 199,
        discountPrice: 149,
        preparationInstructions: 'No special preparation required.',
        reportTime: '24 hours',
        categoryId: categories[0].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Blood Group & Rh Factor',
        description: 'Determines ABO blood group and Rh factor',
        slug: 'blood-group-rh-factor',
        price: 149,
        discountPrice: 99,
        preparationInstructions: 'No special preparation required.',
        reportTime: '6 hours',
        categoryId: categories[0].id,
        isActive: true,
      },
    }),

    // Heart Health
    prisma.test.create({
      data: {
        name: 'Lipid Profile',
        description: 'Cholesterol and triglyceride levels for heart health assessment',
        slug: 'lipid-profile',
        price: 599,
        discountPrice: 499,
        preparationInstructions: '12-hour fasting required before the test',
        reportTime: '24 hours',
        categoryId: categories[2].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Troponin I',
        description: 'Cardiac marker for heart attack diagnosis',
        slug: 'troponin-i',
        price: 899,
        discountPrice: 799,
        preparationInstructions: 'No special preparation required.',
        reportTime: '6 hours',
        categoryId: categories[2].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'ECG (Electrocardiogram)',
        description: 'Records electrical activity of the heart',
        slug: 'ecg-electrocardiogram',
        price: 399,
        discountPrice: 299,
        preparationInstructions: 'Wear comfortable clothing. Avoid caffeine 2 hours before test.',
        reportTime: '2 hours',
        categoryId: categories[2].id,
        isActive: true,
      },
    }),

    // Diabetes Tests
    prisma.test.create({
      data: {
        name: 'HbA1c (Diabetes)',
        description: 'Average blood sugar levels over the past 2-3 months',
        slug: 'hba1c-diabetes',
        price: 399,
        discountPrice: 349,
        preparationInstructions: 'No fasting required. Can be done at any time.',
        reportTime: '24 hours',
        categoryId: categories[1].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Fasting Blood Sugar (FBS)',
        description: 'Blood glucose level after 8-12 hours of fasting',
        slug: 'fasting-blood-sugar-fbs',
        price: 149,
        discountPrice: 99,
        preparationInstructions: '8-12 hours fasting required.',
        reportTime: '6 hours',
        categoryId: categories[1].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Post Prandial Blood Sugar (PPBS)',
        description: 'Blood glucose level 2 hours after meal',
        slug: 'post-prandial-blood-sugar-ppbs',
        price: 149,
        discountPrice: 99,
        preparationInstructions: 'Eat normal meal, then test exactly 2 hours later.',
        reportTime: '6 hours',
        categoryId: categories[1].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Glucose Tolerance Test (GTT)',
        description: 'Comprehensive diabetes screening test',
        slug: 'glucose-tolerance-test-gtt',
        price: 599,
        discountPrice: 499,
        preparationInstructions: '10-12 hours fasting. Test takes 3 hours to complete.',
        reportTime: '24 hours',
        categoryId: categories[1].id,
        isActive: true,
      },
    }),

    // Liver Function
    prisma.test.create({
      data: {
        name: 'Liver Function Test (LFT)',
        description: 'Comprehensive liver health assessment including enzymes and proteins',
        slug: 'liver-function-test-lft',
        price: 699,
        discountPrice: 599,
        preparationInstructions: '8-hour fasting recommended for accurate results',
        reportTime: '48 hours',
        categoryId: categories[3].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Hepatitis B Surface Antigen',
        description: 'Screening test for Hepatitis B infection',
        slug: 'hepatitis-b-surface-antigen',
        price: 299,
        discountPrice: 249,
        preparationInstructions: 'No special preparation required.',
        reportTime: '24 hours',
        categoryId: categories[3].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Hepatitis C Antibody',
        description: 'Screening test for Hepatitis C infection',
        slug: 'hepatitis-c-antibody',
        price: 399,
        discountPrice: 349,
        preparationInstructions: 'No special preparation required.',
        reportTime: '24 hours',
        categoryId: categories[3].id,
        isActive: true,
      },
    }),

    // Kidney Function
    prisma.test.create({
      data: {
        name: 'Kidney Function Test (KFT)',
        description: 'Creatinine, urea, and other kidney function markers',
        slug: 'kidney-function-test-kft',
        price: 599,
        discountPrice: 499,
        preparationInstructions: 'No special preparation required',
        reportTime: '24 hours',
        categoryId: categories[4].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Urine Routine & Microscopy',
        description: 'Complete urine analysis for kidney and urinary tract health',
        slug: 'urine-routine-microscopy',
        price: 199,
        discountPrice: 149,
        preparationInstructions: 'Collect first morning urine sample in sterile container.',
        reportTime: '24 hours',
        categoryId: categories[4].id,
        isActive: true,
      },
    }),

    // Thyroid Tests
    prisma.test.create({
      data: {
        name: 'Thyroid Profile (T3, T4, TSH)',
        description: 'Complete thyroid function assessment',
        slug: 'thyroid-profile-t3-t4-tsh',
        price: 799,
        discountPrice: 699,
        preparationInstructions: 'No fasting required. Avoid biotin supplements 72 hours before test.',
        reportTime: '24 hours',
        categoryId: categories[5].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'TSH (Thyroid Stimulating Hormone)',
        description: 'Primary screening test for thyroid disorders',
        slug: 'tsh-thyroid-stimulating-hormone',
        price: 299,
        discountPrice: 249,
        preparationInstructions: 'No special preparation required.',
        reportTime: '24 hours',
        categoryId: categories[5].id,
        isActive: true,
      },
    }),

    // Vitamin Tests
    prisma.test.create({
      data: {
        name: 'Vitamin D (25-OH)',
        description: 'Measures vitamin D levels in blood',
        slug: 'vitamin-d-25-oh',
        price: 899,
        discountPrice: 799,
        preparationInstructions: 'No special preparation required.',
        reportTime: '48 hours',
        categoryId: categories[6].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Vitamin B12',
        description: 'Measures vitamin B12 levels for nerve and blood health',
        slug: 'vitamin-b12',
        price: 699,
        discountPrice: 599,
        preparationInstructions: 'No special preparation required.',
        reportTime: '48 hours',
        categoryId: categories[6].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Iron Studies',
        description: 'Complete iron profile including ferritin, TIBC, and transferrin',
        slug: 'iron-studies',
        price: 999,
        discountPrice: 899,
        preparationInstructions: '12-hour fasting recommended.',
        reportTime: '48 hours',
        categoryId: categories[6].id,
        isActive: true,
      },
    }),

    // Cancer Screening
    prisma.test.create({
      data: {
        name: 'PSA (Prostate Specific Antigen)',
        description: 'Prostate cancer screening for men',
        slug: 'psa-prostate-specific-antigen',
        price: 799,
        discountPrice: 699,
        preparationInstructions: 'Avoid ejaculation 48 hours before test.',
        reportTime: '48 hours',
        categoryId: categories[7].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'CA 125 (Ovarian Cancer Marker)',
        description: 'Tumor marker for ovarian cancer screening',
        slug: 'ca-125-ovarian-cancer-marker',
        price: 899,
        discountPrice: 799,
        preparationInstructions: 'No special preparation required.',
        reportTime: '48 hours',
        categoryId: categories[7].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'CEA (Carcinoembryonic Antigen)',
        description: 'Tumor marker for colorectal cancer screening',
        slug: 'cea-carcinoembryonic-antigen',
        price: 799,
        discountPrice: 699,
        preparationInstructions: 'Avoid smoking 24 hours before test.',
        reportTime: '48 hours',
        categoryId: categories[7].id,
        isActive: true,
      },
    }),

    // Infectious Diseases
    prisma.test.create({
      data: {
        name: 'HIV 1 & 2 Antibodies',
        description: 'Screening test for HIV infection',
        slug: 'hiv-1-2-antibodies',
        price: 399,
        discountPrice: 299,
        preparationInstructions: 'No special preparation required.',
        reportTime: '24 hours',
        categoryId: categories[8].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'VDRL (Syphilis)',
        description: 'Screening test for syphilis infection',
        slug: 'vdrl-syphilis',
        price: 199,
        discountPrice: 149,
        preparationInstructions: 'No special preparation required.',
        reportTime: '24 hours',
        categoryId: categories[8].id,
        isActive: true,
      },
    }),

    // Women's Health
    prisma.test.create({
      data: {
        name: 'Pap Smear',
        description: 'Cervical cancer screening test',
        slug: 'pap-smear',
        price: 599,
        discountPrice: 499,
        preparationInstructions: 'Avoid intercourse, douching, or vaginal medications 48 hours before test.',
        reportTime: '72 hours',
        categoryId: categories[9].id,
        isActive: true,
      },
    }),
    prisma.test.create({
      data: {
        name: 'Pregnancy Test (Beta HCG)',
        description: 'Blood test to confirm pregnancy',
        slug: 'pregnancy-test-beta-hcg',
        price: 299,
        discountPrice: 249,
        preparationInstructions: 'No special preparation required.',
        reportTime: '6 hours',
        categoryId: categories[9].id,
        isActive: true,
      },
    }),
  ])

  // Create Users
  console.log('👥 Creating users...')
  const hashedPassword = await bcrypt.hash('password123', 12)
  
  const users = await Promise.all([
    // Admin User
    prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@lynklabs.com',
        phone: '+919999999999',
        password: hashedPassword,
        role: 'ADMIN',
        isActive: true,
      },
    }),
    // Regular Users
    prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john.doe@example.com',
        phone: '+919876543210',
        password: hashedPassword,
        role: 'USER',
        isActive: true,
        dateOfBirth: new Date('1990-05-15'),
        gender: 'MALE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        phone: '+919876543211',
        password: hashedPassword,
        role: 'USER',
        isActive: true,
        dateOfBirth: new Date('1985-08-22'),
        gender: 'FEMALE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Rajesh Patel',
        email: 'rajesh.patel@example.com',
        phone: '+919876543214',
        password: hashedPassword,
        role: 'USER',
        isActive: true,
        dateOfBirth: new Date('1988-12-10'),
        gender: 'MALE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Priya Sharma',
        email: 'priya.sharma@example.com',
        phone: '+919876543215',
        password: hashedPassword,
        role: 'USER',
        isActive: true,
        dateOfBirth: new Date('1992-03-25'),
        gender: 'FEMALE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Amit Kumar',
        email: 'amit.kumar@example.com',
        phone: '+919876543216',
        password: hashedPassword,
        role: 'USER',
        isActive: true,
        dateOfBirth: new Date('1987-07-18'),
        gender: 'MALE',
      },
    }),
    // Home Visit Agents
    prisma.user.create({
      data: {
        name: 'Dr. Rajesh Kumar',
        email: 'rajesh.kumar@lynklabs.com',
        phone: '+919876543212',
        password: hashedPassword,
        role: 'HOME_VISIT_AGENT',
        isActive: true,
        dateOfBirth: new Date('1980-03-10'),
        gender: 'MALE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Priya Sharma',
        email: 'priya.sharma.agent@lynklabs.com',
        phone: '+919876543213',
        password: hashedPassword,
        role: 'HOME_VISIT_AGENT',
        isActive: true,
        dateOfBirth: new Date('1988-12-05'),
        gender: 'FEMALE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Suresh Reddy',
        email: 'suresh.reddy@lynklabs.com',
        phone: '+919876543217',
        password: hashedPassword,
        role: 'HOME_VISIT_AGENT',
        isActive: true,
        dateOfBirth: new Date('1985-09-15'),
        gender: 'MALE',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Dr. Kavitha Nair',
        email: 'kavitha.nair@lynklabs.com',
        phone: '+919876543218',
        password: hashedPassword,
        role: 'HOME_VISIT_AGENT',
        isActive: true,
        dateOfBirth: new Date('1990-11-20'),
        gender: 'FEMALE',
      },
    }),
  ])

  // Create Addresses
  console.log('🏠 Creating addresses...')
  const addresses = await Promise.all([
    prisma.address.create({
      data: {
        userId: users[1].id, // John Doe
        type: 'HOME',
        line1: '123 MG Road',
        line2: 'Near City Mall',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560001',
        landmark: 'Opposite Metro Station',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[2].id, // Jane Smith
        type: 'HOME',
        line1: '456 Brigade Road',
        line2: 'Apartment 3B',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560025',
        landmark: 'Near Commercial Street',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[3].id, // Rajesh Patel
        type: 'HOME',
        line1: '789 Koramangala',
        line2: 'Block 4, House 15',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560034',
        landmark: 'Near Forum Mall',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[4].id, // Priya Sharma
        type: 'HOME',
        line1: '321 Indiranagar',
        line2: '12th Main Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560038',
        landmark: 'Near Metro Station',
        isDefault: true,
      },
    }),
    prisma.address.create({
      data: {
        userId: users[5].id, // Amit Kumar
        type: 'HOME',
        line1: '654 Whitefield',
        line2: 'ITPL Main Road',
        city: 'Bangalore',
        state: 'Karnataka',
        pincode: '560066',
        landmark: 'Near Phoenix Mall',
        isDefault: true,
      },
    }),
  ])

  // Create Orders
  console.log('📋 Creating orders...')
  const orders = await Promise.all([
    prisma.order.create({
      data: {
        userId: users[1].id, // John Doe
        orderNumber: 'LNK001',
        status: 'COMPLETED',
        totalAmount: 1147,
        finalAmount: 1147,
        paymentMethod: 'RAZORPAY',
        addressId: addresses[0].id,
        orderItems: {
          create: [
            {
              testId: tests[0].id, // CBC
              quantity: 1,
              price: tests[0].discountPrice || tests[0].price,
            },
            {
              testId: tests[3].id, // Lipid Profile
              quantity: 1,
              price: tests[3].discountPrice || tests[3].price,
            },
            {
              testId: tests[6].id, // HbA1c
              quantity: 1,
              price: tests[6].discountPrice || tests[6].price,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[2].id, // Jane Smith
        orderNumber: 'LNK002',
        status: 'SAMPLE_COLLECTED',
        totalAmount: 1298,
        finalAmount: 1298,
        paymentMethod: 'RAZORPAY',
        addressId: addresses[1].id,
        orderItems: {
          create: [
            {
              testId: tests[10].id, // LFT
              quantity: 1,
              price: tests[10].discountPrice || tests[10].price,
            },
            {
              testId: tests[15].id, // Thyroid Profile
              quantity: 1,
              price: tests[15].discountPrice || tests[15].price,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[3].id, // Rajesh Patel
        orderNumber: 'LNK003',
        status: 'PENDING',
        totalAmount: 499,
        finalAmount: 499,
        paymentMethod: 'RAZORPAY',
        addressId: addresses[2].id,
        orderItems: {
          create: [
            {
              testId: tests[13].id, // KFT
              quantity: 1,
              price: tests[13].discountPrice || tests[13].price,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[4].id, // Priya Sharma
        orderNumber: 'LNK004',
        status: 'CONFIRMED',
        totalAmount: 1598,
        finalAmount: 1598,
        paymentMethod: 'RAZORPAY',
        addressId: addresses[3].id,
        orderItems: {
          create: [
            {
              testId: tests[17].id, // Vitamin D
              quantity: 1,
              price: tests[17].discountPrice || tests[17].price,
            },
            {
              testId: tests[18].id, // Vitamin B12
              quantity: 1,
              price: tests[18].discountPrice || tests[18].price,
            },
            {
              testId: tests[25].id, // Pap Smear
              quantity: 1,
              price: tests[25].discountPrice || tests[25].price,
            },
          ],
        },
      },
    }),
    prisma.order.create({
      data: {
        userId: users[5].id, // Amit Kumar
        orderNumber: 'LNK005',
        status: 'REPORT_READY',
        totalAmount: 1397,
        finalAmount: 1397,
        paymentMethod: 'RAZORPAY',
        addressId: addresses[4].id,
        orderItems: {
          create: [
            {
              testId: tests[20].id, // PSA
              quantity: 1,
              price: tests[20].discountPrice || tests[20].price,
            },
            {
              testId: tests[23].id, // HIV Test
              quantity: 1,
              price: tests[23].discountPrice || tests[23].price,
            },
            {
              testId: tests[19].id, // Iron Studies
              quantity: 1,
              price: tests[19].discountPrice || tests[19].price,
            },
          ],
        },
      },
    }),
  ])

  // Create Home Visits
  console.log('🏥 Creating home visits...')
  const homeVisits = await Promise.all([
    prisma.homeVisit.create({
      data: {
        orderId: orders[0].id,
        scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
        scheduledTime: '10:00',
        status: 'COMPLETED',
        agentId: users[6].id, // Dr. Rajesh Kumar
        notes: 'Sample collected successfully. Patient was cooperative.',
      },
    }),
    prisma.homeVisit.create({
      data: {
        orderId: orders[1].id,
        scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
        scheduledTime: '14:30',
        status: 'SCHEDULED',
        agentId: users[7].id, // Dr. Priya Sharma
        notes: 'Patient prefers afternoon slot. Fasting required for LFT.',
      },
    }),
    prisma.homeVisit.create({
      data: {
        orderId: orders[3].id,
        scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
        scheduledTime: '09:00',
        status: 'SCHEDULED',
        agentId: users[8].id, // Dr. Suresh Reddy
        notes: 'Early morning appointment requested.',
      },
    }),
    prisma.homeVisit.create({
      data: {
        orderId: orders[4].id,
        scheduledDate: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
        scheduledTime: '11:00',
        status: 'COMPLETED',
        agentId: users[9].id, // Dr. Kavitha Nair
        notes: 'Sample collected. Patient had questions about test preparation.',
      },
    }),
  ])

  // Create Reports
  console.log('📊 Creating reports...')
  const reports = await Promise.all([
    prisma.report.create({
      data: {
        orderId: orders[0].id,
        fileName: 'cbc-report-001.pdf',
        fileUrl: '/uploads/reports/cbc-report-001.pdf',
        fileSize: 1024000,
        uploadedBy: users[0].id, // Admin
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
    }),
    prisma.report.create({
      data: {
        orderId: orders[0].id,
        fileName: 'lipid-profile-report-001.pdf',
        fileUrl: '/uploads/reports/lipid-profile-report-001.pdf',
        fileSize: 1024000,
        uploadedBy: users[0].id, // Admin
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 60 * 60 * 1000), // 1 hour ago
      },
    }),
    prisma.report.create({
      data: {
        orderId: orders[0].id,
        fileName: 'hba1c-report-001.pdf',
        fileUrl: '/uploads/reports/hba1c-report-001.pdf',
        fileSize: 1024000,
        uploadedBy: users[0].id, // Admin
        isDelivered: false,
      },
    }),
    prisma.report.create({
      data: {
        orderId: orders[1].id,
        fileName: 'lft-report-002.pdf',
        fileUrl: '/uploads/reports/lft-report-002.pdf',
        fileSize: 1024000,
        uploadedBy: users[0].id, // Admin
        isDelivered: false,
      },
    }),
    prisma.report.create({
      data: {
        orderId: orders[4].id,
        fileName: 'psa-report-005.pdf',
        fileUrl: '/uploads/reports/psa-report-005.pdf',
        fileSize: 1024000,
        uploadedBy: users[0].id, // Admin
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    }),
    prisma.report.create({
      data: {
        orderId: orders[4].id,
        fileName: 'hiv-report-005.pdf',
        fileUrl: '/uploads/reports/hiv-report-005.pdf',
        fileSize: 1024000,
        uploadedBy: users[0].id, // Admin
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    }),
    prisma.report.create({
      data: {
        orderId: orders[4].id,
        fileName: 'iron-studies-report-005.pdf',
        fileUrl: '/uploads/reports/iron-studies-report-005.pdf',
        fileSize: 1024000,
        uploadedBy: users[0].id, // Admin
        isDelivered: false,
      },
    }),
  ])

  console.log('✅ Database seeding completed successfully!')
  console.log('\n📊 Summary:')
  console.log(`- Categories: ${categories.length}`)
  console.log(`- Tests: ${tests.length}`)
  console.log(`- Users: ${users.length}`)
  console.log(`- Addresses: ${addresses.length}`)
  console.log(`- Orders: ${orders.length}`)
  console.log(`- Home Visits: ${homeVisits.length}`)
  console.log(`- Reports: ${reports.length}`)

  console.log('\n🔑 Admin Credentials:')
  console.log('Phone: +919999999999')
  console.log('Password: password123')

  console.log('\n👤 Test User Credentials:')
  console.log('John Doe - Phone: +919876543210, Password: password123')
  console.log('Jane Smith - Phone: +919876543211, Password: password123')
  console.log('Rajesh Patel - Phone: +919876543214, Password: password123')
  console.log('Priya Sharma - Phone: +919876543215, Password: password123')
  console.log('Amit Kumar - Phone: +919876543216, Password: password123')

  console.log('\n🏥 Home Visit Agents:')
  console.log('Dr. Rajesh Kumar - Phone: +919876543212')
  console.log('Dr. Priya Sharma - Phone: +919876543213')
  console.log('Dr. Suresh Reddy - Phone: +919876543217')
  console.log('Dr. Kavitha Nair - Phone: +919876543218')
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 