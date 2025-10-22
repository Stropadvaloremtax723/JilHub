import Link from 'next/link'
import { Search, Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-jil-black border-b border-gray-800">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="lg:hidden">
              <Menu className="w-6 h-6" />
            </Button>
            <Link href="/">
              <h1 className="text-2xl font-bold">
                <span className="text-white">Jil</span>
                <span className="text-jil-orange">Hub</span>
              </h1>
            </Link>
          </div>

          <div className="flex-1 max-w-2xl mx-4 hidden md:block">
            <div className="relative">
              <input
                type="text"
                placeholder="Search videos..."
                className="w-full bg-jil-darker border border-gray-700 rounded-full px-4 py-2 pr-10 focus:outline-none focus:border-jil-orange"
              />
              <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-jil-orange hover:bg-jil-orange/90 rounded-full p-2">
                <Search className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Link href="/admin">
              <Button variant="outline">
                Admin Panel
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
