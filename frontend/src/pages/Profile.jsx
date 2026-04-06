import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { submissionsAPI, authAPI } from '../api'
import { Link, useNavigate } from 'react-router-dom'

const VC = {
  'Accepted': { color: '#4caf7d', bg: 'rgba(76,175,125,0.12)' },
  'Wrong Answer': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' },
  'Compilation Error': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' },
  'Runtime Error': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' },
  'Time Limit Exceeded': { color: '#c9a96e', bg: 'rgba(201,169,110,0.15)' },
}

export default function Profile() {
  const { user, login, token } = useAuth()
  const navigate = useNavigate()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [newName, setNewName] = useState('')
  const [saving, setSaving] = useState(false)
  const [nameError, setNameError] = useState('')

  useEffect(() => {
    if (!user) return navigate('/login')
    setNewName(user.name)
    submissionsAPI.get(`/api/submissions/user/${user.id}`)
      .then(res => setSubmissions(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  const handleSaveName = async () => {
    if (!newName.trim()) return setNameError('Name cannot be empty')
    if (newName.trim() === user.name) return setEditing(false)
    setSaving(true)
    setNameError('')
    try {
      const res = await authAPI.put('/api/auth/update', { user_id: user.id, name: newName.trim() })
      login(token, { ...user, name: res.data.name })
      setEditing(false)
    } catch (err) {
      setNameError(err.response?.data?.message || 'Failed to update')
    } finally {
      setSaving(false)
    }
  }

  const total = submissions.length
  const accepted = submissions.filter(s => s.verdict === 'Accepted').length
  const acceptanceRate = total > 0 ? Math.round((accepted / total) * 100) : 0
  const solvedCount = new Set(submissions.filter(s => s.verdict === 'Accepted').map(s => s.problem_id)).size
  const recent = submissions.slice(0, 8)

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '5rem 2rem 4rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem', marginBottom: '2.5rem', animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#181818', border: '2px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.75rem', fontWeight: 800, color: '#c9a96e', flexShrink: 0 }}>
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div style={{ flex: 1 }}>
          {editing ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <input
                value={newName}
                onChange={e => setNewName(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleSaveName(); if (e.key === 'Escape') setEditing(false) }}
                autoFocus
                style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.03em', background: '#181818', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '0.3rem 0.75rem', color: '#f0f0f0', fontFamily: 'Syne, sans-serif', width: 220 }}
              />
              <button onClick={handleSaveName} disabled={saving} style={{ padding: '0.4rem 0.85rem', background: '#f0f0f0', color: '#0a0a0a', borderRadius: 6, fontWeight: 700, fontSize: '0.8rem', opacity: saving ? 0.5 : 1 }}>
                {saving ? '...' : 'Save'}
              </button>
              <button onClick={() => { setEditing(false); setNameError('') }} style={{ padding: '0.4rem 0.85rem', background: 'transparent', color: '#555', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, fontSize: '0.8rem' }}>
                Cancel
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>{user?.name}</h1>
              <button onClick={() => setEditing(true)} style={{ padding: '0.25rem 0.65rem', background: 'transparent', color: '#555', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, fontSize: '0.72rem', fontWeight: 600 }}>
                Edit
              </button>
            </div>
          )}
          {nameError && <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#e05c5c', marginBottom: 6 }}>{nameError}</div>}
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#555' }}>{user?.email}</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#888', padding: '0.1rem 0.5rem', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4 }}>{user?.role}</span>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem', animation: 'fadeUp 0.5s 0.1s ease both' }}>
        {[
          { label: 'Total Submissions', value: total, color: '#f0f0f0' },
          { label: 'Accepted', value: accepted, color: '#4caf7d' },
          { label: 'Acceptance Rate', value: `${acceptanceRate}%`, color: '#c9a96e' },
          { label: 'Problems Solved', value: solvedCount, color: '#5c9ee0' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.25rem 1.5rem' }}>
            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.75rem', fontWeight: 500, color, marginBottom: 6 }}>{value}</div>
            <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555' }}>{label}</div>
          </div>
        ))}
      </div>

      {/* Verdict breakdown */}
      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.5rem', marginBottom: '2rem', animation: 'fadeUp 0.5s 0.15s ease both' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: '1rem' }}>Submission Breakdown</div>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
          {Object.entries(
            submissions.reduce((acc, s) => { acc[s.verdict] = (acc[s.verdict] || 0) + 1; return acc }, {})
          ).map(([verdict, count]) => {
            const vs = VC[verdict] || { color: '#888', bg: '#222' }
            return (
              <div key={verdict} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', fontWeight: 600, color: vs.color }}>{count}</span>
                <span style={{ padding: '0.15rem 0.55rem', borderRadius: 4, fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: vs.color, background: vs.bg }}>{verdict}</span>
              </div>
            )
          })}
          {submissions.length === 0 && <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#555' }}>No submissions yet</span>}
        </div>
        {total > 0 && (
          <div style={{ marginTop: '1rem', height: 6, background: '#1a1a1a', borderRadius: 3, overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${acceptanceRate}%`, background: '#4caf7d', borderRadius: 3 }} />
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      <div style={{ animation: 'fadeUp 0.5s 0.2s ease both' }}>
        <div style={{ fontSize: '0.72rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: '1rem' }}>Recent Submissions</div>
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '2rem', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>
            <div style={{ width: 20, height: 20, border: '2px solid #222', borderTopColor: '#888', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
            Loading...
          </div>
        ) : recent.length === 0 ? (
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '3rem', textAlign: 'center' }}>
            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', color: '#555', marginBottom: 12 }}>No submissions yet</p>
            <Link to="/problems" style={{ color: '#c9a96e', fontSize: '0.85rem' }}>Start solving →</Link>
          </div>
        ) : (
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 180px 80px 150px', padding: '0.75rem 1.5rem', background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555' }}>
              <span>Problem</span><span>Lang</span><span>Verdict</span><span>Time</span><span>Date</span>
            </div>
            {recent.map(sub => {
              const vs = VC[sub.verdict] || { color: '#888', bg: '#222' }
              return (
                <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 180px 80px 150px', padding: '0.9rem 1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#181818'}
                  onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                  <Link to={`/problems/${sub.problem_id}`} style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f0f0' }}>{sub.problem_title}</Link>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555' }}>{sub.language?.toUpperCase()}</span>
                  <span style={{ display: 'inline-flex', padding: '0.2rem 0.65rem', borderRadius: 4, fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', fontWeight: 500, width: 'fit-content', color: vs.color, background: vs.bg }}>{sub.verdict}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555' }}>{sub.execution_time ? `${Number(sub.execution_time).toFixed(3)}s` : '—'}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#555' }}>{new Date(sub.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
