import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { AdminLayout } from '@/components/admin-layout'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Video, Eye, TrendingUp, Clock } from 'lucide-react'

export default async function AdminDashboard() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  // Get statistics
  const totalVideos = await prisma.video.count()
  const publishedVideos = await prisma.video.count({
    where: { published: true }
  })
  const totalViews = await prisma.video.aggregate({
    _sum: { views: true }
  })
  const recentVideos = await prisma.video.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    include: { category: true }
  })

  return (
    <AdminLayout>
      <div>
        <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Videos
              </CardTitle>
              <Video className="w-4 h-4 text-jil-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">{totalVideos}</div>
              <p className="text-xs text-gray-400 mt-1">
                {publishedVideos} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Total Views
              </CardTitle>
              <Eye className="w-4 h-4 text-jil-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalViews._sum.views?.toLocaleString() || 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">All time</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Avg. Views
              </CardTitle>
              <TrendingUp className="w-4 h-4 text-jil-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalVideos > 0
                  ? Math.round((totalViews._sum.views || 0) / totalVideos)
                  : 0}
              </div>
              <p className="text-xs text-gray-400 mt-1">Per video</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-gray-400">
                Draft Videos
              </CardTitle>
              <Clock className="w-4 h-4 text-jil-orange" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-white">
                {totalVideos - publishedVideos}
              </div>
              <p className="text-xs text-gray-400 mt-1">Unpublished</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Videos */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Videos</CardTitle>
          </CardHeader>
          <CardContent>
            {recentVideos.length > 0 ? (
              <div className="space-y-4">
                {recentVideos.map((video) => (
                  <div
                    key={video.id}
                    className="flex items-center gap-4 p-3 rounded-lg bg-jil-darker hover:bg-gray-900 transition"
                  >
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-32 h-18 object-cover rounded"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-white">{video.title}</h3>
                      <div className="flex items-center gap-4 mt-1 text-sm text-gray-400">
                        <span>{video.views} views</span>
                        {video.category && (
                          <span className="text-jil-orange">{video.category.name}</span>
                        )}
                        <span
                          className={`px-2 py-0.5 rounded text-xs ${
                            video.published
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-yellow-500/20 text-yellow-400'
                          }`}
                        >
                          {video.published ? 'Published' : 'Draft'}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-center py-4">No videos yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  )
}
