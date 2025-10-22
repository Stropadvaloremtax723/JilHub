import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Get settings (public endpoint for video player)
    let settings = await prisma.settings.findFirst()
    
    if (!settings) {
      // Return default settings if none exist
      return NextResponse.json({
        enableRedirects: false,
        redirectUrl: '',
        redirectClicks: 3
      })
    }

    // Only return necessary fields
    return NextResponse.json({
      enableRedirects: settings.enableRedirects,
      redirectUrl: settings.redirectUrl,
      redirectClicks: settings.redirectClicks
    })
  } catch (error) {
    console.error('Error fetching public settings:', error)
    return NextResponse.json(
      {
        enableRedirects: false,
        redirectUrl: '',
        redirectClicks: 3
      },
      { status: 200 } // Return defaults even on error
    )
  }
}
