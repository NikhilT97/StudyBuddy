import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

const AuthPage = () => {
  const navigate = useNavigate()
  const { login, user } = useAuth()
  const { isDark } = useTheme()
  const canvasRef = useRef(null)
  const [tab, setTab] = useState('login')
  const [loading, setLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({ name: '', email: '', password: '', role: 'student' })

  if (user) {
    return user.role === 'admin' ? navigate('/admin') : navigate('/dashboard')
  }

  // ── Star canvas ──────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const stars = Array.from({ length: 100 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.3 + 0.2,
      speed: Math.random() * 0.25 + 0.04,
      opacity: Math.random() * 0.6 + 0.15,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
    }))

    const shootingStars = []
    const spawnInterval = setInterval(() => {
      shootingStars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height * 0.5,
        len: Math.random() * 70 + 40,
        speed: Math.random() * 4 + 3,
        opacity: 1,
        angle: Math.PI / 5,
      })
    }, 2800)

    let animId
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach(s => {
        s.opacity += s.twinkleSpeed * s.twinkleDir
        if (s.opacity > 0.85 || s.opacity < 0.08) s.twinkleDir *= -1
        s.y -= s.speed
        if (s.y < 0) { s.y = canvas.height; s.x = Math.random() * canvas.width }
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${s.opacity})`
        ctx.fill()
      })

      for (let i = shootingStars.length - 1; i >= 0; i--) {
        const ss = shootingStars[i]
        const grad = ctx.createLinearGradient(
          ss.x, ss.y,
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y + Math.sin(ss.angle) * ss.len
        )
        grad.addColorStop(0, `rgba(217,119,87,${ss.opacity})`)
        grad.addColorStop(1, 'rgba(217,119,87,0)')
        ctx.beginPath()
        ctx.moveTo(ss.x, ss.y)
        ctx.lineTo(
          ss.x - Math.cos(ss.angle) * ss.len,
          ss.y + Math.sin(ss.angle) * ss.len
        )
        ctx.strokeStyle = grad
        ctx.lineWidth = 1.5
        ctx.stroke()
        ss.x += Math.cos(ss.angle) * ss.speed
        ss.y += Math.sin(ss.angle) * ss.speed
        ss.opacity -= 0.018
        if (ss.opacity <= 0) shootingStars.splice(i, 1)
      }
      animId = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      clearInterval(spawnInterval)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // ── Handlers ─────────────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/login', loginData)
      login(data.user, data.token)
      toast.success(`Welcome back, ${data.user.name}!`)
      data.user.role === 'admin' ? navigate('/admin') : navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await API.post('/auth/register', registerData)
      login(data.user, data.token)
      toast.success('Account created!')
      navigate('/dashboard')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  // ── Styles ────────────────────────────────────────
  const inputStyle = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    marginBottom: '14px',
    fontFamily: 'inherit',
  }

  const labelStyle = {
    fontSize: '11px',
    color: 'var(--text-secondary)',
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: '6px',
  }

  const btnStyle = {
    width: '100%',
    background: 'var(--text-primary)',
    color: 'var(--bg-page)',
    border: 'none',
    borderRadius: '10px',
    padding: '12px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: loading ? 'not-allowed' : 'pointer',
    opacity: loading ? 0.6 : 1,
    fontFamily: 'inherit',
    marginTop: '4px',
  }

  const FloatCard = ({ top, delay, label, value, fill }) => (
    <div style={{
      position: 'absolute',
      top, left: '24px', right: '24px',
      background: 'rgba(255,255,255,0.06)',
      border: '0.5px solid rgba(255,255,255,0.1)',
      borderRadius: '14px',
      padding: '14px 16px',
      backdropFilter: 'blur(10px)',
      zIndex: 2,
      animation: `floatUp 6s ease-in-out ${delay} infinite`,
    }}>
      <div style={{ fontSize: '10px', color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
        {label}
      </div>
      <div style={{ fontSize: '13px', color: 'white', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{
          width: '6px', height: '6px',
          borderRadius: '50%',
          background: '#D97757',
          flexShrink: 0,
          animation: 'blink 2s ease-in-out infinite',
        }} />
        {value}
      </div>
      <div style={{ height: '3px', background: 'rgba(255,255,255,0.08)', borderRadius: '99px', marginTop: '8px' }}>
        <div style={{ height: '3px', background: '#D97757', borderRadius: '99px', width: fill }} />
      </div>
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', display: 'flex', fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,sans-serif' }}>
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-7px); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }
        .auth-input:focus {
          background: var(--bg-card) !important;
          border-color: #D97757 !important;
          box-shadow: 0 0 0 3px rgba(217,119,87,0.12) !important;
        }
        .auth-btn:hover {
          background: #D97757 !important;
          color: white !important;
          transform: translateY(-1px);
          box-shadow: 0 4px 16px rgba(217,119,87,0.3);
        }
        .tab-btn:hover { color: var(--text-primary) !important; }
      `}</style>

      {/* ── LEFT PANEL ── */}
      <div style={{
        width: '45%',
        background: '#111111',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '36px',
      }}>
        <canvas
          ref={canvasRef}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
        />

        <FloatCard top="48px" delay="0s" label="Current path" value="Machine Learning" fill="65%" />
        <FloatCard top="168px" delay="1s" label="AI Tutor session" value="12 messages today" fill="80%" />
        <FloatCard top="288px" delay="2s" label="Last quiz score" value="100% — Perfect! 🏆" fill="100%" />

        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{
            fontSize: '22px', fontWeight: '500',
            color: 'white', letterSpacing: '-0.02em',
            lineHeight: 1.4, marginBottom: '8px',
          }}>
            Learn anything.<br />Powered by AI.
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)' }}>
            Personalized paths · AI Tutor · Quizzes
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{
        width: '55%',
        background: 'var(--bg-page)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 48px',
      }}>
        <div style={{ width: '100%', maxWidth: '380px' }}>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '32px' }}>
            <div style={{
              width: '26px', height: '26px',
              background: '#D97757',
              borderRadius: '7px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '13px', color: 'white',
            }}>✦</div>
            <span style={{ fontSize: '15px', fontWeight: '500', color: 'var(--text-primary)', letterSpacing: '-0.01em' }}>
              Study<span style={{ color: '#D97757' }}>Buddy</span>
            </span>
          </div>

          {/* Tabs */}
          <div style={{
            display: 'flex',
            background: 'var(--bg-tab)',
            borderRadius: '10px',
            padding: '3px',
            marginBottom: '28px',
          }}>
            {['login', 'register'].map(t => (
              <button
                key={t}
                className="tab-btn"
                onClick={() => setTab(t)}
                style={{
                  flex: 1, padding: '8px',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '13px', fontWeight: '500',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  background: tab === t ? 'var(--bg-card)' : 'transparent',
                  color: tab === t ? 'var(--text-primary)' : 'var(--text-secondary)',
                  boxShadow: tab === t ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
                }}
              >
                {t === 'login' ? 'Sign in' : 'Register'}
              </button>
            ))}
          </div>

          {/* ── LOGIN ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin}>
              <h2 style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Welcome back
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Sign in to continue learning
              </p>

              <label style={labelStyle}>Email</label>
              <input
                className="auth-input"
                type="email"
                value={loginData.email}
                onChange={e => setLoginData({ ...loginData, email: e.target.value })}
                placeholder="you@example.com"
                required
                style={inputStyle}
              />

              <label style={labelStyle}>Password</label>
              <input
                className="auth-input"
                type="password"
                value={loginData.password}
                onChange={e => setLoginData({ ...loginData, password: e.target.value })}
                placeholder="••••••••"
                required
                style={inputStyle}
              />

              <button type="submit" className="auth-btn" disabled={loading} style={btnStyle}>
                {loading ? 'Signing in...' : 'Continue'}
              </button>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px', textAlign: 'center' }}>
                No account?{' '}
                <span onClick={() => setTab('register')} style={{ color: '#D97757', fontWeight: '500', cursor: 'pointer' }}>
                  Create one
                </span>
              </p>
            </form>
          )}

          {/* ── REGISTER ── */}
          {tab === 'register' && (
            <form onSubmit={handleRegister}>
              <h2 style={{ fontSize: '20px', fontWeight: '500', letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
                Create account
              </h2>
              <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
                Start your learning journey today
              </p>

              <label style={labelStyle}>Full name</label>
              <input className="auth-input" type="text" value={registerData.name}
                onChange={e => setRegisterData({ ...registerData, name: e.target.value })}
                placeholder="Nikhil Tayde" required style={inputStyle} />

              <label style={labelStyle}>Email</label>
              <input className="auth-input" type="email" value={registerData.email}
                onChange={e => setRegisterData({ ...registerData, email: e.target.value })}
                placeholder="you@example.com" required style={inputStyle} />

              <label style={labelStyle}>Password</label>
              <input className="auth-input" type="password" value={registerData.password}
                onChange={e => setRegisterData({ ...registerData, password: e.target.value })}
                placeholder="Min 6 characters" required style={inputStyle} />

              <label style={labelStyle}>Role</label>
              <select className="auth-input" value={registerData.role}
                onChange={e => setRegisterData({ ...registerData, role: e.target.value })}
                style={{ ...inputStyle, marginBottom: '20px' }}>
                <option value="student">Student</option>
                <option value="admin">Admin</option>
              </select>

              <button type="submit" className="auth-btn" disabled={loading} style={btnStyle}>
                {loading ? 'Creating account...' : 'Get started'}
              </button>

              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '16px', textAlign: 'center' }}>
                Have an account?{' '}
                <span onClick={() => setTab('login')} style={{ color: '#D97757', fontWeight: '500', cursor: 'pointer' }}>
                  Sign in
                </span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}

export default AuthPage