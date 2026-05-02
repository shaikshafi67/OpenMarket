import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLang } from './LanguageContext';

const LANGUAGES = [
  'English','Hindi','Tamil','Telugu','Kannada','Malayalam',
  'Bengali','Marathi','Gujarati','Punjabi','Urdu','Odia',
];

/* Social SVG icons */
const SocialIcon = ({ platform, size = 18 }) => {
  const s = { width: size, height: size, fill: 'currentColor' };
  if (platform === 'Facebook')
    return <svg style={s} viewBox="0 0 24 24"><path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.696 4.533-4.696 1.313 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>;
  if (platform === 'Instagram')
    return <svg style={s} viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>;
  if (platform === 'Twitter (X)')
    return <svg style={s} viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.63L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z"/></svg>;
  if (platform === 'WhatsApp')
    return <svg style={s} viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.107.548 4.107 1.51 5.845L.057 23.433a.5.5 0 00.612.612l5.588-1.453A11.952 11.952 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.805 9.805 0 01-4.988-1.357l-.357-.213-3.712.965.985-3.611-.233-.374A9.791 9.791 0 012.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z"/></svg>;
  return <span style={{ fontSize: size, lineHeight: 1 }}>🔗</span>;
};

export default function Footer({ onLinkClick }) {
  const [config, setConfig] = useState(null);
  const { language, changeLanguage, t } = useLang();

  const load = () =>
    axios.get('http://localhost:5000/api/footer')
      .then(r => setConfig(r.data))
      .catch(() => {});

  useEffect(() => { load(); }, []);

  if (!config) return null;

  const { sections, social } = config;
  const enabledSections = sections.filter(s => s.is_enabled);
  const enabledSocial   = social.filter(s => s.is_enabled);

  return (
    <footer style={footerWrap}>

      {/* ── MAIN GRID ── */}
      <div style={footerInner}>

        {/* Brand column */}
        <div style={brandCol}>
          <div style={brandLogoRow}>
            <div style={logoBadge}><span style={logoBadgeText}>Open</span></div>
            <span style={logoText}>Market</span>
          </div>
          <p style={brandTagline}>
            India's trusted marketplace for buying and selling locally — cars, phones, furniture & more.
          </p>
          {/* Social icons below brand */}
          <h4 style={{ ...colHeading, marginTop: '20px' }}>{t('follow_us')}</h4>
          <div style={socialRow}>
            {enabledSocial.map(s => (
              <a key={s.id} href={s.url} target="_blank" rel="noreferrer" style={socialBtn} title={s.platform}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#ffce32'; e.currentTarget.style.color = '#002f34'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'; e.currentTarget.style.color = '#fff'; }}
              >
                <SocialIcon platform={s.platform} size={17} />
              </a>
            ))}
          </div>
        </div>

        {/* Dynamic link sections */}
        {enabledSections.map(section => (
          <div key={section.id} style={linkCol}>
            <h4 style={colHeading}>{section.name}</h4>
            <div style={linkList}>
              {section.links.filter(l => l.is_enabled).map(link => (
                <span
                  key={link.id}
                  style={footerLink}
                  onClick={() => onLinkClick && onLinkClick(link)}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ffce32'; e.currentTarget.style.paddingLeft = '6px'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.65)'; e.currentTarget.style.paddingLeft = '0'; }}
                >
                  {link.label}
                </span>
              ))}
            </div>
          </div>
        ))}

        {/* Region column */}
        <div style={linkCol}>
          <h4 style={colHeading}>{t('region')}</h4>
          <div style={regionWrap}>
            <label style={regionLabel}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
              {t('country')}
            </label>
            <div style={countryStatic}>India</div>

            <label style={{ ...regionLabel, marginTop: '14px' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
              {t('language')}
            </label>
            <select
              value={language}
              onChange={e => changeLanguage(e.target.value)}
              style={regionSelect}
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* ── DIVIDER ── */}
      <div style={divider} />

      {/* ── BOTTOM BAR ── */}
      <div style={bottomBar}>
        <span style={copyright}>© 2026 OpenMarket. All rights reserved.</span>
        <div style={bottomLinks}>
          <span style={bottomLink}>{t('privacy_policy')}</span>
          <span style={bottomDot}>·</span>
          <span style={bottomLink}>{t('terms')}</span>
          <span style={bottomDot}>·</span>
          <span style={bottomLink}>{t('cookies')}</span>
        </div>
      </div>
    </footer>
  );
}

