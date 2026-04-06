import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { problemsAPI } from '../api'

const DIFF = { easy: { color: '#4caf7d', bg: 'rgba(76,175,125,0.12)' }, medium: { color: '#c9a96e', bg: 'rgba(201,169,110,0.15)' }, hard: { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' } }

export default function Problems() {
  const [problems, setProblems] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    problemsAPI.get('/api/problems').then(res => setProblems(res.data)).catch(console.error).finally(() => setLoading(false))
  }, [])

  const filtered = filter === 'all' ? problems : problems.filter(p => p.difficulty === filter)

  return (
    <div style={{ maxWidth: 1000, margin: '0 auto', padding: '5rem 2rem 4rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem', animation: 'fadeUp 0.5s ease forwards' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Problems</h1>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#555', marginTop: 4 }}>{problems.length} problems available</p>
        </div>
        <div style={{ display: 'flex', gap: 4, background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: 4 }}>
          {['all','easy','medium','hard'].map(f => (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.85rem', borderRadius: 6, fontSize: '0.8rem', fontWeight: 600, color: filter === f ? '#f0f0f0' : '#555', background: filter === f ? '#222' : 'transparent', letterSpacing: '0.03em' }}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '6rem', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>
          <div style={{ width: 28, height: 28, border: '2px solid #222', borderTopColor: '#888', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Loading problems...
        </div>
      ) : (
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', animation: 'fadeUp 0.5s 0.1s ease both' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '48px 1fr 140px 100px 90px', padding: '0.75rem 1.5rem', background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555' }}>
            <span>#</span><span>Title</span><span>Topic</span><span>Difficulty</span><span>Time</span>
          </div>
          {filtered.map((p, i) => (
            <Link key={p.id} to={`/problems/${p.id}`} style={{ display: 'grid', gridTemplateColumns: '48px 1fr 140px 100px 90px', padding: '1rem 1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.07)', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#181818'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555' }}>{String(i+1).padStart(2,'0')}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{p.title}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555' }}>{p.topic || '—'}</span>
              <span style={{ display: 'inline-flex', padding: '0.2rem 0.6rem', borderRadius: 4, fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', fontWeight: 500, width: 'fit-content', color: DIFF[p.difficulty]?.color, background: DIFF[p.difficulty]?.bg }}>{p.difficulty}</span>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555' }}>{p.time_limit}s</span>
            </Link>
          ))}
          {filtered.length === 0 && <div style={{ padding: '4rem', textAlign: 'center', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>No problems found</div>}
        </div>
      )}
    </div>
  )
}
