import './TermsPage.css'

const SUPPORT_EMAIL = 'support@concealedapp.com'

export default function TermsPage({ onBack }) {
  return (
    <div className="terms-page">
      <div className="terms-title-bar">Terms & Conditions of Use</div>
      <div className="terms-content">
        <p className="terms-updated">Last updated: February 08, 2023</p>

        <section className="terms-section">
          <h2>1. Agreement to Terms</h2>
          <p>By accessing or using the Service, Website, or Site operated by www.concealedapp.com (&quot;Concealed App&quot;), you agree to be bound by these Terms and Conditions of Use. If you do not agree to these Terms, you may not access or use the Service.</p>
        </section>

        <section className="terms-section">
          <h2>2. Use of Service</h2>
          <p>The Service provides general information regarding concealed carry permits and related matters. The information provided is for informational purposes only and does not constitute legal advice. You should consult with a qualified attorney or regulatory authority for advice specific to your situation.</p>
        </section>

        <section className="terms-section">
          <h2>3. Intellectual Property</h2>
          <p>Concealed App is the exclusive owner of all content, materials, and intellectual property associated with the Service, Website, and Site. You may not copy, reproduce, distribute, or create derivative works without express written permission.</p>
        </section>

        <section className="terms-section">
          <h2>4. User Responsibilities</h2>
          <p>You are responsible for complying with all applicable federal, state, and local laws and regulations regarding firearms, concealed carry, and licensing. You represent that you will use the Service only for lawful purposes and in accordance with these Terms.</p>
        </section>

        <section className="terms-section">
          <h2>5. Limitation of Liability</h2>
          <p>To the fullest extent permitted by law, Concealed App and its affiliates, officers, employees, and agents shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from your use of or reliance on the Service, including but not limited to any errors, inaccuracies, or omissions in the content.</p>
        </section>

        <section className="terms-section">
          <h2>6. Disclaimer</h2>
          <p>The Service is provided &quot;AS IS&quot; and &quot;AS AVAILABLE&quot; without warranties of any kind, either express or implied. Concealed App disclaims all warranties, including but not limited to implied warranties of merchantability, fitness for a particular purpose, and non-infringement.</p>
        </section>

        <section className="terms-section">
          <h2>7. Governing Law</h2>
          <p>These Terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of law provisions.</p>
        </section>

        <section className="terms-section">
          <h2>8. Changes to Terms</h2>
          <p>Concealed App may modify these Terms at any time. We will indicate the date of the last update. Your continued use of the Service after any changes constitutes your acceptance of the revised Terms.</p>
        </section>

        <section className="terms-section">
          <h2>9. Contact Us</h2>
          <p>If you have any questions about these Terms, please contact us at <a href={`mailto:${SUPPORT_EMAIL}`}>{SUPPORT_EMAIL}</a>.</p>
        </section>

        {onBack && (
          <div className="terms-back-row">
            <button type="button" className="btn btn-green" onClick={onBack}>
              Back to application
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
