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

export function getBestReadFormat(formats) {
  if (!formats) return { type: null, url: null }
  for (const mime of READ_FORMAT_PRIORITY) {
    if (formats[mime]) {
      if (mime === 'text/html') return { type: 'html', url: formats[mime] }
      if (mime === 'application/pdf') return { type: 'pdf', url: formats[mime] }
      if (mime.startsWith('text/plain')) return { type: 'text', url: formats[mime] }
    }
  }
  if (formats['application/epub+zip']) {
    return { type: 'epub', url: formats['application/epub+zip'] }
  }
  return { type: null, url: null }
}

function pickDownloadUrl(formats) {
  for (const mime of DOWNLOAD_FORMAT_PRIORITY) {
    if (formats[mime]) return formats[mime]
  }
  return null
}

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

  return {
    id: result.id,
    title: result.title,
    author,
    category,
    description,
    coverImage: result.formats?.['image/jpeg'] || null,
    downloadUrl: pickDownloadUrl(result.formats || {}),
    readFormat: getBestReadFormat(result.formats || {}),
    formats: result.formats || {},
    rating: 0,
    totalRatings: 0,
  }
}

/**
 * Fetch books from Gutendex with optional search, topic, and pagination.
 */
export async function fetchBooks({ search = '', page = 1, topic = '' } = {}) {
  const params = new URLSearchParams()
  if (search) params.append('search', search)
  if (topic) params.append('topic', topic)
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
 * Fetch books from any Gutendex URL directly (used for the "next" URL).
 * Returns the same shape as fetchBooks: { count, next, previous, results }.
 */
export async function fetchByUrl(url) {
  const res = await fetch(url)
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
 * Fetch a single book by ID.
 */
export async function fetchBookById(bookId) {
  const res = await fetch(`${GUTENDEX_BASE}/${bookId}`)
  if (!res.ok) throw new Error('Failed to fetch book')
  const data = await res.json()
  return mapBook(data)
}

/**
 * Fetch books by multiple IDs (for "Recently Viewed" section).
 */
export async function fetchBooksByIds(ids) {
  if (!ids.length) return []
  const results = await Promise.allSettled(
    ids.slice(0, 10).map((id) => fetchBookById(id))
  )
  return results
    .filter((r) => r.status === 'fulfilled')
    .map((r) => r.value)
}

/**
 * Trending topics to fetch for "Trending" section.
 */
const TRENDING_TOPICS = ['fiction', 'science', 'philosophy', 'history', 'poetry']

export async function fetchTrendingBooks() {
  const topic = TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)]
  const res = await fetch(`${GUTENDEX_BASE}?topic=${topic}&page=1`)
  if (!res.ok) throw new Error('Failed to fetch trending books')
  const data = await res.json()
  return {
    topic,
    books: data.results.map(mapBook),
  }
}

/**
 * Fetch "Popular" books (page 1 of Gutendex, which is ordered by popularity).
 */
export async function fetchPopularBooks() {
  const res = await fetch(`${GUTENDEX_BASE}?page=1`)
  if (!res.ok) throw new Error('Failed to fetch popular books')
  const data = await res.json()
  return data.results.map(mapBook)
}

/**
 * Fetch "Recommended" books from random topic.
 */
const RECOMMEND_TOPICS = ['literature', 'adventure', 'mystery', 'romance', 'travel', 'nature', 'philosophy', 'biography']

export async function fetchRecommendedBooks() {
  const shuffled = RECOMMEND_TOPICS.sort(() => Math.random() - 0.5)
  const topics = shuffled.slice(0, 2)

  const results = await Promise.allSettled(
    topics.map((topic) =>
      fetch(`${GUTENDEX_BASE}?topic=${topic}&page=1`)
        .then((r) => r.json())
        .then((d) => d.results.map(mapBook))
    )
  )

  const books = results
    .filter((r) => r.status === 'fulfilled')
    .flatMap((r) => r.value)

  // Deduplicate by ID and shuffle
  const seen = new Set()
  const unique = books.filter((b) => {
    if (seen.has(b.id)) return false
    seen.add(b.id)
    return true
  })

  return unique.sort(() => Math.random() - 0.5).slice(0, 10)
}
