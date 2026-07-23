const STORAGE_KEY = 'boockly_reading_progress'

/**
 * Save reading progress with book metadata.
 * @param {string|number} bookId
 * @param {object} progress - { href, location, percentage, scrollPosition, format }
 * @param {object} [meta] - { title, author, coverImage, readFormat }
 */
export function saveReadingProgress(bookId, progress, meta = {}) {
  try {
    const allProgress = getAllReadingProgress()
    allProgress[bookId] = {
      ...progress,
      ...meta,
      timestamp: Date.now(),
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
  } catch (error) {
    console.error('Failed to save reading progress:', error)
  }
}

export function getReadingProgress(bookId) {
  try {
    const allProgress = getAllReadingProgress()
    return allProgress[bookId] || null
  } catch (error) {
    console.error('Failed to get reading progress:', error)
    return null
  }
}

export function getAllReadingProgress() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : {}
  } catch (error) {
    console.error('Failed to parse reading progress:', error)
    return {}
  }
}

export function clearReadingProgress(bookId) {
  try {
    const allProgress = getAllReadingProgress()
    delete allProgress[bookId]
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProgress))
  } catch (error) {
    console.error('Failed to clear reading progress:', error)
  }
}

/**
 * Get recently read books with metadata, sorted by most recent.
 */
export function getLastReadBooks(limit = 10) {
  try {
    const allProgress = getAllReadingProgress()
    return Object.entries(allProgress)
      .map(([bookId, progress]) => ({
        bookId,
        ...progress,
      }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
      .slice(0, limit)
  } catch (error) {
    console.error('Failed to get last read books:', error)
    return []
  }
}

/**
 * Check if a book has been read before.
 */
export function hasReadingProgress(bookId) {
  const progress = getReadingProgress(bookId)
  return progress !== null
}
