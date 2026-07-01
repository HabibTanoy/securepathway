import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth.jsx';
import { useLang } from '../hooks/useLang.jsx';
import { T } from '../data/tokens.js';
import { Btn, Card, Divider, Avatar } from '../components/atoms/index.jsx';
import NavBar from '../components/layout/NavBar.jsx';
import Toast from '../components/layout/Toast.jsx';
import { mfaAPI } from '../lib/api.js';
import QRCode from 'qrcode';

export default function ProfilePage() {
  const { user, updateUser } = useAuth();
  const { lang, changeLang, LANGS, t } = useLang();
  const [toast, setToast] = useState(null);

  // MFA state
  const [mfaEnabled, setMfaEnabled] = useState(null); // null = loading
  const [setupData, setSetupData] = useState(null);   // { secret, url, qrDataUrl }
  const [setupLoading, setSetupLoading] = useState(false);
  const [confirmToken, setConfirmToken] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [disableToken, setDisableToken] = useState('');
  const [disableLoading, setDisableLoading] = useState(false);

  const notify = (msg, type = 'ok') => { setToast({ msg, type }); setTimeout(() => setToast(null), 3500); };

  const loadStatus = useCallback(() => {
    mfaAPI.status().then(d => setMfaEnabled(d.enabled)).catch(() => setMfaEnabled(false));
  }, []);

  useEffect(() => { loadStatus(); }, [loadStatus]);

  async function startSetup() {
    setSetupLoading(true);
    try {
      const { secret, url } = await mfaAPI.setup();
      const qrDataUrl = await QRCode.toDataURL(url, { width: 220, margin: 1, color: { dark: '#0F1F3D', light: '#FFFFFF' } });
      setSetupData({ secret, url, qrDataUrl });
    } catch (err) {
      notify(err.response?.data?.error || 'Could not start MFA setup', 'err');
    } finally {
      setSetupLoading(false);
    }
  }

  async function confirmSetup(e) {
    e.preventDefault();
    if (confirmToken.length !== 6) return;
    setConfirmLoading(true);
    try {
      await mfaAPI.confirm(confirmToken);
      notify('MFA enabled — your account is now protected with two-factor authentication');
      setSetupData(null);
      setConfirmToken('');
      setMfaEnabled(true);
    } catch (err) {
      notify(err.response?.data?.error || 'Invalid code — try again', 'err');
      setConfirmToken('');
    } finally {
      setConfirmLoading(false);
    }
  }

  async function disableMfa(e) {
    e.preventDefault();
    if (disableToken.length !== 6) return;
    setDisableLoading(true);
    try {
      await mfaAPI.disable(disableToken);
      notify('MFA has been disabled for your account');
      setShowDisable(false);
      setDisableToken('');
      setMfaEnabled(false);
    } catch (err) {
      notify(err.response?.data?.error || 'Invalid code — try again', 'err');
      setDisableToken('');
    } finally {
      setDisableLoading(false);
    }
  }

  const codeInputStyle = {
    width: '100%', padding: '10px 13px', borderRadius: 6, border: `1.5px solid ${T.border}`,
    fontSize: 22, textAlign: 'center', letterSpacing: '0.3em', fontWeight: 700,
    outline: 'none', color: T.ink, boxSizing: 'border-box',
  };

  return (
    <div style={{ background: T.page, minHeight: '100vh' }}>
      <NavBar title="Profile & Security" />
      <Toast toast={toast} />

      <main id="main-content" style={{ maxWidth: 720, margin: '0 auto', padding: '32px 24px' }}>

        {/* Account header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 28 }}>
          <Avatar i={user?.initials} size={56} color={user?.role === 'manager' ? T.goldSolid : T.navyM} />
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: T.ink, letterSpacing: '-.02em' }}>{user?.name}</div>
            <div style={{ fontSize: 13, color: T.fog }}>{user?.tenant?.name} · {user?.role}</div>
          </div>
        </div>

        {/* Language preference */}
        <Card style={{ padding: 24, marginBottom: 20 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, marginBottom: 4 }}>Language</div>
          <p style={{ fontSize: 12, color: T.fog, marginBottom: 14 }}>Choose the language SecurePathway is displayed in.</p>
          <select value={lang} onChange={e => changeLang(e.target.value)}
            aria-label="Select language"
            style={{ fontSize: 13, border: `1.5px solid ${T.border}`, borderRadius: 6, padding: '8px 12px', background: T.white, color: T.ink, cursor: 'pointer', outline: 'none' }}>
            {Object.values(LANGS).map(l => <option key={l.code} value={l.code}>{l.name}</option>)}
          </select>
        </Card>

        {/* MFA */}
        <Card style={{ padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 14, color: T.ink, marginBottom: 4 }}>Two-factor authentication (MFA)</div>
              <p style={{ fontSize: 12, color: T.fog, maxWidth: 460 }}>
                Protect your account with a 6-digit code from an authenticator app, in addition to your password.
              </p>
            </div>
            {mfaEnabled !== null && (
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: '.06em', textTransform: 'uppercase',
                padding: '3px 10px', borderRadius: 12, flexShrink: 0,
                background: mfaEnabled ? `${T.greenL}14` : `${T.fog}14`,
                color: mfaEnabled ? T.greenText : T.fog,
                border: `1px solid ${mfaEnabled ? T.greenL : T.fog}30`,
              }}>
                {mfaEnabled ? 'Enabled' : 'Disabled'}
              </span>
            )}
          </div>

          <Divider y={16} />

          {mfaEnabled === null && (
            <p style={{ fontSize: 13, color: T.fog }}>Checking status…</p>
          )}

          {/* ── ENABLED, no action pending ── */}
          {mfaEnabled === true && !showDisable && (
            <div>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', background: `${T.greenL}08`, border: `1px solid ${T.greenL}25`, borderRadius: 7, padding: '12px 14px', marginBottom: 16 }}>
                <span style={{ fontSize: 18 }} aria-hidden="true">🔐</span>
                <span style={{ fontSize: 13, color: T.green }}>Your account is protected with two-factor authentication.</span>
              </div>
              <Btn v="danger" sm onClick={() => setShowDisable(true)}>Disable MFA</Btn>
            </div>
          )}

          {/* ── DISABLE FLOW ── */}
          {mfaEnabled === true && showDisable && (
            <form onSubmit={disableMfa} noValidate>
              <p style={{ fontSize: 13, color: T.steel, marginBottom: 14 }}>
                Enter a current code from your authenticator app to confirm disabling MFA.
              </p>
              <label htmlFor="disable-code" style={{ fontSize: 11, fontWeight: 600, color: T.fog, display: 'block', marginBottom: 5 }}>
                Authenticator code
              </label>
              <input
                id="disable-code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
                value={disableToken} onChange={e => setDisableToken(e.target.value.replace(/\D/g, ''))}
                placeholder="000000" autoComplete="one-time-code" autoFocus required
                aria-label="6-digit authenticator code"
                style={{ ...codeInputStyle, marginBottom: 14, maxWidth: 220 }}
              />
              <div style={{ display: 'flex', gap: 10 }}>
                <Btn v="danger" disabled={disableLoading || disableToken.length !== 6} onClick={disableMfa}>
                  {disableLoading ? 'Disabling…' : 'Confirm disable'}
                </Btn>
                <Btn v="ghost" onClick={() => { setShowDisable(false); setDisableToken(''); }}>Cancel</Btn>
              </div>
            </form>
          )}

          {/* ── DISABLED, no setup started ── */}
          {mfaEnabled === false && !setupData && (
            <Btn v="solid" ac={T.blue} disabled={setupLoading} onClick={startSetup}>
              {setupLoading ? 'Preparing…' : 'Enable MFA'}
            </Btn>
          )}

          {/* ── SETUP IN PROGRESS ── */}
          {mfaEnabled === false && setupData && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24, marginBottom: 18 }}>
                <div style={{ textAlign: 'center' }}>
                  <img src={setupData.qrDataUrl} alt="MFA setup QR code — scan with your authenticator app" width={220} height={220}
                    style={{ borderRadius: 8, border: `1px solid ${T.border}` }} />
                </div>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 700, color: T.fog, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Step 1 — Scan or enter manually
                  </div>
                  <p style={{ fontSize: 13, color: T.steel, lineHeight: 1.7, marginBottom: 10 }}>
                    Scan this QR code with an authenticator app (Google Authenticator, Authy, 1Password, etc). Can't scan? Enter this code manually:
                  </p>
                  <div style={{ fontFamily: 'monospace', fontSize: 13, background: T.off, border: `1px solid ${T.border}`, borderRadius: 6, padding: '8px 12px', wordBreak: 'break-all', color: T.ink, marginBottom: 16 }}>
                    {setupData.secret}
                  </div>
                </div>
              </div>

              <Divider y={4} />

              <form onSubmit={confirmSetup} noValidate style={{ marginTop: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: T.fog, letterSpacing: '.06em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Step 2 — Confirm with a code
                </div>
                <label htmlFor="confirm-code" style={{ fontSize: 11, fontWeight: 600, color: T.fog, display: 'block', marginBottom: 5 }}>
                  Enter the 6-digit code from your app
                </label>
                <input
                  id="confirm-code" type="text" inputMode="numeric" pattern="[0-9]{6}" maxLength={6}
                  value={confirmToken} onChange={e => setConfirmToken(e.target.value.replace(/\D/g, ''))}
                  placeholder="000000" autoComplete="one-time-code" autoFocus required
                  aria-label="6-digit authenticator code to confirm setup"
                  style={{ ...codeInputStyle, marginBottom: 14, maxWidth: 220 }}
                />
                <div style={{ display: 'flex', gap: 10 }}>
                  <Btn v="solid" ac={T.greenText} disabled={confirmLoading || confirmToken.length !== 6} onClick={confirmSetup}>
                    {confirmLoading ? 'Confirming…' : 'Confirm & enable MFA'}
                  </Btn>
                  <Btn v="ghost" onClick={() => { setSetupData(null); setConfirmToken(''); }}>Cancel</Btn>
                </div>
              </form>
            </div>
          )}
        </Card>

      </main>
    </div>
  );
}
