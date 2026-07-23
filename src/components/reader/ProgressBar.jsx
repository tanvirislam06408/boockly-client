function ProgressBar({ current, total, theme }) {
  const percentage = total > 0 ? Math.round((current / total) * 100) : 0

  return (
    <div className="flex items-center gap-3 w-full">
      <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${
        theme === 'dark' ? 'bg-parchment-700' : 'bg-parchment-200'
      }`}>
        <div 
          className="h-full bg-brand-500 transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      
      <span className={`text-xs whitespace-nowrap ${
        theme === 'dark' ? 'text-parchment-400' : 'text-parchment-500'
      }`}>
        {current} / {total} ({percentage}%)
      </span>
    </div>
  )
}

export default ProgressBar