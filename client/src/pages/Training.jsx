import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useProgress } from '../hooks/useProgress.jsx';
import { useLang } from '../hooks/useLang.jsx';
import { CURRICULUM } from '../data/curriculum.js';
import { SOC_SIMULATIONS } from '../data/simulations.js';
import { SOP_LIBRARY } from '../data/sops.js';
import { QUIZZES } from '../data/quizzes.js';
import { EXTENDED_QUIZZES } from '../data/extendedQuizzes.js';
import { HOOK_SCENARIOS } from '../data/hookScenarios.js';
import { ASSESSMENT_RUBRICS } from '../data/assessmentRubrics.js';
import { T } from '../data/tokens.js';
import { Btn, Card, Bar, Pill, Avatar, Divider, Spinner } from '../components/atoms/index.jsx';
import NavBar from '../components/layout/NavBar.jsx';
import Toast from '../components/layout/Toast.jsx';
import api, { assessAPI, quizAPI, progressAPI } from '../lib/api.js';

// ── HELPERS ──────────────────────────────────────────────────────────────────
function Md({ text }) {
  if (!text) return null;
  const parse = str => {
    const parts=[]; let last=0;
    const re=/\*\*([^*]+)\*\*|`([^`]+)`/g; let m;
    while((m=re.exec(str))!==null){
      if(m.index>last)parts.push(str.slice(last,m.index));
      if(m[1])parts.push(<strong key={m.index} style={{color:T.ink,fontWeight:600}}>{m[1]}</strong>);
      else parts.push(<code key={m.index} style={{background:T.off,border:`1px solid ${T.border}`,padding:'1px 4px',borderRadius:3,fontSize:12,color:T.teal,fontFamily:'monospace'}}>{m[2]}</code>);
      last=m.index+m[0].length;
    }
    if(last<str.length)parts.push(str.slice(last));
    return parts.length?parts:str;
  };
  const lines=text.split('\n'); const els=[]; let tbl=[],inTbl=false;
  const flush=k=>{ if(!tbl.length)return; const hdr=tbl[0].split('|').slice(1,-1).map(c=>c.trim()); const body=tbl.slice(2).filter(r=>r.trim()&&!r.match(/^\|[-\s|]+\|$/));
    els.push(<div key={k} style={{overflowX:'auto',marginBottom:12}}><table style={{width:'100%',borderCollapse:'collapse',fontSize:13}}><thead><tr>{hdr.map((c,i)=><th key={i} style={{background:T.off,padding:'6px 10px',textAlign:'left',borderBottom:`2px solid ${T.border}`,fontWeight:600,color:T.steel,fontSize:11,textTransform:'uppercase'}}>{c}</th>)}</tr></thead><tbody>{body.map((row,ri)=>{const cells=row.split('|').slice(1,-1);return<tr key={ri}>{cells.map((c,ci)=><td key={ci} style={{padding:'7px 10px',borderBottom:`1px solid ${T.border}`,color:T.slate,verticalAlign:'top'}}>{parse(c.trim())}</td>)}</tr>})}</tbody></table></div>);
    tbl=[];inTbl=false;
  };
  lines.forEach((line,i)=>{
    if(line.startsWith('|')){inTbl=true;tbl.push(line);return;} if(inTbl)flush(`t${i}`);
    if(line.startsWith('## '))els.push(<h2 key={i} style={{fontSize:16,fontWeight:700,margin:'18px 0 8px',color:T.ink}}>{parse(line.slice(3))}</h2>);
    else if(line.startsWith('### '))els.push(<h3 key={i} style={{fontSize:14,fontWeight:600,margin:'14px 0 6px',color:T.slate}}>{parse(line.slice(4))}</h3>);
    else if(line.startsWith('- ')||line.startsWith('* '))els.push(<div key={i} style={{display:'flex',gap:8,padding:'3px 0'}}><span style={{color:T.blue,flexShrink:0,marginTop:3,fontSize:10}}>◆</span><span style={{fontSize:14,color:T.slate,lineHeight:1.8}}>{parse(line.slice(2))}</span></div>);
    else if(line==='---')els.push(<div key={i} style={{height:1,background:T.border,margin:'14px 0'}}/>);
    else if(line.trim())els.push(<p key={i} style={{fontSize:14,color:T.slate,lineHeight:1.85,marginBottom:8}}>{parse(line)}</p>);
  });
  if(inTbl)flush('tf');
  return <div>{els}</div>;
}

// ── QUIZ QUESTION COMPONENT ──────────────────────────────────────────────────
function QuizQuestion({ q, idx, onMCQ, onAdvance, feedback, shortAns, setShortAns, shortResult, setShortResult, matchState, setMatchState }) {
  const [shortLoading, setShortLoading] = useState(false);

  if (q.type === 'mcq' || q.type === 'scenario') {
    return (
      <div>
        {q.type === 'scenario' && (
          <div className="hook-box" style={{ marginBottom:16 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.goldL, letterSpacing:'.09em', textTransform:'uppercase', marginBottom:8 }}>Scenario</div>
            <div style={{ fontSize:13, lineHeight:1.8, color:'rgba(255,255,255,.85)' }}>{q.q}</div>
          </div>
        )}
        <p style={{ fontSize:q.type==='scenario'?14:15, fontWeight:600, color:T.ink, lineHeight:1.7, marginBottom:16 }}>
          {q.type==='scenario' ? q.sub : q.q}
        </p>
        <div role="radiogroup" aria-label="Answer options">
        {q.options.map((opt, i) => {
          let cls = 'qopt';
          if (feedback) {
            if (i === feedback.correctIdx) cls += ' correct';
            else if (i === feedback.chosen && !feedback.correct) cls += ' wrong';
          }
          return (
            <div key={i} className={cls}
              role="radio"
              aria-checked={feedback?.chosen === i}
              tabIndex={feedback ? -1 : 0}
              onClick={() => !feedback && onMCQ(i)}
              onKeyDown={e => { if (!feedback && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); onMCQ(i); } }}
              style={{ padding:'13px 16px', borderRadius:7, border:`1.5px solid ${T.border}`, cursor:feedback?'default':'pointer', marginBottom:10, fontSize:13, background:T.white, lineHeight:1.55, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span><span style={{ color:T.fog, marginRight:10, fontSize:11, fontWeight:700, fontFamily:'monospace' }}>{String.fromCharCode(65+i)}.</span>{opt}</span>
              {feedback && i===feedback.correctIdx && <span style={{ fontSize:14, color:T.greenText }}>✓</span>}
              {feedback && i===feedback.chosen && !feedback.correct && <span style={{ fontSize:14, color:T.redText }}>✗</span>}
            </div>
          );
        })}
        </div>
        {feedback && !feedback.correct && (
          <div className="fade" style={{ padding:'10px 14px', background:`${T.greenL}0A`, border:`1px solid ${T.greenL}25`, borderRadius:7, fontSize:13, color:T.green, marginTop:4, lineHeight:1.65 }}>
            <strong>Correct answer:</strong> {q.options[feedback.correctIdx]}
            {q.explanation && <div style={{ marginTop:6, fontSize:12, color:T.steel }}>{q.explanation}</div>}
          </div>
        )}
        {feedback && feedback.correct && q.explanation && (
          <div className="fade" style={{ padding:'10px 14px', background:`${T.blue}08`, border:`1px solid ${T.blue}15`, borderRadius:7, fontSize:12, color:T.steel, marginTop:4 }}>
            {q.explanation}
          </div>
        )}
      </div>
    );
  }

  if (q.type === 'short_answer') {
    return (
      <div>
        <p style={{ fontSize:15, fontWeight:600, color:T.ink, lineHeight:1.7, marginBottom:6 }}>{q.q}</p>
        <div style={{ fontSize:11, color:T.fog, marginBottom:12, fontStyle:'italic' }}>Type your answer. AI will review it. (min {q.minWords} words)</div>
        {!shortResult ? (
          <>
            <textarea rows={5} value={shortAns} onChange={e => setShortAns(e.target.value)} disabled={shortLoading}
              placeholder="Write your answer in full sentences..."
              style={{ width:'100%', background:T.white, border:`1.5px solid ${T.borderH}`, borderRadius:7, padding:14, fontSize:14, resize:'vertical', lineHeight:1.7, outline:'none', color:T.ink, marginBottom:10 }}/>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <span style={{ fontSize:11, color:shortAns.split(' ').filter(Boolean).length>=(q.minWords||10)?T.greenText:T.fog }}>
                {shortAns.split(' ').filter(Boolean).length} words {shortAns.split(' ').filter(Boolean).length < (q.minWords||10) ? `(need ${q.minWords})` : '✓'}
              </span>
              <Btn v="solid" ac={T.blue} disabled={shortLoading || shortAns.split(' ').filter(Boolean).length < (q.minWords||10)}
                onClick={async () => {
                  setShortLoading(true);
                  try {
                    const result = await quizAPI.gradeShortAnswer({ question:q.q, rubric:q.rubric||'', answer:shortAns, minWords:q.minWords||10, questionIdx:idx, moduleId:'quiz' });
                    setShortResult(result);
                    if (!result.pass) flagSpaced('quiz', idx, q.q).catch(()=>{});
                  } catch { setShortResult({ score:65, pass:true, feedback:'Saved for assessor review.', strength:'Response recorded.', gap:'' }); }
                  setShortLoading(false);
                }}>
                {shortLoading ? 'AI reviewing...' : 'Submit Answer'}
              </Btn>
            </div>
          </>
        ) : (
          <div className="fade">
            <div style={{ background:shortResult.pass?`${T.greenL}08`:`${T.amber}08`, border:`1px solid ${shortResult.pass?T.greenL:T.amber}25`, borderRadius:8, padding:16, marginBottom:12 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                <div style={{ fontWeight:700, fontSize:14, color:shortResult.pass?T.greenText:T.amberText }}>{shortResult.pass ? '✓ Accepted' : '△ Needs work'}</div>
                <div style={{ fontWeight:800, fontSize:18, color:shortResult.pass?T.greenText:T.amberText }}>{shortResult.score}%</div>
              </div>
              <div style={{ fontSize:13, color:T.slate, lineHeight:1.7, marginBottom:6 }}><strong>Feedback:</strong> {shortResult.feedback}</div>
              {shortResult.strength && <div style={{ fontSize:12, color:T.green, marginBottom:3 }}>+ {shortResult.strength}</div>}
              {shortResult.gap && <div style={{ fontSize:12, color:T.amberText }}>△ {shortResult.gap}</div>}
            </div>
            <Btn v="solid" ac={T.blue} sm onClick={() => onAdvance(shortResult.pass ? 1 : 0)}>Next Question →</Btn>
          </div>
        )}
      </div>
    );
  }

  if (q.type === 'matching') {
    const pairs = q.pairs || [];
    const rights = useMemo(() => [...pairs.map(p => p.right)].sort(() => Math.random() - .5), []);
    return (
      <div>
        <p style={{ fontSize:15, fontWeight:600, color:T.ink, lineHeight:1.7, marginBottom:16 }}>{q.q}</p>
        <div className="sp-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:16 }}>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Item</div>
            {pairs.map((p, i) => (
              <div key={i} style={{ padding:'10px 14px', background:T.off, border:`1px solid ${T.border}`, borderRadius:6, fontSize:13, color:T.ink, marginBottom:6, minHeight:44, display:'flex', alignItems:'center' }}>{p.left}</div>
            ))}
          </div>
          <div>
            <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Match</div>
            {pairs.map((p, i) => (
              <select key={i} value={matchState[i]||''} onChange={e => setMatchState(m => ({...m,[i]:e.target.value}))}
                disabled={!!feedback} aria-label={`Match for: ${p.left}`}
                style={{ width:'100%', padding:'10px 12px', background:T.white, border:`1.5px solid ${feedback ? (matchState[i]===p.right?T.greenL:T.redL) : T.borderH}`, borderRadius:6, fontSize:12, color:T.ink, marginBottom:6, outline:'none', cursor:'pointer', minHeight:44 }}>
                <option value="">-- Select --</option>
                {rights.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            ))}
          </div>
        </div>
        {!feedback && (
          <Btn v="solid" ac={T.purple} disabled={pairs.some((_,i) => !matchState[i])}
            onClick={() => {
              const correct = pairs.filter((p,i) => matchState[i] === p.right).length;
              const score = Math.round(correct/pairs.length*100);
              const pass = score >= 75;
              if (!pass) flagSpaced('quiz', idx, q.q).catch(()=>{});
              // Simulate feedback then advance
              setTimeout(() => onAdvance(pass ? 1 : 0), 1000);
            }}>Check Matches</Btn>
        )}
      </div>
    );
  }

  return <div style={{ color:T.fog, fontSize:13 }}>Unsupported question type: {q.type}</div>;
}

// ── MAIN TRAINING PAGE ────────────────────────────────────────────────────────
export default function TrainingPage() {
  const { user } = useAuth();
  const { progress, bookmarks, spacedDue: spacedItems, syncing,
          markSection, passQuiz, saveHookResponse: saveHook, saveNotes,
          toggleBookmark, flagSpaced, resolveSpaced,
          trackPct, calcXP } = useProgress();
  const xp = calcXP();
  const overallPct = Math.round(
    CURRICULUM.reduce((sum, tr) => sum + trackPct(tr), 0) / CURRICULUM.length
  );
  const { t } = useLang();
  const navigate = useNavigate();

  // Navigation state
  const [screen, setScreen] = useState('home'); // home|track|module|quiz|assessment|certificates|portfolio|spaced|sims|sim|sop-lib|sop-detail
  const [activeTrack, setActiveTrack] = useState(null);
  const [activeMod, setActiveMod] = useState(null);
  const [activeSec, setActiveSec] = useState(null);
  const [activeSop, setActiveSop] = useState(null);
  const [simState, setSimState] = useState(null);

  // Toast
  const [toast, setToast] = useState(null);
  const notify = (msg, type='ok') => { setToast({msg,type}); };

  // Quiz state
  const [quizState, setQuizState] = useState(null);
  const [qFeedback, setQFeedback] = useState(null);
  const [shortAns, setShortAns] = useState('');
  const [shortResult, setShortResult] = useState(null);
  const [matchState, setMatchState] = useState({});

  // Hook scenario
  const [hookResp, setHookResp] = useState('');
  const [hookSubmitted, setHookSubmitted] = useState(false);

  // Timer
  const [timerSecs, setTimerSecs] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const timerRef = useRef(null);
  useEffect(() => {
    if (timerRunning) timerRef.current = setInterval(() => setTimerSecs(s=>s+1), 1000);
    else clearInterval(timerRef.current);
    return () => clearInterval(timerRef.current);
  }, [timerRunning]);
  const fmtTime = s => `${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;

  // Assessment
  const [assessText, setAssessText] = useState('');
  const [assessResult, setAssessResult] = useState(null);
  const [assessLoading, setAssessLoading] = useState(false);

  // Simulation
  const [simResp, setSimResp] = useState('');
  const [simFb, setSimFb] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Portfolio & certs
  const [portfolio, setPortfolio] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Load portfolio and certs
  useEffect(() => {
    if (!user) return;
    assessAPI.getPortfolio().then(d => setPortfolio(d.entries || [])).catch(()=>{});
    assessAPI.getCertificates().then(d => setCertificates(d.certificates || [])).catch(()=>{});
  }, [user?.id]);

  // Milestone effect
  useEffect(() => {
    const total = Object.values(progress).reduce((n, mp) =>
      n + Object.values(mp.sections||{}).filter(Boolean).length, 0);
    if (total === 1) notify('🎯 First section complete! +25 XP');
    const ovr = overallPct;
    if (ovr === 25) notify('🚀 25% complete!');
    if (ovr === 50) notify('⭐ Halfway — 50% complete!');
    if (ovr === 75) notify('💪 75% — final stretch!');
  }, [progress]);

  // Search
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  useEffect(() => {
    const h = e => {
      if ((e.metaKey||e.ctrlKey) && e.key==='k') { e.preventDefault(); setSearchOpen(o=>!o); }
      if (e.key==='Escape') setSearchOpen(false);
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);
  const searchResults = useMemo(() => {
    if (!searchQ.trim() || searchQ.length < 2) return [];
    const q = searchQ.toLowerCase();
    const hits = [];
    CURRICULUM.forEach(tr => {
      tr.modules.forEach(m => {
        if (m.title.toLowerCase().includes(q) || m.topics?.some(tp => tp.toLowerCase().includes(q)))
          hits.push({ type:'module', title:m.title, sub:`${tr.title} · Week ${m.week}`, track:tr, mod:m });
        m.sections?.forEach(s => {
          if (s.title.toLowerCase().includes(q) || s.content?.toLowerCase().includes(q))
            hits.push({ type:'section', title:s.title, sub:m.title, track:tr, mod:m, sec:s });
        });
      });
    });
    Object.values(SOP_LIBRARY).forEach(sop => {
      if (sop.title.toLowerCase().includes(q) || sop.summary?.toLowerCase().includes(q))
        hits.push({ type:'sop', title:sop.title, sub:`SOP · ${sop.category}`, sop });
    });
    return hits.slice(0, 8);
  }, [searchQ]);

  // Quiz logic
  const getQs = modId => EXTENDED_QUIZZES[modId]?.questions || QUIZZES[modId]?.questions || [];
  const startQuiz = mod => {
    const qs = getQs(mod.id);
    if (!qs.length) { notify('No quiz for this module yet', 'warn'); return; }
    setQuizState({ modId:mod.id, questions:qs, current:0, answers:[], score:null, passed:false });
    setQFeedback(null); setShortAns(''); setShortResult(null); setMatchState({});
    setScreen('quiz');
  };

  const answerMCQ = idx => {
    if (qFeedback) return;
    const q = quizState.questions[quizState.current];
    const correct = idx === q.answer;
    setQFeedback({ chosen:idx, correct, correctIdx:q.answer });
    if (!correct) flagSpaced(quizState.modId, quizState.current, q.q).catch(()=>{});
    setTimeout(() => { setQFeedback(null); advanceQuiz(idx); }, 1200);
  };

  const advanceQuiz = ans => {
    const newAns = [...quizState.answers, ans];
    if (quizState.current + 1 < quizState.questions.length) {
      setQuizState(s => ({...s, current:s.current+1, answers:newAns}));
      setShortAns(''); setShortResult(null); setMatchState({});
    } else {
      const mcqQs = quizState.questions.filter(q => q.type==='mcq'||q.type==='scenario');
      const correct = newAns.filter((a,i) => {
        const q = quizState.questions[i];
        return (q.type==='mcq'||q.type==='scenario') && a === q.answer;
      }).length;
      const score = mcqQs.length > 0 ? Math.round(correct/mcqQs.length*100) : 75;
      const passed = score >= 80;
      if (passed) {
        passQuiz(quizState.modId, activeTrack?.id, score);
        notify(`${score===100?'💫 Perfect!':'✓ Quiz passed!'} +${100+(score===100?50:0)} XP`);
      }
      setQuizState(s => ({...s, answers:newAns, score, passed}));
    }
  };

  // NavBar title
  const navTitle = {
    home: t('train_dashboard'), track:activeTrack?.title, module:activeMod?.title,
    quiz:'Quiz', assessment:'Track Assessment', certificates:t('certs'),
    portfolio:t('portfolio_title'), spaced:'Review Due', sims:'SOC Simulations',
    sim:simState?.title, 'sop-lib':'SOP Library', 'sop-detail':activeSop?.title,
  }[screen] || 'Training';

  return (
    <div style={{ background:T.page, minHeight:'100vh' }}>
      <NavBar title={navTitle}/>
      <Toast message={toast?.msg} type={toast?.type} onDismiss={() => setToast(null)}/>

      {/* Search overlay */}
      {searchOpen && (
        <div style={{ position:'fixed', inset:0, zIndex:300, background:'rgba(10,20,44,.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'flex-start', justifyContent:'center', padding:'80px 20px' }} onClick={() => setSearchOpen(false)}>
          <div style={{ width:'100%', maxWidth:580, background:T.white, borderRadius:12, boxShadow:T.shadowL, overflow:'hidden' }} onClick={e => e.stopPropagation()}>
            <div style={{ display:'flex', alignItems:'center', gap:10, padding:'14px 18px', borderBottom:`1px solid ${T.border}` }}>
              <span style={{ fontSize:18 }}>🔍</span>
              <input autoFocus value={searchQ} onChange={e => setSearchQ(e.target.value)} placeholder="Search modules, SOPs, simulations..."
                style={{ flex:1, border:'none', outline:'none', fontSize:15, color:T.ink, background:'transparent' }}/>
              <button onClick={() => setSearchOpen(false)} aria-label="Close search" style={{ background:'none', border:'none', color:T.fog, fontSize:18, cursor:'pointer' }}>×</button>
            </div>
            {searchResults.length > 0 ? searchResults.map((r, i) => (
              <div key={i} className="hrow" onClick={() => {
                if (r.sop) { setActiveSop(r.sop); setScreen('sop-detail'); }
                else if (r.track && r.mod) { setActiveTrack(r.track); setActiveMod(r.mod); setActiveSec(r.sec||r.mod.sections?.[0]); setScreen('module'); }
                setSearchOpen(false); setSearchQ('');
              }} style={{ display:'flex', gap:12, padding:'11px 18px', borderBottom:`1px solid ${T.border}`, cursor:'pointer' }}>
                <span style={{ fontSize:16 }}>{r.type==='module'?'📖':r.type==='section'?'◆':r.type==='sop'?'📋':'🎮'}</span>
                <div><div style={{ fontSize:13, fontWeight:600, color:T.ink }}>{r.title}</div><div style={{ fontSize:11, color:T.fog }}>{r.sub}</div></div>
                <div style={{ marginLeft:'auto' }}><Pill c={r.track?.accentText||T.blue} sm>{r.type}</Pill></div>
              </div>
            )) : searchQ.length >= 2 ? (
              <div style={{ padding:24, textAlign:'center', color:T.fog, fontSize:13 }}>No results for "{searchQ}"</div>
            ) : (
              <div style={{ padding:'14px 18px' }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.09em', textTransform:'uppercase', marginBottom:8 }}>Quick Access</div>
                {['GDPR Compliance Gate','PEACE Interview','MITRE ATT&CK','ACH Analysis','ASCONE Retail Arrest'].map(k => (
                  <div key={k} className="hrow"
                    role="button" tabIndex={0}
                    onClick={() => setSearchQ(k)}
                    onKeyDown={e => (e.key==='Enter'||e.key===' ') && (e.preventDefault(), setSearchQ(k))}
                    aria-label={`Search for: ${k}`}
                    style={{ padding:'8px 10px', borderRadius:6, cursor:'pointer', fontSize:13, color:T.steel }}>🕐 {k}</div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <main className="sp-main" style={{ maxWidth:1100, margin:'0 auto', padding:'24px 20px' }}>

        {/* ── HOME ── */}
        {screen === 'home' && (
          <div className="fade">
            {/* Header */}
            <div style={{ background:T.navyM, borderRadius:10, padding:'18px 22px', marginBottom:20, display:'flex', gap:18, alignItems:'center', flexWrap:'wrap' }}>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'.09em', textTransform:'uppercase', marginBottom:4 }}>{t('train_dashboard')}</div>
                <div style={{ fontWeight:800, fontSize:16, color:'#fff', marginBottom:8 }}>{t('train_welcome')}, {user?.name?.split(' ')[0]}</div>
                <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                  <span style={{ fontSize:12, fontWeight:700, color:'#fff', background:`${T.gold}30`, border:`1px solid ${T.gold}50`, padding:'3px 10px', borderRadius:12 }}>⚡ {xp.toLocaleString()} XP</span>
                  {user?.streak > 0 && <span style={{ fontSize:12, fontWeight:700, color:'#FF9955', background:'#FF6B2218', border:'1px solid #FF6B2225', padding:'3px 10px', borderRadius:12 }}>🔥{user.streak}d streak</span>}
                  {certificates.length > 0 && <span role="button" tabIndex={0} onClick={() => setScreen('certificates')} onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&(e.preventDefault(),setScreen('certificates'))} aria-label={`${certificates.length} certificate${certificates.length>1?'s':''} — view`} style={{ fontSize:12, fontWeight:700, color:'#fff', background:`${T.gold}25`, border:`1px solid ${T.gold}40`, padding:'3px 10px', borderRadius:12, cursor:'pointer' }}>🏆{certificates.length} cert{certificates.length>1?'s':''}</span>}
                  {spacedItems.length > 0 && <span className="spaced-chip" role="button" tabIndex={0} onClick={() => setScreen('spaced')} onKeyDown={e=>(e.key==='Enter'||e.key===' ')&&(e.preventDefault(),setScreen('spaced'))} aria-label={`${spacedItems.length} review${spacedItems.length>1?'s':''} due`} style={{ cursor:'pointer' }}>🔁 {spacedItems.length} review{spacedItems.length>1?'s':''} due</span>}
                  <span style={{ fontSize:12, color:'rgba(255,255,255,.7)' }}>{overallPct}% overall</span>
                </div>
              </div>
              <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                {(() => {
                  const inProg = CURRICULUM.find(tr => { const p=trackPct(tr); return p>0&&p<80; });
                  const nextUp = CURRICULUM.find(tr => trackPct(tr)===0);
                  const target = inProg || nextUp;
                  return target ? <Btn v="solid" ac={target.accentSolid} sm onClick={() => { setActiveTrack(target); setScreen('track'); }}>{inProg?t('train_continue'):t('train_start')} {target.code} →</Btn> : null;
                })()}
                <Btn v="ghost" sm onClick={() => setShowLeaderboard(s=>!s)}>🏆</Btn>
                {portfolio.length > 0 && <Btn v="ghost" sm onClick={() => setScreen('portfolio')}>📂</Btn>}
                {certificates.length > 0 && <Btn v="ghost" sm onClick={() => setScreen('certificates')}>📜</Btn>}
                <Btn v="ghost" sm onClick={() => setScreen('sims')}>🎮</Btn>
                <Btn v="ghost" sm onClick={() => setScreen('sop-lib')}>📋</Btn>
                <button onClick={() => setSearchOpen(true)} style={{ display:'flex', alignItems:'center', gap:6, padding:'5px 10px', borderRadius:6, border:`1px solid rgba(255,255,255,.2)`, background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.65)', fontSize:11, cursor:'pointer' }}>
                  🔍 <kbd style={{ background:'rgba(255,255,255,.1)', border:'1px solid rgba(255,255,255,.2)', borderRadius:3, padding:'1px 5px', fontSize:10, color:'rgba(255,255,255,.75)', fontFamily:'monospace' }}>⌘K</kbd>
                </button>
              </div>
            </div>

            {/* Spaced rep alert */}
            {spacedItems.length > 0 && (
              <div className="fade"
                role="button" tabIndex={0}
                onClick={() => setScreen('spaced')}
                onKeyDown={e => (e.key==='Enter'||e.key===' ') && (e.preventDefault(), setScreen('spaced'))}
                aria-label={`${spacedItems.length} review${spacedItems.length>1?'s':''} due — click to start`}
                style={{ background:`${T.amber}08`, border:`1px solid ${T.amber}30`, borderRadius:8, padding:'12px 18px', marginBottom:16, cursor:'pointer', display:'flex', gap:12, alignItems:'center' }}>
                <span style={{ fontSize:20 }}>🔁</span>
                <div>
                  <div style={{ fontWeight:700, fontSize:13, color:T.amberText }}>{spacedItems.length} question{spacedItems.length>1?'s':''} due for review</div>
                  <div style={{ fontSize:11, color:T.fog }}>You answered these incorrectly. Review now to build retention.</div>
                </div>
                <div style={{ marginLeft:'auto' }}><Btn v="primary" ac={T.amberText} sm>Review Now</Btn></div>
              </div>
            )}

            {/* Leaderboard */}
            {showLeaderboard && (
              <Card style={{ padding:20, marginBottom:20 }} className="fade">
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:14 }}>
                  <div style={{ fontWeight:700, fontSize:14, color:T.ink }}>🏆 Leaderboard</div>
                  <button onClick={() => setShowLeaderboard(false)} aria-label="Close leaderboard" style={{ background:'none', border:'none', color:T.fog, fontSize:16, cursor:'pointer' }}>×</button>
                </div>
                <div style={{ fontSize:13, color:T.fog, fontStyle:'italic' }}>Your ranking updates as you complete modules. Live data loads from the server once teammates are active.</div>
              </Card>
            )}

            {/* Track cards */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(290px,1fr))', gap:12, marginBottom:20 }}>
              {CURRICULUM.map((tr, idx) => {
                const pct = trackPct(tr);
                const unlocked = idx === 0 || trackPct(CURRICULUM[idx-1]) >= 80;
                const earned = certificates.some(c => c.track_id === tr.id);
                return (
                  <Card key={tr.id} hover={!!unlocked} style={{ padding:18, opacity:unlocked?1:.65 }}
                    onClick={unlocked ? () => { setActiveTrack(tr); setScreen('track'); } : undefined}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                      <div style={{ display:'flex', gap:8, alignItems:'center' }}>
                        <span style={{ fontSize:20 }}>{tr.icon}</span>
                        <div>
                          <div style={{ display:'flex', gap:5, marginBottom:2 }}>
                            <Pill c={tr.accentText}>{tr.code}</Pill>
                            {earned && <span style={{ fontSize:12 }}>🏆</span>}
                            {!unlocked && <Pill c={T.fog}>🔒</Pill>}
                          </div>
                          <div style={{ fontWeight:700, fontSize:13, color:T.ink }}>{tr.title}</div>
                        </div>
                      </div>
                      <div style={{ textAlign:'right' }}>
                        <div style={{ fontSize:18, fontWeight:900, color:tr.accentText }}>{pct}%</div>
                        <div style={{ fontSize:10, color:T.fog }}>{tr.weeks}</div>
                      </div>
                    </div>
                    <Bar pct={pct} color={tr.accent}/>
                    {pct >= 80 && (
                      <div style={{ marginTop:8 }}>
                        <Btn v="solid" ac={tr.accentSolid} sm full onClick={e => { e.stopPropagation(); setActiveTrack(tr); setScreen('assessment'); }}>
                          Take Track Assessment →
                        </Btn>
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>

            <div className="sp-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <Card hover style={{ padding:16 }} onClick={() => setScreen('sop-lib')}>
                <div style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:4 }}>📋 SOP Library</div>
                <p style={{ fontSize:12, color:T.fog, lineHeight:1.6, marginBottom:8 }}>{Object.keys(SOP_LIBRARY).length} procedures and working instructions.</p>
                <Btn v="primary" ac={T.blue} sm>Browse</Btn>
              </Card>
              <Card hover style={{ padding:16 }} onClick={() => setScreen('sims')}>
                <div style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:4 }}>🎮 SOC Simulations</div>
                <p style={{ fontSize:12, color:T.fog, lineHeight:1.6, marginBottom:8 }}>{SOC_SIMULATIONS.length} timed scenario exercises with AI feedback.</p>
                <Btn v="primary" ac={T.purple} sm>Enter</Btn>
              </Card>
            </div>
          </div>
        )}

        {/* ── SPACED REVIEW ── */}
        {screen === 'spaced' && (
          <div className="fade" style={{ maxWidth:660, margin:'0 auto' }}>
            <button onClick={() => setScreen('home')} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer', marginBottom:16 }}>← Back</button>
            <Card style={{ padding:28 }}>
              <Pill c={T.amberText}>Spaced Repetition Review</Pill>
              <h2 style={{ fontSize:17, fontWeight:800, color:T.ink, margin:'10px 0 6px' }}>Questions due for recall</h2>
              <p style={{ color:T.fog, fontSize:13, marginBottom:20 }}>You answered these incorrectly. Demonstrating recall now builds long-term retention.</p>
              {spacedItems.length === 0 ? (
                <div style={{ textAlign:'center', padding:'40px 0', color:T.fog }}>All caught up. No reviews due.</div>
              ) : spacedItems.map(item => (
                <div key={item.id} style={{ padding:'16px 0', borderBottom:`1px solid ${T.border}` }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.amberText, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>
                    Module: {item.module_id} — Attempt {item.attempts}
                  </div>
                  <div style={{ fontSize:14, fontWeight:600, color:T.ink, lineHeight:1.65, marginBottom:10 }}>{item.question_text}
                  {item.box_level && (
                    <div style={{ marginTop:8, fontSize:10, color:T.fog }}>
                      Leitner Box {item.box_level}/5 — {['','1 day','3 days','7 days','14 days','Retiring'][item.box_level] || ''}
                    </div>
                  )}</div>
                  <div style={{ display:'flex', gap:8 }}>
                    <Btn v="primary" ac={T.greenText} sm onClick={() => { resolveSpaced(item.id, true); notify('Marked as recalled ✓'); }}>I know this ✓</Btn>
                    <Btn v="danger" sm onClick={() => { resolveSpaced(item.id, false); notify('Flagged for review in 3 days'); }}>Still unsure</Btn>
                  </div>
                </div>
              ))}
            </Card>
          </div>
        )}

        {/* ── CERTIFICATES ── */}
        {screen === 'certificates' && (
          <div className="fade">
            <button onClick={() => setScreen('home')} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer', marginBottom:16 }}>← Back</button>
            <h2 style={{ fontWeight:800, fontSize:18, color:T.ink, marginBottom:16 }}>Your Certificates</h2>
            {certificates.length === 0 ? (
              <Card style={{ padding:40, textAlign:'center' }}>
                <div style={{ fontSize:40, marginBottom:12 }}>🏆</div>
                <div style={{ fontWeight:700, color:T.ink, marginBottom:6 }}>No certificates yet</div>
                <p style={{ color:T.fog, fontSize:13 }}>Complete a track at 80%+ to earn your first SPS certificate.</p>
              </Card>
            ) : (
              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(320px,1fr))', gap:18 }}>
                {certificates.map(cert => (
                  <div key={cert.id} style={{ background:'#FFFDF5', border:`2px solid ${T.gold}`, borderRadius:12, padding:26, textAlign:'center', position:'relative', overflow:'hidden' }}>
                    <div style={{ position:'absolute', top:0, left:0, right:0, height:5, background:`linear-gradient(90deg,${T.gold},${T.goldL},${T.gold})` }}/>
                    <div style={{ fontSize:28, marginBottom:8 }}>{CURRICULUM.find(t=>t.id===cert.track_id)?.icon||'🏆'}</div>
                    <div style={{ fontSize:9, fontWeight:700, letterSpacing:'.12em', color:T.goldText, textTransform:'uppercase', marginBottom:8 }}>Certificate of Completion</div>
                    <div style={{ fontSize:13, color:T.fog, marginBottom:10 }}>This certifies that</div>
                    <div style={{ fontSize:18, fontWeight:900, color:T.navy, marginBottom:5 }}>{user?.name}</div>
                    <div style={{ fontSize:12, color:T.steel, marginBottom:14 }}>has successfully completed</div>
                    <div style={{ fontSize:15, fontWeight:800, color:T.ink, marginBottom:3 }}>{cert.track_title}</div>
                    <div style={{ fontSize:11, color:T.fog, marginBottom:6 }}>{cert.credential || 'SPS Standard'} · 80% Pass Mark</div>
                    <div style={{ fontSize:10, fontWeight:600, color:T.goldText, background:`${T.gold}10`, border:`1px solid ${T.gold}25`, borderRadius:6, padding:'4px 10px', display:'inline-block', marginBottom:16 }}>
                      #{cert.cert_number}
                    </div>
                    <Divider y={0}/>
                    <div style={{ display:'flex', justifyContent:'space-between', marginTop:12, fontSize:10, color:T.fog }}>
                      <span>📅 {new Date(cert.issued_at).toLocaleDateString('en-GB',{day:'2-digit',month:'long',year:'numeric'})}</span>
                      <span>{cert.human_signed_at ? '✓ Assessor Signed' : '⏳ Pending sign-off'}</span>
                    </div>
                    <div style={{ display:'flex', gap:8, marginTop:12 }}>
                      <button
                        onClick={async () => {
                          try {
                            const token = localStorage.getItem('sp_at');
                            const res = await fetch(`/api/certificates/${cert.id}/pdf`, { headers: { Authorization: `Bearer ${token}` } });
                            if (!res.ok) throw new Error();
                            const blob = await res.blob();
                            const url = URL.createObjectURL(blob);
                            const a = document.createElement('a');
                            a.href = url;
                            a.download = `SecurePathway-${cert.track_id}-certificate.svg`;
                            a.click();
                            URL.revokeObjectURL(url);
                          } catch { notify('Download failed', 'err'); }
                        }}
                        style={{ flex:1, textAlign:'center', padding:'8px 0', background:T.goldSolid, color:'#fff', borderRadius:6, fontSize:11, fontWeight:700, border:'none', cursor:'pointer' }}>
                        ⬇ Download Certificate
                      </button>
                      <a href={`https://www.linkedin.com/profile/add?startTask=CERTIFICATION_NAME&name=${encodeURIComponent(cert.track_title)}&organizationName=SecurePathway&issueYear=${new Date(cert.issued_at).getFullYear()}&certUrl=${encodeURIComponent('https://securepathway.io/verify/')}&certId=${cert.id?.slice(0,8)}`}
                        target="_blank" rel="noopener noreferrer"
                        style={{ padding:'8px 12px', background:'rgba(0,119,181,.1)', color:'#0077B5', border:'1px solid rgba(0,119,181,.25)', borderRadius:6, fontSize:11, fontWeight:700, textDecoration:'none', display:'flex', alignItems:'center', gap:4, whiteSpace:'nowrap' }}>
                        in Add to LinkedIn
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PORTFOLIO ── */}
        {screen === 'portfolio' && (
          <div className="fade">
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:20, flexWrap:'wrap', gap:10 }}>
              <div>
                <button onClick={() => setScreen('home')} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer', display:'block', marginBottom:8 }}>← Back</button>
                <h2 style={{ fontWeight:800, fontSize:18, color:T.ink, marginBottom:4 }}>{t('portfolio_title')}</h2>
                <p style={{ color:T.fog, fontSize:13 }}>{t('portfolio_sub')}</p>
              </div>
              {portfolio.length > 0 && <Btn v="primary" ac={T.navyM} onClick={() => notify('PDF export: wire to your backend to generate evidence pack')}>{t('portfolio_export')}</Btn>}
            </div>
            {portfolio.length === 0 ? (
              <Card style={{ padding:40, textAlign:'center', color:T.fog }}>
                <div style={{ fontSize:40, marginBottom:12 }}>📂</div>
                <p>{t('portfolio_empty')}</p>
              </Card>
            ) : portfolio.map(entry => (
              <Card key={entry.id} style={{ padding:22, marginBottom:14 }}>
                <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap' }}>
                  <Pill c={T.blue}>{entry.entry_type?.replace('_',' ')}</Pill>
                  <Pill c={T.fog}>{entry.module_title}</Pill>
                  <span style={{ fontSize:11, color:T.fog, alignSelf:'center' }}>{new Date(entry.created_at).toLocaleDateString('en-GB')}</span>
                  {entry.ai_score && <Pill c={entry.ai_score>=70?T.greenText:T.amberText}>{entry.ai_score}%</Pill>}
                  {entry.human_reviewed && <Pill c={T.goldText}>Human reviewed</Pill>}
                </div>
                <div style={{ fontSize:13, fontWeight:600, color:T.ink, marginBottom:8 }}>{entry.question_text}</div>
                <div style={{ background:T.off, border:`1px solid ${T.border}`, borderRadius:6, padding:'10px 14px', fontSize:13, color:T.slate, lineHeight:1.75, marginBottom:8 }}>{entry.answer_text}</div>
                {entry.ai_feedback && <div style={{ fontSize:12, color:T.steel, fontStyle:'italic' }}>AI: {entry.ai_feedback}</div>}
              </Card>
            ))}
          </div>
        )}

        {/* ── TRACK ── */}
        {screen === 'track' && activeTrack && (
          <div className="fade">
            <button onClick={() => setScreen('home')} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer', marginBottom:14 }}>← Back</button>
            <div style={{ display:'flex', gap:14, marginBottom:20, alignItems:'flex-start' }}>
              <div style={{ width:46, height:46, background:`${activeTrack.accent}12`, border:`1px solid ${activeTrack.accent}22`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:20, flexShrink:0 }}>{activeTrack.icon}</div>
              <div style={{ flex:1 }}>
                <div style={{ display:'flex', gap:8, marginBottom:4, flexWrap:'wrap' }}><Pill c={activeTrack.accentText}>{activeTrack.code}</Pill></div>
                <h1 style={{ fontSize:19, fontWeight:900, color:T.ink, letterSpacing:'-.02em' }}>{activeTrack.title}</h1>
                <p style={{ color:T.fog, fontSize:12, marginTop:3 }}>{activeTrack.description}</p>
              </div>
              <div style={{ textAlign:'right' }}><div style={{ fontSize:24, fontWeight:900, color:activeTrack.accentText }}>{trackPct(activeTrack)}%</div><div style={{ width:90 }}><Bar pct={trackPct(activeTrack)} color={activeTrack.accent}/></div></div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:10 }}>
              {activeTrack.modules.map(mod => {
                const mp = progress[mod.id];
                const secsDone = mp?.sections ? Object.values(mp.sections).filter(Boolean).length : 0;
                const totalSecs = mod.sections?.length || 0;
                const modPct = totalSecs ? Math.round(secsDone/totalSecs*100) : 0;
                const hasHook = !!HOOK_SCENARIOS[mod.id];
                const qCount = EXTENDED_QUIZZES[mod.id]?.questions?.length || QUIZZES[mod.id]?.questions?.length || 0;
                return (
                  <Card key={mod.id} hover style={{ padding:16 }} onClick={() => { setActiveMod(mod); setActiveSec(mod.sections?.[0]||null); setHookResp(mp?.hookResponse||''); setHookSubmitted(!!mp?.hookDone); setScreen('module'); }}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:7 }}>
                      <div style={{ display:'flex', gap:5, flexWrap:'wrap' }}>
                        <Pill c={modPct===100?T.greenText:activeTrack.accentText}>{modPct===100?'Done':modPct>0?`${modPct}%`:'Start'}</Pill>
                        {mp?.quizPassed && <Pill c={T.tealText}>{mp.quizScore===100?'💫':''}Quiz</Pill>}
                        {hasHook && !mp?.hookDone && <Pill c={T.goldText}>Scenario</Pill>}
                      </div>
                      <span style={{ fontSize:10, color:T.fog }}>{mod.duration}</span>
                    </div>
                    <div style={{ fontWeight:700, fontSize:13, color:T.ink, lineHeight:1.4, marginBottom:5 }}>{mod.title}</div>
                    <Bar pct={modPct} color={activeTrack.accent} h={3}/>
                    <div style={{ fontSize:10, color:T.fog, marginTop:4, display:'flex', justifyContent:'space-between' }}>
                      <span>Wk {mod.week} · {secsDone}/{totalSecs}</span>
                      {qCount > 0 && <span>{qCount}Q quiz{hasHook?' · Scenario':''}</span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* ── MODULE ── */}
        {screen === 'module' && activeMod && (
          <div className="fade">
            {/* Hook scenario */}
            {HOOK_SCENARIOS[activeMod.id] && !hookSubmitted && (
              <div style={{ maxWidth:720, margin:'0 auto 20px' }}>
                <div className="hook-box">
                  <div style={{ fontSize:10, fontWeight:700, color:T.goldL, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>{t('mod_hook_title')}</div>
                  <p style={{ fontSize:13, color:'rgba(255,255,255,.8)', lineHeight:1.75, marginBottom:12 }}>{HOOK_SCENARIOS[activeMod.id].setup}</p>
                  <p style={{ fontSize:14, fontWeight:600, color:'#fff', lineHeight:1.7, marginBottom:16 }}>{HOOK_SCENARIOS[activeMod.id].question}</p>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.7)', marginBottom:10, fontStyle:'italic' }}>{t('mod_hook_sub')}</div>
                  <textarea rows={4} value={hookResp} onChange={e => setHookResp(e.target.value)}
                    placeholder={t('mod_hook_attempt')}
                    style={{ width:'100%', background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.2)', borderRadius:6, padding:'10px 14px', fontSize:13, color:'#fff', resize:'vertical', outline:'none', lineHeight:1.7, marginBottom:10 }}/>
                  <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                    <Btn v="solid" ac={T.goldSolid} disabled={hookResp.trim().length < 15} onClick={() => {
                      setHookSubmitted(true);
                      saveHook(activeMod.id, activeTrack?.id, hookResp);
                      notify('Hook recorded +15 XP. Now read the content.');
                    }}>Record Response → Read Content</Btn>
                    <span style={{ fontSize:11, color:'rgba(255,255,255,.7)' }}>{hookResp.trim().split(' ').filter(Boolean).length} words</span>
                  </div>
                  <div style={{ marginTop:14, display:'flex', gap:6, flexWrap:'wrap' }}>
                    {HOOK_SCENARIOS[activeMod.id].key_concepts?.map(c => (
                      <span key={c} style={{ fontSize:10, color:T.goldL, background:`${T.gold}15`, border:`1px solid ${T.gold}25`, padding:'2px 8px', borderRadius:10 }}>{c}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign:'center', marginTop:8 }}>
                  <button onClick={() => { setHookSubmitted(true); saveHook(activeMod.id, activeTrack?.id, ''); }} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer' }}>Skip scenario</button>
                </div>
              </div>
            )}

            {/* Content */}
            {(hookSubmitted || !HOOK_SCENARIOS[activeMod.id]) && activeSec && (
              <div className="sp-content-grid" style={{ display:'grid', gridTemplateColumns:'190px 1fr', gap:18 }}>
                {/* Sidebar */}
                <div>
                  <Card style={{ padding:14, marginBottom:10, position:'sticky', top:76 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Sections</div>
                    {activeMod.sections?.map(sec => {
                      const done = progress[activeMod.id]?.sections?.[sec.id];
                      return (
                        <div key={sec.id} onClick={() => setActiveSec(sec)} className="hrow"
                          style={{ padding:'8px 10px', borderRadius:6, cursor:'pointer', background:activeSec.id===sec.id?`${activeTrack?.accent||T.blue}08`:T.white, border:`1px solid ${activeSec.id===sec.id?T.border:'transparent'}`, marginBottom:3 }}>
                          <div style={{ display:'flex', gap:7 }}>
                            <span style={{ fontSize:11 }}>{done?'✅':'⬜'}</span>
                            <span style={{ fontSize:11, fontWeight:activeSec.id===sec.id?700:400, color:activeSec.id===sec.id?T.ink:T.steel, lineHeight:1.4 }}>{sec.title}</span>
                          </div>
                        </div>
                      );
                    })}
                    <Divider y={10}/>
                    {activeMod.quiz && (
                      <Btn v="primary" ac={activeTrack?.accentText||T.blue} sm full
                        disabled={!activeMod.sections?.some(s => progress[activeMod.id]?.sections?.[s.id])}
                        onClick={() => startQuiz(activeMod)}>
                        {progress[activeMod.id]?.quizPassed ? `Retake (${progress[activeMod.id]?.quizScore}%)` : 'Take Quiz →'}
                      </Btn>
                    )}
                  </Card>
                  {/* Timer */}
                  <Card style={{ padding:'12px 14px' }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>{t('mod_timer')}</div>
                    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                      <span style={{ fontFamily:'monospace', fontSize:20, fontWeight:900, color:timerRunning?T.blue:T.fog }}>{fmtTime(timerSecs)}</span>
                      <div style={{ display:'flex', gap:5 }}>
                        <button onClick={() => setTimerRunning(r=>!r)} style={{ padding:'4px 8px', borderRadius:5, border:'none', background:timerRunning?`${T.amber}18`:`${T.greenL}18`, color:timerRunning?T.amberText:T.greenText, fontWeight:600, fontSize:10, cursor:'pointer' }}>{timerRunning?'⏸':'▶'}</button>
                        {timerSecs > 0 && <button onClick={() => { setTimerSecs(0); setTimerRunning(false); }} aria-label="Reset timer" style={{ padding:'4px 6px', borderRadius:5, border:'none', background:T.off, color:T.fog, fontSize:10, cursor:'pointer' }}>↺</button>}
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Main content */}
                <Card style={{ padding:26 }}>
                  <div style={{ display:'flex', gap:8, marginBottom:10, flexWrap:'wrap', alignItems:'center' }}>
                    <Pill c={activeTrack?.accentText||T.blue}>{activeTrack?.code} · Wk{activeMod.week}</Pill>
                    <Pill c={T.fog}>{activeMod.duration}</Pill>
                    {progress[activeMod.id]?.quizPassed && <Pill c={T.tealText}>{progress[activeMod.id]?.quizScore===100?'💫 Perfect':'Quiz ✓'}</Pill>}
                  </div>
                  <h2 style={{ fontSize:18, fontWeight:800, color:T.ink, marginBottom:4, letterSpacing:'-.02em' }}>{activeSec.title}</h2>
                  <div style={{ width:30, height:3, background:activeTrack?.accent||T.blue, borderRadius:2, marginBottom:18 }}/>
                  <div style={{ fontSize:14, color:T.slate, lineHeight:1.9, whiteSpace:'pre-wrap', marginBottom:18 }}>{activeSec.content}</div>

                  {/* Post-hook reflection */}
                  {HOOK_SCENARIOS[activeMod.id] && hookSubmitted && progress[activeMod.id]?.hookResponse && (
                    <div style={{ background:`${T.gold}08`, border:`1px solid ${T.gold}20`, borderRadius:8, padding:14, marginBottom:16 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:T.goldText, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Your initial response to the hook scenario</div>
                      <div style={{ fontSize:12, color:T.slate, fontStyle:'italic', lineHeight:1.65 }}>{progress[activeMod.id].hookResponse}</div>
                      <div style={{ fontSize:11, color:T.fog, marginTop:6 }}>Now that you have read the content — how would you change your answer?</div>
                    </div>
                  )}

                  {/* Notes */}
                  <div style={{ marginBottom:16 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>
                      {t('mod_notes_label')} <span style={{ fontSize:9, fontWeight:400 }}>— auto-saved</span>
                    </div>
                    <textarea value={progress[activeMod.id]?.notes||''} onChange={e => saveNotes(activeMod.id, activeTrack?.id, e.target.value)} rows={3}
                      placeholder={t('mod_notes_ph')}
                      style={{ width:'100%', background:T.white, border:`1px solid ${T.border}`, borderRadius:6, padding:'10px 12px', fontSize:13, color:T.ink, resize:'vertical', outline:'none', lineHeight:1.7 }}/>
                  </div>

                  {activeMod.topics && (
                    <div style={{ background:T.off, border:`1px solid ${T.border}`, borderRadius:6, padding:12, marginBottom:16 }}>
                      <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:6 }}>Key Topics</div>
                      <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>{activeMod.topics.map(tp => <Pill key={tp} c={T.fog}>{tp}</Pill>)}</div>
                    </div>
                  )}

                  <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                    {!progress[activeMod.id]?.sections?.[activeSec.id] && (
                      <Btn v="solid" ac={T.greenText} onClick={() => { markSection(activeMod.id, activeTrack?.id, activeSec.id); notify('Section complete ✓ +25 XP'); }}>
                        {t('mod_mark_read')}
                      </Btn>
                    )}
                    {activeMod.sections && activeSec.id !== activeMod.sections[activeMod.sections.length-1]?.id && (
                      <Btn v="primary" ac={activeTrack?.accentText||T.blue} onClick={() => {
                        const idx = activeMod.sections.findIndex(s => s.id === activeSec.id);
                        if (idx < activeMod.sections.length-1) { markSection(activeMod.id, activeTrack?.id, activeSec.id); setActiveSec(activeMod.sections[idx+1]); }
                      }}>{t('mod_next_sec')} →</Btn>
                    )}
                    <Btn v="ghost" sm onClick={() => setScreen('track')}>← Track</Btn>
                  </div>
                </Card>
              </div>
            )}
          </div>
        )}

        {/* ── QUIZ ── */}
        {screen === 'quiz' && quizState && (
          <div className="fade" style={{ maxWidth:680, margin:'0 auto' }}>
            <Card style={{ padding:28 }}>
              {quizState.score === null ? (
                <>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                    <div>
                      <div style={{ fontSize:12, color:T.fog }}>{activeMod?.title} · {t('quiz_pass_mark')}</div>
                      {EXTENDED_QUIZZES[quizState.modId] && <Pill c={T.purple} sm>{quizState.questions[quizState.current]?.type||'mcq'}</Pill>}
                    </div>
                    <div style={{ textAlign:'right' }}>
                      <div style={{ fontSize:13, fontWeight:700, color:activeTrack?.accentText||T.blue }}>{quizState.current+1}/{quizState.questions.length}</div>
                      <div style={{ fontSize:10, color:T.fog }}>+100 XP pass · +50 perfect</div>
                    </div>
                  </div>
                  <Bar pct={(quizState.current/quizState.questions.length)*100} color={activeTrack?.accent||T.blue} h={5}/>
                  <div style={{ marginTop:18 }}>
                    <QuizQuestion
                      q={quizState.questions[quizState.current]}
                      idx={quizState.current}
                      onMCQ={answerMCQ}
                      onAdvance={advanceQuiz}
                      feedback={qFeedback}
                      shortAns={shortAns} setShortAns={setShortAns}
                      shortResult={shortResult} setShortResult={setShortResult}
                      matchState={matchState} setMatchState={setMatchState}
                    />
                  </div>
                </>
              ) : (
                <div style={{ textAlign:'center', padding:'20px 0' }} className="pop">
                  <div style={{ fontSize:48, marginBottom:12 }}>{quizState.passed ? (quizState.score===100?'💫':'✅') : '📖'}</div>
                  <div style={{ fontWeight:800, fontSize:20, color:T.ink, marginBottom:8 }}>{quizState.passed ? (quizState.score===100 ? 'Perfect Score' : t('quiz_passed')) : t('quiz_failed')}</div>
                  <div style={{ fontSize:44, fontWeight:900, color:quizState.passed?T.greenL:T.amberL, marginBottom:10, letterSpacing:'-.03em' }}>{quizState.score}%</div>
                  {quizState.passed && <div style={{ fontSize:13, color:T.blue, fontWeight:600, marginBottom:16 }}>+{100+(quizState.score===100?50:0)} XP earned</div>}
                  <p style={{ color:T.fog, fontSize:13, marginBottom:22 }}>{quizState.passed ? '80%+ achieved. Progress saved.' : '80% required. Wrong answers flagged for spaced review.'}</p>
                  {/* Adaptive feedback */}
                  {quizState.passed && quizState.score >= 95 && (() => {
                    const highScoreMods = Object.values(progress).filter(p => p.quizPassed && (p.quizScore||0) >= 95);
                    return highScoreMods.length >= 2 ? (
                      <div style={{ background:`${T.blue}08`, border:`1px solid ${T.blue}20`, borderRadius:7, padding:'10px 14px', fontSize:12, color:T.blue, marginBottom:12 }}>
                        ⚡ You're scoring 95%+ consistently — you can attempt the track assessment early if you feel ready.
                      </div>
                    ) : null;
                  })()}
                  {!quizState.passed && quizState.score < 60 && (
                    <div style={{ background:`${T.amberL}08`, border:`1px solid ${T.amberL}20`, borderRadius:7, padding:'10px 14px', fontSize:12, color:T.amberL, marginBottom:12 }}>
                      💡 Score below 60% — re-read the module sections before retrying. Weak areas flagged for spaced repetition review.
                    </div>
                  )}
                  <div style={{ display:'flex', gap:10, justifyContent:'center', flexWrap:'wrap' }}>
                    {!quizState.passed && <Btn v="ghost" sm onClick={() => startQuiz(activeMod)}>{t('quiz_retry')}</Btn>}
                    <Btn v="ghost" sm onClick={() => setScreen('module')}>Review Module</Btn>
                    <Btn v="solid" ac={quizState.passed?T.greenText:T.blue} onClick={() => setScreen('track')}>← Track</Btn>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── ASSESSMENT ── */}
        {screen === 'assessment' && activeTrack && (() => {
          const rubric = ASSESSMENT_RUBRICS[activeTrack.id];
          return (
            <div className="fade" style={{ maxWidth:720, margin:'0 auto' }}>
              <button onClick={() => setScreen('track')} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer', marginBottom:14 }}>← Back</button>
              <Card style={{ padding:28 }}>
                <div style={{ display:'flex', gap:8, marginBottom:14 }}>
                  <Pill c={activeTrack.accentText}>{activeTrack.code} Assessment</Pill>
                  <Pill c={T.goldText}>SPS Standard</Pill>
                  <Pill c={T.fog}>Human sign-off required</Pill>
                </div>
                <h2 style={{ fontSize:18, fontWeight:800, color:T.ink, marginBottom:6 }}>{rubric?.title || activeTrack.title + ' Assessment'}</h2>

                {rubric && (
                  <div style={{ marginBottom:20 }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.09em', textTransform:'uppercase', marginBottom:10 }}>Assessment Rubric</div>
                    <div style={{ display:'grid', gap:8, marginBottom:12 }}>
                      {rubric.criteria.map(c => (
                        <div key={c.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'10px 14px', background:T.off, border:`1px solid ${T.border}`, borderRadius:7 }}>
                          <div>
                            <div style={{ fontWeight:700, fontSize:13, color:T.ink }}>{c.label}</div>
                            <div style={{ fontSize:11, color:T.fog, marginTop:2 }}>{c.desc}</div>
                          </div>
                          <div style={{ background:`${activeTrack.accent}14`, color:activeTrack.accentText, padding:'3px 10px', borderRadius:10, fontSize:11, fontWeight:700, flexShrink:0, marginLeft:12 }}>{c.weight}%</div>
                        </div>
                      ))}
                    </div>
                    <div style={{ display:'flex', gap:8, flexWrap:'wrap' }}>
                      {rubric.gradeBands.map(b => (
                        <div key={b.label} style={{ padding:'5px 12px', background:`${b.color}10`, border:`1px solid ${b.color}25`, borderRadius:7, fontSize:11 }}>
                          <span style={{ fontWeight:700, color:b.color }}>{b.label}</span>
                          <span style={{ color:T.fog, marginLeft:6 }}>{b.min}%+</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ background:T.off, border:`1px solid ${T.border}`, borderRadius:8, padding:14, marginBottom:18 }}>
                  <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.09em', textTransform:'uppercase', marginBottom:6 }}>Assessment Brief</div>
                  <div style={{ fontSize:13, color:T.slate, lineHeight:1.8 }}>
                    {activeTrack.modules.find(m => m.assessment)?.assessment || '90-minute scenario-based assessment. 80% required for SPS credential. AI pre-review then human assessor sign-off within 3 working days.'}
                  </div>
                </div>

                {!assessResult ? (
                  <>
                    <textarea rows={14} value={assessText} onChange={e => setAssessText(e.target.value)}
                      placeholder="Write your structured assessment response. Address each part. Use BLUF — conclusion first, evidence second. Apply the frameworks and procedures from this track."
                      style={{ width:'100%', background:T.white, border:`1.5px solid ${T.borderH}`, borderRadius:7, padding:14, fontSize:14, resize:'vertical', lineHeight:1.75, outline:'none', color:T.ink, marginBottom:12 }}/>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:10 }}>
                      <span style={{ fontSize:11, color:T.fog }}>{assessText.split(' ').filter(Boolean).length} words{assessText.split(' ').filter(Boolean).length < 300 && ' (aim for 300+)'}</span>
                      <div style={{ display:'flex', gap:10 }}>
                        <Btn v="ghost" sm onClick={() => setScreen('track')}>Save Draft</Btn>
                        <Btn v="solid" ac={activeTrack.accentSolid} disabled={!assessText || assessText.split(' ').filter(Boolean).length < 100 || assessLoading}
                          onClick={async () => {
                            setAssessLoading(true);
                            try {
                              const result = await assessAPI.submitTrack({ trackId:activeTrack.id, trackTitle:activeTrack.title, submission:assessText, rubricCriteria:rubric?.criteria||[] });
                              setAssessResult(result);
                              assessAPI.getCertificates().then(d => setCertificates(d.certificates||[])).catch(()=>{});
                              notify('Assessment submitted. Human sign-off within 3 working days.');
                            } catch (err) {
                              setAssessResult({ overallGrade:'Submitted', score:0, strengths:'Response recorded.', gaps:'', keyLearning:'Saved for human assessor review.', humanReviewRequired:true, note:'AI unavailable. Submitted to assessor queue.' });
                            }
                            setAssessLoading(false);
                          }}>
                          {assessLoading ? 'AI reviewing...' : 'Submit Assessment'}
                        </Btn>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="fade">
                    <div style={{ background:`${assessResult.score>=60?T.greenL:T.redL}08`, border:`1px solid ${assessResult.score>=60?T.greenL:T.redL}25`, borderRadius:8, padding:20, marginBottom:16 }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
                        <div>
                          <div style={{ fontWeight:800, fontSize:18, color:assessResult.score>=60?T.greenText:T.redText }}>{assessResult.overallGrade}</div>
                          <div style={{ fontSize:12, color:T.fog, marginTop:2 }}>{assessResult.note}</div>
                        </div>
                        <div style={{ fontSize:36, fontWeight:900, color:assessResult.score>=60?T.greenL:T.amberL }}>{assessResult.score}%</div>
                      </div>
                      {assessResult.criteriaFeedback?.map(cf => (
                        <div key={cf.criterion} style={{ padding:'8px 0', borderBottom:`1px solid ${T.border}` }}>
                          <div style={{ display:'flex', justifyContent:'space-between' }}>
                            <span style={{ fontSize:12, fontWeight:600, color:T.ink }}>{cf.criterion}</span>
                            <span style={{ fontSize:12, fontWeight:700, color:cf.score>=70?T.greenText:T.amberText }}>{cf.score}%</span>
                          </div>
                          <div style={{ fontSize:11, color:T.fog, marginTop:2 }}>{cf.comment}</div>
                        </div>
                      ))}
                      <div style={{ marginTop:12 }}>
                        {assessResult.strengths && <div style={{ fontSize:12, color:T.green, marginBottom:4 }}>+ {assessResult.strengths}</div>}
                        {assessResult.gaps && <div style={{ fontSize:12, color:T.amberL, marginBottom:4 }}>△ {assessResult.gaps}</div>}
                        {assessResult.keyLearning && <div style={{ fontSize:12, color:T.steel, marginTop:8, fontStyle:'italic' }}>{assessResult.keyLearning}</div>}
                      </div>
                    </div>
                    <div style={{ background:`${T.gold}08`, border:`1px solid ${T.gold}25`, borderRadius:7, padding:14, fontSize:12, color:T.steel }}>
                      <strong style={{ color:T.goldText }}>Human assessor review required</strong> — This is an AI pre-assessment only. A qualified assessor will countersign within 3 working days. The SPS credential is awarded only after human sign-off.
                    </div>
                  </div>
                )}
              </Card>
            </div>
          );
        })()}

        {/* ── SIMULATIONS LIST ── */}
        {screen === 'sims' && (
          <div className="fade">
            <button onClick={() => setScreen('home')} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer', marginBottom:14 }}>← Back</button>
            <h2 style={{ fontWeight:800, fontSize:17, color:T.ink, marginBottom:5 }}>SOC Simulation Centre</h2>
            <p style={{ color:T.fog, fontSize:13, marginBottom:18 }}>AI-assessed scenario exercises. Timed. Structured feedback saved to your portfolio.</p>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:12 }}>
              {SOC_SIMULATIONS.map(sim => (
                <Card key={sim.id} hover style={{ padding:20 }} onClick={() => { setSimState(sim); setSimResp(''); setSimFb(null); setSimLoading(false); setScreen('sim'); }}>
                  <div style={{ display:'flex', gap:8, marginBottom:8 }}>
                    <Pill c={T.purple}>Simulation</Pill>
                    <Pill c={sim.difficulty==='Beginner'?T.greenText:sim.difficulty==='Intermediate'?T.amberL:T.redText}>{sim.difficulty}</Pill>
                    <span style={{ fontSize:10, color:T.fog, alignSelf:'center' }}>~{sim.estimatedMins}m</span>
                  </div>
                  <div style={{ fontWeight:700, fontSize:13, color:T.ink, marginBottom:4 }}>{sim.title}</div>
                  <p style={{ fontSize:12, color:T.fog, lineHeight:1.6 }}>{sim.description}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* ── ACTIVE SIM ── */}
        {screen === 'sim' && simState && (
          <div className="fade" style={{ maxWidth:760, margin:'0 auto' }}>
            <button onClick={() => { setSimState(null); setScreen('sims'); }} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer', marginBottom:12 }}>← Back</button>
            <Card style={{ padding:26 }}>
              <div style={{ display:'flex', gap:8, marginBottom:12 }}>
                <Pill c={T.purple}>SOC Simulation</Pill>
                <Pill c={simState.difficulty==='Beginner'?T.greenText:simState.difficulty==='Intermediate'?T.amberL:T.redText}>{simState.difficulty}</Pill>
              </div>
              <h2 style={{ fontWeight:800, fontSize:17, color:T.ink, marginBottom:12 }}>{simState.title}</h2>
              <div style={{ background:T.off, border:`1px solid ${T.border}`, borderRadius:7, padding:16, marginBottom:18 }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.09em', textTransform:'uppercase', marginBottom:8 }}>Scenario</div>
                <div style={{ fontSize:13, color:T.slate, lineHeight:1.85, whiteSpace:'pre-line' }}>{simState.scenario}</div>
              </div>
              {!simFb ? (
                <>
                  <textarea rows={11} value={simResp} onChange={e => setSimResp(e.target.value)} disabled={simLoading}
                    placeholder="Write your structured response. Number your answers. Apply correct SOPs. Separate fact from assessment."
                    style={{ width:'100%', background:T.white, border:`1px solid ${T.borderH}`, borderRadius:6, padding:14, fontSize:14, resize:'vertical', lineHeight:1.7, outline:'none', color:T.ink, marginBottom:12 }}/>
                  <div style={{ display:'flex', gap:10 }}>
                    <Btn v="ghost" sm onClick={() => { setSimState(null); setScreen('sims'); }}>← Back</Btn>
                    <Btn v="solid" ac={T.purple} disabled={simLoading || simResp.length < 100} onClick={async () => {
                      setSimLoading(true);
                      try {
                        const result = await assessAPI.submitSimulation({ simTitle:simState.title, difficulty:simState.difficulty, sopRefs:simState.sopRef||[], scenario:simState.scenario, response:simResp });
                        setSimFb(result.feedback);
                        assessAPI.getPortfolio().then(d => setPortfolio(d.entries||[])).catch(()=>{});
                      } catch { setSimFb('AI service unavailable. Response saved for trainer review.'); }
                      setSimLoading(false);
                    }}>{simLoading ? 'AI Assessing...' : 'Submit for AI Feedback'}</Btn>
                  </div>
                </>
              ) : (
                <div>
                  <div style={{ background:T.off, border:`1px solid ${T.border}`, borderRadius:7, padding:16, marginBottom:14, whiteSpace:'pre-wrap', fontSize:13, lineHeight:1.85, color:T.slate }}>
                    <div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.09em', textTransform:'uppercase', marginBottom:8 }}>AI Trainer Feedback</div>
                    {simFb}
                  </div>
                  <div style={{ display:'flex', gap:10 }}>
                    <Btn v="ghost" sm onClick={() => { setSimFb(null); setSimResp(''); }}>Retry</Btn>
                    <Btn v="solid" ac={T.greenText} sm onClick={() => { setSimState(null); setScreen('sims'); }}>← Simulations</Btn>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* ── SOP LIBRARY ── */}
        {screen === 'sop-lib' && !activeSop && (
          <div className="fade">
            <button onClick={() => setScreen('home')} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer', marginBottom:14 }}>← Back</button>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:18, flexWrap:'wrap', gap:12 }}>
              <div>
                <h2 style={{ fontWeight:800, fontSize:17, color:T.ink, marginBottom:4 }}>SOP & Working Instructions</h2>
                <p style={{ color:T.fog, fontSize:13 }}>{Object.keys(SOP_LIBRARY).length} procedures · {bookmarks.length} bookmarked</p>
              </div>
            </div>
            {['Operations','Intelligence','Reports','Investigations','Compliance','Quality'].map(cat => {
              const sops = Object.values(SOP_LIBRARY).filter(s => s.category === cat);
              if (!sops.length) return null;
              return (
                <div key={cat} style={{ marginBottom:18 }}>
                  <div style={{ fontWeight:700, fontSize:12, color:T.steel, marginBottom:8 }}>{cat}</div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:8 }}>
                    {sops.map(sop => {
                      const bkd = bookmarks.includes(sop.id);
                      return (
                        <Card key={sop.id} hover style={{ padding:14 }} onClick={() => { setActiveSop(sop); setScreen('sop-detail'); }}>
                          <div style={{ display:'flex', justifyContent:'space-between', marginBottom:6 }}>
                            <Pill c={sop.type==='sop'?T.blue:T.purple} sm>{sop.type?.toUpperCase()||'SOP'}</Pill>
                            <button onClick={e => { e.stopPropagation(); toggleBookmark(sop.id); }} style={{ background:'none', border:'none', cursor:'pointer', fontSize:14, color:bkd?T.gold:T.fog }}>
                              {bkd ? '★' : '☆'}
                            </button>
                          </div>
                          <div style={{ fontWeight:700, fontSize:12, color:T.ink, marginBottom:3 }}>{sop.title}</div>
                          <p style={{ fontSize:11, color:T.fog, lineHeight:1.55 }}>{sop.summary?.slice(0,70)}...</p>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* ── SOP DETAIL ── */}
        {screen === 'sop-detail' && activeSop && (
          <div className="fade" style={{ maxWidth:760, margin:'0 auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:12 }}>
              <button onClick={() => { setActiveSop(null); setScreen('sop-lib'); }} style={{ background:'none', border:'none', color:T.fog, fontSize:12, cursor:'pointer' }}>← Library</button>
              <button onClick={() => toggleBookmark(activeSop.id)} style={{ background:'none', border:'none', cursor:'pointer', fontSize:13, color:bookmarks.includes(activeSop.id)?T.gold:T.fog }}>
                {bookmarks.includes(activeSop.id) ? '★ Bookmarked' : '☆ Bookmark'}
              </button>
            </div>
            <Card style={{ padding:26 }}>
              <div style={{ display:'flex', gap:8, marginBottom:12 }}><Pill c={T.blue}>{activeSop.type?.toUpperCase()||'SOP'}</Pill><Pill c={T.fog}>{activeSop.category}</Pill></div>
              <h2 style={{ fontWeight:800, fontSize:18, color:T.ink, letterSpacing:'-.02em', marginBottom:8 }}>{activeSop.title}</h2>
              <p style={{ color:T.fog, fontSize:13, lineHeight:1.7, paddingBottom:14, borderBottom:`1px solid ${T.border}`, marginBottom:14 }}>{activeSop.summary}</p>
              {activeSop.steps && <div><div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>Process Steps</div>{activeSop.steps.map((s,i) => <div key={i} style={{ display:'flex', gap:10, padding:'7px 0', borderBottom:`1px solid ${T.border}`, fontSize:13 }}><span style={{ color:T.blue, fontWeight:700, minWidth:16 }}>{i+1}.</span><span style={{ color:T.slate, lineHeight:1.7 }}>{s}</span></div>)}</div>}
              {activeSop.sections && <div style={{ marginTop:12 }}>{activeSop.sections.map((s,i) => <div key={i} style={{ padding:'5px 0', borderBottom:`1px solid ${T.border}`, fontSize:13, color:T.slate }}><span style={{ color:T.purple, fontWeight:700, marginRight:8 }}>{i+1}.</span>{s}</div>)}</div>}
              {activeSop.slas && <div style={{ marginTop:12 }}><div style={{ fontSize:10, fontWeight:700, color:T.fog, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:8 }}>SLAs</div>{Object.entries(activeSop.slas).map(([k,v]) => <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:`1px solid ${T.border}`, fontSize:13 }}><span style={{ fontWeight:600, color:T.ink }}>{k}</span><span style={{ color:T.fog }}>{v}</span></div>)}</div>}
              {activeSop.triggers && <div style={{ marginTop:12 }}>{activeSop.triggers.map((r,i) => <div key={i} style={{ padding:'5px 0', borderBottom:`1px solid ${T.border}`, fontSize:13, color:T.slate }}>· {r}</div>)}</div>}
            </Card>
          </div>
        )}

      </main>
    </div>
  );
}
