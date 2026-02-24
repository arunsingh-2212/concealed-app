import { useForm } from '../context/FormContext'
import permitCardImg from '../assets/permitcardbg.png'
import './Screen9.css'

const benefits = [
  { check: true, text: 'Rush service', bold: true },
  { check: true, text: 'Highest chance of approval' },
  { check: true, text: 'Thousands of permits processed' },
  { check: true, text: 'Do it from home', bold: true },
  { check: true, text: 'Avoid government agencies' },
  { check: false, text: 'No range time required' },
  { check: false, text: 'No police station visit' },
  { check: false, text: 'No fingerprinting or photograph required' },
  { check: true, text: 'Take advantage before laws change!', bold: true },
]

export default function Screen9({ onNext }) {
  const { update } = useForm()

  const handleContinue = () => {
    update('successContinue', true)
    onNext()
  }

  const handleProceedNow = () => {
    update('successProceedNow', true)
    onNext()
  }

  return (
    <div className="screen screen-9">
      <div className="card success-card">
        <div className="success-icon">✓</div>
        <h1>Success!</h1>
        <p className="success-msg">We are eligible to expedite your application.</p>
        <p className="discount">50% Off Discount</p>
        <div className="btn-row">
          <button type="button" className="btn btn-green" onClick={handleContinue}>
            Continue
          </button>
        </div>
        <div className="success-content">
          <div className="permit-card-wrap">
            <img src={permitCardImg} alt="Concealed Carry Permit" className="permit-card-img" />
          </div>
          <ul className="benefits-list">
            {benefits.map((b, i) => (
              <li key={i} className={b.check ? 'check' : 'cross'}>
                <span className="icon">{b.check ? '✓' : '✗'}</span>
                <span className={b.bold ? 'bold' : ''}>{b.text}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-green" onClick={handleProceedNow}>
            Proceed Now
          </button>
        </div>
      </div>
      {/* <div className="footer-legal screen9-footer">
        <p><em><strong>WE DO NOT ISSUE CONCEALED CARRY PERMITS. YOU MUST APPLY FOR SUCH PERMITS SEPARATELY.</strong></em></p>
        <p>Concealed App provides pre-qualifying questions and application assistance for New Hampshire permits. Upon successful completion and payment you must apply separately for Application Form DSSP260.</p>
        <p>ClickBank is the retailer. This product provides general information only and is not legal advice. Consult a qualified attorney. Testimonials do not guarantee similar results.</p>
      </div> */}
    </div>
  )
}
