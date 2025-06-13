const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function makeUserRegular(phone) {
  try {
    console.log(`Looking for user with phone: ${phone}`);
    
    const user = await prisma.user.findUnique({
      where: { phone },
      select: { id: true, name: true, phone: true, role: true }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log('📋 Current user details:');
    console.log(`   ID: ${user.id}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Phone: ${user.phone}`);
    console.log(`   Current Role: ${user.role}`);

    if (user.role === 'USER' || user.role === 'CUSTOMER') {
      console.log('✅ User is already a regular user');
      return;
    }

    // Update user role to USER
    const updatedUser = await prisma.user.update({
      where: { phone },
      data: { role: 'USER' },
      select: { id: true, name: true, phone: true, role: true }
    });

    console.log('\n🎉 User successfully demoted to regular user!');
    console.log('📋 Updated user details:');
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Phone: ${updatedUser.phone}`);
    console.log(`   New Role: ${updatedUser.role}`);

  } catch (error) {
    console.error('❌ Error updating user role:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get phone number from command line arguments
const phone = process.argv[2];

if (!phone) {
  console.log('❌ Please provide a phone number');
  console.log('Usage: node scripts/make-user.js <phone_number>');
  console.log('Example: node scripts/make-user.js +918885333635');
  process.exit(1);
}

makeUserRegular(phone); 