/* ── STYLES ── */
const footerWrap = {
  backgroundColor: '#0a1628',
  color: '#fff',
  fontFamily: "'Segoe UI', Arial, sans-serif",
  marginTop: '60px',
};
const footerInner = {
  maxWidth: '1300px',
  margin: '0 auto',
  padding: '56px 24px 40px',
  display: 'grid',
  gridTemplateColumns: '260px repeat(auto-fill, minmax(160px, 1fr))',
  gap: '40px',
};

/* Brand */
const brandCol     = { display: 'flex', flexDirection: 'column', gap: '14px' };
const brandLogoRow = { display: 'flex', alignItems: 'center', gap: '6px' };
const logoBadge    = { backgroundColor: '#ffce32', borderRadius: '6px', padding: '4px 8px' };
const logoBadgeText= { color: '#002f34', fontWeight: '900', fontSize: '17px', letterSpacing: '-0.5px' };
const logoText     = { color: '#fff', fontWeight: '900', fontSize: '17px' };
const brandTagline = { color: 'rgba(255,255,255,0.5)', fontSize: '13px', lineHeight: 1.7, margin: 0 };

/* Social */
const socialRow = { display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '4px' };
const socialBtn = {
  width: '36px', height: '36px',
  borderRadius: '8px',
  backgroundColor: 'rgba(255,255,255,0.08)',
  color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  textDecoration: 'none',
  transition: 'background-color 0.2s ease, color 0.2s ease',
  flexShrink: 0,
};

/* Link columns */
const linkCol   = { display: 'flex', flexDirection: 'column' };
const colHeading= {
  color: '#ffce32',
  fontSize: '13px',
  fontWeight: '800',
  letterSpacing: '1px',
  textTransform: 'uppercase',
  margin: '0 0 16px',
};
const linkList  = { display: 'flex', flexDirection: 'column', gap: '10px' };
const footerLink= {
  color: 'rgba(255,255,255,0.65)',
  textDecoration: 'none',
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: 1.4,
  transition: 'color 0.2s ease, padding-left 0.2s ease',
  display: 'block',
  cursor: 'pointer',
};

/* Region */
const regionWrap  = { display: 'flex', flexDirection: 'column' };
const regionLabel = { color: 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' };
const countryStatic = {
  color: '#fff',
  fontSize: '14px',
  fontWeight: '600',
  padding: '9px 12px',
  backgroundColor: 'rgba(255,255,255,0.06)',
  border: '1px solid rgba(255,255,255,0.12)',
  borderRadius: '8px',
};
const regionSelect= {
  backgroundColor: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: '8px',
  color: '#fff',
  padding: '9px 12px',
  fontSize: '13px',
  cursor: 'pointer',
  outline: 'none',
  width: '100%',
  appearance: 'none',
  backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23ffffff80' stroke-width='2'%3E%3Cpolyline points='6 9 12 15 18 9'%3E%3C/polyline%3E%3C/svg%3E")`,
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'right 10px center',
};

/* Bottom bar */
const divider    = { borderTop: '1px solid rgba(255,255,255,0.08)', margin: '0 24px' };
const bottomBar  = {
  maxWidth: '1300px', margin: '0 auto',
  padding: '20px 24px',
  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
  flexWrap: 'wrap', gap: '12px',
};
const copyright  = { color: 'rgba(255,255,255,0.4)', fontSize: '13px' };
const bottomLinks= { display: 'flex', alignItems: 'center', gap: '10px' };
const bottomLink = { color: 'rgba(255,255,255,0.4)', fontSize: '12px', cursor: 'pointer', transition: 'color 0.2s' };
const bottomDot  = { color: 'rgba(255,255,255,0.2)', fontSize: '12px' };
