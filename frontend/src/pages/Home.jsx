import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Home() {
  const { user } = useAuth()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '6rem 2rem 4rem', gap: '3rem', position: 'relative' }}>
      <div style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 400, background: 'radial-gradient(ellipse, rgba(201,169,110,0.06) 0%, transparent 70%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
      
      <div style={{ textAlign: 'center', maxWidth: 700, animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '2rem', padding: '0.35rem 0.85rem', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 100, background: '#111' }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#c9a96e', display: 'inline-block' }} />
          Competitive Programming Judge
        </div>
        <h1 style={{ fontSize: 'clamp(3rem, 7vw, 5.5rem)', fontWeight: 800, lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
          Write code.<br /><span style={{ color: '#333' }}>Get judged.</span>
        </h1>
        <p style={{ fontSize: '1.05rem', color: '#888', lineHeight: 1.7, marginBottom: '2.5rem' }}>
          Submit your C solutions, run against hidden test cases,<br />and see your verdict in real time.
        </p>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem' }}>
          {user ? (
            <Link to="/problems" style={{ padding: '0.75rem 1.75rem', background: '#f0f0f0', color: '#0a0a0a', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem' }}>Browse Problems →</Link>
          ) : (
            <>
              <Link to="/register" style={{ padding: '0.75rem 1.75rem', background: '#f0f0f0', color: '#0a0a0a', borderRadius: 8, fontWeight: 700, fontSize: '0.95rem' }}>Get Started →</Link>
              <Link to="/login" style={{ padding: '0.75rem 1.75rem', background: 'transparent', color: '#888', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, fontWeight: 600, fontSize: '0.95rem' }}>Sign In</Link>
            </>
          )}
        </div>
      </div>

      <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', width: '100%', maxWidth: 540, boxShadow: '0 8px 32px rgba(0,0,0,0.4)', animation: 'fadeUp 0.5s 0.2s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.75rem 1rem', background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['#e05c5c','#c9a96e','#4caf7d'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555', marginLeft: 8 }}>solution.c</span>
        </div>
        <pre style={{ padding: '1.5rem', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', lineHeight: 1.7, color: '#888' }}>{`#include <stdio.h>

int main() {
    int n;
    scanf("%d", &n);
    long long sum = (long long)n * (n + 1) / 2;
    printf("%lld\\n", sum);
    return 0;
}`}</pre>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.07)', background: '#181818' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#4caf7d', background: 'rgba(76,175,125,0.12)', padding: '0.25rem 0.75rem', borderRadius: 4 }}>✓ Accepted</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555' }}>0.012s</span>
        </div>
      </div>
    </div>
  )
}
