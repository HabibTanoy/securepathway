import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLang } from '../hooks/useLang.jsx';
import { T } from '../data/tokens.js';
import { TC_MODULES } from '../data/onboarding_modules.js';
import { TRACKS } from '../data/onboarding_tracks.js';
import { POLICIES } from '../data/onboarding_policies.js';
import { ASSIGNMENTS } from '../data/onboarding_assignments.js';
import { Btn, Card, Bar, Pill, Avatar, Divider } from '../components/atoms/index.jsx';
import NavBar from '../components/layout/NavBar.jsx';
import Toast from '../components/layout/Toast.jsx';
import api from '../lib/api.js';

const TOUR_STEPS = [
  { id:'welcome',    title:'Welcome to SecurePathway',    desc:'Your professional security operations training platform. This tour covers all key areas.',         icon:'✦', gradient:`linear-gradient(135deg,${T.navyM},#0F2044)` },
  { id:'hub',        title:'Intelligence Hub',             desc:'Your operations dashboard. Monitoring feeds, country risk, RAZOR intelligence, and live alerts.',    icon:'⬡', gradient:`linear-gradient(135deg,${T.blue},#1040C0)` },
  { id:'cases',      title:'Case Management',              desc:'All assigned cases, SLA tracking, GDPR gates, workflow stages, and full case documentation.',         icon:'⬟', gradient:`linear-gradient(135deg,#8E5710,#95590E)` },
  { id:'razor',      title:'RAZOR Intelligence',           desc:'Rapid intelligence for fast-moving situations. Produced in hours. SOP-governed triggers.',           icon:'◈', gradient:`linear-gradient(135deg,#8045C8,#5B2D90)` },
  { id:'compliance', title:'Compliance & GDPR',            desc:'GDPR gates, data audit logs, retention schedules, and regulatory compliance across all cases.',       icon:'⬡', gradient:`linear-gradient(135deg,${T.red},#8B1520)` },
  { id:'reports',    title:'Report Builder',               desc:'ORP, Due Diligence, Investigation Reports, Risk Assessments, and Financial Crime products.',          icon:'◫', gradient:`linear-gradient(135deg,${T.teal},#084848)` },
  { id:'scorecard',  title:'Scorecard',                    desc:'Personal performance metrics — SLA rate, QC pass rate, output volume, AHC vs PHC variance.',         icon:'◎', gradient:`linear-gradient(135deg,${T.green},#065040)` },
  { id:'sop_bot',    title:'SOP Bot & Help Centre',        desc:'Ask any procedural question and get an instant, SOP-referenced answer. Full SOP library here.',      icon:'◉', gradient:`linear-gradient(135deg,#7B2D8B,#4B1060)` },
  { id:'profile',    title:'Profile & Settings',           desc:'Enable MFA on Day 1. Configure notifications, review your training pathway, and manage preferences.',  icon:'◌', gradient:`linear-gradient(135deg,#4D6080,#1A3050)` },
];

const PLATFORM_TASKS = [
  { id:'mfa',      title:'Enable Multi-Factor Authentication',     desc:'MFA is mandatory. Go to Profile and turn on two-factor authentication.', icon:'🔐' },
  { id:'profile',  title:'Complete your profile',                   desc:'Add your role, team, and start track preference.', icon:'👤' },
  { id:'sop',      title:'Read your first SOP',                     desc:'Open the SOP Library and read the Analyst Workflow SOP.', icon:'📋' },
  { id:'sim',      title:'Run a practice simulation',               desc:'Enter the SOC Simulation Centre and complete one scenario.', icon:'🎮' },
  { id:'notify',   title:'Set notification preferences',            desc:'Configure email and platform reminders for deadlines.', icon:'🔔' },
];

