import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

export default api

const GUTENDEX_BASE = 'https://gutendex.com/books'

function pickDownloadUrl(formats) {
  const priority = [
    'application/epub+zip',
    'application/pdf',
    'text/plain; charset=utf-8',
  ]
  for (const mime of priority) {
    if (formats[mime]) return formats[mime]
  }
  return null
}

function mapBook(result) {
  const author = result.authors?.[0]?.name || 'Unknown Author'
  const subjects = result.subjects || []
  const bookshelves = result.bookshelves || []
  const category = subjects[0] || bookshelves[0] || 'General'
  const description = subjects.length
    ? subjects.join(', ')
    : `A book by ${author}.`

  return {
    id: result.id,
    title: result.title,
    author,
    category,
    description,
    coverImage: result.formats?.['image/jpeg'] || null,
    downloadUrl: pickDownloadUrl(result.formats || {}),
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
