'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Link as LinkIcon, ArrowLeft } from 'lucide-react'
import { AdminLayout } from '@/components/admin-layout'
import Link from 'next/link'

interface PageProps {
  params: {
    id: string
  }
}

export default function EditVideoPage({ params }: PageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    videoUrl: '',
    thumbnailUrl: '',
    category: '',
    tags: '',
    published: false,
  })

  useEffect(() => {
    fetchVideo()
  }, [params.id])

  const fetchVideo = async () => {
    try {
      const response = await fetch(`/api/videos/${params.id}`)
      if (response.ok) {
        const video = await response.json()
        setFormData({
          title: video.title || '',
          description: video.description || '',
          videoUrl: video.videoUrl || '',
          thumbnailUrl: video.thumbnailUrl || '',
          category: video.category?.name || '',
          tags: video.tags?.map((t: any) => t.tag.name).join(', ') || '',
          published: video.published || false,
        })
      }
    } catch (error) {
      console.error('Error fetching video:', error)
      alert('Failed to load video')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/videos/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        }),
      })

      if (response.ok) {
        router.push('/admin/videos')
        router.refresh()
      } else {
        alert('Failed to update video')
      }
    } catch (error) {
      alert('An error occurred')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this video?')) {
      return
    }

    try {
      const response = await fetch(`/api/videos/${params.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        router.push('/admin/videos')
        router.refresh()
      } else {
        alert('Failed to delete video')
      }
    } catch (error) {
      alert('An error occurred')
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-white">Loading video...</div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="max-w-4xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/admin/videos" className="inline-flex items-center text-gray-400 hover:text-white mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Videos
            </Link>
            <h1 className="text-3xl font-bold text-white mb-2">Edit Video</h1>
            <p className="text-gray-400">Update video details and settings</p>
          </div>
          <Button
            type="button"
            variant="outline"
            onClick={handleDelete}
            className="bg-red-900/20 border-red-900 text-red-400 hover:bg-red-900/40"
          >
            Delete Video
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Video Source */}
          <Card>
            <CardHeader>
              <CardTitle>Video Source</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Video URL or Embed Link
                </label>
                <Input
                  type="text"
                  placeholder="https://media.cm/mjvivuhbw52x"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-gray-500">
                  Supports: media.cm URLs (https://media.cm/videoId), embed URLs (media.cm/e/videoId), or direct video files (.mp4, .webm)
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Thumbnail */}
          <Card>
            <CardHeader>
              <CardTitle>Thumbnail</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Thumbnail URL
                </label>
                <Input
                  type="url"
                  placeholder="https://..."
                  value={formData.thumbnailUrl}
                  onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                  required
                />
              </div>
              {formData.thumbnailUrl && (
                <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden">
                  <img
                    src={formData.thumbnailUrl}
                    alt="Thumbnail preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Video Details */}
          <Card>
            <CardHeader>
              <CardTitle>Video Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Title
                </label>
                <Input
                  type="text"
                  placeholder="Enter video title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-200">
                  Description
                </label>
                <Textarea
                  placeholder="Enter video description..."
                  rows={5}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Category
                  </label>
                  <Input
                    type="text"
                    placeholder="e.g., Entertainment"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-200">
                    Tags (comma separated)
                  </label>
                  <Input
                    type="text"
                    placeholder="tag1, tag2, tag3"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="published"
                  checked={formData.published}
                  onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                  className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-jil-orange focus:ring-jil-orange"
                />
                <label htmlFor="published" className="text-sm font-medium text-gray-200">
                  Publish video (make it visible to users)
                </label>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={saving}
              className="bg-jil-orange hover:bg-jil-orange/90 flex-1"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push('/admin/videos')}
              disabled={saving}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AdminLayout>
  )
}
