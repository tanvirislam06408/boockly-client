import { memo } from 'react'
import { Download } from 'lucide-react'
import RatingStars from '../RatingStars'

const BookCard = memo(function BookCard({ book, onOpenDetails }) {
  const hasRating = book.rating > 0
  const hasDownload = !!book.downloadUrl

  return (
    <button
      type="button"
      onClick={() => onOpenDetails?.(book)}
      className="book-card text-left w-full group cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-card">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-parchment-300/40 flex items-center justify-center">
            <span className="text-parchment-400 text-xs text-center px-4">{book.title}</span>
          </div>
        )}

        {/* Download overlay */}
        {hasDownload ? (
          <a
            href={book.downloadUrl}
            target="_blank"
            rel="noopener noreferrer"
            download
            onClick={(e) => e.stopPropagation()}
            aria-label={`Download ${book.title}`}
            className="absolute top-2 right-2 p-2 rounded-lg bg-parchment-900/60 text-white
                       opacity-0 group-hover:opacity-100 transition-opacity duration-200
                       hover:bg-parchment-900/80 backdrop-blur-sm"
          >
            <Download size={15} />
          </a>
        ) : (
          <span
            aria-label="No file available"
            className="absolute top-2 right-2 p-2 rounded-lg bg-parchment-900/30 text-parchment-400
                       cursor-not-allowed opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          >
            <Download size={15} />
          </span>
        )}

        {/* Category badge */}
        <span className="absolute bottom-2 left-2 badge bg-parchment-100/90 backdrop-blur-sm">
          {book.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-3.5 space-y-1">
        <h3 className="font-display font-semibold text-parchment-900 text-sm leading-snug line-clamp-2">
          {book.title}
        </h3>

        <p className="text-parchment-700 text-xs truncate">
          {book.author}
        </p>

        {hasRating && (
          <div className="flex items-center gap-1.5 pt-0.5">
            <RatingStars rating={book.rating} size={12} />
            <span className="text-parchment-600 text-[11px]">
              ({book.totalRatings.toLocaleString()})
            </span>
          </div>
        )}
      </div>
    </button>
  )
})

export default BookCard
