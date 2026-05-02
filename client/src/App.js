import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Signup from './Signup';
import Login from './Login';
import ProductFeed from './ProductFeed';
import SellerDashboard from './SellerDashboard';
import AdminDashboard from './AdminDashboard';
import MyAds from './MyAds';
import Settings from './Settings';
import ViewCart from './ViewCart';
import ProductPage from './ProductPage';
import ChatWindow from './ChatWindow';
import MyChats from './MyChats';
import Notifications from './Notifications';
import Footer from './Footer';
import FooterPage from './FooterPage';
import { LanguageProvider, useLang } from './LanguageContext';

function AppInner() {
  const { t } = useLang();
  const [user, setUser]                   = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_user')) || null; } catch { return null; }
  });
  const [view, setView] = useState(() => {
    const saved = sessionStorage.getItem('om_view') || 'market';
    const savedUser = (() => { try { return JSON.parse(localStorage.getItem('om_user')); } catch { return null; } })();
    const authViews = ['cart','sell','my-ads','settings','notifications','my-chats','chat'];
    if (authViews.includes(saved) && !savedUser) return 'market';
    return saved;
  });
  const [activeProduct, setActiveProduct] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('om_activeProduct')); } catch { return null; }
  });
  const [unreadCount, setUnreadCount]     = useState(0);
  const [showDropdown, setShowDropdown]   = useState(false);
  const [searchQuery, setSearchQuery]     = useState('');
  const [searchInput, setSearchInput]     = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authTab, setAuthTab]             = useState('login');
  const [unreadNotifCount, setUnreadNotifCount] = useState(0);
  const [bellRing, setBellRing]           = useState(false);
  const [homeKey, setHomeKey]             = useState(0);
  const [activeFooterLink, setActiveFooterLink] = useState(() => {
    try { return JSON.parse(sessionStorage.getItem('om_activeFooterLink')); } catch { return null; }
  });
  const [wishlistedProducts, setWishlistedProducts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('om_wishlist')) || {}; } catch { return {}; }
  });

  const toggleWishlistProduct = (product) => {
    setWishlistedProducts(prev => {
      const next = { ...prev };
      if (next[product.id]) delete next[product.id];
      else next[product.id] = product;
      localStorage.setItem('om_wishlist', JSON.stringify(next));
      return next;
    });
  };
  const removeFromWishlist = (id) =>
    setWishlistedProducts(prev => {
      const n = { ...prev };
      delete n[id];
      localStorage.setItem('om_wishlist', JSON.stringify(n));
      return n;
    });

  /* Persist user to localStorage */
  useEffect(() => {
    if (user) localStorage.setItem('om_user', JSON.stringify(user));
    else localStorage.removeItem('om_user');
  }, [user]);

  /* Persist navigation state to sessionStorage so refresh restores the page */
  useEffect(() => { sessionStorage.setItem('om_view', view); }, [view]);

  /* Sync view to browser history so Back / Forward buttons work */
  const historyInitDone = React.useRef(false);
  useEffect(() => {
    const state = { view, activeProduct };
    if (!historyInitDone.current) {
      historyInitDone.current = true;
      window.history.replaceState(state, '');
    } else {
      window.history.pushState(state, '');
    }
  }, [view]); // eslint-disable-line

  /* Listen for browser Back / Forward */
  useEffect(() => {
    const onPop = (e) => {
      const s = e.state;
      if (!s) return;
      const restoredView = s.view || 'market';
      setView(restoredView);
      setActiveProduct(s.activeProduct || null);
      sessionStorage.setItem('om_view', restoredView);
      if (s.activeProduct) sessionStorage.setItem('om_activeProduct', JSON.stringify(s.activeProduct));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  useEffect(() => {
    if (activeProduct) sessionStorage.setItem('om_activeProduct', JSON.stringify(activeProduct));
    else sessionStorage.removeItem('om_activeProduct');
  }, [activeProduct]);
  useEffect(() => {
    if (activeFooterLink) sessionStorage.setItem('om_activeFooterLink', JSON.stringify(activeFooterLink));
    else sessionStorage.removeItem('om_activeFooterLink');
  }, [activeFooterLink]);

  /* Unread chat badge */
  useEffect(() => {
    if (!user) return;
    const check = () =>
      axios.get(`/api/chats/summary/${user.id}`)
        .then(r => setUnreadCount(r.data.filter(c => c.msg_count > 0).length)).catch(() => {});
    check();
    const t = setInterval(check, 5000);
    return () => clearInterval(t);
  }, [user]);

  /* Notification unread count polling — ring bell when new ones arrive */
  useEffect(() => {
    if (!user) return;
    let prevCount = 0;
    const fetchCount = () =>
      axios.get(`/api/notifications/${user.id}`)
        .then(r => {
          const count = r.data.filter(n => !n.is_read).length;
          if (count > prevCount) { setBellRing(true); setTimeout(() => setBellRing(false), 2000); }
          prevCount = count;
          setUnreadNotifCount(count);
        })
        .catch(() => {});
    fetchCount();
    const t = setInterval(fetchCount, 8000);
    return () => clearInterval(t);
  }, [user]);

  /* Close dropdown on outside click */
  useEffect(() => {
    const h = () => setShowDropdown(false);
    if (showDropdown) window.addEventListener('click', h);
    return () => window.removeEventListener('click', h);
  }, [showDropdown]);

  /* Close auth modal on Escape */
  useEffect(() => {
    const h = (e) => { if (e.key === 'Escape') setShowAuthModal(false); };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setView('market');
    setActiveProduct(null);
  };

  const openAuth = (tab = 'login') => { setAuthTab(tab); setShowAuthModal(true); };

  const handleLoginSuccess = (u) => {
    setUser(u);
    setShowAuthModal(false);
    setView('market');
    setActiveProduct(null);
    setSearchQuery('');
    setSearchInput('');
  };

  const handleLogout = () => {
    setUser(null);
    setView('market');
    setActiveProduct(null);
    setSearchQuery('');
    setSearchInput('');
  };

  const requireAuth = (action) => {
    if (!user) { openAuth('login'); return false; }
    action();
    return true;
  };

  if (user?.role === 'admin') {
    return <AdminDashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div style={appWrapper}>

      {/* ── TOP NAVBAR ── */}
      <header className="navbar-anim header-premium" style={headerWrap}>
        <div style={navInner}>

          {/* Logo */}
          <div
            className="logo-hover"
            style={logoWrap}
            onClick={() => { setView('market'); setActiveProduct(null); setSearchQuery(''); setSearchInput(''); setHomeKey(k => k + 1); sessionStorage.setItem('om_filter','All'); sessionStorage.setItem('om_view','market'); }}
          >
            <div style={logoBox}><span style={logoBoxText}>Open</span></div>
            <span style={logoSuffix}>Market</span>
          </div>

          {/* Search */}
          <form className="search-focus" style={searchForm} onSubmit={handleSearch}>
            <input
              style={searchBarInput}
              placeholder={t('search')}
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
            />
            <button type="submit" style={searchBarBtn} className="premium-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
            </button>
          </form>

          {/* Right actions */}
          <div style={navActions}>

            {/* Bell Notifications */}
            {user && (
              <div
                className="nav-icon-hover"
                style={navIconBtn}
                onClick={() => { setView('notifications'); setUnreadNotifCount(0); setBellRing(false); }}
              >
                <div style={{ position: 'relative' }}>
                  <span className={bellRing ? 'bell-ring' : ''} style={{ display: 'inline-block' }}>
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002f34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                  </span>
                  {unreadNotifCount > 0 && (
                    <div className="badge-pop" style={notifDot}>{unreadNotifCount}</div>
                  )}
                </div>
                <span style={navIconLabel}>{t('alerts')}</span>
              </div>
            )}

            {/* Wishlist */}
            <div className="nav-icon-hover" style={navIconBtn} onClick={() => requireAuth(() => setView('cart'))}>
              <div style={{ position: 'relative' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002f34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                </svg>
                {Object.keys(wishlistedProducts).length > 0 && (
                  <div style={notifDot}>{Object.keys(wishlistedProducts).length}</div>
                )}
              </div>
              <span style={navIconLabel}>{t('wishlist')}</span>
            </div>

            {/* User section */}
            {user ? (
              <div style={{ position: 'relative' }}>
                <div
                  className="avatar-glow"
                  style={avatarBtn}
                  onClick={(e) => { e.stopPropagation(); setShowDropdown(!showDropdown); }}
                >
                  <div style={avatarCircle}>
                    {user.name.charAt(0).toUpperCase()}
                    {unreadCount > 0 && <div style={dotBadge}/>}
                  </div>
                  <span style={navIconLabel}>{user.name.split(' ')[0]}</span>
                </div>

                {showDropdown && (
                  <div className="dropdown-anim" style={dropdown} onClick={e => e.stopPropagation()}>
                    <div style={dropdownHeader}>
                      <div style={dropdownAvatar}>{user.name.charAt(0).toUpperCase()}</div>
                      <div>
                        <div style={dropdownName}>{user.name}</div>
                        <div style={dropdownEmail}>{user.email || 'User'}</div>
                      </div>
                    </div>
                    <hr style={ddDivider}/>
                    <div className="dd-item-hover" style={ddItem} onClick={() => { setView('my-ads'); setShowDropdown(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
                      {t('my_ads')}
                    </div>
                    <div className="dd-item-hover" style={ddItem} onClick={() => { setView('my-chats'); setShowDropdown(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                      {t('my_chats')}
                      {unreadCount > 0 && <span style={badge}>{unreadCount}</span>}
                    </div>
                    <div className="dd-item-hover" style={ddItem} onClick={() => { setView('settings'); setShowDropdown(false); }}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                      {t('settings')}
                    </div>
                    <hr style={ddDivider}/>
                    <div className="dd-item-hover" style={{ ...ddItem, color: '#e74c3c' }} onClick={handleLogout}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                      {t('logout')}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div style={navActions}>
                <button className="login-btn-anim" style={loginNavBtn} onClick={() => openAuth('login')}>{t('login')}</button>
                <button className="register-btn-anim" style={registerNavBtn} onClick={() => openAuth('register')}>{t('register')}</button>
              </div>
            )}

            {/* SELL button */}
            <button className="sell-btn-glow" style={sellButton} onClick={() => requireAuth(() => setView('sell'))}>
              {t('sell')}
            </button>
          </div>
        </div>
      </header>

      {/* ── MAIN CONTENT ── */}
      <main style={mainContent}>
        {view === 'market' && (
          <ProductFeed
            key={homeKey}
            onProductClick={(p) => { setActiveProduct(p); setView('product-detail'); }}
            searchQuery={searchQuery}
            wishlist={wishlistedProducts}
            onToggleWishlist={toggleWishlistProduct}
          />
        )}
        {view === 'product-detail' && (
          <ProductPage
            product={activeProduct}
            onBack={() => setView('market')}
            setView={setView}
            user={user}
            onRequireAuth={() => openAuth('login')}
          />
        )}
        {view === 'chat' && user && (
          <div style={{ height: 'calc(100vh - 110px)', display:'flex', flexDirection:'column' }}>
            <ChatWindow product={activeProduct} currentUser={user} onBack={() => setView('my-chats')} showProductPanel={false} />
          </div>
        )}
        {view === 'my-chats' && user && (
          <MyChats user={user} onSelectChat={(p) => { setActiveProduct(p); setView('chat'); }} />
        )}
        {view === 'sell'     && user && <SellerDashboard user={user} setView={setView} />}
        {view === 'my-ads'   && user && <MyAds user={user} />}
        {view === 'cart'     && user && <ViewCart user={user} items={Object.values(wishlistedProducts)} onRemove={removeFromWishlist} onProductClick={(p) => { setActiveProduct(p); setView('product-detail'); }} />}
        {view === 'settings'       && user && <Settings user={user} onLogout={handleLogout} />}
        {view === 'notifications'  && user && <Notifications user={user} />}
        {view === 'footer-page' && <FooterPage link={activeFooterLink} onBack={() => { setView('market'); setActiveFooterLink(null); }} />}
      </main>

      {/* ── FOOTER — hidden on full-screen chat views ── */}
      {!['chat', 'my-chats'].includes(view) && (
        <Footer
          onLinkClick={(link) => {
            setActiveFooterLink(link);
            setView('footer-page');
          }}
        />
      )}

      {/* ── AUTH MODAL ── */}
      {showAuthModal && (
        <div className="modal-overlay-anim" style={modalOverlay} onClick={() => setShowAuthModal(false)}>
          <div className="modal-anim" style={authModal} onClick={e => e.stopPropagation()}>
            <button style={modalClose} onClick={() => setShowAuthModal(false)}>✕</button>

            {/* Logo inside modal */}
            <div style={modalLogo}>
              <div style={logoBox}><span style={logoBoxText}>Open</span></div>
              <span style={logoSuffix}>Market</span>
            </div>

            {/* Tabs */}
            <div style={authTabs}>
              <button
                style={authTab === 'login' ? authTabActive : authTabStyle}
                onClick={() => setAuthTab('login')}
              >Login</button>
              <button
                style={authTab === 'register' ? authTabActive : authTabStyle}
                onClick={() => setAuthTab('register')}
              >Register</button>
            </div>

            {authTab === 'login'
              ? <Login onLoginSuccess={handleLoginSuccess} />
              : <Signup onSignupSuccess={() => setAuthTab('login')} />
            }
          </div>
        </div>
      )}
    </div>
  );
}

/* ── STYLES ── */
const appWrapper  = { minHeight: '100vh', backgroundColor: '#f2f4f5', fontFamily: "'Segoe UI', Arial, sans-serif" };
const headerWrap  = {
  backgroundColor: '#fff',
  boxShadow: '0 2px 24px rgba(0,47,52,0.1)',
  position: 'sticky',
  top: 0,
  zIndex: 200,
};
const navInner    = { maxWidth: '1300px', margin: 'auto', padding: '0 20px', height: '64px', display: 'flex', alignItems: 'center', gap: '20px' };

const logoWrap    = { display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer', flexShrink: 0 };
const logoBox     = { backgroundColor: '#002f34', borderRadius: '6px', padding: '4px 8px' };
const logoBoxText = { color: '#ffce32', fontWeight: '900', fontSize: '18px', letterSpacing: '-0.5px' };
const logoSuffix  = { color: '#002f34', fontWeight: '900', fontSize: '18px' };

const searchForm     = { flex: 1, display: 'flex', border: '2px solid #002f34', borderRadius: '6px', overflow: 'hidden', maxWidth: '600px' };
const searchBarInput = { flex: 1, padding: '10px 16px', border: 'none', outline: 'none', fontSize: '15px', color: '#333' };
const searchBarBtn   = { backgroundColor: '#002f34', border: 'none', padding: '0 18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };

const navActions  = { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: 'auto', flexShrink: 0 };
const navIconBtn  = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '8px 12px', cursor: 'pointer', borderRadius: '8px' };
const navIconLabel= { fontSize: '11px', color: '#002f34', fontWeight: '600' };

const avatarBtn   = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px', padding: '8px 12px', cursor: 'pointer', position: 'relative', borderRadius: '8px' };
const avatarCircle= { position: 'relative', width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#002f34', color: '#ffce32', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '900', fontSize: '16px', transition: 'box-shadow 0.3s ease' };
const dotBadge    = { position: 'absolute', top: 0, right: 0, width: '9px', height: '9px', backgroundColor: '#e74c3c', borderRadius: '50%', border: '2px solid white' };

const loginNavBtn    = { padding: '8px 18px', backgroundColor: 'transparent', border: '1.5px solid #002f34', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', color: '#002f34' };
const registerNavBtn = { padding: '8px 18px', backgroundColor: '#002f34', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '700', fontSize: '14px', color: '#ffce32' };

const dropdown      = {
  position: 'absolute', top: '72px', right: 0, width: '270px',
  backgroundColor: '#fff',
  boxShadow: '0 12px 40px rgba(0,0,0,0.18)',
  borderRadius: '12px',
  zIndex: 1000, padding: '8px 0', overflow: 'hidden',
  border: '1px solid rgba(0,47,52,0.06)',
};
const dropdownHeader= { display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 20px' };
const dropdownAvatar= { width: '44px', height: '44px', borderRadius: '50%', backgroundColor: '#002f34', color: '#ffce32', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: '900', fontSize: '18px', flexShrink: 0 };
const dropdownName  = { fontWeight: '700', fontSize: '15px', color: '#002f34' };
const dropdownEmail = { fontSize: '12px', color: '#888' };
const ddDivider     = { border: 'none', borderTop: '1px solid #f0f0f0', margin: '4px 0' };
const ddItem        = { padding: '12px 20px', fontSize: '14px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px', color: '#333', fontWeight: '500' };
const badge         = { marginLeft: 'auto', backgroundColor: '#e74c3c', color: '#fff', borderRadius: '10px', padding: '2px 7px', fontSize: '11px', fontWeight: '700' };

const sellButton = {
  padding: '10px 22px',
  border: '2px solid #ffce32',
  borderRadius: '25px',
  background: 'none',
  cursor: 'pointer',
  fontWeight: '800',
  fontSize: '15px',
  color: '#002f34',
  whiteSpace: 'nowrap',
  letterSpacing: '0.5px',
};
const mainContent= { maxWidth: '1300px', margin: '0 auto', padding: '0 20px 40px' };

const notifDot = {
  position: 'absolute', top: '-4px', right: '-4px',
  minWidth: '16px', height: '16px',
  backgroundColor: '#e74c3c', borderRadius: '8px',
  fontSize: '10px', fontWeight: '800', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  border: '2px solid #fff', padding: '0 3px',
};

/* Auth Modal */
const modalOverlay = {
  position: 'fixed', inset: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  backdropFilter: 'blur(6px)',
  WebkitBackdropFilter: 'blur(6px)',
  zIndex: 1000,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  padding: '20px',
};
const authModal    = {
  backgroundColor: '#fff',
  borderRadius: '20px',
  width: '420px', maxWidth: '100%',
  padding: '36px',
  boxShadow: '0 24px 80px rgba(0,0,0,0.3)',
  position: 'relative',
};
const modalClose   = { position: 'absolute', top: '16px', right: '20px', background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#888', lineHeight: 1, transition: 'color 0.2s ease' };
const modalLogo    = { display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '24px' };
const authTabs     = { display: 'flex', marginBottom: '24px', borderBottom: '2px solid #f0f0f0' };
const authTabStyle = { flex: 1, padding: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px', color: '#888', fontWeight: '600', transition: 'color 0.2s ease' };
const authTabActive= { ...authTabStyle, color: '#002f34', borderBottom: '3px solid #002f34', marginBottom: '-2px' };

export default function App() {
  return (
    <LanguageProvider>
      <AppInner />
    </LanguageProvider>
  );
}
