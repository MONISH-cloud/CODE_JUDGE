import { useState, useEffect } from 'react'
import { authAPI } from '../api'
import { useAuth } from '../context/AuthContext'

export default function Leaderboard() {
  const { user } = useAuth()
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authAPI.get('/api/auth/leaderboard')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '5rem 2rem 4rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem', animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1rem', padding: '0.35rem 0.85rem', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, background: '#111' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a96e', display: 'inline-block' }} />
          Top 10 This Week
        </div>
        <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Leaderboard</h1>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#555' }}>Ranked by unique problems solved</p>
      </div>

      {loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, padding: '6rem', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>
          <div style={{ width: 28, height: 28, border: '2px solid #222', borderTopColor: '#888', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
          Loading...
        </div>
      ) : data.length === 0 ? (
        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '4rem', textAlign: 'center' }}>
          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', color: '#555' }}>No students yet — be the first!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', animation: 'fadeUp 0.5s 0.1s ease both' }}>
          {data.map((entry, i) => {
            const isMe = user?.id === entry.id
            const acceptanceRate = entry.total_submissions > 0
              ? Math.round((entry.total_accepted / entry.total_submissions) * 100)
              : 0

            return (
              <div key={entry.id} style={{
                display: 'grid',
                gridTemplateColumns: '48px 1fr 120px 120px 100px',
                alignItems: 'center',
                padding: '1.1rem 1.5rem',
                background: isMe ? 'rgba(201,169,110,0.06)' : '#111',
                border: `1px solid ${isMe ? 'rgba(201,169,110,0.2)' : 'rgba(255,255,255,0.07)'}`,
                borderRadius: 12,
                transition: 'transform 0.15s',
                animation: `fadeUp 0.5s ${0.05 * i}s ease both`
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateX(4px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateX(0)'}
              >
                {/* Rank */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {i < 3 ? (
                    <span style={{ fontSize: '1.25rem' }}>{medals[i]}</span>
                  ) : (
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.9rem', fontWeight: 600, color: '#555' }}>#{i + 1}</span>
                  )}
                </div>

                {/* Name */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: '#181818', border: `1px solid ${isMe ? 'rgba(201,169,110,0.3)' : 'rgba(255,255,255,0.07)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem', color: isMe ? '#c9a96e' : '#888', flexShrink: 0 }}>
                    {entry.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 600, color: isMe ? '#c9a96e' : '#f0f0f0' }}>
                      {entry.name}
                      {isMe && <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.65rem', color: '#c9a96e', marginLeft: 6 }}>you</span>}
                    </span>
                  </div>
                </div>

                {/* Problems solved */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: '#4caf7d' }}>{entry.problems_solved}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginTop: 2 }}>Solved</div>
                </div>

                {/* Total submissions */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: '#888' }}>{entry.total_submissions}</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginTop: 2 }}>Submissions</div>
                </div>

                {/* Acceptance rate */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '1.1rem', fontWeight: 600, color: '#c9a96e' }}>{acceptanceRate}%</div>
                  <div style={{ fontSize: '0.65rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginTop: 2 }}>Rate</div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
