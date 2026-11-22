import { useState } from 'react'
import FormField from '../../components/common/FormField'
import { useDirectory } from '../../context/useDirectory'
import { emailPattern } from '../../utils/validators'
import './AdminManage.css'

// member = the staff member being edited, or null when adding a new one.
function StaffForm({ member, onSaved, onCancel }) {
  const { departments, staff, addStaff, updateStaffDepartments, emailInUse } = useDirectory()
  const isEdit = Boolean(member)

  const [form, setForm] = useState({ name: member?.name ?? '', email: member?.email ?? '' })
  const [selected, setSelected] = useState(member?.departments ?? [])
  const [errors, setErrors] = useState({})

  const handleChange = (event) => {
    const { name, value } = event.target
    setForm({ ...form, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const toggleDepartment = (name) => {
    setSelected((current) =>
      current.includes(name) ? current.filter((item) => item !== name) : [...current, name],
    )
    setErrors({ ...errors, departments: '' })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const found = {}
    const name = form.name.trim()
    const email = form.email.trim()

    if (!isEdit) {
      if (name.length < 3) {
        found.name = 'Enter the full name (at least 3 characters).'
      } else if (staff.some((item) => item.name.toLowerCase() === name.toLowerCase())) {
        found.name = 'A staff member with this name already exists.'
      }

      if (!email) found.email = 'Email is required.'
      else if (!emailPattern.test(email)) found.email = 'Enter a valid email address.'
      else if (emailInUse(email)) found.email = 'This email is already used by another account.'
    }

    if (selected.length === 0) found.departments = 'Select at least one department.'

    setErrors(found)
    if (Object.keys(found).length > 0) return

    // Keep the departments in the same order as the main department list.
    const chosen = departments.filter((item) => selected.includes(item))

    if (isEdit) {
      updateStaffDepartments(member.email, chosen)
      onSaved(`Departments updated for ${member.name}.`)
    } else {
      addStaff({ name, email, departments: chosen })
      onSaved(`${name} was added to the staff list.`)
    }
  }

  return (
    <section className="card manage-form-card" aria-labelledby="staff-form-heading">
      <h2 id="staff-form-heading">{isEdit ? `Edit departments: ${member.name}` : 'Add a staff member'}</h2>

      {!isEdit && (
        <div className="alert alert-info">
          Demo mode: this adds the person to the staff list. Their login account will be created
          by the backend later.
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {isEdit ? (
          <p className="read-only-value">
            <strong>{member.name}</strong> · {member.email}
          </p>
        ) : (
          <div className="form-row-2">
            <FormField label="Full name" name="name" value={form.name} onChange={handleChange} error={errors.name} />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              error={errors.email}
              placeholder="name@college.edu"
            />
          </div>
        )}

        <fieldset className="checkbox-group" aria-describedby={errors.departments ? 'departments-error' : undefined}>
          <legend>Departments this person works in</legend>
          <div className="checkbox-grid">
            {departments.map((name) => (
              <label key={name} className="checkbox-item">
                <input
                  type="checkbox"
                  checked={selected.includes(name)}
                  onChange={() => toggleDepartment(name)}
                />
                {name}
              </label>
            ))}
          </div>
          {errors.departments && (
            <p id="departments-error" className="field-error" role="alert">{errors.departments}</p>
          )}
        </fieldset>

        <div className="row-actions">
          <button type="submit" className="btn btn-primary">
            {isEdit ? 'Save departments' : 'Add staff member'}
          </button>
          <button type="button" className="btn btn-outline" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </section>
  )
}

export default StaffForm