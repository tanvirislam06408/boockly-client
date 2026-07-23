import { useState, useEffect, useRef } from 'react'
import { Search, X } from 'lucide-react'

function SearchBar({ value, onChange, onSearch }) {
  const [localValue, setLocalValue] = useState(value)
  const timerRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    setLocalValue(value)
  }, [value])

  useEffect(() => {
    return () => clearTimeout(timerRef.current)
  }, [])

  function handleChange(e) {
    const val = e.target.value
    setLocalValue(val)
    onChange(val)

    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => {
      onSearch(val)
    }, 350)
  }

  function handleClear() {
    setLocalValue('')
    onChange('')
    onSearch('')
    inputRef.current?.focus()
  }

  function handleKeyDown(e) {
    if (e.key === 'Escape') {
      handleClear()
    }
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative group">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment-400 pointer-events-none
                     group-focus-within:text-brand-500 transition-colors"
        />
        <input
          ref={inputRef}
          type="text"
          value={localValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder="Search by title or author..."
          aria-label="Search books by title or author"
          className="w-full pl-11 pr-10 py-3.5 bg-white border border-parchment-300 rounded-full
                     text-base text-parchment-900 placeholder:text-parchment-400
                     focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500
                     transition-all duration-150 shadow-sm"
        />
        {localValue && (
          <button
            onClick={handleClear}
            aria-label="Clear search"
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full
                       text-parchment-400 hover:text-parchment-700 hover:bg-parchment-100
                       transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}

export default SearchBar
