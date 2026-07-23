import { useParams, useNavigate, useSearchParams } from 'react-router-dom'
import EpubReader from '../components/reader/EpubReader'

function Reader() {
  const { bookId } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  
  const bookUrl = searchParams.get('url')
  const bookTitle = searchParams.get('title')

  const handleClose = () => {
    navigate(-1)
  }

  if (!bookUrl) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-parchment-50">
        <div className="text-center p-8">
          <h1 className="font-display text-2xl font-bold text-parchment-900 mb-4">
            No Book Selected
          </h1>
          <p className="text-parchment-600 mb-6">
            Please select a book to read from the library.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Go to Library
          </button>
        </div>
      </div>
    )
  }

  return (
    <EpubReader
      bookUrl={bookUrl}
      bookId={bookId}
      bookTitle={bookTitle}
      onClose={handleClose}
    />
  )
}

export default Reader