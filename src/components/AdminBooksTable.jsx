function AdminBooksTable({ books }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Books Inventory</h2>
      <table className="w-full text-left">
        <thead>
          <tr className="border-b">
            <th className="py-2 px-4 font-medium">Title</th>
            <th className="py-2 px-4 font-medium">Author</th>
            <th className="py-2 px-4 font-medium">Category</th>
            <th className="py-2 px-4 font-medium">Rating</th>
            <th className="py-2 px-4 font-medium">Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="border-b hover:bg-gray-50">
              <td className="py-3 px-4">{book.title}</td>
              <td className="py-3 px-4">{book.author}</td>
              <td className="py-3 px-4">
                <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                  {book.category}
                </span>
              </td>
              <td className="py-3 px-4">{book.rating}</td>
              <td className="py-3 px-4">
                <button className="text-red-600 hover:text-red-800 text-sm">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default AdminBooksTable
