import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios'
import Navbar from '../components/Navbar'

const AdminDashboard = () => {
  const navigate = useNavigate()
  const [analytics, setAnalytics] = useState(null)
  const [users, setUsers] = useState([])
  const [paths, setPaths] = useState([])
  const [activeTab, setActiveTab] = useState('analytics')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchAll() }, [])

  const fetchAll = async () => {
    try {
      const [a, u, p] = await Promise.all([
        API.get('/admin/analytics'),
        API.get('/admin/users'),
        API.get('/admin/paths'),
      ])
      setAnalytics(a.data.analytics)
      setUsers(u.data.users)
      setPaths(p.data.paths)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (userId, name) => {
    if (!window.confirm(`Delete ${name}?`)) return
    try {
      await API.delete(`/admin/users/${userId}`)
      setUsers(users.filter(u => u._id !== userId))
      toast.success('User deleted')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed')
    }
  }

  const statCards = analytics ? [
    { label: 'Total students', value: analytics.totalUsers },
    { label: 'Learning paths', value: analytics.totalPaths },
    { label: 'Quizzes taken', value: analytics.totalQuizzes },
    { label: 'Chat sessions', value: analytics.totalChats },
    { label: 'Quizzes submitted', value: analytics.totalSubmittedQuizzes },
    { label: 'Avg quiz score', value: analytics.averageQuizScore },
  ] : []

  if (loading) return (
    <div style={{
      minHeight: '100vh',
      background: 'var(--bg-page)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: 'var(--text-secondary)', fontSize: '14px',
    }}>
      Loading...
    </div>
  )

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>

      <Navbar
        rightContent={
          <div style={{
            fontSize: '10px',
            fontWeight: 500,
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            borderRadius: '99px',
            padding: '2px 10px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}>
            Admin
          </div>
        }
      />

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Page title */}
        <h1 style={{
          fontSize: '22px',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '28px',
        }}>
          Dashboard
        </h1>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          background: 'var(--bg-tab)',
          borderRadius: '10px',
          padding: '3px',
          width: 'fit-content',
          marginBottom: '28px',
          gap: '2px',
        }}>
          {['analytics', 'users', 'paths'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                background: activeTab === tab ? 'var(--bg-card)' : 'transparent',
                border: activeTab === tab ? '0.5px solid var(--border)' : 'none',
                borderRadius: '8px',
                padding: '6px 18px',
                fontSize: '13px',
                fontWeight: activeTab === tab ? 500 : 400,
                color: activeTab === tab ? 'var(--text-primary)' : 'var(--text-secondary)',
                cursor: 'pointer',
                textTransform: 'capitalize',
                fontFamily: 'inherit',
                boxShadow: activeTab === tab ? '0 1px 4px rgba(0,0,0,0.06)' : 'none',
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* ── Analytics tab ── */}
        {activeTab === 'analytics' && (
          <div>
            {/* Stat grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '10px',
              marginBottom: '20px',
            }}>
              {statCards.map(card => (
                <div key={card.label} style={{
                  background: 'var(--bg-card)',
                  border: '0.5px solid var(--border)',
                  borderRadius: '14px',
                  padding: '20px',
                }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    {card.label}
                  </p>
                  <p style={{
                    fontSize: '26px',
                    fontWeight: 500,
                    letterSpacing: '-0.02em',
                    color: 'var(--text-primary)',
                  }}>
                    {card.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Popular topics */}
            <div style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border)',
              borderRadius: '14px',
              padding: '20px',
            }}>
              <h3 style={{
                fontSize: '13px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: '16px',
              }}>
                Popular topics
              </h3>
              {analytics?.popularTopics.length === 0 ? (
                <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>No data yet</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {analytics?.popularTopics.map((topic, i) => (
                    <div key={topic._id} style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      background: 'var(--bg-secondary)',
                      borderRadius: '10px',
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontSize: '12px', color: 'var(--text-muted)', width: '16px' }}>
                          {i + 1}
                        </span>
                        <span style={{ fontSize: '14px', color: 'var(--text-primary)' }}>
                          {topic._id}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '12px',
                        color: 'var(--accent)',
                        background: 'var(--accent-light)',
                        borderRadius: '99px',
                        padding: '2px 10px',
                      }}>
                        {topic.count} {topic.count === 1 ? 'student' : 'students'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users tab ── */}
        {activeTab === 'users' && (
          <div style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '0.5px solid var(--border)',
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                Students ({users.length})
              </h3>
            </div>

            {users.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                No students yet
              </div>
            ) : (
              users.map((u, i) => (
                <div key={u._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: i < users.length - 1
                    ? '0.5px solid var(--border-subtle)'
                    : 'none',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <div style={{
                      width: '32px', height: '32px',
                      background: 'var(--accent-light)',
                      borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 500,
                      color: 'var(--accent)',
                    }}>
                      {u.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)' }}>
                        {u.name}
                      </p>
                      <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                        {u.email}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={() => handleDelete(u._id, u.name)}
                      style={{
                        background: 'none',
                        border: '0.5px solid var(--border)',
                        borderRadius: '7px',
                        padding: '4px 10px',
                        fontSize: '12px',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer',
                      }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── Paths tab ── */}
        {activeTab === 'paths' && (
          <div style={{
            background: 'var(--bg-card)',
            border: '0.5px solid var(--border)',
            borderRadius: '14px',
            overflow: 'hidden',
          }}>
            <div style={{
              padding: '16px 20px',
              borderBottom: '0.5px solid var(--border)',
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)' }}>
                All paths ({paths.length})
              </h3>
            </div>

            {paths.length === 0 ? (
              <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
                No paths yet
              </div>
            ) : (
              paths.map((path, i) => (
                <div key={path._id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 20px',
                  borderBottom: i < paths.length - 1
                    ? '0.5px solid var(--border-subtle)'
                    : 'none',
                }}>
                  <div>
                    <p style={{ fontSize: '14px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      {path.topic}
                    </p>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                      {path.userId?.name} · {path.userId?.email}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      background: 'var(--bg-secondary)',
                      color: 'var(--text-secondary)',
                      borderRadius: '99px',
                      padding: '2px 8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      border: '0.5px solid var(--border)',
                    }}>
                      {path.level}
                    </span>
                    <span style={{
                      fontSize: '13px',
                      color: 'var(--accent)',
                      fontWeight: 500,
                    }}>
                      {path.progress}%
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminDashboard