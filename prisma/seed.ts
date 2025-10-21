import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Hash admin password with bcrypt (10 rounds)
  const bcrypt = await import('bcryptjs');
  const hashedPassword = await bcrypt.hash('admin123', 10);

  // Create admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@villagestay.com' },
    update: {},
    create: {
      email: 'admin@villagestay.com',
      name: 'Admin User',
      role: 'ADMIN',
      // Password: admin123 (hashed with bcrypt)
      password: hashedPassword,
    },
  });

  console.log('✅ Created admin user');

  // Create blog categories
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'travel-tips' },
      update: {},
      create: {
        name: 'Travel Tips',
        slug: 'travel-tips',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'culture' },
      update: {},
      create: {
        name: 'Culture',
        slug: 'culture',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'food' },
      update: {},
      create: {
        name: 'Food',
        slug: 'food',
      },
    }),
  ]);

  console.log('✅ Created blog categories');

  // Create sample homestays
  await Promise.all([
    prisma.homestay.upsert({
      where: { slug: 'traditional-village-house' },
      update: {},
      create: {
        name: 'Traditional Village House',
        slug: 'traditional-village-house',
        description: 'Experience authentic village life in this beautifully preserved traditional house with modern amenities.',
        address: 'Village Center, Main Street',
        pricePerNight: 250000,
        maxGuests: 4,
        photos: JSON.stringify(['/placeholder-homestay-1.jpg']),
        facilities: JSON.stringify(['WiFi', 'Air Conditioning', 'Kitchen', 'Parking']),
        featured: true,
        published: true,
      },
    }),
    prisma.homestay.upsert({
      where: { slug: 'mountain-view-cottage' },
      update: {},
      create: {
        name: 'Mountain View Cottage',
        slug: 'mountain-view-cottage',
        description: 'Wake up to stunning mountain views from this cozy cottage surrounded by nature.',
        address: 'Hilltop Area',
        pricePerNight: 300000,
        maxGuests: 2,
        photos: JSON.stringify(['/placeholder-homestay-2.jpg']),
        facilities: JSON.stringify(['WiFi', 'Mountain View', 'Garden', 'Breakfast Included']),
        featured: true,
        published: true,
      },
    }),
    prisma.homestay.upsert({
      where: { slug: 'rice-terrace-retreat' },
      update: {},
      create: {
        name: 'Rice Terrace Retreat',
        slug: 'rice-terrace-retreat',
        description: 'Immerse yourself in the beauty of rice terraces with this peaceful retreat.',
        address: 'Rice Terrace Area',
        pricePerNight: 275000,
        maxGuests: 3,
        photos: JSON.stringify(['/placeholder-homestay-3.jpg']),
        facilities: JSON.stringify(['WiFi', 'Terrace View', 'Kitchen', 'Hot Water']),
        featured: true,
        published: true,
      },
    }),
  ]);

  console.log('✅ Created sample homestays');

  // Create sample attractions
  await Promise.all([
    prisma.attraction.upsert({
      where: { slug: 'hidden-waterfall' },
      update: {},
      create: {
        name: 'Hidden Waterfall',
        slug: 'hidden-waterfall',
        description: 'A beautiful waterfall hidden in the forest, perfect for swimming and photography.',
        location: '5 km from village center',
        photos: JSON.stringify(['/placeholder-attraction-1.jpg']),
        featured: true,
        published: true,
      },
    }),
    prisma.attraction.upsert({
      where: { slug: 'ancient-rice-terraces' },
      update: {},
      create: {
        name: 'Ancient Rice Terraces',
        slug: 'ancient-rice-terraces',
        description: 'Centuries-old rice terraces that showcase traditional farming techniques.',
        location: '3 km from village center',
        photos: JSON.stringify(['/placeholder-attraction-2.jpg']),
        featured: true,
        published: true,
      },
    }),
  ]);

  console.log('✅ Created sample attractions');

  // Create sample culinary items
  await Promise.all([
    prisma.culinary.upsert({
      where: { slug: 'traditional-rice-dish' },
      update: {},
      create: {
        name: 'Traditional Rice Dish',
        slug: 'traditional-rice-dish',
        description: 'Authentic village recipe with aromatic spices and fresh local ingredients.',
        location: 'Available at Warung Mama',
        priceRange: 'Rp 25.000 - Rp 35.000',
        photos: JSON.stringify(['/placeholder-culinary-1.jpg']),
        featured: true,
        published: true,
      },
    }),
    prisma.culinary.upsert({
      where: { slug: 'smoked-fish-specialty' },
      update: {},
      create: {
        name: 'Smoked Fish Specialty',
        slug: 'smoked-fish-specialty',
        description: 'Fresh local fish smoked using traditional methods passed down through generations.',
        location: 'Available at Warung Pak Budi',
        priceRange: 'Rp 40.000 - Rp 60.000',
        photos: JSON.stringify(['/placeholder-culinary-2.jpg']),
        featured: true,
        published: true,
      },
    }),
  ]);

  console.log('✅ Created sample culinary items');

  // Create sample blog posts
  await Promise.all([
    prisma.post.upsert({
      where: { slug: 'getting-around-the-village' },
      update: {},
      create: {
        title: 'Getting Around the Village: A Visitor\'s Guide',
        slug: 'getting-around-the-village',
        excerpt: 'Learn the best ways to explore our village and make the most of your visit.',
        content: 'Full blog post content goes here...',
        coverImage: '/placeholder-blog-1.jpg',
        published: true,
        authorId: adminUser.id,
        categoryId: categories[0].id,
      },
    }),
    prisma.post.upsert({
      where: { slug: 'traditional-ceremonies-explained' },
      update: {},
      create: {
        title: 'Traditional Ceremonies Explained',
        slug: 'traditional-ceremonies-explained',
        excerpt: 'Discover the meaning and beauty behind our village\'s traditional ceremonies.',
        content: 'Full blog post content goes here...',
        coverImage: '/placeholder-blog-2.jpg',
        published: true,
        authorId: adminUser.id,
        categoryId: categories[1].id,
      },
    }),
  ]);

  console.log('✅ Created sample blog posts');

  // Create sample regular user for booking examples
  const bcrypt2 = await import('bcryptjs');
  const userPassword = await bcrypt2.hash('user123', 10);

  const sampleUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Sample User',
      role: 'USER',
      password: userPassword,
    },
  });

  console.log('✅ Created sample user');

  // Create sample bookings
  const homestays = await prisma.homestay.findMany({ take: 2 });

  if (homestays.length >= 2) {
    const today = new Date();
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    const nextWeekEnd = new Date(nextWeek);
    nextWeekEnd.setDate(nextWeekEnd.getDate() + 3);

    await prisma.booking.upsert({
      where: { id: 'sample-booking-1' },
      update: {},
      create: {
        id: 'sample-booking-1',
        checkInDate: nextWeek,
        checkOutDate: nextWeekEnd,
        numberOfGuests: 2,
        totalPrice: (homestays[0].pricePerNight as unknown as bigint) * BigInt(3),
        status: 'PENDING',
        userId: sampleUser.id,
        homestayId: homestays[0].id,
      },
    });

    console.log('✅ Created sample booking');
  }

  console.log('🎉 Database seeding completed!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error during seeding:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
