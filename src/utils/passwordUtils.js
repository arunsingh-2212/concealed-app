/**
 * Password utilities for user authentication
 */

/**
 * Generate a random password
 * @param {number} length - Password length (default: 12)
 * @returns {string} - Generated password
 */
export function generatePassword(length = 12) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*'
  let password = ''
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)]
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]
  password += '0123456789'[Math.floor(Math.random() * 10)]
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)]
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)]
  }
  
  // Shuffle the password
  return password.split('').sort(() => Math.random() - 0.5).join('')
}

/**
 * Simple hash function using Web Crypto API
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password in hex format
 */
export async function hashPassword(password) {
  const encoder = new TextEncoder()
  const data = encoder.encode(password)
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  return hashHex
}

/**
 * Verify password against hash
 * @param {string} password - Plain text password
 * @param {string} hash - Hashed password
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(password, hash) {
  const hashedInput = await hashPassword(password)
  return hashedInput === hash
}

/**
 * Generate password and return both plain and hashed versions
 * @returns {Promise<{plain: string, hashed: string}>}
 */
export async function generateAndHashPassword() {
  const plainPassword = generatePassword()
  const hashedPassword = await hashPassword(plainPassword)
  
  console.log('[Password] Generated password:', plainPassword)
  console.log('[Password] Hashed password:', hashedPassword)
  
  return {
    plain: plainPassword,
    hashed: hashedPassword
  }
}

