const API_URL = '/api/submit'

function mapFormToApiPayload(form) {
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
    country: form.country || 'India',
    postal_code: form.postalCode || '',
    order_bump_instant_access: Boolean(form.upsellInstant),
    order_bump_additional_states: Boolean(form.upsellAdditionalStates),
    terms_accepted: Boolean(form.termsAccepted),
    upsell1: null,
    downsell1: null,
    upsell2: null,
    current_step: form.currentStep || 10,
    user_agent: navigator.userAgent,
    ip: '',
  }
}

export async function submitForm(formData) {
  const payload = mapFormToApiPayload(formData)

  const res = await fetch(API_URL, {
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
