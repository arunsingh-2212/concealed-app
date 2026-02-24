import './Footer.css'
import logoImg from '../assets/logo.png'
import sslImg from '../assets/ssl.png'

const footerLinks = [
  { label: 'Home', href: '#' },
  { label: 'Contact', href: '#' },
  { label: 'FAQ', href: '#' },
  { label: 'State Acceptance', href: '#' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
]

export default function Footer({ variant = 'default', links = footerLinks, onContactClick, onFaqClick, onStateAcceptanceClick, onTermsClick, onPrivacyClick, onHomeClick }) {
  return (
    <footer className={`site-footer ${variant}`}>
      <div className="footer-links">
        {onHomeClick ? (
          <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); onHomeClick() }}>{links[0]?.label ?? 'Home'}</a>
        ) : (
          <a className="footer-link" href={links[0]?.href ?? '#'}>{links[0]?.label ?? 'Home'}</a>
        )}
        {onContactClick ? (
          <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); onContactClick() }}>{links[1]?.label ?? 'Contact'}</a>
        ) : (
          <a className="footer-link" href={links[1]?.href ?? '#'}>{links[1]?.label ?? 'Contact'}</a>
        )}
        {onFaqClick ? (
          <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); onFaqClick() }}>{links[2]?.label ?? 'FAQ'}</a>
        ) : (
          <a className="footer-link" href={links[2]?.href ?? '#'}>{links[2]?.label ?? 'FAQ'}</a>
        )}
        {onStateAcceptanceClick ? (
          <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); onStateAcceptanceClick() }}>{links[3]?.label ?? 'State Acceptance'}</a>
        ) : (
          <a className="footer-link" href={links[3]?.href ?? '#'}>{links[3]?.label ?? 'State Acceptance'}</a>
        )}
        {onTermsClick ? (
          <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); onTermsClick() }}>{links[4]?.label ?? 'Terms & Conditions'}</a>
        ) : (
          <a className="footer-link" href={links[4]?.href ?? '#'}>{links[4]?.label ?? 'Terms & Conditions'}</a>
        )}
        {onPrivacyClick ? (
          <a className="footer-link" href="#" onClick={(e) => { e.preventDefault(); onPrivacyClick() }}>{links[5]?.label ?? 'Privacy Policy'}</a>
        ) : (
          <a className="footer-link" href={links[5]?.href ?? '#'}>{links[5]?.label ?? 'Privacy Policy'}</a>
        )}
      </div>
      {variant === 'default' && (
        <div className="footer-disclaimer">
          {/* <p><strong>Important Disclaimer Regarding Legal and Licensing Information.</strong> The information provided on this site is for informational purposes only and does not constitute legal advice. JVZoo Parties disclaim any liability for the accuracy or completeness of the information. You are responsible for consulting with qualified professionals and complying with all applicable laws regarding firearms, training, and certification.</p> */}
        </div>
      )}
      <div className="disclaimer-block">
    <p><h3 className='disclaimer-title'>Important Disclaimer Regarding Legal and Licensing Information:</h3> The information contained in this product, including but not limited to guidance on firearms licensing, laws, or regulatory compliance, is for informational purposes only and is not intended as legal advice. It is your sole responsibility to consult with a qualified legal professional or regulatory agency to verify that your actions comply with all applicable federal, state, and local laws. JVZoo and all of its affiliates, officers, employees, owners, and agents (collectively referred to as the "JVZoo Parties") disclaim all liability for the accuracy, legality, completeness, or applicability of any materials, representations, advice, or claims made in this product or its promotion. The JVZoo Parties make no warranties, express or implied, including but not limited to any warranties of merchantability, fitness for a particular purpose, or non-infringement. You understand and agree that the JVZoo Parties shall not be held liable for any direct, indirect, incidental, punitive, or consequential damages of any kind arising from your use of or reliance upon the information provided in this product, its marketing materials, or any related resources. This includes—but is not limited to—any harm resulting from your failure to obtain appropriate licensing, violation of laws, or misuse of provided content. It is your responsibility to ensure that you are in compliance with all applicable local, state, and federal laws and regulations, including those related to firearms, training, and certification. JVZoo does not endorse, guarantee, or review any legal claims or licensing results promoted by the vendor of this product.</p>
      </div>
      <div className="footer-bottom">
        <div className="footer-brand">
          <img src={logoImg} alt="Certified Concealed App" className="footer-logo" />
        </div>
        <div className="footer-ssl">
          <img src={sslImg} alt="Guaranteed Secure SSL Encryption. Your information will always be safe with us." className="footer-ssl-img" />
        </div>
      </div>
    </footer>
  )
}
