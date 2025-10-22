import { prisma } from '@/lib/prisma'
import { Header } from '@/components/header'
import { VideoCard } from '@/components/video-card'

export default async function Home() {
  const videos = await prisma.video.findMany({
    where: { published: true },
    orderBy: { createdAt: 'desc' },
    take: 20,
  })

  return (
    <div className="min-h-screen">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-white mb-6">Recently Added</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                id={video.id}
                title={video.title}
                thumbnail={video.thumbnailUrl}
                duration={video.duration || 0}
                views={video.views}
                createdAt={video.createdAt}
              />
            ))}
          </div>
        </div>

        {videos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400 text-lg">No videos available yet.</p>
          </div>
        )}
      </main>
    </div>
  )
}
