import { Link } from 'react-router-dom'
import states from '../data/states'
import '../styles/HomePage.css'

function HomePage() {
  return (
    <div className="home-container">
      <header className="hero">
        <h1>BizGuide: LLC Registration Made Easy</h1>
        <p className="hero-text">
          Your comprehensive guide to registering an LLC in all 50 states.
          We provide step-by-step instructions tailored for each state to help
          you navigate the process with ease.
        </p>
      </header>

      <section className="register-soon">
        <button className="register-button" disabled>
          Register For Me
          <span className="coming-soon-badge">Coming Soon</span>
        </button>
        <p className="register-description">
          Soon we'll be able to handle the entire LLC registration process for you.
          Stay tuned for our full-service option!
        </p>
      </section>

      <section className="state-selection">
        <h2>Select Your State</h2>
        <p>Click on your state to view specific LLC registration instructions:</p>
        
        <div className="state-grid">
          {states.map(state => (
            <Link 
              to={`/state/${state.code}`} 
              key={state.code}
              className="state-button"
            >
              {state.code}
            </Link>
          ))}
        </div>
      </section>

      <footer>
        <p>© {new Date().getFullYear()} BizGuide - LLC Registration Information</p>
        <p>Disclaimer: This information is provided for general guidance and may not reflect recent changes in state laws.</p>
      </footer>
    </div>
  )
}

export default HomePage