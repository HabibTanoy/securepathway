import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useProgress } from '../hooks/useProgress.jsx';
import { useLang } from '../hooks/useLang.jsx';
import { CURRICULUM } from '../data/curriculum.js';
import { T } from '../data/tokens.js';
import { Btn, Card, Bar, Pill, Avatar } from '../components/atoms/index.jsx';

export default function LandingPage() {
  const { user, logout } = useAuth();
  const { xp, trackPct, overallPct } = useProgress();
  const { lang, changeLang, LANGS, t } = useLang();
  const navigate = useNavigate();

  return (
    <div style={{ background:T.page, minHeight:'100vh' }}>
      {/* Nav */}
      <nav style={{ background:T.white, borderBottom:`1px solid ${T.border}`, height:60, display:'flex', alignItems:'center', padding:'0 28px', position:'sticky', top:0, zIndex:100 }}>
        <div style={{ display:'flex', alignItems:'center', gap:10, flex:1 }}>
          <div style={{ width:32, height:32, borderRadius:8, background:T.navyM, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="18" height="14" viewBox="0 0 18 14" fill="none"><rect width="18" height="2.5" rx="1.25" fill="white"/><rect y="5.75" width="13" height="2.5" rx="1.25" fill="white"/><rect y="11.5" width="8" height="2.5" rx="1.25" fill="white"/></svg>
          </div>
          <span style={{ fontWeight:800, fontSize:14, color:T.ink, letterSpacing:'-.025em' }}>SecurePathway</span>
          <div style={{ background:'rgba(200,149,42,.1)', border:'1px solid rgba(200,149,42,.3)', color:T.goldText, borderRadius:10, padding:'2px 9px', fontSize:10, fontWeight:700, letterSpacing:'.08em' }}>SPS STANDARD</div>
        </div>
        <div style={{ display:'flex', gap:8, alignItems:'center' }}>
          <select value={lang} onChange={e => changeLang(e.target.value)} aria-label="Select language" style={{ fontSize:11, border:`1px solid ${T.border}`, borderRadius:6, padding:'4px 8px', background:T.white, color:T.steel, cursor:'pointer', outline:'none' }}>
            {Object.values(LANGS).map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
          {user && (
            <div style={{ display:'flex', alignItems:'center', gap:8 }}>
              <Avatar i={user.initials} size={26} color={user.role==='manager'?T.goldSolid:T.navyM}/>
              <span style={{ fontSize:11, color:T.fog }}>⚡{xp.toLocaleString()} XP</span>
            </div>
          )}
          <Btn v="ghost" sm onClick={() => navigate('/training')}>Training</Btn>
          <Btn v="solid" ac={T.navyM} sm onClick={() => navigate(overallPct > 0 ? '/training' : '/onboarding')}>
            {overallPct > 0 ? 'Continue' : 'Get Started'}
          </Btn>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ background:T.navy, padding:'100px 40px 80px', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 65% 50%,rgba(27,79,228,.2) 0%,transparent 70%)', pointerEvents:'none' }}/>
        <div className="sp-hero-grid" style={{ maxWidth:1080, margin:'0 auto', position:'relative', display:'grid', gridTemplateColumns:'1fr 380px', gap:56, alignItems:'center' }}>
          <div>
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.15)', borderRadius:20, padding:'5px 14px', marginBottom:24, fontSize:11, fontWeight:600, color:'rgba(255,255,255,.6)', letterSpacing:'.08em' }}>
              <div className="pulse" style={{ width:6, height:6, borderRadius:'50%', background:'#10A374' }}/>
              {t('hero_eyebrow')}
            </div>
            <h1 style={{ fontFamily:'Georgia,serif', fontSize:'clamp(32px,4.5vw,52px)', fontWeight:700, lineHeight:1.1, letterSpacing:'-.025em', color:'#fff', marginBottom:16 }}>
              {t('hero_h1_a')}<br/><span style={{ color:T.goldL }}>{t('hero_h1_b')}</span>
            </h1>
            <p style={{ fontSize:16, color:'rgba(255,255,255,.6)', lineHeight:1.75, maxWidth:460, marginBottom:28 }}>{t('hero_sub')}</p>
            {user && overallPct > 0 && (
              <div style={{ background:'rgba(255,255,255,.08)', border:'1px solid rgba(255,255,255,.12)', borderRadius:8, padding:'12px 16px', marginBottom:20, display:'flex', gap:14, alignItems:'center' }}>
                <div style={{ flex:1 }}>
                  <div style={{ fontSize:10, color:'rgba(255,255,255,.7)', marginBottom:4 }}>Your progress</div>
                  <div style={{ height:5, background:'rgba(255,255,255,.15)', borderRadius:3, overflow:'hidden' }}><div className="bar" style={{ width:`${overallPct}%`, height:'100%', background:T.goldL, borderRadius:3 }}/></div>
                </div>
                <div style={{ fontSize:26, fontWeight:900, color:T.goldL }}>{overallPct}%</div>
              </div>
            )}
            <div style={{ display:'flex', gap:10, flexWrap:'wrap' }}>
              <Btn v="solid" ac={T.blue} onClick={() => navigate('/training')}>{t('hero_cta1')}</Btn>
              <Btn v="outline" ac="rgba(255,255,255,.9)" style={{ background:'transparent', border:'1.5px solid rgba(255,255,255,.3)' }} onClick={() => navigate('/onboarding')}>{t('hero_cta2')}</Btn>
            </div>
          </div>

          {/* Track list */}
          <div style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.12)', borderRadius:12, padding:22 }}>
            <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.7)', letterSpacing:'.09em', textTransform:'uppercase', marginBottom:16 }}>Six-Track Pathway</div>
            {CURRICULUM.map(tr => {
              const pct = trackPct(tr);
              return (
                <div key={tr.id}
                  role="link" tabIndex={0}
                  onClick={() => navigate('/training')}
                  onKeyDown={e => (e.key==='Enter'||e.key===' ') && (e.preventDefault(), navigate('/training'))}
                  aria-label={`Go to ${tr.title} track — ${pct}% complete`}
                  style={{ display:'flex', gap:10, alignItems:'center', padding:'9px 0', borderBottom:'1px solid rgba(255,255,255,.06)', cursor:'pointer' }}>
                  <div style={{ width:32, height:32, borderRadius:7, background:`${tr.accent}25`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:14, flexShrink:0 }}>{tr.icon}</div>
                  <div style={{ flex:1 }}>
                    <div style={{ fontSize:12, fontWeight:600, color:'#fff', marginBottom:pct>0?3:0 }}>{tr.title}</div>
                    {pct > 0 && <div style={{ height:2, background:'rgba(255,255,255,.15)', borderRadius:1, overflow:'hidden' }}><div className="bar" style={{ width:`${pct}%`, height:'100%', background:tr.accent }}/></div>}
                  </div>
                  <div style={{ fontSize:9, fontWeight:700, color:tr.accentOnDark, background:`${tr.accent}20`, padding:'2px 6px', borderRadius:3, flexShrink:0 }}>{tr.code}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div style={{ background:T.white, borderBottom:`1px solid ${T.border}` }}>
        <div className="sp-stats-bar" style={{ maxWidth:1080, margin:'0 auto', display:'grid', gridTemplateColumns:'repeat(6,1fr)', padding:'0 32px' }}>
          {[['36','Weeks'],['6','Tracks'],['36','Modules'],['9','Simulations'],['23','SOPs'],['80%','Pass Mark']].map(([v,l]) => (
            <div key={l} style={{ textAlign:'center', padding:'22px 8px', borderRight:`1px solid ${T.border}` }}>
              <div style={{ fontSize:22, fontWeight:900, color:T.navyM, letterSpacing:'-.03em' }}>{v}</div>
              <div style={{ fontSize:11, color:T.fog, marginTop:3, fontWeight:500 }}>{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-pronged */}
      <section style={{ maxWidth:1080, margin:'0 auto', padding:'56px 32px' }}>
        <div style={{ textAlign:'center', marginBottom:40 }}>
          <div style={{ fontSize:10, fontWeight:700, color:T.blue, letterSpacing:'.1em', textTransform:'uppercase', marginBottom:10 }}>Two Ways to Learn</div>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:26, fontWeight:700, letterSpacing:'-.025em', color:T.ink }}>One platform, two products.</h2>
        </div>
        <div className="sp-two-col" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:24 }}>
          {[
            { icon:'👤', title:'Individual Learner', color:T.blue, colorSolid:T.blue, badge:'B2C', to:'/register', cta:'Enrol as Individual', points:['Self-paced through all six career tracks','Personal SPS credential on completion','Evidence portfolio — exportable as PDF','Spaced repetition — questions resurface','Leaderboard and streak tracking','EN / GA / FR / AR language support'] },
            { icon:'🏢', title:'Organisation Training', color:T.goldText, colorSolid:T.goldSolid, badge:'B2B', to:'/register', cta:'Set Up Organisation', points:['Enrol and manage your team','Upload company SOPs — AI generates modules','Manager dashboard with completion reporting','GDPR compliance matrix per region (IE/UK/EU)','Hard progression gates with manager approval','Company-branded certificates'] },
          ].map(item => (
            <Card key={item.title} style={{ padding:28 }}>
              <div style={{ display:'flex', gap:12, marginBottom:16 }}>
                <span style={{ fontSize:28 }}>{item.icon}</span>
                <div>
                  <div style={{ display:'flex', gap:8, marginBottom:4 }}><Pill c={item.color}>{item.badge}</Pill></div>
                  <h3 style={{ fontSize:17, fontWeight:800, color:T.ink, letterSpacing:'-.02em' }}>{item.title}</h3>
                </div>
              </div>
              <div style={{ height:1, background:T.border, marginBottom:14 }}/>
              <div style={{ marginBottom:18 }}>
                {item.points.map(p => (
                  <div key={p} style={{ display:'flex', gap:8, padding:'4px 0', fontSize:13, color:T.steel }}>
                    <span style={{ color:item.color, fontSize:10, marginTop:3, flexShrink:0 }}>◆</span>{p}
                  </div>
                ))}
              </div>
              <Btn v="solid" ac={item.colorSolid} onClick={() => navigate(user ? '/training' : item.to)}>{user ? 'Go to Training →' : item.cta}</Btn>
            </Card>
          ))}
        </div>
      </section>

      {/* Learning engine */}
      <section style={{ background:T.navy, padding:'56px 40px' }}>
        <div style={{ maxWidth:1080, margin:'0 auto' }}>
          <div style={{ textAlign:'center', marginBottom:40 }}>
            <h2 style={{ fontFamily:'Georgia,serif', fontSize:24, fontWeight:700, color:'#fff', letterSpacing:'-.025em' }}>Built to challenge, not just inform.</h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:18 }}>
            {[
              { n:'01', icon:'🎯', title:'Hook Scenario', desc:'Every module opens with a real unsolved situation. Attempt it before reading.' },
              { n:'02', icon:'📖', title:'Substantive Content', desc:'SOP-grounded theory with check questions embedded throughout.' },
              { n:'03', icon:'🧠', title:'Mixed Quiz (8+ Q)', desc:'MCQ, scenario-based, short answer (AI-marked), and matching exercises.' },
              { n:'04', icon:'🔁', title:'Spaced Repetition', desc:'Wrong answers resurface after 7 days. Cannot progress without recall.' },
              { n:'05', icon:'📂', title:'Evidence Portfolio', desc:'Your responses saved and exportable as a PDF evidence pack.' },
              { n:'06', icon:'🏆', title:'SPS Credential', desc:'80%+ on all assessments. Human assessor sign-off. Not automated.' },
            ].map(item => (
              <div key={item.n} style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:10, padding:20 }}>
                <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,.6)', marginBottom:10 }}>{item.n}</div>
                <div style={{ fontSize:22, marginBottom:10 }}>{item.icon}</div>
                <div style={{ fontSize:13, fontWeight:700, color:'#fff', marginBottom:6 }}>{item.title}</div>
                <div style={{ fontSize:12, color:'rgba(255,255,255,.5)', lineHeight:1.7 }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section style={{ maxWidth:1080, margin:'0 auto', padding:'56px 32px' }}>
        <h2 style={{ fontFamily:'Georgia,serif', fontSize:22, fontWeight:700, letterSpacing:'-.025em', color:T.ink, textAlign:'center', marginBottom:36 }}>What learners say.</h2>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))', gap:18 }}>
          {[
            { q:'The GDPR module changed how I approach every case. The 80% pass mark is real — you have to know it.', n:'Aoife B.', r:'Intelligence Analyst', i:'AB' },
            { q:'Coming from 4 years as a static guard, the PSO track gave me the structured foundation I was missing.', n:'Declan M.', r:'SOC Analyst', i:'DM' },
            { q:'The scenario-first approach is what sets this apart. You cannot skip to the quiz — you have to think first.', n:'Yemi A.', r:'Analyst in Training', i:'YA' },
          ].map((item, i) => (
            <Card key={i} style={{ padding:24 }}>
              <div style={{ color:T.goldText, fontSize:14, marginBottom:12 }}>★★★★★</div>
              <p style={{ fontSize:13, color:T.steel, lineHeight:1.75, marginBottom:18, fontStyle:'italic' }}>"{item.q}"</p>
              <div style={{ display:'flex', gap:10, alignItems:'center' }}>
                <Avatar i={item.i} size={34} color={T.navyM}/>
                <div><div style={{ fontSize:13, fontWeight:700, color:T.ink }}>{item.n}</div><div style={{ fontSize:11, color:T.fog }}>{item.r}</div></div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <footer style={{ background:T.navy, padding:'36px 32px', color:'rgba(255,255,255,.6)', fontSize:12 }}>
        <div style={{ maxWidth:1080, margin:'0 auto', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:12 }}>
          <span style={{ color:'rgba(255,255,255,.7)', fontWeight:700 }}>SecurePathway</span>
          <span>SPS Standard · Multi-tenant · {Object.values(LANGS).map(l => l.name).join(' / ')}</span>
          <span>© 2026 SecurePathway</span>
        </div>
      </footer>
    </div>
  );
}
