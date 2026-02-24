import { useState } from 'react'
import { useForm } from '../context/FormContext'
import '../components/Card.css'

export default function Screen8({ onNext }) {
  const { update } = useForm()
  const [showFalseDisclaimer, setShowFalseDisclaimer] = useState(false)

  const handleAnswer = (answer) => {
    if (answer === false) {
      setShowFalseDisclaimer(true)
      return
    }
    setShowFalseDisclaimer(false)
    update('finalQuestion', true)
    onNext()
  }

  return (
    <div className="screen question-screen">
      <div className="card">
        <div className="question-label">Final Question</div>
        {showFalseDisclaimer && (
          <div className="question-false-disclaimer">
            Sorry! You must select TRUE to proceed further
          </div>
        )}
        <div className="question-text" dangerouslySetInnerHTML={{ __html: 'I have <span class="highlight">NOT</span> been discharged from the Armed Forces of the United States under <span class="highlight">dishonorable</span> conditions.' }} />
        <div className="btn-row">
          <button type="button" className="btn btn-red" onClick={() => handleAnswer(false)}>False</button>
          <button type="button" className="btn btn-green" onClick={() => handleAnswer(true)}>True</button>
        </div>
      </div>
      <div className="rating-row">★★★★★ Rated 4.9/5 by 91K Permit Holders</div>
      {/* <div className="footer-legal">
        <p>ClickBank® is the retailer. This product provides general information only and is not legal advice. Testimonials do not guarantee similar results.</p>
      </div> */}
    </div>
  )
}
