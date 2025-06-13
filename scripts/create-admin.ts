import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('🔧 Creating admin user...');

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: 'ADMIN' }
    });

    if (existingAdmin) {
      console.log('✅ Admin user already exists:', existingAdmin.phone);
      console.log('📱 Phone:', existingAdmin.phone);
      console.log('👤 Name:', existingAdmin.name || 'Not set');
      console.log('🔑 Role:', existingAdmin.role);
      return;
    }

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        phone: '+919999999999',
        name: 'Admin User',
        role: 'ADMIN',
        isActive: true,
      }
    });

    console.log('✅ Admin user created successfully!');
    console.log('📱 Phone:', adminUser.phone);
    console.log('👤 Name:', adminUser.name);
    console.log('🔑 Role:', adminUser.role);
    console.log('');
    console.log('🚀 You can now login with phone: +919999999999');
    console.log('📍 Access admin dashboard at: http://localhost:3000/admin');

  } catch (error) {
    console.error('❌ Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser(); 