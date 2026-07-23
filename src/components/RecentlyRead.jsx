import { useState, useEffect } from 'react'
import { BookOpen, Clock, ExternalLink } from 'lucide-react'
import { getLastReadBooks } from '../services/readingProgress'

function RecentlyRead() {
  const [recentBooks, setRecentBooks] = useState([])

  useEffect(() => {
    const books = getLastReadBooks(5)
    setRecentBooks(books)
  }, [])

  if (recentBooks.length === 0) {
    return null
  }

  function handleContinue(book) {
    if (book.readUrl) {
      window.open(book.readUrl, '_blank', 'noopener,noreferrer')
    }
  }

  function formatTimeAgo(timestamp) {
    if (!timestamp) return ''
    const diff = Date.now() - timestamp
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)
    const days = Math.floor(diff / 86400000)

    if (minutes < 1) return 'Just now'
    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return `${days}d ago`
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="bg-parchment-200/50 rounded-card p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-brand-500" />
            <h2 className="font-display text-lg font-semibold text-parchment-900">
              Continue Reading
            </h2>
          </div>
          <span className="text-xs text-parchment-500">
            {recentBooks.length} book{recentBooks.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {recentBooks.map((book) => (
            <button
              key={book.bookId}
              onClick={() => handleContinue(book)}
              disabled={!book.readUrl}
              className={`flex items-center gap-3 p-3 bg-white rounded-lg transition-all duration-200 text-left group ${
                book.readUrl
                  ? 'hover:bg-parchment-100 hover:shadow-card cursor-pointer'
                  : 'opacity-60 cursor-not-allowed'
              }`}
            >
              {/* Cover or placeholder */}
              {book.coverImage ? (
                <img
                  src={book.coverImage}
                  alt={book.title || `Book ${book.bookId}`}
                  className="w-10 h-14 object-cover rounded shadow-sm shrink-0"
                />
              ) : (
                <div className="w-10 h-14 bg-brand-50 rounded flex items-center justify-center shrink-0">
                  <BookOpen size={16} className="text-brand-500" />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-parchment-900 truncate">
                  {book.title || `Book #${book.bookId}`}
                </p>
                {book.author && (
                  <p className="text-xs text-parchment-500 truncate">
                    {book.author}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-0.5">
                  {book.percentage != null && (
                    <span className="text-[10px] text-olive-600 font-medium">
                      {Math.round(book.percentage * 100)}%
                    </span>
                  )}
                  {book.readFormat && (
                    <span className="text-[10px] text-parchment-400 uppercase">
                      {book.readFormat}
                    </span>
                  )}
                  {book.timestamp && (
                    <span className="text-[10px] text-parchment-400">
                      {formatTimeAgo(book.timestamp)}
                    </span>
                  )}
                </div>
              </div>

              <ExternalLink
                size={14}
                className="text-parchment-300 group-hover:text-brand-500 transition-colors shrink-0"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default RecentlyRead
