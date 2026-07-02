import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLang } from '../hooks/useLang.jsx';
import { T } from '../data/tokens.js';
import { Btn } from '../components/atoms/index.jsx';

export default function RegisterPage() {
  const { register } = useAuth();
  const { lang, changeLang, LANGS, t } = useLang();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const inviteToken = params.get('invite');

  const [accountType, setAccountType] = useState(null); // individual | company
  const [form, setForm] = useState({ fullName:'', email:'', password:'', orgName:'', region:'IE' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return; }
    setError(''); setLoading(true);
    try {
      await register({ ...form, name: form.fullName, inviteToken });
      navigate('/onboarding');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const field = (label, name, type = 'text', ph = '') => (
    <div style={{ marginBottom:14 }}>
      <label htmlFor={`reg-${name}`} style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.5)', display:'block', marginBottom:5 }}>{label}</label>
      <input id={`reg-${name}`} type={type} value={form[name]} onChange={e => setForm(f=>({...f,[name]:e.target.value}))}
        placeholder={ph} required={name !== 'orgName'}
        autoComplete={name === 'email' ? 'email' : name === 'password' ? 'new-password' : name === 'fullName' ? 'name' : 'off'}
        style={{ width:'100%', padding:'10px 13px', borderRadius:6, border:'1.5px solid rgba(255,255,255,.15)', background:'rgba(255,255,255,.08)', color:'#fff', fontSize:14, outline:'none' }}/>
    </div>
  );

  return (
    <div style={{ background:T.navy, minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', padding:24 }}>
      <div style={{ width:'100%', maxWidth:480 }}>
        <div style={{ display:'flex', justifyContent:'flex-end', marginBottom:16 }}>
          <select value={lang} onChange={e => changeLang(e.target.value)} aria-label="Select language"
            style={{ fontSize:12, border:'1px solid rgba(255,255,255,.2)', borderRadius:6, padding:'4px 10px', background:'rgba(255,255,255,.08)', color:'rgba(255,255,255,.7)', cursor:'pointer', outline:'none' }}>
            {Object.values(LANGS).map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ fontWeight:900, fontSize:22, color:'#fff', letterSpacing:'-.03em', marginBottom:4 }}>SecurePathway</div>
          <div style={{ fontSize:13, color:'rgba(255,255,255,.6)' }}>Create your account</div>
        </div>

        {!accountType && !inviteToken ? (
          <div className="fade">
            <div className="sp-account-cards" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:16 }}>
              {[
                { key:'individual', icon:'👤', title:t('auth_individual'), desc:'Self-paced learning, personal SPS credential' },
                { key:'company',    icon:'🏢', title:t('auth_company'),    desc:'Team training, company SOP integration, admin dashboard' },
              ].map(opt => (
                <div key={opt.key} onClick={() => setAccountType(opt.key)} className="hcard"
                  style={{ background:'rgba(255,255,255,.06)', border:'1.5px solid rgba(255,255,255,.12)', borderRadius:10, padding:20, cursor:'pointer', textAlign:'center' }}>
                  <div style={{ fontSize:28, marginBottom:10 }}>{opt.icon}</div>
                  <div style={{ fontWeight:700, fontSize:13, color:'#fff', marginBottom:6, lineHeight:1.4 }}>{opt.title}</div>
                  <div style={{ fontSize:11, color:'rgba(255,255,255,.6)', lineHeight:1.55 }}>{opt.desc}</div>
                </div>
              ))}
            </div>
            <div style={{ textAlign:'center', fontSize:13, color:'rgba(255,255,255,.6)' }}>
              Already have an account? <Link to="/login" style={{ color:T.blueOnDark, textDecoration:'none', fontWeight:600 }}>Sign in</Link>
            </div>
          </div>
        ) : (
          <div className="fade" style={{ background:'rgba(255,255,255,.06)', border:'1px solid rgba(255,255,255,.1)', borderRadius:12, padding:28 }}>
            {!inviteToken && (
              <button onClick={() => setAccountType(null)} style={{ background:'none', border:'none', color:'rgba(255,255,255,.6)', fontSize:12, cursor:'pointer', marginBottom:16 }}>
                ← Back
              </button>
            )}
            <div style={{ fontWeight:700, fontSize:15, color:'#fff', marginBottom:20 }}>
              {inviteToken ? 'Accept your invitation' : accountType === 'company' ? 'Organisation account' : 'Individual learner'}
            </div>

            {error && (
              <div role="alert" style={{ background:`${T.redL}15`, border:`1px solid ${T.redL}30`, borderRadius:7, padding:'10px 14px', marginBottom:16, fontSize:13, color:T.redOnDark }}>
                {error}
              </div>
            )}

            <form onSubmit={submit}>
              {field(t('auth_name'), 'fullName', 'text', 'Jane Smith')}
              {field('Email', 'email', 'email', 'jane@example.com')}
              {field('Password', 'password', 'password', 'Min. 8 characters')}
              {(accountType === 'company' && !inviteToken) && field(t('auth_org'), 'orgName', 'text', 'Apex Security Ltd')}
              {!inviteToken && (
                <div style={{ marginBottom:20 }}>
                  <label htmlFor="reg-region" style={{ fontSize:11, fontWeight:600, color:'rgba(255,255,255,.5)', display:'block', marginBottom:5 }}>{t('auth_region')}</label>
                  <select id="reg-region" value={form.region} onChange={e => setForm(f=>({...f,region:e.target.value}))}
                    style={{ width:'100%', padding:'10px 12px', borderRadius:6, border:'1.5px solid rgba(255,255,255,.15)', background:'rgba(20,40,80,.9)', color:'#fff', fontSize:13, outline:'none' }}>
                    <option value="IE">Ireland (GDPR + DPC)</option>
                    <option value="UK">UK (UK GDPR + DPA 2018)</option>
                    <option value="EU_EEA">EU/EEA (GDPR)</option>
                  </select>
                </div>
              )}
              <Btn type="submit" v="solid" ac={T.blue} full disabled={loading}>
                {loading ? 'Creating account...' : t('auth_start')}
              </Btn>
            </form>
            <div style={{ textAlign:'center', marginTop:14, fontSize:13, color:'rgba(255,255,255,.6)' }}>
              Already have an account? <Link to="/login" style={{ color:T.blueOnDark, textDecoration:'none', fontWeight:600 }}>Sign in</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
