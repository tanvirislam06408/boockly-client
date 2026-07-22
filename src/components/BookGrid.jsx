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

function BookGrid({ books, loading, onOpenDetails, onDownload }) {
  const isEmpty = !loading && books.length === 0
  const skeletonCount = 8

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-5 lg:gap-6">
        {loading
          ? Array.from({ length: skeletonCount }).map((_, i) => (
              <SkeletonCard key={i} />
            ))
          : books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onOpenDetails={onOpenDetails}
                onDownload={onDownload}
              />
            ))}
      </div>

      {isEmpty && (
        <div className="text-center py-20">
          <p className="font-display text-lg text-parchment-600 mb-1">No books found.</p>
          <p className="text-sm text-parchment-500">Try a different search or category.</p>
        </div>
      )}
    </section>
  )
}

export default BookGrid
