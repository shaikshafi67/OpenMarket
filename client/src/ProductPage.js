import React, { useState } from 'react';

function ProductPage({ product, onBack, setView }) {
  const images = JSON.parse(product.image_url);
  const [mainImg,  setMainImg]  = useState(images[0]);
  const [isZoomed, setIsZoomed] = useState(false);
  const [imgKey,   setImgKey]   = useState(0); // trigger fade on thumb change

  const switchImage = (url) => {
    setMainImg(url);
    setImgKey(k => k + 1);
  };

  return (
    <div className="page-enter" style={pageContainer}>
      {/* ── BREADCRUMB ── */}
      <div style={topNav}>
        <span onClick={onBack} style={backLink}>Home</span>
        <span style={breadSep}> / </span>
        <span style={breadCat}>{product.category}</span>
      </div>

      <div style={mainGrid}>
        {/* ── LEFT COLUMN ── */}
        <div className="slide-left" style={leftColumn}>
          {/* Main image */}
          <div
            style={{
              ...imageWrapper,
              cursor: isZoomed ? 'zoom-out' : 'zoom-in',
            }}
            onMouseEnter={() => setIsZoomed(true)}
            onMouseLeave={() => setIsZoomed(false)}
          >
            <img
              key={imgKey}
              src={`http://localhost:5000${mainImg}`}
              style={{
                ...largeDisplayImg,
                transform: isZoomed ? 'scale(1.35)' : 'scale(1)',
                animation: 'imgFadeIn 0.35s ease',
              }}
              alt="Main product"
            />
          </div>

          {/* Thumbnails */}
          <div style={thumbTrack}>
            {images.map((url, i) => (
              <div
                key={i}
                className="thumb-img"
                onClick={() => switchImage(url)}
                style={url === mainImg ? activeThumbBox : thumbBox}
              >
                <img
                  src={`http://localhost:5000${url}`}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  alt={`thumb-${i}`}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="slide-right" style={rightColumn}>

          {/* Price & Title card */}
          <div style={cardBox}>
            <h1 className="price-anim" style={priceHeading}>
              ₹ {Number(product.price).toLocaleString('en-IN')}
            </h1>
            <h2 style={productTitle}>{product.title}</h2>
            <div style={metaRow}>
              <span style={metaChip}>📍 {product.location}</span>
              <span style={metaChip}>
                🗓 {new Date(product.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
              </span>
            </div>
            {product.category && (
              <div style={{ marginTop: '12px' }}>
                <span style={categoryPill}>{product.category}</span>
              </div>
            )}
          </div>

          {/* Description card */}
          <div style={cardBox}>
            <h3 style={sectionTitle}>Description</h3>
            <p style={descText}>{product.description}</p>
          </div>

          {/* Seller card */}
          <div style={cardBox}>
            <h3 style={sectionTitle}>Seller Information</h3>
            <div style={sellerRow}>
              <div style={sellerAvatar}>
                {product.seller_name ? product.seller_name.charAt(0).toUpperCase() : '?'}
              </div>
              <div style={sellerInfo}>
                <p style={sellerPostedBy}>
                  Posted by&nbsp;<strong style={sellerNameText}>{product.seller_name || 'Seller'}</strong>
                </p>
                {product.seller_since && (
                  <p style={sellerSub}>
                    Member since {new Date(product.seller_since).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
                  </p>
                )}
              </div>
            </div>
            <button
              className="chat-btn-premium"
              style={chatBtn}
              onClick={() => setView('chat')}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              Chat with Seller
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── STYLES ── */
const pageContainer  = { maxWidth: '1200px', margin: 'auto' };
const topNav         = { marginBottom: '24px', fontSize: '13px', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '4px' };
const backLink       = { color: '#002f34', cursor: 'pointer', textDecoration: 'none', transition: 'color 0.2s ease' };
const breadSep       = { color: '#ccc', margin: '0 4px' };
const breadCat       = { color: '#888' };

const mainGrid   = { display: 'flex', gap: '24px', flexWrap: 'wrap' };
const leftColumn = { flex: '1.5', minWidth: '350px' };

const imageWrapper = {
  width: '100%',
  height: '500px',
  backgroundColor: '#fff',
  borderRadius: '16px',
  overflow: 'hidden',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: '1px solid #eef0f2',
  boxShadow: '0 4px 20px rgba(0,47,52,0.08)',
  transition: 'box-shadow 0.3s ease',
};

const largeDisplayImg = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
  transition: 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
};

const thumbTrack = { display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' };

const thumbBox = {
  width: '80px', height: '80px',
  border: '2px solid #eef0f2',
  borderRadius: '8px',
  cursor: 'pointer',
  overflow: 'hidden',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease',
};
const activeThumbBox = {
  ...thumbBox,
  border: '2px solid #002f34',
  boxShadow: '0 0 0 3px rgba(0,47,52,0.15)',
};

const rightColumn = { flex: '1', minWidth: '320px', display: 'flex', flexDirection: 'column', gap: '16px' };

const cardBox = {
  padding: '24px',
  backgroundColor: '#fff',
  borderRadius: '16px',
  border: '1px solid #eef0f2',
  boxShadow: '0 2px 12px rgba(0,47,52,0.06)',
};

const priceHeading = {
  fontSize: '38px',
  fontWeight: '900',
  color: '#002f34',
  margin: '0 0 6px',
  letterSpacing: '-1px',
};
const productTitle = { fontSize: '18px', color: '#555', fontWeight: '500', margin: '0 0 16px' };

const metaRow   = { display: 'flex', gap: '12px', flexWrap: 'wrap' };
const metaChip  = {
  fontSize: '12px', color: '#666', fontWeight: '600',
  backgroundColor: '#f5f7f8', borderRadius: '20px',
  padding: '4px 12px',
};
const categoryPill = {
  backgroundColor: '#e8f0fe', color: '#3a7bd5',
  borderRadius: '20px', padding: '4px 14px',
  fontSize: '12px', fontWeight: '700',
};

const sectionTitle = { margin: '0 0 14px', fontSize: '17px', fontWeight: '800', color: '#002f34' };
const descText     = { lineHeight: '1.7', color: '#555', fontSize: '14px', margin: 0 };

const sellerRow    = { display: 'flex', alignItems: 'flex-start', gap: '16px', marginBottom: '20px' };
const sellerInfo   = { flex: 1 };
const sellerPostedBy = { margin: '0 0 4px', fontSize: '14px', color: '#555' };
const sellerNameText = { color: '#002f34', fontWeight: '800', fontSize: '15px' };
const sellerAvatar = {
  width: '52px', height: '52px', flexShrink: 0,
  backgroundColor: '#002f34',
  color: '#ffce32',
  borderRadius: '50%',
  display: 'flex', justifyContent: 'center', alignItems: 'center',
  fontSize: '20px', fontWeight: '900',
  boxShadow: '0 2px 8px rgba(0,47,52,0.18)',
};
const sellerSub = { margin: '2px 0 0', fontSize: '12px', color: '#aaa' };

const chatBtn = {
  width: '100%',
  padding: '16px',
  backgroundColor: '#002f34',
  color: '#fff',
  border: 'none',
  borderRadius: '10px',
  cursor: 'pointer',
  fontWeight: '800',
  fontSize: '16px',
  letterSpacing: '0.3px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
};

export default ProductPage;
