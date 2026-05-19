const Logo = ({ size = 28 }) => (
  <svg width={size * 2.8} height={size} viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Book icon */}
    <rect x="2" y="4" width="16" height="20" rx="2" fill="#F4F3F0" stroke="#D97757" strokeWidth="1"/>
    <rect x="18" y="4" width="2" height="20" rx="1" fill="#D97757"/>
    <rect x="20" y="4" width="16" height="20" rx="2" fill="#F4F3F0" stroke="#C0B9A8" strokeWidth="0.8"/>
    {/* Spark */}
    <circle cx="36" cy="7" r="5" fill="#D97757"/>
    <text x="36" y="10" textAnchor="middle" fontSize="6" fill="white" fontFamily="sans-serif">✦</text>
    {/* Wordmark */}
    <text x="44" y="22" fontSize="16" fontWeight="500" fontFamily="-apple-system,sans-serif" letterSpacing="-0.3">
      <tspan fill="#1a1a1a">Study</tspan>
      <tspan fill="#D97757">Buddy</tspan>
    </text>
  </svg>
)

export default Logo