import { Download } from 'lucide-react'
import RatingStars from './RatingStars'

function BookCard({ book, onOpenDetails, onDownload }) {
  function handleDownload(e) {
    e.stopPropagation()
    onDownload?.(book)
  }

  return (
    <button
      type="button"
      onClick={() => onOpenDetails?.(book)}
      className="book-card text-left w-full group cursor-pointer"
    >
      {/* Cover image */}
      <div className="relative aspect-[2/3] overflow-hidden rounded-t-card">
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Download button — top-right overlay */}
        <span
          onClick={handleDownload}
          className="absolute top-2 right-2 p-2 rounded-lg bg-parchment-900/60 text-white
                     opacity-0 group-hover:opacity-100 transition-opacity duration-200
                     hover:bg-parchment-900/80 backdrop-blur-sm"
        >
          <Download size={15} />
        </span>

        {/* Category badge */}
        <span className="absolute bottom-2 left-2 badge bg-parchment-100/90 backdrop-blur-sm">
          {book.category}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 space-y-1.5">
        <h3 className="font-display font-semibold text-parchment-900 text-sm leading-snug line-clamp-2">
          {book.title}
        </h3>

        <p className="text-parchment-600 text-xs truncate">
          {book.author}
        </p>

        {/* Rating row */}
        <div className="flex items-center gap-1.5 pt-0.5">
          <RatingStars rating={book.rating} size={12} />
          <span className="text-parchment-500 text-[11px]">
            ({book.totalRatings.toLocaleString()})
          </span>
        </div>
      </div>
    </button>
  )
}

export default BookCard
