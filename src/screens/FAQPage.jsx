import './FAQPage.css'

const NH_LICENSING_URL = 'https://www.nhsp.dos.nh.gov/our-services/justice-information-bureau/permits-and-licensing/pistol-and-revolver-licensing'

export default function FAQPage({ onBack }) {
  return (
    <div className="faq-page">
      <div className="faq-title-bar">Frequently Asked Questions</div>
      <div className="faq-content">
        <nav className="faq-nav">
          <ol className="faq-question-list">
            <li><a href="#faq-1">What does Concealed App provide me with?</a></li>
            <li><a href="#faq-2">Do I qualify for a New Hampshire Concealed Carry Permit?</a></li>
            <li><a href="#faq-3">Can non-residents of New Hampshire qualify to carry concealed?</a></li>
            <li><a href="#faq-4">What is your refund policy?</a></li>
            <li><a href="#faq-5">Where can I carry with a New Hampshire Non-Resident Permit?</a></li>
            <li><a href="#faq-6">Is This Course Valid?</a></li>
          </ol>
        </nav>
        <div className="faq-answers">
          <section id="faq-1" className="faq-item">
            <h2>What does Concealed App provide me with?</h2>
            <p>Users of concealedapp.com receive a portal and guide for obtaining a Non-Resident New Hampshire Pistol and Revolver License.</p>
          </section>
          <section id="faq-2" className="faq-item">
            <h2>Do I qualify for a New Hampshire Concealed Carry Permit?</h2>
            <p>Qualification requirements include, but are not limited to:</p>
            <ul>
              <li>You must be at least 21 years of age.</li>
              <li>You have not been found insane or incompetent.</li>
              <li>You are not subject to a restraining order.</li>
              <li>You have never been convicted of a felony.</li>
              <li>You have not been convicted of a Class 1 misdemeanor (or equivalent) within 5 years.</li>
              <li>You are not an unlawful user of or addicted to marijuana, or an unlawful user or distributor of a controlled substance.</li>
              <li>You have not been dishonorably discharged from the Armed Forces of the United States.</li>
              <li>You have not been convicted of assault, battery, or sexual battery within 3 years.</li>
            </ul>
            <p>For full details, visit the <a href={NH_LICENSING_URL} target="_blank" rel="noopener noreferrer">New Hampshire State website</a> for pistol and revolver licensing.</p>
          </section>
          <section id="faq-3" className="faq-item">
            <h2>Can non-residents of New Hampshire qualify to carry concealed?</h2>
            <p>Yes. Non-residents can apply by mail for a New Hampshire Non-Resident Pistol and Revolver License.</p>
          </section>
          <section id="faq-4" className="faq-item">
            <h2>What is your refund policy?</h2>
            <p>Refunds are only issued if an application is denied due to the training provided by concealedapp.com.</p>
          </section>
          <section id="faq-5" className="faq-item">
            <h2>Where can I carry with a New Hampshire Non-Resident Permit?</h2>
            <p>Please refer to our <strong>State Acceptance</strong> page for information on where a New Hampshire non-resident permit is recognized. It is your individual responsibility to determine where concealed weapons may be carried.</p>
          </section>
          <section id="faq-6" className="faq-item">
            <h2>Is This Course Valid?</h2>
            <p>This course exceeds industry standards and fulfills documentation of competence requirements. Our instructor&apos;s certifications are current and active. For licensing details, visit the <a href={NH_LICENSING_URL} target="_blank" rel="noopener noreferrer">New Hampshire State website</a> for pistol and revolver licensing.</p>
          </section>
        </div>
        {onBack && (
          <div className="faq-back-row">
            <button type="button" className="btn btn-green" onClick={onBack}>
              Back to application
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
