import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Notifications({ user }) {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`http://localhost:5000/api/notifications/${user.id}`)
            .then(res => {
                setNotifications(res.data);
                axios.put(`http://localhost:5000/api/notifications/read/${user.id}`).catch(() => {});
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, [user.id]);

    const deleteNotification = (id) => {
        axios.delete(`http://localhost:5000/api/notifications/${id}`)
            .then(() => setNotifications(prev => prev.filter(n => n.id !== id)))
            .catch(() => {});
    };

    const deleteAll = () => {
        if (!window.confirm('Delete all notifications?')) return;
        Promise.all(notifications.map(n => axios.delete(`http://localhost:5000/api/notifications/${n.id}`)))
            .then(() => setNotifications([]))
            .catch(() => {});
    };

    if (loading) return <div style={loadWrap}><div style={spinner} /></div>;

    return (
        <div style={page}>
            <div style={container}>
                {/* Header */}
                <div style={header}>
                    <div style={headerLeft}>
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#002f34" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                            <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                        </svg>
                        <h2 style={title}>Notifications</h2>
                        {notifications.length > 0 && (
                            <span style={countBadge}>{notifications.length}</span>
                        )}
                    </div>
                    {notifications.length > 0 && (
                        <button style={clearAllBtn} onClick={deleteAll}>
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="3 6 5 6 21 6"/>
                                <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                <path d="M10 11v6"/><path d="M14 11v6"/>
                            </svg>
                            Clear All
                        </button>
                    )}
                </div>

                {/* Content */}
                {notifications.length === 0 ? (
                    <div style={emptyWrap}>
                        <div style={emptyIcon}>
                            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5" strokeLinecap="round">
                                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                            </svg>
                        </div>
                        <p style={emptyTitle}>No notifications yet</p>
                        <p style={emptySubtitle}>We'll notify you when something important happens to your ads.</p>
                    </div>
                ) : (
                    <div style={list}>
                        {notifications.map(n => {
                            const isApproved = n.message?.toLowerCase().includes('approved') || n.message?.toLowerCase().includes('live');
                            const isRemoved  = n.message?.toLowerCase().includes('removed');
                            const accent     = isApproved ? '#27ae60' : isRemoved ? '#e74c3c' : '#3a7bd5';
                            return (
                                <div key={n.id} style={{ ...card, borderLeft: `4px solid ${accent}`, backgroundColor: n.is_read ? '#fff' : '#f5f9ff' }}>
                                    <div style={cardTop}>
                                        {/* Icon */}
                                        <div style={iconWrap(isApproved, isRemoved)}>
                                            {isApproved ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#27ae60" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="20 6 9 17 4 12"/>
                                                </svg>
                                            ) : isRemoved ? (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#e74c3c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                                                </svg>
                                            ) : (
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3a7bd5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                                                </svg>
                                            )}
                                        </div>

                                        {/* Body */}
                                        <div style={cardBody}>
                                            <div style={cardTitleRow}>
                                                <span style={cardTitle}>{n.title}</span>
                                                <span style={isApproved ? badgeLive : isRemoved ? badgeRemoved : badgeInfo}>
                                                    {isApproved ? 'LIVE' : isRemoved ? 'REMOVED' : 'INFO'}
                                                </span>
                                            </div>
                                            <p style={cardMsg}>{n.message}</p>
                                            <div style={cardFooter}>
                                                <div style={timeRow}>
                                                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#aaa" strokeWidth="2" strokeLinecap="round">
                                                        <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                                                    </svg>
                                                    <span style={cardTime}>
                                                        {new Date(n.created_at).toLocaleString('en-IN', {
                                                            day: '2-digit', month: 'short', year: 'numeric',
                                                            hour: '2-digit', minute: '2-digit'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Right: unread dot + delete */}
                                        <div style={cardActions}>
                                            {!n.is_read && <div style={unreadDot} />}
                                            <button
                                                style={deleteBtn}
                                                title="Delete notification"
                                                onClick={() => deleteNotification(n.id)}
                                                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#fdf0ee'}
                                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                            >
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                                    <polyline points="3 6 5 6 21 6"/>
                                                    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/>
                                                    <path d="M10 11v6"/><path d="M14 11v6"/>
                                                    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}

/* ── STYLES ── */
const page       = { minHeight: 'calc(100vh - 84px)', backgroundColor: '#f2f4f5', padding: '28px 20px' };
const container  = { maxWidth: '740px', margin: '0 auto' };

const header     = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' };
const headerLeft = { display: 'flex', alignItems: 'center', gap: '12px' };
const title      = { fontSize: '22px', fontWeight: '900', color: '#002f34', margin: 0 };
const countBadge = { backgroundColor: '#3a7bd5', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '13px', fontWeight: '700' };
const clearAllBtn= { display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 14px', backgroundColor: '#fff', border: '1px solid #e0e0e0', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', color: '#888', fontWeight: '600' };

const list = { display: 'flex', flexDirection: 'column', gap: '12px' };

const card = {
    backgroundColor: '#fff', borderRadius: '10px', padding: '18px 20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1px solid #e8e8e8',
};
const cardTop      = { display: 'flex', gap: '14px', alignItems: 'flex-start' };
const iconWrap = (approved, removed) => ({
    width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
    backgroundColor: approved ? '#eafaf1' : removed ? '#fdf0ee' : '#eef4ff',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
});
const cardBody     = { flex: 1, minWidth: 0 };
const cardTitleRow = { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px', flexWrap: 'wrap' };
const cardTitle    = { fontSize: '15px', fontWeight: '800', color: '#002f34' };
const badgeLive    = { fontSize: '10px', fontWeight: '800', backgroundColor: '#eafaf1', color: '#27ae60', border: '1px solid #a8e6c8', borderRadius: '6px', padding: '2px 8px', letterSpacing: '0.5px', flexShrink: 0 };
const badgeRemoved = { ...badgeLive, backgroundColor: '#fdf0ee', color: '#e74c3c', border: '1px solid #f5c6cb' };
const badgeInfo    = { ...badgeLive, backgroundColor: '#eef4ff', color: '#3a7bd5', border: '1px solid #c9deff' };
const cardMsg      = { fontSize: '14px', color: '#555', lineHeight: 1.65, margin: '0 0 10px' };
const cardFooter   = { display: 'flex', alignItems: 'center', justifyContent: 'space-between' };
const timeRow      = { display: 'flex', alignItems: 'center', gap: '5px' };
const cardTime     = { fontSize: '12px', color: '#aaa', fontWeight: '500' };
const cardActions  = { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', flexShrink: 0 };
const unreadDot    = { width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#3a7bd5', flexShrink: 0 };
const deleteBtn    = { background: 'transparent', border: 'none', cursor: 'pointer', padding: '6px', borderRadius: '6px', display: 'flex', alignItems: 'center', transition: 'background-color 0.15s' };

const emptyWrap     = { textAlign: 'center', padding: '80px 20px', backgroundColor: '#fff', borderRadius: '12px', border: '1px solid #e8e8e8' };
const emptyIcon     = { marginBottom: '20px', opacity: 0.5 };
const emptyTitle    = { fontSize: '18px', fontWeight: '700', color: '#555', margin: '0 0 8px' };
const emptySubtitle = { fontSize: '14px', color: '#aaa', margin: 0 };

const loadWrap = { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' };
const spinner  = { width: '36px', height: '36px', border: '3px solid #e0e0e0', borderTop: '3px solid #002f34', borderRadius: '50%', animation: 'spin 0.8s linear infinite' };

export default Notifications;
