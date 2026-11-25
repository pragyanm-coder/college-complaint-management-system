
function AssignPanel({ complaint }) {
  const isAssigned = Boolean(complaint.assignedStaff)

  return (
    <section className="card assign-card" aria-labelledby="assign-heading">
      <h2 id="assign-heading">Assignment</h2>

      {complaint.status === 'Resolved' ? (
        <p className="muted-note">
          This complaint is resolved and cannot currently be reassigned.
        </p>
      ) : (
        <>
          <p className="muted-note">
            {isAssigned
              ? `Currently assigned to ${complaint.assignedStaff}.`
              : 'This complaint has not been assigned to a staff member yet.'}
          </p>

          <div className="alert alert-info" role="status">
            Assignment and reassignment are temporarily unavailable because
            the backend does not yet provide a staff directory API. The
            assignment API requires a valid staff ID.
          </div>
        </>
      )}
    </section>
  )
}

export default AssignPanel
