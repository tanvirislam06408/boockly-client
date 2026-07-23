import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Download, BookOpen } from 'lucide-react'
import RatingStars from './RatingStars'

function BookDetailsModal({ book, onClose, onRate }) {
  const [ratingState, setRatingState] = useState('idle') // idle | confirming | done
  const [mounted, setMounted] = useState(false)
  const [visible, setVisible] = useState(false)
  const modalRef = useRef(null)
  const closeRef = useRef(null)
  const previousFocus = useRef(null)
  const navigate = useNavigate()

  // Mount/unmount with enter transition
  useEffect(() => {
    if (book) {
      previousFocus.current = document.activeElement
      setMounted(true)
      setRatingState('idle')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true))
      })
    } else if (mounted) {
      setVisible(false)
      const timer = setTimeout(() => {
        setMounted(false)
        previousFocus.current?.focus()
      }, 200)
      return () => clearTimeout(timer)
    }
  }, [book])

  // Focus the close button on open
  useEffect(() => {
    if (visible) {
      closeRef.current?.focus()
    }
  }, [visible])

  // Escape key
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap
      if (e.key === 'Tab' && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (visible) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKeyDown)
        document.body.style.overflow = ''
      }
    }
  }, [visible, handleKeyDown])

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) {
      onClose()
    }
  }

  function handleRate(value) {
    setRatingState('confirming')
    onRate?.(book.id, value)
    setTimeout(() => setRatingState('done'), 1500)
  }

  function handleReadBook() {
    if (book.downloadUrl) {
      navigate(`/reader/${book.id}?url=${encodeURIComponent(book.downloadUrl)}&title=${encodeURIComponent(book.title)}`)
      onClose()
    }
  }

  if (!mounted) return null

  const hasRating = book.rating > 0
  const hasDownload = !!book.downloadUrl

  // Determine download label from URL
  function getDownloadLabel() {
    if (!book.downloadUrl) return 'No file available'
    if (book.downloadUrl.includes('.epub')) return 'Download EPUB'
    if (book.downloadUrl.includes('.pdf') || book.downloadUrl.includes('pdf')) return 'Download PDF'
    if (book.downloadUrl.includes('plain')) return 'Download TXT'
    return 'Download'
  }

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label={`Book details: ${book.title}`}
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4
        bg-parchment-900/50 backdrop-blur-sm
        transition-opacity duration-200 ease-out
        ${visible ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        className={`relative bg-parchment-50 rounded-card shadow-card-active w-full max-w-2xl max-h-[90vh] overflow-y-auto
          transition-all duration-200 ease-out
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          ref={closeRef}
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-lg bg-parchment-200/80 text-parchment-600
                     hover:bg-parchment-300 hover:text-parchment-900 transition-colors duration-150 backdrop-blur-sm"
          aria-label="Close dialog"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col sm:flex-row gap-6 p-6">
          {/* Cover image — left column */}
          <div className="shrink-0 w-full sm:w-48">
            {book.coverImage ? (
              <img
                src={book.coverImage}
                alt={`Cover of ${book.title}`}
                className="w-full aspect-[2/3] object-cover rounded-lg shadow-card"
              />
            ) : (
              <div className="w-full aspect-[2/3] bg-parchment-300/40 rounded-lg shadow-card flex items-center justify-center">
                <span className="text-parchment-400 text-xs text-center px-4">{book.title}</span>
              </div>
            )}
          </div>

          {/* Details — right column */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Title & author */}
            <div>
              <h2 className="font-display text-2xl font-bold text-parchment-900 leading-tight">
                {book.title}
              </h2>
              <p className="text-parchment-700 mt-1">{book.author}</p>
            </div>

            {/* Category */}
            <span className="badge">{book.category}</span>

            {/* Description */}
            <p className="text-sm text-parchment-700 leading-relaxed">
              {book.description}
            </p>

            {/* Average rating — only if rating exists */}
            {hasRating && (
              <div className="flex items-center gap-3">
                <RatingStars rating={book.rating} size={18} />
                <span className="text-lg font-semibold text-parchment-900">
                  {book.rating}
                </span>
                <span className="text-sm text-parchment-600">
                  ({book.totalRatings.toLocaleString()} ratings)
                </span>
              </div>
            )}

            {/* Divider */}
            <div className="border-t border-parchment-300/60" />

            {/* Interactive rating */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-parchment-700">Rate this book</p>

              {ratingState === 'done' ? (
                <p className="text-sm text-olive-600 font-medium animate-fade-in">
                  Thanks for rating!
                </p>
              ) : (
                <div className="flex items-center gap-3">
                  <RatingStars
                    rating={0}
                    size={22}
                    interactive
                    onRate={handleRate}
                  />
                  {ratingState === 'confirming' && (
                    <span className="text-xs text-parchment-500">Saving...</span>
                  )}
                </div>
              )}
            </div>

            {/* Download button */}
            {hasDownload ? (
              <a
                href={book.downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                download
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2 text-center"
              >
                <Download size={16} />
                {getDownloadLabel()}
              </a>
            ) : (
              <button
                disabled
                className="btn-primary w-full flex items-center justify-center gap-2 mt-2 opacity-50 cursor-not-allowed"
              >
                <Download size={16} />
                No file available
              </button>
            )}

            {/* Read Book button - only show for EPUB files */}
            {book.downloadUrl && book.downloadUrl.includes('.epub') && (
              <button
                onClick={handleReadBook}
                className="w-full flex items-center justify-center gap-2 mt-3 px-4 py-2.5 bg-olive-500 hover:bg-olive-600 text-white rounded-lg transition-colors"
              >
                <BookOpen size={16} />
                Read Book
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsModal
