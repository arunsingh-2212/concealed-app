import { Navigate } from 'react-router-dom'
import { isAuthenticated } from './portalApi'

export default function ProtectedRoute({ children }) {
  if (!isAuthenticated()) {
    console.log('[ProtectedRoute] User not authenticated, redirecting to login')
    return <Navigate to="/portal/login" replace />
  }

  return children
}

