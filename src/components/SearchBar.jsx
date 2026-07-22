function SearchBar() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <input
        type="text"
        placeholder="Search books..."
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />
    </div>
  )
}

export default SearchBar
