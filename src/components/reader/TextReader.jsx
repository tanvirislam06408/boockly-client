import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import {
  Search,
  X,
  ChevronUp,
  ChevronDown,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

function TextReader({ url, theme, fontSize, lineHeight, fontFamily, onProgressUpdate }) {
  const [content, setContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // Search state
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchMatches, setSearchMatches] = useState([])
  const [currentMatchIndex, setCurrentMatchIndex] = useState(-1)
  const searchInputRef = useRef(null)

  // Reading progress
  const contentRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  // Fetch text content
  useEffect(() => {
    if (!url) {
      setLoadError('No URL provided')
      setIsLoading(false)
      return
    }

    let cancelled = false

    const fetchText = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const res = await fetch(url)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        const text = await res.text()
        if (!cancelled) {
          setContent(text)
          setIsLoading(false)
        }
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Failed to load text')
          setIsLoading(false)
        }
      }
    }

    fetchText()
    return () => { cancelled = true }
  }, [url])

  // Track scroll progress
  const handleScroll = useCallback(() => {
    const el = contentRef.current
    if (!el) return
    const { scrollTop, scrollHeight, clientHeight } = el
    const progress = scrollHeight <= clientHeight ? 0 : scrollTop / (scrollHeight - clientHeight)
    setScrollProgress(progress)
    onProgressUpdate?.({ percentage: progress })
  }, [onProgressUpdate])

  // Debounced scroll handler
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll()
          ticking = false
        })
        ticking = true
      }
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [handleScroll, isLoading])

  // Search functionality
  const handleSearch = useCallback((query) => {
    setSearchQuery(query)
    if (!query.trim()) {
      setSearchMatches([])
      setCurrentMatchIndex(-1)
      return
    }

    const lower = content.toLowerCase()
    const q = query.toLowerCase()
    const matches = []
    let idx = lower.indexOf(q)
    while (idx !== -1) {
      matches.push(idx)
      idx = lower.indexOf(q, idx + 1)
    }
    setSearchMatches(matches)
    setCurrentMatchIndex(matches.length > 0 ? 0 : -1)
  }, [content])

  const goToMatch = useCallback((direction) => {
    if (searchMatches.length === 0) return
    let next
    if (direction === 'next') {
      next = (currentMatchIndex + 1) % searchMatches.length
    } else {
      next = (currentMatchIndex - 1 + searchMatches.length) % searchMatches.length
    }
    setCurrentMatchIndex(next)
  }, [searchMatches, currentMatchIndex])

  // Highlight search matches in content
  const highlightedContent = useMemo(() => {
    if (!searchQuery.trim() || searchMatches.length === 0) return null

    const parts = []
    let lastIndex = 0
    const lower = content.toLowerCase()
    const q = searchQuery.toLowerCase()
    let matchIdx = lower.indexOf(q)

    while (matchIdx !== -1) {
      parts.push({ text: content.slice(lastIndex, matchIdx), isMatch: false })
      parts.push({ text: content.slice(matchIdx, matchIdx + searchQuery.length), isMatch: true })
      lastIndex = matchIdx + searchQuery.length
      matchIdx = lower.indexOf(q, lastIndex)
    }
    parts.push({ text: content.slice(lastIndex), isMatch: false })

    return parts
  }, [content, searchQuery, searchMatches])

  // Open search
  const toggleSearch = () => {
    setSearchOpen((prev) => {
      if (!prev) {
        setTimeout(() => searchInputRef.current?.focus(), 100)
      }
      return !prev
    })
  }

  // Close search
  const closeSearch = () => {
    setSearchOpen(false)
    setSearchQuery('')
    setSearchMatches([])
    setCurrentMatchIndex(-1)
  }

  // Theme styles
  const bgClass = theme === 'dark'
    ? 'bg-parchment-900'
    : theme === 'sepia'
      ? 'bg-[#F5EDE3]'
      : 'bg-white'

  const textClass = theme === 'dark'
    ? 'text-parchment-200'
    : theme === 'sepia'
      ? 'text-[#5A2B14]'
      : 'text-parchment-900'

  const fontFamilyStyle = fontFamily === 'serif'
    ? "'Playfair Display', Georgia, serif"
    : fontFamily === 'monospace'
      ? "'SF Mono', 'Cascadia Code', Consolas, monospace"
      : fontFamily === 'cursive'
        ? "'Brush Script MT', cursive"
        : 'Inter, system-ui, sans-serif'

  // Loading
  if (isLoading) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${bgClass}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4" />
          <p className={theme === 'dark' ? 'text-parchment-300' : 'text-parchment-600'}>
            Loading book text...
          </p>
        </div>
      </div>
    )
  }

  // Error
  if (loadError) {
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
            {loadError}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => { setIsLoading(true); setLoadError(null); }}
              className="btn-primary inline-flex items-center justify-center gap-2"
            >
              <RefreshCw size={16} />
              Try Again
            </button>

            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg transition-colors ${
                theme === 'dark'
                  ? 'bg-parchment-800 text-parchment-200 hover:bg-parchment-700'
                  : 'bg-parchment-200 text-parchment-700 hover:bg-parchment-300'
              }`}
            >
              Open Raw Text
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${bgClass}`}>
      {/* Search Bar */}
      {searchOpen && (
        <div className={`flex items-center gap-2 px-4 py-2 border-b ${
          theme === 'dark'
            ? 'border-parchment-700 bg-parchment-800'
            : theme === 'sepia'
              ? 'border-parchment-300 bg-parchment-100'
              : 'border-gray-200 bg-gray-50'
        }`}>
          <Search size={16} className={theme === 'dark' ? 'text-parchment-400' : 'text-parchment-500'} />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Search in text..."
            className={`flex-1 bg-transparent outline-none text-sm ${
              theme === 'dark'
                ? 'text-parchment-200 placeholder:text-parchment-500'
                : 'text-parchment-800 placeholder:text-parchment-400'
            }`}
            onKeyDown={(e) => {
              if (e.key === 'Enter') goToMatch(e.shiftKey ? 'prev' : 'next')
              if (e.key === 'Escape') closeSearch()
            }}
          />

          {searchMatches.length > 0 && (
            <span className={`text-xs ${
              theme === 'dark' ? 'text-parchment-400' : 'text-parchment-500'
            }`}>
              {currentMatchIndex + 1} / {searchMatches.length}
            </span>
          )}

          <button
            onClick={() => goToMatch('prev')}
            disabled={searchMatches.length === 0}
            className={`p-1 rounded transition-colors ${
              searchMatches.length === 0
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                  ? 'hover:bg-parchment-700 text-parchment-300'
                  : 'hover:bg-parchment-200 text-parchment-600'
            }`}
          >
            <ChevronUp size={16} />
          </button>

          <button
            onClick={() => goToMatch('next')}
            disabled={searchMatches.length === 0}
            className={`p-1 rounded transition-colors ${
              searchMatches.length === 0
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                  ? 'hover:bg-parchment-700 text-parchment-300'
                  : 'hover:bg-parchment-200 text-parchment-600'
            }`}
          >
            <ChevronDown size={16} />
          </button>

          <button
            onClick={closeSearch}
            className={`p-1 rounded transition-colors ${
              theme === 'dark'
                ? 'hover:bg-parchment-700 text-parchment-300'
                : 'hover:bg-parchment-200 text-parchment-600'
            }`}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Content */}
      <div
        ref={contentRef}
        className="flex-1 overflow-y-auto"
      >
        <div className="max-w-3xl mx-auto px-6 py-8 sm:px-8 sm:py-12">
          {highlightedContent ? (
            <pre className={`whitespace-pre-wrap break-words ${textClass}`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight,
                fontFamily: fontFamilyStyle,
              }}
            >
              {highlightedContent.map((part, i) => (
                part.isMatch ? (
                  <mark
                    key={i}
                    className="bg-yellow-300 text-parchment-900 rounded px-0.5"
                  >
                    {part.text}
                  </mark>
                ) : (
                  <span key={i}>{part.text}</span>
                )
              ))}
            </pre>
          ) : (
            <pre className={`whitespace-pre-wrap break-words ${textClass}`}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight,
                fontFamily: fontFamilyStyle,
              }}
            >
              {content}
            </pre>
          )}
        </div>
      </div>

      {/* Bottom Bar: Search toggle + Progress */}
      <div className={`flex items-center justify-between px-4 py-2 border-t ${
        theme === 'dark'
          ? 'border-parchment-700 bg-parchment-800'
          : theme === 'sepia'
            ? 'border-parchment-300 bg-parchment-100'
            : 'border-gray-200 bg-white'
      }`}>
        <button
          onClick={toggleSearch}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm transition-colors ${
            searchOpen
              ? 'bg-brand-100 text-brand-600'
              : theme === 'dark'
                ? 'hover:bg-parchment-700 text-parchment-300'
                : 'hover:bg-parchment-200 text-parchment-600'
          }`}
        >
          <Search size={14} />
          Search
        </button>

        <div className="flex items-center gap-3">
          <div className={`flex-1 h-1.5 rounded-full overflow-hidden w-32 ${
            theme === 'dark' ? 'bg-parchment-700' : 'bg-parchment-200'
          }`}>
            <div
              className="h-full bg-brand-500 transition-all duration-300"
              style={{ width: `${Math.round(scrollProgress * 100)}%` }}
            />
          </div>
          <span className={`text-xs ${
            theme === 'dark' ? 'text-parchment-400' : 'text-parchment-500'
          }`}>
            {Math.round(scrollProgress * 100)}%
          </span>
        </div>
      </div>
    </div>
  )
}

export default TextReader
