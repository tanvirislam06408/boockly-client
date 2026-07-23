import { memo } from 'react'
import { BookOpen, ExternalLink, Clock } from 'lucide-react'
import { getLastReadBooks } from '../../services/readingProgress'
import BookSection from './BookSection'

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

const ContinueReading = memo(function ContinueReading() {
  const recentBooks = getLastReadBooks(5)

  if (recentBooks.length === 0) return null

  return (
    <BookSection title="Continue Reading" icon={Clock}>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {recentBooks.map((book) => (
          <button
            key={book.bookId}
            onClick={() => {
              if (book.readUrl) window.open(book.readUrl, '_blank', 'noopener,noreferrer')
            }}
            disabled={!book.readUrl}
            className={`flex items-center gap-3 p-3 bg-white rounded-lg transition-all duration-200 text-left group ${
              book.readUrl
                ? 'hover:bg-parchment-100 hover:shadow-card cursor-pointer'
                : 'opacity-60 cursor-not-allowed'
            }`}
          >
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
                <p className="text-xs text-parchment-500 truncate">{book.author}</p>
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
    </BookSection>
  )
})

export default ContinueReading
