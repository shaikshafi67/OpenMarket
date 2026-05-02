import React, { useState, useRef } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function Login({ onLoginSuccess }) {
  // 'login' | 'forgot-email' | 'forgot-otp' | 'forgot-reset' | 'forgot-done'
  const [mode,       setMode]       = useState('login');
  const [email,      setEmail]      = useState('');
  const [password,   setPassword]   = useState('');
  const [fpEmail,    setFpEmail]    = useState('');
  const [otp,        setOtp]        = useState(['', '', '', '', '', '']);
  const [newPass,    setNewPass]    = useState('');
  const [confirmPass,setConfirmPass]= useState('');
  const [loading,    setLoading]    = useState(false);
  const [error,      setError]      = useState('');
  const [resendCD,   setResendCD]   = useState(0);
  const otpRefs = useRef([]);

  const reset = () => { setError(''); setLoading(false); };

  /* ── Normal login ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await axios.post(`${API}/api/login`, { email, password });
      onLoginSuccess(res.data);
    } catch {
      setError('Invalid email or password.');
    } finally { setLoading(false); }
  };

  /* ── Forgot: send OTP ── */
  const sendForgotOTP = async (e) => {
    e?.preventDefault();
    if (!fpEmail) return setError('Enter your email');
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/api/auth/send-otp`, { email: fpEmail, type: 'reset' });
      setMode('forgot-otp');
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP.');
    } finally { setLoading(false); }
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (idx, val) => {
    const digits = val.replace(/\D/g, '').slice(0, 1);
    const next = [...otp]; next[idx] = digits; setOtp(next);
    if (digits && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKey = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) { setOtp(paste.split('')); otpRefs.current[5]?.focus(); }
  };

  /* ── Forgot: verify OTP ── */
  const verifyOTP = async () => {
    const code = otp.join('');
    if (code.length < 6) return setError('Enter all 6 digits');
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/api/auth/verify-otp`, { email: fpEmail, otp: code });
      setMode('forgot-reset');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid OTP.');
    } finally { setLoading(false); }
  };

  /* ── Forgot: reset password ── */
  const resetPassword = async (e) => {
    e.preventDefault();
    if (newPass.length < 6) return setError('Password must be at least 6 characters');
    if (newPass !== confirmPass) return setError('Passwords do not match');
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/api/auth/reset-password`, { email: fpEmail, otp: otp.join(''), newPassword: newPass });
      setMode('forgot-done');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to reset password.');
    } finally { setLoading(false); }
  };

  /* ── Resend countdown ── */
  const startCountdown = () => {
    setResendCD(30);
    const t = setInterval(() => {
      setResendCD(prev => { if (prev <= 1) { clearInterval(t); return 0; } return prev - 1; });
    }, 1000);
  };
  const resendOTP = async () => {
    if (resendCD > 0) return;
    setOtp(['', '', '', '', '', '']); setError(''); setLoading(true);
    try {
      await axios.post(`${API}/api/auth/send-otp`, { email: fpEmail, type: 'reset' });
      startCountdown();
    } catch (err) { setError(err.response?.data?.error || 'Failed to resend.'); }
    finally { setLoading(false); }
  };

  /* ─────────────────── RENDER ─────────────────── */

  /* Success */
  if (mode === 'forgot-done') return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: '52px', marginBottom: '16px' }}>✅</div>
      <h2 style={formTitle}>Password Reset!</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>Your password has been updated. You can now login.</p>
      <button style={btnStyle} onClick={() => { reset(); setMode('login'); }}>Back to Login</button>
    </div>
  );

  /* Forgot - new password */
  if (mode === 'forgot-reset') return (
    <div style={formWrapper}>
      <button style={backBtn} onClick={() => { reset(); setMode('forgot-otp'); }}>← Back</button>
      <h2 style={formTitle}>New Password</h2>
      <p style={formSub}>Enter your new password for <strong>{fpEmail}</strong></p>
      {error && <div style={errorBox}>{error}</div>}
      <form onSubmit={resetPassword}>
        <div style={fieldGroup}>
          <label style={fieldLabel}>New Password</label>
          <input className="premium-input" type="password" placeholder="Min. 6 characters"
            required minLength={6} style={inputStyle} value={newPass}
            onChange={e => setNewPass(e.target.value)} autoFocus />
        </div>
        <div style={fieldGroup}>
          <label style={fieldLabel}>Confirm Password</label>
          <input className="premium-input" type="password" placeholder="Repeat password"
            required style={inputStyle} value={confirmPass}
            onChange={e => setConfirmPass(e.target.value)} />
        </div>
        <button type="submit" style={{ ...btnStyle, opacity: loading ? 0.75 : 1 }} disabled={loading}>
          {loading ? 'Resetting…' : 'Reset Password'}
        </button>
      </form>
    </div>
  );

  /* Forgot - OTP entry */
  if (mode === 'forgot-otp') return (
    <div style={formWrapper}>
      <button style={backBtn} onClick={() => { reset(); setMode('forgot-email'); }}>← Back</button>
      <h2 style={formTitle}>Enter OTP</h2>
      <p style={formSub}>We sent a code to <strong>{fpEmail}</strong></p>
      {error && <div style={errorBox}>{error}</div>}
      <div style={otpRow}>
        {otp.map((digit, i) => (
          <input key={i} ref={el => otpRefs.current[i] = el}
            style={{ ...otpBox, borderColor: digit ? '#002f34' : '#e0e0e0' }}
            type="text" inputMode="numeric" maxLength={1} value={digit}
            onChange={e => handleOtpChange(i, e.target.value)}
            onKeyDown={e => handleOtpKey(i, e)}
            onPaste={handleOtpPaste}
            autoFocus={i === 0} />
        ))}
      </div>
      <button style={{ ...btnStyle, opacity: loading ? 0.75 : 1, marginBottom: '14px' }}
        onClick={verifyOTP} disabled={loading || otp.join('').length < 6}>
        {loading ? 'Verifying…' : 'Verify OTP'}
      </button>
      <p style={resendRow}>
        Didn't get it?&nbsp;
        {resendCD > 0
          ? <span style={{ color: '#aaa' }}>Resend in {resendCD}s</span>
          : <span style={resendLink} onClick={resendOTP}>Resend OTP</span>}
      </p>
    </div>
  );

  /* Forgot - email entry */
  if (mode === 'forgot-email') return (
    <div style={formWrapper}>
      <button style={backBtn} onClick={() => { reset(); setMode('login'); }}>← Back to Login</button>
      <h2 style={formTitle}>Forgot Password</h2>
      <p style={formSub}>Enter your registered email. We'll send you an OTP.</p>
      {error && <div style={errorBox}>{error}</div>}
      <form onSubmit={sendForgotOTP}>
        <div style={fieldGroup}>
          <label style={fieldLabel}>Email Address</label>
          <input className="premium-input" type="email" placeholder="you@example.com"
            required style={inputStyle} value={fpEmail}
            onChange={e => setFpEmail(e.target.value)} autoFocus />
        </div>
        <button type="submit" style={{ ...btnStyle, opacity: loading ? 0.75 : 1 }} disabled={loading}>
          {loading ? 'Sending…' : 'Send OTP'}
        </button>
      </form>
    </div>
  );

  /* Normal login */
  return (
    <div style={formWrapper}>
      <h2 style={formTitle}>Welcome Back</h2>
      <p style={formSub}>Sign in to your OpenMarket account</p>
      {error && <div style={errorBox}>{error}</div>}
      <form onSubmit={handleLogin}>
        <div style={fieldGroup}>
          <label style={fieldLabel}>Email Address</label>
          <input className="premium-input" type="email" placeholder="you@example.com"
            required style={inputStyle} onChange={e => setEmail(e.target.value)} />
        </div>
        <div style={fieldGroup}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
            <label style={fieldLabel}>Password</label>
            <button type="button" style={forgotLink}
              onClick={() => { reset(); setMode('forgot-email'); }}>
              Forgot password?
            </button>
          </div>
          <input className="premium-input" type="password" placeholder="Enter your password"
            required style={inputStyle} onChange={e => setPassword(e.target.value)} />
        </div>
        <button className="premium-btn" type="submit"
          style={{ ...btnStyle, opacity: loading ? 0.75 : 1 }} disabled={loading}>
          {loading ? 'Signing in…' : 'Login to Market'}
        </button>
      </form>
    </div>
  );
}

/* ── STYLES ── */
const formWrapper  = { textAlign: 'left' };
const formTitle    = { fontSize: '24px', color: '#002f34', marginBottom: '4px', fontWeight: '900' };
const formSub      = { fontSize: '14px', color: '#888', marginBottom: '20px', marginTop: 0 };
const fieldGroup   = { marginBottom: '16px' };
const fieldLabel   = { display: 'block', fontSize: '13px', fontWeight: '700', color: '#002f34', margin: 0 };
const inputStyle   = { width: '100%', padding: '13px 16px', borderRadius: '10px', border: '1.5px solid #e0e0e0', boxSizing: 'border-box', fontSize: '15px', color: '#333', backgroundColor: '#fafafa' };
const btnStyle     = { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #002f34, #004a52)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', letterSpacing: '0.3px', display: 'block' };
const errorBox     = { padding: '12px 16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecaca' };
const forgotLink   = { background: 'none', border: 'none', cursor: 'pointer', color: '#3a7bd5', fontSize: '13px', fontWeight: '600', padding: 0 };
const backBtn      = { background: 'none', border: 'none', cursor: 'pointer', color: '#002f34', fontWeight: '700', fontSize: '14px', padding: '0 0 16px', display: 'flex', alignItems: 'center', gap: '4px' };
const otpRow       = { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' };
const otpBox       = { width: '46px', height: '54px', textAlign: 'center', fontSize: '24px', fontWeight: '800', color: '#002f34', border: '2px solid #e0e0e0', borderRadius: '10px', outline: 'none', backgroundColor: '#fafafa', transition: 'border-color 0.2s' };
const resendRow    = { textAlign: 'center', fontSize: '13px', color: '#888', margin: 0 };
const resendLink   = { color: '#3a7bd5', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' };
