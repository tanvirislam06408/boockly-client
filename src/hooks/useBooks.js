import { useState, useCallback, useRef } from 'react'
import { fetchBooks, fetchByUrl } from '../services/api'

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

// Cache key: "search::topic" → { books, nextUrl, totalCount }
const pageCache = new Map()

function cacheKey(search, topic) {
  return `${search}::${topic}`
}

export function useBooks() {
  const [books, setBooks] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [error, setError] = useState(null)
  const [hasMore, setHasMore] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  // IDs of books added by the most recent loadMore call — used for scroll + animation
  const [newBookIds, setNewBookIds] = useState(new Set())

  const nextUrlRef = useRef(null)
  const currentSearchRef = useRef('')
  const currentTopicRef = useRef('')
  const abortRef = useRef(null)

  // Initial fetch (page 1) — checks cache first
  const doFetch = useCallback(async (search = '', topic = '') => {
    // Cancel any in-flight request
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    setNewBookIds(new Set())

    // Check cache
    const key = cacheKey(search, topic)
    const cached = pageCache.get(key)
    if (cached) {
      setBooks(cached.books)
      setHasMore(!!cached.nextUrl)
      setTotalCount(cached.totalCount)
      nextUrlRef.current = cached.nextUrl
      currentSearchRef.current = search
      currentTopicRef.current = topic
      setLoading(false)
      return
    }

    try {
      const data = await fetchBooks({ search, page: 1, topic })
      if (controller.signal.aborted) return

      const enriched = data.results.map(enrichBook)
      setBooks(enriched)
      setHasMore(!!data.next)
      setTotalCount(data.count)
      nextUrlRef.current = data.next || null
      currentSearchRef.current = search
      currentTopicRef.current = topic

      // Store in cache
      pageCache.set(key, {
        books: enriched,
        nextUrl: data.next || null,
        totalCount: data.count,
      })
    } catch (err) {
      if (!controller.signal.aborted) {
        setError(err.message || 'Something went wrong')
      }
    } finally {
      if (!controller.signal.aborted) setLoading(false)
    }
  }, [])

  // Load more — fetches from the stored next URL, deduplicates, tracks new IDs
  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore || !nextUrlRef.current) return

    setLoadingMore(true)
    setError(null)

    try {
      const data = await fetchByUrl(nextUrlRef.current)
      const newBooks = data.results.map(enrichBook)

      // Deduplicate and track new IDs
      const addedIds = new Set()
      setBooks((prev) => {
        const existingIds = new Set(prev.map((b) => b.id))
        const unique = newBooks.filter((b) => {
          if (existingIds.has(b.id)) return false
          addedIds.add(b.id)
          return true
        })
        return [...prev, ...unique]
      })

      // Update cache
      const key = cacheKey(currentSearchRef.current, currentTopicRef.current)
      const cached = pageCache.get(key)
      if (cached) {
        cached.nextUrl = data.next || null
      }

      setHasMore(!!data.next)
      nextUrlRef.current = data.next || null

      // Expose new IDs briefly for scroll + animation
      setNewBookIds(addedIds)
      // Clear after animation completes
      setTimeout(() => setNewBookIds(new Set()), 800)
    } catch (err) {
      setError(err.message || 'Failed to load more books')
    } finally {
      setLoadingMore(false)
    }
  }, [loadingMore, hasMore])

  const search = useCallback((query) => {
    doFetch(query, '')
  }, [doFetch])

  const filterByTopic = useCallback((topic) => {
    doFetch('', topic === 'All' ? '' : topic.toLowerCase())
  }, [doFetch])

  const searchWithTopic = useCallback((query, topic) => {
    doFetch(query, topic === 'All' ? '' : topic.toLowerCase())
  }, [doFetch])

  const reset = useCallback(() => {
    pageCache.clear()
    doFetch('', '')
  }, [doFetch])

  const retry = useCallback(() => {
    if (nextUrlRef.current && books.length > 0) {
      loadMore()
    } else {
      doFetch(currentSearchRef.current, currentTopicRef.current)
    }
  }, [loadMore, doFetch, books.length])

  return {
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
    search,
    filterByTopic,
    searchWithTopic,
    reset,
    setBooks,
  }
}
