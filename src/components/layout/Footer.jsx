import { BookOpen } from 'lucide-react'

function Footer() {
  return (
    <footer className="border-t border-parchment-300/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <BookOpen size={16} className="text-brand-500" />
            <span className="font-display font-semibold text-parchment-900">Bookly</span>
            <span className="text-parchment-500 text-sm">— a free digital library</span>
          </div>

          <div className="flex items-center gap-5 text-sm text-parchment-600">
            <a href="https://www.gutenberg.org" target="_blank" rel="noopener noreferrer" className="hover:text-parchment-900 transition-colors">
              Project Gutenberg
            </a>
            <span className="text-parchment-300">·</span>
            <span>Powered by Gutendex API</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-parchment-300/40 text-center text-xs text-parchment-400">
          All books are in the public domain. No account required.
        </div>
      </div>
    </footer>
  )
}

export default Footer
