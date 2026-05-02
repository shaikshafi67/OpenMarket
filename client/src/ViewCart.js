import React from 'react';

function getFirstImage(imgData) {
  try { return JSON.parse(imgData)[0]; } catch { return imgData; }
}

export default function ViewCart({ items = [], onRemove, onProductClick = () => {} }) {
  return (
    <div style={container}>
      <div style={header}>
        <h2 style={title}>
          ❤️ My Wishlist
          {items.length > 0 && <span style={countBadge}>{items.length}</span>}
        </h2>
      </div>

      <div style={cartWrapper}>
        {items.length === 0 ? (
          <div style={emptyBox}>
            <div style={emptyIcon}>🛒</div>
            <h3 style={emptyTitle}>Your wishlist is empty</h3>
            <p style={emptyText}>Tap the ❤️ on any product to save it here.</p>
          </div>
        ) : (
          <div style={grid}>
            {items.map(item => (
              <div
                  key={item.id}
                  style={card}
                  onClick={() => onProductClick(item)}
                  onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,47,52,0.18)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
                  onMouseLeave={e => { e.currentTarget.style.boxShadow = '0 2px 10px rgba(0,47,52,0.09)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                >
                {/* Image */}
                <div style={imgWrap}>
                  <img
                    src={`${getFirstImage(item.image_url)}`}
                    alt={item.title}
                    style={img}
                  />
                  {item.is_featured && <div style={eliteBadge}>ELITE</div>}
                </div>

                {/* Info */}
                <div style={info}>
                  <p style={price}>₹ {Number(item.price).toLocaleString('en-IN')}</p>
                  <p style={itemTitle}>{item.title}</p>
                  <div style={meta}>
                    <span>📍 {item.location}</span>
                    <span style={catTag}>{item.category}</span>
                  </div>
                </div>

                {/* Remove button */}
                <button
                  style={removeBtn}
                  onClick={(e) => { e.stopPropagation(); onRemove && onRemove(item.id); }}
                  title="Remove from wishlist"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#e74c3c" stroke="#e74c3c" strokeWidth="1.5">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const container   = { padding: '24px 0 60px' };
const header      = { marginBottom: '20px' };
const title       = { fontSize: '22px', fontWeight: '800', color: '#002f34', margin: 0, display: 'flex', alignItems: 'center', gap: '10px' };
const countBadge  = { backgroundColor: '#e74c3c', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '14px', fontWeight: '700' };

const cartWrapper = { marginTop: '8px' };

const emptyBox   = { textAlign: 'center', padding: '80px 20px', border: '1px solid #eee', borderRadius: '16px', backgroundColor: '#fff' };
const emptyIcon  = { fontSize: '56px', marginBottom: '16px' };
const emptyTitle = { fontSize: '20px', fontWeight: '700', color: '#002f34', margin: '0 0 8px' };
const emptyText  = { color: '#999', fontSize: '15px', margin: 0 };

const grid = { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '16px' };

const card = {
  backgroundColor: '#fff',
  borderRadius: '12px',
  overflow: 'hidden',
  boxShadow: '0 2px 10px rgba(0,47,52,0.09)',
  position: 'relative',
  cursor: 'pointer',
  transition: 'box-shadow 0.25s ease, transform 0.25s ease',
};

const imgWrap   = { position: 'relative', width: '100%', paddingBottom: '100%', backgroundColor: '#f9f9f9' };
const img       = { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'contain' };
const eliteBadge= { position: 'absolute', top: '10px', left: 0, backgroundColor: '#002f34', color: '#ffce32', fontSize: '10px', fontWeight: '800', padding: '3px 10px', letterSpacing: '1.5px', borderRadius: '0 4px 4px 0' };

const info      = { padding: '12px 14px 14px' };
const price     = { fontSize: '18px', fontWeight: '800', color: '#002f34', margin: '0 0 4px' };
const itemTitle = { fontSize: '13px', color: '#555', margin: '0 0 8px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' };
const meta      = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '11px', color: '#999' };
const catTag    = { backgroundColor: '#e8f0fe', color: '#3a7bd5', borderRadius: '10px', padding: '1px 8px', fontWeight: '600', fontSize: '11px' };

const removeBtn = {
  position: 'absolute', top: '10px', right: '10px',
  width: '32px', height: '32px', borderRadius: '50%',
  backgroundColor: 'rgba(255,255,255,0.95)',
  border: 'none', cursor: 'pointer',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
};
