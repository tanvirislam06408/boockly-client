import { useState } from 'react'
import { BookOpen, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle } from 'lucide-react'

function AdminBooksTable({ books, onEdit, onDelete }) {
  const [sortBy, setSortBy] = useState(null) // 'title' | 'rating' | null
  const [sortDir, setSortDir] = useState('asc')
  const [pendingDelete, setPendingDelete] = useState(null) // book id

  function handleSort(field) {
    if (sortBy === field) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(field)
      setSortDir('asc')
    }
  }

  const sortedBooks = [...books].sort((a, b) => {
    if (!sortBy) return 0
    const mul = sortDir === 'asc' ? 1 : -1
    if (sortBy === 'title') return mul * a.title.localeCompare(b.title)
    if (sortBy === 'rating') return mul * (a.rating - b.rating)
    return 0
  })

  function SortIcon({ field }) {
    if (sortBy !== field) return <ArrowUpDown size={12} className="text-parchment-400" />
    return sortDir === 'asc'
      ? <ArrowUp size={12} className="text-brand-500" />
      : <ArrowDown size={12} className="text-brand-500" />
  }

  if (books.length === 0) {
    return (
      <div className="bg-parchment-200/50 border border-parchment-300/60 rounded-card p-12">
        <div className="text-center">
          <BookOpen size={40} className="mx-auto text-parchment-300 mb-3" />
          <p className="font-display text-lg text-parchment-600 mb-1">No books uploaded yet.</p>
          <p className="text-sm text-parchment-500">Use the form above to add books to the collection.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-parchment-200/50 border border-parchment-300/60 rounded-card p-6 sm:p-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-olive-500/10">
          <BookOpen size={18} className="text-olive-600" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-parchment-900">Books Inventory</h2>
          <p className="text-xs text-parchment-500">{books.length} book{books.length !== 1 ? 's' : ''} in collection</p>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block overflow-x-auto -mx-6 sm:-mx-8">
        <table className="w-full text-left min-w-[640px]">
          <thead>
            <tr className="border-b border-parchment-300/60">
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide">Cover</th>
              <th>
                <button
                  onClick={() => handleSort('title')}
                  className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide flex items-center gap-1.5 hover:text-parchment-700 transition-colors"
                >
                  Title <SortIcon field="title" />
                </button>
              </th>
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide">Author</th>
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide">Category</th>
              <th>
                <button
                  onClick={() => handleSort('rating')}
                  className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide flex items-center gap-1.5 hover:text-parchment-700 transition-colors"
                >
                  Rating <SortIcon field="rating" />
                </button>
              </th>
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedBooks.map((book) => (
              <tr key={book.id} className="border-b border-parchment-300/40 last:border-0 hover:bg-parchment-100/60 transition-colors">
                <td className="py-3 px-6">
                  <img src={book.coverImage} alt="" className="w-10 h-14 object-cover rounded shadow-sm" aria-hidden="true" />
                </td>
                <td className="py-3 px-6 text-sm font-medium text-parchment-900 max-w-[200px] truncate">{book.title}</td>
                <td className="py-3 px-6 text-sm text-parchment-600">{book.author}</td>
                <td className="py-3 px-6"><span className="badge">{book.category}</span></td>
                <td className="py-3 px-6 text-sm text-parchment-700">
                  {book.rating} <span className="text-parchment-400">({book.totalRatings.toLocaleString()})</span>
                </td>
                <td className="py-3 px-6">
                  <div className="flex items-center justify-end gap-1">
                    {pendingDelete === book.id ? (
                      <div className="flex items-center gap-2 animate-fade-in">
                        <span className="text-xs text-parchment-600 whitespace-nowrap">Delete <strong>{book.title}</strong>?</span>
                        <button
                          onClick={() => { onDelete(book.id); setPendingDelete(null) }}
                          className="text-xs font-medium text-white bg-red-500 hover:bg-red-600 px-2.5 py-1 rounded transition-colors"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setPendingDelete(null)}
                          className="text-xs font-medium text-parchment-600 hover:text-parchment-900 px-2.5 py-1 rounded hover:bg-parchment-200 transition-colors"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <>
                        <button
                          onClick={() => onEdit(book)}
                          className="p-1.5 rounded-lg text-parchment-400 hover:text-brand-600 hover:bg-brand-500/10 transition-colors"
                          title="Edit"
                        >
                          <Pencil size={14} />
                        </button>
                        <button
                          onClick={() => setPendingDelete(book.id)}
                          className="p-1.5 rounded-lg text-parchment-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={14} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {sortedBooks.map((book) => (
          <div key={book.id} className="bg-parchment-100/60 rounded-lg p-3 flex gap-3">
            <img src={book.coverImage} alt="" className="w-14 h-20 object-cover rounded shadow-sm shrink-0" aria-hidden="true" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-parchment-900 truncate">{book.title}</h4>
              <p className="text-xs text-parchment-700 truncate">{book.author}</p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="badge text-[10px]">{book.category}</span>
                <span className="text-[10px] text-parchment-500">{book.rating} ★</span>
              </div>

              {pendingDelete === book.id ? (
                <div className="flex items-center gap-2 mt-2 animate-fade-in">
                  <AlertTriangle size={12} className="text-red-500 shrink-0" />
                  <span className="text-[11px] text-parchment-600">Delete?</span>
                  <button
                    onClick={() => { onDelete(book.id); setPendingDelete(null) }}
                    className="text-[11px] font-medium text-white bg-red-500 hover:bg-red-600 px-2 py-0.5 rounded transition-colors"
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => setPendingDelete(null)}
                    className="text-[11px] font-medium text-parchment-600 hover:text-parchment-900 px-2 py-0.5 rounded hover:bg-parchment-200 transition-colors"
                  >
                    No
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1 mt-2">
                  <button
                    onClick={() => onEdit(book)}
                    className="p-1 rounded text-parchment-400 hover:text-brand-600 hover:bg-brand-500/10 transition-colors"
                  >
                    <Pencil size={12} />
                  </button>
                  <button
                    onClick={() => setPendingDelete(book.id)}
                    className="p-1 rounded text-parchment-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                  >
                    <Trash2 size={12} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AdminBooksTable
