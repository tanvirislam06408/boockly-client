import { useState, useMemo } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CategoryFilter from '../components/CategoryFilter'
import BookGrid from '../components/BookGrid'
import Footer from '../components/Footer'
import { mockBooks } from '../data/mockBooks'

function Home() {
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filteredBooks = useMemo(() => {
    let result = mockBooks

    if (appliedSearch) {
      const q = appliedSearch.toLowerCase()
      result = result.filter(
        (book) =>
          book.title.toLowerCase().includes(q) ||
          book.author.toLowerCase().includes(q)
      )
    }

    if (activeCategory !== 'All') {
      result = result.filter((book) => book.category === activeCategory)
    }

    return result
  }, [appliedSearch, activeCategory])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        onSearch={setAppliedSearch}
      />
      <CategoryFilter
        activeCategory={activeCategory}
        onSelect={setActiveCategory}
      />
      <div className="flex-1">
        <BookGrid books={filteredBooks} />
      </div>
      <Footer />
    </div>
  )
}

export default Home
