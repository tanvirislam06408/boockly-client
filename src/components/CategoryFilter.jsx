const CATEGORIES = ['All', 'Fiction', 'Self Development', 'Business', 'Science', 'Biography']

function CategoryFilter({ activeCategory, onSelect }) {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide sm:flex-wrap sm:justify-center">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => onSelect(cat)}
            className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-150 ${
              activeCategory === cat
                ? 'bg-brand-500 text-white shadow-sm'
                : 'bg-parchment-200 text-parchment-700 hover:bg-parchment-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>
    </div>
  )
}

export default CategoryFilter
