import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FooterAdmin from './FooterAdmin';

const API = 'http://localhost:5000/api/admin';

const CATEGORIES = [
  'Cars','Bikes','Properties','Electronics & Appliances','Mobiles',
  'Commercial Vehicles & Spares','Jobs','Furniture','Fashion',
  'Pets','Books, Sports & Hobbies','Services',
];

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard'   },
  { key: 'pending',   label: 'Pending Ads' },
  { key: 'listings',  label: 'All Listings'},
  { key: 'users',     label: 'Users'       },
  { key: 'footer',    label: 'Footer'      },
];

const NAV_ICONS = {
  dashboard: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/>
      <rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>
    </svg>
  ),
  pending: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
    </svg>
  ),
  listings: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
      <circle cx="3" cy="6" r="0.5" fill="currentColor"/><circle cx="3" cy="12" r="0.5" fill="currentColor"/><circle cx="3" cy="18" r="0.5" fill="currentColor"/>
    </svg>
  ),
  users: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
    </svg>
  ),
  footer: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2"/><line x1="3" y1="16" x2="21" y2="16"/>
      <line x1="8" y1="20" x2="8" y2="16"/><line x1="16" y1="20" x2="16" y2="16"/>
    </svg>
  ),
};

function getImg(d) { try { return JSON.parse(d)[0]; } catch { return d; } }
function fmtDate(ts) {
  if (!ts) return '—';
  return new Date(ts).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

export default function AdminDashboard({ user, onLogout }) {
  const [section,  setSection]  = useState('dashboard');
  const [stats,    setStats]    = useState(null);
  const [pending,  setPending]  = useState([]);
  const [listings, setListings] = useState([]);
  const [users,    setUsers]    = useState([]);
  const [search,   setSearch]   = useState('');
  const [toast,    setToast]    = useState('');

  // Edit modals
  const [editAd,   setEditAd]   = useState(null); // product object being edited
  const [editUser, setEditUser] = useState(null); // user object being edited
  const [viewAd,   setViewAd]   = useState(null); // product object being viewed

  const notify = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const loadStats    = useCallback(() => axios.get(`${API}/stats`).then(r => setStats(r.data)).catch(()=>{}), []);
  const loadPending  = useCallback(() => axios.get(`${API}/pending`).then(r => setPending(r.data)).catch(()=>{}), []);
  const loadListings = useCallback(() => axios.get(`${API}/all-products`).then(r => setListings(r.data)).catch(()=>{}), []);
  const loadUsers    = useCallback(() => axios.get(`${API}/users`).then(r => setUsers(r.data)).catch(()=>{}), []);

  useEffect(() => { loadStats(); }, [loadStats]);
  useEffect(() => {
    if (section === 'pending')   { loadPending(); loadStats(); }
    if (section === 'listings')  loadListings();
    if (section === 'users')     loadUsers();
    if (section === 'dashboard') { loadPending(); loadStats(); }
  }, [section, loadPending, loadListings, loadUsers, loadStats]);

  // ── AD ACTIONS ──────────────────────────────────────────────────
  const approveAd = (id) => {
    axios.post(`${API}/approve`, { id }).then(() => {
      notify('✅ Ad approved');
      loadPending(); loadStats(); loadListings();
    });
  };

  const saveAd = () => {
    axios.put(`${API}/product/${editAd.id}`, editAd).then(() => {
      notify('✅ Ad updated successfully');
      setEditAd(null);
      loadPending(); loadListings(); loadStats();
    }).catch(() => notify('❌ Failed to update ad'));
  };

  const deleteAd = (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    axios.delete(`${API}/product/${id}`).then(() => {
      notify('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> Ad deleted');
      loadPending(); loadListings(); loadStats();
      if (viewAd?.id === id) setViewAd(null);
    });
  };

  // ── USER ACTIONS ─────────────────────────────────────────────────
  const saveUser = () => {
    axios.put(`${API}/user/${editUser.id}`, editUser).then(() => {
      notify('✅ User updated successfully');
      setEditUser(null);
      loadUsers();
    }).catch(() => notify('❌ Failed to update user'));
  };

  const deleteUser = (id, name) => {
    if (!window.confirm(`Delete user "${name}" and all their data?`)) return;
    axios.delete(`${API}/user/${id}`).then(() => {
      notify('<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg> User deleted');
      loadUsers(); loadStats();
    });
  };

  // ── FILTERED DATA ────────────────────────────────────────────────
  const filteredListings = listings.filter(p =>
    !search ||
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.seller_name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase())
  );
  const filteredUsers = users.filter(u =>
    !search ||
    u.name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={shell}>

      {/* ── SIDEBAR ─────────────────────────────────────────────── */}
      <aside style={sidebar}>
        <div style={sideTop}>
          <div style={sideLogo}>
            <span style={logoBox}>OM</span>
            <div>
              <div style={logoName}>OpenMarket</div>
              <div style={logoSub}>Admin Panel</div>
            </div>
          </div>
        </div>
        <nav style={navList}>
          {NAV_ITEMS.map(item => (
            <div
              key={item.key}
              style={{ ...navItem, ...(section === item.key ? navItemActive : {}) }}
              onClick={() => { setSection(item.key); setSearch(''); }}
            >
              <span style={navIcon}>{NAV_ICONS[item.key]}</span>
              <span>{item.label}</span>
              {item.key === 'pending' && pending.length > 0 &&
                <span style={navBadge}>{pending.length}</span>}
            </div>
          ))}
        </nav>
        <div style={sideBottom}>
          <div style={adminInfo}>
            <div style={adminAvatar}>{user.name.charAt(0).toUpperCase()}</div>
            <div>
              <div style={adminName}>{user.name}</div>
              <div style={adminRole}>Administrator</div>
            </div>
          </div>
          <button style={logoutBtn} onClick={onLogout}>Logout</button>
        </div>
      </aside>

      {/* ── MAIN ─────────────────────────────────────────────────── */}
      <main style={main}>
        {toast && <div style={toastBox}>{toast}</div>}

        {/* DASHBOARD */}
        {section === 'dashboard' && (
          <>
            <div style={pageHeader}>
              <h2 style={pageTitle}>Dashboard Overview</h2>
              <span style={pageDate}>{new Date().toLocaleDateString('en-IN',{weekday:'long',day:'2-digit',month:'long',year:'numeric'})}</span>
            </div>
            <div style={statsGrid}>
              <StatCard color="#3a7bd5" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>} label="Total Users"   value={stats?.users    ?? '…'} />
              <StatCard color="#27ae60" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/></svg>} label="Total Listings" value={stats?.products ?? '…'} />
              <StatCard color="#e67e22" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label="Pending Review" value={stats?.pending  ?? '…'} />
              <StatCard color="#8e44ad" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>} label="Approved Ads"   value={stats?.approved ?? '…'} />
              <StatCard color="#e74c3c" icon={<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>} label="Total Messages" value={stats?.messages ?? '…'} />
            </div>
            <div style={sectionCard}>
              <div style={cardHeader}>
                <span style={cardTitle}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginRight:6,verticalAlign:'middle'}}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Ads Awaiting Approval
                </span>
                <button style={viewAllBtn} onClick={() => setSection('pending')}>View All →</button>
              </div>
              {pending.length === 0
                ? <p style={emptyMsg}>No pending ads.</p>
                : <AdsTable rows={pending.slice(0,5)} onApprove={approveAd} onDelete={deleteAd} onEdit={setEditAd} onView={setViewAd} showApprove />}
            </div>
          </>
        )}

        {/* PENDING ADS */}
        {section === 'pending' && (
          <>
            <div style={pageHeader}>
              <h2 style={pageTitle}>Pending Ads <Chip>{pending.length}</Chip></h2>
            </div>
            <div style={sectionCard}>
              {pending.length === 0
                ? <p style={emptyMsg}>All caught up! No pending ads.</p>
                : <AdsTable rows={pending} onApprove={approveAd} onDelete={deleteAd} onEdit={setEditAd} onView={setViewAd} showApprove />}
            </div>
          </>
        )}

        {/* ALL LISTINGS */}
        {section === 'listings' && (
          <>
            <div style={pageHeader}>
              <h2 style={pageTitle}>All Listings <Chip>{filteredListings.length}</Chip></h2>
              <input style={searchBox} placeholder="Search title, seller, category…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={sectionCard}>
              {filteredListings.length === 0
                ? <p style={emptyMsg}>No listings found.</p>
                : <AdsTable rows={filteredListings} onApprove={approveAd} onDelete={deleteAd} onEdit={setEditAd} onView={setViewAd} showApprove showStatus />}
            </div>
          </>
        )}

        {/* FOOTER */}
        {section === 'footer' && (
          <>
            <FooterAdmin notify={notify} />
          </>
        )}

        {/* USERS */}
        {section === 'users' && (
          <>
            <div style={pageHeader}>
              <h2 style={pageTitle}>Users <Chip>{filteredUsers.length}</Chip></h2>
              <input style={searchBox} placeholder="Search name or email…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={sectionCard}>
              {filteredUsers.length === 0
                ? <p style={emptyMsg}>No users found.</p>
                : (
                  <table style={table}>
                    <thead>
                      <tr>
                        {['#','Name','Email','Role','Ads','Joined','Actions'].map(h => (
                          <th key={h} style={th}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((u, i) => (
                        <tr key={u.id} style={i%2===0?trEven:trOdd}>
                          <td style={td}>{i+1}</td>
                          <td style={td}>
                            <div style={userCell}>
                              <div style={userAvatar}>{u.name.charAt(0).toUpperCase()}</div>
                              <span style={{fontWeight:'600',color:'#002f34'}}>{u.name}</span>
                            </div>
                          </td>
                          <td style={td}>{u.email}</td>
                          <td style={td}><span style={u.role==='seller'?sellerBadge:userBadge}>{u.role}</span></td>
                          <td style={td}><span style={adCountBadge}>{u.ad_count}</span></td>
                          <td style={td}>{fmtDate(u.created_at)}</td>
                          <td style={td}>
                            <div style={actionRow}>
                              <button style={editBtn} onClick={() => setEditUser({...u})}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                              <button style={dangerBtn} onClick={() => deleteUser(u.id, u.name)}>Delete</button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
            </div>
          </>
        )}
      </main>

      {/* ── VIEW AD MODAL ─────────────────────────────────────────── */}
      {viewAd && (
        <Modal onClose={() => setViewAd(null)} title="Ad Details">
          <div style={viewGrid}>
            <img src={`http://localhost:5000${getImg(viewAd.image_url)}`} style={viewImg} alt="" />
            <div style={viewInfo}>
              <h3 style={viewTitle}>{viewAd.title}</h3>
              <div style={viewRow}><span style={viewLabel}>Seller</span><span>{viewAd.seller_name || '—'}</span></div>
              <div style={viewRow}><span style={viewLabel}>Category</span><span style={catBadge}>{viewAd.category}</span></div>
              <div style={viewRow}><span style={viewLabel}>Price</span><strong>₹{Number(viewAd.price).toLocaleString('en-IN')}</strong></div>
              <div style={viewRow}><span style={viewLabel}>Location</span><span>{viewAd.location}</span></div>
              <div style={viewRow}><span style={viewLabel}>Status</span>
                <span style={viewAd.is_approved ? approvedBadge : pendingBadge}>
                  {viewAd.is_approved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div style={viewRow}><span style={viewLabel}>Posted</span><span>{fmtDate(viewAd.created_at)}</span></div>
              {viewAd.description && (
                <div style={{marginTop:'12px'}}>
                  <div style={viewLabel}>Description</div>
                  <p style={{margin:'6px 0 0',fontSize:'14px',color:'#555',lineHeight:1.6}}>{viewAd.description}</p>
                </div>
              )}
            </div>
          </div>
          <div style={modalFooter}>
            {!viewAd.is_approved && <button style={approveBtn} onClick={() => { approveAd(viewAd.id); setViewAd(null); }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Approve</button>}
            <button style={editBtn} onClick={() => { setEditAd({...viewAd}); setViewAd(null); }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
            <button style={dangerBtn} onClick={() => { deleteAd(viewAd.id, viewAd.title); setViewAd(null); }}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>Delete</button>
            <button style={cancelBtn} onClick={() => setViewAd(null)}>Close</button>
          </div>
        </Modal>
      )}

      {/* ── EDIT AD MODAL ─────────────────────────────────────────── */}
      {editAd && (
        <Modal onClose={() => setEditAd(null)} title="Edit Ad">
          <div style={formGrid}>
            <div style={formGroup}>
              <label style={formLabel}>Title</label>
              <input style={formInput} value={editAd.title||''} onChange={e => setEditAd({...editAd, title: e.target.value})} />
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Price (₹)</label>
              <input style={formInput} type="number" value={editAd.price||''} onChange={e => setEditAd({...editAd, price: e.target.value})} />
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Category</label>
              <select style={formInput} value={editAd.category||''} onChange={e => setEditAd({...editAd, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Location</label>
              <input style={formInput} value={editAd.location||''} onChange={e => setEditAd({...editAd, location: e.target.value})} />
            </div>
            <div style={{...formGroup, gridColumn:'1/-1'}}>
              <label style={formLabel}>Description</label>
              <textarea style={{...formInput,height:'90px',resize:'vertical'}} value={editAd.description||''} onChange={e => setEditAd({...editAd, description: e.target.value})} />
            </div>
            <div style={{...formGroup, gridColumn:'1/-1', display:'flex', alignItems:'center', gap:'10px'}}>
              <input type="checkbox" id="approvedChk" checked={!!editAd.is_approved}
                onChange={e => setEditAd({...editAd, is_approved: e.target.checked ? 1 : 0})} />
              <label htmlFor="approvedChk" style={{fontSize:'14px',fontWeight:'600',cursor:'pointer'}}>Mark as Approved</label>
            </div>
          </div>
          <div style={modalFooter}>
            <button style={approveBtn} onClick={saveAd}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>Save Changes</button>
            <button style={cancelBtn} onClick={() => setEditAd(null)}>Cancel</button>
          </div>
        </Modal>
      )}

      {/* ── EDIT USER MODAL ───────────────────────────────────────── */}
      {editUser && (
        <Modal onClose={() => setEditUser(null)} title="Edit User">
          <div style={formGrid}>
            <div style={formGroup}>
              <label style={formLabel}>Full Name</label>
              <input style={formInput} value={editUser.name||''} onChange={e => setEditUser({...editUser, name: e.target.value})} />
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Email</label>
              <input style={formInput} type="email" value={editUser.email||''} onChange={e => setEditUser({...editUser, email: e.target.value})} />
            </div>
            <div style={formGroup}>
              <label style={formLabel}>Role</label>
              <select style={formInput} value={editUser.role||'user'} onChange={e => setEditUser({...editUser, role: e.target.value})}>
                <option value="user">User</option>
                <option value="seller">Seller</option>
              </select>
            </div>
          </div>
          <div style={modalFooter}>
            <button style={approveBtn} onClick={saveUser}>Save Changes</button>
            <button style={cancelBtn} onClick={() => setEditUser(null)}>Cancel</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ── SUB-COMPONENTS ───────────────────────────────────────────────────
function StatCard({ color, icon, label, value }) {
  return (
    <div style={{ ...statCard, borderTop: `4px solid ${color}` }}>
      <div style={{ ...statIcon, backgroundColor: color + '18', color }}>
        {icon}
      </div>
      <div>
        <div style={statValue}>{value}</div>
        <div style={statLabel}>{label}</div>
      </div>
    </div>
  );
}

function Chip({ children }) {
  return <span style={chipStyle}>{children}</span>;
}

function Modal({ onClose, title, children }) {
  return (
    <div style={overlay} onClick={onClose}>
      <div style={modalBox} onClick={e => e.stopPropagation()}>
        <div style={modalHeader}>
          <span style={modalTitle}>{title}</span>
          <button style={closeBtn} onClick={onClose}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
        </div>
        <div style={modalBody}>{children}</div>
      </div>
    </div>
  );
}

function AdsTable({ rows, onApprove, onDelete, onEdit, onView, showApprove, showStatus }) {
  return (
    <table style={table}>
      <thead>
        <tr>
          {['Image','Title','Seller','Category','Price', ...(showStatus?['Status']:[]),'Date','Actions'].map(h => (
            <th key={h} style={th}>{h}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((item, i) => (
          <tr key={item.id} style={i%2===0?trEven:trOdd}>
            <td style={td}>
              <img src={`http://localhost:5000${getImg(item.image_url)}`} style={adThumb} alt=""
                onClick={() => onView(item)} title="View details"
              />
            </td>
            <td style={{...td, maxWidth:'180px'}}>
              <span style={adTitleStyle} onClick={() => onView(item)} title="View details">{item.title}</span>
            </td>
            <td style={td}>{item.seller_name||'—'}</td>
            <td style={td}><span style={catBadge}>{item.category}</span></td>
            <td style={td}><strong>₹{Number(item.price).toLocaleString('en-IN')}</strong></td>
            {showStatus && (
              <td style={td}>
                <span style={item.is_approved ? approvedBadge : pendingBadge}>
                  {item.is_approved ? 'Approved' : 'Pending'}
                </span>
              </td>
            )}
            <td style={td}>{fmtDate(item.created_at)}</td>
            <td style={td}>
              <div style={actionRow}>
                {showApprove && !item.is_approved &&
                  <button style={approveBtn} onClick={() => onApprove(item.id)}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>Approve</button>}
                <button style={editBtn} onClick={() => onEdit({...item})}><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>Edit</button>
                <button style={dangerBtn} onClick={() => onDelete(item.id, item.title)}><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg></button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

// ── STYLES ────────────────────────────────────────────────────────────
const shell   = { display:'flex', minHeight:'100vh', fontFamily:"'Segoe UI',Arial,sans-serif", backgroundColor:'#f0f2f5' };
const sidebar = { width:'240px', flexShrink:0, backgroundColor:'#002f34', display:'flex', flexDirection:'column', position:'sticky', top:0, height:'100vh' };
const sideTop = { padding:'24px 20px 16px' };
const sideLogo= { display:'flex', alignItems:'center', gap:'12px' };
const logoBox = { backgroundColor:'#ffce32', color:'#002f34', fontWeight:'900', fontSize:'14px', padding:'6px 10px', borderRadius:'6px' };
const logoName= { color:'#fff', fontWeight:'800', fontSize:'16px' };
const logoSub = { color:'rgba(255,255,255,0.5)', fontSize:'11px' };
const navList = { flex:1, padding:'8px 0' };
const navItem = { display:'flex', alignItems:'center', gap:'12px', padding:'12px 20px', cursor:'pointer', color:'rgba(255,255,255,0.7)', fontSize:'14px', fontWeight:'600', transition:'all 0.15s', position:'relative' };
const navItemActive = { backgroundColor:'rgba(255,255,255,0.12)', color:'#ffce32', borderLeft:'3px solid #ffce32' };
const navIcon = { fontSize:'18px', width:'22px' };
const navBadge= { marginLeft:'auto', backgroundColor:'#e74c3c', color:'#fff', borderRadius:'10px', padding:'1px 7px', fontSize:'11px', fontWeight:'700' };
const sideBottom={ padding:'16px 20px', borderTop:'1px solid rgba(255,255,255,0.1)' };
const adminInfo={ display:'flex', alignItems:'center', gap:'10px', marginBottom:'12px' };
const adminAvatar={ width:'36px', height:'36px', borderRadius:'50%', backgroundColor:'#ffce32', color:'#002f34', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'16px', flexShrink:0 };
const adminName={ color:'#fff', fontWeight:'700', fontSize:'13px' };
const adminRole={ color:'rgba(255,255,255,0.5)', fontSize:'11px' };
const logoutBtn={ width:'100%', padding:'9px', backgroundColor:'#e74c3c', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'700', fontSize:'13px' };

const main     = { flex:1, padding:'28px 32px', overflowY:'auto' };
const pageHeader={ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'24px', flexWrap:'wrap', gap:'12px' };
const pageTitle = { fontSize:'22px', fontWeight:'800', color:'#002f34', margin:0 };
const pageDate  = { fontSize:'13px', color:'#888' };
const chipStyle = { backgroundColor:'#e8f0fe', color:'#3a7bd5', borderRadius:'12px', padding:'2px 10px', fontSize:'14px', fontWeight:'700', marginLeft:'8px' };
const searchBox = { padding:'9px 16px', border:'1px solid #ddd', borderRadius:'8px', fontSize:'14px', outline:'none', width:'280px' };
const toastBox  = { position:'fixed', top:'24px', right:'32px', backgroundColor:'#002f34', color:'#ffce32', padding:'12px 24px', borderRadius:'8px', fontWeight:'700', fontSize:'14px', zIndex:9999, boxShadow:'0 4px 16px rgba(0,0,0,0.2)' };

const statsGrid = { display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(180px,1fr))', gap:'16px', marginBottom:'28px' };
const statCard  = { backgroundColor:'#fff', borderRadius:'10px', padding:'20px', display:'flex', alignItems:'center', gap:'14px', boxShadow:'0 1px 4px rgba(0,0,0,0.07)' };
const statIcon  = { width:'48px', height:'48px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 };
const statValue = { fontSize:'28px', fontWeight:'900', color:'#002f34', lineHeight:1 };
const statLabel = { fontSize:'12px', color:'#888', fontWeight:'600', marginTop:'4px' };

const sectionCard={ backgroundColor:'#fff', borderRadius:'10px', boxShadow:'0 1px 4px rgba(0,0,0,0.07)', overflow:'hidden' };
const cardHeader = { display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 20px', borderBottom:'1px solid #f0f0f0' };
const cardTitle  = { fontWeight:'700', fontSize:'15px', color:'#002f34' };
const viewAllBtn = { background:'none', border:'none', color:'#3a7bd5', cursor:'pointer', fontWeight:'700', fontSize:'13px' };
const emptyMsg   = { padding:'40px', textAlign:'center', color:'#aaa', fontSize:'15px' };

const table   = { width:'100%', borderCollapse:'collapse' };
const th      = { padding:'12px 14px', textAlign:'left', fontSize:'12px', fontWeight:'700', color:'#888', textTransform:'uppercase', letterSpacing:'0.5px', backgroundColor:'#f8f9fa', borderBottom:'1px solid #eee' };
const trEven  = {};
const trOdd   = { backgroundColor:'#fafafa' };
const td      = { padding:'11px 14px', fontSize:'14px', color:'#333', verticalAlign:'middle', borderBottom:'1px solid #f5f5f5' };

const adThumb     = { width:'50px', height:'50px', objectFit:'cover', borderRadius:'6px', display:'block', cursor:'pointer' };
const adTitleStyle= { fontWeight:'600', color:'#002f34', cursor:'pointer', textDecoration:'underline dotted' };
const catBadge    = { backgroundColor:'#e8f0fe', color:'#3a7bd5', borderRadius:'12px', padding:'2px 10px', fontSize:'12px', fontWeight:'600' };
const approvedBadge={ backgroundColor:'#d4edda', color:'#155724', borderRadius:'12px', padding:'3px 10px', fontSize:'12px', fontWeight:'600' };
const pendingBadge ={ backgroundColor:'#fff3cd', color:'#856404', borderRadius:'12px', padding:'3px 10px', fontSize:'12px', fontWeight:'600' };
const sellerBadge  = { backgroundColor:'#fde8e8', color:'#c0392b', borderRadius:'12px', padding:'2px 10px', fontSize:'12px', fontWeight:'600' };
const userBadge    = { backgroundColor:'#e8f5e9', color:'#27ae60', borderRadius:'12px', padding:'2px 10px', fontSize:'12px', fontWeight:'600' };
const adCountBadge = { backgroundColor:'#e8f0fe', color:'#3a7bd5', borderRadius:'10px', padding:'2px 10px', fontWeight:'700', fontSize:'13px' };
const userCell  = { display:'flex', alignItems:'center', gap:'10px' };
const userAvatar= { width:'34px', height:'34px', borderRadius:'50%', backgroundColor:'#002f34', color:'#ffce32', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'800', fontSize:'14px', flexShrink:0 };

const actionRow = { display:'flex', gap:'6px', alignItems:'center', flexWrap:'wrap' };
const approveBtn= { padding:'6px 12px', backgroundColor:'#27ae60', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'700', fontSize:'12px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:'5px' };
const editBtn   = { padding:'6px 12px', backgroundColor:'#3a7bd5', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'700', fontSize:'12px', whiteSpace:'nowrap', display:'inline-flex', alignItems:'center', gap:'5px' };
const dangerBtn = { padding:'6px 12px', backgroundColor:'#e74c3c', color:'#fff', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'700', fontSize:'12px', display:'inline-flex', alignItems:'center', gap:'5px' };
const cancelBtn = { padding:'6px 14px', backgroundColor:'#eee', color:'#555', border:'none', borderRadius:'6px', cursor:'pointer', fontWeight:'700', fontSize:'13px' };

// Modal
const overlay   = { position:'fixed', inset:0, backgroundColor:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000 };
const modalBox  = { backgroundColor:'#fff', borderRadius:'12px', width:'620px', maxWidth:'95vw', maxHeight:'90vh', display:'flex', flexDirection:'column', boxShadow:'0 20px 60px rgba(0,0,0,0.3)' };
const modalHeader={ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px', borderBottom:'1px solid #eee' };
const modalTitle= { fontWeight:'800', fontSize:'16px', color:'#002f34' };
const closeBtn  = { background:'none', border:'none', cursor:'pointer', fontSize:'18px', color:'#888', lineHeight:1 };
const modalBody = { padding:'24px', overflowY:'auto', flex:1 };
const modalFooter={ display:'flex', gap:'10px', padding:'16px 24px', borderTop:'1px solid #eee', justifyContent:'flex-end' };

// View modal
const viewGrid  = { display:'flex', gap:'20px', marginBottom:'8px' };
const viewImg   = { width:'140px', height:'140px', objectFit:'cover', borderRadius:'8px', flexShrink:0 };
const viewInfo  = { flex:1 };
const viewTitle = { margin:'0 0 12px', fontSize:'17px', color:'#002f34' };
const viewRow   = { display:'flex', alignItems:'center', gap:'10px', marginBottom:'8px', fontSize:'14px' };
const viewLabel = { color:'#999', fontWeight:'600', fontSize:'12px', width:'80px', flexShrink:0 };

// Edit form
const formGrid  = { display:'grid', gridTemplateColumns:'1fr 1fr', gap:'16px' };
const formGroup = { display:'flex', flexDirection:'column', gap:'6px' };
const formLabel = { fontSize:'12px', fontWeight:'700', color:'#002f34' };
const formInput = { padding:'9px 12px', border:'1px solid #ddd', borderRadius:'6px', fontSize:'14px', outline:'none', fontFamily:'inherit' };
