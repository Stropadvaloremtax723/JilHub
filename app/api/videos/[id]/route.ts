import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { slugify } from '@/lib/utils'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const video = await prisma.video.findUnique({
      where: { id: params.id },
      include: {
        category: true,
        tags: {
          include: { tag: true }
        }
      }
    })

    if (!video) {
      return NextResponse.json({ error: 'Video not found' }, { status: 404 })
    }

    return NextResponse.json(video)
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { title, description, videoUrl, thumbnailUrl, category, tags, published } = body

    // Update or create category
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

    // Update video
    const video = await prisma.video.update({
      where: { id: params.id },
      data: {
        title,
        description: description || null,
        videoUrl,
        thumbnailUrl,
        published: published || false,
        categoryId: categoryRecord?.id || null,
      },
    })

    // Update tags
    await prisma.tagOnVideo.deleteMany({
      where: { videoId: params.id }
    })

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

    return NextResponse.json(video)
  } catch (error) {
    console.error('Error updating video:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await prisma.video.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
