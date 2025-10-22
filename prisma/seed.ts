import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create admin user
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@jilhub.com'
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const hashedPassword = await bcrypt.hash(adminPassword, 10)

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: 'Admin',
      role: 'ADMIN',
    },
  })

  console.log('✅ Admin user created:', admin.email)

  // Create sample categories
  const categories = [
    { name: 'Entertainment', slug: 'entertainment', description: 'Entertainment videos' },
    { name: 'Gaming', slug: 'gaming', description: 'Gaming content' },
    { name: 'Music', slug: 'music', description: 'Music videos' },
    { name: 'Sports', slug: 'sports', description: 'Sports highlights' },
    { name: 'Education', slug: 'education', description: 'Educational content' },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: cat,
    })
  }

  console.log('✅ Categories created')

  // Create sample tags
  const tags = ['trending', 'popular', 'new', 'featured', 'viral']

  for (const tagName of tags) {
    await prisma.tag.upsert({
      where: { slug: tagName },
      update: {},
      create: {
        name: tagName,
        slug: tagName,
      },
    })
  }

  console.log('✅ Tags created')
  console.log('🎉 Database seed completed!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
