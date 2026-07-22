import SearchBar from './SearchBar'

function Hero({ searchValue, onSearchChange, onSearch }) {
  return (
    <section className="pt-16 pb-12 sm:pt-20 sm:pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="font-display text-4xl sm:text-5xl font-bold text-parchment-900 leading-tight mb-3">
          Read freely. No account needed.
        </h1>
        <p className="text-parchment-600 text-lg mb-10">
          Browse the collection, find something you love, and start reading.
        </p>

        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSearch={onSearch}
        />
      </div>
    </section>
  )
}

export default Hero
