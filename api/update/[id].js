/**
 * Vercel Serverless Function for handling user data UPDATE
 * This replaces the Vite dev server proxy for production
 */

import https from 'https'

const API_URL = process.env.API_URL || 'https://pb.adunbox.com/adu-reports/external/concealed-users'
const AUTH_CODE = process.env.API_AUTH_CODE || 'jhbizzqiej12c120@$1nddh1'

export default async function handler(req, res) {
  // Only allow PUT requests
  if (req.method !== 'PUT') {
    return res.status(405).json({ 
      status: false, 
      message: 'Method not allowed' 
    })
  }

  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'PUT, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  try {
    const { id } = req.query
    const payload = req.body

    if (!id) {
      return res.status(400).json({ 
        status: false, 
        message: 'User ID is required' 
      })
    }
    
    console.log('[Vercel API] ==========================================')
    console.log('[Vercel API] UPDATE REQUEST')
    console.log('[Vercel API] User ID:', id)
    console.log('[Vercel API] Target URL:', `${API_URL}/${id}`)
    console.log('[Vercel API] Payload:', JSON.stringify(payload))
    console.log('[Vercel API] ==========================================')

    const url = new URL(`${API_URL}/${id}`)
    const body = JSON.stringify(payload)

    // Make HTTPS request to external API
    const response = await new Promise((resolve, reject) => {
      const proxyReq = https.request(
        {
          hostname: url.hostname,
          path: url.pathname,
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'authentication_code': AUTH_CODE,
            'Content-Length': Buffer.byteLength(body),
          },
        },
        (proxyRes) => {
          let data = ''
          proxyRes.on('data', (chunk) => { data += chunk })
          proxyRes.on('end', () => {
            console.log('[Vercel API] ==========================================')
            console.log('[Vercel API] UPDATE RESPONSE')
            console.log('[Vercel API] Status:', proxyRes.statusCode)
            console.log('[Vercel API] Response Body:', data)
            console.log('[Vercel API] ==========================================')
            
            resolve({
              statusCode: proxyRes.statusCode,
              data: data
            })
          })
        }
      )

      proxyReq.on('error', (err) => {
        console.error('[Vercel API] UPDATE error:', err)
        reject(err)
      })

      proxyReq.write(body)
      proxyReq.end()
    })

    // Parse response and send back to client
    let responseData
    try {
      responseData = JSON.parse(response.data)
    } catch (e) {
      responseData = { raw: response.data, success: true }
    }

    return res.status(response.statusCode).json(responseData)
  } catch (error) {
    console.error('[Vercel API] Exception:', error)
    return res.status(502).json({ 
      status: false, 
      message: error.message || 'Failed to connect to external API' 
    })
  }
}

