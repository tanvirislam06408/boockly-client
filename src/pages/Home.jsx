import { useState, useMemo, useCallback } from 'react'
import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import CategoryFilter from '../components/CategoryFilter'
import BookGrid from '../components/BookGrid'
import BookDetailsModal from '../components/BookDetailsModal'
import Footer from '../components/Footer'
import { mockBooks } from '../data/mockBooks'

function Home() {
  // Books state — structured to swap for an API call later
  const [books, setBooks] = useState(mockBooks)

  // Search state
  const [searchTerm, setSearchTerm] = useState('')
  const [appliedSearch, setAppliedSearch] = useState('')

  // Category state
  const [activeCategory, setActiveCategory] = useState('All')

  // Modal state
  const [selectedBook, setSelectedBook] = useState(null)

  // Filtered list
  const filteredBooks = useMemo(() => {
    let result = books

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
  }, [books, appliedSearch, activeCategory])

  // Optimistic rating update
  // newAverage = ((oldAverage * totalRatings) + newRating) / (totalRatings + 1)
  const handleRate = useCallback((bookId, ratingValue) => {
    setBooks((prev) =>
      prev.map((book) => {
        if (book.id !== bookId) return book

        const newTotalRatings = book.totalRatings + 1
        const newRating =
          (book.rating * book.totalRatings + ratingValue) / newTotalRatings

        return {
          ...book,
          rating: Math.round(newRating * 10) / 10,
          totalRatings: newTotalRatings,
        }
      })
    )

    // Update the selected book reference so the modal shows the new rating
    setSelectedBook((prev) => {
      if (!prev || prev.id !== bookId) return prev
      const newTotalRatings = prev.totalRatings + 1
      const newRating =
        (prev.rating * prev.totalRatings + ratingValue) / newTotalRatings
      return {
        ...prev,
        rating: Math.round(newRating * 10) / 10,
        totalRatings: newTotalRatings,
      }
    })
  }, [])

  const handleDownload = useCallback((book) => {
    // Placeholder — wire up real download later
    console.log('Download:', book.title)
  }, [])

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
        <BookGrid
          books={filteredBooks}
          onOpenDetails={setSelectedBook}
          onDownload={handleDownload}
        />
      </div>
      <Footer />

      <BookDetailsModal
        book={selectedBook}
        onClose={() => setSelectedBook(null)}
        onRate={handleRate}
        onDownload={handleDownload}
      />
    </div>
  )
}

export default Home
