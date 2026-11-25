
import './AdminManage.css'

function StaffForm({ member, onSaved, onCancel }) {
  return (
    <section className="card manage-form-card" aria-labelledby="staff-form-heading">
      <h2 id="staff-form-heading">
        {member ? `Edit staff: ${member.name}` : 'Add a staff member'}
      </h2>

      <div className="alert alert-info" role="status">
        Staff account creation and department management are not currently
        supported by the backend. No changes can be saved from this form yet.
      </div>

      {member && (
        <p className="read-only-value">
          <strong>{member.name}</strong> · {member.email}
        </p>
      )}

      <div className="row-actions">
        <button
          type="button"
          className="btn btn-outline"
          onClick={onCancel}
        >
          Back
        </button>
      </div>
    </section>
  )
}

export default StaffForm
