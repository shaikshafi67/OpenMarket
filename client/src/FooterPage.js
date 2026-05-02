import React from 'react';
import { useLang } from './LanguageContext';

export default function FooterPage({ link, onBack }) {
  const { t } = useLang();
  if (!link) return null;

  const paragraphs = (link.content || '').split('\n').filter(l => l.trim() !== '');

  return (
    <div style={wrap}>
      {/* Back button */}
      <button style={backBtn} onClick={onBack}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
        {t('back_home')}
      </button>

      <div style={card}>
        {/* Header */}
        <div style={cardHeader}>
          <h1 style={pageTitle}>{link.label}</h1>
          <div style={headerLine} />
        </div>

        {/* Content */}
        <div style={contentArea}>
          {paragraphs.length > 0 ? (
            paragraphs.map((para, i) => (
              <p key={i} style={para.startsWith('  ') ? indentPara : normalPara}>
                {para.trim()}
              </p>
            ))
          ) : (
            <div style={emptyWrap}>
              <div style={emptyIcon}>📄</div>
              <p style={emptyTitle}>Content Coming Soon</p>
              <p style={emptyText}>This page is currently being prepared. Please check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const wrap = {
  maxWidth: '780px',
  margin: '0 auto',
  padding: '32px 20px 60px',
};

const backBtn = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: '6px',
  background: 'none',
  border: 'none',
  color: '#002f34',
  fontSize: '14px',
  fontWeight: '700',
  cursor: 'pointer',
  padding: '8px 0',
  marginBottom: '24px',
  opacity: 0.7,
  transition: 'opacity 0.2s',
};

const card = {
  backgroundColor: '#fff',
  borderRadius: '16px',
  boxShadow: '0 4px 24px rgba(0,47,52,0.10)',
  overflow: 'hidden',
};

const cardHeader = {
  padding: '36px 40px 28px',
  background: 'linear-gradient(135deg, #002f34 0%, #004a52 100%)',
};

const pageTitle = {
  margin: 0,
  fontSize: '28px',
  fontWeight: '900',
  color: '#ffce32',
  letterSpacing: '-0.5px',
};

const headerLine = {
  width: '48px',
  height: '3px',
  backgroundColor: '#ffce32',
  borderRadius: '2px',
  marginTop: '14px',
  opacity: 0.6,
};

const contentArea = {
  padding: '36px 40px 40px',
};

const normalPara = {
  margin: '0 0 16px',
  fontSize: '15px',
  color: '#444',
  lineHeight: 1.8,
};

const indentPara = {
  ...normalPara,
  paddingLeft: '20px',
  borderLeft: '3px solid #ffce32',
  color: '#555',
};

const emptyWrap = {
  textAlign: 'center',
  padding: '48px 20px',
};

const emptyIcon  = { fontSize: '52px', marginBottom: '16px' };
const emptyTitle = { fontSize: '18px', fontWeight: '700', color: '#002f34', margin: '0 0 8px' };
const emptyText  = { fontSize: '14px', color: '#999', margin: 0, lineHeight: 1.6 };
