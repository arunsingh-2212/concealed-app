import './Screen2.css'

export default function Screen2({ onNext }) {
  return (
    <div className="screen screen-2">
      <div className="card">
        <h1>Great News!</h1>
        <p className="subtitle">Region Approved: Proceed to Verification.</p>
        <div className="btn-row">
          <button type="button" className="btn btn-green" onClick={onNext}>
            Qualify Now
          </button>
        </div>
      </div>
      
    </div>
  )
}
