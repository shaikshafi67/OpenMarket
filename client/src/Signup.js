import React, { useState, useRef } from 'react';
import axios from 'axios';

const API = '';

export default function Signup({ onSignupSuccess }) {
  const [step,     setStep]     = useState(1); // 1=form, 2=otp
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [otp,      setOtp]      = useState(['', '', '', '', '', '']);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');
  const [resendCD, setResendCD] = useState(0); // countdown
  const otpRefs = useRef([]);

  /* ── Step 1: send OTP ── */
  const sendOTP = async (e) => {
    e?.preventDefault();
    if (!formData.name || !formData.email || !formData.password)
      return setError('Please fill all fields');
    if (formData.password.length < 6)
      return setError('Password must be at least 6 characters');
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/api/auth/send-otp`, { email: formData.email, type: 'register' });
      setStep(2);
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send OTP. Try again.');
    } finally { setLoading(false); }
  };

  /* ── OTP input handlers ── */
  const handleOtpChange = (idx, val) => {
    const digits = val.replace(/\D/g, '').slice(0, 1);
    const next = [...otp];
    next[idx] = digits;
    setOtp(next);
    if (digits && idx < 5) otpRefs.current[idx + 1]?.focus();
  };
  const handleOtpKey = (idx, e) => {
    if (e.key === 'Backspace' && !otp[idx] && idx > 0) otpRefs.current[idx - 1]?.focus();
  };
  const handleOtpPaste = (e) => {
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (paste.length === 6) {
      setOtp(paste.split(''));
      otpRefs.current[5]?.focus();
    }
  };

  /* ── Step 2: verify OTP & create account ── */
  const verifyAndCreate = async () => {
    const code = otp.join('');
    if (code.length < 6) return setError('Enter all 6 digits');
    setLoading(true); setError('');
    try {
      await axios.post(`${API}/api/auth/verify-otp`, { email: formData.email, otp: code });
      await axios.post(`${API}/api/signup`, { ...formData, role: 'user' });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.error || 'Verification failed. Try again.');
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
    setOtp(['', '', '', '', '', '']);
    setError('');
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/send-otp`, { email: formData.email, type: 'register' });
      startCountdown();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to resend.');
    } finally { setLoading(false); }
  };

  /* ── STEP 3: Success ── */
  if (step === 3) return (
    <div style={{ textAlign: 'center', padding: '20px 0' }}>
      <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
      <h2 style={formTitle}>Account Created!</h2>
      <p style={{ color: '#888', marginBottom: '24px' }}>Your email has been verified. You can now login.</p>
      <button style={btnStyle} onClick={onSignupSuccess}>Login Now</button>
    </div>
  );

  /* ── STEP 2: OTP ── */
  if (step === 2) return (
    <div style={formWrapper}>
      <button style={backBtn} onClick={() => { setStep(1); setOtp(['','','','','','']); setError(''); }}>
        ← Back
      </button>
      <h2 style={formTitle}>Verify Your Email</h2>
      <p style={formSub}>
        We sent a 6-digit code to <strong>{formData.email}</strong>
      </p>

      {error && <div style={errorBox}>{error}</div>}

      <div style={otpRow}>
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => otpRefs.current[i] = el}
            style={{ ...otpBox, borderColor: digit ? '#002f34' : '#e0e0e0' }}
            type="text" inputMode="numeric" maxLength={1}
            value={digit}
            onChange={e => handleOtpChange(i, e.target.value)}
            onKeyDown={e => handleOtpKey(i, e)}
            onPaste={handleOtpPaste}
            autoFocus={i === 0}
          />
        ))}
      </div>

      <button
        style={{ ...btnStyle, opacity: loading ? 0.75 : 1, marginBottom: '14px' }}
        onClick={verifyAndCreate}
        disabled={loading || otp.join('').length < 6}
      >
        {loading ? 'Verifying…' : 'Verify & Create Account'}
      </button>

      <p style={resendRow}>
        Didn't receive it?&nbsp;
        {resendCD > 0
          ? <span style={{ color: '#aaa' }}>Resend in {resendCD}s</span>
          : <span style={resendLink} onClick={resendOTP}>Resend OTP</span>
        }
      </p>
    </div>
  );

  /* ── STEP 1: Form ── */
  return (
    <div style={formWrapper}>
      <h2 style={formTitle}>Join OpenMarket</h2>
      <p style={formSub}>Create your free account today</p>

      {error && <div style={errorBox}>{error}</div>}

      <form onSubmit={sendOTP}>
        <div style={fieldGroup}>
          <label style={fieldLabel}>Full Name</label>
          <input className="premium-input" type="text" placeholder="Your full name"
            required style={inputStyle} value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })} />
        </div>
        <div style={fieldGroup}>
          <label style={fieldLabel}>Email Address</label>
          <input className="premium-input" type="email" placeholder="you@example.com"
            required style={inputStyle} value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })} />
        </div>
        <div style={fieldGroup}>
          <label style={fieldLabel}>Password</label>
          <input className="premium-input" type="password" placeholder="Min. 6 characters"
            required minLength={6} style={inputStyle} value={formData.password}
            onChange={e => setFormData({ ...formData, password: e.target.value })} />
        </div>
        <button className="premium-btn" type="submit"
          style={{ ...btnStyle, opacity: loading ? 0.75 : 1 }} disabled={loading}>
          {loading ? 'Sending OTP…' : 'Send Verification Code'}
        </button>
      </form>
    </div>
  );
}

/* ── STYLES ── */
const formWrapper = { textAlign: 'left' };
const formTitle   = { fontSize: '24px', color: '#002f34', marginBottom: '4px', fontWeight: '900' };
const formSub     = { fontSize: '14px', color: '#888', marginBottom: '20px', marginTop: 0 };
const fieldGroup  = { marginBottom: '16px' };
const fieldLabel  = { display: 'block', fontSize: '13px', fontWeight: '700', color: '#002f34', marginBottom: '6px' };
const inputStyle  = { width: '100%', padding: '13px 16px', borderRadius: '10px', border: '1.5px solid #e0e0e0', boxSizing: 'border-box', fontSize: '15px', color: '#333', backgroundColor: '#fafafa' };
const btnStyle    = { width: '100%', padding: '14px', background: 'linear-gradient(135deg, #002f34, #004a52)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', fontWeight: '800', fontSize: '16px', letterSpacing: '0.3px', display: 'block' };
const errorBox    = { padding: '12px 16px', backgroundColor: '#fef2f2', color: '#dc2626', borderRadius: '8px', marginBottom: '16px', fontSize: '14px', border: '1px solid #fecaca' };
const backBtn     = { background: 'none', border: 'none', cursor: 'pointer', color: '#002f34', fontWeight: '700', fontSize: '14px', padding: '0 0 16px', display: 'flex', alignItems: 'center', gap: '4px' };

const otpRow    = { display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' };
const otpBox    = { width: '46px', height: '54px', textAlign: 'center', fontSize: '24px', fontWeight: '800', color: '#002f34', border: '2px solid #e0e0e0', borderRadius: '10px', outline: 'none', backgroundColor: '#fafafa', transition: 'border-color 0.2s' };

const resendRow  = { textAlign: 'center', fontSize: '13px', color: '#888', margin: 0 };
const resendLink = { color: '#3a7bd5', cursor: 'pointer', fontWeight: '700', textDecoration: 'underline' };
