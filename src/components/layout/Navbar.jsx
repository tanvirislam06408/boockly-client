import { Link, useLocation } from 'react-router-dom'
import { BookOpen } from 'lucide-react'

function Navbar() {
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-40 bg-parchment-100/80 backdrop-blur-md border-b border-parchment-300/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-semibold text-parchment-900">
          <BookOpen size={20} className="text-brand-500" />
          Bookly
        </Link>

        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors duration-150 ${
              location.pathname === '/'
                ? 'bg-brand-500/10 text-brand-600'
                : 'text-parchment-700 hover:text-parchment-900 hover:bg-parchment-200'
            }`}
          >
            Home
          </Link>
          {/* <Link
            to="/admin"
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors duration-150 ${
              location.pathname === '/admin'
                ? 'bg-brand-500/10 text-brand-600'
                : 'text-parchment-500 hover:text-parchment-700 hover:bg-parchment-200'
            }`}
          >
            Admin
          </Link> */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
