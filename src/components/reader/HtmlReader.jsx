import { useState, useEffect, useRef, useCallback } from 'react'
import { ExternalLink, AlertTriangle, RefreshCw } from 'lucide-react'

/**
 * HtmlReader - Attempts to embed Gutendex HTML content in an iframe.
 * Falls back to opening in a new tab if embedding is blocked by CORS/CSP/X-Frame-Options.
 */
function HtmlReader({ url, theme, onLoad }) {
  const [loadState, setLoadState] = useState('loading') // loading | loaded | blocked | error
  const [iframeBlocked, setIframeBlocked] = useState(false)
  const iframeRef = useRef(null)
  const loadTimeoutRef = useRef(null)

  useEffect(() => {
    if (!url) {
      setLoadState('error')
      return
    }

    setLoadState('loading')
    setIframeBlocked(false)

    // Set a timeout — if iframe doesn't fire onLoad within 8s, assume blocked
    loadTimeoutRef.current = setTimeout(() => {
      if (loadState === 'loading') {
        setLoadState('blocked')
        setIframeBlocked(true)
      }
    }, 8000)

    return () => {
      if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current)
    }
  }, [url])

  const handleIframeLoad = useCallback(() => {
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current)

    // Check if iframe content is accessible (CORS check)
    try {
      const iframe = iframeRef.current
      if (iframe && iframe.contentDocument) {
        // Content is accessible — iframe loaded successfully
        setLoadState('loaded')
        onLoad?.()
      } else {
        // ContentDocument is null — CORS blocked
        setLoadState('blocked')
        setIframeBlocked(true)
      }
    } catch {
      // Cross-origin — blocked
      setLoadState('blocked')
      setIframeBlocked(true)
    }
  }, [onLoad])

  const handleIframeError = useCallback(() => {
    if (loadTimeoutRef.current) clearTimeout(loadTimeoutRef.current)
    setLoadState('error')
  }, [])

  const openInNewTab = () => {
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const retryLoad = () => {
    setLoadState('loading')
    setIframeBlocked(false)
    // Force iframe reload by changing key
    if (iframeRef.current) {
      iframeRef.current.src = url
    }
  }

  // Theme-based background
  const bgClass = theme === 'dark'
    ? 'bg-parchment-900'
    : theme === 'sepia'
      ? 'bg-[#F5EDE3]'
      : 'bg-white'

  // Loading state
  if (loadState === 'loading' && !iframeBlocked) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${bgClass}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4" />
          <p className={theme === 'dark' ? 'text-parchment-300' : 'text-parchment-600'}>
            Loading book content...
          </p>
        </div>
      </div>
    )
  }

  // Blocked state — offer new tab
  if (loadState === 'blocked' || iframeBlocked) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${bgClass}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 ${
            theme === 'dark' ? 'bg-parchment-800' : 'bg-brand-50'
          }`}>
            <AlertTriangle size={28} className="text-brand-500" />
          </div>

          <h3 className={`font-display text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-parchment-100' : 'text-parchment-900'
          }`}>
            Embedding Blocked
          </h3>

          <p className={`text-sm mb-6 leading-relaxed ${
            theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'
          }`}>
            This book's content can't be displayed inside the app due to browser
            security restrictions (CORS / X-Frame-Options). You can still read it
            by opening it in a new browser tab.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openInNewTab}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <ExternalLink size={16} />
              Open in New Tab
            </button>

            <button
              onClick={retryLoad}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-parchment-800 text-parchment-200 hover:bg-parchment-700'
                  : 'bg-parchment-200 text-parchment-700 hover:bg-parchment-300'
              }`}
            >
              <RefreshCw size={16} />
              Try Again
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (loadState === 'error') {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${bgClass}`}>
        <div className="text-center max-w-md mx-auto p-8">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
            <AlertTriangle size={28} className="text-red-400" />
          </div>

          <h3 className={`font-display text-xl font-semibold mb-2 ${
            theme === 'dark' ? 'text-parchment-100' : 'text-parchment-900'
          }`}>
            Failed to Load
          </h3>

          <p className={`text-sm mb-6 ${
            theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'
          }`}>
            Something went wrong while loading the book content.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={retryLoad}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <button
              onClick={openInNewTab}
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-parchment-800 text-parchment-200 hover:bg-parchment-700'
                  : 'bg-parchment-200 text-parchment-700 hover:bg-parchment-300'
              }`}
            >
              <ExternalLink size={16} />
              Open in New Tab
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Loaded — render iframe
  return (
    <div className={`w-full h-full ${bgClass}`}>
      <iframe
        ref={iframeRef}
        src={url}
        title="Book content"
        className="w-full h-full border-0"
        onLoad={handleIframeLoad}
        onError={handleIframeError}
        sandbox="allow-same-origin allow-scripts"
        allow="fullscreen"
      />
    </div>
  )
}

export default HtmlReader
