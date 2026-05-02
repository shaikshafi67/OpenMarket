import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ChatWindow from './ChatWindow';

const FILTERS = ['All', 'Unread', 'Important'];

function formatTime(ts) {
  if (!ts) return '';
  const d = new Date(ts);
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (d.toDateString() === now.toDateString())
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

function getImg(data) {
  try { return JSON.parse(data)[0]; } catch { return data; }
}

/* Read receipt ticks */
function ReadTicks({ sent, read }) {
  if (!sent) return null;
  return (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ flexShrink: 0 }}>
      <path d="M1 5 L4 8 L8 2" stroke={read ? '#4caf50' : '#aaa'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M5 5 L8 8 L12 2" stroke={read ? '#4caf50' : '#aaa'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function MyChats({ user }) {
  const [chats,      setChats]      = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [filter,     setFilter]     = useState('All');
  const [search,     setSearch]     = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [openMenu,   setOpenMenu]   = useState(null);
  const [important,  setImportant]  = useState({});
  const menuRef = useRef(null);

  const chatKey = (c) => `${c.id}-${c.buyer_id}`;

  const fetchChats = () => {
    axios.get(`/api/chats/summary/${user.id}`)
      .then(res => setChats(res.data))
      .catch(() => {});
  };

  useEffect(() => {
    fetchChats();
    const t = setInterval(fetchChats, 5000);
    return () => clearInterval(t);
  }, [user.id]); // eslint-disable-line

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setOpenMenu(null);
    };
    if (openMenu) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenu]);

  const handleDeleteChat = (chat) => {
    setOpenMenu(null);
    if (!window.confirm(`Delete chat with ${chat.other_user_name}?`)) return;
    axios.delete('/api/messages/delete-chat', {
      data: { product_id: chat.id, user1_id: user.id, user2_id: chat.buyer_id }
    }).then(() => {
      if (activeChat && chatKey(activeChat) === chatKey(chat)) setActiveChat(null);
      fetchChats();
    }).catch(() => {});
  };

  const handleMarkImportant = (chat) => {
    setOpenMenu(null);
    setImportant(prev => ({ ...prev, [chatKey(chat)]: !prev[chatKey(chat)] }));
  };

  const totalUnread = chats.reduce((sum, c) => sum + (c.msg_count || 0), 0);

  const filtered = chats.filter(c => {
    if (filter === 'Unread' && !c.msg_count) return false;
    if (filter === 'Important' && !important[chatKey(c)]) return false;
    if (search && !c.other_user_name?.toLowerCase().includes(search.toLowerCase()) &&
        !c.title?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div style={wrapper}>

      {/* ── LEFT PANEL ── */}
      <div style={leftPanel}>

        {/* Header */}
        <div style={inboxHeader}>
          {showSearch ? (
            <div style={searchWrap}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                autoFocus style={searchInput} placeholder="Search chats..."
                value={search} onChange={e => setSearch(e.target.value)}
                onBlur={() => { if (!search) setShowSearch(false); }}
              />
              {search && <button style={clearBtn} onClick={() => setSearch('')}>✕</button>}
            </div>
          ) : (
            <>
              <div style={inboxTitle}>
                INBOX
                {totalUnread > 0 && <span style={inboxBadge}>{totalUnread}</span>}
              </div>
              <button style={iconBtn} onClick={() => setShowSearch(true)} title="Search">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </button>
            </>
          )}
        </div>

        {/* Quick Filters */}
        <div style={filtersBar}>
          <span style={filterLabel}>Quick Filters</span>
          <div style={filterChips}>
            {FILTERS.map(f => (
              <button key={f} style={filter === f ? chipActive : chip} onClick={() => setFilter(f)}>{f}</button>
            ))}
          </div>
        </div>

        {/* Verified banner */}
        <div style={verifiedBanner}>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#3a7bd5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            <polyline points="9 12 11 14 15 10"/>
          </svg>
          <span style={bannerText}>See all Verified Users</span>
        </div>

        {/* Chat list */}
        <div style={chatList}>
          {filtered.length === 0 && (
            <div style={emptyList}>No conversations yet.</div>
          )}
          {filtered.map(chat => {
            const key = chatKey(chat);
            const isActive    = activeChat && chatKey(activeChat) === key;
            const isImportant = important[key];
            const iSent       = chat.last_sender_id === user.id;
            const isRead      = iSent && chat.msg_count === 0;

            return (
              <div
                key={key}
                style={{
                  ...chatRow,
                  ...(isActive    ? chatRowActive    : {}),
                  ...(isImportant ? chatRowImportant : {}),
                }}
                onClick={() => { setActiveChat(chat); setOpenMenu(null); }}
                onMouseEnter={e => { if (!isActive) e.currentTarget.style.backgroundColor = '#f7f9fc'; }}
                onMouseLeave={e => { if (!isActive) e.currentTarget.style.backgroundColor = ''; }}
              >
                {/* Avatar: product thumbnail + user initial badge */}
                <div style={avatarWrap}>
                  <img src={`${getImg(chat.image_url)}`} alt="" style={productThumb} />
                  <div style={userInitial}>{(chat.other_user_name || 'U').charAt(0).toUpperCase()}</div>
                </div>

                {/* Info */}
                <div style={chatInfo}>
                  <div style={chatTop}>
                    <span style={chatName}>
                      {isImportant && <span style={{ color: '#f0a500' }}>★ </span>}
                      {chat.other_user_name || 'User'}
                    </span>
                    <span style={{ ...chatTime, color: chat.msg_count > 0 ? '#3a7bd5' : '#aaa' }}>
                      {formatTime(chat.last_time)}
                    </span>
                  </div>

                  <div style={chatProduct}>{chat.title}</div>

                  <div style={chatBottom}>
                    <div style={lastMsgRow}>
                      {iSent && <ReadTicks sent={iSent} read={isRead} />}
                      <span style={{ ...chatLastMsg, fontWeight: chat.msg_count > 0 ? '600' : '400', color: chat.msg_count > 0 ? '#111' : '#999' }}>
                        {chat.last_msg || '…'}
                      </span>
                    </div>
                    <div style={chatRight}>
                      {/* ⋮ menu */}
                      <div style={{ position: 'relative' }} ref={openMenu === key ? menuRef : null}>
                        <button
                          style={moreBtn}
                          onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === key ? null : key); }}
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="#888">
                            <circle cx="12" cy="5" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="12" cy="19" r="1.8"/>
                          </svg>
                        </button>
                        {openMenu === key && (
                          <div style={dropdownMenu} onClick={e => e.stopPropagation()}>
                            {[
                              { label: isImportant ? 'Unmark Important' : 'Mark as Important', action: () => handleMarkImportant(chat) },
                              { label: 'Delete Chat', action: () => handleDeleteChat(chat), danger: true },
                            ].map(item => (
                              <div
                                key={item.label}
                                style={{ ...dropdownItem, color: item.danger ? '#e74c3c' : '#333' }}
                                onClick={item.action}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f5f5f5'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
                              >
                                {item.label}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      {chat.msg_count > 0 && (
                        <span style={unreadBadge}>{chat.msg_count}</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div style={{ ...rightPanel, alignItems: activeChat ? 'stretch' : 'center', justifyContent: activeChat ? 'flex-start' : 'center' }}>
        {activeChat ? (
          <ChatWindow
            product={activeChat}
            currentUser={user}
            onBack={() => setActiveChat(null)}
            showProductPanel={false}
          />
        ) : (
          <div style={emptyState}>
            <ChatIllustration />
            <p style={emptyStateText}>Select a chat to view conversation</p>
          </div>
        )}
      </div>
    </div>
  );
}

function ChatIllustration() {
  return (
    <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
      <ellipse cx="45" cy="52" rx="34" ry="28" fill="#c8d8f0"/>
      <circle cx="35" cy="46" r="4" fill="#6b8fc2"/>
      <rect x="44" y="44" width="18" height="3" rx="1.5" fill="#6b8fc2"/>
      <rect x="44" y="50" width="12" height="3" rx="1.5" fill="#6b8fc2"/>
      <polygon points="28,72 38,62 50,72" fill="#c8d8f0"/>
      <ellipse cx="78" cy="42" rx="28" ry="22" fill="#3a7bd5" opacity="0.85"/>
      <circle cx="88" cy="38" r="3.5" fill="#fff" opacity="0.8"/>
      <rect x="66" y="36" width="14" height="3" rx="1.5" fill="#fff" opacity="0.8"/>
      <rect x="66" y="42" width="9" height="3" rx="1.5" fill="#fff" opacity="0.8"/>
      <polygon points="86,60 94,52 100,62" fill="#3a7bd5" opacity="0.85"/>
    </svg>
  );
}

/* ── STYLES ── */
const wrapper     = { display:'flex', height:'calc(100vh - 116px)', backgroundColor:'#f2f4f5', border:'1px solid #e0e0e0', borderRadius:'10px', overflow:'hidden', marginTop:'10px' };
const leftPanel   = { width:'380px', flexShrink:0, borderRight:'1px solid #e8e8e8', display:'flex', flexDirection:'column', backgroundColor:'#fff' };

const inboxHeader = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'16px 18px 14px', borderBottom:'1px solid #f0f0f0' };
const inboxTitle  = { display:'flex', alignItems:'center', gap:'10px', fontWeight:'900', fontSize:'17px', letterSpacing:'0.8px', color:'#002f34' };
const inboxBadge  = { backgroundColor:'#3a7bd5', color:'#fff', borderRadius:'50%', width:'22px', height:'22px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700' };
const iconBtn     = { background:'none', border:'none', cursor:'pointer', padding:'7px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#555' };

const searchWrap  = { display:'flex', alignItems:'center', gap:'8px', flex:1, backgroundColor:'#f5f5f5', borderRadius:'20px', padding:'8px 14px' };
const searchInput = { border:'none', background:'none', outline:'none', flex:1, fontSize:'14px', color:'#333' };
const clearBtn    = { background:'none', border:'none', cursor:'pointer', color:'#aaa', fontSize:'13px', padding:'0' };

const filtersBar  = { padding:'10px 18px 10px', borderBottom:'1px solid #f5f5f5' };
const filterLabel = { fontSize:'11px', color:'#aaa', fontWeight:'600', display:'block', marginBottom:'8px', textTransform:'uppercase', letterSpacing:'0.5px' };
const filterChips = { display:'flex', gap:'8px', flexWrap:'wrap' };
const chip        = { padding:'5px 14px', borderRadius:'20px', border:'1px solid #e0e0e0', background:'none', cursor:'pointer', fontSize:'12px', color:'#666', fontWeight:'500' };
const chipActive  = { ...chip, backgroundColor:'#002f34', borderColor:'#002f34', color:'#ffce32' };

const verifiedBanner = { display:'flex', alignItems:'center', gap:'8px', padding:'9px 16px', backgroundColor:'#f0f7ff', borderBottom:'1px solid #ddeeff' };
const bannerText     = { flex:1, fontSize:'12px', color:'#3a7bd5', fontWeight:'600' };

const chatList  = { flex:1, overflowY:'auto' };
const emptyList = { padding:'40px 20px', textAlign:'center', color:'#bbb', fontSize:'14px' };

const chatRow          = { display:'flex', gap:'12px', padding:'14px 16px', borderBottom:'1px solid #f5f5f5', cursor:'pointer', transition:'background 0.12s', alignItems:'flex-start', position:'relative' };
const chatRowActive    = { backgroundColor:'#eef4ff !important' };
const chatRowImportant = { borderLeft:'3px solid #f0a500' };

const avatarWrap   = { position:'relative', flexShrink:0 };
const productThumb = { width:'50px', height:'50px', borderRadius:'8px', objectFit:'cover', display:'block', border:'1px solid #eee' };
const userInitial  = { position:'absolute', bottom:'-4px', right:'-4px', width:'21px', height:'21px', borderRadius:'50%', backgroundColor:'#002f34', color:'#ffce32', fontSize:'10px', fontWeight:'800', display:'flex', alignItems:'center', justifyContent:'center', border:'2px solid #fff' };

const chatInfo   = { flex:1, minWidth:0 };
const chatTop    = { display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2px' };
const chatName   = { fontWeight:'700', fontSize:'14px', color:'#111', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', maxWidth:'180px' };
const chatTime   = { fontSize:'11px', fontWeight:'600', whiteSpace:'nowrap', marginLeft:'8px' };
const chatProduct= { fontSize:'12px', color:'#888', marginBottom:'3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' };
const chatBottom = { display:'flex', alignItems:'center', justifyContent:'space-between' };
const lastMsgRow = { display:'flex', alignItems:'center', gap:'4px', flex:1, overflow:'hidden' };
const chatLastMsg= { fontSize:'13px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' };
const chatRight  = { display:'flex', alignItems:'center', gap:'6px', flexShrink:0, marginLeft:'8px' };

const moreBtn    = { background:'none', border:'none', cursor:'pointer', padding:'4px', display:'flex', alignItems:'center', borderRadius:'4px' };
const unreadBadge= { backgroundColor:'#3a7bd5', color:'#fff', borderRadius:'50%', minWidth:'20px', height:'20px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:'700', padding:'0 4px' };

const dropdownMenu = { position:'absolute', right:'0', top:'26px', backgroundColor:'#fff', boxShadow:'0 4px 20px rgba(0,0,0,0.15)', borderRadius:'8px', zIndex:500, minWidth:'180px', overflow:'hidden', border:'1px solid #eee' };
const dropdownItem = { padding:'12px 18px', fontSize:'13px', cursor:'pointer', backgroundColor:'#fff', userSelect:'none', fontWeight:'500' };

const rightPanel    = { flex:1, display:'flex', flexDirection:'column', overflow:'hidden', backgroundColor:'#f9fafb' };
const emptyState    = { display:'flex', flexDirection:'column', alignItems:'center', gap:'16px' };
const emptyStateText= { color:'#999', fontSize:'15px', fontWeight:'500' };

export default MyChats;
