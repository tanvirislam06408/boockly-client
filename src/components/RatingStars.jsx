import { useState } from 'react'
import { Star } from 'lucide-react'

function RatingStars({ rating, size = 14, interactive = false, onRate }) {
  const [hovered, setHovered] = useState(0)

  function handleClick(value) {
    if (interactive && onRate) {
      onRate(value)
    }
  }

  const displayRating = interactive && hovered > 0 ? hovered : rating

  return (
    <span
      className="inline-flex items-center gap-0.5"
      onMouseLeave={() => interactive && setHovered(0)}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        const filled = displayRating >= i
        const half = !filled && displayRating >= i - 0.5

        return (
          <button
            key={i}
            type="button"
            disabled={!interactive}
            onClick={() => handleClick(i)}
            onMouseEnter={() => interactive && setHovered(i)}
            className={`relative inline-flex items-center justify-center ${
              interactive
                ? 'cursor-pointer hover:scale-110 transition-transform duration-100'
                : 'cursor-default'
            }`}
            style={{ width: size, height: size }}
            aria-label={interactive ? `Rate ${i} star${i > 1 ? 's' : ''}` : undefined}
          >
            {/* Background (empty) star */}
            <Star size={size} className="absolute inset-0 text-parchment-300" />

            {/* Filled portion */}
            {(filled || half) && (
              <span
                className="absolute inset-0 overflow-hidden"
                style={{ width: filled ? '100%' : '50%' }}
              >
                <Star size={size} className="fill-brand-400 text-brand-400" />
              </span>
            )}
          </button>
        )
      })}
    </span>
  )
}

export default RatingStars
