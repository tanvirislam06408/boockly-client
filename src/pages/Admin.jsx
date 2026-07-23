import { useState } from 'react'
import { Lock } from 'lucide-react'
import Navbar from '../components/layout/Navbar'
import AdminUploadForm from '../components/AdminUploadForm'
import AdminBooksTable from '../components/AdminBooksTable'
import Footer from '../components/layout/Footer'

function AdminGate({ onUnlock }) {
  const [key, setKey] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const trimmed = key.trim()
    if (!trimmed) {
      setError('Please enter an admin key')
      return
    }
    sessionStorage.setItem('bookly_admin_key', trimmed)
    onUnlock()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="bg-parchment-200/50 border border-parchment-300/60 rounded-card p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-parchment-300/50 mb-4">
              <Lock size={20} className="text-parchment-600" />
            </div>
            <h1 className="font-display text-xl font-semibold text-parchment-900 mb-1">Admin Access</h1>
            <p className="text-sm text-parchment-700 mb-6">Enter your admin key to continue</p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="password"
                value={key}
                onChange={(e) => { setKey(e.target.value); setError('') }}
                placeholder="Admin key"
                autoFocus
                className="w-full px-3 py-2.5 bg-white border border-parchment-300 rounded-lg text-sm text-parchment-900
                           placeholder:text-parchment-400 transition-colors duration-150
                           focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500"
              />
              {error && <p className="text-xs text-red-500">{error}</p>}
              <button type="submit" className="btn-primary w-full">
                Enter
              </button>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

function AdminPanel() {
  const [books, setBooks] = useState([])
  const [editingBook, setEditingBook] = useState(null)

  function handleUpload(formData, bookId) {
    const data = Object.fromEntries(formData.entries())

    if (bookId) {
      setBooks((prev) =>
        prev.map((b) =>
          b.id === bookId
            ? { ...b, title: data.title, author: data.author, category: data.category, description: data.description }
            : b
        )
      )
    } else {
      const newBook = {
        id: Date.now(),
        title: data.title,
        author: data.author,
        category: data.category,
        description: data.description,
        coverImage: data.coverImage ? URL.createObjectURL(data.coverImage) : 'https://picsum.photos/seed/newbook/300/450',
        rating: 0,
        totalRatings: 0,
      }
      setBooks((prev) => [newBook, ...prev])
    }

    setEditingBook(null)
  }

  function handleDelete(bookId) {
    setBooks((prev) => prev.filter((b) => b.id !== bookId))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        <div>
          <h1 className="font-display text-xl font-bold text-parchment-900">Manage Books</h1>
          <p className="text-xs text-parchment-500 mt-0.5">Add, edit, or remove books from the collection</p>
        </div>

        <AdminUploadForm
          onSubmit={handleUpload}
          editingBook={editingBook}
          onCancelEdit={() => setEditingBook(null)}
        />

        <AdminBooksTable
          books={books}
          onEdit={setEditingBook}
          onDelete={handleDelete}
        />
      </main>
      <Footer />
    </div>
  )
}

function Admin() {
  const [unlocked, setUnlocked] = useState(
    () => !!sessionStorage.getItem('bookly_admin_key')
  )

  if (!unlocked) {
    return <AdminGate onUnlock={() => setUnlocked(true)} />
  }

  return <AdminPanel />
}

export default Admin
