import React, { useState } from 'react';
import { useLang } from './LanguageContext';

/* Parses the flat "Q1. ...\nAnswer..." text blob into { intro, sections, notes } */
function parseFAQ(raw) {
  const blocks = (raw || '').split(/\n{2,}/).map(b => b.trim()).filter(Boolean);
  const intro = [];
  const sections = [];
  const notes = [];
  let current = null;
  let sawFirstQA = false;

  blocks.forEach((b, idx) => {
    const m = b.match(/^Q\s*\d+\.\s*([\s\S]*?)\n([\s\S]*)$/i);
    if (m) {
      sawFirstQA = true;
      if (!current) current = { title: 'General', qas: [] };
      current.qas.push({ q: m[1].trim(), a: m[2].trim() });
      return;
    }
    if (idx === 0) return; // duplicate of the page title, already shown in header
    if (!sawFirstQA) { intro.push(b); return; }
    if (current) sections.push(current);
    current = { title: b, qas: [] };
  });
  if (current) {
    if (current.qas.length > 0) sections.push(current);
    else notes.push(current.title);
  }
  return { intro, sections, notes };
}

function FAQAccordion({ content }) {
  const { intro, sections, notes } = parseFAQ(content);
  const [openKey, setOpenKey] = useState('0-0');

  if (sections.length === 0) return null;

  return (
    <div>
      {intro.map((p, i) => <p key={i} style={faqIntro}>{p}</p>)}

      {sections.map((sec, si) => (
        <div key={si} style={faqSection}>
          <div style={faqSectionTitle}>{sec.title}</div>
          <div style={faqSectionBody}>
            {sec.qas.map((qa, qi) => {
              const key = `${si}-${qi}`;
              const isOpen = openKey === key;
              return (
                <div key={key} style={faqItem}>
                  <button
                    style={faqQuestionBtn}
                    onClick={() => setOpenKey(isOpen ? null : key)}
                    aria-expanded={isOpen}
                  >
                    <span style={faqQBadge}>Q</span>
                    <span style={faqQText}>{qa.q}</span>
                    <svg
                      width="16" height="16" viewBox="0 0 24 24" fill="none"
                      stroke="#002f34" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                      style={{ ...faqChevron, transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {isOpen && (
                    <div style={faqAnswerWrap}>
                      <p style={faqAnswerText}>{qa.a}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {notes.length > 0 && (
        <div style={faqNotes}>
          {notes.map((n, i) => <p key={i} style={faqNoteText}>{n}</p>)}
        </div>
      )}
    </div>
  );
}

export default function FooterPage({ link, onBack }) {
  const { t } = useLang();
  if (!link) return null;

  const isFAQ = /faq/i.test(link.label || '');
  const paragraphs = (link.content || '').split('\n').filter(l => l.trim() !== '');
  const faqHasContent = isFAQ && parseFAQ(link.content).sections.length > 0;

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
          {faqHasContent ? (
            <FAQAccordion content={link.content} />
          ) : paragraphs.length > 0 ? (
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

/* ── FAQ accordion ── */
const faqIntro = {
  margin: '0 0 28px',
  fontSize: '15px',
  color: '#667',
  lineHeight: 1.7,
};

const faqSection = {
  marginBottom: '30px',
};

const faqSectionTitle = {
  fontSize: '12px',
  fontWeight: '800',
  color: '#002f34',
  textTransform: 'uppercase',
  letterSpacing: '0.8px',
  marginBottom: '12px',
  paddingBottom: '8px',
  borderBottom: '2px solid #ffce32',
};

const faqSectionBody = {
  display: 'flex',
  flexDirection: 'column',
  gap: '10px',
};

const faqItem = {
  border: '1px solid #eee',
  borderRadius: '10px',
  overflow: 'hidden',
  backgroundColor: '#fafbfc',
  transition: 'border-color 0.15s, box-shadow 0.15s',
};

const faqQuestionBtn = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  padding: '14px 16px',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  textAlign: 'left',
  font: 'inherit',
};

const faqQBadge = {
  flexShrink: 0,
  width: '22px',
  height: '22px',
  borderRadius: '50%',
  backgroundColor: '#002f34',
  color: '#ffce32',
  fontSize: '11px',
  fontWeight: '900',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const faqQText = {
  flex: 1,
  fontSize: '14.5px',
  fontWeight: '700',
  color: '#1a1a1a',
  lineHeight: 1.5,
};

const faqChevron = {
  flexShrink: 0,
  transition: 'transform 0.2s ease',
};

const faqAnswerWrap = {
  padding: '0 16px 16px 50px',
};

const faqAnswerText = {
  margin: 0,
  fontSize: '14px',
  color: '#555',
  lineHeight: 1.75,
};

const faqNotes = {
  marginTop: '8px',
  padding: '16px 18px',
  backgroundColor: '#fff8e1',
  border: '1px solid #ffe082',
  borderRadius: '10px',
};

const faqNoteText = {
  margin: 0,
  fontSize: '13.5px',
  color: '#7a5b00',
  lineHeight: 1.6,
};

const emptyWrap = {
  textAlign: 'center',
  padding: '48px 20px',
};

const emptyIcon  = { fontSize: '52px', marginBottom: '16px' };
const emptyTitle = { fontSize: '18px', fontWeight: '700', color: '#002f34', margin: '0 0 8px' };
const emptyText  = { fontSize: '14px', color: '#999', margin: 0, lineHeight: 1.6 };
