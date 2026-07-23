import { Sun, Moon, Coffee } from 'lucide-react'

function ThemeSelector({ currentTheme, onThemeChange }) {
  const themes = [
    { id: 'light', label: 'Light', icon: Sun, colors: 'bg-white border-parchment-200' },
    { id: 'dark', label: 'Dark', icon: Moon, colors: 'bg-parchment-800 border-parchment-700' },
    { id: 'sepia', label: 'Sepia', icon: Coffee, colors: 'bg-parchment-100 border-parchment-300' }
  ]

  return (
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 p-4 rounded-lg shadow-lg min-w-[280px] bg-white border border-parchment-200">
      <h3 className="text-sm font-medium mb-3 text-parchment-700">
        Theme
      </h3>
      
      <div className="grid grid-cols-3 gap-3">
        {themes.map((theme) => {
          const Icon = theme.icon
          return (
            <button
              key={theme.id}
              onClick={() => onThemeChange(theme.id)}
              className={`flex flex-col items-center gap-2 p-3 rounded-lg transition-colors ${
                currentTheme === theme.id
                  ? 'bg-brand-100 text-brand-600 border-2 border-brand-200'
                  : `${theme.colors} hover:bg-parchment-100`
              }`}
            >
              <Icon size={20} />
              <span className="text-xs font-medium">{theme.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default ThemeSelector