import { useEffect, useRef, useCallback } from 'react'

export function useInfiniteScroll(callback, { enabled = true, rootMargin = '200px' } = {}) {
  const sentinelRef = useRef(null)
  const callbackRef = useRef(callback)
  callbackRef.current = callback

  const handleIntersect = useCallback((entries) => {
    const [entry] = entries
    if (entry.isIntersecting) {
      callbackRef.current()
    }
  }, [])

  useEffect(() => {
    if (!enabled || !sentinelRef.current) return

    const observer = new IntersectionObserver(handleIntersect, {
      root: null,
      rootMargin,
      threshold: 0,
    })

    observer.observe(sentinelRef.current)

    return () => observer.disconnect()
  }, [enabled, handleIntersect, rootMargin])

  return sentinelRef
}
