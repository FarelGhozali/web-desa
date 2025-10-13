import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function createAdmin() {
  console.log('🔧 Creating/Updating admin user...\n');

  const email = 'admin@villagestay.com';
  const password = 'admin123';
  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {
      role: 'ADMIN',
      password: hashedPassword,
    },
    create: {
      email,
      name: 'Admin User',
      role: 'ADMIN',
      password: hashedPassword,
    },
  });

  console.log('✅ Admin user created/updated successfully!');
  console.log('📧 Email:', email);
  console.log('🔑 Password:', password);
  console.log('👤 Role:', admin.role);
  console.log('🆔 ID:', admin.id);
  console.log('\n✨ You can now login with these credentials at /login');
}

createAdmin()
  .catch((e) => {
    console.error('❌ Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
