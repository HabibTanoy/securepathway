import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.jsx';
import { useProgress } from '../../hooks/useProgress.jsx';
import { useLang } from '../../hooks/useLang.jsx';
import { T } from '../../data/tokens.js';
import { Avatar } from '../atoms/index.jsx';

export default function NavBar({ title }) {
  const { user, logout } = useAuth();
  const { xp } = useProgress();
  const { lang, changeLang, LANGS } = useLang();
  const navigate = useNavigate();
  const loc = useLocation();

  const portal = loc.pathname.startsWith('/admin') ? 'admin'
    : loc.pathname.startsWith('/training') ? 'training'
    : loc.pathname.startsWith('/onboarding') ? 'onboarding'
    : loc.pathname.startsWith('/profile') ? 'profile'
    : 'landing';

  return (
    <nav style={{ background:T.white, borderBottom:`1px solid ${T.border}`, height:56, display:'flex', alignItems:'center', padding:'0 20px', gap:12, position:'sticky', top:0, zIndex:100, boxShadow:'0 1px 3px rgba(15,32,68,.05)' }}>
      <Link to="/" style={{ display:'flex', alignItems:'center', gap:8, textDecoration:'none', flexShrink:0 }}>
        <a href="#main-content" style={{ position:'absolute', left:-9999, top:0, zIndex:9999, padding:'8px 16px', background:'#0A1428', color:'#fff', textDecoration:'none', fontSize:14, borderRadius:4 }}
  onFocus={e => e.target.style.left='8px'}
  onBlur={e => e.target.style.left='-9999px'}
>Skip to main content</a>
      <div style={{ width:30, height:30, borderRadius:7, background:T.navyM, display:'flex', alignItems:'center', justifyContent:'center' }}>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <rect width="16" height="2" rx="1" fill="white"/>
            <rect y="5" width="12" height="2" rx="1" fill="white"/>
            <rect y="10" width="8" height="2" rx="1" fill="white"/>
          </svg>
        </div>
        <span style={{ fontWeight:800, fontSize:13, color:T.ink, letterSpacing:'-.025em' }}>SecurePathway</span>
      </Link>

      {title && <>
        <div style={{ width:1, height:16, background:T.border }}/>
        <span style={{ fontSize:12, color:T.fog, fontWeight:500, flex:1, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{title}</span>
      </>}
      {!title && <div style={{ flex:1 }}/>}

      {/* Portal nav */}
      <div style={{ display:'flex', gap:4 }}>
        {[['/', 'landing','Home'],['/onboarding','onboarding','Onboarding'],['/training','training','Training'],['/admin','admin','Admin'],['/profile','profile','Profile']].map(([path, key, label]) => (
          <Link key={key} to={path}
            style={{ padding:'4px 10px', borderRadius:5, fontSize:11, fontWeight:600, textDecoration:'none', background:portal===key?`${T.blue}10`:'transparent', border:`1px solid ${portal===key?T.blue+'30':T.border}`, color:portal===key?T.blue:T.fog }}>
            {label}
          </Link>
        ))}
      </div>

      {/* Lang picker */}
      <select value={lang} onChange={e => changeLang(e.target.value)} aria-label="Select language"
        style={{ fontSize:10, border:`1px solid ${T.border}`, borderRadius:5, padding:'3px 6px', background:T.white, color:T.steel, cursor:'pointer', outline:'none' }}>
        {Object.values(LANGS).map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
      </select>

      {/* User info */}
      {user && (
        <div style={{ display:'flex', alignItems:'center', gap:6, paddingLeft:8, borderLeft:`1px solid ${T.border}` }}>
          <Avatar i={user.initials} size={26} color={user.role==='manager'?T.goldSolid:T.navyM}/>
          <div style={{ lineHeight:1.2 }}>
            <div style={{ fontSize:10, fontWeight:700, color:T.ink }}>{user.name?.split(' ')[0]}</div>
            <div style={{ fontSize:9, color:T.goldText, fontWeight:600 }}>⚡{xp.toLocaleString()} XP</div>
          </div>
          {user.streak > 0 && (
            <div style={{ fontSize:10, color:'#E05A00', fontWeight:700, padding:'2px 6px', background:'#FF6B2212', borderRadius:10 }}>
              🔥{user.streak}d
            </div>
          )}
          <button onClick={() => { logout(); navigate('/login'); }}
            style={{ background:'none', border:`1px solid ${T.border}`, borderRadius:4, padding:'2px 6px', fontSize:10, color:T.fog, cursor:'pointer' }}
            title="Sign out">↺</button>
        </div>
      )}
    </nav>
  );
}
