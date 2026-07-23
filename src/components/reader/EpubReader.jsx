import { useState, useEffect, useRef, useCallback } from 'react'
import { Book, ChevronLeft, ChevronRight, Menu, X, Settings, Maximize, Minimize } from 'lucide-react'
import TableOfContents from './TableOfContents'
import ReaderControls from './ReaderControls'
import ProgressBar from './ProgressBar'
import { saveReadingProgress, getReadingProgress } from '../../services/readingProgress'

function EpubReader({ bookUrl, bookId, bookTitle, onClose }) {
  const [rendition, setRendition] = useState(null)
  const [toc, setToc] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showToc, setShowToc] = useState(false)
  const [showControls, setShowControls] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [fontSize, setFontSize] = useState(100)
  const [fontFamily, setFontFamily] = useState(' serif')
  const [theme, setTheme] = useState('light')
  
  const viewerRef = useRef(null)
  const bookRef = useRef(null)
  const controlsTimeoutRef = useRef(null)

  // Initialize epub.js
  useEffect(() => {
    if (!bookUrl || !viewerRef.current) return

    const loadBook = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Dynamic import of epubjs
        const ePub = (await import('epubjs')).default

        const book = ePub(bookUrl)
        bookRef.current = book

        const rendition = book.renderTo(viewerRef.current, {
          width: '100%',
          height: '100%',
          spread: 'none',
          flow: 'paginated'
        })

        // Apply initial theme
        rendition.themes.register('light', {
          body: { color: '#2C1E10', background: '#FDFBF7' }
        })
        rendition.themes.register('dark', {
          body: { color: '#F5EDE3', background: '#2C1E10' }
        })
        rendition.themes.register('sepia', {
          body: { color: '#5A2B14', background: '#F5EDE3' }
        })
        rendition.themes.select(theme)

        // Apply font settings
        rendition.themes.fontSize(`${fontSize}%`)
        rendition.themes.font(fontFamily)

        // Display the book
        rendition.display()

        // Get table of contents
        book.loaded.navigation.then(({ navigation }) => {
          setToc(navigation.toc)
        })

        // Handle page changes
        rendition.on('relocated', (location) => {
          setCurrentPage(location.start.displayed?.page || 1)
          setTotalPages(location.start.displayed?.total || 0)
          
          // Save reading progress
          if (bookId && location.start?.href) {
            saveReadingProgress(bookId, {
              href: location.start.href,
              location: location.start.cfi,
              percentage: location.start.percentage
            })
          }
        })

        // Handle errors
        book.loaded.catch((err) => {
          setError('Failed to load book. Please try again.')
          console.error('Book load error:', err)
        })

        setRendition(rendition)
        setIsLoading(false)

        // Restore last reading position
        if (bookId) {
          const savedProgress = getReadingProgress(bookId)
          if (savedProgress?.location) {
            rendition.display(savedProgress.location)
          }
        }

      } catch (err) {
        setError('Failed to initialize reader. Please try again.')
        console.error('Reader initialization error:', err)
        setIsLoading(false)
      }
    }

    loadBook()

    return () => {
      if (bookRef.current) {
        bookRef.current.destroy()
      }
    }
  }, [bookUrl, bookId, theme, fontSize, fontFamily])

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!rendition) return

      switch (e.key) {
        case 'ArrowLeft':
          rendition.prev()
          break
        case 'ArrowRight':
          rendition.next()
          break
        case 'Escape':
          if (showToc) {
            setShowToc(false)
          } else {
            onClose()
          }
          break
        case 'f':
          toggleFullscreen()
          break
        case 't':
          setShowToc(!showToc)
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [rendition, showToc, onClose])

  // Auto-hide controls on mobile
  useEffect(() => {
    const handleMouseMove = () => {
      setShowControls(true)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
      controlsTimeoutRef.current = setTimeout(() => {
        if (isFullscreen) {
          setShowControls(false)
        }
      }, 3000)
    }

    document.addEventListener('mousemove', handleMouseMove)
    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current)
      }
    }
  }, [isFullscreen])

  // Navigation functions
  const goNext = useCallback(() => {
    if (rendition) rendition.next()
  }, [rendition])

  const goPrev = useCallback(() => {
    if (rendition) rendition.prev()
  }, [rendition])

  const goToLocation = useCallback((cfi) => {
    if (rendition) rendition.display(cfi)
  }, [rendition])

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Theme handling
  const handleThemeChange = useCallback((newTheme) => {
    setTheme(newTheme)
    if (rendition) {
      rendition.themes.select(newTheme)
    }
  }, [rendition])

  // Font size handling
  const handleFontSizeChange = useCallback(( newSize) => {
    setFontSize(newSize)
    if (rendition) {
      rendition.themes.fontSize(`${newSize}%`)
    }
  }, [rendition])

  // Font family handling
  const handleFontFamilyChange = useCallback((newFont) => {
    setFontFamily(newFont)
    if (rendition) {
      rendition.themes.font(newFont)
    }
  }, [rendition])

  return (
    <div className={`fixed inset-0 z-50 flex flex-col ${
      theme === 'dark' ? 'bg-parchment-900' : 
      theme === 'sepia' ? 'bg-parchment-200' : 
      'bg-parchment-50'
    }`}>
      {/* Header */}
      <header className={`flex items-center justify-between px-4 py-3 border-b ${
        theme === 'dark' ? 'border-parchment-700 bg-parchment-800' : 
        theme === 'sepia' ? 'border-parchment-300 bg-parchment-100' : 
        'border-parchment-200 bg-white'
      } ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-parchment-700 text-parchment-200' : 
              'hover:bg-parchment-200 text-parchment-700'
            }`}
            aria-label="Close reader"
          >
            <X size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Book size={18} className="text-brand-500" />
            <h1 className={`font-display font-semibold truncate max-w-xs ${
              theme === 'dark' ? 'text-parchment-100' : 'text-parchment-900'
            }`}>
              {bookTitle || 'Loading...'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowToc(!showToc)}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-parchment-700 text-parchment-200' : 
              'hover:bg-parchment-200 text-parchment-700'
            }`}
            aria-label="Toggle table of contents"
          >
            {showToc ? <X size={20} /> : <Menu size={20} />}
          </button>
          
          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark' ? 'hover:bg-parchment-700 text-parchment-200' : 
              'hover:bg-parchment-200 text-parchment-700'
            }`}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize size={20} /> : <Maximize size={20} />}
          </button>
        </div>
      </header>

      {/* Main content area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Table of Contents Sidebar */}
        <TableOfContents
          toc={toc}
          onSelect={goToLocation}
          isOpen={showToc}
          onClose={() => setShowToc(false)}
          theme={theme}
        />

        {/* Reader viewport */}
        <div className="flex-1 relative">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500"></div>
            </div>
          )}
          
          {error && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center p-8">
                <p className="text-red-500 mb-4">{error}</p>
                <button
                  onClick={onClose}
                  className="btn-primary"
                >
                  Go Back
                </button>
              </div>
            </div>
          )}

          <div
            ref={viewerRef}
            className="w-full h-full"
            onClick={goNext}
          />
        </div>
      </div>

      {/* Navigation controls */}
      <div className={`absolute left-0 top-1/2 -translate-y-1/2 p-2 ${
        showControls ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}>
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            theme === 'dark' ? 'bg-parchment-700 hover:bg-parchment-600 text-parchment-200' : 
            'bg-white hover:bg-parchment-100 text-parchment-700'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft size={24} />
        </button>
      </div>

      <div className={`absolute right-0 top-1/2 -translate-y-1/2 p-2 ${
        showControls ? 'opacity-100' : 'opacity-0'
      } transition-opacity duration-300`}>
        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          className={`p-3 rounded-full shadow-lg transition-colors ${
            theme === 'dark' ? 'bg-parchment-700 hover:bg-parchment-600 text-parchment-200' : 
            'bg-white hover:bg-parchment-100 text-parchment-700'
          }`}
          aria-label="Next page"
        >
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Bottom controls */}
      <div className={`px-4 py-3 border-t ${
        theme === 'dark' ? 'border-parchment-700 bg-parchment-800' : 
        theme === 'sepia' ? 'border-parchment-300 bg-parchment-100' : 
        'border-parchment-200 bg-white'
      } ${showControls ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}>
        <div className="flex items-center justify-between mb-2">
          <ProgressBar
            current={currentPage}
            total={totalPages}
            theme={theme}
          />
        </div>
        
        <ReaderControls
          fontSize={fontSize}
          fontFamily={fontFamily}
          theme={theme}
          onFontSizeChange={handleFontSizeChange}
          onFontFamilyChange={handleFontFamilyChange}
          onThemeChange={handleThemeChange}
        />
      </div>
    </div>
  )
}

export default EpubReader