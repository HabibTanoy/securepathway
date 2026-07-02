import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useProgress } from '../../hooks/useProgress.jsx';
import { useLang } from '../../hooks/useLang.jsx';
import { T } from '../../data/tokens.js';
import { Avatar } from '../atoms/index.jsx';

export default function NavBar({ title }) {
  const { user, logout } = useAuth();
  const { calcXP } = useProgress();
  const xp = calcXP();
  const { lang, changeLang, LANGS } = useLang();
  const navigate = useNavigate();
  const loc = useLocation();
  const [drawerOpen, setDrawerOpen] = useState(false);

  const portal = loc.pathname.startsWith('/admin') ? 'admin'
    : loc.pathname.startsWith('/training') ? 'training'
    : loc.pathname.startsWith('/onboarding') ? 'onboarding'
    : loc.pathname.startsWith('/profile') ? 'profile'
    : 'landing';

  const NAV_LINKS = [['/', 'landing','🏠 Home'],['/onboarding','onboarding','📋 Onboarding'],['/training','training','📚 Training'],['/admin','admin','⚙️ Admin'],['/profile','profile','👤 Profile']];

  const closeDrawer = () => setDrawerOpen(false);

  return (
    <>
      {/* Skip nav */}
      <a href="#main-content" style={{ position:'absolute', left:-9999, top:0, zIndex:9999, padding:'8px 16px', background:'#0A1428', color:'#fff', textDecoration:'none', fontSize:14, borderRadius:4 }}
        onFocus={e => e.target.style.left='8px'} onBlur={e => e.target.style.left='-9999px'}>
        Skip to main content
      </a>

      <nav style={{ background:T.white, borderBottom:`1px solid ${T.border}`, height:56, position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 3px rgba(15,32,68,.05)' }}>
        <div className="nav-inner">
          {/* Logo */}
          <Link to="/" onClick={closeDrawer} style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0 }}>
            <div style={{ width:30, height:30, borderRadius:7, background:T.navyM, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
                <rect width="16" height="2" rx="1" fill="white"/>
                <rect y="5" width="12" height="2" rx="1" fill="white"/>
                <rect y="10" width="8" height="2" rx="1" fill="white"/>
              </svg>
            </div>
            <span style={{ fontWeight:800, fontSize:13, color:T.ink, letterSpacing:'-.025em' }}>SecurePathway</span>
          </Link>

          {title && <>
            <div style={{ width:1, height:16, background:T.border, marginLeft:8, marginRight:8 }}/>
            <span style={{ fontSize:12, color:T.fog, fontWeight:500, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</span>
          </>}
          {!title && <div style={{ flex:1 }}/>}

          {/* Desktop nav links */}
          <div className="nav-links" style={{ display:'flex', gap:4, alignItems:'center' }}>
            {NAV_LINKS.map(([path, key, label]) => (
              <Link key={key} to={path}
                style={{ padding:'4px 10px', borderRadius:5, fontSize:11, fontWeight:600, textDecoration:'none', background:portal===key?`${T.blue}10`:'transparent', border:`1px solid ${portal===key?T.blue+'30':T.border}`, color:portal===key?T.blue:T.fog }}>
                {label.replace(/[🏠📋📚⚙️👤] /,'')}
              </Link>
            ))}
          </div>

          {/* Lang picker — desktop */}
          <select className="nav-links" value={lang} onChange={e => changeLang(e.target.value)} aria-label="Select language"
            style={{ fontSize:10, border:`1px solid ${T.border}`, borderRadius:5, padding:'3px 6px', background:T.white, color:T.steel, cursor:'pointer', outline:'none', marginLeft:4 }}>
            {Object.values(LANGS).map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>

          {/* User info — desktop */}
          {user && (
            <div className="nav-links" style={{ display:'flex', alignItems:'center', gap:6, paddingLeft:8, borderLeft:`1px solid ${T.border}` }}>
              <Avatar i={user.initials} size={26} color={user.role==='manager'?T.goldSolid:T.navyM}/>
              <div style={{ lineHeight:1.2 }}>
                <div style={{ fontSize:10, fontWeight:700, color:T.ink }}>{user.name?.split(' ')[0]}</div>
                <div style={{ fontSize:9, color:T.goldText, fontWeight:600 }}>⚡{xp.toLocaleString()} XP</div>
              </div>
              {user.streak > 0 && <div style={{ fontSize:10, color:'#E05A00', fontWeight:700, padding:'2px 6px', background:'#FF6B2212', borderRadius:10 }}>🔥{user.streak}d</div>}
              <button onClick={() => { logout(); navigate('/login'); }}
                style={{ background:'none', border:`1px solid ${T.border}`, borderRadius:4, padding:'2px 6px', fontSize:10, color:T.fog, cursor:'pointer', minHeight:32 }}
                title="Sign out">↺</button>
            </div>
          )}

          {/* Hamburger — mobile only */}
          <button className="nav-mobile-menu" onClick={() => setDrawerOpen(o => !o)}
            aria-label={drawerOpen ? 'Close menu' : 'Open menu'} aria-expanded={drawerOpen}
            style={{ display:'none', background:'none', border:'none', cursor:'pointer', padding:8, color:T.ink, fontSize:22, lineHeight:1 }}>
            {drawerOpen ? '✕' : '☰'}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      <div className={`nav-drawer${drawerOpen ? ' open' : ''}`} role="dialog" aria-label="Navigation menu">
        {user && (
          <div style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', background:'rgba(255,255,255,.06)', borderRadius:8, marginBottom:12 }}>
            <Avatar i={user.initials} size={34} color={user.role==='manager'?T.goldSolid:T.navyM}/>
            <div>
              <div style={{ fontWeight:700, fontSize:13, color:'#fff' }}>{user.name}</div>
              <div style={{ fontSize:11, color:'rgba(255,255,255,.5)' }}>⚡{xp.toLocaleString()} XP{user.streak > 0 ? ` · 🔥${user.streak}d` : ''}</div>
            </div>
          </div>
        )}
        {NAV_LINKS.map(([path, key, label]) => (
          <Link key={key} to={path} onClick={closeDrawer}
            style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 16px', borderRadius:8, fontSize:14, fontWeight:600, textDecoration:'none',
              background:portal===key?'rgba(27,79,228,.15)':'transparent',
              color:portal===key?'#6C92F9':'rgba(255,255,255,.8)', border:`1px solid ${portal===key?'rgba(27,79,228,.3)':'transparent'}` }}>
            {label}
          </Link>
        ))}
        <div style={{ height:1, background:'rgba(255,255,255,.1)', margin:'8px 0' }}/>
        <div style={{ padding:'8px 0' }}>
          <div style={{ fontSize:11, color:'rgba(255,255,255,.4)', marginBottom:6 }}>Language</div>
          <select value={lang} onChange={e => { changeLang(e.target.value); closeDrawer(); }} aria-label="Select language"
            style={{ width:'100%', padding:'10px 12px', borderRadius:7, border:'1px solid rgba(255,255,255,.15)', background:'rgba(255,255,255,.08)', color:'#fff', fontSize:13, outline:'none' }}>
            {Object.values(LANGS).map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>
        {user && (
          <button onClick={() => { logout(); navigate('/login'); closeDrawer(); }}
            style={{ width:'100%', marginTop:8, padding:'12px', borderRadius:8, background:'rgba(214,27,35,.12)', border:'1px solid rgba(214,27,35,.25)', color:'#EE797D', fontSize:13, fontWeight:600, cursor:'pointer' }}>
            Sign out
          </button>
        )}
      </div>
      {/* Backdrop */}
      {drawerOpen && <div onClick={closeDrawer} style={{ position:'fixed', inset:0, zIndex:99, background:'rgba(0,0,0,.4)' }}/>}
    </>
  );
}
