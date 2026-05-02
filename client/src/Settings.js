import React, { useState } from 'react';

function Settings({ user, onLogout }) {
    const [subView, setSubView] = useState('Notifications');

    const settingsOptions = [
        { label: 'Privacy' },
        { label: 'Notifications' },
        { label: 'Logout from all devices' },
        { label: 'Delete account' },
        { label: 'Chat safety tips' }
    ];

    const handleDeleteAccount = () => {
        if (window.confirm("Are you sure? This will permanently delete your Marwadi University OpenMarket account.")) {
            alert("Account deletion request sent to Admin.");
            onLogout();
        }
    };

    return (
        <div style={container}>
            {/* --- SIDEBAR --- */}
            <div style={sidebar}>
                {settingsOptions.map((opt, i) => (
                    <p 
                        key={i} 
                        onClick={() => setSubView(opt.label)}
                        style={{ 
                            color: subView === opt.label ? '#000' : '#666', 
                            fontWeight: subView === opt.label ? 'bold' : 'normal',
                            cursor: 'pointer',
                            padding: '10px 0',
                            borderRight: subView === opt.label ? '3px solid #002f34' : 'none'
                        }}
                    >
                        {opt.label}
                    </p>
                ))}
            </div>

            {/* --- DYNAMIC CONTENT AREA --- */}
            <div style={content}>
                {subView === 'Notifications' && (
                    <>
                        <h2 style={contentTitle}>Notifications</h2>
                        <p style={description}>Manage your alerts for new messages and price drops.</p>
                        <hr style={hr} />
                        <div style={settingRow}>
                            <span>Email Notifications</span>
                            <input type="checkbox" defaultChecked />
                        </div>
                    </>
                )}

                {subView === 'Privacy' && (
                    <>
                        <h2 style={contentTitle}>Privacy</h2>
                        <p style={description}>Control who can see your phone number and activity.</p>
                        <hr style={hr} />
                        <button style={actionBtn}>Show Phone Number to Everyone</button>
                    </>
                )}

                {subView === 'Logout from all devices' && (
                    <>
                        <h2 style={contentTitle}>Logout from all devices</h2>
                        <p style={description}>This will end all your active sessions on other laptops or mobile phones.</p>
                        <hr style={hr} />
                        <button onClick={onLogout} style={logoutBtn}>Logout from all devices</button>
                    </>
                )}

                {subView === 'Delete account' && (
                    <>
                        <h2 style={contentTitle}>Delete account</h2>
                        <p style={description}>Once you delete your account, there is no going back. Please be certain.</p>
                        <hr style={hr} />
                        <button onClick={handleDeleteAccount} style={dangerBtn}>Delete my account</button>
                    </>
                )}

                {subView === 'Chat safety tips' && (
                    <>
                        <h2 style={contentTitle}>Chat safety tips</h2>
                        <p style={description}>Stay safe while trading on campus.</p>
                        <hr style={hr} />
                        <ul style={{lineHeight: '2'}}>
                            <li>Never pay in advance before seeing the item.</li>
                            <li>Meet in public places like the University Canteen or Library.</li>
                            <li>Check the item thoroughly before transferring money.</li>
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

// --- STYLES ---
const container = { display: 'flex', gap: '40px', padding: '40px', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #ddd', minHeight: '400px' };
const sidebar = { width: '220px', borderRight: '1px solid #eee' };
const content = { flex: 1 };
const contentTitle = { margin: '0 0 10px 0', fontSize: '24px' };
const description = { color: '#666', fontSize: '14px', marginBottom: '20px' };
const hr = { border: 'none', borderTop: '1px solid #eee', margin: '20px 0' };
const settingRow = { display: 'flex', justifyContent: 'space-between', alignItems: 'center' };
const actionBtn = { padding: '10px 20px', backgroundColor: '#f8f9fa', border: '1px solid #ccc', cursor: 'pointer', borderRadius: '4px' };
const logoutBtn = { padding: '10px 20px', backgroundColor: '#fff', border: '1px solid #ddd', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' };
const dangerBtn = { padding: '10px 20px', backgroundColor: '#e74c3c', color: '#fff', border: 'none', cursor: 'pointer', borderRadius: '4px', fontWeight: 'bold' };

export default Settings;