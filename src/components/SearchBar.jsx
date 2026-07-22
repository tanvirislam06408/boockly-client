import { useState, useEffect, useRef } from 'react'
import { Search } from 'lucide-react'

function SearchBar({ value, onChange, onSearch }) {
  const [localValue, setLocalValue] = useState(value)
  const timerRef = useRef(null)

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
    }, 300)
  }

  return (
    <div className="w-full max-w-xl mx-auto">
      <div className="relative">
        <Search
          size={18}
          className="absolute left-4 top-1/2 -translate-y-1/2 text-parchment-400 pointer-events-none"
        />
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder="Search by title or author..."
          className="w-full pl-11 pr-4 py-3 bg-white border border-parchment-300 rounded-full text-base text-parchment-900 placeholder:text-parchment-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-colors duration-150"
        />
      </div>
    </div>
  )
}

export default SearchBar
