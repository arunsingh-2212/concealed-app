/**
 * Portal API Service - Handles authentication and course access
 */

const PORTAL_API_BASE = '/api/portal'

/**
 * Login user and get course access data
 */
export async function loginUser(email, password) {
  console.log('[Portal API] Login attempt for:', email)

  const response = await fetch(`${PORTAL_API_BASE}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Login failed' }))
    throw new Error(error.message || 'Invalid credentials')
  }

  const data = await response.json()
  console.log('[Portal API] Login successful:', data)
  return data
}

/**
 * Get user's course access based on upsell1 and upsell2
 */
export async function getUserCourses(userId, token) {
  console.log('[Portal API] Fetching courses for user:', userId)

  const response = await fetch(`${PORTAL_API_BASE}/user/${userId}/courses`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })

  if (!response.ok) {
    throw new Error('Failed to fetch course access')
  }

  const data = await response.json()
  console.log('[Portal API] Course access:', data)
  return data
}

/**
 * Verify token and get current user
 */
export async function verifyToken(token) {
  const response = await fetch(`${PORTAL_API_BASE}/verify`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error('Invalid token')
  }

  return response.json()
}

/**
 * Get user info from localStorage
 */
export function getCurrentUser() {
  const userStr = localStorage.getItem('portalUser')
  if (!userStr) return null
  
  try {
    return JSON.parse(userStr)
  } catch (e) {
    console.error('[Portal API] Failed to parse user data:', e)
    return null
  }
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated() {
  const token = localStorage.getItem('portalToken')
  const user = getCurrentUser()
  return !!(token && user)
}

/**
 * Logout user
 */
export function logout() {
  localStorage.removeItem('portalToken')
  localStorage.removeItem('portalUser')
  console.log('[Portal API] User logged out')
}

