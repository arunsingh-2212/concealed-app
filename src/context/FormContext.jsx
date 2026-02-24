import { createContext, useContext, useState, useCallback } from 'react'
import { submitForm as submitFormApi } from '../api'
import { insertUserData, updateUserData } from '../apiService'

const defaultForm = {
  zipCode: '',
  question1: null,
  question2: null,
  question3: null,
  question4: null,
  question5: null,
  question6: null,
  finalQuestion: null,
  successContinue: false,
  successProceedNow: false,
  email: '',
  paymentMethod: 'credit',
  cardNumber: '',
  expirationDate: '',
  securityCode: '',
  cardholderName: '',
  country: 'India',
  postalCode: '',
  upsellInstant: false,
  upsellAdditionalStates: false,
  termsAccepted: false,
}

const FormContext = createContext(null)

export function FormProvider({ children }) {
  const [form, setForm] = useState(defaultForm)
  const [userId, setUserId] = useState(null)

  const update = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }, [])

  const getFormJson = useCallback(() => {
    return { ...form }
  }, [form])

  const submitForm = useCallback(async () => {
    return submitFormApi(form)
  }, [form])

  const insertData = useCallback(async () => {
    try {
      console.log('[FormContext] Starting INSERT...')
      const response = await insertUserData(form)
      console.log('[FormContext] INSERT Response:', response)
      
      // Extract user ID from response
      let extractedUserId = null
      if (response && response.id) {
        extractedUserId = response.id
      } else if (response && response.data && response.data.id) {
        extractedUserId = response.data.id
      } else if (response && response.user_id) {
        extractedUserId = response.user_id
      } else if (response && response.userId) {
        extractedUserId = response.userId
      } else if (response && response.insertId) {
        extractedUserId = response.insertId
      }
      
      console.log('[FormContext] Extracted User ID:', extractedUserId)
      
      if (extractedUserId) {
        setUserId(extractedUserId)
        sessionStorage.setItem('concealedUserId', String(extractedUserId))
        console.log('[FormContext] User ID saved to state and sessionStorage:', extractedUserId)
      } else {
        console.warn('[FormContext] No user ID found in response, checking for text response')
        // Sometimes API returns just the ID as text
        if (response && typeof response === 'string' && !isNaN(response)) {
          extractedUserId = parseInt(response)
          setUserId(extractedUserId)
          sessionStorage.setItem('concealedUserId', String(extractedUserId))
          console.log('[FormContext] User ID extracted from text response:', extractedUserId)
        } else {
          console.error('[FormContext] Could not extract user ID from response:', response)
        }
      }
      
      return response
    } catch (error) {
      console.error('[FormContext] Insert failed:', error)
      throw error
    }
  }, [form])

  const updateData = useCallback(async (updatePayload) => {
    const id = userId || sessionStorage.getItem('concealedUserId')
    console.log('[FormContext] UPDATE - User ID from state:', userId)
    console.log('[FormContext] UPDATE - User ID from sessionStorage:', sessionStorage.getItem('concealedUserId'))
    console.log('[FormContext] UPDATE - Using ID:', id)
    
    if (!id) {
      console.error('[FormContext] No user ID available for update. Cannot proceed.')
      console.error('[FormContext] userId state:', userId)
      console.error('[FormContext] sessionStorage concealedUserId:', sessionStorage.getItem('concealedUserId'))
      return null
    }
    
    try {
      console.log('[FormContext] Calling updateUserData with:', { id, updatePayload })
      const result = await updateUserData(id, updatePayload)
      console.log('[FormContext] Update successful:', result)
      return result
    } catch (error) {
      console.error('[FormContext] Update failed:', error)
      throw error
    }
  }, [userId])

  return (
    <FormContext.Provider value={{ 
      form, 
      update, 
      getFormJson, 
      submitForm,
      insertData,
      updateData,
      userId 
    }}>
      {children}
    </FormContext.Provider>
  )
}

export function useForm() {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useForm must be used within FormProvider')
  return ctx
}
