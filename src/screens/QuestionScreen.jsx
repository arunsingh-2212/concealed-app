import { useState } from 'react'
import { useForm } from '../context/FormContext'
import '../components/Card.css'

export default function QuestionScreen({ questionNum, total, questionText, formKey, onNext }) {
  const { form, update } = useForm()
  const [showFalseDisclaimer, setShowFalseDisclaimer] = useState(false)

  const handleAnswer = (answer) => {
    if (answer === false) {
      setShowFalseDisclaimer(true)
      return
    }
    setShowFalseDisclaimer(false)
    update(formKey, true)
    onNext()
  }

  return (
    <div className="screen question-screen">
      <div className="card">
        <div className="question-label">Question {questionNum} of {total}</div>
        {showFalseDisclaimer && (
          <div className="question-false-disclaimer">
            Sorry! You must select TRUE to proceed further
          </div>
        )}
        <div className="question-text" dangerouslySetInnerHTML={{ __html: questionText }} />
        <div className="btn-row">
          <button
            type="button"
            className="btn btn-red"
            onClick={() => handleAnswer(false)}
          >
            False
          </button>
          <button
            type="button"
            className="btn btn-green"
            onClick={() => handleAnswer(true)}
          >
            True
          </button>
        </div>
      </div>
      <div className="rating-row">★★★★★ Rated 4.9/5 by 91K Permit Holders</div>
      <FooterLegal />
    </div>
  )
}

function FooterLegal() {
  return (
    // <div className="footer-legal">
    //   <p>ClickBank® is the retailer of this product. CLICKBANK® is a registered trademark of Click Sales, Inc. This product is intended to provide general information only and is not legal advice. We are not attorneys. Concealed carry laws differ by state; confirm requirements with proper authorities and consult a qualified attorney if needed. Testimonials and examples do not guarantee similar results.</p>
    // </div>
    <></>
  )
}
