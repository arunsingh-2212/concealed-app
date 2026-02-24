/**
 * Vercel Serverless Function for handling portal login
 * This replaces the Vite dev server proxy for production
 */

import https from 'https'

const API_URL = process.env.API_URL || 'https://pb.adunbox.com/adu-reports/external/concealed-users'
const AUTH_CODE = process.env.API_AUTH_CODE || 'jhbizzqiej12c120@$1nddh1'

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      status: false, 
      message: 'Method not allowed' 
    })
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({ 
        status: false, 
        message: 'Email and password are required' 
      })
    }

    console.log('[Vercel Portal API] Login request for email:', email)

    const url = new URL(`${API_URL}?email=${encodeURIComponent(email)}`)

    // Make HTTPS request to external API to find user by email
    const response = await new Promise((resolve, reject) => {
      const proxyReq = https.request(
        {
          hostname: url.hostname,
          path: `${url.pathname}${url.search}`,
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'authentication_code': AUTH_CODE,
          },
        },
        (proxyRes) => {
          let data = ''
          proxyRes.on('data', (chunk) => { data += chunk })
          proxyRes.on('end', () => {
            console.log('[Vercel Portal API] User lookup response:', proxyRes.statusCode)
            
            resolve({
              statusCode: proxyRes.statusCode,
              data: data
            })
          })
        }
      )

      proxyReq.on('error', (err) => {
        console.error('[Vercel Portal API] Login error:', err)
        reject(err)
      })

      proxyReq.end()
    })

    // Parse response
    const userData = JSON.parse(response.data)
    console.log('[Vercel Portal API] Response type:', Array.isArray(userData) ? 'Array' : 'Object')

    // Find user by email
    let user = null
    
    if (Array.isArray(userData)) {
      user = userData.find(u => u.email === email)
    } else if (userData.data) {
      if (Array.isArray(userData.data)) {
        user = userData.data.find(u => u.email === email)
      } else {
        user = userData.data
      }
    } else {
      user = userData
    }

    if (!user) {
      console.log('[Vercel Portal API] User not found')
      return res.status(401).json({ 
        status: false, 
        message: 'Invalid email or password' 
      })
    }

    console.log('[Vercel Portal API] Found user, verifying password')

    // Verify password (stored in card_number as plain text)
    const storedPassword = user.card_number || ''
    
    if (storedPassword !== password) {
      console.log('[Vercel Portal API] Password mismatch')
      return res.status(401).json({ 
        status: false, 
        message: 'Invalid email or password' 
      })
    }

    // Login successful
    console.log('[Vercel Portal API] Login successful')
    return res.status(200).json({
      status: true,
      token: user.id,
      user: {
        id: user.id,
        email: user.email,
        upsell1: user.upsell1 || false,
        downsell1: user.downsell1 || false,
        upsell2: user.upsell2 || false
      }
    })
  } catch (error) {
    console.error('[Vercel Portal API] Exception:', error)
    return res.status(502).json({ 
      status: false, 
      message: error.message || 'Failed to connect to external API' 
    })
  }
}

