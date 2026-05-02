import React, { useState, useRef } from 'react';
import axios from 'axios';

const CATEGORIES = [
  'Cars', 'Bikes', 'Properties', 'Electronics & Appliances',
  'Mobiles', 'Commercial Vehicles & Spares', 'Jobs',
  'Furniture', 'Fashion', 'Pets', 'Books, Sports & Hobbies', 'Services',
];

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry',
];

function SellerDashboard({ user, setView }) {
  const [step, setStep] = useState('category'); // 'category' | 'form'
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [state, setState] = useState('');
  const [locationTab, setLocationTab] = useState('list');
  const [images, setImages] = useState(Array(12).fill(null));
  const [previews, setPreviews] = useState(Array(12).fill(null));
  const [photoError, setPhotoError] = useState(false);
  const [stateError, setStateError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const fileRefs = useRef([]);

  const handleSlotClick = (idx) => {
    if (!fileRefs.current[idx]) fileRefs.current[idx] = React.createRef();
    fileRefs.current[idx].current?.click();
  };

  const handleFileChange = (e, idx) => {
    const file = e.target.files[0];
    if (!file) return;
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[idx] = file;
    newPreviews[idx] = URL.createObjectURL(file);
    setImages(newImages);
    setPreviews(newPreviews);
    setPhotoError(false);
  };

  const removeImage = (e, idx) => {
    e.stopPropagation();
    const newImages = [...images];
    const newPreviews = [...previews];
    newImages[idx] = null;
    newPreviews[idx] = null;
    setImages(newImages);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const hasPhoto = images.some(img => img !== null);
    if (!hasPhoto) { setPhotoError(true); return; }
    if (!state) { setStateError(true); return; }
    if (!user?.id) { alert('Session expired. Please login again.'); return; }

    setSubmitting(true);
    const formData = new FormData();
    formData.append('seller_id', user.id);
    formData.append('title', title);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('location', state);
    formData.append('category', category);
    images.filter(Boolean).forEach(img => formData.append('images', img));

    try {
      await axios.post('/api/products/add', formData);
      setView('market');
      alert('Ad posted! Waiting for admin approval.');
    } catch (err) {
      console.error('Post error:', err.response?.data || err.message);
      alert('Error posting ad. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── STEP 1: Category selection ──────────────────────────────────
  if (step === 'category') {
    return (
      <div style={pageWrap}>
        <h2 style={pageTitle}>POST YOUR AD</h2>
        <div style={card}>
          <div style={sectionHead}>CHOOSE A CATEGORY</div>
          <div style={catGrid}>
            {CATEGORIES.map(cat => (
              <div
                key={cat}
                style={catOption}
                onClick={() => { setCategory(cat); setStep('form'); }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f0f7f7'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#fff'}
              >
                <span style={catOptionText}>{cat}</span>
                <span style={chevron}>›</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── STEP 2: Post Ad form ────────────────────────────────────────
  return (
    <div style={pageWrap}>
      <h2 style={pageTitle}>POST YOUR AD</h2>
      <form onSubmit={handleSubmit}>

        {/* SELECTED CATEGORY */}
        <div style={card}>
          <div style={sectionHead}>SELECTED CATEGORY</div>
          <div style={catRow}>
            <span style={catPath}>{category}</span>
            <span style={changeBtn} onClick={() => setStep('category')}>Change</span>
          </div>
        </div>

        {/* INCLUDE SOME DETAILS */}
        <div style={card}>
          <div style={sectionHead}>INCLUDE SOME DETAILS</div>

          <div style={fieldWrap}>
            <label style={fieldLabel}>Ad title <span style={req}>*</span></label>
            <input
              style={textInput}
              value={title}
              maxLength={70}
              required
              onChange={e => setTitle(e.target.value)}
              placeholder="Mention the key features of your item (e.g. brand, model, age, type)"
            />
            <div style={charHint}>Mention the key features of your item (e.g. brand, model, age, type) &nbsp;<span style={charCount}>{title.length} / 70</span></div>
          </div>

          <div style={fieldWrap}>
            <label style={fieldLabel}>Description <span style={req}>*</span></label>
            <textarea
              style={textArea}
              value={description}
              maxLength={4096}
              required
              onChange={e => setDescription(e.target.value)}
              placeholder="Include condition, features and reason for selling"
            />
            <div style={charHint}>Include condition, features and reason for selling &nbsp;<span style={charCount}>{description.length} / 4096</span></div>
          </div>
        </div>

        {/* SET A PRICE */}
        <div style={card}>
          <div style={sectionHead}>SET A PRICE</div>
          <div style={fieldWrap}>
            <label style={fieldLabel}>Price <span style={req}>*</span></label>
            <div style={priceWrap}>
              <span style={rupeeSign}>₹</span>
              <input
                style={priceInput}
                type="number"
                value={price}
                required
                min="0"
                onChange={e => setPrice(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* UPLOAD PHOTOS */}
        <div style={card}>
          <div style={sectionHead}>UPLOAD UP TO 12 PHOTOS</div>
          <div style={photoGrid}>
            {Array(12).fill(null).map((_, idx) => {
              if (!fileRefs.current[idx]) fileRefs.current[idx] = React.createRef();
              const isFirst = idx === 0;
              const hasImg = previews[idx];
              return (
                <div
                  key={idx}
                  style={{ ...photoSlot, ...(isFirst && !hasImg ? photoSlotFirst : {}) }}
                  onClick={() => handleSlotClick(idx)}
                >
                  {hasImg ? (
                    <>
                      <img src={hasImg} alt="" style={slotImg} />
                      <button
                        type="button"
                        style={removeBtn}
                        onClick={e => removeImage(e, idx)}
                      >×</button>
                    </>
                  ) : (
                    <div style={slotEmpty}>
                      <CameraIcon />
                      {isFirst && <span style={addPhotoLabel}>Add Photo</span>}
                    </div>
                  )}
                  <input
                    ref={fileRefs.current[idx]}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => handleFileChange(e, idx)}
                  />
                </div>
              );
            })}
          </div>
          {photoError && <p style={errorText}>This field is mandatory</p>}
        </div>

        {/* CONFIRM LOCATION */}
        <div style={card}>
          <div style={sectionHead}>CONFIRM YOUR LOCATION</div>
          <div style={tabRow}>
            <button
              type="button"
              style={locationTab === 'list' ? tabActive : tabBtn}
              onClick={() => setLocationTab('list')}
            >LIST</button>
            <button
              type="button"
              style={locationTab === 'current' ? tabActive : tabBtn}
              onClick={() => setLocationTab('current')}
            >CURRENT LOCATION</button>
          </div>

          {locationTab === 'list' ? (
            <div style={fieldWrap}>
              <label style={fieldLabel}>State <span style={req}>*</span></label>
              <select
                style={selectInput}
                value={state}
                onChange={e => { setState(e.target.value); setStateError(false); }}
              >
                <option value="">— Select State —</option>
                {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {stateError && <p style={errorText}>This field is mandatory</p>}
            </div>
          ) : (
            <div style={geoWrap}>
              <button
                type="button"
                style={geoBtn}
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      () => setState('Current Location'),
                      () => alert('Unable to get location. Please allow location access.')
                    );
                  }
                }}
              >
                📍 Use Current Location
              </button>
              {state === 'Current Location' && <span style={geoSuccess}>✅ Location detected</span>}
            </div>
          )}
        </div>

        {/* REVIEW YOUR DETAILS */}
        <div style={card}>
          <div style={sectionHead}>REVIEW YOUR DETAILS</div>
          <div style={reviewRow}>
            <div style={reviewAvatar}>{user?.name?.charAt(0)?.toUpperCase()}</div>
            <div style={reviewInfo}>
              <label style={fieldLabel}>Name</label>
              <div style={reviewName}>{user?.name}</div>
              <div style={charCount}>{(user?.name || '').length} / 30</div>
            </div>
          </div>
        </div>

        {/* SUBMIT */}
        <div style={footerBar}>
          <button type="submit" style={postBtn} disabled={submitting}>
            {submitting ? 'Posting...' : 'Post now'}
          </button>
        </div>
      </form>
    </div>
  );
}

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

// ── STYLES ──────────────────────────────────────────────────────────
const pageWrap   = { maxWidth: '660px', margin: '30px auto 60px', padding: '0 16px', fontFamily: "'Segoe UI', Arial, sans-serif" };
const pageTitle  = { textAlign: 'center', fontWeight: '900', fontSize: '20px', letterSpacing: '1px', color: '#002f34', marginBottom: '20px' };

const card       = { backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '4px', marginBottom: '12px', overflow: 'hidden' };
const sectionHead= { backgroundColor: '#fff', borderBottom: '1px solid #e8e8e8', padding: '14px 20px', fontSize: '13px', fontWeight: '800', letterSpacing: '0.5px', color: '#002f34' };

const catGrid    = { display: 'flex', flexDirection: 'column' };
const catOption  = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #f5f5f5', transition: 'background 0.15s', backgroundColor: '#fff' };
const catOptionText = { fontSize: '15px', color: '#333' };
const chevron    = { fontSize: '20px', color: '#aaa' };

const catRow     = { padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '10px' };
const catPath    = { fontSize: '14px', color: '#555' };
const changeBtn  = { fontSize: '14px', color: '#3a7bd5', cursor: 'pointer', fontWeight: '600' };

const fieldWrap  = { padding: '16px 20px' };
const fieldLabel = { display: 'block', fontSize: '13px', fontWeight: '700', color: '#002f34', marginBottom: '8px' };
const req        = { color: '#e74c3c' };
const textInput  = { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '15px', outline: 'none', boxSizing: 'border-box' };
const textArea   = { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '15px', outline: 'none', boxSizing: 'border-box', height: '120px', resize: 'vertical', fontFamily: 'inherit' };
const charHint   = { marginTop: '6px', fontSize: '11px', color: '#aaa', display: 'flex', justifyContent: 'space-between' };
const charCount  = { color: '#aaa', fontSize: '11px' };

const priceWrap  = { display: 'flex', alignItems: 'center', border: '1px solid #ccc', borderRadius: '4px', overflow: 'hidden', width: '100%' };
const rupeeSign  = { padding: '10px 12px', backgroundColor: '#f5f5f5', borderRight: '1px solid #ccc', fontSize: '15px', color: '#555' };
const priceInput = { flex: 1, padding: '10px 12px', border: 'none', outline: 'none', fontSize: '15px' };

const photoGrid  = { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', padding: '16px 20px' };
const photoSlot  = { position: 'relative', aspectRatio: '1', border: '1px dashed #ccc', borderRadius: '4px', cursor: 'pointer', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#fafafa' };
const photoSlotFirst = { border: '2px dashed #002f34', backgroundColor: '#f0f7f7' };
const slotEmpty  = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' };
const addPhotoLabel = { fontSize: '11px', fontWeight: '700', color: '#002f34' };
const slotImg    = { width: '100%', height: '100%', objectFit: 'cover', display: 'block' };
const removeBtn  = { position: 'absolute', top: '4px', right: '4px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: 'rgba(0,0,0,0.55)', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '14px', lineHeight: '18px', textAlign: 'center', padding: 0 };
const errorText  = { color: '#e74c3c', fontSize: '12px', margin: '4px 20px 12px' };

const tabRow     = { display: 'flex', borderBottom: '2px solid #e0e0e0', margin: '0 20px' };
const tabBtn     = { flex: 1, padding: '12px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '700', color: '#888', letterSpacing: '0.5px' };
const tabActive  = { ...tabBtn, color: '#002f34', borderBottom: '3px solid #002f34', marginBottom: '-2px' };
const selectInput= { width: '100%', padding: '10px 12px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '15px', outline: 'none', backgroundColor: '#fff', cursor: 'pointer' };
const geoWrap    = { padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '16px' };
const geoBtn     = { padding: '10px 20px', border: '1px solid #002f34', borderRadius: '4px', background: 'none', cursor: 'pointer', fontWeight: '700', color: '#002f34', fontSize: '14px' };
const geoSuccess = { color: '#27ae60', fontSize: '14px' };

const reviewRow  = { padding: '16px 20px', display: 'flex', gap: '16px', alignItems: 'flex-start' };
const reviewAvatar = { width: '56px', height: '56px', borderRadius: '50%', backgroundColor: '#002f34', color: '#ffce32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', fontWeight: '900', flexShrink: 0 };
const reviewInfo = { flex: 1 };
const reviewName = { fontSize: '15px', fontWeight: '700', color: '#002f34', marginBottom: '2px' };

const footerBar  = { padding: '16px 0' };
const postBtn    = { width: '100%', padding: '14px', backgroundColor: '#002f34', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '16px', fontWeight: '800', cursor: 'pointer', letterSpacing: '0.5px' };

export default SellerDashboard;
