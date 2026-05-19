import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios'
import Navbar from '../components/Navbar'

const PathDetail = () => {
  const { pathId } = useParams()
  const navigate = useNavigate()
  const [path, setPath] = useState(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => { fetchPath() }, [])

  const fetchPath = async () => {
    try {
      const { data } = await API.get(`/paths/${pathId}`)
      setPath(data.path)
    } catch {
      toast.error('Failed to fetch path')
    } finally {
      setLoading(false)
    }
  }

  const handleMarkComplete = async (moduleIndex) => {
    setUpdating(moduleIndex)
    try {
      const { data } = await API.patch(`/paths/${pathId}/progress`, { moduleIndex })
      setPath(data.path)
      toast.success('Module completed! 🎉')
    } catch {
      toast.error('Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
      Loading...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>

      <Navbar
        showBack
        backPath="/dashboard"
        title={path?.topic}
        rightContent={
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => navigate(`/chat/${pathId}`)}
              style={{
                background: 'var(--accent-light)',
                color: 'var(--accent)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              AI Tutor
            </button>
            <button
              onClick={() => navigate(`/quiz/${pathId}`)}
              style={{
                background: 'var(--bg-secondary)',
                color: 'var(--text-secondary)',
                border: 'none',
                borderRadius: '8px',
                padding: '6px 14px',
                fontSize: '13px',
                cursor: 'pointer',
              }}
            >
              Quiz
            </button>
          </div>
        }
      />

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Progress card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '0.5px solid var(--border)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
              Overall progress
            </span>
            <span style={{ fontSize: '13px', fontWeight: 500, color: 'var(--accent)' }}>
              {path?.progress}%
            </span>
          </div>
          <div style={{ background: 'var(--bg-secondary)', borderRadius: '99px', height: '4px' }}>
            <div style={{
              background: 'var(--accent)',
              height: '4px',
              borderRadius: '99px',
              width: `${path?.progress}%`,
              transition: 'width 0.4s',
            }} />
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '8px' }}>
            {path?.modules.filter(m => m.isCompleted).length} of {path?.modules.length} modules completed
          </p>
        </div>

        {/* Modules label */}
        <h2 style={{
          fontSize: '11px',
          fontWeight: 500,
          color: 'var(--text-secondary)',
          textTransform: 'uppercase',
          letterSpacing: '0.06em',
          marginBottom: '12px',
        }}>
          Modules
        </h2>

        {/* Modules list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {path?.modules.map((module, index) => (
            <div
              key={module._id}
              style={{
                background: 'var(--bg-card)',
                border: `0.5px solid ${module.isCompleted ? '#A3E635' : 'var(--border)'}`,
                borderRadius: '14px',
                padding: '20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'flex-start',
              }}
            >
              {/* Number / check */}
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '8px',
                background: module.isCompleted ? '#F0FBE4' : 'var(--bg-secondary)',
                color: module.isCompleted ? '#3B6D11' : 'var(--text-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '12px', fontWeight: 500,
                flexShrink: 0,
              }}>
                {module.isCompleted ? '✓' : index + 1}
              </div>

              {/* Content */}
              <div style={{ flex: 1 }}>
                <h3 style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '4px' }}>
                  {module.title}
                </h3>
                <p style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '10px', lineHeight: 1.5 }}>
                  {module.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                  {module.topics.map((topic, i) => (
                    <span key={i} style={{
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      fontSize: '11px',
                      padding: '3px 10px',
                      borderRadius: '99px',
                      border: '0.5px solid var(--border)',
                    }}>
                      {topic}
                    </span>
                  ))}
                </div>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  ⏱ {module.estimatedDays} days
                </span>
              </div>

              {/* Button */}
              <div style={{ flexShrink: 0 }}>
                {module.isCompleted ? (
                  <span style={{
                    fontSize: '12px',
                    color: '#3B6D11',
                    background: '#F0FBE4',
                    padding: '5px 12px',
                    borderRadius: '8px',
                  }}>
                    Done ✓
                  </span>
                ) : (
                  <button
                    onClick={() => handleMarkComplete(index)}
                    disabled={updating === index}
                    style={{
                      background: updating === index ? 'var(--bg-secondary)' : 'var(--accent)',
                      color: updating === index ? 'var(--text-muted)' : 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '6px 14px',
                      fontSize: '12px',
                      fontWeight: 500,
                      cursor: updating === index ? 'not-allowed' : 'pointer',
                    }}
                  >
                    {updating === index ? '...' : 'Mark done'}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Completion banner */}
        {path?.progress === 100 && (
          <div style={{
            marginTop: '24px',
            background: '#F0FBE4',
            border: '0.5px solid #A3E635',
            borderRadius: '14px',
            padding: '24px',
            textAlign: 'center',
          }}>
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏆</div>
            <h3 style={{ fontSize: '15px', fontWeight: 500, color: '#3B6D11', marginBottom: '4px' }}>
              Path completed!
            </h3>
            <p style={{ fontSize: '13px', color: '#558B2F', marginBottom: '16px' }}>
              Test your knowledge with the quiz.
            </p>
            <button
              onClick={() => navigate(`/quiz/${pathId}`)}
              style={{
                background: '#3B6D11',
                color: 'white',
                border: 'none',
                borderRadius: '10px',
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 500,
                cursor: 'pointer',
              }}
            >
              Take quiz →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default PathDetail