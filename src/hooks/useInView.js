import { useState, useRef, useEffect, useCallback } from 'react'

/**
 * IntersectionObserver hook — triggers once when element enters viewport.
 * Returns [ref, isInView]. The ref should be attached to the target element.
 */
export function useInView({ rootMargin = '200px', threshold = 0 } = {}) {
  const [isInView, setIsInView] = useState(false)
  const ref = useRef(null)
  const hasTriggered = useRef(false)

  const setRef = useCallback((node) => {
    ref.current = node
  }, [])

  useEffect(() => {
    if (!ref.current || hasTriggered.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasTriggered.current = true
          setIsInView(true)
          observer.disconnect()
        }
      },
      { rootMargin, threshold }
    )

    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [rootMargin, threshold])

  return [setRef, isInView]
}
