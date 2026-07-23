import { ArrowUpDown } from 'lucide-react'

const CATEGORIES = ['All', 'Fiction', 'Science', 'Technology', 'Non-Fiction', 'Philosophy', 'History', 'Poetry']

const SORT_OPTIONS = [
  { value: 'default', label: 'Default' },
  { value: 'title-asc', label: 'Title A–Z' },
  { value: 'title-desc', label: 'Title Z–A' },
  { value: 'author-asc', label: 'Author A–Z' },
]

function CategoryFilter({ activeCategory, onSelect, sortBy, onSortChange }) {
  return (
    <div className="sticky top-14 z-30 bg-parchment-100/90 backdrop-blur-md border-b border-parchment-300/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-4">
          {/* Categories — horizontal scroll on mobile */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 min-w-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => onSelect(cat)}
                className={`shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
                  activeCategory === cat
                    ? 'bg-brand-500 text-white shadow-sm'
                    : 'bg-parchment-200 text-parchment-700 hover:bg-parchment-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort dropdown */}
          <div className="hidden sm:flex items-center gap-2 shrink-0">
            <ArrowUpDown size={14} className="text-parchment-500" />
            <select
              value={sortBy}
              onChange={(e) => onSortChange(e.target.value)}
              aria-label="Sort books"
              className="text-sm text-parchment-700 bg-transparent border-none focus:outline-none focus:ring-0 cursor-pointer pr-1"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CategoryFilter
