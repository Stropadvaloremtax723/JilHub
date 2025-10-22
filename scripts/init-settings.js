const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  console.log('Initializing settings...')
  
  // Check if settings already exist
  const existing = await prisma.settings.findFirst()
  
  if (existing) {
    console.log('Settings already exist:', existing)
    return
  }

  // Create default settings
  const settings = await prisma.settings.create({
    data: {
      enableRedirects: false,
      redirectUrl: process.env.NEXT_PUBLIC_AD_REDIRECT_URL || '',
      redirectClicks: 3
    }
  })

  console.log('Settings initialized:', settings)
}

main()
  .catch((e) => {
    console.error('Error initializing settings:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
