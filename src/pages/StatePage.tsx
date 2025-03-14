import { useParams, Link } from 'react-router-dom'
import states from '../data/states'
import '../styles/StatePage.css'

function StatePage() {
  const { stateCode } = useParams<{ stateCode: string }>()
  
  const state = states.find(s => s.code === stateCode)
  
  if (!state) {
    return (
      <div className="state-error">
        <h1>State Not Found</h1>
        <p>Sorry, we couldn't find information for the state code: {stateCode}</p>
        <Link to="/" className="back-button">Back to Home</Link>
      </div>
    )
  }
  
  return (
    <div className="state-container">
      <header>
        <h1>LLC Registration Guide for {state.name}</h1>
      </header>
      
      <div className="state-content">
        <section className="instructions">
          <h2>Registration Instructions</h2>
          <div className="instruction-content">
            {state.instructions}
          </div>
        </section>
        
        <section className="resources">
          <h2>Useful Resources</h2>
          <ul>
            <li>
              <a href="#" className="resource-link">
                {state.name} Secretary of State Website
              </a>
            </li>
            <li>
              <a href="#" className="resource-link">
                {state.name} LLC Filing Requirements
              </a>
            </li>
            <li>
              <a href="#" className="resource-link">
                {state.name} Business Tax Information
              </a>
            </li>
          </ul>
        </section>
      </div>
      
      <div className="action-buttons">
        <Link to="/" className="back-button">Back to All States</Link>
      </div>
      
      <footer>
        <p>© {new Date().getFullYear()} BizGuide - LLC Registration Information</p>
        <p>Disclaimer: This information is provided for general guidance and may not reflect recent changes in state laws.</p>
      </footer>
    </div>
  )
}

export default StatePage