
function ResolutionPanel() {
  return (
    <section className="card resolution-card" aria-labelledby="resolution-heading">
      <h2 id="resolution-heading">Is your problem solved?</h2>
      <p>
        Staff have marked this complaint as resolved. Please check whether the problem is really
        fixed.
      </p>

      <p className="field-error" role="status">
        Resolution confirmation, rating, feedback and reopening will be available
        once the required backend APIs are implemented.
      </p>
    </section>
  )
}

export default ResolutionPanel
