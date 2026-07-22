import { Star } from 'lucide-react'

function RatingStars({ rating, size = 14 }) {
  const stars = []

  for (let i = 1; i <= 5; i++) {
    if (rating >= i) {
      stars.push(
        <Star
          key={i}
          size={size}
          className="fill-brand-400 text-brand-400"
        />
      )
    } else if (rating >= i - 0.5) {
      stars.push(
        <span key={i} className="relative inline-block" style={{ width: size, height: size }}>
          <Star size={size} className="absolute inset-0 text-parchment-300" />
          <span className="absolute inset-0 overflow-hidden" style={{ width: '50%' }}>
            <Star size={size} className="fill-brand-400 text-brand-400" />
          </span>
        </span>
      )
    } else {
      stars.push(
        <Star
          key={i}
          size={size}
          className="text-parchment-300"
        />
      )
    }
  }

  return <span className="inline-flex items-center gap-0.5">{stars}</span>
}

export default RatingStars
