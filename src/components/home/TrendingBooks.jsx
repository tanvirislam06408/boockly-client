import { useState, useEffect, useCallback, memo } from 'react'
import { Flame } from 'lucide-react'
import { fetchTrendingBooks } from '../../services/api'
import { useInView } from '../../hooks/useInView'
import BookSection from './BookSection'
import BookCard from './BookCard'

const TrendingBooks = memo(function TrendingBooks({ onOpenDetails }) {
  const [books, setBooks] = useState([])
  const [topic, setTopic] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ref, isInView] = useInView({ rootMargin: '300px' })

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
    if (isInView) load()
  }, [isInView, load])

  return (
    <div ref={ref}>
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
    </div>
  )
})

export default TrendingBooks
