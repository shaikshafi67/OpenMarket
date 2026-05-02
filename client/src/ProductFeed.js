import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import CategoryGrid from './CategoryGrid';
import { useLang } from './LanguageContext';
import CATEGORY_ICONS from './CategoryIcons';

const QUICK_FILTERS = [
  'Cars', 'Motorcycles', 'Mobile Phones',
  'For Sale: Houses & Apartments', 'For Rent: Houses & Apartments',
  'Furniture', 'Electronics & Appliances', 'Services',
];

const ALL_CATEGORIES = [
  { name: 'Cars',                          keywords: ['car'] },
  { name: 'Bikes',                          keywords: ['bike', 'motorcycle', 'motorbike', 'scooter', 'bicycle'] },
  { name: 'Properties',                     keywords: ['house', 'apartment', 'land', 'plot', 'propert', 'pg', 'office', 'shop', 'rent', 'new project'] },
  { name: 'Electronics & Appliances',       keywords: ['electronic', 'appliance', 'tv', 'television', 'video', 'kitchen', 'fridge', 'washing', 'camera', 'hard disk', 'printer', 'monitor', 'computer', 'laptop', 'game', 'entertainment'] },
  { name: 'Mobiles',                        keywords: ['mobile', 'phone', 'tablet', 'accessory', 'accessories'] },
  { name: 'Commercial Vehicles & Spares',   keywords: ['commercial', 'spare', 'truck', 'bus', 'tractor', 'tempo'] },
  { name: 'Jobs',                           keywords: ['job', 'data entry', 'sales', 'bpo', 'driver', 'teacher', 'cook', 'designer', 'accountant', 'warehouse', 'security', 'office assistant', 'receptionist', 'operator', 'hotel', 'it engineer', 'delivery'] },
  { name: 'Furniture',                      keywords: ['furniture', 'sofa', 'bed', 'wardrobe', 'decor', 'garden', 'dining', 'household'] },
  { name: 'Fashion',                        keywords: ['fashion', 'men', 'women', 'kids', 'clothing'] },
  { name: 'Pets',                           keywords: ['pet', 'dog', 'cat', 'fish', 'aquarium', 'bird'] },
  { name: 'Books, Sports & Hobbies',        keywords: ['book', 'sport', 'hobby', 'music', 'gym', 'fitness', 'instrument'] },
  { name: 'Services',                       keywords: ['service', 'repair', 'beauty', 'renovation', 'pest', 'legal', 'packer', 'mover', 'education', 'travel', 'tour', 'health'] },
];

const VIEW_COLS = {
  small:  'repeat(auto-fill, minmax(160px, 1fr))',
  medium: 'repeat(auto-fill, minmax(220px, 1fr))',
  large:  'repeat(auto-fill, minmax(320px, 1fr))',
};

const IMG_HEIGHT = { small: '110%', medium: '100%', large: '90%' };

