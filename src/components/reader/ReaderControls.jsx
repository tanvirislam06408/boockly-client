import { useState } from 'react'
import { Settings, Type, Palette } from 'lucide-react'
import FontControls from './FontControls'
import ThemeSelector from './ThemeSelector'

function ReaderControls({ fontSize, fontFamily, theme, onFontSizeChange, onFontFamilyChange, onThemeChange }) {
  const [activePanel, setActivePanel] = useState(null)

  const togglePanel = (panel) => {
    setActivePanel(activePanel === panel ? null : panel)
  }

  return (
    <div className="relative">
      {/* Control buttons */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => togglePanel('font')}
          className={`p-2 rounded-lg transition-colors ${
            activePanel === 'font' 
              ? 'bg-brand-100 text-brand-600' 
              : theme === 'dark' 
                ? 'hover:bg-parchment-700 text-parchment-200' 
                : 'hover:bg-parchment-200 text-parchment-700'
          }`}
          aria-label="Font settings"
        >
          <Type size={18} />
        </button>
        
        <button
          onClick={() => togglePanel('theme')}
          className={`p-2 rounded-lg transition-colors ${
            activePanel === 'theme' 
              ? 'bg-brand-100 text-brand-600' 
              : theme === 'dark' 
                ? 'hover:bg-parchment-700 text-parchment-200' 
                : 'hover:bg-parchment-200 text-parchment-700'
          }`}
          aria-label="Theme settings"
        >
          <Palette size={18} />
        </button>
      </div>

      {/* Panels */}
      {activePanel === 'font' && (
        <FontControls
          fontSize={fontSize}
          fontFamily={fontFamily}
          onFontSizeChange={onFontSizeChange}
          onFontFamilyChange={onFontFamilyChange}
          theme={theme}
        />
      )}
      
      {activePanel === 'theme' && (
        <ThemeSelector
          currentTheme={theme}
          onThemeChange={onThemeChange}
        />
      )}
    </div>
  )
}

export default ReaderControls