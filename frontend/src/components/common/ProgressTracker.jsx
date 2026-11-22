import './Tracking.css'

const steps = ['Submitted', 'In Progress', 'Resolved', 'Confirmed']

// Which step the complaint has reached. 4 means every step is finished.
function getStepIndex(complaint) {
  if (complaint.studentConfirmed) return 4
  if (complaint.status === 'Resolved') return 2
  if (complaint.status === 'In Progress') return 1
  return 0
}

function ProgressTracker({ complaint }) {
  const current = getStepIndex(complaint)

  return (
    <ol className="tracker" aria-label="Complaint progress">
      {steps.map((label, index) => {
        const state = index < current ? 'done' : index === current ? 'current' : ''
        return (
          <li key={label} className={state} aria-current={state === 'current' ? 'step' : undefined}>
            <span className="tracker-dot">{index < current ? '✓' : index + 1}</span>
            {label}
          </li>
        )
      })}
    </ol>
  )
}

export default ProgressTracker