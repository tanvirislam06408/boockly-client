function Footer() {
  return (
    <footer className="border-t border-parchment-300/60 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-parchment-700">
        <p>
          <span className="font-display font-semibold text-parchment-900">Bookly</span>
          {' '}— a free digital library. No signup required.
        </p>

        <div className="flex items-center gap-4">
          <a href="#" className="hover:text-parchment-900 transition-colors duration-150">
            GitHub
          </a>
          <a href="#" className="hover:text-parchment-900 transition-colors duration-150">
            Fiction
          </a>
          <a href="#" className="hover:text-parchment-900 transition-colors duration-150">
            Science
          </a>
          <a href="#" className="hover:text-parchment-900 transition-colors duration-150">
            Technology
          </a>
        </div>
      </div>
    </footer>
  )
}

export default Footer
