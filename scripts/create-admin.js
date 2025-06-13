const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const admin = await prisma.user.upsert({
      where: { email: 'admin@lynklabs.com' },
      update: {},
      create: {
        email: 'admin@lynklabs.com',
        name: 'Admin User',
        phone: '+919999999998',
        role: 'ADMIN',
        isActive: true,
      },
    });

    console.log('Admin user created/updated:', admin);
  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdmin(); 