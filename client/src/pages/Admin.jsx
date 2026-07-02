import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLang } from '../hooks/useLang.jsx';
import { T } from '../data/tokens.js';
import { CURRICULUM } from '../data/curriculum.js';
import { ASSESSMENT_RUBRICS } from '../data/assessmentRubrics.js';
import { Btn, Card, Bar, Pill, Avatar, Divider } from '../components/atoms/index.jsx';
import NavBar from '../components/layout/NavBar.jsx';
import Toast from '../components/layout/Toast.jsx';
import api, { adminAPI } from '../lib/api.js';

const GDPR_ACTIONS = [
  { action:'Social Media Search',    ie:'Permitted', uk:'Permitted', eu:'Permitted', basis:'Art 6(1)(f) Legitimate Interest' },
  { action:'Adverse Media Search',   ie:'Permitted', uk:'Permitted', eu:'Permitted', basis:'Art 6(1)(f) Legitimate Interest' },
  { action:'Financial Records',      ie:'Restricted',uk:'Restricted',eu:'Restricted',basis:'Art 6(1)(c)/(f) — supervisor approval' },
  { action:'Employment History',     ie:'Permitted', uk:'Permitted', eu:'Permitted', basis:'Art 6(1)(f) — due diligence' },
  { action:'Location Tracking',      ie:'Restricted',uk:'Restricted',eu:'Restricted',basis:'Art 6 — proportionality required' },
  { action:'Biometric Data',         ie:'Prohibited',uk:'Prohibited',eu:'Prohibited',basis:'Art 9(1) Special Category' },
  { action:'Health Data',            ie:'Prohibited',uk:'Prohibited',eu:'Prohibited',basis:'Art 9(1) Special Category' },
  { action:'Criminal Records',       ie:'Restricted',uk:'Restricted',eu:'Restricted',basis:'Art 10 — prior consultation' },
  { action:'Cross-Border Transfer',  ie:'Restricted',uk:'Restricted',eu:'Restricted',basis:'Art 44–49 (SCCs/BCRs required)' },
  { action:'AI Automated Profiling', ie:'Restricted',uk:'Restricted',eu:'Restricted',basis:'Art 22; EU AI Act Art 6' },
  { action:'Monitoring Activation',  ie:'Restricted',uk:'Restricted',eu:'Restricted',basis:'Art 6, Art 13/14' },
];

