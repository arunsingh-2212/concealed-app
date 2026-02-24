import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ProfileDropdown from './ProfileDropdown'
import concealedCarryMastery from '../assets/concealed_carry_mastery.jpeg'
import herShield from '../assets/her_shield.jpeg'
import firstAid from '../assets/first_aid.jpeg'
import concealedAppLogo from '../assets/concealapp-logo.jpeg'
import './Dashboard.css'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      // Get user from localStorage
      const storedUser = localStorage.getItem('portalUser')
      if (!storedUser) {
        console.log('[Dashboard] No user found, redirecting to login')
        navigate('/portal/login')
        return
      }

      const userData = JSON.parse(storedUser)
      console.log('[Dashboard] Loaded user:', userData)
      console.log('[Dashboard] upsell1:', userData.upsell1)
      console.log('[Dashboard] downsell1:', userData.downsell1)
      console.log('[Dashboard] upsell2:', userData.upsell2)
      setUser(userData)

      // Define available courses with access control based on user data
      // Show ALL courses, lock the ones where access is false
      const allCourses = [
        {
          id: 'concealedapp-ocr',
          title: 'CCW Application Portal',
          subtitle: 'Access your concealed carry application',
          instructor: 'Cole Bryant',
          instructorImage: null,
          thumbnail: concealedAppLogo,
          progress: 0,
          hasAccess: true,  // Always unlocked
          accessKey: 'always_unlocked',
          isPremium: false,
          price: null
        },
        {
          id: 'concealed-carry-premium',
          title: 'CONCEALED CARRY MASTERY + HER SHIELD',
          subtitle: 'Premium: Obtaining skills you can rely on + Her Shield Bonus',
          instructor: 'Cole Bryant',
          instructorImage: null,
          thumbnail: herShield,
          progress: 8,
          hasAccess: userData.upsell1 === true,
          accessKey: 'upsell1',
          isPremium: true,
          price: '$97'
        },
        {
          id: 'concealed-carry-standard',
          title: 'CONCEALED CARRY MASTERY',
          subtitle: 'Standard: Obtaining skills you can rely on',
          instructor: 'Cole Bryant',
          instructorImage: null,
          thumbnail: concealedCarryMastery,
          progress: 8,
          hasAccess: userData.downsell1 === true,
          accessKey: 'downsell1',
          isPremium: false,
          price: '$47'
        },
        {
          id: 'firearm-first-aid',
          title: 'Firearm First Aid Training',
          subtitle: 'The step-by-step system that gives responsible gun owners the confidence and medical readiness to act fast when seconds count most.',
          instructor: 'Instructor Name',
          instructorImage: null,
          thumbnail: firstAid,
          progress: 25,
          hasAccess: userData.upsell2 === true,
          accessKey: 'upsell2',
          price: '$67'
        }
      ]

      console.log('[Dashboard] Courses:', allCourses)
      setCourses(allCourses)
    } catch (error) {
      console.error('[Dashboard] Error loading user data:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCourseClick = (course) => {
    if (!course.hasAccess) {
      return // Don't navigate, Buy Now button will handle it
    }
    navigate(`/portal/course/${course.id}`)
  }

  const handleBuyNow = (course, e) => {
    e.stopPropagation() // Prevent card click
    
    // TODO: Redirect to payment checkout page
    // For now, show alert
    const checkoutUrl = '/checkout'  // PLACEHOLDER: Update with actual checkout URL
    
    alert(`Redirecting to purchase ${course.title} for ${course.price}.\n\nCheckout URL: ${checkoutUrl}`)
    
    // When ready, uncomment this:
    // window.location.href = checkoutUrl + '?course=' + course.id
  }

  const showPasswordForTesting = () => {
    // Try to get password from sessionStorage (set during thank you page)
    const storedPassword = sessionStorage.getItem('generatedPassword')
    
    if (storedPassword) {
      // Create a copyable alert
      const textArea = document.createElement('textarea')
      textArea.value = storedPassword
      textArea.style.position = 'fixed'
      textArea.style.top = '0'
      textArea.style.left = '0'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      
      try {
        document.execCommand('copy')
        alert(`🔐 Password Copied to Clipboard!\n\nPassword: ${storedPassword}\n\nThe password has been copied. You can paste it anywhere.`)
      } catch (err) {
        alert(`🔐 Your Login Password:\n\n${storedPassword}\n\n(Automatic copy failed, please copy manually)`)
      }
      
      document.body.removeChild(textArea)
    } else {
      alert('⚠️ No password found in session storage.\n\nThe password is only available after completing the checkout flow.')
    }
  }

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your courses...</p>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="dashboard-page" style={{ zoom: '1.15' }}>
      <aside className="dashboard-sidebar">
        <div className="sidebar-header">
          <img src={concealedAppLogo} alt="Concealed App Logo" style={{ width: '180px', height: 'auto', borderRadius: '8px' }} />
        </div>

        <nav className="sidebar-nav">
          <button className="nav-item active">
            <span>Courses</span>
          </button>
        </nav>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-header">
          <div className="header-search">
            <input
              type="text"
              placeholder="Search courses, categories and lessons"
              className="search-input"
            />
          </div>

          <div className="header-actions">
            <ProfileDropdown user={user} />
          </div>
        </header>

        <div className="dashboard-content">
          <div className="welcome-section">
            <p className="welcome-greeting">Hi, {user.email?.split('@')[0] || 'User'}!</p>
            <h1 className="welcome-title">Welcome to Course Portal</h1>
          </div>

          <div className="courses-grid">
            {courses.map((course) => (
              <div
                key={course.id}
                className={`course-card ${!course.hasAccess ? 'course-locked' : ''}`}
                onClick={() => handleCourseClick(course)}
              >
                <div className="course-thumbnail">
                  <img src={course.thumbnail} alt={course.title} />
                  {course.isPremium && course.hasAccess && (
                    <div className="premium-badge">Premium + Her Shield</div>
                  )}
                </div>

                <div className="course-info">
                  <h3 className="course-title">{course.title}</h3>
                  <p className="course-subtitle">{course.subtitle}</p>
                </div>

                {!course.hasAccess && (
                  <div className="course-lock-section">
                    <div className="lock-icon-inline">🔒</div>
                    <button 
                      className="buy-now-btn-inline"
                      onClick={(e) => handleBuyNow(course, e)}
                    >
                      Buy Now {course.price}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          {courses.filter(c => c.hasAccess).length === 0 && (
            <div className="no-courses">
              <div className="no-courses-icon">📚</div>
              <h3>No courses available</h3>
              <p>You don't have access to any courses yet.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

