import Icon from './Icon'

function StatCard({ icon, label, value, tone = 'blue' }) {
  return (
    <div className="card stat-card">
      <span className={`stat-icon tone-${tone}`}>
        <Icon name={icon} />
      </span>
      <div>
        <p className="stat-value">{value}</p>
        <p className="stat-label">{label}</p>
      </div>
    </div>
  )
}

export default StatCard