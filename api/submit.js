/**
 * Vercel Serverless Function for handling user data INSERT
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
    const payload = req.body
    
    console.log('[Vercel API] ==========================================')
    console.log('[Vercel API] INSERT REQUEST')
    console.log('[Vercel API] Target URL:', API_URL)
    console.log('[Vercel API] Payload:', JSON.stringify(payload))
    console.log('[Vercel API] ==========================================')

    const url = new URL(API_URL)
    const body = JSON.stringify(payload)

    // Make HTTPS request to external API
    const response = await new Promise((resolve, reject) => {
      const proxyReq = https.request(
        {
          hostname: url.hostname,
          path: url.pathname,
          method: 'POST',
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
            console.log('[Vercel API] INSERT RESPONSE')
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
        console.error('[Vercel API] INSERT error:', err)
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
      responseData = { raw: response.data }
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

