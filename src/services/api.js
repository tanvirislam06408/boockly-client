import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default api

const GUTENDEX_BASE = 'https://gutendex.com/books'

// Format priority for reading (highest to lowest)
const READ_FORMAT_PRIORITY = [
  'text/html',
  'application/pdf',
  'text/plain; charset=utf-8',
  'text/plain',
]

// Format priority for download (EPUB first for offline reading)
const DOWNLOAD_FORMAT_PRIORITY = [
  'application/epub+zip',
  'application/pdf',
  'text/plain; charset=utf-8',
  'text/plain',
]

/**
 * Detect the best reading format from Gutendex formats object.
 * Returns { type: 'html'|'pdf'|'text'|'epub'|null, url: string|null }
 */
export function getBestReadFormat(formats) {
  if (!formats) return { type: null, url: null }

  for (const mime of READ_FORMAT_PRIORITY) {
    if (formats[mime]) {
      if (mime === 'text/html') return { type: 'html', url: formats[mime] }
      if (mime === 'application/pdf') return { type: 'pdf', url: formats[mime] }
      if (mime.startsWith('text/plain')) return { type: 'text', url: formats[mime] }
    }
  }

  // Fallback: check for EPUB (can't read in browser, offer download)
  if (formats['application/epub+zip']) {
    return { type: 'epub', url: formats['application/epub+zip'] }
  }

  return { type: null, url: null }
}

/**
 * Get the best download URL (prefers EPUB for offline readers).
 */
function pickDownloadUrl(formats) {
  for (const mime of DOWNLOAD_FORMAT_PRIORITY) {
    if (formats[mime]) return formats[mime]
  }
  return null
}

/**
 * Check if a format is readable in-browser (not just downloadable).
 */
export function isReadableFormat(formats) {
  if (!formats) return false
  return READ_FORMAT_PRIORITY.some((mime) => !!formats[mime])
}

function mapBook(result) {
  const author = result.authors?.[0]?.name || 'Unknown Author'
  const subjects = result.subjects || []
  const bookshelves = result.bookshelves || []
  const category = subjects[0] || bookshelves[0] || 'General'
  const description = subjects.length
    ? subjects.join(', ')
    : `A book by ${author}.`

  const readFormat = getBestReadFormat(result.formats || {})

  return {
    id: result.id,
    title: result.title,
    author,
    category,
    description,
    coverImage: result.formats?.['image/jpeg'] || null,
    downloadUrl: pickDownloadUrl(result.formats || {}),
    readFormat,
    formats: result.formats || {},
    // Gutendex has no ratings — default to 0/0
    rating: 0,
    totalRatings: 0,
  }
}

export async function fetchBooks({ search = '', page = 1 } = {}) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  params.append('page', page)

  const res = await fetch(`${GUTENDEX_BASE}?${params.toString()}`)
  if (!res.ok) throw new Error('Failed to fetch books')
  const data = await res.json()

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results.map(mapBook),
  }
}

/**
 * Fetch a single book by ID from Gutendex.
 */
export async function fetchBookById(bookId) {
  const res = await fetch(`${GUTENDEX_BASE}/${bookId}`)
  if (!res.ok) throw new Error('Failed to fetch book')
  const data = await res.json()
  return mapBook(data)
}
