import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import bgLogin from '../assets/bg_login.jpeg'
import './LoginPage.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('[Login] Attempting login with:', email)
      console.log('[Login] Plain password:', password)
      
      // Call API to verify credentials (send plain password)
      const response = await fetch('/api/portal/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email, 
          password  // Send plain password directly
        }),
      })

      const data = await response.json()
      console.log('[Login] Response:', data)

      if (!response.ok) {
        throw new Error(data.message || 'Invalid email or password')
      }

      // Store user data and token
      localStorage.setItem('portalToken', data.token || data.user.id)
      localStorage.setItem('portalUser', JSON.stringify(data.user))
      
      console.log('[Login] Success! Redirecting to dashboard...')
      navigate('/portal/dashboard')
    } catch (err) {
      console.error('[Login] Error:', err)
      setError(err.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Login</h1>
          
          <form onSubmit={handleLogin} className="login-form">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">✉</span>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className="login-button"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>

      <div className="login-hero" style={{ backgroundImage: `url(${bgLogin})` }}>
      </div>
    </div>
  )
}

