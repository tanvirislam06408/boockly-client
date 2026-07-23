import { useState, useCallback, useMemo, useEffect } from 'react'
import Navbar from '../components/layout/Navbar'
import Footer from '../components/layout/Footer'
import ErrorBoundary from '../components/ErrorBoundary'
import Hero from '../components/home/Hero'
import CategoryFilter from '../components/home/CategoryFilter'
import BookGrid from '../components/home/BookGrid'
import BookDetailsModal from '../components/BookDetailsModal'
import ContinueReading from '../components/home/ContinueReading'
import RecentlyViewed from '../components/home/RecentlyViewed'
import PopularBooks from '../components/home/PopularBooks'
import TrendingBooks from '../components/home/TrendingBooks'
import RecommendedBooks from '../components/home/RecommendedBooks'
import { useBooks } from '../hooks/useBooks'
import { useLocalStorage } from '../hooks/useLocalStorage'

function Home() {
  // Book data from API
  const {
    books,
    loading,
    loadingMore,
    error,
    hasMore,
    totalCount,
    newBookIds,
    doFetch,
    loadMore,
    retry,
    setBooks,
  } = useBooks()

  // UI state
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')
  const [sortBy, setSortBy] = useState('default')
  const [selectedBook, setSelectedBook] = useState(null)

  // Recently viewed tracking
  const [recentlyViewed, setRecentlyViewed] = useLocalStorage('boockly_recently_viewed', [])

  // Initial fetch
  useEffect(() => {
    doFetch('')
  }, [doFetch])

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppliedSearch(searchTerm)
    }, 350)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Refetch when search or category changes (resets to page 1)
  useEffect(() => {
    const topic = activeCategory === 'All' ? '' : activeCategory.toLowerCase()
    doFetch(appliedSearch, topic)
  }, [appliedSearch, activeCategory, doFetch])

  // Track recently viewed when book is opened
  const handleOpenDetails = useCallback((book) => {
    setSelectedBook(book)
    setRecentlyViewed((prev) => {
      const filtered = prev.filter((id) => id !== book.id)
      return [book.id, ...filtered].slice(0, 20)
    })
  }, [setRecentlyViewed])

  // Client-side sorting
  const sortedBooks = useMemo(() => {
    if (sortBy === 'default') return books
    const sorted = [...books]
    switch (sortBy) {
      case 'title-asc':
        return sorted.sort((a, b) => a.title.localeCompare(b.title))
      case 'title-desc':
        return sorted.sort((a, b) => b.title.localeCompare(a.title))
      case 'author-asc':
        return sorted.sort((a, b) => a.author.localeCompare(b.author))
      default:
        return sorted
    }
  }, [books, sortBy])

  // Optimistic rating update
  const handleRate = useCallback((bookId, ratingValue) => {
    const updateBook = (book) => {
      if (book.id !== bookId) return book
      const newTotalRatings = book.totalRatings + 1
      const newRating = (book.rating * book.totalRatings + ratingValue) / newTotalRatings
      return {
        ...book,
        rating: Math.round(newRating * 10) / 10,
        totalRatings: newTotalRatings,
      }
    }

    setBooks((prev) => prev.map(updateBook))
    setSelectedBook((prev) => {
      if (!prev || prev.id !== bookId) return prev
      return updateBook(prev)
    })
  }, [setBooks])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <Hero
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={setAppliedSearch}
      />

      <div className="flex-1">
        {/* Personalized sections */}
        <ErrorBoundary fallbackMessage="Couldn't load your reading history.">
          <ContinueReading />
        </ErrorBoundary>

        {/* Discovery sections */}
        <ErrorBoundary fallbackMessage="Couldn't load popular books.">
          <PopularBooks onOpenDetails={handleOpenDetails} />
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Couldn't load trending books.">
          <TrendingBooks onOpenDetails={handleOpenDetails} />
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Couldn't load recently viewed books.">
          <RecentlyViewed onOpenDetails={handleOpenDetails} />
        </ErrorBoundary>

        <ErrorBoundary fallbackMessage="Couldn't load recommendations.">
          <RecommendedBooks onOpenDetails={handleOpenDetails} />
        </ErrorBoundary>

        {/* Divider before main grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <div className="border-t border-parchment-300/60" />
        </div>

        {/* Category filter + Sort */}
        <CategoryFilter
          activeCategory={activeCategory}
          onSelect={setActiveCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />

        {/* Main book grid with Load More */}
        <BookGrid
          books={sortedBooks}
          loading={loading}
          loadingMore={loadingMore}
          error={error}
          hasMore={hasMore}
          totalCount={totalCount}
          newBookIds={newBookIds}
          onOpenDetails={handleOpenDetails}
          onLoadMore={loadMore}
          onRetry={retry}
        />
      </div>

      <Footer />

      <BookDetailsModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onRate={handleRate}
      />
    </div>
  )
}

export default Home
