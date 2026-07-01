import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLang } from '../hooks/useLang.jsx';
import { T } from '../data/tokens.js';
import { Btn } from '../components/atoms/index.jsx';
import api, { authAPI } from '../lib/api.js';

export default function LoginPage() {
  const { login } = useAuth();
  const { lang, changeLang, LANGS, t } = useLang();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  // MFA challenge state
  const [mfaPending, setMfaPending] = useState(null); // { userId }
  const [mfaToken, setMfaToken] = useState('');
  const [mfaLoading, setMfaLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await login(form.email, form.password);
      if (result?.mfaRequired) {
        setMfaPending({ userId: result.userId });
        setLoading(false);
        return;
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const submitMfa = async (e) => {
    e.preventDefault();
    if (mfaToken.length !== 6) { setError('Enter your 6-digit code'); return; }
    setError('');
    setMfaLoading(true);
    try {
      await login(form.email, form.password, mfaToken);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid code — try again');
      setMfaToken('');
    } finally {
      setMfaLoading(false);
    }
  };

  const inputStyle = {
    width: '100%', padding: '10px 13px', borderRadius: 6,
    border: '1.5px solid rgba(255,255,255,.15)', background: 'rgba(255,255,255,.08)',
    color: '#fff', fontSize: 14, outline: 'none', boxSizing: 'border-box',
  };

  return (
    <div style={{ background: T.navy, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
      <div style={{ width: '100%', maxWidth: 420 }}>

        {/* Lang picker */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
          <select value={lang} onChange={e => changeLang(e.target.value)}
            aria-label="Select language"
            style={{ fontSize: 12, border: '1px solid rgba(255,255,255,.2)', borderRadius: 6, padding: '4px 10px', background: 'rgba(255,255,255,.08)', color: 'rgba(255,255,255,.7)', cursor: 'pointer', outline: 'none' }}>
            {Object.values(LANGS).map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </div>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div role="img" aria-label="SecurePathway logo" style={{ width: 52, height: 52, borderRadius: 12, background: 'rgba(255,255,255,.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <svg width="26" height="20" viewBox="0 0 26 20" fill="none" aria-hidden="true">
              <rect width="26" height="3.5" rx="1.75" fill="white"/>
              <rect y="8.25" width="19" height="3.5" rx="1.75" fill="white"/>
              <rect y="16.5" width="12" height="3.5" rx="1.75" fill="white"/>
            </svg>
          </div>
          <div style={{ fontWeight: 900, fontSize: 24, color: '#fff', letterSpacing: '-.03em', marginBottom: 6 }}>SecurePathway</div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,.7)' }}>{t('auth_sub')}</div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(200,149,42,.15)', border: '1px solid rgba(200,149,42,.35)', color: T.goldL, borderRadius: 12, padding: '3px 12px', fontSize: 10, fontWeight: 700, letterSpacing: '.1em', marginTop: 10, textTransform: 'uppercase' }}>
            SPS Standard
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,.06)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 12, padding: 28 }}>

          {/* ── MFA CHALLENGE ── */}
          {mfaPending ? (
            <form onSubmit={submitMfa} noValidate>
              <div style={{ textAlign: 'center', marginBottom: 20 }}>
                <div style={{ fontSize: 28, marginBottom: 8 }}>🔐</div>
                <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 6 }}>Two-factor authentication</div>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,.5)', lineHeight: 1.6 }}>
                  Open your authenticator app and enter the 6-digit code.
                </p>
              </div>

              {error && (
                <div role="alert" style={{ background: `${T.redL}15`, border: `1px solid ${T.redL}30`, borderRadius: 7, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: T.redOnDark }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="mfa-code" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.5)', display: 'block', marginBottom: 5 }}>
                  Authenticator code
                </label>
                <input
                  id="mfa-code"
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={mfaToken}
                  onChange={e => setMfaToken(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000"
                  autoComplete="one-time-code"
                  autoFocus
                  required
                  aria-label="6-digit authenticator code"
                  style={{ ...inputStyle, textAlign: 'center', fontSize: 24, letterSpacing: '0.3em', fontWeight: 700 }}
                />
              </div>

              <Btn type="submit" v="solid" ac={T.blue} full disabled={mfaLoading || mfaToken.length !== 6}>
                {mfaLoading ? 'Verifying…' : 'Verify code'}
              </Btn>

              <button type="button" onClick={() => { setMfaPending(null); setMfaToken(''); setError(''); }}
                style={{ display: 'block', width: '100%', marginTop: 12, background: 'none', border: 'none', color: 'rgba(255,255,255,.6)', fontSize: 12, cursor: 'pointer', textAlign: 'center' }}>
                ← Back to login
              </button>
            </form>

          ) : (
            // ── STANDARD LOGIN ──
            <form onSubmit={submit} noValidate>
              <div style={{ fontWeight: 700, fontSize: 16, color: '#fff', marginBottom: 20 }}>Sign in</div>

              {error && (
                <div role="alert" style={{ background: `${T.redL}15`, border: `1px solid ${T.redL}30`, borderRadius: 7, padding: '10px 14px', marginBottom: 16, fontSize: 13, color: T.redOnDark }}>
                  {error}
                </div>
              )}

              <div style={{ marginBottom: 14 }}>
                <label htmlFor="login-email" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.5)', display: 'block', marginBottom: 5 }}>
                  Email
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="you@example.com"
                  required
                  autoComplete="email"
                  style={inputStyle}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label htmlFor="login-password" style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,.5)', display: 'block', marginBottom: 5 }}>
                  Password
                </label>
                <input
                  id="login-password"
                  type="password"
                  value={form.password}
                  onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  style={inputStyle}
                />
              </div>

              <Btn type="submit" v="solid" ac={T.blue} full disabled={loading}>
                {loading ? 'Signing in…' : 'Sign in'}
              </Btn>
            </form>
          )}

          {!mfaPending && (
            <div style={{ textAlign: 'center', marginTop: 18, fontSize: 13, color: 'rgba(255,255,255,.6)' }}>
              No account?{' '}
              <Link to="/register" style={{ color: T.blueOnDark, textDecoration: 'none', fontWeight: 600 }}>Create one</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
