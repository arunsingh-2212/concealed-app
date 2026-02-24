import { useForm } from '../context/FormContext'
import { useState } from 'react'
import './Screen10.css'

export default function Screen10() {
  const { form, update, getFormJson, insertData } = useForm()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleOrderNow = async (e) => {
    e.preventDefault()
    
    if (isSubmitting) {
      console.log('[Screen10] Already submitting, please wait...')
      return
    }
    
    setIsSubmitting(true)
    
    try {
      // Save form data to sessionStorage for the flow
      const data = getFormJson()
      console.log('[Screen10] Form data to save:', data)
      sessionStorage.setItem('concealedFormData', JSON.stringify(data))
      console.log('[Screen10] Form data saved to sessionStorage')
      
      // Insert data into database and get user ID
      console.log('[Screen10] ===== STARTING DATABASE INSERT =====')
      const response = await insertData()
      console.log('[Screen10] ===== INSERT COMPLETED =====')
      console.log('[Screen10] INSERT Response:', response)
      
      // Verify user ID was saved
      const savedUserId = sessionStorage.getItem('concealedUserId')
      console.log('[Screen10] Saved User ID in sessionStorage:', savedUserId)
      
      if (!savedUserId) {
        console.error('[Screen10] WARNING: No user ID found after insert!')
        alert('Warning: Failed to save user ID. Please try again or contact support.')
      } else {
        console.log('[Screen10] ✅ User ID successfully saved:', savedUserId)
      }
      
      // Small delay to ensure sessionStorage is written
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Navigate to upsell funnel
      console.log('[Screen10] Redirecting to upsell funnel...')
      window.location.href = '/midpages/scr1/index.html'
    } catch (error) {
      console.error('[Screen10] ===== INSERT FAILED =====')
      console.error('[Screen10] Error details:', error)
      console.error('[Screen10] Error message:', error.message)
      console.error('[Screen10] Error stack:', error.stack)
      
      setIsSubmitting(false)
      
      // Show error to user
      alert(`Failed to save data: ${error.message}\n\nPlease check your connection and try again.`)
    }
  }

  return (
    <div className="screen screen-10">
      <div className="payment-hero">
        <div className="payment-logo">CERTIFIED CONCEALED FIRST</div>
        <div className="payment-features">
          <span>✓ Skip The Scheduling Hassle</span>
          <span>✓ Get Certified Faster</span>
          <span>✓ Easy Application Process</span>
        </div>
      </div>

      <div className="payment-layout">
        <div className="payment-form-col">
          <form onSubmit={handleOrderNow}>
            <section className="form-section">
              <h2>Customer Information</h2>
              <label>Email Address*</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => update('email', e.target.value)}
                placeholder="To receive an email order confirmation."
              />
            </section>

            <section className="form-section">
              <h2>Payment Information</h2>
              <p className="form-note">All transactions are secure and encrypted.</p>
              <div className="radio-group">
                <label className="radio-label">
                  <input
                    type="radio"
                    name="payment"
                    checked={form.paymentMethod === 'paypal'}
                    onChange={() => update('paymentMethod', 'paypal')}
                  />
                  PayPal
                </label>
                <label className="radio-label">
                  <input
                    type="radio"
                    name="payment"
                    checked={form.paymentMethod === 'credit'}
                    onChange={() => update('paymentMethod', 'credit')}
                  />
                  Credit Card
                </label>
                <span className="card-icons">Visa Mastercard Amex Discover 🔒</span>
              </div>

              {form.paymentMethod === 'credit' && (
                <div className="card-fields">
                  <label>Card Number*</label>
                  <input
                    type="text"
                    value={form.cardNumber}
                    onChange={(e) => update('cardNumber', e.target.value)}
                    placeholder="Card number"
                  />
                  <label>Expiration Date*</label>
                  <input
                    type="text"
                    value={form.expirationDate}
                    onChange={(e) => update('expirationDate', e.target.value)}
                    placeholder="MM/YY"
                  />
                  <label>Security Code* <span className="info-icon">ⓘ</span></label>
                  <input
                    type="text"
                    value={form.securityCode}
                    onChange={(e) => update('securityCode', e.target.value)}
                    placeholder="CVV"
                  />
                  <label>Cardholder Name*</label>
                  <input
                    type="text"
                    value={form.cardholderName}
                    onChange={(e) => update('cardholderName', e.target.value)}
                    placeholder="Name on card"
                  />
                  <label>Country*</label>
                  <select
                    value={form.country}
                    onChange={(e) => update('country', e.target.value)}
                  >
                    <option>India</option>
                    <option>United States</option>
                    <option>United Kingdom</option>
                    <option>Canada</option>
                  </select>
                  <label>Postal Code</label>
                  <input
                    type="text"
                    value={form.postalCode}
                    onChange={(e) => update('postalCode', e.target.value)}
                    placeholder="Postal code"
                  />
                </div>
              )}
            </section>

            <section className="form-section">
              <h2>Recommended for You</h2>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.upsellInstant}
                  onChange={(e) => update('upsellInstant', e.target.checked)}
                />
                <span className="checkbox-text">Digital Product</span>
                <span>Include Instant access to my purchase for only ₹1,009.90 right now!</span>
              </label>
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={form.upsellAdditionalStates}
                  onChange={(e) => update('upsellAdditionalStates', e.target.checked)}
                />
                <span className="checkbox-text">Digital Product</span>
                <span>Yes! I'd like to add Carry in Additional States to my order for ₹1,515.37</span>
              </label>
            </section>

            <p className="terms-text">
              By clicking Order Now below, I agree to the <a href="#">Terms of Sale</a>
            </p>
            <button type="submit" className="btn btn-order" disabled={isSubmitting}>
              {isSubmitting ? 'Processing...' : 'Order Now'}
            </button>

            <div className="trust-seals">digicert Secured | BBB A+ | TrustedSite Secure Checkout</div>
          </form>
        </div>

        <div className="cart-col">
          <div className="cart-box">
            <h2>Secure Payment</h2>
            <div className="countdown-box">
              <p>Acceptance of application ends in:</p>
              <div className="countdown">11:48</div>
            </div>
          </div>
          <div className="cart-box">
            <h2>Cart Summary</h2>
            <div className="cart-item">
              <div className="cart-item-image">Concealed Carry Permit [RUSH]</div>
              <div className="cart-item-details">
                <strong>CCW Application Portal</strong>
                <span>Digital Product</span>
                <span className="cart-price">₹11,119.09</span>
              </div>
            </div>
            <div className="cart-totals">
              <div className="row"><span>Subtotal</span><span>₹11,119.09</span></div>
              <div className="row"><span>Tax</span><span>₹2,001.44</span></div>
              <div className="row total"><span>TOTAL</span><span>₹13,120.53</span></div>
            </div>
            <p className="cart-note">Immediate access to digital products or services in your cart are available once payment is approved.</p>
          </div>
        </div>
      </div>

      <footer className="screen10-footer">
        <div className="footer-block">
          <h3>ClickBank Guarantee</h3>
          <p>Return policy applies. Purchase may appear as CLKBANK*CertifiedFirst on your statement.</p>
        </div>
        <div className="footer-block">
          <h3>Need Help?</h3>
          <p><a href="#">Customer Support</a> | 1-800-390-6035</p>
        </div>
        <p className="copyright">Copyright 2026 © Click Sales Inc. / ClickBank / 1444 S. Entertainment Ave / Suite 410 / Boise ID 83709.</p>
      </footer>
    </div>
  )
}
