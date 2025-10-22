import Link from 'next/link'
import Image from 'next/image'
import { formatDuration, formatViews, formatDate } from '@/lib/utils'

interface VideoCardProps {
  id: string
  title: string
  thumbnail: string
  duration?: number
  views: number
  createdAt: Date
}

export function VideoCard({ id, title, thumbnail, duration, views, createdAt }: VideoCardProps) {
  return (
    <Link href={`/watch/${id}`} className="group">
      <div className="relative aspect-video bg-gray-900 rounded-lg overflow-hidden mb-2">
        <Image
          src={thumbnail}
          alt={title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {duration && (
          <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
            {formatDuration(duration)}
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors" />
      </div>
      <div>
        <h3 className="font-semibold text-white group-hover:text-jil-orange transition line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="text-sm text-gray-400">
          {formatViews(views)} views • {formatDate(createdAt)}
        </p>
      </div>
    </Link>
  )
}
