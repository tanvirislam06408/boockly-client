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
      className="book-card group flex h-full w-full cursor-pointer flex-col text-left"
    >
      {/* Cover image */}
      <div className="relative aspect-[2/3] w-full shrink-0 overflow-hidden rounded-t-card">
        {book.coverImage ? (
          <img
            src={book.coverImage}
            alt={`Cover of ${book.title}`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
            width="180"
            height="270"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-parchment-300/40">
            <span className="px-4 text-center text-xs text-parchment-400">{book.title}</span>
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
            className="absolute top-2 right-2 cursor-not-allowed rounded-lg bg-parchment-900/30 p-2
                       text-parchment-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100"
          >
            <Download size={15} />
          </span>
        )}

        {/* Category badge */}
        <span className="badge absolute bottom-2 left-2 max-w-[80%] truncate bg-parchment-100/90 backdrop-blur-sm">
          {book.category}
        </span>
      </div>

      {/* Content — flex-1 so it fills remaining card height, justify-between pins rating to the bottom */}
      <div className="flex flex-1 flex-col justify-between gap-1.5 p-3.5">
        <div className="space-y-1">
          <h3 className="line-clamp-2 min-h-[2.5em] font-display text-sm font-semibold leading-snug text-parchment-900">
            {book.title}
          </h3>

          <p className="truncate text-xs text-parchment-700">
            {book.author}
          </p>
        </div>

        {/* Always reserves its row height, even with no rating yet, so cards stay aligned */}
        <div className="flex h-[18px] items-center gap-1.5">
          {hasRating ? (
            <>
              <RatingStars rating={book.rating} size={12} />
              <span className="text-[11px] text-parchment-600">
                ({book.totalRatings.toLocaleString()})
              </span>
            </>
          ) : (
            <span className="text-[11px] text-parchment-400">No ratings yet</span>
          )}
        </div>
      </div>
    </button>
  )
})

export default BookCard