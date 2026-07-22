import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import SearchBar from '../components/SearchBar'
import CategoryFilter from '../components/CategoryFilter'
import BookGrid from '../components/BookGrid'
import Footer from '../components/Footer'
import { mockBooks } from '../data/mockBooks'

function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <SearchBar />
      <CategoryFilter />
      <BookGrid books={mockBooks} />
      <Footer />
    </div>
  )
}

export default Home
