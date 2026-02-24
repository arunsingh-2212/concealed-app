import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './ProfileDropdown.css'

export default function ProfileDropdown({ user }) {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    console.log('[Profile] Logging out...')
    localStorage.removeItem('portalToken')
    localStorage.removeItem('portalUser')
    navigate('/portal/login')
  }

  const getInitials = (email) => {
    if (!email) return 'U'
    const name = email.split('@')[0]
    return name.substring(0, 2).toUpperCase()
  }

  const getDisplayName = (email) => {
    if (!email) return 'User'
    const name = email.split('@')[0]
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/[._-]/g, ' ')
  }

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <button
        className="profile-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="profile-avatar">
          {getInitials(user?.email)}
        </div>
      </button>

      {isOpen && (
        <div className="profile-menu">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {getInitials(user?.email)}
              <button className="profile-edit-btn">
                <span>✏️</span>
              </button>
            </div>
            <h3 className="profile-name">Hi, {getDisplayName(user?.email)}!</h3>
            <p className="profile-email">{user?.email}</p>
          </div>

          <div className="profile-divider"></div>

          <button className="profile-menu-item" onClick={() => navigate('/portal/account')}>
            <span className="menu-icon">⚙️</span>
            <span className="menu-text">Manage Your Account</span>
          </button>

          <div className="profile-divider"></div>

          <button className="profile-menu-item logout-btn" onClick={handleLogout}>
            <span className="menu-icon">↪️</span>
            <span className="menu-text">Log Out</span>
          </button>
        </div>
      )}
    </div>
  )
}

