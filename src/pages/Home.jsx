import { useState, useEffect, useCallback, useRef } from 'react'
import { AlertTriangle, RefreshCw } from 'lucide-react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CategoryFilter from '../components/CategoryFilter'
import BookGrid from '../components/BookGrid'
import BookDetailsModal from '../components/BookDetailsModal'
import RecentlyRead from '../components/RecentlyRead'
import Footer from '../components/Footer'
import { fetchBooks } from '../services/api'

// Generate a stable mock rating per book ID for visual purposes (not persisted)
function generateMockRating(bookId) {
  const hash = ((bookId * 2654435761) >>> 0) % 1000
  return {
    rating: Math.round(((hash / 1000) * 4 + 1) * 10) / 10, // 1.0 – 5.0
    totalRatings: (hash % 2000) + 50,
  }
}

function Home() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  // Category state — maps to Gutendex topic param
  const [activeCategory, setActiveCategory] = useState('All')

  // Modal state
  const [selectedBook, setSelectedBook] = useState(null)

  // Debounce timer ref
  const debounceRef = useRef(null)

  // Fetch books from Gutendex
  const doFetch = useCallback(async (search, page = 1) => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBooks({ search, page })
      // Attach local mock ratings
      const withRatings = data.results.map((book) => ({
        ...book,
        ...generateMockRating(book.id),
      }))
      setBooks(withRatings)
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }, [])

  // Initial fetch
  useEffect(() => {
    doFetch('')
  }, [doFetch])

  // Debounced search — refetch from API when search changes
  useEffect(() => {
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      doFetch(appliedSearch)
    }, 400)
    return () => clearTimeout(debounceRef.current)
  }, [appliedSearch, doFetch])

  // Category filter — Gutendex topic param
  useEffect(() => {
    const topic = activeCategory === 'All' ? '' : activeCategory.toLowerCase()
    doFetch(topic || appliedSearch)
  }, [activeCategory, doFetch, appliedSearch])

  // Optimistic local rating update
  const handleRate = useCallback((bookId, ratingValue) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id !== bookId) return book
        const newTotalRatings = book.totalRatings + 1
        const newRating =
          (book.rating * book.totalRatings + ratingValue) / newTotalRatings
        return {
          ...book,
          rating: Math.round(newRating * 10) / 10,
          totalRatings: newTotalRatings,
        }
      })
    )

    setSelectedBook((prev) => {
      if (!prev || prev.id !== bookId) return prev
      const newTotalRatings = prev.totalRatings + 1
      const newRating =
        (prev.rating * prev.totalRatings + ratingValue) / newTotalRatings
      return {
        ...prev,
        rating: Math.round(newRating * 10) / 10,
        totalRatings: newTotalRatings,
      }
    })
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={setAppliedSearch}
      />
      <CategoryFilter
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className="flex-1">
        <RecentlyRead />
        {error && !loading ? (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mb-4">
              <AlertTriangle size={22} className="text-red-400" />
            </div>
            <p className="font-display text-lg text-parchment-800 mb-1">
              Couldn't load books
            </p>
            <p className="text-sm text-parchment-600 mb-5">{error}</p>
            <button
              onClick={() => doFetch(appliedSearch)}
              className="btn-primary inline-flex items-center gap-2"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        ) : (
          <BookGrid
            books={books}
            loading={loading}
            onOpenDetails={setSelectedBook}
          />
        )}
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
