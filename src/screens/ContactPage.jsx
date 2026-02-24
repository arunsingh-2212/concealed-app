import './ContactPage.css'

const SUPPORT_EMAIL = 'support@concealedapp.com'

export default function ContactPage({ onBack }) {
  return (
    <div className="screen contact-page">
      <div className="card contact-card">
        <h1>Contact Us</h1>
        <p className="contact-intro">
          Our US Support Team is here to assist you. Please reach out with any questions you may have!
        </p>
        <p className="contact-email-row">
          <a href={`mailto:${SUPPORT_EMAIL}`} className="contact-email-link">
            <span className="contact-email-icon" aria-hidden>✉</span>
            {SUPPORT_EMAIL}
          </a>
        </p>
        <p className="contact-24-7">
          For <strong>immediate assistance 24/7</strong> our U.S. customer support team can be reached by email at{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} className="contact-email-link">
            {SUPPORT_EMAIL}
            <span className="contact-email-icon" aria-hidden>✉</span>
          </a>
        </p>
        {onBack && (
          <div className="contact-back-row">
            <button type="button" className="btn btn-green" onClick={onBack}>
              Back to application
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
