import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, existsSync } from 'fs'
import { resolve, extname } from 'path'
import { request as httpsRequest } from 'https'
import { config as dotenvConfig } from 'dotenv'

const MIME = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.ico': 'image/x-icon',
}

function serveMidPages() {
  const root = resolve('Pages')
  return {
    name: 'serve-mid-pages',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url.startsWith('/midpages/')) return next()
        const rel = req.url.replace('/midpages/', '').split('?')[0]
        const file = resolve(root, rel)
        if (!existsSync(file)) return next()
        const ext = extname(file)
        res.setHeader('Content-Type', MIME[ext] || 'application/octet-stream')
        res.end(readFileSync(file))
      })
    },
  }
}

function apiProxy(apiUrl, authCode) {
  const url = new URL(apiUrl)
  return {
    name: 'api-proxy',
    configureServer(server) {
      // Handle POST /api/submit (INSERT)
      server.middlewares.use('/api/submit', (req, res, next) => {
        if (req.method !== 'POST') return next()
        
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          console.log('[API Proxy] ==========================================')
          console.log('[API Proxy] INSERT REQUEST')
          console.log('[API Proxy] Target URL:', url.href)
          console.log('[API Proxy] Hostname:', url.hostname)
          console.log('[API Proxy] Path:', url.pathname)
          console.log('[API Proxy] Payload:', body)
          console.log('[API Proxy] ==========================================')
          
          const proxyReq = httpsRequest(
            {
              hostname: url.hostname,
              path: url.pathname,
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'authentication_code': authCode,
              },
            },
            (proxyRes) => {
              let data = ''
              proxyRes.on('data', (chunk) => { data += chunk })
              proxyRes.on('end', () => {
                console.log('[API Proxy] ==========================================')
                console.log('[API Proxy] INSERT RESPONSE')
                console.log('[API Proxy] Status:', proxyRes.statusCode)
                console.log('[API Proxy] Response Body:', data)
                console.log('[API Proxy] ==========================================')
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' })
                res.end(data)
              })
            }
          )
          proxyReq.on('error', (err) => {
            console.error('[API Proxy] INSERT error:', err)
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ status: false, message: err.message }))
          })
          proxyReq.write(body)
          proxyReq.end()
        })
      })

      // Handle PUT /api/update/:id (UPDATE)
      server.middlewares.use((req, res, next) => {
        const updateMatch = req.url.match(/^\/api\/update\/(\d+)/)
        if (!updateMatch || req.method !== 'PUT') return next()
        
        const userId = updateMatch[1]
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          const updateUrl = `${url.href}/${userId}`
          console.log('[API Proxy] ==========================================')
          console.log('[API Proxy] UPDATE REQUEST')
          console.log('[API Proxy] User ID:', userId)
          console.log('[API Proxy] Target URL:', updateUrl)
          console.log('[API Proxy] Hostname:', url.hostname)
          console.log('[API Proxy] Path:', `${url.pathname}/${userId}`)
          console.log('[API Proxy] Payload:', body)
          console.log('[API Proxy] ==========================================')
          
          const proxyReq = httpsRequest(
            {
              hostname: url.hostname,
              path: `${url.pathname}/${userId}`,
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'authentication_code': authCode,
              },
            },
            (proxyRes) => {
              let data = ''
              proxyRes.on('data', (chunk) => { data += chunk })
              proxyRes.on('end', () => {
                console.log('[API Proxy] ==========================================')
                console.log('[API Proxy] UPDATE RESPONSE')
                console.log('[API Proxy] Status:', proxyRes.statusCode)
                console.log('[API Proxy] Response Body:', data)
                console.log('[API Proxy] ==========================================')
                res.writeHead(proxyRes.statusCode, { 'Content-Type': 'application/json' })
                res.end(data)
              })
            }
          )
          proxyReq.on('error', (err) => {
            console.error('[API Proxy] UPDATE error:', err)
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ status: false, message: err.message }))
          })
          proxyReq.write(body)
          proxyReq.end()
        })
      })

      // Handle POST /api/portal/login (Portal Login)
      server.middlewares.use('/api/portal/login', (req, res, next) => {
        if (req.method !== 'POST') return next()
        
        let body = ''
        req.on('data', (chunk) => { body += chunk })
        req.on('end', () => {
          console.log('[Portal API] Login request')
          const { email, password } = JSON.parse(body)
          
          console.log('[Portal API] Looking up user by email:', email)
          console.log('[Portal API] Password provided:', password)
          
          // First, find user by email using GET request
          const proxyReq = httpsRequest(
            {
              hostname: url.hostname,
              path: `${url.pathname}?email=${encodeURIComponent(email)}`,
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'authentication_code': authCode,
              },
            },
            (proxyRes) => {
              let data = ''
              proxyRes.on('data', (chunk) => { data += chunk })
              proxyRes.on('end', () => {
                console.log('[Portal API] User lookup response:', proxyRes.statusCode)
                
                try {
                  const userData = JSON.parse(data)
                  console.log('[Portal API] ==========================================')
                  console.log('[Portal API] USER LOOKUP RESULT')
                  console.log('[Portal API] Response type:', Array.isArray(userData) ? 'Array' : 'Object')
                  console.log('[Portal API] ==========================================')
                  
                  // Check if user exists
                  let user = null
                  
                  if (Array.isArray(userData)) {
                    // If it's an array, find user by email
                    user = userData.find(u => u.email === email)
                    console.log('[Portal API] Found user in array:', user ? 'YES' : 'NO')
                  } else if (userData.data) {
                    // If it has a data property
                    if (Array.isArray(userData.data)) {
                      user = userData.data.find(u => u.email === email)
                      console.log('[Portal API] Found user in data array:', user ? 'YES' : 'NO')
                    } else {
                      user = userData.data
                      console.log('[Portal API] Using userData.data object')
                    }
                  } else {
                    user = userData
                    console.log('[Portal API] Using userData directly')
                  }
                  
                  if (!user) {
                    console.log('[Portal API] User not found')
                    res.writeHead(401, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ 
                      status: false, 
                      message: 'Invalid email or password' 
                    }))
                    return
                  }
                  
                  console.log('[Portal API] Extracted user:', JSON.stringify(user, null, 2))
                  
                  // Verify password (stored in card_number as plain text)
                  const storedPassword = user.card_number || ''
                  console.log('[Portal API] Stored password (from card_number):', storedPassword)
                  console.log('[Portal API] Provided password:', password)
                  
                  if (storedPassword !== password) {
                    console.log('[Portal API] Password mismatch')
                    res.writeHead(401, { 'Content-Type': 'application/json' })
                    res.end(JSON.stringify({ 
                      status: false, 
                      message: 'Invalid email or password' 
                    }))
                    return
                  }
                  
                  // Login successful
                  console.log('[Portal API] Login successful')
                  res.writeHead(200, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({
                    status: true,
                    token: user.id,
                    user: {
                      id: user.id,
                      email: user.email,
                      upsell1: user.upsell1 || false,
                      downsell1: user.downsell1 || false,
                      upsell2: user.upsell2 || false
                    }
                  }))
                } catch (e) {
                  console.error('[Portal API] Error parsing user data:', e)
                  res.writeHead(500, { 'Content-Type': 'application/json' })
                  res.end(JSON.stringify({ 
                    status: false, 
                    message: 'Server error' 
                  }))
                }
              })
            }
          )
          proxyReq.on('error', (err) => {
            console.error('[Portal API] Login error:', err)
            res.writeHead(502, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ status: false, message: err.message }))
          })
          proxyReq.end()
        })
      })

      // Handle GET /api/portal/user/:id/courses (Get user courses)
      server.middlewares.use((req, res, next) => {
        const courseMatch = req.url.match(/^\/api\/portal\/user\/(\d+)\/courses/)
        if (!courseMatch || req.method !== 'GET') return next()
        
        const userId = courseMatch[1]
        console.log('[Portal API] Fetching courses for user:', userId)
        
        const proxyReq = httpsRequest(
          {
            hostname: url.hostname,
            path: `${url.pathname}/${userId}`,
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'authentication_code': authCode,
            },
          },
          (proxyRes) => {
            let data = ''
            proxyRes.on('data', (chunk) => { data += chunk })
            proxyRes.on('end', () => {
              console.log('[Portal API] User data response:', proxyRes.statusCode)
              
              try {
                const userData = JSON.parse(data)
                // Extract upsell1 and upsell2 for course access
                const courseAccess = {
                  upsell1: userData.upsell1 || false,
                  upsell2: userData.upsell2 || false
                }
                res.writeHead(200, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify(courseAccess))
              } catch (e) {
                console.error('[Portal API] Failed to parse user data:', e)
                res.writeHead(500, { 'Content-Type': 'application/json' })
                res.end(JSON.stringify({ upsell1: false, upsell2: false }))
              }
            })
          }
        )
        proxyReq.on('error', (err) => {
          console.error('[Portal API] Courses error:', err)
          res.writeHead(502, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ status: false, message: err.message }))
        })
        proxyReq.end()
      })
    },
  }
}

dotenvConfig()

const apiUrl = process.env.API_URL || 'https://pb.adunbox.com/adu-reports/external/concealed-users'
const authCode = process.env.API_AUTH_CODE || ''

export default defineConfig({
  plugins: [apiProxy(apiUrl, authCode), serveMidPages(), react()],
})
