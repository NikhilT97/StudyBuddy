import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [paths, setPaths] = useState([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({ topic: '', level: 'beginner' })

  useEffect(() => { fetchPaths() }, [])

  const fetchPaths = async () => {
    try {
      const { data } = await API.get('/paths/my-paths')
      setPaths(data.paths)
    } catch {
      toast.error('Failed to fetch paths')
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async (e) => {
    e.preventDefault()
    setGenerating(true)
    try {
      const { data } = await API.post('/paths/generate', formData)
      setPaths([data.learningPath, ...paths])
      setShowModal(false)
      setFormData({ topic: '', level: 'beginner' })
      toast.success('Learning path generated!')
    } catch {
      toast.error('Failed to generate path')
    } finally {
      setGenerating(false)
    }
  }

  const levelStyle = (level) => {
    if (level === 'beginner') return { bg: '#F0FBE4', color: '#3B6D11' }
    if (level === 'intermediate') return { bg: '#FFF8E1', color: '#B8860B' }
    return { bg: '#FEE2E2', color: '#991B1B' }
  }

  const inputStyle = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border)',
    borderRadius: '10px',
    padding: '11px 14px',
    fontSize: '14px',
    color: 'var(--text-primary)',
    outline: 'none',
    marginBottom: '16px',
    fontFamily: 'inherit',
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>

      <Navbar />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '24px', fontWeight: 500, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginBottom: '4px' }}>
              Good {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 17 ? 'afternoon' : 'evening'}, {user?.name?.split(' ')[0]}.
            </h1>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>
              {paths.length === 0
                ? 'Start your first learning path.'
                : `${paths.length} path${paths.length > 1 ? 's' : ''} in progress.`}
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              background: 'var(--accent)',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              padding: '10px 18px',
              fontSize: '13px',
              fontWeight: 500,
              cursor: 'pointer',
            }}
          >
            + New path
          </button>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-secondary)', fontSize: '14px' }}>
            Loading...
          </div>
        )}

        {/* Empty state */}
        {!loading && paths.length === 0 && (
          <div style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border)',
            borderRadius: '16px',
            padding: '60px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '28px', marginBottom: '12px' }}>✦</div>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
              No paths yet
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '20px' }}>
              Generate your first AI learning path to get started.
            </p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                background: 'var(--accent)',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Generate path
            </button>
          </div>
        )}

        {/* Path cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '12px',
        }}>
          {paths.map(path => (
            <div
              key={path._id}
              onClick={() => navigate(`/path/${path._id}`)}
              style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderRadius: '16px',
                padding: '20px',
                cursor: 'pointer',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
            >
              {/* Level tag */}
              <div style={{
                display: 'inline-block',
                fontSize: '10px',
                fontWeight: 500,
                background: levelStyle(path.level).bg,
                color: levelStyle(path.level).color,
                borderRadius: '99px',
                padding: '2px 8px',
                marginBottom: '10px',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}>
                {path.level}
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: '15px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: '12px',
                letterSpacing: '-0.01em',
              }}>
                {path.topic}
              </h3>

              {/* Progress bar */}
              <div style={{ background: 'var(--bg-secondary)', borderRadius: '99px', height: '3px', marginBottom: '6px' }}>
                <div style={{
                  background: 'var(--accent)',
                  height: '3px',
                  borderRadius: '99px',
                  width: `${path.progress}%`,
                  transition: 'width 0.3s',
                }} />
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
                {path.modules.length} modules · {path.progress}% complete
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', gap: '6px' }}>
                {[
                  { label: 'Tutor', route: `/chat/${path._id}` },
                  { label: 'Quiz', route: `/quiz/${path._id}` },
                ].map(btn => (
                  <button
                    key={btn.label}
                    onClick={e => { e.stopPropagation(); navigate(btn.route) }}
                    style={{
                      flex: 1,
                      background: 'var(--bg-secondary)',
                      border: '0.5px solid var(--border)',
                      borderRadius: '8px',
                      padding: '6px 0',
                      fontSize: '12px',
                      color: 'var(--text-secondary)',
                      cursor: 'pointer',
                    }}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '24px', zIndex: 50,
          backdropFilter: 'blur(4px)',
        }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: '20px',
            padding: '32px',
            width: '100%',
            maxWidth: '420px',
            border: '0.5px solid var(--border)',
          }}>
            <h2 style={{ fontSize: '18px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px', letterSpacing: '-0.02em' }}>
              New learning path
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              AI will generate a personalized path for you.
            </p>

            <form onSubmit={handleGenerate}>
              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                What do you want to learn?
              </label>
              <input
                type="text"
                value={formData.topic}
                onChange={e => setFormData({ ...formData, topic: e.target.value })}
                placeholder="e.g. Machine Learning, React, Python..."
                required
                style={inputStyle}
              />

              <label style={{ fontSize: '11px', color: 'var(--text-secondary)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>
                Your level
              </label>
              <select
                value={formData.level}
                onChange={e => setFormData({ ...formData, level: e.target.value })}
                style={{ ...inputStyle, marginBottom: '24px' }}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  style={{
                    flex: 1,
                    background: 'var(--bg-secondary)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '11px',
                    fontSize: '14px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={generating}
                  style={{
                    flex: 1,
                    background: generating ? 'var(--bg-secondary)' : 'var(--accent)',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '11px',
                    fontSize: '14px',
                    fontWeight: 500,
                    color: generating ? 'var(--text-muted)' : 'white',
                    cursor: generating ? 'not-allowed' : 'pointer',
                  }}
                >
                  {generating ? 'Generating...' : 'Generate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Dashboard