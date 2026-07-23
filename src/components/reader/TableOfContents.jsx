import { X, ChevronRight } from 'lucide-react'

function TableOfContents({ toc, onSelect, isOpen, onClose, theme }) {
  if (!isOpen) return null

  return (
    <div className={`w-80 h-full border-r overflow-y-auto ${
      theme === 'dark' ? 'border-parchment-700 bg-parchment-800' : 
      theme === 'sepia' ? 'border-parchment-300 bg-parchment-100' : 
      'border-parchment-200 bg-white'
    }`}>
      <div className={`flex items-center justify-between p-4 border-b ${
        theme === 'dark' ? 'border-parchment-700' : 'border-parchment-200'
      }`}>
        <h2 className={`font-display font-semibold ${
          theme === 'dark' ? 'text-parchment-100' : 'text-parchment-900'
        }`}>
          Table of Contents
        </h2>
        <button
          onClick={onClose}
          className={`p-1 rounded-lg transition-colors ${
            theme === 'dark' ? 'hover:bg-parchment-700 text-parchment-200' : 
            'hover:bg-parchment-200 text-parchment-700'
          }`}
          aria-label="Close table of contents"
        >
          <X size={18} />
        </button>
      </div>
      
      <nav className="p-4">
        {toc.length === 0 ? (
          <p className={`text-sm ${theme === 'dark' ? 'text-parchment-400' : 'text-parchment-500'}`}>
            No table of contents available
          </p>
        ) : (
          <ul className="space-y-1">
            {toc.map((item, index) => (
              <li key={index}>
                <button
                  onClick={() => {
                    onSelect(item.href)
                    onClose()
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg transition-colors flex items-center gap-2 ${
                    theme === 'dark' 
                      ? 'hover:bg-parchment-700 text-parchment-200' 
                      : 'hover:bg-parchment-100 text-parchment-700'
                  }`}
                >
                  <ChevronRight size={14} className={`shrink-0 ${
                    theme === 'dark' ? 'text-parchment-400' : 'text-parchment-400'
                  }`} />
                  <span className="text-sm truncate">{item.label}</span>
                </button>
                
                {item.subitems && item.subitems.length > 0 && (
                  <ul className="ml-6 mt-1 space-y-1">
                    {item.subitems.map((subitem, subIndex) => (
                      <li key={subIndex}>
                        <button
                          onClick={() => {
                            onSelect(subitem.href)
                            onClose()
                          }}
                          className={`w-full text-left px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2 ${
                            theme === 'dark' 
                              ? 'hover:bg-parchment-700 text-parchment-300' 
                              : 'hover:bg-parchment-100 text-parchment-600'
                          }`}
                        >
                          <ChevronRight size={12} className={`shrink-0 ${
                            theme === 'dark' ? 'text-parchment-500' : 'text-parchment-400'
                          }`} />
                          <span className="text-xs truncate">{subitem.label}</span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        )}
      </nav>
    </div>
  )
}

export default TableOfContents