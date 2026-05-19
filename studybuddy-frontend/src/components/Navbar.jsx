import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ThemeToggle from './ThemeToggle'
import toast from 'react-hot-toast'

const Logo = () => (
  <svg width="130" height="28" viewBox="0 0 140 32" fill="none">
    {/* Left page */}
    <rect x="2" y="4" width="14" height="18" rx="2" fill="var(--bg-secondary)" stroke="#D97757" strokeWidth="1"/>
    <line x1="5" y1="9" x2="13" y2="9" stroke="var(--border)" strokeWidth="1" strokeLinecap="round"/>
    <line x1="5" y1="12" x2="13" y2="12" stroke="var(--border)" strokeWidth="1" strokeLinecap="round"/>
    <line x1="5" y1="15" x2="11" y2="15" stroke="var(--border)" strokeWidth="1" strokeLinecap="round"/>
    {/* Spine */}
    <rect x="16" y="4" width="2.5" height="18" rx="1" fill="#D97757"/>
    {/* Right page */}
    <rect x="18.5" y="4" width="14" height="18" rx="2" fill="var(--bg-secondary)" stroke="var(--border)" strokeWidth="0.8"/>
    <line x1="21" y1="9" x2="29" y2="9" stroke="var(--border)" strokeWidth="1" strokeLinecap="round"/>
    <line x1="21" y1="12" x2="29" y2="12" stroke="var(--border)" strokeWidth="1" strokeLinecap="round"/>
    <line x1="21" y1="15" x2="27" y2="15" stroke="var(--border)" strokeWidth="1" strokeLinecap="round"/>
    {/* Spark */}
    <circle cx="32" cy="7" r="5" fill="#D97757"/>
    <text x="32" y="10.5" textAnchor="middle" fontSize="6" fill="white" fontFamily="sans-serif">✦</text>
    {/* Wordmark */}
    <text x="42" y="20" fontSize="15" fontWeight="500" fontFamily="-apple-system,sans-serif" letterSpacing="-0.3">
      <tspan fill="var(--text-primary)">Study</tspan>
      <tspan fill="#D97757">Buddy</tspan>
    </text>
  </svg>
)

const Navbar = ({ showBack, backPath, title, rightContent }) => {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
    toast.success('Logged out')
  }

  return (
    <nav style={{
      background: 'var(--nav-bg)',
      borderBottom: '0.5px solid var(--border)',
      padding: '0 28px',
      height: '52px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 10,
    }}>

      {/* Left side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {showBack ? (
          <>
            <button
              onClick={() => navigate(backPath || '/dashboard')}
              style={{
                background: 'none', border: 'none',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer', padding: 0,
              }}
            >
              ← Back
            </button>
            <div style={{ width: '1px', height: '16px', background: 'var(--border)' }} />
            {title && (
              <span style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                {title}
              </span>
            )}
          </>
        ) : (
          <div onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
            <Logo />
          </div>
        )}
      </div>

      {/* Right side */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>

        {/* Custom right content */}
        {rightContent}

        {/* Theme toggle */}
        <ThemeToggle />

        {/* User info — only on main pages */}
        {!showBack && user && (
          <>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              {user.name}
            </span>
            <div style={{
              width: '30px', height: '30px',
              background: 'var(--accent-light)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '12px', fontWeight: 500,
              color: 'var(--accent)',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              style={{
                background: 'none',
                border: '0.5px solid var(--border)',
                borderRadius: '8px',
                padding: '5px 12px',
                fontSize: '13px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              Sign out
            </button>
          </>
        )}
      </div>
    </nav>
  )
}

export default Navbar