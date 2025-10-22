import Link from 'next/link'
import { Home, Video, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface AdminLayoutProps {
  children: React.ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-jil-black text-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-jil-darker border-r border-gray-800 p-4">
        <div className="mb-8">
          <Link href="/admin">
            <h1 className="text-2xl font-bold">
              <span className="text-white">Jil</span>
              <span className="text-jil-orange">Hub</span>
              <span className="text-sm text-gray-400 ml-2">Studio</span>
            </h1>
          </Link>
        </div>

        <nav className="space-y-2">
          <Link href="/admin">
            <Button variant="ghost" className="w-full justify-start">
              <Home className="w-5 h-5 mr-3" />
              Dashboard
            </Button>
          </Link>
          <Link href="/admin/videos">
            <Button variant="ghost" className="w-full justify-start">
              <Video className="w-5 h-5 mr-3" />
              Videos
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="w-5 h-5 mr-3" />
              Settings
            </Button>
          </Link>
        </nav>

        <div className="absolute bottom-4 left-4 right-4">
          <form action="/api/auth/signout" method="post">
            <Button variant="ghost" className="w-full justify-start text-red-400 hover:text-red-300">
              <LogOut className="w-5 h-5 mr-3" />
              Sign Out
            </Button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="ml-64 p-8">
        {children}
      </main>
    </div>
  )
}
