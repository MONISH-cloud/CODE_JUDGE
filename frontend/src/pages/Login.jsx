import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { authAPI } from '../api'

const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: '#181818', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, color: '#f0f0f0', fontSize: '0.9rem', fontFamily: 'DM Mono, monospace' }
const labelStyle = { fontSize: '0.75rem', fontWeight: 600, color: '#888', letterSpacing: '0.06em', textTransform: 'uppercase' }

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(''); setLoading(true)
    try {
      const res = await authAPI.post('/api/auth/login', form)
      login(res.data.token, res.data.user)
      navigate('/problems')
    } catch (err) { setError(err.response?.data?.message || 'Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <div style={{ width: '100%', maxWidth: 420, background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '2.5rem', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'fadeUp 0.5s ease forwards' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', marginBottom: '0.4rem' }}>Welcome back</h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#555', marginBottom: '2rem' }}>Sign in to continue coding</p>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {[['email','Email','you@example.com','email'],['password','Password','••••••••','password']].map(([key, label, ph, type]) => (
            <div key={key} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>{label}</label>
              <input style={inputStyle} type={type} placeholder={ph} value={form[key]} onChange={e => setForm({...form, [key]: e.target.value})} required />
            </div>
          ))}
          {error && <div style={{ padding: '0.75rem 1rem', background: 'rgba(224,92,92,0.12)', border: '1px solid rgba(224,92,92,0.2)', borderRadius: 10, fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#e05c5c' }}>{error}</div>}
          <button type="submit" disabled={loading} style={{ padding: '0.85rem', background: '#f0f0f0', color: '#0a0a0a', borderRadius: 10, fontSize: '0.95rem', fontWeight: 700, marginTop: '0.5rem', opacity: loading ? 0.5 : 1 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.85rem', color: '#555' }}>
          No account? <Link to="/register" style={{ color: '#c9a96e', fontWeight: 600 }}>Register</Link>
        </p>
      </div>
    </div>
  )
}
