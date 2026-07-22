import { X } from 'lucide-react'

function BookDetailsModal({ book, onClose }) {
  if (!book) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full mx-4 p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        <div className="flex gap-6">
          <img
            src={book.coverImage}
            alt={book.title}
            className="w-40 h-56 object-cover rounded"
          />
          <div>
            <h2 className="text-2xl font-bold mb-2">{book.title}</h2>
            <p className="text-gray-600 mb-4">{book.author}</p>
            <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded mb-4">
              {book.category}
            </span>
            <p className="text-gray-700 mb-4">{book.description}</p>
            <div className="text-sm text-gray-500">
              Rating: {book.rating} ({book.totalRatings} ratings)
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookDetailsModal
