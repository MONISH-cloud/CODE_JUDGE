import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { submissionsAPI } from '../api'
import { Link } from 'react-router-dom'

const VC = { 'Accepted': { color: '#4caf7d', bg: 'rgba(76,175,125,0.12)' }, 'Wrong Answer': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' }, 'Compilation Error': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' }, 'Runtime Error': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' }, 'Time Limit Exceeded': { color: '#c9a96e', bg: 'rgba(201,169,110,0.15)' } }

export default function Submissions() {
  const { user } = useAuth()
  const [submissions, setSubmissions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    submissionsAPI.get(`/api/submissions/user/${user.id}`).then(res => setSubmissions(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [user])

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '5rem 2rem 4rem' }}>
      <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease forwards' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>My Submissions</h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#555', marginTop: 4 }}>{submissions.length} total submissions</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '6rem', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>
          <div style={{ width: 28, height: 28, border: '2px solid #222', borderTopColor: '#888', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Loading...
        </div>
      ) : submissions.length === 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12, padding: '6rem', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>
          <span style={{ fontSize: '2rem', opacity: 0.3 }}>∅</span>
          <p>No submissions yet</p>
          <Link to="/problems" style={{ color: '#c9a96e', fontSize: '0.85rem', marginTop: 8 }}>Browse Problems →</Link>
        </div>
      ) : (
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', animation: 'fadeUp 0.5s 0.1s ease both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 80px 180px 80px 150px', padding: '0.75rem 1.5rem', background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555' }}>
            <span>Problem</span><span>Lang</span><span>Verdict</span><span>Time</span><span>Submitted</span>
          </div>
          {submissions.map(sub => {
            const vs = VC[sub.verdict] || { color: '#888', bg: '#222' }
            return (
              <div key={sub.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px 180px 80px 150px', padding: '1rem 1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
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
  )
}
