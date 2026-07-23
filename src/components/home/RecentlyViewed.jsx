import { useState, useEffect, memo } from 'react'
import { History } from 'lucide-react'
import { fetchBooksByIds } from '../../services/api'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { useInView } from '../../hooks/useInView'
import BookSection from './BookSection'
import BookCard from './BookCard'

const RecentlyViewed = memo(function RecentlyViewed({ onOpenDetails }) {
  const [viewedIds] = useLocalStorage('boockly_recently_viewed', [])
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [ref, isInView] = useInView({ rootMargin: '300px' })

  useEffect(() => {
    if (!isInView || viewedIds.length === 0) return

    let cancelled = false

    async function load() {
      setLoading(true)
      try {
        const data = await fetchBooksByIds(viewedIds.slice(0, 8))
        if (!cancelled) {
          setBooks(data)
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
  }, [isInView, viewedIds])

  if (viewedIds.length === 0) return null

  return (
    <div ref={ref}>
      <BookSection
        title="Recently Viewed"
        icon={History}
        loading={loading}
        error={error}
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

export default RecentlyViewed