function ProductFeed({ onProductClick, searchQuery, wishlist = {}, onToggleWishlist }) {
  const { t, tCat } = useLang();
  const [products,  setProducts]  = useState([]);
  const [filter,    setFilter]    = useState(() => sessionStorage.getItem('om_filter') || 'All');
  const [viewMode,  setViewMode]  = useState(() => sessionStorage.getItem('om_viewMode') || 'medium');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const panelRef = useRef(null);

  const applyFilter = (f) => { setFilter(f); sessionStorage.setItem('om_filter', f); };
  const applyViewMode = (m) => { setViewMode(m); sessionStorage.setItem('om_viewMode', m); };

  useEffect(() => {
    axios.get('/api/products/approved')
      .then(res => setProducts(res.data))
      .catch(err => console.error('Error fetching products:', err));
  }, []);

  /* Close All-Categories panel on outside click */
  useEffect(() => {
    const handleOutside = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setShowAllCategories(false);
      }
    };
    if (showAllCategories) document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, [showAllCategories]);

  const getFirstImage = (imgData) => {
    try { return JSON.parse(imgData)[0]; }
    catch { return imgData; }
  };

  const toggleWishlist = (e, product) => {
    e.stopPropagation();
    if (onToggleWishlist) onToggleWishlist(product);
  };

  const today = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  let filtered = products;
  if (searchQuery) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.category && p.category.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q))
    );
  }
  if (filter !== 'All') filtered = filtered.filter(p => p.category === filter);

  return (
    <div style={container}>

      {/* ── FILTER BAR + ALL CATEGORIES PANEL ── */}
      <div style={filterBarWrap} ref={panelRef}>
        <div style={filterBar}>
          <div style={filterInner}>

            {/* ALL CATEGORIES toggle button */}
            <button
              className={`filter-btn-anim${showAllCategories || filter === 'All' ? ' active-filter' : ''}`}
              style={showAllCategories || filter === 'All' ? activeFilterBtn : filterBtn}
              onClick={() => setShowAllCategories(prev => !prev)}
            >
              {t('all_categories')}
            </button>

            {QUICK_FILTERS.map(cat => (
              <button
                key={cat}
                className={`filter-btn-anim${filter === cat ? ' active-filter' : ''}`}
                style={filter === cat ? activeFilterBtn : filterBtn}
                onClick={() => { applyFilter(cat); setShowAllCategories(false); }}
              >
                {cat}
              </button>
            ))}
            <span style={dateChip}>{today}</span>
          </div>
        </div>

        {/* ── ALL CATEGORIES MEGA PANEL ── */}
        {showAllCategories && (
          <AllCategoriesPanel
            products={products}
            getFirstImage={getFirstImage}
            onCategorySelect={(catName) => {
              applyFilter(catName);
              setShowAllCategories(false);
            }}
            onProductClick={(p) => {
              setShowAllCategories(false);
              onProductClick(p);
            }}
          />
        )}
      </div>

      <div style={pageBody}>
        {/* ── CATEGORY GRID ── */}
        {filter === 'All' && !searchQuery && <CategoryGrid onCategorySelect={applyFilter} />}

        {/* ── SECTION HEADING + VIEW TOGGLE ── */}
        <div style={sectionBar}>
          <h3 style={sectionTitle}>
            <span className="section-heading">
              {searchQuery ? `${t('results_for')} "${searchQuery}"` : filter === 'All' ? t('fresh_recommendations') : `${t('results_in')} ${tCat(filter)}`}
            </span>
            <span style={countLabel}>{filtered.length} {t('ads')}</span>
          </h3>

          {/* View mode buttons */}
          <div style={viewToggle}>
            <span style={viewLabel}>View:</span>

            <button style={viewMode === 'small' ? viewBtnActive : viewBtn} title="Small" onClick={() => applyViewMode('small')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="4" height="4" rx="0.5"/>
                <rect x="6" y="0" width="4" height="4" rx="0.5"/>
                <rect x="12" y="0" width="4" height="4" rx="0.5"/>
                <rect x="0" y="6" width="4" height="4" rx="0.5"/>
                <rect x="6" y="6" width="4" height="4" rx="0.5"/>
                <rect x="12" y="6" width="4" height="4" rx="0.5"/>
                <rect x="0" y="12" width="4" height="4" rx="0.5"/>
                <rect x="6" y="12" width="4" height="4" rx="0.5"/>
                <rect x="12" y="12" width="4" height="4" rx="0.5"/>
              </svg>
              <span style={viewBtnLabel}>Small</span>
            </button>

            <button style={viewMode === 'medium' ? viewBtnActive : viewBtn} title="Medium" onClick={() => applyViewMode('medium')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="7" height="7" rx="0.5"/>
                <rect x="9" y="0" width="7" height="7" rx="0.5"/>
                <rect x="0" y="9" width="7" height="7" rx="0.5"/>
                <rect x="9" y="9" width="7" height="7" rx="0.5"/>
              </svg>
              <span style={viewBtnLabel}>Medium</span>
            </button>

            <button style={viewMode === 'large' ? viewBtnActive : viewBtn} title="Large" onClick={() => applyViewMode('large')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="16" height="7" rx="0.5"/>
                <rect x="0" y="9" width="16" height="7" rx="0.5"/>
              </svg>
              <span style={viewBtnLabel}>Large</span>
            </button>

            <button style={viewMode === 'list' ? viewBtnActive : viewBtn} title="List" onClick={() => applyViewMode('list')}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <rect x="0" y="0" width="4" height="4" rx="0.5"/>
                <rect x="6" y="1" width="10" height="2" rx="0.5"/>
                <rect x="0" y="6" width="4" height="4" rx="0.5"/>
                <rect x="6" y="7" width="10" height="2" rx="0.5"/>
                <rect x="0" y="12" width="4" height="4" rx="0.5"/>
                <rect x="6" y="13" width="10" height="2" rx="0.5"/>
              </svg>
              <span style={viewBtnLabel}>List</span>
            </button>
          </div>
        </div>

        {/* ── PRODUCTS ── */}
        {filtered.length === 0 ? (
          <div className="empty-anim" style={emptyState}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🔍</div>
            <p style={{ color: '#888', fontSize: '16px' }}>{t('no_listings')}</p>
          </div>
        ) : viewMode === 'list' ? (
          /* ── LIST VIEW ── */
          <div style={listWrap}>
            {filtered.map(p => (
              <div
                key={p.id}
                className="list-card-anim"
                style={listCard}
                onClick={() => onProductClick(p)}
                onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,47,52,0.16)'; }}
                onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,47,52,0.08)'; }}
              >
                <div style={listImgWrap}>
                  <img src={`${getFirstImage(p.image_url)}`} style={listImg} alt={p.title} />
                  {p.is_featured && <div style={eliteBadge}>ELITE</div>}
                </div>
                <div style={listInfo}>
                  <p style={listTitle}>{p.title}</p>
                  <div style={listPrice}>₹ {Number(p.price).toLocaleString('en-IN')}</div>
                  {p.description && <p style={listDesc}>{p.description.slice(0, 120)}{p.description.length > 120 ? '…' : ''}</p>}
                  <div style={listMeta}>
                    <span>📍 {p.location}</span>
                    <span>{new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    <span style={catTag}>{p.category}</span>
                  </div>
                </div>
                <WishlistHeart product={p} wishlist={wishlist} toggleWishlist={toggleWishlist} size={18} />
              </div>
            ))}
          </div>
        ) : (
          /* ── GRID VIEW ── */
          <div style={{ ...grid, gridTemplateColumns: VIEW_COLS[viewMode] }}>
            {filtered.map(p => (
              <ProductCard
                key={p.id}
                p={p}
                viewMode={viewMode}
                getFirstImage={getFirstImage}
                onProductClick={onProductClick}
                wishlist={wishlist}
                toggleWishlist={toggleWishlist}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── ALL CATEGORIES PANEL ── */
function AllCategoriesPanel({ products, getFirstImage, onCategorySelect, onProductClick }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);
  const { t, tCat } = useLang();

  const getCatProducts = (cat) => {
    const kws = cat.keywords;
    return products.filter(p => {
      if (!p.category) return false;
      const c = p.category.toLowerCase();
      return kws.some(k => c.includes(k));
    });
  };

  return (
    <div style={panelWrap}>
      <div style={panelInner}>

        {/* Close hint */}
        <div style={panelTopBar}>
          <span style={panelTopTitle}>{t('browse_category')}</span>
          <span style={panelTopSub}>{products.length} {t('total_listings')}</span>
        </div>

        <div style={panelGrid}>
          {ALL_CATEGORIES.map(cat => {
            const catProducts = getCatProducts(cat);
            const shown       = catProducts.slice(0, 5);
            const remaining   = catProducts.length - 5;

            return (
              <div key={cat.name} style={panelSection}>

                {/* Category header — clicking goes to that category */}
                <div
                  style={panelCatHeader}
                  onClick={() => onCategorySelect(cat.name)}
                  onMouseEnter={e => { e.currentTarget.style.color = '#ffce32'; e.currentTarget.style.backgroundColor = '#002f34'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = '#002f34'; e.currentTarget.style.backgroundColor = 'transparent'; }}
                >
                  {(() => { const IC = CATEGORY_ICONS[cat.name]; return IC ? <IC size={20} /> : null; })()}
                  <span style={panelCatName}>{tCat(cat.name)}</span>
                </div>

                {/* Product list */}
                {shown.length === 0 ? (
                  <p style={panelEmpty}>No listings yet</p>
                ) : (
                  <div>
                    {shown.map(p => (
                      <div
                        key={p.id}
                        style={{
                          ...panelItem,
                          backgroundColor: hoveredProduct === p.id ? '#f7f9fa' : 'transparent',
                        }}
                        onClick={() => onProductClick(p)}
                        onMouseEnter={() => setHoveredProduct(p.id)}
                        onMouseLeave={() => setHoveredProduct(null)}
                      >
                        <div style={panelThumb}>
                          <img
                            src={`${getFirstImage(p.image_url)}`}
                            style={panelThumbImg}
                            alt=""
                          />
                        </div>
                        <div style={panelItemInfo}>
                          <p style={panelItemTitle}>{p.title}</p>
                          <p style={panelItemPrice}>₹ {Number(p.price).toLocaleString('en-IN')}</p>
                        </div>
                      </div>
                    ))}

                    {/* See More */}
                    {remaining > 0 && (
                      <button
                        style={panelSeeMore}
                        onClick={() => onCategorySelect(cat.name)}
                        onMouseEnter={e => { e.currentTarget.style.color = '#002f34'; }}
                        onMouseLeave={e => { e.currentTarget.style.color = '#3a7bd5'; }}
                      >
                        {t('see_more')} ({remaining}) →
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── WISHLIST HEART COMPONENT ── */
function WishlistHeart({ product, wishlist, toggleWishlist, size = 16 }) {
  const [animate, setAnimate] = useState(false);
  const id = product?.id;
  const handleClick = (e) => {
    toggleWishlist(e, product);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 600);
  };
  return (
    <button
      className={`heart-btn-anim${animate ? ' heart-beat' : ''}`}
      style={heartBtn}
      onClick={handleClick}
      title="Add to wishlist"
    >
      {wishlist[id]
        ? <svg width={size} height={size} viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="1.5"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
        : <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
      }
    </button>
  );
}

/* ── PRODUCT CARD COMPONENT ── */
function ProductCard({ p, viewMode, getFirstImage, onProductClick, wishlist, toggleWishlist }) {
  const [loaded,  setLoaded]  = useState(false);
  const [hovered, setHovered] = useState(false);

  const imgH = IMG_HEIGHT[viewMode];

  return (
    <div
      className="product-card"
      style={{
        ...card,
        boxShadow: hovered ? '0 12px 32px rgba(0,47,52,0.18)' : '0 2px 8px rgba(0,47,52,0.08)',
        transform: hovered ? 'translateY(-6px) scale(1.01)' : 'translateY(0) scale(1)',
      }}
      onClick={() => onProductClick(p)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        className="img-wrap"
        style={{ position: 'relative', width: '100%', paddingBottom: imgH, backgroundColor: '#f5f5f5', overflow: 'hidden' }}
      >
        {!loaded && <div className="img-skeleton" style={{ position: 'absolute', inset: 0 }} />}
        <img
          className={`card-img${loaded ? ' img-loaded' : ''}`}
          src={`${getFirstImage(p.image_url)}`}
          alt={p.title}
          onLoad={() => setLoaded(true)}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain', backgroundColor: '#fff', opacity: loaded ? 1 : 0 }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to top, rgba(0,47,52,0.18) 0%, transparent 50%)',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s ease', pointerEvents: 'none',
        }} />
        <WishlistHeart product={p} wishlist={wishlist} toggleWishlist={toggleWishlist} size={16} />
        {p.is_featured && <div style={eliteBadge}>ELITE</div>}
      </div>

      <div style={cardBody}>
        <span style={{
          ...priceText,
          background: hovered ? 'linear-gradient(135deg, #002f34, #004a52)' : 'none',
          WebkitBackgroundClip: hovered ? 'text' : 'unset',
          WebkitTextFillColor: hovered ? 'transparent' : '#002f34',
          transition: 'all 0.3s ease',
        }}>
          ₹ {Number(p.price).toLocaleString('en-IN')}
        </span>
        <p style={{ ...titleText, fontSize: viewMode === 'small' ? '12px' : '14px' }}>{p.title}</p>
        <div style={metaRow}>
          <span style={metaText}>📍 {p.location}</span>
          <span style={metaText}>{new Date(p.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
        </div>
      </div>
    </div>
  );
}

/* ── STYLES ── */
const container   = { paddingBottom: '60px' };

/* Filter bar wrapper — relative so the panel positions below it */
const filterBarWrap = {
  position: 'relative',
  margin: '0 -20px',
  zIndex: 100,
};
const filterBar   = { backgroundColor: '#fff', borderBottom: '1px solid #eef0f2', padding: '0 20px' };
const filterInner = { maxWidth: '1260px', margin: 'auto', display: 'flex', gap: '4px', alignItems: 'center', overflowX: 'auto', padding: '6px 0', scrollbarWidth: 'none' };
const filterBtn   = { background: 'none', border: 'none', cursor: 'pointer', padding: '8px 14px', fontSize: '13px', fontWeight: '600', color: '#444', whiteSpace: 'nowrap', borderRadius: '6px' };
const activeFilterBtn = { ...filterBtn, backgroundColor: '#002f34', color: '#fff' };
const dateChip    = { marginLeft: 'auto', fontSize: '13px', color: '#888', whiteSpace: 'nowrap', paddingLeft: '16px' };

/* All Categories Panel */
const panelWrap  = {
  position: 'absolute',
  top: '100%',
  left: 0,
  right: 0,
  backgroundColor: '#fff',
  boxShadow: '0 12px 40px rgba(0,47,52,0.18)',
  borderTop: '2px solid #002f34',
  borderBottom: '1px solid #eef0f2',
  zIndex: 500,
  maxHeight: '78vh',
  overflowY: 'auto',
};
const panelInner  = { maxWidth: '1260px', margin: '0 auto', padding: '20px 20px 28px' };
const panelTopBar = { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', paddingBottom: '12px', borderBottom: '1px solid #f0f0f0' };
const panelTopTitle = { fontWeight: '800', fontSize: '15px', color: '#002f34' };
const panelTopSub   = { fontSize: '12px', color: '#999', marginLeft: 'auto' };

const panelGrid  = {
  display: 'grid',
  gridTemplateColumns: 'repeat(4, 1fr)',
  gap: '0',
};
const panelSection = {
  padding: '14px 16px 18px',
  borderRight: '1px solid #f2f2f2',
  borderBottom: '1px solid #f2f2f2',
};
const panelCatHeader = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  marginBottom: '10px',
  cursor: 'pointer',
  padding: '6px 8px',
  borderRadius: '8px',
  transition: 'all 0.2s ease',
  color: '#002f34',
  backgroundColor: 'transparent',
};
const panelCatName  = { fontWeight: '800', fontSize: '13px', letterSpacing: '0.2px' };

const panelItem = {
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  padding: '5px 6px',
  borderRadius: '6px',
  cursor: 'pointer',
  transition: 'background-color 0.15s ease',
  marginBottom: '2px',
};
const panelThumb    = { width: '38px', height: '38px', borderRadius: '6px', overflow: 'hidden', flexShrink: 0, backgroundColor: '#f5f5f5', border: '1px solid #eee' };
const panelThumbImg = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
const panelItemInfo = { flex: 1, minWidth: 0 };
const panelItemTitle = { margin: 0, fontSize: '12px', color: '#444', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', lineHeight: 1.3 };
const panelItemPrice = { margin: '2px 0 0', fontSize: '12px', fontWeight: '800', color: '#002f34' };

const panelEmpty  = { fontSize: '11px', color: '#ccc', fontStyle: 'italic', margin: '4px 8px', lineHeight: 1.4 };
const panelSeeMore = {
  background: 'none', border: 'none', cursor: 'pointer',
  color: '#3a7bd5', fontSize: '12px', fontWeight: '700',
  padding: '4px 6px', marginTop: '4px',
  transition: 'color 0.15s ease', display: 'block',
};

const pageBody   = { paddingTop: '24px' };

const sectionBar   = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '28px 0 16px', flexWrap: 'wrap', gap: '12px' };
const sectionTitle = { fontSize: '22px', fontWeight: '700', color: '#002f34', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' };
const countLabel   = { fontSize: '14px', color: '#999', fontWeight: '400' };

const viewToggle   = { display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '4px 8px', boxShadow: '0 1px 4px rgba(0,47,52,0.06)' };
const viewLabel    = { fontSize: '12px', color: '#888', fontWeight: '600', marginRight: '4px' };
const viewBtn      = { display: 'flex', alignItems: 'center', gap: '5px', padding: '6px 10px', border: 'none', background: 'none', cursor: 'pointer', borderRadius: '6px', color: '#888', fontSize: '12px', fontWeight: '600', transition: 'all 0.2s ease' };
const viewBtnActive = { ...viewBtn, backgroundColor: '#002f34', color: '#fff' };
const viewBtnLabel  = { fontSize: '12px' };

const grid = { display: 'grid', gap: '16px' };
const card = {
  backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden',
  cursor: 'pointer', transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1), box-shadow 0.3s cubic-bezier(0.4,0,0.2,1)',
};
const heartBtn = {
  position: 'absolute', bottom: '10px', right: '10px',
  width: '34px', height: '34px', borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.95)', border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)', zIndex: 2,
};
const eliteBadge = {
  position: 'absolute', top: '10px', left: '0',
  backgroundColor: '#002f34', color: '#ffce32',
  fontSize: '10px', fontWeight: '800',
  padding: '3px 10px', letterSpacing: '1.5px',
  borderRadius: '0 4px 4px 0',
};
const cardBody  = { padding: '12px 14px 14px' };
const priceText = { fontSize: '18px', fontWeight: '800', color: '#002f34', display: 'block', marginBottom: '4px' };
const titleText = { margin: '0 0 10px', color: '#555', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const metaRow   = { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#999', textTransform: 'uppercase', fontWeight: '600' };
const metaText  = {};

/* List view */
const listWrap    = { display: 'flex', flexDirection: 'column', gap: '12px' };
const listCard    = {
  backgroundColor: '#fff', borderRadius: '12px', overflow: 'hidden',
  cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,47,52,0.08)',
  transition: 'box-shadow 0.28s ease', display: 'flex', alignItems: 'stretch', position: 'relative',
};
const listImgWrap = { width: '200px', minHeight: '160px', flexShrink: 0, position: 'relative', backgroundColor: '#fff' };
const listImg     = { width: '100%', height: '100%', objectFit: 'contain', display: 'block', position: 'absolute', inset: 0 };
const listInfo    = { flex: 1, padding: '16px 20px', display: 'flex', flexDirection: 'column', justifyContent: 'center' };
const listTitle   = { margin: '0 0 6px', fontSize: '16px', fontWeight: '700', color: '#002f34' };
const listPrice   = { fontSize: '20px', fontWeight: '900', color: '#002f34', marginBottom: '8px' };
const listDesc    = { margin: '0 0 10px', fontSize: '13px', color: '#777', lineHeight: 1.5 };
const listMeta    = { display: 'flex', gap: '16px', fontSize: '12px', color: '#999', flexWrap: 'wrap' };
const catTag      = { backgroundColor: '#e8f0fe', color: '#3a7bd5', borderRadius: '10px', padding: '1px 8px', fontWeight: '600' };

const emptyState  = { textAlign: 'center', padding: '80px 20px' };

export default ProductFeed;
