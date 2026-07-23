import { useState, useCallback, useRef } from 'react'
import { fetchBooks } from '../services/api'

// Stable mock rating per book ID
function generateMockRating(bookId) {
  const hash = ((bookId * 2654435761) >>> 0) % 1000
  return {
    rating: Math.round(((hash / 1000) * 4 + 1) * 10) / 10,
    totalRatings: (hash % 2000) + 50,
  }
}

function enrichBook(book) {
  return { ...book, ...generateMockRating(book.id) }
}

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)

  const currentPageRef = useRef(1)
  const currentSearchRef = useRef('')
  const currentTopicRef = useRef('')

  const doFetch = useCallback(async (search = '', topic = '', page = 1, append = false) => {
    if (page === 1) {
      setLoading(true)
    } else {
      setLoadingMore(true)
    }
    setError(null)

    try {
      const data = await fetchBooks({ search, page, topic })
      const enriched = data.results.map(enrichBook)

      setBooks((prev) => (append ? [...prev, ...enriched] : enriched))
      setHasMore(!!data.next)
      setTotalCount(data.count)
      currentPageRef.current = page
      currentSearchRef.current = search
      currentTopicRef.current = topic
    } catch (err) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }, [])

  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore) return
    doFetch(currentSearchRef.current, currentTopicRef.current, currentPageRef.current + 1, true)
  }, [loadingMore, hasMore, doFetch])

  const search = useCallback((query) => {
    doFetch(query, '', 1, false)
  }, [doFetch])

  const filterByTopic = useCallback((topic) => {
    doFetch('', topic === 'All' ? '' : topic.toLowerCase(), 1, false)
  }, [doFetch])

  const searchWithTopic = useCallback((query, topic) => {
    doFetch(query, topic === 'All' ? '' : topic.toLowerCase(), 1, false)
  }, [doFetch])

  const reset = useCallback(() => {
    doFetch('', '', 1, false)
  }, [doFetch])

  return {
    books,
    loading,
    loadingMore,
    error,
    hasMore,
    totalCount,
    doFetch,
    loadMore,
    search,
    filterByTopic,
    searchWithTopic,
    reset,
    setBooks,
  }
}
