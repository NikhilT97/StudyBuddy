import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios'
import Navbar from '../components/Navbar'

const Chat = () => {
  const { pathId } = useParams()
  const navigate = useNavigate()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [topic, setTopic] = useState('')
  const [user, setUser] = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    fetchHistory()
    fetchTopic()
    const savedUser = localStorage.getItem('user')
    if (savedUser) setUser(JSON.parse(savedUser))
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const fetchTopic = async () => {
    try {
      const { data } = await API.get(`/paths/${pathId}`)
      setTopic(data.path.topic)
    } catch {}
  }

  const fetchHistory = async () => {
    try {
      const { data } = await API.get(`/chat/${pathId}/history`)
      setMessages(data.messages || [])
    } catch {
      toast.error('Failed to load history')
    } finally {
      setLoading(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim()) return
    const userMessage = input.trim()
    setInput('')
    setSending(true)
    setMessages(prev => [...prev, { role: 'user', content: userMessage }])
    try {
      const { data } = await API.post(`/chat/${pathId}`, { message: userMessage })
      setMessages(prev => [...prev, { role: 'assistant', content: data.aiReply }])
    } catch {
      toast.error('Failed to send message')
      setMessages(prev => prev.slice(0, -1))
    } finally {
      setSending(false)
    }
  }

  const suggestions = [
    'What should I learn first?',
    'Give me a real world example',
    'Quiz me on this topic',
  ]

  const userInitial = user?.name?.charAt(0).toUpperCase() || 'U'

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', flexDirection: 'column' }}>

      <style>{`
        @keyframes bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-5px); }
        }
        .chat-input:focus {
          border-color: var(--accent) !important;
          background: var(--bg-card) !important;
          box-shadow: 0 0 0 3px rgba(217,119,87,0.1) !important;
        }
        .suggestion-btn:hover {
          border-color: var(--accent) !important;
          color: var(--accent) !important;
        }
        .send-btn:hover {
          background: var(--accent) !important;
          color: white !important;
        }
      `}</style>

      <Navbar
        showBack
        backPath={`/path/${pathId}`}
        title="AI Tutor"
        rightContent={
          topic && (
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              {topic}
            </span>
          )
        }
      />

      {/* Messages area */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px',
        maxWidth: '720px',
        width: '100%',
        margin: '0 auto',
      }}>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', color: 'var(--text-secondary)', fontSize: '14px', paddingTop: '60px' }}>
            Loading...
          </div>
        )}

        {/* Empty state */}
        {!loading && messages.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '60px' }}>
            <div style={{
              width: '44px', height: '44px',
              background: 'var(--accent-light)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '20px', margin: '0 auto 16px',
              color: 'var(--accent)',
            }}>
              ✦
            </div>
            <h3 style={{ fontSize: '16px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '6px' }}>
              Your AI Tutor is ready
            </h3>
            <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '24px' }}>
              Ask anything about <strong>{topic}</strong>
            </p>
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
              {suggestions.map(s => (
                <button
                  key={s}
                  className="suggestion-btn"
                  onClick={() => setInput(s)}
                  style={{
                    background: 'var(--bg-card)',
                    border: '0.5px solid var(--border)',
                    borderRadius: '99px',
                    padding: '7px 16px',
                    fontSize: '13px',
                    color: 'var(--text-secondary)',
                    cursor: 'pointer',
                  }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Messages */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {messages.map((msg, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: '10px',
                flexDirection: msg.role === 'user' ? 'row-reverse' : 'row',
                alignItems: 'flex-start',
              }}
            >
              {/* Avatar */}
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '8px',
                background: msg.role === 'assistant' ? 'var(--accent-light)' : 'var(--bg-secondary)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', flexShrink: 0,
                color: msg.role === 'assistant' ? 'var(--accent)' : 'var(--text-secondary)',
                border: '0.5px solid var(--border)',
              }}>
                {msg.role === 'assistant' ? '✦' : userInitial}
              </div>

              {/* Bubble */}
              <div style={{
                maxWidth: '75%',
                padding: '10px 14px',
                borderRadius: msg.role === 'user'
                  ? '14px 4px 14px 14px'
                  : '4px 14px 14px 14px',
                fontSize: '14px',
                lineHeight: 1.6,
                background: msg.role === 'user' ? 'var(--accent)' : 'var(--bg-card)',
                color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                border: msg.role === 'user' ? 'none' : '0.5px solid var(--border)',
              }}>
                {msg.content.split('\n').map((line, j) => (
                  <span key={j}>
                    {line}
                    {j < msg.content.split('\n').length - 1 && <br />}
                  </span>
                ))}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {sending && (
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
              <div style={{
                width: '28px', height: '28px',
                borderRadius: '8px',
                background: 'var(--accent-light)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', color: 'var(--accent)', flexShrink: 0,
                border: '0.5px solid var(--border)',
              }}>
                ✦
              </div>
              <div style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderRadius: '4px 14px 14px 14px',
                padding: '12px 16px',
                display: 'flex', gap: '4px', alignItems: 'center',
              }}>
                {[0, 1, 2].map(i => (
                  <div key={i} style={{
                    width: '6px', height: '6px',
                    background: 'var(--accent)',
                    borderRadius: '50%',
                    animation: `bounce 1.2s infinite`,
                    animationDelay: `${i * 0.2}s`,
                  }} />
                ))}
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>
      </div>

      {/* Input area */}
      <div style={{
        background: 'var(--nav-bg)',
        borderTop: '0.5px solid var(--border)',
        padding: '12px 24px',
      }}>
        <div style={{
          maxWidth: '720px',
          margin: '0 auto',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-end',
        }}>
          <textarea
            className="chat-input"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
            placeholder="Ask anything... (Enter to send)"
            rows={1}
            style={{
              flex: 1,
              background: 'var(--bg-input)',
              border: '1px solid var(--border)',
              borderRadius: '10px',
              padding: '10px 14px',
              fontSize: '14px',
              color: 'var(--text-primary)',
              resize: 'none',
              outline: 'none',
              lineHeight: 1.5,
              fontFamily: 'inherit',
            }}
          />
          <button
            className="send-btn"
            onClick={handleSend}
            disabled={sending || !input.trim()}
            style={{
              width: '38px', height: '38px',
              background: sending || !input.trim() ? 'var(--bg-secondary)' : 'var(--text-primary)',
              border: '0.5px solid var(--border)',
              borderRadius: '10px',
              color: sending || !input.trim() ? 'var(--text-muted)' : 'var(--bg-page)',
              fontSize: '16px',
              cursor: sending || !input.trim() ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            ↑
          </button>
        </div>
      </div>
    </div>
  )
}

export default Chat