export default function AdminPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [toast, setToast] = useState(null);
  const [team, setTeam] = useState([]);
  const [aiLog, setAiLog] = useState([]);
  const [docs, setDocs] = useState([]);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('learner');
  const [inviting, setInviting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [genMods, setGenMods] = useState([]);
  const [assessments, setAssessments] = useState([]);
  const [cohorts, setCohorts] = useState([]);
  const [newCohort, setNewCohort] = useState({ name:'', trackId:'', deadline:'' });
  const [creatingCohort, setCreatingCohort] = useState(false);
  const [signingId, setSigningId] = useState(null);
  const [assessFeedback, setAssessFeedback] = useState({});
  const [selectedLearner, setSelectedLearner] = useState(null);
  const [learnerDetail, setLearnerDetail] = useState(null);
  const [loadingDetail, setLoadingDetail] = useState(false);

  const notify = (msg, type = 'ok') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  useEffect(() => {
    if (tab === 'team') loadTeam();
    if (tab === 'ailog') loadAiLog();
    if (tab === 'docs') loadDocs();
    if (tab === 'assessments') loadAssessments();
    if (tab === 'cohorts') loadCohorts();
  }, [tab]);

  async function loadTeam() {
    try { const d = await adminAPI.getTeam(); setTeam(d.team || []); }
    catch { /* use empty */ }
  }

  async function loadAiLog() {
    try { const d = await adminAPI.getAiLog(); setAiLog(d.log || []); }
    catch { /* use empty */ }
  }

  async function loadDocs() {
    try { const d = await adminAPI.getDocs(); setDocs(d.docs || []); }
    catch { /* use empty */ }
  }

  async function loadCohorts() {
    try {
      const d = await api.get('/cohorts').then(r => r.data);
      setCohorts(d.cohorts || []);
    } catch { /* use empty */ }
  }

  async function handleCreateCohort(e) {
    e.preventDefault();
    if (!newCohort.name || !newCohort.trackId) return;
    setCreatingCohort(true);
    try {
      await api.post('/cohorts', newCohort);
      notify(`Cohort "${newCohort.name}" created`);
      setNewCohort({ name:'', trackId:'', deadline:'' });
      loadCohorts();
    } catch { notify('Failed to create cohort', 'err'); }
    finally { setCreatingCohort(false); }
  }

  async function handleNudge(cohortId, cohortName) {
    try {
      const d = await api.post(`/cohorts/${cohortId}/nudge`, { daysInactive: 7 }).then(r => r.data);
      notify(`Nudge sent to ${d.nudged} inactive members of ${cohortName}`);
    } catch { notify('Nudge failed', 'err'); }
  }

  async function loadAssessments() {
    try { const d = await adminAPI.getAssessments(); setAssessments(d.assessments || []); }
    catch { /* use empty */ }
  }

  async function handleSignOff(assessId, decision, certId) {
    setSigningId(assessId);
    try {
      await adminAPI.signAssessment(assessId, {
        decision,
        feedback: assessFeedback[assessId] || '',
        certId,
      });
      notify(decision === 'approved' ? 'Assessment signed off ✓ Certificate issued' : 'Returned to learner for revision');
      loadAssessments();
    } catch { notify('Sign-off failed', 'err'); }
    finally { setSigningId(null); }
  }

  async function handleInvite(e) {
    e.preventDefault();
    if (!inviteEmail.trim()) return;
    setInviting(true);
    try {
      await adminAPI.invite({ email: inviteEmail.trim(), role: inviteRole });
      notify(`Invitation sent to ${inviteEmail}`);
      setInviteEmail('');
      loadTeam();
    } catch (err) {
      notify(err.message || 'Invite failed', 'err');
    } finally {
      setInviting(false);
    }
  }

  async function handleDocUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('doc', file);
      const d = await adminAPI.uploadDoc(form);
      notify(`"${d.moduleTitle}" generated — ${d.quizCount} quiz questions`);
      setGenMods(prev => [...prev, d]);
      loadDocs();
    } catch (err) {
      notify(err.message || 'Upload failed', 'err');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function loadLearnerDetail(userId) {
    setLoadingDetail(true);
    setSelectedLearner(userId);
    try {
      const d = await adminAPI.getLearner(userId);
      setLearnerDetail(d);
    } catch {
      setLearnerDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  }

  // ── STATS ────────────────────────────────────────────────────────────────────
  const totalXP = team.reduce((s, m) => s + (m.total_xp || 0), 0);
  const avgCompletion = team.length
    ? Math.round(team.reduce((s, m) => s + (m.overall_pct || 0), 0) / team.length)
    : 0;
  const atRisk = team.filter(m => m.days_inactive > 7);

  const TABS = [
    ['overview', 'Overview'],
    ['team', 'Team Tracker'],
    ['ailog', 'AI Log'],
    ['docs', 'Document Training'],
    ['assessments', 'Assessments'],
    ['cohorts', 'Cohorts'],
    ['gdpr', 'GDPR Compliance'],
  ];

  return (
    <div style={{ background: T.page, minHeight: '100vh' }}>
      <NavBar title="Administration" />
      <Toast toast={toast} />

      {/* Tab bar */}
      <div style={{ background: T.white, borderBottom: `1px solid ${T.border}`, position: 'sticky', top: 56, zIndex: 50 }}>
        <div className="sp-tab-bar" style={{ maxWidth: 1100, margin: '0 auto', padding: '0 24px', display: 'flex', overflowX: 'auto' }}>
          {TABS.map(([key, label]) => (
            <button key={key} onClick={() => setTab(key)}
              style={{ padding: '14px 18px', border: 'none', borderBottom: `2px solid ${tab === key ? T.blue : 'transparent'}`, background: 'transparent', color: tab === key ? T.blue : T.fog, fontWeight: tab === key ? 700 : 500, fontSize: 13, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              {label}
            </button>
          ))}
        </div>
      </div>

      <main className="sp-main" style={{ maxWidth: 1100, margin: '0 auto', padding: '28px 24px' }}>

        {/* ── OVERVIEW ── */}
        {tab === 'overview' && (
          <div className="fade">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 12, marginBottom: 24 }}>
              {[
                { icon: '👥', val: team.length || '—', label: 'Team Members' },
                { icon: '⚡', val: totalXP ? totalXP.toLocaleString() : '—', label: 'Total XP' },
                { icon: '📈', val: avgCompletion ? `${avgCompletion}%` : '—', label: 'Avg Progress' },
                { icon: '⚠️', val: atRisk.length, label: 'At Risk (7d)', color: atRisk.length > 0 ? T.amberL : T.fog },
                { icon: '📋', val: docs.length, label: 'Documents' },
              ].map(s => (
                <Card key={s.label} style={{ padding: '16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{s.icon}</div>
                  <div style={{ fontSize: 24, fontWeight: 900, color: s.color || T.ink }}>{s.val}</div>
                  <div style={{ fontSize: 11, color: T.fog, marginTop: 3 }}>{s.label}</div>
                </Card>
              ))}
            </div>

            {/* Track enrolment grid */}
            <Card style={{ padding: 22, marginBottom: 20 }}>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, marginBottom: 14 }}>Track Enrolment</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 10 }}>
                {CURRICULUM.map(tr => {
                  const enrolled = team.filter(m => m.active_track === tr.id).length;
                  return (
                    <div key={tr.id} style={{ padding: '12px 14px', background: T.off, borderRadius: 7, border: `1px solid ${T.border}` }}>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                        <span style={{ fontSize: 16 }}>{tr.icon}</span>
                        <span style={{ fontSize: 11, fontWeight: 700, color: T.ink }}>{tr.code}</span>
                      </div>
                      <div style={{ fontSize: 22, fontWeight: 900, color: tr.accentText }}>{enrolled}</div>
                      <div style={{ fontSize: 10, color: T.fog, marginBottom: 4 }}>enrolled</div>
                      <Bar pct={team.length ? Math.round(enrolled / team.length * 100) : 0} color={tr.accent} h={3} />
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* At-risk alert */}
            {atRisk.length > 0 && (
              <div style={{ background: `${T.amber}08`, border: `1px solid ${T.amber}25`, borderRadius: 8, padding: '14px 18px' }}>
                <div style={{ fontWeight: 700, color: T.amberL, marginBottom: 8 }}>⚠ {atRisk.length} learner{atRisk.length > 1 ? 's' : ''} inactive for 7+ days</div>
                {atRisk.slice(0, 5).map(m => (
                  <div key={m.id} style={{ fontSize: 12, color: T.steel, padding: '3px 0' }}>
                    {m.name} — {m.days_inactive}d inactive · {CURRICULUM.find(c => c.id === m.active_track)?.title || 'No track'}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── TEAM TRACKER ── */}
        {tab === 'team' && (
          <div className="fade">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
              <div>
                <h2 style={{ fontWeight: 800, fontSize: 18, color: T.ink, marginBottom: 4 }}>Team Training Tracker</h2>
                <p style={{ color: T.fog, fontSize: 13 }}>Live progress for your organisation.</p>
              </div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <Btn v="ghost" sm onClick={async () => {
                  try {
                    const token = localStorage.getItem('sp_at');
                    const res = await fetch('/api/admin/export/csv', { headers: { Authorization: `Bearer ${token}` } });
                    if (!res.ok) throw new Error('Export failed');
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `securepathway-gradebook-${new Date().toISOString().slice(0,10)}.csv`;
                    a.click();
                    URL.revokeObjectURL(url);
                  } catch { notify('Export failed', 'err'); }
                }}>⬇ Export CSV</Btn>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input value={inviteEmail} onChange={e => setInviteEmail(e.target.value)}
                    placeholder="colleague@company.com" aria-label="Invitee email address"
                    style={{ padding: '8px 12px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 13, width: 220, outline: 'none' }} />
                  <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} aria-label="Invitee role"
                    style={{ padding: '8px 10px', border: `1px solid ${T.border}`, borderRadius: 6, fontSize: 12, outline: 'none' }}>
                    <option value="learner">Learner</option>
                    <option value="manager">Manager</option>
                  </select>
                  <Btn v="solid" ac={T.goldSolid} sm disabled={inviting || !inviteEmail.trim()} onClick={handleInvite}>
                    {inviting ? 'Sending…' : 'Invite'}
                  </Btn>
                </div>
              </div>
            </div>

            {/* Learner detail panel */}
            {selectedLearner && (
              <Card style={{ padding: 22, marginBottom: 20, border: `1px solid ${T.blue}25` }} className="fade">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontWeight: 700, fontSize: 14, color: T.ink }}>
                    {team.find(m => m.id === selectedLearner)?.name} — Full Progress
                  </div>
                  <button onClick={() => { setSelectedLearner(null); setLearnerDetail(null); }} aria-label="Close learner detail" style={{ background: 'none', border: 'none', color: T.fog, fontSize: 16, cursor: 'pointer' }}>×</button>
                </div>
                {loadingDetail ? (
                  <div style={{ color: T.fog, fontSize: 13 }}>Loading…</div>
                ) : learnerDetail ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 10 }}>
                    {learnerDetail.moduleProgress?.map(mp => (
                      <div key={mp.module_id} style={{ padding: '10px 14px', background: T.off, borderRadius: 7, border: `1px solid ${T.border}` }}>
                        <div style={{ fontWeight: 600, fontSize: 12, color: T.ink, marginBottom: 4 }}>
                          {CURRICULUM.flatMap(t => t.modules).find(m => m.id === mp.module_id)?.title || mp.module_id}
                        </div>
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                          {mp.quiz_passed && <Pill c={T.greenText} sm>Quiz ✓</Pill>}
                          {mp.assess_passed && <Pill c={T.goldText} sm>Assessed</Pill>}
                          {mp.hook_done && <Pill c={T.blue} sm>Hook</Pill>}
                        </div>
                        {mp.quiz_score && <div style={{ fontSize: 11, color: T.fog, marginTop: 4 }}>Quiz: {mp.quiz_score}%</div>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ color: T.fog, fontSize: 13 }}>No detailed progress found.</div>
                )}
              </Card>
            )}

            {team.length === 0 ? (
              <Card style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 12 }}>👥</div>
                <div style={{ fontWeight: 700, color: T.ink, marginBottom: 6 }}>No team members yet</div>
                <p style={{ color: T.fog, fontSize: 13 }}>Invite your first team member above.</p>
              </Card>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14 }}>
                {team.map(m => {
                  const tr = CURRICULUM.find(c => c.id === m.active_track);
                  const atR = (m.days_inactive || 0) > 7;
                  return (
                    <Card key={m.id} style={{ padding: 20, border: `1px solid ${atR ? T.amberL + '50' : T.border}` }}>
                      <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 12 }}>
                        <Avatar i={m.initials || m.name?.slice(0, 2).toUpperCase()} size={36} color={m.role === 'manager' ? T.goldSolid : T.navyM} />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: 700, fontSize: 13, color: T.ink }}>{m.name}</div>
                          <div style={{ fontSize: 10, color: T.fog }}>{m.role}{atR && <span style={{ color: T.amberL }}> · {m.days_inactive}d inactive</span>}</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: 14, fontWeight: 900, color: tr?.accentText || T.fog }}>{(m.total_xp || 0).toLocaleString()}</div>
                          <div style={{ fontSize: 9, color: T.fog }}>XP</div>
                        </div>
                      </div>
                      {tr && (
                        <div style={{ marginBottom: 10 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                            <span style={{ fontSize: 11, color: T.fog }}>{tr.title}</span>
                            <span style={{ fontSize: 11, fontWeight: 700, color: tr.accentText }}>{m.overall_pct || 0}%</span>
                          </div>
                          <Bar pct={m.overall_pct || 0} color={tr.accent} h={5} />
                        </div>
                      )}
                      {atR && (
                        <div style={{ background: `${T.amber}08`, border: `1px solid ${T.amber}25`, borderRadius: 6, padding: '7px 10px', marginBottom: 10, fontSize: 11, color: T.amberL }}>
                          No activity for {m.days_inactive} days
                        </div>
                      )}
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Btn v="ghost" sm onClick={() => loadLearnerDetail(m.id)}>View Detail</Btn>
                        {atR && <Btn v="primary" ac={T.amberText} sm onClick={() => notify(`Reminder sent to ${m.name}`)}>Remind</Btn>}
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── AI LOG ── */}
        {tab === 'ailog' && (
          <div className="fade">
            <h2 style={{ fontWeight: 800, fontSize: 18, color: T.ink, marginBottom: 6 }}>AI Usage Log</h2>
            <p style={{ color: T.fog, fontSize: 13, marginBottom: 20 }}>All AI model invocations — short answer grading, simulations, assessments, document generation.</p>
            {aiLog.length === 0 ? (
              <Card style={{ padding: 40, textAlign: 'center' }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
                <div style={{ color: T.fog, fontSize: 13 }}>No AI actions logged yet.</div>
              </Card>
            ) : (
              <Card style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: T.off }}>
                      {['Date', 'Type', 'User', 'Detail', 'Tool'].map(h => (
                        <th key={h} style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: T.steel, fontSize: 11, textTransform: 'uppercase', letterSpacing: '.06em', borderBottom: `1px solid ${T.border}` }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {aiLog.slice(0, 50).map((row, i) => (
                      <tr key={i} className="hrow">
                        <td style={{ padding: '10px 14px', borderBottom: `1px solid ${T.border}`, color: T.fog, whiteSpace: 'nowrap' }}>{row.date || row.created_at?.slice(0, 10)}</td>
                        <td style={{ padding: '10px 14px', borderBottom: `1px solid ${T.border}` }}><Pill c={row.type === 'Assessment' ? T.goldText : row.type === 'Simulation' ? T.purple : T.blue}>{row.type}</Pill></td>
                        <td style={{ padding: '10px 14px', borderBottom: `1px solid ${T.border}`, color: T.ink, fontWeight: 500 }}>{row.user_name || row.user}</td>
                        <td style={{ padding: '10px 14px', borderBottom: `1px solid ${T.border}`, color: T.steel, maxWidth: 360, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{row.detail}</td>
                        <td style={{ padding: '10px 14px', borderBottom: `1px solid ${T.border}`, color: T.fog }}>{row.tool}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>
            )}
          </div>
        )}

        {/* ── DOCUMENT TRAINING ── */}
        {tab === 'docs' && (
          <div className="fade">
            <h2 style={{ fontWeight: 800, fontSize: 18, color: T.ink, marginBottom: 6 }}>Document Training</h2>
            <p style={{ color: T.fog, fontSize: 13, marginBottom: 20 }}>Upload company SOPs, policies, or procedures. AI generates a bespoke training module with quiz questions your team can take.</p>

            {/* Upload area */}
            <Card style={{ padding: 28, marginBottom: 24, border: `2px dashed ${T.border}`, textAlign: 'center' }}>
              <div style={{ fontSize: 32, marginBottom: 10 }}>📄</div>
              <div style={{ fontWeight: 700, fontSize: 15, color: T.ink, marginBottom: 6 }}>Upload a company document</div>
              <p style={{ color: T.fog, fontSize: 13, marginBottom: 16 }}>PDF, DOCX, or TXT · Max 10MB · AI analyses and generates training content</p>
              <label style={{ cursor: 'pointer' }}>
                <input type="file" accept=".pdf,.docx,.txt" onChange={handleDocUpload} style={{ display: 'none' }} disabled={uploading} />
                <Btn v="solid" ac={T.blue} disabled={uploading} onClick={() => {}}>
                  {uploading ? 'Generating module…' : 'Choose File'}
                </Btn>
              </label>
            </Card>

            {/* Generated modules */}
            {genMods.length > 0 && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 12 }}>Generated This Session</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 12 }}>
                  {genMods.map((mod, i) => (
                    <Card key={i} style={{ padding: 18, border: `1px solid ${T.gold}30` }}>
                      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
                        <Pill c={T.goldText}>Company</Pill>
                        <Pill c={T.greenText}>Generated</Pill>
                      </div>
                      <div style={{ fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 3 }}>{mod.moduleTitle || mod.title}</div>
                      <div style={{ fontSize: 11, color: T.fog, marginBottom: 8 }}>{mod.sourceDoc} · {mod.quizCount || 5} quiz questions</div>
                      {mod.objectives?.slice(0, 2).map((o, j) => (
                        <div key={j} style={{ fontSize: 11, color: T.steel }}>· {o}</div>
                      ))}
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {/* Uploaded documents history */}
            {docs.length > 0 && (
              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 12 }}>Uploaded Documents</div>
                {docs.map(d => (
                  <div key={d.id} className="hrow" style={{ display: 'flex', gap: 14, alignItems: 'center', padding: '12px 14px', borderRadius: 7, background: T.white, border: `1px solid ${T.border}`, marginBottom: 8 }}>
                    <span style={{ fontSize: 20 }}>📄</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13, color: T.ink }}>{d.filename}</div>
                      <div style={{ fontSize: 11, color: T.fog }}>{d.size_kb ? `${d.size_kb}KB` : ''} · {d.created_at?.slice(0, 10)}</div>
                    </div>
                    <Pill c={d.status === 'processed' ? T.greenText : T.amberL}>{d.status || 'pending'}</Pill>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── COHORTS ── */}
        {tab === 'cohorts' && (
          <div className="fade">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:12 }}>
              <div>
                <h2 style={{ fontWeight:800, fontSize:18, color:T.ink, marginBottom:4 }}>Cohort Management</h2>
                <p style={{ color:T.fog, fontSize:13 }}>Group learners into intake batches with shared tracks and deadlines.</p>
              </div>
            </div>

            {/* Create cohort form */}
            <Card style={{ padding:22, marginBottom:24, border:`1px solid ${T.blue}20` }}>
              <div style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:14 }}>Create New Cohort</div>
              <div style={{ display:'flex', gap:10, flexWrap:'wrap', alignItems:'flex-end' }}>
                <div style={{ flex:2, minWidth:160 }}>
                  <label style={{ fontSize:11, color:T.fog, display:'block', marginBottom:4 }}>Cohort name</label>
                  <input value={newCohort.name} onChange={e => setNewCohort(c=>({...c,name:e.target.value}))}
                    placeholder="Q1 2026 Intake"
                    aria-label="Cohort name"
                    style={{ width:'100%', padding:'8px 12px', border:`1px solid ${T.border}`, borderRadius:6, fontSize:13, outline:'none' }} />
                </div>
                <div style={{ flex:2, minWidth:140 }}>
                  <label style={{ fontSize:11, color:T.fog, display:'block', marginBottom:4 }}>Track</label>
                  <select value={newCohort.trackId} onChange={e => setNewCohort(c=>({...c,trackId:e.target.value}))}
                    aria-label="Track"
                    style={{ width:'100%', padding:'8px 12px', border:`1px solid ${T.border}`, borderRadius:6, fontSize:13, outline:'none' }}>
                    <option value="">Select track…</option>
                    {CURRICULUM.map(tr => <option key={tr.id} value={tr.id}>{tr.code} — {tr.title}</option>)}
                  </select>
                </div>
                <div style={{ flex:1, minWidth:130 }}>
                  <label style={{ fontSize:11, color:T.fog, display:'block', marginBottom:4 }}>Deadline (optional)</label>
                  <input type="date" value={newCohort.deadline} onChange={e => setNewCohort(c=>({...c,deadline:e.target.value}))}
                    aria-label="Deadline date"
                    style={{ width:'100%', padding:'8px 12px', border:`1px solid ${T.border}`, borderRadius:6, fontSize:13, outline:'none' }} />
                </div>
                <Btn v="solid" ac={T.blue} sm disabled={creatingCohort || !newCohort.name || !newCohort.trackId} onClick={handleCreateCohort}>
                  {creatingCohort ? 'Creating…' : 'Create'}
                </Btn>
              </div>
            </Card>

            {/* Cohort list */}
            {cohorts.length === 0 ? (
              <Card style={{ padding:40, textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>👥</div>
                <div style={{ fontWeight:700, color:T.ink, marginBottom:6 }}>No cohorts yet</div>
                <p style={{ color:T.fog, fontSize:13 }}>Create your first cohort above.</p>
              </Card>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:14 }}>
                {cohorts.map(c => {
                  const tr = CURRICULUM.find(t => t.id === c.track_id);
                  const daysToDeadline = c.deadline ? Math.ceil((new Date(c.deadline) - new Date()) / 86400000) : null;
                  const deadlineColor = daysToDeadline < 7 ? T.redText : daysToDeadline < 21 ? T.amberText : T.greenText;
                  return (
                    <Card key={c.id} style={{ padding:20 }}>
                      <div style={{ display:'flex', gap:8, marginBottom:10 }}>
                        {tr && <Pill c={tr.accentText}>{tr.code}</Pill>}
                        {daysToDeadline !== null && (
                          <Pill c={deadlineColor}>{daysToDeadline > 0 ? `${daysToDeadline}d to deadline` : 'Past deadline'}</Pill>
                        )}
                      </div>
                      <div style={{ fontWeight:700, fontSize:14, color:T.ink, marginBottom:3 }}>{c.name}</div>
                      <div style={{ fontSize:12, color:T.fog, marginBottom:12 }}>
                        {c.member_count || 0} members · {c.avg_progress || 0}% avg progress
                      </div>
                      {c.member_count > 0 && (
                        <div style={{ marginBottom:12 }}>
                          <Bar pct={c.avg_progress || 0} color={tr?.accent || T.blue} h={5} />
                        </div>
                      )}
                      <div style={{ display:'flex', gap:8 }}>
                        <Btn v="ghost" sm onClick={() => notify(`Cohort ${c.name} details coming soon`)}>View</Btn>
                        <Btn v="primary" ac={T.amberText} sm onClick={() => handleNudge(c.id, c.name)}>Nudge inactive</Btn>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ── ASSESSMENTS ── */}
        {tab === 'assessments' && (
          <div className="fade">
            <h2 style={{ fontWeight:800, fontSize:18, color:T.ink, marginBottom:6 }}>Track Assessments — Awaiting Sign-off</h2>
            <p style={{ color:T.fog, fontSize:13, marginBottom:20 }}>AI pre-reviews are complete. Review each submission and sign off or return to learner. Human sign-off is required before the SPS credential is issued.</p>
            {assessments.length === 0 ? (
              <Card style={{ padding:40, textAlign:'center' }}>
                <div style={{ fontSize:28, marginBottom:8 }}>✓</div>
                <div style={{ fontWeight:700, color:T.ink, marginBottom:6 }}>No pending assessments</div>
                <p style={{ color:T.fog, fontSize:13 }}>All submitted assessments have been reviewed.</p>
              </Card>
            ) : assessments.map(a => {
              const rubric = a.rubric_json ? (typeof a.rubric_json === 'string' ? JSON.parse(a.rubric_json) : a.rubric_json) : null;
              const grade = rubric?.overallGrade;
              const gradeColor = grade === 'Distinction' ? T.greenText : grade === 'Merit' ? T.blue : grade === 'Pass' ? T.goldText : T.redText;
              const isSigned = a.assessor_signed;
              return (
                <Card key={a.id} style={{ padding:24, marginBottom:16, border:`1px solid ${isSigned ? T.greenL+'30' : T.gold+'40'}` }}>
                  <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12, marginBottom:14 }}>
                    <div>
                      <div style={{ display:'flex', gap:8, marginBottom:6 }}>
                        <Pill c={isSigned ? T.greenText : T.goldText}>{isSigned ? 'Signed Off' : 'Pending Sign-off'}</Pill>
                        {grade && <Pill c={gradeColor}>{grade} — {a.ai_score}%</Pill>}
                      </div>
                      <div style={{ fontWeight:700, fontSize:14, color:T.ink }}>{a.module_title}</div>
                      <div style={{ fontSize:12, color:T.fog }}>{a.learner_name} · Submitted {a.created_at?.slice(0,10)}</div>
                    </div>
                    {isSigned && <div style={{ fontSize:11, color:T.greenText, fontWeight:600 }}>Signed {a.signed_at?.slice(0,10)}</div>}
                  </div>

                  {/* AI feedback */}
                  {(rubric?.strengths || a.ai_feedback) && (
                    <div style={{ background:T.off, border:`1px solid ${T.border}`, borderRadius:7, padding:'12px 16px', marginBottom:14 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>AI Pre-Assessment</div>
                      {rubric?.criteriaFeedback?.length > 0 && (
                        <div style={{ marginBottom:10 }}>
                          {rubric.criteriaFeedback.map((cf, i) => (
                            <div key={i} style={{ display:'flex', gap:10, padding:'4px 0', borderBottom:`1px solid ${T.border}` }}>
                              <span style={{ fontSize:12, color:T.ink, flex:1 }}>{cf.criterion}</span>
                              <span style={{ fontSize:12, fontWeight:700, color:cf.score>=70?T.greenText:T.redText }}>{cf.score}%</span>
                              <span style={{ fontSize:11, color:T.fog, flex:2 }}>{cf.comment}</span>
                            </div>
                          ))}
                        </div>
                      )}
                      {rubric?.strengths && <div style={{ fontSize:12, color:T.greenText, marginBottom:4 }}><strong>Strengths:</strong> {rubric.strengths}</div>}
                      {rubric?.gaps && <div style={{ fontSize:12, color:T.amberL }}><strong>Gaps:</strong> {rubric.gaps}</div>}
                    </div>
                  )}

                  {/* Submission text */}
                  <div style={{ background:T.off, border:`1px solid ${T.border}`, borderRadius:7, padding:'12px 16px', marginBottom:14, maxHeight:160, overflowY:'auto' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Learner Submission</div>
                    <div style={{ fontSize:12, color:T.slate, lineHeight:1.7, whiteSpace:'pre-wrap' }}>{a.answer}</div>
                  </div>

                  {/* Assessor action */}
                  {!isSigned && (
                    <div>
                      <textarea rows={2} value={assessFeedback[a.id] || ''}
                        onChange={e => setAssessFeedback(f => ({ ...f, [a.id]: e.target.value }))}
                        placeholder="Optional: add assessor note (visible to learner)…"
                        style={{ width:'100%', padding:'8px 12px', border:`1px solid ${T.border}`, borderRadius:6, fontSize:12, resize:'none', marginBottom:10, outline:'none', color:T.ink }} />
                      <div style={{ display:'flex', gap:10 }}>
                        <Btn v="solid" ac={T.greenText} disabled={signingId === a.id}
                          onClick={() => handleSignOff(a.id, 'approved', a.cert_id)}>
                          {signingId === a.id ? 'Signing…' : '✓ Sign Off & Issue Certificate'}
                        </Btn>
                        <Btn v="danger" sm disabled={signingId === a.id}
                          onClick={() => handleSignOff(a.id, 'returned', a.cert_id)}>
                          Return for Revision
                        </Btn>
                      </div>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {/* ── GDPR COMPLIANCE ── */}
        {tab === 'gdpr' && (
          <div className="fade">
            <h2 style={{ fontWeight: 800, fontSize: 18, color: T.ink, marginBottom: 6 }}>GDPR Regional Compliance Matrix</h2>
            <p style={{ color: T.fog, fontSize: 13, marginBottom: 24 }}>Research action permissions by region. Applies to all analyst activity on this platform.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: 16, marginBottom: 24 }}>
              {[
                { key: 'ie', label: 'Ireland (GDPR + DPC)', color: T.greenText },
                { key: 'uk', label: 'UK (UK GDPR + DPA 2018)', color: T.blue },
                { key: 'eu', label: 'EU/EEA (GDPR)', color: T.navyM },
              ].map(region => (
                <div key={region.key}>
                  <div style={{ fontWeight: 700, fontSize: 12, color: region.color, marginBottom: 10, padding: '7px 12px', background: `${region.color}10`, border: `1px solid ${region.color}25`, borderRadius: 7 }}>
                    {region.label}
                  </div>
                  {GDPR_ACTIONS.map(row => {
                    const val = row[region.key];
                    const c = val === 'Permitted' ? T.greenText : val === 'Restricted' ? T.amberText : T.redText;
                    return (
                      <div key={row.action} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: `1px solid ${T.border}`, fontSize: 12 }}>
                        <div>
                          <div style={{ fontWeight: 600, color: T.ink }}>{row.action}</div>
                          <div style={{ fontSize: 10, color: T.fog }}>{row.basis}</div>
                        </div>
                        <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, background: `${c}14`, color: c, border: `1px solid ${c}22`, flexShrink: 0, marginLeft: 10 }}>{val}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* GDPR self-service */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
              <Card style={{ padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 6 }}>GDPR Art. 17 — Right to Erasure</div>
                <p style={{ fontSize: 12, color: T.fog, lineHeight: 1.65, marginBottom: 12 }}>Process a learner deletion request. All personal training data erased within 30 days.</p>
                <Btn v="danger" sm onClick={() => notify('Deletion request logged. Data erased within 30 days per Art. 17 GDPR.')}>Process Deletion Request</Btn>
              </Card>
              <Card style={{ padding: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 6 }}>GDPR Art. 20 — Data Portability</div>
                <p style={{ fontSize: 12, color: T.fog, lineHeight: 1.65, marginBottom: 12 }}>Export learner portfolio and progress in machine-readable JSON format.</p>
                <Btn v="primary" ac={T.blue} sm onClick={() => notify('Export prepared. Sent to learner email within 24 hours.')}>Export Learner Data</Btn>
              </Card>
            </div>

            <div style={{ marginTop: 16, padding: 14, background: `${T.blue}06`, border: `1px solid ${T.blue}12`, borderRadius: 8, fontSize: 12, color: T.steel, lineHeight: 1.65 }}>
              <strong style={{ color: T.navy }}>Platform Data Retention:</strong> Training data 12 months from last activity · GDPR gate records 60 months · AI usage logs 24 months. All data is scoped to your organisation tenant.
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
