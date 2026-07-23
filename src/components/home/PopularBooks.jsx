import { useState, useEffect, useCallback, memo } from 'react'
import { TrendingUp } from 'lucide-react'
import { fetchPopularBooks } from '../../services/api'
import BookSection from './BookSection'
import BookCard from './BookCard'

const PopularBooks = memo(function PopularBooks({ onOpenDetails }) {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPopularBooks()
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
      title="Popular Books"
      subtitle="Most downloaded from Project Gutenberg"
      icon={TrendingUp}
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

export default PopularBooks
