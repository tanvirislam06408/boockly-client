import { useState, useCallback } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import 'react-pdf/dist/Page/AnnotationLayer.css'
import 'react-pdf/dist/Page/TextLayer.css'
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  AlertTriangle,
  RefreshCw,
} from 'lucide-react'

// Configure pdf.js worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

function PdfViewer({ url, theme, onProgressUpdate }) {
  const [numPages, setNumPages] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [scale, setScale] = useState(1.2)
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)

  const onDocumentLoadSuccess = useCallback(({ numPages: total }) => {
    setNumPages(total)
    setIsLoading(false)
    setLoadError(null)
    onProgressUpdate?.({ totalPages: total, currentPage: 1 })
  }, [onProgressUpdate])

  const onDocumentLoadError = useCallback((error) => {
    console.error('PDF load error:', error)
    setLoadError(error.message || 'Failed to load PDF')
    setIsLoading(false)
  }, [])

  const goToPrevPage = () => {
    if (currentPage > 1) {
      const newPage = currentPage - 1
      setCurrentPage(newPage)
      onProgressUpdate?.({ totalPages: numPages, currentPage: newPage })
    }
  }

  const goToNextPage = () => {
    if (numPages && currentPage < numPages) {
      const newPage = currentPage + 1
      setCurrentPage(newPage)
      onProgressUpdate?.({ totalPages: numPages, currentPage: newPage })
    }
  }

  const zoomIn = () => setScale((s) => Math.min(s + 0.2, 3))
  const zoomOut = () => setScale((s) => Math.max(s - 0.2, 0.4))
  const resetZoom = () => setScale(1.2)

  const bgClass = theme === 'dark'
    ? 'bg-parchment-900'
    : theme === 'sepia'
      ? 'bg-[#F5EDE3]'
      : 'bg-gray-100'

  // Loading state
  if (isLoading && !loadError) {
    return (
      <div className={`flex flex-col items-center justify-center h-full ${bgClass}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-brand-500 mx-auto mb-4" />
          <p className={theme === 'dark' ? 'text-parchment-300' : 'text-parchment-600'}>
            Loading PDF...
          </p>
        </div>
      </div>
    )
  }

  // Error state
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
            Failed to Load PDF
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
              Open in Browser
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`flex flex-col h-full ${bgClass}`}>
      {/* PDF Content */}
      <div className="flex-1 overflow-auto flex justify-center py-4">
        <Document
          file={url}
          onLoadSuccess={onDocumentLoadSuccess}
          onLoadError={onDocumentLoadError}
          loading={
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-500" />
            </div>
          }
          error={
            <div className="flex items-center justify-center h-64">
              <p className="text-red-500">Failed to load PDF document</p>
            </div>
          }
        >
          <Page
            pageNumber={currentPage}
            scale={scale}
            className="shadow-lg"
            renderTextLayer={true}
            renderAnnotationLayer={true}
          />
        </Document>
      </div>

      {/* Controls Bar */}
      <div className={`flex items-center justify-between px-4 py-3 border-t ${
        theme === 'dark'
          ? 'border-parchment-700 bg-parchment-800'
          : theme === 'sepia'
            ? 'border-parchment-300 bg-parchment-100'
            : 'border-gray-200 bg-white'
      }`}>
        {/* Left: Page navigation */}
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevPage}
            disabled={currentPage <= 1}
            className={`p-2 rounded-lg transition-colors ${
              currentPage <= 1
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                  ? 'hover:bg-parchment-700 text-parchment-200'
                  : 'hover:bg-gray-100 text-parchment-700'
            }`}
            aria-label="Previous page"
          >
            <ChevronLeft size={20} />
          </button>

          <span className={`text-sm font-medium min-w-[80px] text-center ${
            theme === 'dark' ? 'text-parchment-200' : 'text-parchment-800'
          }`}>
            {currentPage} / {numPages || '?'}
          </span>

          <button
            onClick={goToNextPage}
            disabled={!numPages || currentPage >= numPages}
            className={`p-2 rounded-lg transition-colors ${
              !numPages || currentPage >= numPages
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                  ? 'hover:bg-parchment-700 text-parchment-200'
                  : 'hover:bg-gray-100 text-parchment-700'
            }`}
            aria-label="Next page"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* Center: Zoom controls */}
        <div className="flex items-center gap-1">
          <button
            onClick={zoomOut}
            disabled={scale <= 0.4}
            className={`p-2 rounded-lg transition-colors ${
              scale <= 0.4
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                  ? 'hover:bg-parchment-700 text-parchment-200'
                  : 'hover:bg-gray-100 text-parchment-700'
            }`}
            aria-label="Zoom out"
          >
            <ZoomOut size={18} />
          </button>

          <span className={`text-xs font-medium min-w-[48px] text-center ${
            theme === 'dark' ? 'text-parchment-300' : 'text-parchment-600'
          }`}>
            {Math.round(scale * 100)}%
          </span>

          <button
            onClick={zoomIn}
            disabled={scale >= 3}
            className={`p-2 rounded-lg transition-colors ${
              scale >= 3
                ? 'opacity-40 cursor-not-allowed'
                : theme === 'dark'
                  ? 'hover:bg-parchment-700 text-parchment-200'
                  : 'hover:bg-gray-100 text-parchment-700'
            }`}
            aria-label="Zoom in"
          >
            <ZoomIn size={18} />
          </button>

          <button
            onClick={resetZoom}
            className={`p-2 rounded-lg transition-colors ${
              theme === 'dark'
                ? 'hover:bg-parchment-700 text-parchment-200'
                : 'hover:bg-gray-100 text-parchment-700'
            }`}
            aria-label="Reset zoom"
          >
            <RotateCcw size={16} />
          </button>
        </div>

        {/* Right: Page indicator */}
        <div className={`text-xs ${
          theme === 'dark' ? 'text-parchment-400' : 'text-parchment-500'
        }`}>
          Page {currentPage} of {numPages}
        </div>
      </div>
    </div>
  )
}

export default PdfViewer
