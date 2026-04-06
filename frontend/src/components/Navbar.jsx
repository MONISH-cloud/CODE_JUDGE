import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  const nav = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    padding: '0 2rem', background: 'rgba(10,10,10,0.85)',
    backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)'
  }
  const inner = {
    maxWidth: 1200, margin: '0 auto', height: 60,
    display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem'
  }

  return (
    <nav style={nav}>
      <div style={inner}>
        <Link to="/" style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', display: 'flex', gap: 2 }}>
          <span style={{ color: '#c9a96e', fontWeight: 400 }}>{`{`}</span>
          <span>CJ</span>
          <span style={{ color: '#c9a96e', fontWeight: 400 }}>{`}`}</span>
        </Link>

        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {[
            { path: '/problems', label: 'Problems' },
            { path: '/leaderboard', label: 'Leaderboard' },
            ...(user ? [{ path: '/submissions', label: 'Submissions' }] : []),
            ...(user?.role === 'admin' ? [{ path: '/admin', label: 'Admin' }] : []),
          ].map(({ path, label }) => (
            <Link key={path} to={path} style={{
              padding: '0.4rem 0.9rem', borderRadius: 6, fontSize: '0.875rem', fontWeight: 600,
              color: isActive(path) ? '#f0f0f0' : label === 'Admin' ? '#c9a96e88' : '#888',
              background: isActive(path) ? '#181818' : 'transparent',
            }}>{label}</Link>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {user ? (
            <>
              <Link to="/profile" style={{
                display: 'flex', alignItems: 'center', gap: 6,
                fontFamily: 'DM Mono, monospace', fontSize: '0.8rem',
                color: isActive('/profile') ? '#f0f0f0' : '#888',
                padding: '0.4rem 0.75rem', borderRadius: 6,
                background: isActive('/profile') ? '#181818' : 'transparent'
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#4caf7d', display: 'inline-block', animation: 'pulse 2s infinite' }} />
                {user.name}
              </Link>
              <button onClick={() => { logout(); navigate('/') }} style={{
                padding: '0.4rem 1rem', borderRadius: 6, fontSize: '0.875rem', fontWeight: 600,
                color: '#888', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)'
              }}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" style={{ padding: '0.4rem 1rem', borderRadius: 6, fontSize: '0.875rem', fontWeight: 600, color: '#888', border: '1px solid rgba(255,255,255,0.07)' }}>Login</Link>
              <Link to="/register" style={{ padding: '0.4rem 1rem', borderRadius: 6, fontSize: '0.875rem', fontWeight: 700, color: '#0a0a0a', background: '#f0f0f0' }}>Register</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
