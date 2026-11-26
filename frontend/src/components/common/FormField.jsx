function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  options = [],
  placeholder,
  autoComplete,
  rows = 5,
  emptyLabel = 'Select...',
}) {
  const id = `field-${name}`
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  const shared = {
    id,
    name,
    value,
    onChange,
    'aria-invalid': error ? 'true' : 'false',
    'aria-describedby': describedBy,
  }

  let control
  if (type === 'select') {
    control = (
      <select {...shared}>
        <option value="">{emptyLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    )
  } else if (type === 'textarea') {
    control = <textarea {...shared} rows={rows} placeholder={placeholder} />
  } else {
    control = <input {...shared} type={type} placeholder={placeholder} autoComplete={autoComplete} />
  }

  return (
    <div className="form-field">
      <label htmlFor={id}>{label}</label>
      {control}
      {hint && !error && <p id={`${id}-hint`} className="field-hint">{hint}</p>}
      {error && <p id={`${id}-error`} className="field-error" role="alert">{error}</p>}
    </div>
  )
}

export default FormField