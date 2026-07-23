import { AlertTriangle, RefreshCw, BookX } from 'lucide-react'
import BookCard from './BookCard'

function BookGrid({ books, loading, loadingMore, error, hasMore, onOpenDetails, onLoadMore, sentinelRef }) {
  const isEmpty = !loading && books.length === 0
  const skeletonCount = 8

  // Loading skeleton
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <div key={i} className="book-card animate-pulse">
              <div className="aspect-[2/3] bg-parchment-300/50 rounded-t-card" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-parchment-300/50 rounded w-3/4" />
                <div className="h-3 bg-parchment-300/40 rounded w-1/2" />
                <div className="h-3 bg-parchment-300/30 rounded w-1/3 pt-1" />
              </div>
            </div>
          ))}
        </div>
      </section>
    )
  }

  // Error state
  if (error) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
          <AlertTriangle size={22} className="text-red-400" />
        </div>
        <p className="font-display text-lg text-parchment-800 mb-1">
          Couldn't load books
        </p>
        <p className="text-sm text-parchment-600 mb-5">{error}</p>
        <button
          onClick={onLoadMore}
          className="btn-primary inline-flex items-center gap-2"
        >
          <RefreshCw size={15} />
          Try again
        </button>
      </section>
    )
  }

  // Empty state
  if (isEmpty) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-parchment-200 mb-4">
          <BookX size={22} className="text-parchment-400" />
        </div>
        <p className="font-display text-lg text-parchment-800 mb-1">No books found</p>
        <p className="text-sm text-parchment-600">Try a different search or category.</p>
      </section>
    )
  }

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onOpenDetails={onOpenDetails}
          />
        ))}
      </div>

      {/* Loading more indicator */}
      {loadingMore && (
        <div className="flex justify-center py-8">
          <div className="flex items-center gap-2 text-parchment-500">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-brand-500" />
            <span className="text-sm">Loading more books...</span>
          </div>
        </div>
      )}

      {/* Infinite scroll sentinel */}
      {hasMore && !loadingMore && (
        <div ref={sentinelRef} className="h-4" aria-hidden="true" />
      )}

      {/* End of list */}
      {!hasMore && books.length > 0 && (
        <div className="text-center py-8">
          <p className="text-sm text-parchment-400">You've reached the end</p>
        </div>
      )}
    </section>
  )
}

export default BookGrid
