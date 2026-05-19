import { useTheme } from '../context/ThemeContext'

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      style={{
        width: '34px',
        height: '34px',
        borderRadius: '8px',
        border: '0.5px solid var(--border)',
        background: 'var(--bg-secondary)',
        color: 'var(--text-secondary)',
        fontSize: '16px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
      }}
    >
      {isDark ? '☀️' : '🌙'}
    </button>
  )
}

export default ThemeToggle