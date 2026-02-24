import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useState } from 'react'
import { FormProvider } from './context/FormContext'
import Header from './components/Header'
import Footer from './components/Footer'
import Screen1 from './screens/Screen1'
import Screen2 from './screens/Screen2'
import Screen3 from './screens/Screen3'
import Screen4 from './screens/Screen4'
import Screen5 from './screens/Screen5'
import Screen6 from './screens/Screen6'
import Screen7 from './screens/Screen7'
import Screen8 from './screens/Screen8'
import Screen9 from './screens/Screen9'
import Screen10 from './screens/Screen10'
import ContactPage from './screens/ContactPage'
import FAQPage from './screens/FAQPage'
import StateAcceptancePage from './screens/StateAcceptancePage'
import TermsPage from './screens/TermsPage'
import PrivacyPage from './screens/PrivacyPage'
import LoginPage from './portal/LoginPage'
import Dashboard from './portal/Dashboard'
import ProtectedRoute from './portal/ProtectedRoute'
import './App.css'

function getProgressStep(screenIndex) {
  if (screenIndex < 2) return 1
  if (screenIndex < 8) return 1
  if (screenIndex < 9) return 2
  return 3
}

function FunnelApp() {
  const [step, setStep] = useState(1)
  const [showContactPage, setShowContactPage] = useState(false)
  const [showFaqPage, setShowFaqPage] = useState(false)
  const [showStateAcceptancePage, setShowStateAcceptancePage] = useState(false)
  const [showTermsPage, setShowTermsPage] = useState(false)
  const [showPrivacyPage, setShowPrivacyPage] = useState(false)
  const screenIndex = step - 1
  const showHeader = step < 10 && !showContactPage && !showFaqPage && !showStateAcceptancePage && !showTermsPage && !showPrivacyPage
  const progressStep = getProgressStep(screenIndex)
  const showOverlayPage = showContactPage || showFaqPage || showStateAcceptancePage || showTermsPage || showPrivacyPage

  const next = () => {
    if (step < 10) setStep((s) => s + 1)
  }

  const goHome = () => {
    setShowContactPage(false)
    setShowFaqPage(false)
    setShowStateAcceptancePage(false)
    setShowTermsPage(false)
    setShowPrivacyPage(false)
  }

  const showContact = () => {
    setShowFaqPage(false)
    setShowStateAcceptancePage(false)
    setShowTermsPage(false)
    setShowPrivacyPage(false)
    setShowContactPage(true)
  }
  const showFaq = () => {
    setShowContactPage(false)
    setShowStateAcceptancePage(false)
    setShowTermsPage(false)
    setShowPrivacyPage(false)
    setShowFaqPage(true)
  }
  const showStateAcceptance = () => {
    setShowContactPage(false)
    setShowFaqPage(false)
    setShowTermsPage(false)
    setShowPrivacyPage(false)
    setShowStateAcceptancePage(true)
  }
  const showTerms = () => {
    setShowContactPage(false)
    setShowFaqPage(false)
    setShowStateAcceptancePage(false)
    setShowPrivacyPage(false)
    setShowTermsPage(true)
  }
  const showPrivacy = () => {
    setShowContactPage(false)
    setShowFaqPage(false)
    setShowStateAcceptancePage(false)
    setShowTermsPage(false)
    setShowPrivacyPage(true)
  }

  return (
    <FormProvider>
      <div className="app">
        {showHeader && <Header step={progressStep} showProgress={true} />}
        <main className="main">
          {showContactPage && <ContactPage onBack={goHome} />}
          {showFaqPage && <FAQPage onBack={goHome} />}
          {showStateAcceptancePage && <StateAcceptancePage onBack={goHome} />}
          {showTermsPage && <TermsPage onBack={goHome} />}
          {showPrivacyPage && <PrivacyPage onBack={goHome} />}
          {!showOverlayPage && (
            <>
              {step === 1 && <Screen1 onNext={next} />}
              {step === 2 && <Screen2 onNext={next} />}
              {step === 3 && <Screen3 onNext={next} />}
              {step === 4 && <Screen4 onNext={next} />}
              {step === 5 && <Screen5 onNext={next} />}
              {step === 6 && <Screen6 onNext={next} />}
              {step === 7 && <Screen7 onNext={next} />}
              {step === 8 && <Screen8 onNext={next} />}
              {step === 9 && <Screen9 onNext={next} />}
              {step === 10 && <Screen10 />}
            </>
          )}
        </main>
        {step < 10 && (
          <Footer
            onHomeClick={goHome}
            onContactClick={showContact}
            onFaqClick={showFaq}
            onStateAcceptanceClick={showStateAcceptance}
            onTermsClick={showTerms}
            onPrivacyClick={showPrivacy}
          />
        )}
      </div>
    </FormProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Main funnel route */}
        <Route path="/" element={<FunnelApp />} />
        
        {/* Portal routes */}
        <Route path="/portal/login" element={<LoginPage />} />
        <Route 
          path="/portal/dashboard" 
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Redirect /portal to dashboard */}
        <Route path="/portal" element={<Navigate to="/portal/dashboard" replace />} />
        
        {/* 404 - redirect to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
