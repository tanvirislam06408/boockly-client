import { useState, useEffect, useCallback, memo } from 'react'
import { Flame } from 'lucide-react'
import { fetchTrendingBooks } from '../../services/api'
import BookSection from './BookSection'
import BookCard from './BookCard'

const TrendingBooks = memo(function TrendingBooks({ onOpenDetails }) {
  const [books, setBooks] = useState([])
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchTrendingBooks()
      setBooks(data.books)
      setTopic(data.topic)
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
      title="Trending Now"
      subtitle={topic ? `Hot in ${topic.charAt(0).toUpperCase() + topic.slice(1)}` : undefined}
      icon={Flame}
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

export default TrendingBooks
