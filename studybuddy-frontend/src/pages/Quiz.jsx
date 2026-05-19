import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import API from '../api/axios'
import Navbar from '../components/Navbar'

const Quiz = () => {
  const { pathId } = useParams()
  const navigate = useNavigate()
  const [quiz, setQuiz] = useState(null)
  const [answers, setAnswers] = useState({})
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [generating, setGenerating] = useState(false)

  useEffect(() => { fetchExistingResult() }, [])

  const fetchExistingResult = async () => {
    try {
      const { data } = await API.get(`/quiz/${pathId}/result`)
      setResult(data)
    } catch {}
    finally { setLoading(false) }
  }

  const handleGenerate = async () => {
    setGenerating(true)
    try {
      const { data } = await API.post(`/quiz/${pathId}/generate`)
      setQuiz(data)
      toast.success('Quiz ready! Good luck 🎯')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to generate quiz')
    } finally { setGenerating(false) }
  }

  const handleSubmit = async () => {
    if (Object.keys(answers).length < quiz.totalQuestions) {
      toast.error('Please answer all questions first')
      return
    }
    setSubmitting(true)
    try {
      const formattedAnswers = Object.entries(answers).map(([qi, sa]) => ({
        questionIndex: parseInt(qi),
        selectedAnswer: sa,
      }))
      const { data } = await API.post(`/quiz/${pathId}/submit`, { answers: formattedAnswers })
      setResult(data)
      setQuiz(null)
      toast.success('Quiz submitted!')
    } catch {
      toast.error('Failed to submit')
    } finally { setSubmitting(false) }
  }

  // ── Loading ───────────────────────────────────────
  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', fontSize: '14px' }}>
      Loading...
    </div>
  )

  // ── Result screen ─────────────────────────────────
  if (result) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar
        showBack
        backPath={`/path/${pathId}`}
        title="Quiz result"
      />

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '40px 24px' }}>

        {/* Score card */}
        <div style={{
          background: 'var(--bg-card)',
          border: `0.5px solid ${result.score >= 80 ? '#A3E635' : result.score >= 50 ? '#FCD34D' : '#FCA5A5'}`,
          borderRadius: '16px',
          padding: '36px',
          textAlign: 'center',
          marginBottom: '20px',
        }}>
          <div style={{ fontSize: '40px', marginBottom: '12px' }}>
            {result.score >= 80 ? '🏆' : result.score >= 50 ? '👍' : '💪'}
          </div>
          <div style={{
            fontSize: '52px',
            fontWeight: 500,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: '4px',
          }}>
            {result.score}%
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
            {result.correctAnswers} of {result.totalQuestions} correct
          </p>
          <p style={{
            fontSize: '14px',
            fontWeight: 500,
            color: result.score >= 80 ? '#3B6D11' : result.score >= 50 ? '#B8860B' : '#991B1B',
          }}>
            {result.score >= 80
              ? 'Excellent work!'
              : result.score >= 50
              ? 'Good effort, keep going!'
              : 'Review and try again!'}
          </p>
        </div>

        {/* Detailed results */}
        {result.results && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            <h3 style={{
              fontSize: '11px',
              fontWeight: 500,
              color: 'var(--text-secondary)',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '4px',
            }}>
              Detailed results
            </h3>
            {result.results.map((r, i) => (
              <div key={i} style={{
                background: 'var(--bg-card)',
                border: '0.5px solid var(--border)',
                borderLeft: `3px solid ${r.isCorrect ? '#A3E635' : '#EF4444'}`,
                borderRadius: '12px',
                padding: '16px',
              }}>
                <p style={{ fontSize: '13px', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '8px' }}>
                  {i + 1}. {r.question}
                </p>
                <p style={{ fontSize: '13px', color: r.isCorrect ? '#3B6D11' : '#991B1B', marginBottom: '4px' }}>
                  {r.isCorrect ? '✓' : '✗'} Your answer: <strong>{r.yourAnswer}</strong>
                </p>
                {!r.isCorrect && (
                  <p style={{ fontSize: '13px', color: '#3B6D11', marginBottom: '4px' }}>
                    ✓ Correct: <strong>{r.correctAnswer}</strong>
                  </p>
                )}
                <p style={{
                  fontSize: '12px',
                  color: 'var(--text-secondary)',
                  background: 'var(--bg-secondary)',
                  borderRadius: '8px',
                  padding: '8px 12px',
                  marginTop: '8px',
                  lineHeight: 1.5,
                }}>
                  💡 {r.explanation}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Actions */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              flex: 1,
              background: 'var(--bg-secondary)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '14px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            Dashboard
          </button>
          <button
            onClick={() => navigate(`/chat/${pathId}`)}
            style={{
              flex: 1,
              background: 'var(--accent)',
              border: 'none',
              borderRadius: '10px',
              padding: '12px',
              fontSize: '14px',
              fontWeight: 500,
              color: 'white',
              cursor: 'pointer',
            }}
          >
            Ask AI Tutor
          </button>
        </div>
      </div>
    </div>
  )

  // ── Quiz screen ───────────────────────────────────
  if (quiz) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar
        showBack
        backPath={`/path/${pathId}`}
        title="Quiz"
        rightContent={
          <span style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>
            {Object.keys(answers).length}/{quiz.totalQuestions} answered
          </span>
        }
      />

      {/* Progress bar */}
      <div style={{ height: '2px', background: 'var(--bg-secondary)' }}>
        <div style={{
          height: '2px',
          background: 'var(--accent)',
          width: `${(Object.keys(answers).length / quiz.totalQuestions) * 100}%`,
          transition: 'width 0.3s',
        }} />
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {quiz.questions.map((q, index) => (
            <div key={q._id} style={{
              background: 'var(--bg-card)',
              border: '0.5px solid var(--border)',
              borderRadius: '16px',
              padding: '20px',
            }}>
              <p style={{
                fontSize: '14px',
                fontWeight: 500,
                color: 'var(--text-primary)',
                marginBottom: '14px',
                lineHeight: 1.5,
              }}>
                {index + 1}. {q.question}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {q.options.map(opt => {
                  const selected = answers[index] === opt.label
                  return (
                    <button
                      key={opt.label}
                      onClick={() => setAnswers(prev => ({ ...prev, [index]: opt.label }))}
                      style={{
                        width: '100%',
                        padding: '11px 14px',
                        borderRadius: '10px',
                        border: selected
                          ? '1px solid var(--accent)'
                          : '0.5px solid var(--border)',
                        background: selected ? 'var(--accent-light)' : 'var(--bg-page)',
                        fontSize: '13px',
                        color: selected ? 'var(--accent)' : 'var(--text-primary)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        textAlign: 'left',
                        fontFamily: 'inherit',
                        fontWeight: selected ? 500 : 400,
                      }}
                    >
                      <div style={{
                        width: '26px', height: '26px',
                        borderRadius: '7px',
                        background: selected ? 'var(--accent)' : 'var(--bg-secondary)',
                        border: `0.5px solid ${selected ? 'var(--accent)' : 'var(--border)'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '11px', fontWeight: 500,
                        color: selected ? 'white' : 'var(--text-secondary)',
                        flexShrink: 0,
                      }}>
                        {opt.label}
                      </div>
                      {opt.text}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Submit button */}
        <button
          onClick={handleSubmit}
          disabled={submitting || Object.keys(answers).length < quiz.totalQuestions}
          style={{
            width: '100%',
            marginTop: '20px',
            background: submitting || Object.keys(answers).length < quiz.totalQuestions
              ? 'var(--bg-secondary)'
              : 'var(--accent)',
            color: submitting || Object.keys(answers).length < quiz.totalQuestions
              ? 'var(--text-muted)'
              : 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '14px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: submitting || Object.keys(answers).length < quiz.totalQuestions
              ? 'not-allowed'
              : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {submitting
            ? 'Submitting...'
            : `Submit quiz (${Object.keys(answers).length}/${quiz.totalQuestions})`}
        </button>
      </div>
    </div>
  )

  // ── Start screen ──────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)' }}>
      <Navbar
        showBack
        backPath={`/path/${pathId}`}
        title="Quiz"
      />

      <div style={{ maxWidth: '400px', margin: '0 auto', padding: '80px 24px', textAlign: 'center' }}>
        <div style={{
          width: '52px', height: '52px',
          background: 'var(--accent-light)',
          borderRadius: '14px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '24px', margin: '0 auto 20px',
          color: 'var(--accent)',
        }}>
          ✦
        </div>
        <h2 style={{
          fontSize: '20px',
          fontWeight: 500,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: '8px',
        }}>
          Test your knowledge
        </h2>
        <p style={{
          fontSize: '14px',
          color: 'var(--text-secondary)',
          marginBottom: '32px',
          lineHeight: 1.6,
        }}>
          AI will generate 5 questions based on your learning path. Take your time.
        </p>
        <button
          onClick={handleGenerate}
          disabled={generating}
          style={{
            width: '100%',
            background: generating ? 'var(--bg-secondary)' : 'var(--accent)',
            color: generating ? 'var(--text-muted)' : 'white',
            border: 'none',
            borderRadius: '12px',
            padding: '13px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: generating ? 'not-allowed' : 'pointer',
            fontFamily: 'inherit',
          }}
        >
          {generating ? 'Generating questions...' : 'Start quiz'}
        </button>
      </div>
    </div>
  )
}

export default Quiz 