import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Clock } from 'lucide-react'
import { getLastReadBooks } from '../services/readingProgress'

function RecentlyRead() {
  const [recentBooks, setRecentBooks] = useState([])
  const navigate = useNavigate()

  useEffect(() => {
    const books = getLastReadBooks(5)
    setRecentBooks(books)
  }, [])

  if (recentBooks.length === 0) {
    return null
  }

  return (
    <div className="bg-parchment-200/50 rounded-card p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Clock size={18} className="text-brand-500" />
        <h2 className="font-display text-lg font-semibold text-parchment-900">
          Continue Reading
        </h2>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recentBooks.map((book) => (
          <button
            key={book.bookId}
            onClick={() => {
              // Note: We don't have the book URL stored in progress
              // This is a limitation - in a real app, you'd store the URL too
              console.log('Continue reading book:', book.bookId)
            }}
            className="flex items-center gap-3 p-3 bg-white rounded-lg hover:bg-parchment-100 transition-colors text-left"
          >
            <div className="w-10 h-10 bg-brand-100 rounded-lg flex items-center justify-center">
              <BookOpen size={18} className="text-brand-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-parchment-900 truncate">
                Book #{book.bookId}
              </p>
              <p className="text-xs text-parchment-500">
                {book.percentage ? `${Math.round(book.percentage * 100)}% complete` : 'Started'}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default RecentlyRead