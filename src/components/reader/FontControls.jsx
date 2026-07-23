import { Minus, Plus } from 'lucide-react'

function FontControls({ fontSize, fontFamily, onFontSizeChange, onFontFamilyChange, theme }) {
  const fontFamilies = [
    { value: 'serif', label: 'Serif' },
    { value: 'sans-serif', label: 'Sans Serif' },
    { value: 'monospace', label: 'Monospace' },
    { value: 'cursive', label: 'Cursive' }
  ]

  const decreaseFontSize = () => {
    if (fontSize > 70) {
      onFontSizeChange(fontSize - 10)
    }
  }

  const increaseFontSize = () => {
    if (fontSize < 150) {
      onFontSizeChange(fontSize + 10)
    }
  }

  return (
    <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 rounded-lg shadow-lg min-w-[280px] ${
      theme === 'dark' ? 'bg-parchment-800 border border-parchment-700' : 
      theme === 'sepia' ? 'bg-parchment-100 border border-parchment-300' : 
      'bg-white border border-parchment-200'
    }`}>
      <h3 className={`text-sm font-medium mb-3 ${
        theme === 'dark' ? 'text-parchment-200' : 'text-parchment-700'
      }`}>
        Font Settings
      </h3>
      
      {/* Font Size Control */}
      <div className="mb-4">
        <label className={`text-xs mb-2 block ${
          theme === 'dark' ? 'text-parchment-400' : 'text-parchment-500'
        }`}>
          Font Size: {fontSize}%
        </label>
        <div className="flex items-center gap-3">
          <button
            onClick={decreaseFontSize}
            disabled={fontSize <= 70}
            className={`p-1.5 rounded-lg transition-colors ${
              fontSize <= 70 
                ? 'opacity-50 cursor-not-allowed' 
                : theme === 'dark' 
                  ? 'hover:bg-parchment-700 text-parchment-200' 
                  : 'hover:bg-parchment-200 text-parchment-700'
            }`}
            aria-label="Decrease font size"
          >
            <Minus size={14} />
          </button>
          
          <div className={`flex-1 h-2 rounded-full overflow-hidden ${
            theme === 'dark' ? 'bg-parchment-700' : 'bg-parchment-200'
          }`}>
            <div 
              className="h-full bg-brand-500 transition-all duration-200"
              style={{ width: `${((fontSize - 70) / 80) * 100}%` }}
            />
          </div>
          
          <button
            onClick={increaseFontSize}
            disabled={fontSize >= 150}
            className={`p-1.5 rounded-lg transition-colors ${
              fontSize >= 150 
                ? 'opacity-50 cursor-not-allowed' 
                : theme === 'dark' 
                  ? 'hover:bg-parchment-700 text-parchment-200' 
                  : 'hover:bg-parchment-200 text-parchment-700'
            }`}
            aria-label="Increase font size"
          >
            <Plus size={14} />
          </button>
        </div>
      </div>

      {/* Font Family Control */}
      <div>
        <label className={`text-xs mb-2 block ${
          theme === 'dark' ? 'text-parchment-400' : 'text-parchment-500'
        }`}>
          Font Family
        </label>
        <div className="grid grid-cols-2 gap-2">
          {fontFamilies.map((font) => (
            <button
              key={font.value}
              onClick={() => onFontFamilyChange(font.value)}
              className={`px-3 py-2 rounded-lg text-sm transition-colors ${
                fontFamily === font.value
                  ? 'bg-brand-100 text-brand-600 border border-brand-200'
                  : theme === 'dark'
                    ? 'bg-parchment-700 text-parchment-200 hover:bg-parchment-600'
                    : 'bg-parchment-100 text-parchment-700 hover:bg-parchment-200'
              }`}
            >
              {font.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FontControls