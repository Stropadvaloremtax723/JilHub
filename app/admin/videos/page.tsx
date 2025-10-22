import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/route'
import { AdminLayout } from '@/components/admin-layout'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatViews, formatDate } from '@/lib/utils'

export default async function VideosPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/admin/login')
  }

  const videos = await prisma.video.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      category: true,
      tags: {
        include: { tag: true }
      }
    }
  })

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">Videos</h1>
          <Link href="/admin/videos/new">
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Video
            </Button>
          </Link>
        </div>

        <div className="bg-jil-dark rounded-lg border border-gray-800">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Thumbnail</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Views</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {videos.map((video) => (
                <TableRow key={video.id}>
                  <TableCell>
                    <img
                      src={video.thumbnailUrl}
                      alt={video.title}
                      className="w-24 h-14 object-cover rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium text-white">{video.title}</p>
                      {video.tags.length > 0 && (
                        <p className="text-xs text-gray-400 mt-1">
                          {video.tags.map(({ tag }) => tag.name).join(', ')}
                        </p>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {video.category ? (
                      <span className="text-jil-orange">{video.category.name}</span>
                    ) : (
                      <span className="text-gray-500">-</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-gray-400" />
                      <span>{formatViews(video.views)}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        video.published
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {video.published ? 'Published' : 'Draft'}
                    </span>
                  </TableCell>
                  <TableCell className="text-gray-400">
                    {formatDate(video.createdAt)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/videos/edit/${video.id}`}>
                        <Button variant="ghost" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </Link>
                      <form action={`/api/videos/${video.id}/delete`} method="POST">
                        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </form>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {videos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No videos yet. Add your first video!</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
