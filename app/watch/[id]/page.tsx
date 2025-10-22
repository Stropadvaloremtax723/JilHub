import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { VideoPlayer } from '@/components/video-player'
import { VideoCard } from '@/components/video-card'
import { formatViews, formatDate } from '@/lib/utils'

interface PageProps {
  params: {
    id: string
  }
}

export default async function WatchPage({ params }: PageProps) {
  const video = await prisma.video.findUnique({
    where: { id: params.id },
    include: {
      tags: {
        include: {
          tag: true
        }
      },
      category: true
    }
  })

  if (!video || !video.published) {
    notFound()
  }

  // Increment view count
  await prisma.video.update({
    where: { id: params.id },
    data: { views: { increment: 1 } }
  })

  // Get related videos
  const relatedVideos = await prisma.video.findMany({
    where: {
      published: true,
      id: { not: params.id },
      OR: [
        { categoryId: video.categoryId },
        {
          tags: {
            some: {
              tagId: {
                in: video.tags.map(t => t.tagId)
              }
            }
          }
        }
      ]
    },
    take: 12,
    orderBy: { views: 'desc' }
  })

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Video Player Section */}
          <div className="lg:col-span-2">
            <VideoPlayer
              url={video.videoUrl}
              thumbnail={video.thumbnailUrl}
              title={video.title}
            />

            <div className="mt-4">
              <h1 className="text-2xl font-bold text-white mb-2">
                {video.title}
              </h1>
              
              <div className="flex items-center gap-4 text-gray-400 text-sm mb-4">
                <span>{formatViews(video.views)} views</span>
                <span>{formatDate(video.createdAt)}</span>
              </div>

              {video.category && (
                <div className="mb-4">
                  <span className="inline-block bg-jil-orange px-3 py-1 rounded text-sm font-medium">
                    {video.category.name}
                  </span>
                </div>
              )}

              {video.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {video.tags.map(({ tag }) => (
                    <span
                      key={tag.id}
                      className="inline-block bg-gray-800 px-3 py-1 rounded text-sm text-gray-300 hover:bg-gray-700 cursor-pointer"
                    >
                      #{tag.name}
                    </span>
                  ))}
                </div>
              )}

              {video.description && (
                <div className="bg-jil-darker rounded-lg p-4">
                  <p className="text-gray-300 whitespace-pre-wrap">
                    {video.description}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Related Videos Sidebar */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold text-white mb-4">Related Videos</h2>
            <div className="space-y-4">
              {relatedVideos.map((relatedVideo) => (
                <VideoCard
                  key={relatedVideo.id}
                  id={relatedVideo.id}
                  title={relatedVideo.title}
                  thumbnail={relatedVideo.thumbnailUrl}
                  duration={relatedVideo.duration || 0}
                  views={relatedVideo.views}
                  createdAt={relatedVideo.createdAt}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
