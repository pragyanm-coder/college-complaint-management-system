const statusClasses = {
  Pending: 'badge-pending',
  'In Progress': 'badge-progress',
  Resolved: 'badge-resolved',
}

function StatusBadge({ status }) {
  return <span className={`badge ${statusClasses[status] ?? ''}`}>{status}</span>
}

export default StatusBadge