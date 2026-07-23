const PREFS_KEY = 'boockly_user_preferences'

const DEFAULTS = {
  theme: 'light',       // 'light' | 'dark' | 'sepia'
  fontSize: 18,         // px
  lineHeight: 1.8,      // multiplier
  fontFamily: 'serif',  // 'serif' | 'sans-serif' | 'monospace'
}

function getAll() {
  try {
    const stored = localStorage.getItem(PREFS_KEY)
    return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

function save(prefs) {
  try {
    localStorage.setItem(PREFS_KEY, JSON.stringify(prefs))
  } catch (e) {
    console.error('Failed to save preferences:', e)
  }
}

export function getTheme() {
  return getAll().theme
}

export function setTheme(theme) {
  const prefs = getAll()
  prefs.theme = theme
  save(prefs)
}

export function getFontSize() {
  return getAll().fontSize
}

export function setFontSize(fontSize) {
  const prefs = getAll()
  prefs.fontSize = fontSize
  save(prefs)
}

export function getLineHeight() {
  return getAll().lineHeight
}

export function setLineHeight(lineHeight) {
  const prefs = getAll()
  prefs.lineHeight = lineHeight
  save(prefs)
}

export function getFontFamily() {
  return getAll().fontFamily
}

export function setFontFamily(fontFamily) {
  const prefs = getAll()
  prefs.fontFamily = fontFamily
  save(prefs)
}

export function getAllPreferences() {
  return getAll()
}

export function updatePreferences(updates) {
  const prefs = getAll()
  Object.assign(prefs, updates)
  save(prefs)
  return prefs
}
