import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000/api/footer';


export default function FooterAdmin({ notify }) {
  const [tab,      setTab]      = useState('links');
  const [sections, setSections] = useState([]);
  const [social,   setSocial]   = useState([]);

  /* ── modals / forms ── */
  const [addSectionName,  setAddSectionName]  = useState('');
  const [showAddSection,  setShowAddSection]  = useState(false);
  const [editingSection,  setEditingSection]  = useState(null); // { id, name }
  const [addLinkFor,      setAddLinkFor]      = useState(null); // section_id
  const [addLinkLabel,    setAddLinkLabel]    = useState('');
  const [editingLink,     setEditingLink]     = useState(null); // { id, label, content }

  const load = useCallback(() =>
    axios.get(API).then(r => {
      setSections(r.data.sections || []);
      setSocial(r.data.social || []);
    }).catch(() => {}),
  []);

  useEffect(() => { load(); }, [load]);

  /* ── SECTION ACTIONS ── */
  const addSection = () => {
    if (!addSectionName.trim()) return;
    axios.post(`${API}/sections`, { name: addSectionName.trim() })
      .then(() => { notify('✅ Section added'); setAddSectionName(''); setShowAddSection(false); load(); })
      .catch(() => notify('❌ Failed to add section'));
  };

  const saveSection = () => {
    if (!editingSection?.name?.trim()) return;
    axios.put(`${API}/sections/${editingSection.id}`, { name: editingSection.name })
      .then(() => { notify('✅ Section renamed'); setEditingSection(null); load(); })
      .catch(() => notify('❌ Failed'));
  };

  const deleteSection = (id, name) => {
    if (!window.confirm(`Delete section "${name}" and all its links?`)) return;
    axios.delete(`${API}/sections/${id}`)
      .then(() => { notify('🗑️ Section deleted'); load(); })
      .catch(() => notify('❌ Failed'));
  };

  const toggleSection = (id) =>
    axios.put(`${API}/sections/${id}/toggle`)
      .then(() => load()).catch(() => {});

  /* ── LINK ACTIONS ── */
  const addLink = () => {
    if (!addLinkLabel.trim()) return;
    axios.post(`${API}/links`, { section_id: addLinkFor, label: addLinkLabel.trim() })
      .then(() => { notify('✅ Link added'); setAddLinkFor(null); setAddLinkLabel(''); load(); })
      .catch(() => notify('❌ Failed'));
  };

  const saveLink = () => {
    if (!editingLink?.label?.trim()) return;
    axios.put(`${API}/links/${editingLink.id}`, { label: editingLink.label, content: editingLink.content || '' })
      .then(() => { notify('✅ Link updated'); setEditingLink(null); load(); })
      .catch(() => notify('❌ Failed'));
  };

  const deleteLink = (id, label) => {
    if (!window.confirm(`Delete link "${label}"?`)) return;
    axios.delete(`${API}/links/${id}`)
      .then(() => { notify('🗑️ Link deleted'); load(); })
      .catch(() => notify('❌ Failed'));
  };

  const toggleLink = (id) =>
    axios.put(`${API}/links/${id}/toggle`)
      .then(() => load()).catch(() => {});

  /* ── SOCIAL ACTIONS ── */
  const [editingSocial, setEditingSocial] = useState({}); // { id: { url, platform } }

  useEffect(() => {
    const map = {};
    social.forEach(s => { map[s.id] = { url: s.url, platform: s.platform }; });
    setEditingSocial(map);
  }, [social]);

  const saveSocial = (id) => {
    const { url, platform } = editingSocial[id] || {};
    axios.put(`${API}/social/${id}`, { url, platform })
      .then(() => { notify('✅ Social link updated'); load(); })
      .catch(() => notify('❌ Failed'));
  };

  const toggleSocial = (id) =>
    axios.put(`${API}/social/${id}/toggle`)
      .then(() => load()).catch(() => {});


  return (
    <div style={wrap}>
      {/* ── PAGE HEADER ── */}
      <div style={pageHeader}>
        <h2 style={pageTitle}>Footer Management</h2>
        <p style={pageSub}>Manage links, social media, and footer settings shown on the public site</p>
      </div>

      {/* ── TABS ── */}
      <div style={tabBar}>
        {[
        ['links', <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg> Footer Links</>],
        ['social', <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg> Social Media</>],
      ].map(([k,l]) => (
          <button key={k} style={tab === k ? tabBtnActive : tabBtn} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>

      {/* ════════════════ FOOTER LINKS TAB ════════════════ */}
      {tab === 'links' && (
        <div>
          <div style={tabTopBar}>
            <span style={tabDesc}>{sections.length} section(s) · manage navigation links in your footer</span>
            <button style={addBtn} onClick={() => setShowAddSection(true)}>＋ Add Section</button>
          </div>

          {/* Add section inline form */}
          {showAddSection && (
            <div style={inlineForm}>
              <input
                style={inlineInput}
                placeholder="Section name (e.g. Partners)"
                value={addSectionName}
                onChange={e => setAddSectionName(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && addSection()}
                autoFocus
              />
              <button style={saveSmallBtn} onClick={addSection}>Add</button>
              <button style={cancelSmallBtn} onClick={() => { setShowAddSection(false); setAddSectionName(''); }}>Cancel</button>
            </div>
          )}

          {/* Section cards */}
          {sections.map(section => (
            <div key={section.id} style={sectionCard}>
              {/* Section header */}
              <div style={sectionHead}>
                <div style={sectionLeft}>
                  <ToggleSwitch
                    checked={!!section.is_enabled}
                    onChange={() => toggleSection(section.id)}
                  />
                  {editingSection?.id === section.id ? (
                    <>
                      <input
                        style={{ ...inlineInput, width: '180px' }}
                        value={editingSection.name}
                        onChange={e => setEditingSection({ ...editingSection, name: e.target.value })}
                        onKeyDown={e => e.key === 'Enter' && saveSection()}
                        autoFocus
                      />
                      <button style={saveSmallBtn} onClick={saveSection}>Save</button>
                      <button style={cancelSmallBtn} onClick={() => setEditingSection(null)}>Cancel</button>
                    </>
                  ) : (
                    <span style={{ ...sectionName, opacity: section.is_enabled ? 1 : 0.45 }}>{section.name}</span>
                  )}
                </div>
                <div style={sectionRight}>
                  <span style={linkCountBadge}>{section.links.length} links</span>
                  <button style={iconBtn} title="Rename" onClick={() => setEditingSection({ id: section.id, name: section.name })}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg></button>
                  <button style={{ ...iconBtn, color: '#e74c3c' }} title="Delete" onClick={() => deleteSection(section.id, section.name)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
                </div>
              </div>

              {/* Links list */}
              <div style={linksWrap}>
                {section.links.length === 0 ? (
                  <p style={noLinks}>No links yet. Add one below.</p>
                ) : (
                  section.links.map(link => (
                    <div key={link.id} style={{ ...linkRowWrap }}>
                      <div style={linkRow}>
                        <ToggleSwitch checked={!!link.is_enabled} onChange={() => toggleLink(link.id)} small />
                        <span style={{ ...linkLabel, opacity: link.is_enabled ? 1 : 0.4 }}>{link.label}</span>
                        {link.content
                          ? <span style={contentPreview}>"{link.content.slice(0, 60)}{link.content.length > 60 ? '…' : ''}"</span>
                          : <span style={noContentBadge}>No content yet</span>
                        }
                        <button style={editLinkBtn} onClick={() => setEditingLink({ id: link.id, label: link.label, content: link.content || '' })}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg> Edit</button>
                        <button style={{ ...iconBtn, color: '#e74c3c' }} onClick={() => deleteLink(link.id, link.label)}><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
                      </div>
                      {/* Inline content editor */}
                      {editingLink?.id === link.id && (
                        <div style={contentEditor}>
                          <div style={editorRow}>
                            <label style={editorLabel}>Link Title</label>
                            <input
                              style={editorInput}
                              value={editingLink.label}
                              onChange={e => setEditingLink({ ...editingLink, label: e.target.value })}
                              placeholder="e.g. Privacy Policy"
                            />
                          </div>
                          <div style={editorRow}>
                            <label style={editorLabel}>Page Content</label>
                            <p style={editorHint}>Write the full text that users will see when they click this link.</p>
                            <textarea
                              style={contentTextarea}
                              value={editingLink.content}
                              onChange={e => setEditingLink({ ...editingLink, content: e.target.value })}
                              placeholder={`Write the content for "${editingLink.label}" here...\n\nYou can use new lines for paragraphs.`}
                              rows={10}
                            />
                          </div>
                          <div style={editorActions}>
                            <button style={saveSmallBtn} onClick={saveLink}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save Content</button>
                            <button style={cancelSmallBtn} onClick={() => setEditingLink(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                )}

                {/* Add link row */}
                {addLinkFor === section.id ? (
                  <div style={addLinkForm}>
                    <input
                      style={{ ...inlineInput, flex: 1 }}
                      placeholder="Link name (e.g. About Us)"
                      value={addLinkLabel}
                      onChange={e => setAddLinkLabel(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && addLink()}
                      autoFocus
                    />
                    <button style={saveSmallBtn} onClick={addLink}>Add</button>
                    <button style={cancelSmallBtn} onClick={() => { setAddLinkFor(null); setAddLinkLabel(''); }}>Cancel</button>
                  </div>
                ) : (
                  <button style={addLinkBtn} onClick={() => setAddLinkFor(section.id)}>＋ Add Link</button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ════════════════ SOCIAL MEDIA TAB ════════════════ */}
      {tab === 'social' && (
        <div>
          <div style={tabTopBar}>
            <span style={tabDesc}>Update social media URLs and enable/disable platforms</span>
          </div>
          <div style={socialCard}>
            {social.map(s => (
              <div key={s.id} style={socialRow}>
                <div style={socialPlatformCol}>
                  <ToggleSwitch checked={!!s.is_enabled} onChange={() => toggleSocial(s.id)} />
                  <span style={{ ...socialPlatformName, opacity: s.is_enabled ? 1 : 0.4 }}>
                    {s.platform}
                  </span>
                </div>
                <input
                  style={socialUrlInput}
                  value={editingSocial[s.id]?.url || ''}
                  onChange={e => setEditingSocial(prev => ({ ...prev, [s.id]: { ...prev[s.id], url: e.target.value } }))}
                  placeholder="https://..."
                />
                <button style={saveSocialBtn} onClick={() => saveSocial(s.id)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg> Save</button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}

/* ── TOGGLE SWITCH ── */
function ToggleSwitch({ checked, onChange, small }) {
  const size = small ? 32 : 36;
  const knob = small ? 12 : 14;
  return (
    <div
      onClick={onChange}
      style={{
        width: size, height: small ? 18 : 20,
        borderRadius: 10,
        backgroundColor: checked ? '#27ae60' : '#ccc',
        position: 'relative', cursor: 'pointer',
        transition: 'background-color 0.2s', flexShrink: 0,
      }}
    >
      <div style={{
        position: 'absolute',
        width: knob, height: knob,
        borderRadius: '50%',
        backgroundColor: '#fff',
        top: '50%', transform: 'translateY(-50%)',
        left: checked ? (size - knob - 3) : 3,
        transition: 'left 0.2s',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }} />
    </div>
  );
}


/* ── STYLES ── */
const wrap       = { fontFamily: "'Segoe UI',Arial,sans-serif" };
const pageHeader = { marginBottom: '24px' };
const pageTitle  = { fontSize: '22px', fontWeight: '800', color: '#002f34', margin: '0 0 4px' };
const pageSub    = { fontSize: '14px', color: '#888', margin: 0 };

const tabBar     = { display: 'flex', gap: '4px', marginBottom: '24px', borderBottom: '2px solid #eef0f2', paddingBottom: '0' };
const tabBtn     = { padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#888', borderBottom: '2px solid transparent', marginBottom: '-2px', borderRadius: '6px 6px 0 0', transition: 'all 0.2s' };
const tabBtnActive = { ...tabBtn, color: '#002f34', borderBottomColor: '#002f34', backgroundColor: '#f8f9fa' };

const tabTopBar  = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' };
const tabDesc    = { fontSize: '13px', color: '#888' };
const addBtn     = { padding: '8px 18px', backgroundColor: '#002f34', color: '#ffce32', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '700', fontSize: '13px' };

/* Section card */
const sectionCard = { backgroundColor: '#fff', border: '1px solid #eef0f2', borderRadius: '12px', marginBottom: '16px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,47,52,0.06)' };
const sectionHead = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', backgroundColor: '#f8f9fa', borderBottom: '1px solid #eef0f2' };
const sectionLeft = { display: 'flex', alignItems: 'center', gap: '12px' };
const sectionRight= { display: 'flex', alignItems: 'center', gap: '8px' };
const sectionName = { fontWeight: '700', fontSize: '15px', color: '#002f34' };
const linkCountBadge = { backgroundColor: '#e8f0fe', color: '#3a7bd5', borderRadius: '10px', padding: '2px 9px', fontSize: '12px', fontWeight: '600' };

/* Links */
const linksWrap      = { padding: '12px 18px' };
const linkRowWrap    = { borderBottom: '1px solid #f5f5f5' };
const linkRow        = { display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 0' };
const linkLabel      = { fontSize: '14px', fontWeight: '600', color: '#002f34', flex: '0 0 auto', minWidth: '100px' };
const contentPreview = { fontSize: '12px', color: '#888', fontStyle: 'italic', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
const noContentBadge = { fontSize: '11px', color: '#bbb', backgroundColor: '#f5f5f5', borderRadius: '10px', padding: '2px 8px', flex: 1 };
const editLinkBtn    = { padding: '5px 12px', backgroundColor: '#3a7bd5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap', flexShrink: 0 };
const noLinks        = { color: '#bbb', fontSize: '13px', fontStyle: 'italic', margin: '4px 0 8px' };
const addLinkForm    = { display: 'flex', alignItems: 'center', gap: '8px', marginTop: '10px' };
const addLinkBtn     = { background: 'none', border: '1px dashed #3a7bd5', color: '#3a7bd5', borderRadius: '6px', padding: '6px 14px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', marginTop: '10px', width: '100%' };

/* Content editor */
const contentEditor  = { backgroundColor: '#f8f9fa', border: '1px solid #e8ecf0', borderRadius: '10px', padding: '20px', margin: '8px 0 12px', display: 'flex', flexDirection: 'column', gap: '14px' };
const editorRow      = { display: 'flex', flexDirection: 'column', gap: '6px' };
const editorLabel    = { fontSize: '12px', fontWeight: '800', color: '#002f34', textTransform: 'uppercase', letterSpacing: '0.5px' };
const editorHint     = { fontSize: '12px', color: '#999', margin: '0 0 4px', lineHeight: 1.4 };
const editorInput    = { padding: '9px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fff' };
const contentTextarea= { padding: '12px 14px', border: '1px solid #ddd', borderRadius: '8px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', backgroundColor: '#fff', resize: 'vertical', lineHeight: 1.7, width: '100%', boxSizing: 'border-box' };
const editorActions  = { display: 'flex', gap: '10px' };

/* Inline form */
const inlineForm  = { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px', padding: '12px 16px', backgroundColor: '#f0f7ff', borderRadius: '8px', border: '1px solid #dde8f7' };
const inlineInput = { padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none', fontFamily: 'inherit' };

/* Buttons */
const saveSmallBtn   = { padding: '7px 14px', backgroundColor: '#27ae60', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '12px', whiteSpace: 'nowrap' };
const cancelSmallBtn = { padding: '7px 14px', backgroundColor: '#eee', color: '#555', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '12px', whiteSpace: 'nowrap' };
const iconBtn        = { background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', padding: '4px', lineHeight: 1, borderRadius: '4px' };

/* Social */
const socialCard      = { backgroundColor: '#fff', border: '1px solid #eef0f2', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 4px rgba(0,47,52,0.06)' };
const socialRow       = { display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 18px', borderBottom: '1px solid #f5f5f5' };
const socialPlatformCol = { display: 'flex', alignItems: 'center', gap: '10px', width: '180px', flexShrink: 0 };
const socialPlatformName = { fontWeight: '600', fontSize: '14px', color: '#002f34' };
const socialUrlInput  = { flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '13px', outline: 'none' };
const saveSocialBtn   = { padding: '8px 16px', backgroundColor: '#3a7bd5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '13px', whiteSpace: 'nowrap' };

