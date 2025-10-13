import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkAuth() {
  console.log('🔍 Checking authentication setup...\n');

  // Get all users
  const users = await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      createdAt: true,
    },
  });

  console.log(`📊 Total users: ${users.length}\n`);

  if (users.length === 0) {
    console.log('⚠️  No users found in database!');
    console.log('💡 Run: npm run db:seed or npx tsx prisma/create-admin.ts\n');
    return;
  }

  console.log('👥 User List:');
  console.log('─'.repeat(80));
  
  users.forEach((user, index) => {
    console.log(`${index + 1}. ${user.name || 'No Name'}`);
    console.log(`   📧 Email: ${user.email}`);
    console.log(`   👤 Role: ${user.role}`);
    console.log(`   🆔 ID: ${user.id}`);
    console.log(`   📅 Created: ${user.createdAt.toLocaleDateString('id-ID')}`);
    console.log('');
  });

  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const userCount = users.filter(u => u.role === 'USER').length;

  console.log('─'.repeat(80));
  console.log(`🔐 Admin users: ${adminCount}`);
  console.log(`👤 Regular users: ${userCount}`);
  
  if (adminCount === 0) {
    console.log('\n⚠️  No admin users found!');
    console.log('💡 Run: npx tsx prisma/create-admin.ts to create one');
  } else {
    console.log('\n✅ Admin user(s) found. You can login at /login');
  }
}

checkAuth()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
