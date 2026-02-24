import './StateAcceptancePage.css'

const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts',
  'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota',
  'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
]

export default function StateAcceptancePage({ onBack }) {
  return (
    <div className="state-acceptance-page">
      <div className="state-acceptance-title-bar">State Acceptance</div>
      <div className="state-acceptance-content">
        <p className="state-acceptance-updated">LAST UPDATED: 2023/02/07</p>
        <p className="state-acceptance-disclaimer">
          The following list is for informational purposes only. It is <strong>EXCLUSIVELY YOUR RESPONSIBILITY</strong> to determine if you are legally authorized to carry a concealed weapon in your state, city or other location.
        </p>
        <p className="state-acceptance-disclaimer">
          For the most up-to-date information, be sure to check with your local authorities.
        </p>
        <ul className="state-acceptance-list">
          {US_STATES.map((state) => (
            <li key={state}>{state}</li>
          ))}
        </ul>
        {onBack && (
          <div className="state-acceptance-back-row">
            <button type="button" className="btn btn-green" onClick={onBack}>
              Back to application
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
