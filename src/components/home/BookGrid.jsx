import { memo, useRef, useCallback, useEffect } from 'react'
import { AlertTriangle, RefreshCw, BookX, PartyPopper, Loader2 } from 'lucide-react'
import BookCard from './BookCard'

function SkeletonCard() {
  return (
    <div className="book-card animate-pulse">
      <div className="aspect-[2/3] bg-parchment-300/50 rounded-t-card" />
      <div className="p-4 space-y-2">
        <div className="h-4 bg-parchment-300/50 rounded w-3/4" />
        <div className="h-3 bg-parchment-300/40 rounded w-1/2" />
        <div className="h-3 bg-parchment-300/30 rounded w-1/3 pt-1" />
      </div>
    </div>
  )
}

const BookGrid = memo(function BookGrid({
  books,
  loading,
  loadingMore,
  error,
  hasMore,
  totalCount,
  newBookIds,
  onOpenDetails,
  onLoadMore,
  onRetry,
}) {
  const isEmpty = !loading && books.length === 0
  const skeletonCount = 8
  const loadMoreSkeletonCount = 5

  // Ref to the first newly loaded card for smooth scrolling
  const firstNewRef = useRef(null)

  // Smooth scroll to newly loaded books
  useEffect(() => {
    if (newBookIds.size > 0 && firstNewRef.current) {
      // Small delay to let the DOM render
      const timer = setTimeout(() => {
        firstNewRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
        })
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [newBookIds])

  // Loading skeleton (initial load)
  if (loading) {
    return (
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
          {Array.from({ length: skeletonCount }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      </section>
    )
  }

  // Error state (only when no books are loaded yet)
  if (error && books.length === 0) {
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
          onClick={onRetry}
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
      {/* Book count */}
      {totalCount > 0 && (
        <p className="text-xs text-parchment-500 mb-4">
          Showing {books.length} of {totalCount.toLocaleString()} books
        </p>
      )}

      {/* Book grid + loading-more skeletons */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            onOpenDetails={onOpenDetails}
            isNew={newBookIds.has(book.id)}
            ref={newBookIds.has(book.id) && !firstNewRef.current ? firstNewRef : undefined}
          />
        ))}

        {/* Skeleton cards while loading more */}
        {loadingMore &&
          Array.from({ length: loadMoreSkeletonCount }).map((_, i) => (
            <SkeletonCard key={`skeleton-${i}`} />
          ))}
      </div>

      {/* Inline error when loading more fails */}
      {error && books.length > 0 && (
        <div className="flex flex-col items-center gap-3 py-6 mt-4 bg-red-50/50 rounded-lg border border-red-100">
          <p className="text-sm text-red-600">{error}</p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium
                       text-red-700 bg-white border border-red-200 rounded-lg
                       hover:bg-red-50 transition-colors"
          >
            <RefreshCw size={14} />
            Try again
          </button>
        </div>
      )}

      {/* Load More button — hidden while loading more (skeletons show instead) */}
      {hasMore && !loadingMore && (
        <div className="flex justify-center pt-8">
          <button
            onClick={onLoadMore}
            className="btn-primary inline-flex items-center gap-2 px-8 py-3 text-base"
          >
            Load More
          </button>
        </div>
      )}

      {/* Loading more indicator (minimal text below skeletons) */}
      {loadingMore && (
        <div className="flex justify-center pt-6">
          <div className="flex items-center gap-2 text-parchment-400">
            <Loader2 size={14} className="animate-spin" />
            <span className="text-xs">Loading more...</span>
          </div>
        </div>
      )}

      {/* End of library */}
      {!hasMore && books.length > 0 && !loadingMore && (
        <div className="flex flex-col items-center gap-2 pt-8 pb-4 text-center">
          <PartyPopper size={24} className="text-brand-400" />
          <p className="text-sm font-medium text-parchment-700">
            You've reached the end of the library.
          </p>
          <p className="text-xs text-parchment-400">
            Try a different search or category to discover more books.
          </p>
        </div>
      )}
    </section>
  )
})

export default BookGrid
