import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Bookmark,
  Maximize,
  Minimize,
  Settings,
  Type,
  Palette,
  Sun,
  Moon,
  Coffee,
  Minus,
  Plus,
  ExternalLink,
  Download,
  AlertTriangle,
  RefreshCw,
  BookOpen,
} from 'lucide-react'
import HtmlReader from '../components/reader/HtmlReader'
import PdfViewer from '../components/reader/PdfViewer'
import TextReader from '../components/reader/TextReader'
import { fetchBookById, getBestReadFormat } from '../services/api'
import {
  saveReadingProgress,
  getReadingProgress,
} from '../services/readingProgress'
import {
  getAllPreferences,
  updatePreferences,
} from '../services/userPreferences'

function Reader() {
  const { bookId } = useParams()
  const navigate = useNavigate()

  // Book data
  const [book, setBook] = useState(null)
  const [readFormat, setReadFormat] = useState(null) // { type, url }
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  // UI state
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [bookmarks, setBookmarks] = useState([])

  // User preferences
  const [prefs, setPrefs] = useState(() => getAllPreferences())

  // Load book data
  useEffect(() => {
    if (!bookId) {
      setLoadError('No book ID provided')
      setIsLoading(false)
      return
    }

    let cancelled = false

    const loadBook = async () => {
      setIsLoading(true)
      setLoadError(null)
      try {
        const bookData = await fetchBookById(bookId)
        if (cancelled) return

        setBook(bookData)

        // Determine best read format
        const format = getBestReadFormat(bookData.formats)
        setReadFormat(format)

        // Load saved bookmarks
        const saved = getReadingProgress(bookId)
        if (saved?.bookmarks) {
          setBookmarks(saved.bookmarks)
        }

        setIsLoading(false)
      } catch (err) {
        if (!cancelled) {
          setLoadError(err.message || 'Failed to load book')
          setIsLoading(false)
        }
      }
    }

    loadBook()
    return () => { cancelled = true }
  }, [bookId])

  // Save reading progress for "Continue Reading"
  const handleProgressUpdate = useCallback((progress) => {
    if (!book) return
    saveReadingProgress(bookId, progress, {
      title: book.title,
      author: book.author,
      coverImage: book.coverImage,
      readFormat: readFormat?.type,
    })
  }, [book, bookId, readFormat])

  // Toggle bookmark
  const toggleBookmark = useCallback(() => {
    const newBookmark = {
      id: Date.now(),
      label: `Bookmark ${bookmarks.length + 1}`,
      timestamp: Date.now(),
    }
    setBookmarks((prev) => {
      const updated = [...prev, newBookmark]
      // Save to localStorage
      if (book) {
        saveReadingProgress(bookId, { bookmarks: updated }, {
          title: book.title,
          author: book.author,
          coverImage: book.coverImage,
          readFormat: readFormat?.type,
        })
      }
      return updated
    })
  }, [bookmarks, book, bookId, readFormat])

  // Toggle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }, [])

  // Listen for fullscreen changes
  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  // Update preferences
  const handlePrefChange = (key, value) => {
    const updated = updatePreferences({ [key]: value })
    setPrefs(updated)
  }

  // Determine theme background
  const bgClass = prefs.theme === 'dark'
    ? 'bg-parchment-900'
    : prefs.theme === 'sepia'
      ? 'bg-[#F5EDE3]'
      : 'bg-white'

  const headerBgClass = prefs.theme === 'dark'
    ? 'bg-parchment-800 border-parchment-700'
    : prefs.theme === 'sepia'
      ? 'bg-parchment-100 border-parchment-300'
      : 'bg-white border-gray-200'

  const textPrimary = prefs.theme === 'dark' ? 'text-parchment-100' : 'text-parchment-900'
  const textSecondary = prefs.theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'
  const hoverBg = prefs.theme === 'dark' ? 'hover:bg-parchment-700' : 'hover:bg-parchment-200'

  // ─── Loading state ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-parchment-100">
        {/* Minimal header */}
        <header className="sticky top-0 z-50 flex items-center px-4 py-3 border-b border-parchment-200 bg-white">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-parchment-200 text-parchment-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="ml-3">
            <div className="h-4 w-48 bg-parchment-200 rounded animate-pulse" />
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4" />
            <p className="text-parchment-600 font-medium">Loading book...</p>
            <p className="text-sm text-parchment-400 mt-1">Fetching from Project Gutenberg</p>
          </div>
        </div>
      </div>
    )
  }

  // ─── Error state ─────────────────────────────────────────────
  if (loadError || !book) {
    return (
      <div className="min-h-screen flex flex-col bg-parchment-100">
        <header className="sticky top-0 z-50 flex items-center px-4 py-3 border-b border-parchment-200 bg-white">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-parchment-200 text-parchment-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <span className="ml-3 font-display font-semibold text-parchment-900">Reader</span>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <AlertTriangle size={28} className="text-red-400" />
            </div>

            <h2 className="font-display text-xl font-bold text-parchment-900 mb-2">
              {loadError ? 'Failed to Load Book' : 'Book Not Found'}
            </h2>

            <p className="text-parchment-600 text-sm mb-6">
              {loadError || 'The book could not be found or loaded.'}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="btn-primary inline-flex items-center justify-center gap-2"
              >
                <RefreshCw size={16} />
                Try Again
              </button>

              <button
                onClick={() => navigate('/')}
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── No readable format — EPUB fallback ──────────────────────
  if (!readFormat || readFormat.type === 'epub' || !readFormat.url) {
    return (
      <div className="min-h-screen flex flex-col bg-parchment-100">
        <header className="sticky top-0 z-50 flex items-center px-4 py-3 border-b border-parchment-200 bg-white">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-lg hover:bg-parchment-200 text-parchment-700 transition-colors"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="ml-3 min-w-0">
            <h1 className="font-display font-semibold text-parchment-900 truncate text-sm">
              {book.title}
            </h1>
            <p className="text-xs text-parchment-500 truncate">{book.author}</p>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center max-w-md p-8">
            {book.coverImage && (
              <img
                src={book.coverImage}
                alt={book.title}
                className="w-32 mx-auto mb-6 rounded-lg shadow-card"
              />
            )}

            <h2 className="font-display text-2xl font-bold text-parchment-900 mb-1">
              {book.title}
            </h2>
            <p className="text-parchment-600 mb-4">{book.author}</p>

            <div className="w-16 h-16 bg-brand-50 rounded-full flex items-center justify-center mx-auto mb-5">
              <BookOpen size={28} className="text-brand-500" />
            </div>

            <h3 className="font-display text-lg font-semibold text-parchment-800 mb-2">
              No Readable Format Available
            </h3>

            <p className="text-sm text-parchment-600 mb-6 leading-relaxed">
              This book is only available as an EPUB file, which cannot be rendered
              in the browser due to CORS restrictions from Project Gutenberg's servers.
              You can download the EPUB file and read it in any e-reader app.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {book.downloadUrl && (
                <a
                  href={book.downloadUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                  className="btn-primary inline-flex items-center justify-center gap-2"
                >
                  <Download size={16} />
                  Download EPUB
                </a>
              )}

              <button
                onClick={() => navigate('/')}
                className="btn-secondary inline-flex items-center justify-center gap-2"
              >
                <ArrowLeft size={16} />
                Back to Library
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // ─── Main reader view ────────────────────────────────────────
  return (
    <div className={`min-h-screen flex flex-col ${bgClass} theme-transition`}>
      {/* ── Sticky Header ─────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 flex items-center justify-between px-4 py-2.5 border-b ${headerBgClass}`}>
        {/* Left: Back + Book info */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button
            onClick={() => navigate(-1)}
            className={`p-2 rounded-lg transition-colors ${hoverBg} ${
              prefs.theme === 'dark' ? 'text-parchment-200' : 'text-parchment-700'
            }`}
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>

          <div className="min-w-0">
            <h1 className={`font-display font-semibold truncate text-sm ${textPrimary}`}>
              {book.title}
            </h1>
            <p className={`text-xs truncate ${textSecondary}`}>
              {book.author}
            </p>
          </div>
        </div>

        {/* Right: Action buttons */}
        <div className="flex items-center gap-1">
          {/* Format badge */}
          <span className={`hidden sm:inline-block px-2 py-0.5 text-[10px] font-medium rounded-full mr-1 ${
            readFormat.type === 'html'
              ? 'bg-olive-100 text-olive-700'
              : readFormat.type === 'pdf'
                ? 'bg-red-50 text-red-600'
                : 'bg-parchment-200 text-parchment-600'
          }`}>
            {readFormat.type === 'html' ? 'HTML' : readFormat.type === 'pdf' ? 'PDF' : 'TXT'}
          </span>

          <button
            onClick={toggleBookmark}
            className={`p-2 rounded-lg transition-colors ${hoverBg} ${
              prefs.theme === 'dark' ? 'text-parchment-200' : 'text-parchment-700'
            }`}
            aria-label="Add bookmark"
          >
            <Bookmark size={18} />
          </button>

          <button
            onClick={toggleFullscreen}
            className={`p-2 rounded-lg transition-colors ${hoverBg} ${
              prefs.theme === 'dark' ? 'text-parchment-200' : 'text-parchment-700'
            }`}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <Minimize size={18} /> : <Maximize size={18} />}
          </button>

          {/* Settings button (for text reader) */}
          {readFormat.type === 'text' && (
            <button
              onClick={() => setShowSettings(!showSettings)}
              className={`p-2 rounded-lg transition-colors ${
                showSettings
                  ? 'bg-brand-100 text-brand-600'
                  : `${hoverBg} ${prefs.theme === 'dark' ? 'text-parchment-200' : 'text-parchment-700'}`
              }`}
              aria-label="Reader settings"
            >
              <Settings size={18} />
            </button>
          )}

          {book.downloadUrl && (
            <a
              href={book.downloadUrl}
              target="_blank"
              rel="noopener noreferrer"
              download
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                prefs.theme === 'dark'
                  ? 'bg-parchment-700 text-parchment-200 hover:bg-parchment-600'
                  : 'bg-parchment-200 text-parchment-700 hover:bg-parchment-300'
              }`}
            >
              <Download size={14} />
              Download
            </a>
          )}
        </div>
      </header>

      {/* ── Settings Panel (text reader only) ──────────────────── */}
      {showSettings && readFormat.type === 'text' && (
        <div className={`border-b px-4 py-3 ${
          prefs.theme === 'dark'
            ? 'bg-parchment-800 border-parchment-700'
            : prefs.theme === 'sepia'
              ? 'bg-parchment-100 border-parchment-300'
              : 'bg-gray-50 border-gray-200'
        }`}>
          <div className="max-w-3xl mx-auto flex flex-wrap items-center gap-6">
            {/* Theme */}
            <div className="flex items-center gap-2">
              <Palette size={14} className={textSecondary} />
              <span className={`text-xs font-medium ${textSecondary}`}>Theme</span>
              <div className="flex gap-1">
                {[
                  { id: 'light', icon: Sun, label: 'Light' },
                  { id: 'dark', icon: Moon, label: 'Dark' },
                  { id: 'sepia', icon: Coffee, label: 'Sepia' },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => handlePrefChange('theme', t.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      prefs.theme === t.id
                        ? 'bg-brand-100 text-brand-600'
                        : `${hoverBg} ${prefs.theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'}`
                    }`}
                    aria-label={`${t.label} theme`}
                  >
                    <t.icon size={14} />
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div className="flex items-center gap-2">
              <Type size={14} className={textSecondary} />
              <span className={`text-xs font-medium ${textSecondary}`}>Size</span>
              <button
                onClick={() => handlePrefChange('fontSize', Math.max(12, prefs.fontSize - 2))}
                disabled={prefs.fontSize <= 12}
                className={`p-1 rounded transition-colors ${prefs.fontSize <= 12 ? 'opacity-40' : hoverBg} ${
                  prefs.theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'
                }`}
              >
                <Minus size={12} />
              </button>
              <span className={`text-xs w-8 text-center ${textSecondary}`}>{prefs.fontSize}px</span>
              <button
                onClick={() => handlePrefChange('fontSize', Math.min(32, prefs.fontSize + 2))}
                disabled={prefs.fontSize >= 32}
                className={`p-1 rounded transition-colors ${prefs.fontSize >= 32 ? 'opacity-40' : hoverBg} ${
                  prefs.theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'
                }`}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Line Height */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${textSecondary}`}>Spacing</span>
              <button
                onClick={() => handlePrefChange('lineHeight', Math.max(1.2, +(prefs.lineHeight - 0.2).toFixed(1)))}
                disabled={prefs.lineHeight <= 1.2}
                className={`p-1 rounded transition-colors ${prefs.lineHeight <= 1.2 ? 'opacity-40' : hoverBg} ${
                  prefs.theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'
                }`}
              >
                <Minus size={12} />
              </button>
              <span className={`text-xs w-8 text-center ${textSecondary}`}>{prefs.lineHeight}</span>
              <button
                onClick={() => handlePrefChange('lineHeight', Math.min(3, +(prefs.lineHeight + 0.2).toFixed(1)))}
                disabled={prefs.lineHeight >= 3}
                className={`p-1 rounded transition-colors ${prefs.lineHeight >= 3 ? 'opacity-40' : hoverBg} ${
                  prefs.theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'
                }`}
              >
                <Plus size={12} />
              </button>
            </div>

            {/* Font Family */}
            <div className="flex items-center gap-2">
              <span className={`text-xs font-medium ${textSecondary}`}>Font</span>
              <div className="flex gap-1">
                {[
                  { value: 'serif', label: 'Serif' },
                  { value: 'sans-serif', label: 'Sans' },
                  { value: 'monospace', label: 'Mono' },
                ].map((f) => (
                  <button
                    key={f.value}
                    onClick={() => handlePrefChange('fontFamily', f.value)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      prefs.fontFamily === f.value
                        ? 'bg-brand-100 text-brand-600 font-medium'
                        : `${hoverBg} ${prefs.theme === 'dark' ? 'text-parchment-400' : 'text-parchment-600'}`
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Reader Content ─────────────────────────────────────── */}
      <main className="flex-1 overflow-hidden">
        {readFormat.type === 'html' && (
          <HtmlReader
            url={readFormat.url}
            theme={prefs.theme}
            onLoad={() => handleProgressUpdate({ format: 'html' })}
          />
        )}

        {readFormat.type === 'pdf' && (
          <PdfViewer
            url={readFormat.url}
            theme={prefs.theme}
            onProgressUpdate={(p) => handleProgressUpdate({ ...p, format: 'pdf' })}
          />
        )}

        {readFormat.type === 'text' && (
          <TextReader
            url={readFormat.url}
            theme={prefs.theme}
            fontSize={prefs.fontSize}
            lineHeight={prefs.lineHeight}
            fontFamily={prefs.fontFamily}
            onProgressUpdate={(p) => handleProgressUpdate({ ...p, format: 'text' })}
          />
        )}
      </main>
    </div>
  )
}

export default Reader
