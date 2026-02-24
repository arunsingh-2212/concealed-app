import './PrivacyPage.css'

const SUPPORT_EMAIL = 'support@concealedapp.com'

export default function PrivacyPage({ onBack }) {
  return (
    <div className="privacy-page">
      <div className="privacy-title-bar">Privacy Policy</div>
      <div className="privacy-content">
        <p className="privacy-updated">Last updated: February 08, 2023</p>
        <p className="privacy-intro">
          Concealed App (&quot;concealedapp.com&quot;) is committed to protecting your privacy. This Privacy Policy describes how we collect, use, and protect your personal information when you use our website and services.
        </p>

        <section className="privacy-section">
          <h2>What personal information do we collect?</h2>
          <p>We may collect information you provide when you register, place an order, subscribe to our newsletter, respond to a survey, or fill out a form. This may include your name, email address, mailing address, phone number, payment information, or other details as needed to provide our services.</p>
        </section>

        <section className="privacy-section">
          <h2>When do we collect information?</h2>
          <p>We collect information from you when you register on our site, place an order, subscribe to a newsletter, fill out a form, or enter information on our site.</p>
        </section>

        <section className="privacy-section">
          <h2>How do we use your information?</h2>
          <p>We may use the information we collect in the following ways:</p>
          <ul>
            <li>To personalize your experience and deliver content and product offerings relevant to your interests.</li>
            <li>To improve our website and better serve you.</li>
            <li>To improve customer service and respond to your requests more effectively.</li>
            <li>To process your transactions.</li>
            <li>To send periodic emails regarding your order or other products and services.</li>
          </ul>
        </section>

        <section className="privacy-section">
          <h2>How do we protect your information?</h2>
          <p>We implement a variety of security measures to maintain the safety of your personal information. We do not use vulnerability scanning and/or scanning to PCI standards. We do not store credit card numbers. We use regular malware scanning and your personal information is contained behind secured networks.</p>
        </section>

        <section className="privacy-section">
          <h2>Do we use &quot;cookies&quot;?</h2>
          <p>Yes. We use cookies to understand and save your preferences for future visits and to compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.</p>
        </section>

        <section className="privacy-section">
          <h2>Third-party disclosure</h2>
          <p>We do not sell, trade, or otherwise transfer to outside parties your personally identifiable information (PII) without providing you with advance notice, except as described in this Privacy Policy or as required by law.</p>
        </section>

        <section className="privacy-section">
          <h2>Contact Us</h2>
          <p>If you have any questions about this Privacy Policy, please contact us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
        </section>

        {onBack && (
          <div className="privacy-back-row">
            <button type="button" className="btn btn-green" onClick={onBack}>
              Back to application
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
