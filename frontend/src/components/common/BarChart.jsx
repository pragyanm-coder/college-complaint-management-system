import './BarChart.css'

function BarChart({ items }) {
  const largest = Math.max(1, ...items.map((item) => item.value))

  return (
    <ul className="bar-chart">
      {items.map((item) => (
        <li key={item.label}>
          <span className="bar-label">{item.label}</span>
          <span className="bar-track">
            <span className="bar-fill" style={{ width: `${(item.value / largest) * 100}%` }} />
          </span>
          <span className="bar-value">{item.value}</span>
        </li>
      ))}
    </ul>
  )
}

export default BarChart