import { BookOpen } from 'lucide-react'

function AdminBooksTable({ books }) {
  return (
    <div className="bg-parchment-200/50 border border-parchment-300/60 rounded-card p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-5">
        <div className="p-2 rounded-lg bg-olive-500/10">
          <BookOpen size={18} className="text-olive-600" />
        </div>
        <div>
          <h2 className="font-display text-lg font-semibold text-parchment-900">Books Inventory</h2>
          <p className="text-xs text-parchment-500">{books.length} book{books.length !== 1 ? 's' : ''} in collection</p>
        </div>
      </div>

      <div className="overflow-x-auto -mx-6 sm:-mx-8">
        <table className="w-full text-left min-w-[540px]">
          <thead>
            <tr className="border-b border-parchment-300/60">
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide">Title</th>
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide">Author</th>
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide">Category</th>
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide">Rating</th>
              <th className="py-2.5 px-6 text-xs font-medium text-parchment-500 uppercase tracking-wide">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.id} className="border-b border-parchment-300/40 last:border-0 hover:bg-parchment-100/60 transition-colors">
                <td className="py-3 px-6 text-sm font-medium text-parchment-900">{book.title}</td>
                <td className="py-3 px-6 text-sm text-parchment-600">{book.author}</td>
                <td className="py-3 px-6">
                  <span className="badge">{book.category}</span>
                </td>
                <td className="py-3 px-6 text-sm text-parchment-700">{book.rating}</td>
                <td className="py-3 px-6">
                  <button className="text-sm text-red-500 hover:text-red-700 font-medium transition-colors">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default AdminBooksTable