export default function OnboardingPage() {
  const { user } = useAuth();
  const { t } = useLang();
  const navigate = useNavigate();
  const [phase, setPhase] = useState('start');  // start|tour|track|policies|platform|curriculum
  const [toast, setToast] = useState(null);
  const [tourStep, setTourStep] = useState(0);
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [polStep, setPolStep] = useState(0);
  const [polsDone, setPolsDone] = useState({});
  const [platDone, setPlatDone] = useState({});
  const [activeModId, setActiveModId] = useState(null);
  const [modProg, setModProg] = useState({});   // modId -> { sections: {}, quizDone }
  const [asgmtText, setAsgmtText] = useState('');
  const [asgmtFb, setAsgmtFb] = useState(null);
  const [asgmtLoading, setAsgmtLoading] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [companyDocs, setCompanyDocs] = useState([]);
  const [genMods, setGenMods] = useState([]);
  const [uploading, setUploading] = useState(false);

  const notify = (msg, type = 'ok') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3200); };

  // Keyboard navigation for tour
  useEffect(() => {
    if (phase !== 'tour') return;
    const h = e => {
      if (e.key === 'ArrowRight') setTourStep(s => Math.min(s + 1, TOUR_STEPS.length - 1));
      else if (e.key === 'ArrowLeft') setTourStep(s => Math.max(s - 1, 0));
      else if (e.key === 'Escape') setPhase('track');
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, [phase]);

  const obTrack = selectedTrack ? TRACKS[selectedTrack] : null;
  const obModIds = obTrack?.modules || [];
  const obModsDone = obModIds.filter(id => modProg[id]?.quizDone).length;
  const polsDoneCount = Object.keys(polsDone).filter(k => polsDone[k]).length;
  const platDoneCount = Object.keys(platDone).filter(k => platDone[k]).length;

  const obPct = Math.round(
    ((polsDoneCount / POLICIES.length) * 30 +
     (platDoneCount / PLATFORM_TASKS.length) * 20 +
     (obModsDone / (obModIds.length || 1)) * 50)
  );

  async function handleDocUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('doc', file);
      const res = await api.post('/admin/documents', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      const mod = res.data;
      setGenMods(prev => [...prev, mod]);
      notify(`"${mod.moduleTitle}" generated — ${mod.quizCount} quiz questions`);
    } catch {
      notify('Upload failed', 'err');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  const currentMod = activeModId ? TC_MODULES[activeModId] : null;
  const trackColor = obTrack ? (obTrack.colorBg || obTrack.color || T.blue) : T.blue;

  // ── START ────────────────────────────────────────────────────────────────────
  if (phase === 'start') return (
    <div style={{ background: T.navy, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}.fade{animation:fu .22s ease both}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      <Toast toast={toast} />
      <div style={{ maxWidth: 520, width: '100%', textAlign: 'center' }} className="fade">
        <div style={{ width: 60, height: 60, borderRadius: 14, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 26 }}>🎯</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: 'rgba(255,255,255,.7)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 10 }}>Welcome</div>
        <h1 style={{ fontSize: 28, fontWeight: 900, color: '#fff', letterSpacing: '-.03em', marginBottom: 10 }}>Onboarding Programme</h1>
        <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14, lineHeight: 1.75, marginBottom: 32 }}>
          This programme takes you through platform orientation, mandatory policies, and your first training curriculum. Estimated time: 2–3 hours across your first week.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 28 }}>
          {[
            { icon: '🗺', title: 'Platform Tour', desc: '9 areas · 5 min' },
            { icon: '📋', title: 'Policies', desc: `${POLICIES.length} mandatory · ~30 min` },
            { icon: '🖥️', title: 'Platform Tasks', desc: `${PLATFORM_TASKS.length} setup tasks` },
            { icon: '📚', title: 'Curriculum', desc: 'Your assigned track' },
          ].map(item => (
            <div key={item.title} style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 8, padding: '14px 16px', textAlign: 'left' }}>
              <div style={{ fontSize: 20, marginBottom: 6 }}>{item.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 12, color: '#fff', marginBottom: 2 }}>{item.title}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,.6)' }}>{item.desc}</div>
            </div>
          ))}
        </div>
        <Btn v="solid" ac={T.blue} onClick={() => setPhase('tour')} style={{ width: '100%', padding: 14 }}>Begin Onboarding →</Btn>
        <button onClick={() => navigate('/training')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: 12, cursor: 'pointer', marginTop: 14 }}>
          Skip to Training Portal
        </button>
      </div>
    </div>
  );

  // ── TOUR ─────────────────────────────────────────────────────────────────────
  if (phase === 'tour') {
    const step = TOUR_STEPS[tourStep];
    return (
      <div style={{ minHeight: '100vh', background: step.gradient, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, position: 'relative' }}>
        <Toast toast={toast} />
        {/* Keyboard hint */}
        <div style={{ position: 'absolute', top: 20, right: 20, fontSize: 11, color: 'rgba(255,255,255,.85)' }}>← → to navigate · Esc to skip</div>
        {/* Step count */}
        <div style={{ position: 'absolute', top: 20, left: 20, display: 'flex', gap: 6 }}>
          {TOUR_STEPS.map((_, i) => (
            <div key={i}
              role="button" tabIndex={0}
              aria-label={`Go to tour step ${i+1} of ${TOUR_STEPS.length}`}
              aria-current={i === tourStep ? 'step' : undefined}
              onClick={() => setTourStep(i)}
              onKeyDown={e => (e.key==='Enter'||e.key===' ') && (e.preventDefault(), setTourStep(i))}
              style={{ width: i === tourStep ? 24 : 8, height: 8, borderRadius: 4, background: i === tourStep ? '#fff' : 'rgba(255,255,255,.25)', cursor: 'pointer', transition: 'all .25s' }} />
          ))}
        </div>
        <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }} className="fade" key={tourStep}>
          <div style={{ width: 70, height: 70, borderRadius: 16, background: 'rgba(255,255,255,.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: 28, color: '#fff' }}>{step.icon}</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,.85)', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>{tourStep + 1} of {TOUR_STEPS.length}</div>
          <h2 style={{ fontSize: 26, fontWeight: 900, color: '#fff', letterSpacing: '-.025em', marginBottom: 12 }}>{step.title}</h2>
          <p style={{ color: 'rgba(255,255,255,.85)', fontSize: 15, lineHeight: 1.75, marginBottom: 32 }}>{step.desc}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            {tourStep > 0 && <Btn v="ghost" style={{ color:'rgba(255,255,255,.9)', border:'1px solid rgba(255,255,255,.25)' }} onClick={() => setTourStep(s => s - 1)}>← Back</Btn>}
            {tourStep < TOUR_STEPS.length - 1
              ? <Btn v="solid" ac="rgba(255,255,255,.9)" onClick={() => setTourStep(s => s + 1)} style={{ color: T.navy }}>Next →</Btn>
              : <Btn v="solid" ac="#fff" onClick={() => setPhase('track')} style={{ color: T.navy }}>Complete Tour →</Btn>
            }
          </div>
        </div>
      </div>
    );
  }

  // ── TRACK SELECTION ───────────────────────────────────────────────────────────
  if (phase === 'track') return (
    <div style={{ background: T.page, minHeight: '100vh' }}>
      <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif}.fade{animation:fu .22s ease both}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}.hcard{transition:box-shadow .18s,transform .18s}.hcard:hover{box-shadow:0 4px 16px rgba(15,32,68,.1);transform:translateY(-2px);cursor:pointer}`}</style>
      <Toast toast={toast} />
      <div style={{ maxWidth: 680, margin: '0 auto', padding: '60px 24px' }} className="fade">
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: T.blue, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 10 }}>Step 2 of 4</div>
          <h2 style={{ fontSize: 24, fontWeight: 900, color: T.ink, letterSpacing: '-.025em', marginBottom: 8 }}>Choose your learning track</h2>
          <p style={{ color: T.fog, fontSize: 13 }}>This determines which modules are in your onboarding curriculum. You can access all tracks in Training later.</p>
        </div>
        <div style={{ display: 'grid', gap: 12 }}>
          {Object.entries(TRACKS).map(([key, track]) => (
            <div key={key} className="hcard"
              role="radio" aria-checked={selectedTrack === key}
              tabIndex={0}
              onClick={() => setSelectedTrack(key)}
              onKeyDown={e => (e.key==='Enter'||e.key===' ') && (e.preventDefault(), setSelectedTrack(key))}
              style={{ background: T.white, border: `2px solid ${selectedTrack === key ? T.blue : T.border}`, borderRadius: 10, padding: '18px 20px', display: 'flex', gap: 14, alignItems: 'center' }}>
              <div style={{ fontSize: 26, flexShrink: 0 }}>{track.icon || '📚'}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, marginBottom: 3 }}>{track.name}</div>
                <div style={{ fontSize: 12, color: T.fog }}>{track.totalWeeks} weeks · {track.modules?.length} modules</div>
                {track.description && <div style={{ fontSize: 11, color: T.steel, marginTop: 4 }}>{track.description}</div>}
              </div>
              {selectedTrack === key && <span style={{ color: T.blue, fontSize: 20 }}>✓</span>}
            </div>
          ))}
        </div>
        <div style={{ marginTop: 24 }}>
          <Btn v="solid" ac={T.blue} disabled={!selectedTrack} onClick={() => setPhase('policies')} style={{ width: '100%', padding: 13 }}>
            Continue to Policies →
          </Btn>
        </div>
      </div>
    </div>
  );

  // ── POLICIES ─────────────────────────────────────────────────────────────────
  if (phase === 'policies') {
    const pol = POLICIES[polStep];
    const allDone = POLICIES.every(p => polsDone[p.id]);
    return (
      <div style={{ background: T.page, minHeight: '100vh' }}>
        <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif}.fade{animation:fu .22s ease both}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
        <Toast toast={toast} />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.blue, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>Step 3 of 4 — Mandatory Policies</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {POLICIES.map((p, i) => (
                <div key={p.id} onClick={() => setPolStep(i)} style={{ height: 6, flex: 1, borderRadius: 3, background: polsDone[p.id] ? T.greenL : i === polStep ? T.blue : T.silver, cursor: 'pointer', transition: 'background .2s' }} />
              ))}
            </div>
            <div style={{ fontSize: 11, color: T.fog }}>Policy {polStep + 1} of {POLICIES.length} · {pol.duration}</div>
          </div>

          <div style={{ background: T.white, border: `1px solid ${T.border}`, borderRadius: 10, padding: '28px 32px', marginBottom: 16 }} className="fade" key={pol.id}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}><Pill c={T.blue}>Mandatory</Pill><Pill c={T.fog}>{pol.duration}</Pill></div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: T.ink, marginBottom: 16 }}>{pol.title}</h2>
            <div style={{ maxHeight: 420, overflowY: 'auto', paddingRight: 8 }}>
              {pol.content.split('\n\n').map((para, i) => {
                if (para.match(/^\d\./)) return (
                  <div key={i} style={{ padding: '4px 0 4px 4px' }}>
                    {para.split('\n').map((l, j) => <p key={j} style={{ fontSize: 13, color: T.slate, lineHeight: 1.75, marginBottom: 4 }}>{l}</p>)}
                  </div>
                );
                if (para.startsWith('**') && para.endsWith('**')) return (
                  <div key={i} style={{ fontWeight: 700, fontSize: 14, color: T.ink, margin: '14px 0 6px' }}>{para.slice(2, -2)}</div>
                );
                return <p key={i} style={{ fontSize: 13, color: T.slate, lineHeight: 1.8, marginBottom: 10 }}>{para}</p>;
              })}
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            {polStep > 0 && <Btn v="ghost" sm onClick={() => setPolStep(s => s - 1)}>← Previous</Btn>}
            <div style={{ flex: 1 }} />
            {!polsDone[pol.id] ? (
              <Btn v="solid" ac={T.greenText} onClick={() => setPolsDone(d => ({ ...d, [pol.id]: true }))}>
                I have read and understood this policy ✓
              </Btn>
            ) : (
              polStep < POLICIES.length - 1
                ? <Btn v="solid" ac={T.blue} onClick={() => setPolStep(s => s + 1)}>Next Policy →</Btn>
                : <Btn v="solid" ac={T.greenText} onClick={() => setPhase('platform')}>All Policies Complete — Continue →</Btn>
            )}
          </div>
        </div>
      </div>
    );
  }

  // ── PLATFORM TASKS ────────────────────────────────────────────────────────────
  if (phase === 'platform') {
    const allDone = PLATFORM_TASKS.every(t => platDone[t.id]);
    return (
      <div style={{ background: T.page, minHeight: '100vh' }}>
        <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif}.fade{animation:fu .22s ease both}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
        <Toast toast={toast} />
        <div style={{ maxWidth: 600, margin: '0 auto', padding: '50px 24px' }} className="fade">
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: 10, fontWeight: 700, color: T.blue, letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 8 }}>Step 4 of 4 — Platform Setup</div>
            <h2 style={{ fontSize: 22, fontWeight: 800, color: T.ink, marginBottom: 6 }}>Complete these before starting</h2>
            <p style={{ color: T.fog, fontSize: 13 }}>Five tasks to get you ready. Check each off as you complete it.</p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {PLATFORM_TASKS.map(task => {
              const done = platDone[task.id];
              return (
                <div key={task.id} onClick={() => setPlatDone(d => ({ ...d, [task.id]: !d[task.id] }))}
                  style={{ background: T.white, border: `1.5px solid ${done ? T.greenText + '50' : T.border}`, borderRadius: 8, padding: '14px 18px', cursor: 'pointer', display: 'flex', gap: 14, alignItems: 'center', transition: 'border-color .2s' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', border: `2px solid ${done ? T.greenText : T.silver}`, background: done ? T.greenText : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all .2s' }}>
                    {done && <span style={{ color: '#fff', fontSize: 12 }}>✓</span>}
                  </div>
                  <span style={{ fontSize: 18, flexShrink: 0 }}>{task.icon}</span>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: done ? T.greenText : T.ink, textDecoration: done ? 'line-through' : 'none' }}>{task.title}</div>
                    <div style={{ fontSize: 11, color: T.fog, marginTop: 2 }}>{task.desc}</div>
                  </div>
                </div>
              );
            })}
          </div>
          <Btn v="solid" ac={T.blue} disabled={!allDone} onClick={() => setPhase('curriculum')} style={{ width: '100%', padding: 13 }}>
            {allDone ? 'Enter Curriculum →' : `Complete ${PLATFORM_TASKS.length - Object.keys(platDone).filter(k => platDone[k]).length} remaining tasks`}
          </Btn>
          <div style={{ textAlign: 'center', marginTop: 12 }}>
            <button onClick={() => setPhase('curriculum')} style={{ background: 'none', border: 'none', color: T.fog, fontSize: 12, cursor: 'pointer' }}>Skip for now</button>
          </div>
        </div>
      </div>
    );
  }

  // ── CURRICULUM ────────────────────────────────────────────────────────────────
  if (phase === 'curriculum') return (
    <div style={{ background: T.page, minHeight: '100vh' }}>
      <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif}.fade{animation:fu .22s ease both}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}.hcard{transition:box-shadow .18s,transform .18s}.hcard:hover{box-shadow:0 4px 16px rgba(15,32,68,.1);transform:translateY(-2px);cursor:pointer}.hrow{transition:background .12s}.hrow:hover{background:#F2F4F8!important}`}</style>
      <NavBar title={`${obTrack?.name || 'Onboarding'} Curriculum`} />
      <Toast toast={toast} />
      <div style={{ maxWidth: 940, margin: '0 auto', padding: '28px 24px' }} className="fade">

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
              <Pill c={trackColor}>{obTrack?.badge || 'Onboarding'}</Pill>
              <Pill c={T.tealText}>{obModsDone}/{obModIds.length} modules</Pill>
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 900, color: T.ink, letterSpacing: '-.03em', marginBottom: 4 }}>{obTrack?.name} Curriculum</h2>
            <p style={{ color: T.fog, fontSize: 13 }}>{obTrack?.totalWeeks} weeks · {obModIds.length} modules</p>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', flexWrap: 'wrap' }}>
            <div>
              <div style={{ fontSize: 11, color: T.fog, marginBottom: 4 }}>Overall Progress</div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                <div style={{ width: 100 }}><Bar pct={obPct} color={trackColor} h={8} /></div>
                <span style={{ fontWeight: 900, fontSize: 22, color: trackColor }}>{obPct}%</span>
              </div>
            </div>
            <Btn v="ghost" sm onClick={() => setShowChecklist(c => !c)}>Checklist</Btn>
            <Btn v="solid" ac={T.blue} sm onClick={() => navigate('/training')}>Training Portal →</Btn>
          </div>
        </div>

        {/* Checklist sidebar */}
        {showChecklist && (
          <>
            <div onClick={() => setShowChecklist(false)} style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(10,20,44,.3)' }} />
            <div style={{ position: 'fixed', right: 0, top: 0, bottom: 0, zIndex: 95, width: 340, background: T.white, boxShadow: '-4px 0 32px rgba(15,32,68,.12)', overflow: 'auto' }}>
              <div style={{ padding: 24 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ fontWeight: 800, fontSize: 15, color: T.ink }}>Onboarding Progress</div>
                  <button onClick={() => setShowChecklist(false)} aria-label="Close checklist" style={{ background: 'none', border: 'none', color: T.fog, fontSize: 18, cursor: 'pointer' }}>×</button>
                </div>
                <Bar pct={obPct} color={trackColor} h={6} />
                <div style={{ fontSize: 11, color: T.fog, textAlign: 'right', marginTop: 3, marginBottom: 16 }}>{obPct}% complete</div>
                {[
                  { title: 'Policies', items: POLICIES.map(p => ({ id: p.id, label: p.title, done: !!polsDone[p.id] })) },
                  { title: 'Platform', items: PLATFORM_TASKS.map(s => ({ id: s.id, label: s.title, done: !!platDone[s.id] })) },
                  { title: `${obTrack?.name} Modules`, items: obModIds.map(id => { const m = TC_MODULES[id]; return { id, label: m?.title || id, done: !!modProg[id]?.quizDone }; }) },
                ].map(section => (
                  <div key={section.title} style={{ marginBottom: 16 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color: T.fog, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 8 }}>{section.title}</div>
                    {section.items.map(item => (
                      <div key={item.id} style={{ display: 'flex', gap: 10, padding: '7px 10px', borderRadius: 6, marginBottom: 3 }}>
                        <span style={{ color: item.done ? T.greenText : T.fog, fontSize: 12 }}>{item.done ? '✓' : '○'}</span>
                        <span style={{ fontSize: 12, color: item.done ? T.greenText : T.steel }}>{item.label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Module cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 14, marginBottom: 24 }}>
          {obModIds.map(id => {
            const mod = TC_MODULES[id];
            if (!mod) return null;
            const done = modProg[id]?.quizDone;
            return (
              <div key={id} className="hcard"
                role="button" tabIndex={0}
                onClick={() => { setActiveModId(id); setPhase('module'); }}
                onKeyDown={e => (e.key==='Enter'||e.key===' ') && (e.preventDefault(), setActiveModId(id), setPhase('module'))}
                aria-label={`Open module: ${mod.title}`}
                style={{ background: T.white, border: `1px solid ${done ? T.greenText + '40' : T.border}`, borderRadius: 8, padding: 18 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <Pill c={done ? T.greenText : trackColor}>{done ? 'Done' : `Wk ${mod.week}`}</Pill>
                  <span style={{ fontSize: 11, color: T.fog }}>{mod.mins} min</span>
                </div>
                <div style={{ fontWeight: 700, fontSize: 13, color: T.ink, lineHeight: 1.45, marginBottom: 4 }}>{mod.title}</div>
                <div style={{ fontSize: 11, color: T.fog }}>{mod.num} module · Week {mod.week}</div>
              </div>
            );
          })}
        </div>

        {/* Company document upload */}
        <Card style={{ padding: 22, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, marginBottom: 8 }}>Upload Company Documents</div>
          <p style={{ fontSize: 12, color: T.fog, marginBottom: 14 }}>Upload your organisation SOPs, policies, or procedures. AI generates a bespoke training module.</p>
          <label style={{ cursor: 'pointer' }}>
            <input type="file" accept=".pdf,.docx,.txt" onChange={handleDocUpload} style={{ display: 'none' }} disabled={uploading} />
            <Btn v="primary" ac={T.goldText} sm disabled={uploading}>{uploading ? 'Generating…' : '+ Upload Document'}</Btn>
          </label>
          {genMods.map((mod, i) => (
            <div key={i} style={{ marginTop: 12, padding: '10px 14px', background: `${T.gold}08`, border: `1px solid ${T.gold}25`, borderRadius: 7 }}>
              <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}><Pill c={T.goldText} sm>Generated</Pill></div>
              <div style={{ fontWeight: 600, fontSize: 13, color: T.ink }}>{mod.moduleTitle || mod.title}</div>
              <div style={{ fontSize: 11, color: T.fog }}>{mod.quizCount || 5} quiz questions generated</div>
            </div>
          ))}
        </Card>

        {/* Assignment */}
        {obTrack && ASSIGNMENTS[obTrack.assignment] && (
          <Card style={{ padding: 22, border: `1px solid ${trackColor}20` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
              <div>
                <div style={{ display: 'flex', gap: 6, marginBottom: 6 }}><Pill c={trackColor}>Practice Assignment</Pill></div>
                <div style={{ fontWeight: 700, fontSize: 14, color: T.ink }}>{ASSIGNMENTS[obTrack.assignment].title}</div>
                <div style={{ fontSize: 11, color: T.fog, marginTop: 2 }}>{ASSIGNMENTS[obTrack.assignment].time} · {ASSIGNMENTS[obTrack.assignment].words}</div>
              </div>
              {asgmtFb
                ? <Pill c={T.greenText}>Submitted ✓</Pill>
                : <Btn v="solid" ac={trackColor} sm onClick={() => setPhase('assignment')}>Open Assignment →</Btn>
              }
            </div>
          </Card>
        )}

        {/* Training CTA */}
        {obPct >= 60 && (
          <div className="fade" style={{ background: `linear-gradient(135deg,${T.navyM},${T.navy})`, borderRadius: 10, padding: '22px 26px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16, marginTop: 16 }}>
            <div>
              <div style={{ fontWeight: 800, fontSize: 15, color: '#fff', marginBottom: 4 }}>
                {obPct >= 100 ? 'Onboarding complete' : 'Training Portal is ready'}
              </div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,.7)' }}>
                {obPct >= 100 ? 'All tasks done. Six career tracks await.' : `${obPct}% complete · continue in Training Portal`}
              </div>
            </div>
            <Btn v="solid" ac={T.goldSolid} onClick={() => navigate('/training')}>Enter Training Portal →</Btn>
          </div>
        )}
      </div>
    </div>
  );

  // ── MODULE VIEW ───────────────────────────────────────────────────────────────
  if (phase === 'module' && currentMod) return (
    <div style={{ background: T.page, minHeight: '100vh' }}>
      <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif}.fade{animation:fu .22s ease both}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
      <NavBar title={currentMod.title} />
      <Toast toast={toast} />
      <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px' }} className="fade">
        <button onClick={() => setPhase('curriculum')} style={{ background: 'none', border: 'none', color: T.fog, fontSize: 12, cursor: 'pointer', marginBottom: 14 }}>← Back to curriculum</button>
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          <Pill c={trackColor}>Week {currentMod.week}</Pill>
          <Pill c={T.fog}>{currentMod.mins} min</Pill>
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: T.ink, marginBottom: 16 }}>{currentMod.title}</h2>
        <Card style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ fontSize: 14, color: T.slate, lineHeight: 1.85, whiteSpace: 'pre-wrap' }}>{currentMod.content}</div>
        </Card>
        <Btn v="solid" ac={T.greenText} onClick={() => {
          setModProg(p => ({ ...p, [activeModId]: { ...p[activeModId], quizDone: true } }));
          notify('Module complete ✓ Progress saved');
          setPhase('curriculum');
        }}>Mark Module Complete ✓</Btn>
      </div>
    </div>
  );

  // ── ASSIGNMENT ────────────────────────────────────────────────────────────────
  if (phase === 'assignment' && obTrack) {
    const asgmt = ASSIGNMENTS[obTrack.assignment];
    return (
      <div style={{ background: T.page, minHeight: '100vh' }}>
        <style>{`*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}body{font-family:system-ui,sans-serif}.fade{animation:fu .22s ease both}@keyframes fu{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:none}}`}</style>
        <NavBar title="Practice Assignment" />
        <Toast toast={toast} />
        <div style={{ maxWidth: 720, margin: '0 auto', padding: '28px 24px' }} className="fade">
          <button onClick={() => setPhase('curriculum')} style={{ background: 'none', border: 'none', color: T.fog, fontSize: 12, cursor: 'pointer', marginBottom: 14 }}>← Back</button>
          <Card style={{ padding: 28 }}>
            <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}><Pill c={trackColor}>Assignment</Pill><Pill c={T.fog}>{asgmt.time}</Pill></div>
            <h2 style={{ fontWeight: 800, fontSize: 18, color: T.ink, marginBottom: 14 }}>{asgmt.title}</h2>
            <div style={{ background: T.off, border: `1px solid ${T.border}`, borderRadius: 7, padding: 16, marginBottom: 20 }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: T.fog, letterSpacing: '.09em', textTransform: 'uppercase', marginBottom: 8 }}>Brief</div>
              <div style={{ fontSize: 13, color: T.slate, lineHeight: 1.85 }}>{asgmt.brief}</div>
            </div>
            {!asgmtFb ? (
              <>
                <textarea rows={10} value={asgmtText} onChange={e => setAsgmtText(e.target.value)} disabled={asgmtLoading}
                  placeholder="Write your response here..."
                  style={{ width: '100%', background: T.white, border: `1px solid ${T.borderH || T.border}`, borderRadius: 7, padding: 14, fontSize: 14, resize: 'vertical', lineHeight: 1.7, outline: 'none', color: T.ink, marginBottom: 12 }} />
                <Btn v="solid" ac={T.blue} disabled={asgmtLoading || asgmtText.length < 100}
                  onClick={async () => {
                    setAsgmtLoading(true);
                    try {
                      const resp = await fetch('/api/quiz/short-answer', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('sp_at')}` },
                        body: JSON.stringify({ question: asgmt.title, answer: asgmtText, rubric: asgmt.brief }),
                      });
                      const d = await resp.json();
                      setAsgmtFb(d.feedback || 'Submitted for review.');
                      notify('Assignment submitted ✓');
                    } catch {
                      setAsgmtFb('Submitted. Your assessor will review within 3 working days.');
                    } finally {
                      setAsgmtLoading(false);
                    }
                  }}>
                  {asgmtLoading ? 'Reviewing…' : 'Submit Assignment'}
                </Btn>
              </>
            ) : (
              <div>
                <div style={{ background: `${T.greenL}08`, border: `1px solid ${T.greenL}25`, borderRadius: 8, padding: 16, marginBottom: 14, fontSize: 13, color: T.slate, lineHeight: 1.75 }}>
                  <div style={{ fontWeight: 700, color: T.greenText, marginBottom: 6 }}>Assignment submitted ✓</div>
                  {asgmtFb}
                </div>
                <Btn v="solid" ac={T.blue} sm onClick={() => setPhase('curriculum')}>← Return to Curriculum</Btn>
              </div>
            )}
          </Card>
        </div>
      </div>
    );
  }

  return null;
}
