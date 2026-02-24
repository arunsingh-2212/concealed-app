import { useForm } from '../context/FormContext'
import './Screen1.css'

export default function Screen1({ onNext }) {
  const { form, update } = useForm()

  const handleCheck = () => {
    if (form.zipCode.trim()) onNext()
  }

  return (
    <div className="screen screen-1">
      <div className="card">
        <h1>Validate your eligibility</h1>
        <div className="input-wrap">
          <span className="input-icon">📍</span>
          <input
            type="text"
            placeholder="Enter Your Zip Code"
            value={form.zipCode}
            onChange={(e) => update('zipCode', e.target.value)}
            maxLength={10}
          />
          <button type="button" className="input-action" aria-label="More options">⋯</button>
        </div>
        <div className="btn-row">
          <button type="button" className="btn btn-green" onClick={handleCheck}>
            Check Eligibility
          </button>
        </div>
      </div>
      {/* <div className="disclaimer-block">
        <p>Important Disclaimer Regarding Legal and Licensing Information: The information contained in this product, including but not limited to guidance on firearms licensing, laws, or regulatory compliance, is for informational purposes only and is not intended as legal advice. It is your sole responsibility to consult with a qualified legal professional or regulatory agency to verify that your actions comply with all applicable federal, state, and local laws. JVZoo and all of its affiliates, officers, employees, owners, and agents (collectively referred to as the "JVZoo Parties") disclaim all liability for the accuracy, legality, completeness, or applicability of any materials, representations, advice, or claims made in this product or its promotion. The JVZoo Parties make no warranties, express or implied, including but not limited to any warranties of merchantability, fitness for a particular purpose, or non-infringement. You understand and agree that the JVZoo Parties shall not be held liable for any direct, indirect, incidental, punitive, or consequential damages of any kind arising from your use of or reliance upon the information provided in this product, its marketing materials, or any related resources. This includes—but is not limited to—any harm resulting from your failure to obtain appropriate licensing, violation of laws, or misuse of provided content. It is your responsibility to ensure that you are in compliance with all applicable local, state, and federal laws and regulations, including those related to firearms, training, and certification. JVZoo does not endorse, guarantee, or review any legal claims or licensing results promoted by the vendor of this product.</p>
      </div> */}
    </div>
  )
}
