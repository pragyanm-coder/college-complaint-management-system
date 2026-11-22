import { Link } from 'react-router-dom'

function ComingSoon({ title }) {
  return (
    <section className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
      <h1>{title}</h1>
      <p>This page will be built in the next step.</p>
      <Link to="/" className="btn btn-primary">Back to Home</Link>
    </section>
  )
}

export default ComingSoon