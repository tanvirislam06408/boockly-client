import { Link } from 'react-router-dom'
import { BookX } from 'lucide-react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-parchment-200 mb-5">
            <BookX size={28} className="text-parchment-500" />
          </div>
          <h1 className="font-display text-4xl font-bold text-parchment-900 mb-2">Page not found</h1>
          <p className="text-parchment-700 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link to="/" className="btn-primary inline-flex items-center gap-2">
            Back to Library
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default NotFound
