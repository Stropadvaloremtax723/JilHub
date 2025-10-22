import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, videoUrl, thumbnailUrl, category, tags, published } = body

    // Create or get category
    let categoryRecord = null
    if (category) {
      categoryRecord = await prisma.category.upsert({
        where: { slug: slugify(category) },
        update: {},
        create: {
          name: category,
          slug: slugify(category),
        },
      })
    }

    // Create video
    const video = await prisma.video.create({
      data: {
        title,
        description: description || null,
        videoUrl,
        thumbnailUrl,
        published: published || false,
        userId: session.user.id,
        categoryId: categoryRecord?.id || null,
      },
    })

    // Create tags and associate with video
    if (tags && tags.length > 0) {
      for (const tagName of tags) {
        const tag = await prisma.tag.upsert({
          where: { slug: slugify(tagName) },
          update: {},
          create: {
            name: tagName,
            slug: slugify(tagName),
          },
        })

        await prisma.tagOnVideo.create({
          data: {
            videoId: video.id,
            tagId: tag.id,
          },
        })
      }
    }

    return NextResponse.json(video, { status: 201 })
  } catch (error) {
    console.error('Error creating video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const videos = await prisma.video.findMany({
      where: { published: true },
      include: {
        category: true,
        tags: {
          include: { tag: true }
        }
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(videos)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
