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

// ─── Simple TTL cache for section fetches ─────────────────────
const sectionCache = new Map()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

function getCached(key) {
  const entry = sectionCache.get(key)
  if (entry && Date.now() - entry.ts < CACHE_TTL) return entry.data
  sectionCache.delete(key)
  return null
}

function setCached(key, data) {
  sectionCache.set(key, { data, ts: Date.now() })
}

// ─── Core fetch ───────────────────────────────────────────────

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

export async function fetchBookById(bookId) {
  const res = await fetch(`${GUTENDEX_BASE}/${bookId}`)
  if (!res.ok) throw new Error('Failed to fetch book')
  const data = await res.json()
  return mapBook(data)
}

// ─── Batch fetch with controlled concurrency ──────────────────

export async function fetchBooksByIds(ids) {
  if (!ids.length) return []

  const uniqueIds = [...new Set(ids)].slice(0, 8)

  // Check cache first
  const uncachedIds = uniqueIds.filter((id) => !getCached(`book:${id}`))
  const cached = uniqueIds
    .filter((id) => getCached(`book:${id}`))
    .map((id) => getCached(`book:${id}`))

  if (uncachedIds.length === 0) return cached

  // Fetch uncached with controlled concurrency (max 3 parallel)
  const results = []
  const CONCURRENCY = 3

  for (let i = 0; i < uncachedIds.length; i += CONCURRENCY) {
    const batch = uncachedIds.slice(i, i + CONCURRENCY)
    const batchResults = await Promise.allSettled(
      batch.map((id) => fetchBookById(id))
    )
    for (const r of batchResults) {
      if (r.status === 'fulfilled') {
        setCached(`book:${r.value.id}`, r.value)
        results.push(r.value)
      }
    }
  }

  return [...cached, ...results]
}

// ─── Section fetches with caching ─────────────────────────────

const TRENDING_TOPICS = ['fiction', 'science', 'philosophy', 'history', 'poetry']

export async function fetchTrendingBooks() {
  const topic = TRENDING_TOPICS[Math.floor(Math.random() * TRENDING_TOPICS.length)]
  const cacheKey = `trending:${topic}`

  const cached = getCached(cacheKey)
  if (cached) return cached

  const res = await fetch(`${GUTENDEX_BASE}?topic=${topic}&page=1`)
  if (!res.ok) throw new Error('Failed to fetch trending books')
  const data = await res.json()
  const result = {
    topic,
    books: data.results.map(mapBook),
  }
  setCached(cacheKey, result)
  return result
}

export async function fetchPopularBooks() {
  const cacheKey = 'popular'

  const cached = getCached(cacheKey)
  if (cached) return cached

  const res = await fetch(`${GUTENDEX_BASE}?page=1`)
  if (!res.ok) throw new Error('Failed to fetch popular books')
  const data = await res.json()
  const result = data.results.map(mapBook)
  setCached(cacheKey, result)
  return result
}

const RECOMMEND_TOPICS = ['literature', 'adventure', 'mystery', 'romance', 'travel', 'nature', 'philosophy', 'biography']

export async function fetchRecommendedBooks() {
  const cacheKey = 'recommended'

  const cached = getCached(cacheKey)
  if (cached) return cached

  const shuffled = [...RECOMMEND_TOPICS].sort(() => Math.random() - 0.5)
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

  const seen = new Set()
  const unique = books.filter((b) => {
    if (seen.has(b.id)) return false
    seen.add(b.id)
    return true
  })

  const result = unique.sort(() => Math.random() - 0.5).slice(0, 10)
  setCached(cacheKey, result)
  return result
}
