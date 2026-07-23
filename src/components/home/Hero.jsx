import { BookOpen } from 'lucide-react'
import SearchBar from './SearchBar'

function Hero({ searchValue, onSearchChange, onSearch }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-parchment-200/60 via-parchment-100 to-parchment-100">
      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-brand-100/30 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-olive-100/30 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 sm:pt-20 sm:pb-14 text-center">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-brand-100 mb-5">
          <BookOpen size={22} className="text-brand-600" />
        </div>

        <h1 className="font-display text-3xl sm:text-4xl md:text-5xl font-bold text-parchment-900 leading-tight mb-3">
          Read freely.<br className="hidden sm:block" /> No account needed.
        </h1>
        <p className="text-parchment-700 text-base sm:text-lg mb-7 sm:mb-9 max-w-xl mx-auto">
          Thousands of classic books from Project Gutenberg. Browse, search, and start reading instantly.
        </p>

        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearch}
        />

        {/* Quick stats */}
        <div className="flex items-center justify-center gap-6 mt-8 text-xs text-parchment-500">
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-olive-400" />
            70,000+ books
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-brand-400" />
            Free to read
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-parchment-400" />
            No signup
          </span>
        </div>
      </div>
    </section>
  )
}

export default Hero
