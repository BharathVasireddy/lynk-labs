const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function listUsers() {
  try {
    console.log('📋 Fetching all users from database...\n');
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        phone: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    if (users.length === 0) {
      console.log('❌ No users found in the database');
      return;
    }

    console.log(`✅ Found ${users.length} users:\n`);
    
    users.forEach((user, index) => {
      console.log(`${index + 1}. User Details:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Name: ${user.name || 'N/A'}`);
      console.log(`   Phone: ${user.phone || 'N/A'}`);
      console.log(`   Email: ${user.email || 'N/A'}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   Active: ${user.isActive}`);
      console.log(`   Created: ${user.createdAt.toISOString()}`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error fetching users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

listUsers(); 