function StarIcon({ filled }) {
  return (
    <svg
      width="28"
      height="28"
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}

const numbers = [1, 2, 3, 4, 5]

// Give it onChange to make it clickable. Leave onChange out to just show a rating.
function StarRating({ value = 0, onChange }) {
  if (!onChange) {
    return (
      <span className="stars" role="img" aria-label={`Rated ${value} out of 5`}>
        {numbers.map((number) => (
          <span key={number} className={`star ${number <= value ? 'on' : ''}`}>
            <StarIcon filled={number <= value} />
          </span>
        ))}
      </span>
    )
  }

  return (
    <div className="stars" role="group" aria-label="Rating">
      {numbers.map((number) => (
        <button
          key={number}
          type="button"
          className={number <= value ? 'on' : ''}
          aria-label={`${number} ${number === 1 ? 'star' : 'stars'}`}
          aria-pressed={number === value}
          onClick={() => onChange(number)}
        >
          <StarIcon filled={number <= value} />
        </button>
      ))}
    </div>
  )
}

export default StarRating