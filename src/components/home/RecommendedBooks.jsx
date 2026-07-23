import { useState, useEffect, memo } from 'react'
import { Sparkles } from 'lucide-react'
import { fetchRecommendedBooks } from '../../services/api'
import BookSection from './BookSection'
import BookCard from './BookCard'

function generateMockRating(bookId) {
  const hash = ((bookId * 2654435761) >>> 0) % 1000
  return {
    rating: Math.round(((hash / 1000) * 4 + 1) * 10) / 10,
    totalRatings: (hash % 2000) + 50,
  }
}

const RecommendedBooks = memo(function RecommendedBooks({ onOpenDetails }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await fetchRecommendedBooks()
        if (!cancelled) {
          setBooks(data.map((b) => ({ ...b, ...generateMockRating(b.id) })))
          setLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message)
          setLoading(false)
        }
      }
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <BookSection
      title="Recommended for You"
      subtitle="Curated picks across genres"
      icon={Sparkles}
      loading={loading}
      error={error}
      onRetry={() => window.location.reload()}
    >
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
        {books.map((book) => (
          <div key={book.id} className="shrink-0 w-[160px] sm:w-[180px]">
            <BookCard book={book} onOpenDetails={onOpenDetails} />
          </div>
        ))}
      </div>
    </BookSection>
  )
})

export default RecommendedBooks
