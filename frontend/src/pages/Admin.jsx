import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const adminAPI = axios.create({ baseURL: 'http://localhost:3002' })

const S = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '5rem 2rem 4rem' },
  card: { background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, overflow: 'hidden', marginBottom: '2rem' },
  cardHeader: { padding: '1rem 1.5rem', background: '#181818', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' },
  cardTitle: { fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#888' },
  input: { width: '100%', padding: '0.7rem 1rem', background: '#181818', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, color: '#f0f0f0', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' },
  label: { fontSize: '0.7rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: 6, display: 'block' },
  btn: { padding: '0.6rem 1.25rem', background: '#f0f0f0', color: '#0a0a0a', borderRadius: 8, fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' },
  btnDanger: { padding: '0.4rem 0.75rem', background: 'rgba(224,92,92,0.12)', color: '#e05c5c', border: '1px solid rgba(224,92,92,0.2)', borderRadius: 6, fontWeight: 600, fontSize: '0.75rem', cursor: 'pointer' },
  btnGhost: { padding: '0.4rem 0.75rem', background: 'transparent', color: '#555', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 6, fontSize: '0.75rem', cursor: 'pointer' },
}

const DIFF = { easy: { color: '#4caf7d', bg: 'rgba(76,175,125,0.12)' }, medium: { color: '#c9a96e', bg: 'rgba(201,169,110,0.15)' }, hard: { color: '#e05c5c', bg: 'rgba(224,92,92,0.12)' } }

export default function Admin() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [tab, setTab] = useState('problems')
  const [problems, setProblems] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedProblem, setSelectedProblem] = useState(null)
  const [testcases, setTestcases] = useState([])
  const [msg, setMsg] = useState('')

  // Add problem form
  const [form, setForm] = useState({ title: '', description: '', difficulty: 'easy', topic: '', time_limit: 2, memory_limit: 256 })
  const [submitting, setSubmitting] = useState(false)

  // Test case upload
  const [tcInput, setTcInput] = useState(null)
  const [tcOutput, setTcOutput] = useState(null)
  const [tcHidden, setTcHidden] = useState(true)
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user) return navigate('/login')
    if (user.role !== 'admin') return navigate('/')
    fetchProblems()
  }, [user])

  const fetchProblems = async () => {
    setLoading(true)
    try {
      const res = await adminAPI.get('/api/admin/problems')
      setProblems(res.data)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const fetchUsers = async () => {
    try {
      const res = await adminAPI.get('/api/admin/users')
      setUsers(res.data)
    } catch (err) { console.error(err) }
  }

  const fetchTestcases = async (problemId) => {
    try {
      const res = await adminAPI.get(`/api/admin/problems/${problemId}/testcases`)
      setTestcases(res.data)
    } catch (err) { console.error(err) }
  }

  const handleTabChange = (t) => {
    setTab(t)
    setMsg('')
    if (t === 'users') fetchUsers()
    if (t === 'problems') fetchProblems()
  }

  const handleAddProblem = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setMsg('')
    try {
      await adminAPI.post('/api/admin/problems', form)
      setMsg('✓ Problem added successfully!')
      setForm({ title: '', description: '', difficulty: 'easy', topic: '', time_limit: 2, memory_limit: 256 })
      fetchProblems()
      setTab('problems')
    } catch (err) {
      setMsg('✗ ' + (err.response?.data?.message || 'Failed'))
    } finally { setSubmitting(false) }
  }

  const handleDeleteProblem = async (id) => {
    if (!confirm('Delete this problem and all its test cases?')) return
    try {
      await adminAPI.delete(`/api/admin/problems/${id}`)
      if (selectedProblem?.id === id) setSelectedProblem(null)
      fetchProblems()
    } catch (err) { alert('Failed to delete') }
  }

  const handleSelectProblem = (p) => {
    setSelectedProblem(p)
    setTab('testcases')
    fetchTestcases(p.id)
    setMsg('')
  }

  const handleUploadTestcase = async (e) => {
    e.preventDefault()
    if (!tcInput || !tcOutput) return setMsg('✗ Both input and output files required')
    setUploading(true)
    setMsg('')
    try {
      const fd = new FormData()
      fd.append('input', tcInput)
      fd.append('output', tcOutput)
      fd.append('is_hidden', tcHidden)
      await adminAPI.post(`/api/admin/problems/${selectedProblem.id}/testcases`, fd)
      setMsg('✓ Test case uploaded!')
      setTcInput(null)
      setTcOutput(null)
      fetchTestcases(selectedProblem.id)
      fetchProblems()
      document.getElementById('tc-form').reset()
    } catch (err) {
      setMsg('✗ ' + (err.response?.data?.message || 'Upload failed'))
    } finally { setUploading(false) }
  }

  const handleDeleteTestcase = async (id) => {
    if (!confirm('Delete this test case?')) return
    try {
      await adminAPI.delete(`/api/admin/testcases/${id}`)
      fetchTestcases(selectedProblem.id)
      fetchProblems()
    } catch (err) { alert('Failed to delete') }
  }

  const tabs = ['problems', 'add', 'testcases', 'users']

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={{ marginBottom: '2rem', animation: 'fadeUp 0.5s ease forwards' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Admin Panel</h1>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#c9a96e', background: 'rgba(201,169,110,0.15)', padding: '0.2rem 0.6rem', borderRadius: 4 }}>admin</span>
        </div>
        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#555' }}>{problems.length} problems · {users.length || '?'} users</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: 4, background: '#111', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: 4, marginBottom: '2rem', width: 'fit-content' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => handleTabChange(t)} style={{ padding: '0.4rem 1rem', borderRadius: 7, fontSize: '0.82rem', fontWeight: 600, color: tab === t ? '#f0f0f0' : '#555', background: tab === t ? '#222' : 'transparent', letterSpacing: '0.02em' }}>
            {t === 'testcases' ? `Test Cases${selectedProblem ? ` (${selectedProblem.title.slice(0,15)}...)` : ''}` : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {msg && (
        <div style={{ marginBottom: '1.5rem', padding: '0.75rem 1rem', background: msg.startsWith('✓') ? 'rgba(76,175,125,0.12)' : 'rgba(224,92,92,0.12)', border: `1px solid ${msg.startsWith('✓') ? 'rgba(76,175,125,0.2)' : 'rgba(224,92,92,0.2)'}`, borderRadius: 8, fontFamily: 'DM Mono, monospace', fontSize: '0.82rem', color: msg.startsWith('✓') ? '#4caf7d' : '#e05c5c' }}>
          {msg}
        </div>
      )}

      {/* Problems Tab */}
      {tab === 'problems' && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>All Problems ({problems.length})</span>
            <button onClick={() => setTab('add')} style={S.btn}>+ Add Problem</button>
          </div>
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>Loading...</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 100px 80px 120px', padding: '0.65rem 1.5rem', background: '#161616', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444' }}>
                <span>#</span><span>Title</span><span>Difficulty</span><span>Topic</span><span>TCs</span><span>Actions</span>
              </div>
              {problems.map((p, i) => {
                const ds = DIFF[p.difficulty] || { color: '#888', bg: '#222' }
                return (
                  <div key={p.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 100px 80px 120px', padding: '0.85rem 1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = '#161616'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#444' }}>{i + 1}</span>
                    <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f0f0f0' }}>{p.title}</span>
                    <span style={{ display: 'inline-flex', padding: '0.15rem 0.5rem', borderRadius: 4, fontFamily: 'DM Mono, monospace', fontSize: '0.68rem', width: 'fit-content', color: ds.color, background: ds.bg }}>{p.difficulty}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#555' }}>{p.topic || '—'}</span>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: parseInt(p.testcase_count) > 0 ? '#4caf7d' : '#e05c5c' }}>{p.testcase_count} TCs</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button onClick={() => handleSelectProblem(p)} style={S.btnGhost}>Test Cases</button>
                      <button onClick={() => handleDeleteProblem(p.id)} style={S.btnDanger}>Delete</button>
                    </div>
                  </div>
                )
              })}
            </>
          )}
        </div>
      )}

      {/* Add Problem Tab */}
      {tab === 'add' && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>Add New Problem</span>
          </div>
          <form onSubmit={handleAddProblem} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div>
                <label style={S.label}>Title *</label>
                <input style={S.input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Sum of Two Numbers" required />
              </div>
              <div>
                <label style={S.label}>Topic</label>
                <input style={S.input} value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} placeholder="e.g. Math, Arrays, Strings" />
              </div>
            </div>

            <div>
              <label style={S.label}>Description *</label>
              <textarea style={{ ...S.input, height: 120, resize: 'vertical' }} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Problem statement including input/output format..." required />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
              <div>
                <label style={S.label}>Difficulty *</label>
                <select style={S.input} value={form.difficulty} onChange={e => setForm({ ...form, difficulty: e.target.value })}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div>
                <label style={S.label}>Time Limit (seconds)</label>
                <input style={S.input} type="number" value={form.time_limit} onChange={e => setForm({ ...form, time_limit: parseInt(e.target.value) })} min={1} max={10} />
              </div>
              <div>
                <label style={S.label}>Memory Limit (MB)</label>
                <input style={S.input} type="number" value={form.memory_limit} onChange={e => setForm({ ...form, memory_limit: parseInt(e.target.value) })} min={64} max={512} />
              </div>
            </div>

            <button type="submit" disabled={submitting} style={{ ...S.btn, opacity: submitting ? 0.5 : 1, alignSelf: 'flex-start', padding: '0.75rem 2rem' }}>
              {submitting ? 'Adding...' : 'Add Problem'}
            </button>
          </form>
        </div>
      )}

      {/* Test Cases Tab */}
      {tab === 'testcases' && (
        <div>
          {!selectedProblem ? (
            <div style={{ ...S.card }}>
              <div style={{ padding: '3rem', textAlign: 'center', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>
                Select a problem from the Problems tab first
              </div>
            </div>
          ) : (
            <>
              <div style={{ marginBottom: '1rem', fontFamily: 'DM Mono, monospace', fontSize: '0.8rem', color: '#888' }}>
                Managing test cases for: <span style={{ color: '#f0f0f0', fontWeight: 600 }}>{selectedProblem.title}</span>
              </div>

              {/* Upload form */}
              <div style={{ ...S.card, marginBottom: '1.5rem' }}>
                <div style={S.cardHeader}>
                  <span style={S.cardTitle}>Upload Test Case</span>
                </div>
                <form id="tc-form" onSubmit={handleUploadTestcase} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                    <div>
                      <label style={S.label}>Input File (.in or .txt)</label>
                      <input type="file" onChange={e => setTcInput(e.target.files[0])} style={{ ...S.input, padding: '0.5rem' }} required />
                    </div>
                    <div>
                      <label style={S.label}>Output File (.out or .txt)</label>
                      <input type="file" onChange={e => setTcOutput(e.target.files[0])} style={{ ...S.input, padding: '0.5rem' }} required />
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <input type="checkbox" id="hidden" checked={tcHidden} onChange={e => setTcHidden(e.target.checked)} />
                    <label htmlFor="hidden" style={{ ...S.label, margin: 0, cursor: 'pointer' }}>Hidden test case (not shown to users)</label>
                  </div>
                  <button type="submit" disabled={uploading} style={{ ...S.btn, alignSelf: 'flex-start', opacity: uploading ? 0.5 : 1 }}>
                    {uploading ? 'Uploading...' : 'Upload Test Case'}
                  </button>
                </form>
              </div>

              {/* Existing test cases */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <span style={S.cardTitle}>Existing Test Cases ({testcases.length})</span>
                </div>
                {testcases.length === 0 ? (
                  <div style={{ padding: '2rem', textAlign: 'center', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.82rem' }}>No test cases yet</div>
                ) : (
                  testcases.map((tc, i) => (
                    <div key={tc.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.85rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#444' }}>TC {i + 1}</span>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: tc.is_hidden ? '#c9a96e' : '#4caf7d', background: tc.is_hidden ? 'rgba(201,169,110,0.12)' : 'rgba(76,175,125,0.12)', padding: '0.15rem 0.5rem', borderRadius: 4 }}>
                          {tc.is_hidden ? 'hidden' : 'visible'}
                        </span>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.7rem', color: '#444' }}>{tc.input_path.split('/').pop()}</span>
                      </div>
                      <button onClick={() => handleDeleteTestcase(tc.id)} style={S.btnDanger}>Delete</button>
                    </div>
                  ))
                )}
              </div>
            </>
          )}
        </div>
      )}

      {/* Users Tab */}
      {tab === 'users' && (
        <div style={S.card}>
          <div style={S.cardHeader}>
            <span style={S.cardTitle}>All Users ({users.length})</span>
          </div>
          {users.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: '#555', fontFamily: 'DM Mono, monospace', fontSize: '0.85rem' }}>Loading...</div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 100px', padding: '0.65rem 1.5rem', background: '#161616', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '0.68rem', fontWeight: 600, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#444' }}>
                <span>Name</span><span>Email</span><span>Role</span><span>Joined</span>
              </div>
              {users.map(u => (
                <div key={u.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 80px 100px', padding: '0.85rem 1.5rem', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{u.name}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.75rem', color: '#555' }}>{u.email}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: u.role === 'admin' ? '#c9a96e' : '#888', background: u.role === 'admin' ? 'rgba(201,169,110,0.12)' : 'transparent', padding: '0.15rem 0.5rem', borderRadius: 4, width: 'fit-content' }}>{u.role}</span>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '0.72rem', color: '#444' }}>{new Date(u.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                </div>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  )
}
