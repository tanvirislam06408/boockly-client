import { useState, useEffect, useCallback, memo } from 'react'
import { Sparkles } from 'lucide-react'
import { fetchRecommendedBooks } from '../../services/api'
import BookSection from './BookSection'
import BookCard from './BookCard'

const RecommendedBooks = memo(function RecommendedBooks({ onOpenDetails }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchRecommendedBooks()
      setBooks(data)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    load()
  }, [load])

  return (
    <BookSection
      title="Recommended for You"
      subtitle="Curated picks across genres"
      icon={Sparkles}
      loading={loading}
      error={error}
      onRetry={load}
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
