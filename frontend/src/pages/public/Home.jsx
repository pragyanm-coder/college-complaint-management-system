import { Link } from 'react-router-dom'
import Icon from '../../components/common/Icon'
import './Home.css'

const features = [
  { icon: 'filePlus', title: 'Easy Complaint Submission', text: 'Describe your problem, choose a category and priority, and submit it in a few minutes.' },
  { icon: 'clock', title: 'Live Status Tracking', text: 'See whether your complaint is Pending, In Progress or Resolved at any time.' },
  { icon: 'users', title: 'Department Handling', text: 'Complaints are assigned to the right department or staff member to resolve.' },
  { icon: 'message', title: 'Updates and Remarks', text: 'Read the remarks staff add, so you always know what action has been taken.' },
  { icon: 'star', title: 'Confirmation and Feedback', text: 'Confirm the issue is really solved and rate how it was handled.' },
]

const steps = [
  { title: 'Register or log in', text: 'Create your student account or log in.' },
  { title: 'Submit your complaint', text: 'Add the details, category and priority.' },
  { title: 'Complaint is assigned', text: 'The admin sends it to the right department or staff.' },
  { title: 'Staff work on it', text: 'Status and remarks are updated as work progresses.' },
  { title: 'Confirm and give feedback', text: 'Once resolved, you confirm and rate the result.' },
]

function Home() {
  return (
    <>
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-text">
            <p className="hero-eyebrow">For students, staff and administration</p>
            <h1>Submit, track and resolve college complaints in one place</h1>
            <p className="hero-lead">
              Stop depending on informal methods. Register a complaint, follow its
              progress, and know exactly when it has been resolved.
            </p>
            <div className="hero-actions">
              <Link to="/register" className="btn btn-primary btn-lg">Get Started</Link>
              <Link to="/login" className="btn btn-outline btn-lg">Login</Link>
            </div>
          </div>

          <div className="hero-card card" aria-label="Sample complaint tracking preview">
            <p className="hero-card-label">Sample preview</p>
            <h3>Water leakage in Hostel Block B</h3>
            <div className="hero-card-badges">
              <span className="badge badge-urgent">Urgent</span>
              <span className="badge badge-progress">In Progress</span>
            </div>
            <ol className="mini-timeline">
              <li className="done">Complaint submitted</li>
              <li className="done">Assigned to Maintenance Department</li>
              <li className="current">Work in progress</li>
              <li>Resolved and confirmed</li>
            </ol>
          </div>
        </div>
      </section>

      <section id="features" className="section">
        <div className="container">
          <h2 className="section-title">Features</h2>
          <p className="section-lead">Everything you need to raise and follow a complaint.</p>
          <div className="feature-grid">
            {features.map((feature) => (
              <article key={feature.title} className="card feature-card">
                <span className="feature-icon">
                  <Icon name={feature.icon} />
                </span>
                <h3>{feature.title}</h3>
                <p>{feature.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="how-it-works" className="section section-alt">
        <div className="container">
          <h2 className="section-title">How It Works</h2>
          <p className="section-lead">From complaint to resolution in five simple steps.</p>
          <ol className="steps">
            {steps.map((step) => (
              <li key={step.title} className="step">
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section cta">
        <div className="container cta-inner">
          <h2>Have a problem on campus?</h2>
          <p>Create an account and register your first complaint today.</p>
          <Link to="/register" className="btn btn-lg cta-btn">Create Student Account</Link>
        </div>
      </section>
    </>
  )
}

export default Home