/**
 * Vercel Serverless Function for getting user courses
 * This replaces the Vite dev server proxy for production
 */

import https from 'https'

const API_URL = process.env.API_URL || 'https://pb.adunbox.com/adu-reports/external/concealed-users'
const AUTH_CODE = process.env.API_AUTH_CODE || 'jhbizzqiej12c120@$1nddh1'

export default async function handler(req, res) {
  // Only allow GET requests
  if (req.method !== 'GET') {
    return res.status(405).json({ 
      status: false, 
      message: 'Method not allowed' 
    })
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { id } = req.query

    if (!id) {
      return res.status(400).json({ 
        status: false, 
        message: 'User ID is required' 
      })
    }

    console.log('[Vercel Portal API] Fetching courses for user:', id)

    const url = new URL(`${API_URL}/${id}`)

    // Make HTTPS request to external API
    const response = await new Promise((resolve, reject) => {
      const proxyReq = https.request(
        {
          hostname: url.hostname,
          path: url.pathname,
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
            console.log('[Vercel Portal API] User data response:', proxyRes.statusCode)
            
            resolve({
              statusCode: proxyRes.statusCode,
              data: data
            })
          })
        }
      )

      proxyReq.on('error', (err) => {
        console.error('[Vercel Portal API] Courses error:', err)
        reject(err)
      })

      proxyReq.end()
    })

    // Parse response and extract course access
    const userData = JSON.parse(response.data)
    const courseAccess = {
      upsell1: userData.upsell1 || false,
      upsell2: userData.upsell2 || false
    }

    return res.status(200).json(courseAccess)
  } catch (error) {
    console.error('[Vercel Portal API] Exception:', error)
    return res.status(500).json({ 
      upsell1: false, 
      upsell2: false 
    })
  }
}

