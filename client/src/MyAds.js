import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

function MyAds({ user }) {
    const [myProducts, setMyProducts] = useState([]);
    const [editingAd, setEditingAd]   = useState(null);
    const [editForm, setEditForm]     = useState({});
    const [keptImages, setKeptImages] = useState([]); // existing image paths to keep
    const [newFiles, setNewFiles]     = useState([]);  // new File objects
    const [newPreviews, setNewPreviews] = useState([]); // object URLs for new files
    const [saving, setSaving]         = useState(false);
    const [toast, setToast]           = useState('');
    const fileInputRef = useRef(null);

    const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 4000); };

    const fetchAds = () => {
        axios.get(`/api/products/user/${user.id}`)
            .then(res => setMyProducts(res.data))
            .catch(err => console.log(err));
    };

    useEffect(() => { fetchAds(); }, [user.id]);

    const deleteAd = (id) => {
        if (!window.confirm('Remove this ad permanently?')) return;
        axios.delete(`/api/products/delete/${id}`)
            .then(() => { setMyProducts(p => p.filter(x => x.id !== id)); showToast('Ad removed.'); })
            .catch(() => showToast('Failed to remove ad.'));
    };

    const openEdit = (p) => {
        let images = [];
        try { images = JSON.parse(p.image_url) || []; } catch { images = p.image_url ? [p.image_url] : []; }
        setEditingAd(p);
        setEditForm({ title: p.title, description: p.description || '', price: p.price, location: p.location, category: p.category });
        setKeptImages(images);
        setNewFiles([]);
        setNewPreviews([]);
    };

    const closeEdit = () => {
        newPreviews.forEach(url => URL.revokeObjectURL(url));
        setEditingAd(null);
        setNewFiles([]);
        setNewPreviews([]);
    };

    const removeKeptImage = (idx) => {
        setKeptImages(prev => prev.filter((_, i) => i !== idx));
    };

    const removeNewFile = (idx) => {
        URL.revokeObjectURL(newPreviews[idx]);
        setNewFiles(prev => prev.filter((_, i) => i !== idx));
        setNewPreviews(prev => prev.filter((_, i) => i !== idx));
    };

    const handleNewImages = (e) => {
        const files = Array.from(e.target.files);
        const previews = files.map(f => URL.createObjectURL(f));
        setNewFiles(prev => [...prev, ...files]);
        setNewPreviews(prev => [...prev, ...previews]);
        e.target.value = '';
    };

    const saveEdit = () => {
        if (!editForm.title.trim() || !editForm.price) return;
        if (keptImages.length + newFiles.length === 0) {
            showToast('Please keep or add at least one image.');
            return;
        }
        setSaving(true);

        const fd = new FormData();
        fd.append('title',       editForm.title);
        fd.append('description', editForm.description);
        fd.append('price',       editForm.price);
        fd.append('location',    editForm.location);
        fd.append('category',    editForm.category);
        fd.append('keepImages',  JSON.stringify(keptImages));
        newFiles.forEach(f => fd.append('newImages', f, f.name));

        axios.put(`/api/products/update/${editingAd.id}`, fd)
        .then(res => {
            if (res.data && res.data.success) {
                setMyProducts(prev => prev.map(p =>
                    p.id === editingAd.id
                        ? { ...p, ...editForm, is_approved: 0, image_url: JSON.stringify(keptImages) }
                        : p
                ));
                closeEdit();
                showToast('✅ Changes saved! Waiting for admin approval before going live.');
                setTimeout(fetchAds, 500);
            }
        }).catch(err => {
            console.error('Save error:', err?.response?.data || err.message);
            showToast('Failed: ' + (err?.response?.data?.error || err.message || 'Server error'));
        }).finally(() => setSaving(false));
    };

    const getThumb = (image_url) => {
        try { return JSON.parse(image_url)[0]; } catch { return image_url; }
    };

    return (
        <div style={container}>
            <h2 style={pageTitle}>Manage Your Ads</h2>

            {myProducts.length === 0 ? (
                <div style={emptyState}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>📦</div>
                    <p style={{ color: '#888', fontSize: '16px' }}>You haven't posted any ads yet.</p>
                </div>
            ) : (
                <div style={adList}>
                    {myProducts.map(p => (
                        <div key={p.id} style={adCard}>
                            <img src={`${getThumb(p.image_url)}`} alt="ad" style={thumb} />
                            <div style={adInfo}>
                                <div style={adTitle}>{p.title}</div>
                                <div style={adPrice}>₹ {Number(p.price).toLocaleString('en-IN')}</div>
                                <div style={adMeta}>
                                    <span>📍 {p.location}</span>
                                    <span style={catPill}>{p.category}</span>
                                </div>
                                <span style={p.is_approved ? liveTag : pendingTag}>
                                    {p.is_approved ? '● LIVE' : '● PENDING APPROVAL'}
                                </span>
                            </div>
                            <div style={actionCol}>
                                <button style={editBtn} onClick={() => openEdit(p)}>✏️ Edit Ad</button>
                                <button style={deleteBtn} onClick={() => deleteAd(p.id)}>🗑 Remove</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* ── EDIT MODAL ── */}
            {editingAd && (
                <div style={overlay} onClick={closeEdit}>
                    <div style={modal} onClick={e => e.stopPropagation()}>
                        <div style={modalHeader}>
                            <span style={modalTitle}>Edit Ad</span>
                            <button style={closeBtn} onClick={closeEdit}>✕</button>
                        </div>

                        {/* ── IMAGES SECTION ── */}
                        <div style={fieldGroup}>
                            <label style={fieldLabel}>Photos</label>
                            <div style={imgGrid}>
                                {/* Existing images */}
                                {keptImages.map((url, i) => (
                                    <div key={`kept-${i}`} style={imgSlot}>
                                        <img src={`${url}`} alt="" style={slotImg} />
                                        <button style={removeImgBtn} onClick={() => removeKeptImage(i)} title="Remove">✕</button>
                                    </div>
                                ))}
                                {/* New image previews */}
                                {newPreviews.map((url, i) => (
                                    <div key={`new-${i}`} style={imgSlot}>
                                        <img src={url} alt="" style={slotImg} />
                                        <button style={removeImgBtn} onClick={() => removeNewFile(i)} title="Remove">✕</button>
                                        <div style={newBadge}>NEW</div>
                                    </div>
                                ))}
                                {/* Add button */}
                                {keptImages.length + newFiles.length < 12 && (
                                    <div style={addImgSlot} onClick={() => fileInputRef.current?.click()}>
                                        <span style={{ fontSize: '26px', color: '#aaa' }}>+</span>
                                        <span style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>Add Photo</span>
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                multiple
                                style={{ display: 'none' }}
                                onChange={handleNewImages}
                            />
                        </div>

                        {/* ── TEXT FIELDS ── */}
                        <div style={fieldGroup}>
                            <label style={fieldLabel}>Title</label>
                            <input style={fieldInput} value={editForm.title}
                                onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                        </div>
                        <div style={{ display: 'flex', gap: '14px' }}>
                            <div style={{ ...fieldGroup, flex: 1 }}>
                                <label style={fieldLabel}>Price (₹)</label>
                                <input style={fieldInput} type="number" value={editForm.price}
                                    onChange={e => setEditForm(f => ({ ...f, price: e.target.value }))} />
                            </div>
                            <div style={{ ...fieldGroup, flex: 1 }}>
                                <label style={fieldLabel}>Category</label>
                                <input style={fieldInput} value={editForm.category}
                                    onChange={e => setEditForm(f => ({ ...f, category: e.target.value }))} />
                            </div>
                        </div>
                        <div style={fieldGroup}>
                            <label style={fieldLabel}>Location</label>
                            <input style={fieldInput} value={editForm.location}
                                onChange={e => setEditForm(f => ({ ...f, location: e.target.value }))} />
                        </div>
                        <div style={fieldGroup}>
                            <label style={fieldLabel}>Description</label>
                            <textarea style={{ ...fieldInput, resize: 'vertical', minHeight: '80px' }}
                                value={editForm.description}
                                onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                        </div>

                        <div style={approvalNote}>
                            🔔 After saving, your ad will be sent to <strong>Admin for approval</strong>. It will go live once approved.
                        </div>

                        <div style={modalActions}>
                            <button style={cancelModalBtn} onClick={closeEdit}>Cancel</button>
                            <button
                                style={{ ...saveModalBtn, opacity: saving ? 0.7 : 1 }}
                                onClick={saveEdit}
                                disabled={saving}
                            >
                                {saving ? 'Saving…' : '✅ Save & Submit for Approval'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {toast && <div style={toastStyle}>{toast}</div>}
        </div>
    );
}

/* ── STYLES ── */
const container = { maxWidth: '860px', margin: 'auto', padding: '28px 20px' };
const pageTitle = { fontSize: '22px', fontWeight: '800', color: '#002f34', marginBottom: '22px' };

const adList = { display: 'flex', flexDirection: 'column', gap: '14px' };
const adCard = { display: 'flex', alignItems: 'center', gap: '18px', padding: '18px 20px', border: '1px solid #e0e0e0', borderRadius: '10px', backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' };
const thumb  = { width: '90px', height: '72px', objectFit: 'cover', borderRadius: '6px', flexShrink: 0 };
const adInfo = { flex: 1, minWidth: 0 };
const adTitle  = { fontSize: '15px', fontWeight: '700', color: '#222', marginBottom: '3px' };
const adPrice  = { fontSize: '16px', fontWeight: '900', color: '#002f34', marginBottom: '4px' };
const adMeta   = { display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', color: '#888', marginBottom: '6px' };
const catPill  = { backgroundColor: '#e8f0fe', color: '#3a7bd5', borderRadius: '10px', padding: '2px 8px', fontWeight: '600', fontSize: '11px' };
const liveTag    = { fontSize: '11px', fontWeight: '700', color: '#27ae60' };
const pendingTag = { fontSize: '11px', fontWeight: '700', color: '#e67e22' };
const actionCol = { display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 };
const editBtn   = { padding: '8px 18px', backgroundColor: '#3a7bd5', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' };
const deleteBtn = { padding: '8px 18px', backgroundColor: '#fff', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600', whiteSpace: 'nowrap' };
const emptyState = { textAlign: 'center', padding: '60px 20px', backgroundColor: '#fff', borderRadius: '10px', border: '2px dashed #e0e0e0' };

/* Modal */
const overlay = { position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' };
const modal   = { backgroundColor: '#fff', borderRadius: '12px', width: '560px', maxWidth: '100%', padding: '28px', boxShadow: '0 10px 40px rgba(0,0,0,0.2)', maxHeight: '90vh', overflowY: 'auto' };
const modalHeader = { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' };
const modalTitle  = { fontSize: '18px', fontWeight: '800', color: '#002f34' };
const closeBtn    = { background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: '#888' };
const fieldGroup  = { marginBottom: '16px' };
const fieldLabel  = { display: 'block', fontSize: '11px', fontWeight: '700', color: '#555', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' };
const fieldInput  = { width: '100%', padding: '10px 12px', border: '1px solid #ddd', borderRadius: '7px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' };

/* Image grid */
const imgGrid   = { display: 'flex', flexWrap: 'wrap', gap: '10px' };
const imgSlot   = { position: 'relative', width: '80px', height: '80px', borderRadius: '6px', overflow: 'visible', flexShrink: 0 };
const slotImg   = { width: '80px', height: '80px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e0e0e0', display: 'block' };
const removeImgBtn = { position: 'absolute', top: '-6px', right: '-6px', width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: '900', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2, lineHeight: 1 };
const newBadge  = { position: 'absolute', bottom: '2px', left: '2px', backgroundColor: '#27ae60', color: '#fff', fontSize: '8px', fontWeight: '800', padding: '1px 5px', borderRadius: '4px' };
const addImgSlot = { width: '80px', height: '80px', border: '2px dashed #ccc', borderRadius: '6px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', backgroundColor: '#fafafa' };

const approvalNote = { backgroundColor: '#fff8e1', border: '1px solid #ffe082', borderRadius: '7px', padding: '10px 14px', fontSize: '12px', color: '#6d4c00', marginBottom: '20px', lineHeight: 1.6 };
const modalActions = { display: 'flex', justifyContent: 'flex-end', gap: '10px' };
const cancelModalBtn = { padding: '10px 22px', backgroundColor: '#f5f5f5', border: '1px solid #ddd', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '600', color: '#555' };
const saveModalBtn   = { padding: '10px 24px', backgroundColor: '#002f34', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: '700' };

const toastStyle = { position: 'fixed', bottom: '28px', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#002f34', color: '#fff', padding: '12px 28px', borderRadius: '30px', fontSize: '14px', fontWeight: '600', zIndex: 2000, boxShadow: '0 4px 16px rgba(0,0,0,0.2)', whiteSpace: 'nowrap' };

export default MyAds;
