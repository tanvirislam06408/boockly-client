function BookCard({ book }) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img
        src={book.coverImage}
        alt={book.title}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="font-semibold text-lg mb-1">{book.title}</h3>
        <p className="text-gray-600 text-sm mb-2">{book.author}</p>
        <span className="inline-block px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
          {book.category}
        </span>
      </div>
    </div>
  )
}

export default BookCard
