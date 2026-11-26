const priorityClasses = {
  Low: 'badge-low',
  Medium: 'badge-medium',
  High: 'badge-high',
  Urgent: 'badge-urgent',
}

function PriorityBadge({ priority }) {
  return <span className={`badge ${priorityClasses[priority] ?? ''}`}>{priority}</span>
}

export default PriorityBadge