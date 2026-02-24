import './Header.css'
import logoImg from '../assets/logo.png'
import timeImg from '../assets/time.png'
import extraImg from '../assets/extra.png'

export default function Header({ step = 1, showProgress = true }) {
  return (
    <header className="site-header">
      <div className="header-top">
        <div className="header-left">
          <div className="logo">
            <img src={logoImg} alt="Certified Concealed App" className="logo-icon" />
            <img src={timeImg} alt="Apply for a Concealed Carry Permit in less than 30 minutes!" className="header-time" />
          </div>
          {/* <div className="tagline">
            <span className="clock-icon">⏱</span>
            Apply for a Concealed Carry Permit in less than 30 minutes!
          </div> */}
        </div>
        <div className="header-right">
          <img src={extraImg} alt="Rated 4.9/5 by 91k Permit Holders - Norton Secured, McAfee Secure, TRUSTe Certified Privacy" className="header-extra" />
        </div>
      </div>
      {showProgress && (
        <div className="progress-bar">
          <div className={`step ${step >= 1 ? 'active' : ''}`}>
            <span className="step-num">1</span> Verify
          </div>
          <div className={`step ${step >= 2 ? 'active' : ''}`}>
            <span className="step-num">2</span> Approve
          </div>
          <div className={`step ${step >= 3 ? 'active' : ''}`}>
            <span className="step-num">3</span> Apply
          </div>
          <a href="mailto:support@concealedapp.com" className="progress-support" >
            support@concealedapp.com
          </a>
        </div>
      )}
    </header>
  )
}
