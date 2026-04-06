import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { problemsAPI, submissionsAPI } from '../api'
import { useAuth } from '../context/AuthContext'

const VERDICT = {
  'Accepted': { color: '#4caf7d', bg: 'rgba(76,175,125,0.12)', icon: '✓' },
  'Wrong Answer': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)', icon: '✗' },
  'Compilation Error': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)', icon: '⚠' },
  'Runtime Error': { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)', icon: '⚠' },
  'Time Limit Exceeded': { color: '#c9a96e', bg: 'rgba(201,169,110,0.15)', icon: '⏱' },
}
const DIFF = { easy: { color: '#4caf7d', bg: 'rgba(76,175,125,0.12)' }, medium: { color: '#c9a96e', bg: 'rgba(201,169,110,0.15)' }, hard: { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' } }
const DEFAULT_CODE = `#include <stdio.h>\n\nint main() {\n    // Your solution here\n    \n    return 0;\n}`

export default function ProblemDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [problem, setProblem] = useState(null)
  const [sample, setSample] = useState({ input: '', output: '' })
  const [code, setCode] = useState(DEFAULT_CODE)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [running, setRunning] = useState(false)
  const [result, setResult] = useState(null)
  const [runResult, setRunResult] = useState(null)
  const [customInput, setCustomInput] = useState('')
  const [useCustom, setUseCustom] = useState(false)

  useEffect(() => {
    Promise.all([
      problemsAPI.get(`/api/problems/${id}`),
      problemsAPI.get(`/api/problems/${id}/sample`)
    ]).then(([pRes, sRes]) => {
      setProblem(pRes.data)
      setSample(sRes.data)
      setCustomInput(sRes.data.input || '')
    }).catch(() => navigate('/problems'))
    .finally(() => setLoading(false))
  }, [id])

  const handleRun = async () => {
    if (!user) return navigate('/login')
    setRunning(true)
    setRunResult(null)
    try {
      const input = useCustom ? customInput : sample.input
      const res = await submissionsAPI.post('/api/submissions/run', {
        source_code: code,
        input
      })
      setRunResult({ ...res.data, expectedOutput: sample.output, input })
    } catch (err) {
      setRunResult({ success: false, error: 'Run failed', output: null })
    } finally {
      setRunning(false)
    }
  }

  const handleSubmit = async () => {
    if (!user) return navigate('/login')
    setSubmitting(true)
    setResult(null)
    try {
      const res = await submissionsAPI.post('/api/submissions', {
        user_id: user.id,
        problem_id: parseInt(id),
        source_code: code,
        language: 'c'
      })
      setResult(res.data)
    } catch (err) {
      setResult({ verdict: 'Error', error_log: err.response?.data?.message || 'Submission failed' })
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <div style={{ width: 28, height: 28, border: '2px solid #222', borderTopColor: '#888', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
    </div>
  )

  const vs = VERDICT[result?.verdict] || { color: '#888', bg: '#181818', icon: '?' }
  const ds = DIFF[problem?.difficulty] || { color: '#888', bg: '#222' }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: 1300, margin: '0 auto', padding: '5rem 2rem 4rem', minHeight: '100vh' }}>

      {/* LEFT - Problem info */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', animation: 'fadeUp 0.5s ease forwards', overflowY: 'auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ padding: '0.2rem 0.6rem', borderRadius: 4, fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', fontWeight: 500, color: ds.color, background: ds.bg }}>{problem?.difficulty}</span>
          {problem?.topic && <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555', padding: '0.2rem 0.6rem', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4 }}>{problem.topic}</span>}
          <span style={{ marginLeft: 'auto', fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555', display: 'flex', gap: 12 }}>
            <span>⏱ {problem?.time_limit}s</span><span>💾 {problem?.memory_limit}MB</span>
          </span>
        </div>

        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1.2 }}>{problem?.title}</h1>

        <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '1.5rem', color: '#888', fontSize: '0.9rem', lineHeight: 1.8 }}>
          {problem?.description}
        </div>

        {/* Sample Test Case */}
        {sample.input && (
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1.25rem', background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555' }}>
              Sample Test Case
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
              <div style={{ padding: '1rem 1.25rem', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: 8 }}>Input</div>
                <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: '#aaa', whiteSpace: 'pre-wrap', margin: 0 }}>{sample.input}</pre>
              </div>
              <div style={{ padding: '1rem 1.25rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: 8 }}>Expected Output</div>
                <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: '#aaa', whiteSpace: 'pre-wrap', margin: 0 }}>{sample.output}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Run Result */}
        {runResult && (
          <div style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1.25rem', background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#555', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span>Run Output</span>
              {runResult.success && (
                <span style={{ color: runResult.output?.trim() === runResult.expectedOutput?.trim() ? '#4caf7d' : '#e05c5c', fontFamily: 'DM Mono, monospace' }}>
                  {runResult.output?.trim() === runResult.expectedOutput?.trim() ? '✓ Matches expected' : '✗ Differs from expected'}
                </span>
              )}
            </div>
            {runResult.success ? (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
                <div style={{ padding: '1rem 1.25rem', borderRight: '1px solid rgba(255,255,255,0.07)' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: 8 }}>Your Output</div>
                  <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: '#4caf7d', whiteSpace: 'pre-wrap', margin: 0 }}>{runResult.output || '(empty)'}</pre>
                </div>
                <div style={{ padding: '1rem 1.25rem' }}>
                  <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: 8 }}>Expected Output</div>
                  <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: '#aaa', whiteSpace: 'pre-wrap', margin: 0 }}>{runResult.expectedOutput || '(empty)'}</pre>
                </div>
              </div>
            ) : (
              <div style={{ padding: '1rem 1.25rem' }}>
                <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#e05c5c', whiteSpace: 'pre-wrap', margin: 0 }}>{runResult.error}</pre>
              </div>
            )}
          </div>
        )}

        {/* Info cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {[['Language','C (gcc)'],['Time Limit',`${problem?.time_limit}s`],['Memory',`${problem?.memory_limit}MB`]].map(([label, value]) => (
            <div key={label} style={{ background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '0.85rem 1rem' }}>
              <div style={{ fontSize: '0.68rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: 4 }}>{label}</div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: '#888' }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT - Editor */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden', position: 'sticky', top: '5rem', height: 'calc(100vh - 7rem)', animation: 'fadeUp 0.5s 0.15s ease both' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '0.75rem 1rem', background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          {['#e05c5c','#c9a96e','#4caf7d'].map(c => <span key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555', marginLeft: 8 }}>solution.c</span>
        </div>

        <textarea value={code} onChange={e => setCode(e.target.value)} spellCheck={false}
          style={{ flex: 1, width: '100%', background: '#111', color: '#f0f0f0', border: 'none', padding: '1.25rem', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', lineHeight: 1.7, resize: 'none', tabSize: 4 }} />

        {/* Custom input toggle */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', padding: '0.75rem 1rem', background: '#0e0e0e' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: useCustom ? 8 : 0 }}>
            <button onClick={() => setUseCustom(!useCustom)} style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: useCustom ? '#c9a96e' : '#555', background: 'transparent', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 4, padding: '0.25rem 0.6rem', cursor: 'pointer' }}>
              {useCustom ? '✓ Custom Input' : 'Custom Input'}
            </button>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#444' }}>
              {useCustom ? 'using custom' : 'using sample tc1'}
            </span>
          </div>
          {useCustom && (
            <textarea value={customInput} onChange={e => setCustomInput(e.target.value)}
              placeholder="Enter custom input..."
              style={{ width: '100%', height: 60, background: '#181818', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, padding: '0.5rem 0.75rem', fontFamily: 'DM Mono, monospace', fontSize: '0.78rem', color: '#aaa', resize: 'none' }} />
          )}
        </div>

        {/* Verdict */}
        {result && (
          <div style={{ padding: '0.85rem 1.25rem', display: 'flex', alignItems: 'center', gap: 10, background: vs.bg, borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            <span style={{ color: vs.color, fontSize: '1rem' }}>{vs.icon}</span>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.85rem', fontWeight: 500, color: vs.color }}>{result.verdict}</span>
            {result.execution_time > 0 && <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555', marginLeft: 4 }}>{Number(result.execution_time).toFixed(3)}s</span>}
            {result.error_log && <pre style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#e05c5c', marginLeft: 8, whiteSpace: 'pre-wrap' }}>{result.error_log}</pre>}
          </div>
        )}

        {/* Buttons */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <button onClick={handleRun} disabled={running}
            style={{ padding: '1rem', background: '#181818', color: '#888', fontSize: '0.875rem', fontWeight: 600, borderRight: '1px solid rgba(255,255,255,0.07)', opacity: running ? 0.5 : 1, cursor: running ? 'not-allowed' : 'pointer' }}>
            {running ? 'Running...' : '▶ Run'}
          </button>
          <button onClick={handleSubmit} disabled={submitting}
            style={{ padding: '1rem', background: '#f0f0f0', color: '#0a0a0a', fontSize: '0.875rem', fontWeight: 700, opacity: submitting ? 0.5 : 1, cursor: submitting ? 'not-allowed' : 'pointer' }}>
            {submitting ? 'Judging...' : 'Submit →'}
          </button>
        </div>
      </div>
    </div>
  )
}
