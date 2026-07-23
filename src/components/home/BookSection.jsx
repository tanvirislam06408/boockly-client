import { forwardRef, memo } from 'react'
import { AlertTriangle, RefreshCw, BookOpen } from 'lucide-react'

/**
 * Reusable section wrapper for book carousels/grids on the homepage.
 * Handles title, loading skeletons, error state, and empty state.
 */
const BookSection = memo(forwardRef(function BookSection({
  title,
  icon: Icon,
  subtitle,
  loading = false,
  error = null,
  onRetry,
  emptyMessage = 'No books available',
  children,
  className = '',
}, ref) {
  return (
    <section ref={ref} className={`py-6 ${className}`}>
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {Icon && <Icon size={20} className="text-brand-500" />}
            <div>
              <h2 className="font-display text-lg sm:text-xl font-semibold text-parchment-900">
                {title}
              </h2>
              {subtitle && (
                <p className="text-xs text-parchment-500 mt-0.5">{subtitle}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Loading skeletons */}
        {loading && (
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="shrink-0 w-[160px] sm:w-[180px] book-card animate-pulse">
                <div className="aspect-[2/3] bg-parchment-300/50 rounded-t-card" />
                <div className="p-3 space-y-2">
                  <div className="h-3.5 bg-parchment-300/50 rounded w-3/4" />
                  <div className="h-2.5 bg-parchment-300/40 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-red-50 mb-3">
              <AlertTriangle size={18} className="text-red-400" />
            </div>
            <p className="text-sm text-parchment-700 mb-3">{error}</p>
            {onRetry && (
              <button
                onClick={onRetry}
                className="btn-ghost inline-flex items-center gap-1.5 text-sm"
              >
                <RefreshCw size={14} />
                Try again
              </button>
            )}
          </div>
        )}

        {/* Empty state */}
        {!loading && !error && (!children || (Array.isArray(children) && children.length === 0)) && (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-parchment-200 mb-3">
              <BookOpen size={18} className="text-parchment-400" />
            </div>
            <p className="text-sm text-parchment-600">{emptyMessage}</p>
          </div>
        )}

        {/* Children (the actual content) */}
        {!loading && !error && children}
      </div>
    </section>
  )
}))

export default BookSection
