import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';

const EMOJI_LIST = ['👍','❤️','😊','🙏','💯','✅','🤝','💰','📦','🚚'];

export default function ChatWindow({ product, currentUser, onBack, showProductPanel = true }) {
    const [msg, setMsg]               = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isRecording, setIsRecording] = useState(false);
    const [imgPreview, setImgPreview]   = useState(null); // { file, url }
    const [showEmoji, setShowEmoji]     = useState(false);
    const [sending, setSending]         = useState(false);

    const mediaRecorder = useRef(null);
    const audioChunks   = useRef([]);
    const chatEndRef    = useRef(null);
    const fileInputRef  = useRef(null);
    const inputRef      = useRef(null);

    const scrollToBottom = () =>
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });

    useEffect(() => { scrollToBottom(); }, [chatHistory]);

    /* Who is the "other person"? */
    const getOtherId = useCallback(() => {
        if (currentUser.id !== product.seller_id) return product.seller_id;
        return product.buyer_id;
    }, [currentUser.id, product]);

    /* Fetch messages */
    const fetchMessages = useCallback(() => {
        const otherId = getOtherId();
        if (!otherId || !product.id) return;
        axios.get(`http://localhost:5000/api/messages/${product.id}/${currentUser.id}/${otherId}`)
            .then(r => setChatHistory(r.data))
            .catch(console.error);
    }, [product.id, currentUser.id, getOtherId]);

    useEffect(() => {
        fetchMessages();
        const t = setInterval(fetchMessages, 3000);
        return () => clearInterval(t);
    }, [fetchMessages]);

    /* Send text */
    const sendText = () => {
        const otherId = getOtherId();
        if (!msg.trim() || !otherId || sending) return;
        setSending(true);
        axios.post('http://localhost:5000/api/messages/send', {
            product_id:  product.id,
            sender_id:   currentUser.id,
            receiver_id: otherId,
            message_text: msg.trim(),
        }).then(() => { setMsg(''); fetchMessages(); })
          .finally(() => setSending(false));
    };

    /* Send image or file */
    const sendMedia = (file, type = 'image') => {
        const otherId = getOtherId();
        if (!file || !otherId) return;
        const fd = new FormData();
        fd.append('chatFile', file, file.name);
        fd.append('product_id',  product.id);
        fd.append('sender_id',   currentUser.id);
        fd.append('receiver_id', otherId);
        fd.append('message_type', type);
        axios.post('http://localhost:5000/api/messages/upload', fd)
            .then(() => { setImgPreview(null); fetchMessages(); })
            .catch(() => alert('Upload failed'));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const isImg = file.type.startsWith('image/');
        if (isImg) {
            setImgPreview({ file, url: URL.createObjectURL(file) });
        } else {
            sendMedia(file, 'file');
        }
        e.target.value = '';
    };

    /* Voice recording */
    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorder.current = new MediaRecorder(stream);
            audioChunks.current   = [];
            mediaRecorder.current.ondataavailable = e => audioChunks.current.push(e.data);
            mediaRecorder.current.onstop = () => {
                const blob = new Blob(audioChunks.current, { type: 'audio/webm' });
                sendMedia(new File([blob], 'voice.webm', { type: 'audio/webm' }), 'audio');
            };
            mediaRecorder.current.start();
            setIsRecording(true);
        } catch { alert('Microphone access denied'); }
    };

    const stopRecording = () => {
        mediaRecorder.current?.stop();
        setIsRecording(false);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendText(); }
    };

    const getProductImg = () => {
        try { return JSON.parse(product.image_url)[0]; }
        catch { return product.image_url; }
    };

    const otherName = product.other_user_name
        || (currentUser.id !== product.seller_id ? 'Seller' : 'Buyer');

    /* Group by date */
    const grouped = chatHistory.reduce((acc, m) => {
        const d = m.timestamp
            ? new Date(m.timestamp).toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' })
            : 'Today';
        (acc[d] = acc[d] || []).push(m);
        return acc;
    }, {});

    const fmtTime = ts => ts
        ? new Date(ts).toLocaleTimeString([], { hour:'2-digit', minute:'2-digit' })
        : '';

    return (
        <div style={shell}>

            {/* ─── LEFT: PRODUCT PANEL (buyer only) ─────────────── */}
            {showProductPanel && (
                <div style={productPanel}>
                    <button style={backBtn} onClick={onBack}>
                        <ArrowLeft /> Back
                    </button>
                    <div style={productCard}>
                        <img src={`http://localhost:5000${getProductImg()}`} alt="" style={productImg} />
                        <div style={productInfo}>
                            <div style={productPrice}>₹ {Number(product.price).toLocaleString('en-IN')}</div>
                            <div style={productTitle}>{product.title}</div>
                            <div style={productMeta}>
                                <span>📍 {product.location}</span>
                                <span style={catTag}>{product.category}</span>
                            </div>
                        </div>
                    </div>
                    <div style={safetyBox}>
                        <div style={safetyTitle}>🛡️ Safety Tips</div>
                        <ul style={safetyList}>
                            <li>Meet in a safe, public place</li>
                            <li>Don't pay in advance</li>
                            <li>Inspect before payment</li>
                            <li>Never share OTP / passwords</li>
                        </ul>
                    </div>
                </div>
            )}

            {/* ─── RIGHT: CHAT PANEL ────────────────────────────── */}
            <div style={chatPanel}>

                {/* Header */}
                <div style={chatHeader}>
                    <button style={backBtn} onClick={onBack}><ArrowLeft /></button>
                    <div style={headerAvatar}>{otherName.charAt(0).toUpperCase()}</div>
                    <div style={headerInfo}>
                        <div style={headerName}>{otherName}</div>
                        <div style={headerSub}>
                            {currentUser.id !== product.seller_id ? 'Seller' : 'Buyer'}
                            &nbsp;·&nbsp;
                            {product.title?.slice(0, 40)}{(product.title?.length || 0) > 40 ? '…' : ''}
                        </div>
                    </div>
                    {/* Compact product price when no side panel */}
                    {!showProductPanel && product.price && !isNaN(Number(product.price)) && (
                        <div style={compactProduct}>
                            <span style={compactPrice}>₹ {Number(product.price).toLocaleString('en-IN')}</span>
                            <span style={compactTitle}>{product.title?.slice(0, 22)}</span>
                        </div>
                    )}
                    <div style={activePill}><span style={greenDot}/> Active</div>
                </div>

                {/* Messages */}
                <div style={msgArea}>
                    {chatHistory.length === 0 && (
                        <div style={emptyWrap}>
                            <div style={{fontSize:'52px',marginBottom:'12px'}}>💬</div>
                            <p style={{color:'#aaa',textAlign:'center',fontSize:'15px',lineHeight:1.7}}>
                                No messages yet.<br/>Start the conversation!
                            </p>
                        </div>
                    )}

                    {Object.entries(grouped).map(([date, msgs]) => (
                        <div key={date}>
                            <div style={dateSep}><span style={datePill}>{date}</span></div>
                            {msgs.map((m, i) => {
                                const mine = m.sender_id === currentUser.id;
                                return (
                                    <div key={i} style={{ ...msgRow, justifyContent: mine ? 'flex-end' : 'flex-start' }}>
                                        {!mine && <div style={theirAvatar}>{otherName.charAt(0)}</div>}

                                        <div style={mine ? myBubble : theirBubble}>
                                            {m.message_type === 'text' && (
                                                <span style={bubbleTxt}>{m.message_text}</span>
                                            )}

                                            {m.message_type === 'image' && (
                                                <img
                                                    src={`http://localhost:5000${m.file_url}`}
                                                    alt="img"
                                                    style={msgImgStyle}
                                                    onClick={() => window.open(`http://localhost:5000${m.file_url}`, '_blank')}
                                                />
                                            )}
                                            {m.message_type === 'audio' && (
                                                <audio
                                                    src={`http://localhost:5000${m.file_url}`}
                                                    controls
                                                    style={{ width:'200px', display:'block' }}
                                                />
                                            )}
                                            {m.message_type === 'file' && (
                                                <a
                                                    href={`http://localhost:5000${m.file_url}`}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    style={fileLink}
                                                >
                                                    📎 {m.file_url?.split('/').pop()}
                                                </a>
                                            )}
                                            <div style={tickRow}>
                                              <span style={mine ? myTime : theirTime}>{fmtTime(m.timestamp)}</span>
                                              {mine && <TickIcon read={!!m.is_read} />}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                    <div ref={chatEndRef}/>
                </div>

                {/* Image preview before send */}
                {imgPreview && (
                    <div style={previewBar}>
                        <img src={imgPreview.url} alt="" style={previewImg}/>
                        <div style={previewInfo}>
                            <span style={{fontSize:'13px',color:'#555'}}>Ready to send</span>
                        </div>
                        <button style={previewSendBtn} onClick={() => sendMedia(imgPreview.file, 'image')}>
                            Send Image
                        </button>
                        <button style={previewCancelBtn} onClick={() => setImgPreview(null)}>✕</button>
                    </div>
                )}

                {/* Emoji quick-panel */}
                {showEmoji && (
                    <div style={emojiPanel}>
                        {EMOJI_LIST.map(e => (
                            <button key={e} style={emojiBtn}
                                onClick={() => { setMsg(m => m + e); setShowEmoji(false); inputRef.current?.focus(); }}>
                                {e}
                            </button>
                        ))}
                    </div>
                )}

                {/* Input bar */}
                <div style={inputBar}>
                    {/* Emoji */}
                    <button
                        type="button"
                        style={toolBtn}
                        title="Emoji"
                        onClick={() => setShowEmoji(v => !v)}
                    >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <path d="M8 13s1.5 2 4 2 4-2 4-2"/>
                          <line x1="9" y1="9" x2="9.01" y2="9"/>
                          <line x1="15" y1="9" x2="15.01" y2="9"/>
                        </svg>
                    </button>

                    {/* Attach / image */}
                    <button
                        type="button"
                        style={toolBtn}
                        title="Attach image or file"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <PaperclipIcon />
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*,application/pdf,.doc,.docx,.txt"
                        style={{ display:'none' }}
                        onChange={handleFileChange}
                    />

                    {/* Text input */}
                    <div style={inputWrap}>
                        <textarea
                            ref={inputRef}
                            rows={1}
                            style={msgInput}
                            value={msg}
                            placeholder="Type a message…"
                            onChange={e => setMsg(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>

                    {/* Mic / Send */}
                    {msg.trim() ? (
                        <button
                            type="button"
                            style={{ ...sendBtn, opacity: sending ? 0.6 : 1 }}
                            onClick={sendText}
                            disabled={sending}
                        >
                            <SendIcon /> Send
                        </button>
                    ) : (
                        <button
                            type="button"
                            style={{ ...micBtn, backgroundColor: isRecording ? '#ff4d4d' : '#f0f2f5' }}
                            onMouseDown={startRecording}
                            onMouseUp={stopRecording}
                            onTouchStart={startRecording}
                            onTouchEnd={stopRecording}
                            title={isRecording ? 'Release to send voice' : 'Hold for voice'}
                        >
                            {isRecording ? <RecordingDot/> : <MicIcon/>}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

/* ── SVG ICONS ──────────────────────────────────────────────────────── */
const ArrowLeft  = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>;
const TickIcon = ({ read }) => (
    <svg width="16" height="10" viewBox="0 0 16 10" fill="none" style={{ flexShrink: 0 }}>
        {/* first tick */}
        <path d="M1 5 L4 8 L8 2" stroke={read ? '#4caf50' : 'rgba(255,255,255,0.5)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
        {/* second tick (offset) */}
        <path d="M5 5 L8 8 L12 2" stroke={read ? '#4caf50' : 'rgba(255,255,255,0.5)'} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);
const SendIcon   = () => <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>;
const MicIcon    = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 19v3M9 22h6"/></svg>;
const RecordingDot = () => <svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><circle cx="12" cy="12" r="7"/></svg>;
const PaperclipIcon = () => <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#555" strokeWidth="2" strokeLinecap="round"><path d="M21.44 11.05l-9.19 9.19a6 6 0 0 1-8.49-8.49l9.19-9.19a4 4 0 0 1 5.66 5.66l-9.2 9.19a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>;

/* ── STYLES ─────────────────────────────────────────────────────────── */
const shell = { display:'flex', width:'100%', height:'100%', overflow:'hidden', fontFamily:"'Segoe UI',Arial,sans-serif", backgroundColor:'#fff' };

/* Product panel */
const productPanel = { width:'290px', flexShrink:0, borderRight:'1px solid #eee', backgroundColor:'#fafafa', display:'flex', flexDirection:'column', padding:'16px', gap:'14px', overflowY:'auto' };
const backBtn = { display:'flex', alignItems:'center', gap:'6px', background:'none', border:'none', cursor:'pointer', color:'#002f34', fontWeight:'700', fontSize:'14px', padding:'4px 0' };
const productCard = { backgroundColor:'#fff', borderRadius:'10px', border:'1px solid #e8e8e8', overflow:'hidden', boxShadow:'0 2px 8px rgba(0,0,0,0.06)' };
const productImg = { width:'100%', height:'170px', objectFit:'contain', backgroundColor:'#f9f9f9', display:'block' };
const productInfo = { padding:'12px' };
const productPrice = { fontSize:'20px', fontWeight:'900', color:'#002f34', marginBottom:'4px' };
const productTitle = { fontSize:'13px', color:'#444', fontWeight:'600', marginBottom:'8px', lineHeight:1.4 };
const productMeta = { display:'flex', justifyContent:'space-between', alignItems:'center', fontSize:'11px', color:'#888' };
const catTag = { backgroundColor:'#e8f0fe', color:'#3a7bd5', borderRadius:'10px', padding:'2px 8px', fontWeight:'600', fontSize:'10px' };
const safetyBox = { backgroundColor:'#fff8e1', borderRadius:'10px', padding:'12px', border:'1px solid #ffe082' };
const safetyTitle = { fontWeight:'700', fontSize:'12px', color:'#e65100', marginBottom:'6px' };
const safetyList = { margin:0, paddingLeft:'16px', fontSize:'11px', color:'#666', lineHeight:2.2 };

/* Chat panel */
const chatPanel = { flex:1, display:'flex', flexDirection:'column', overflow:'hidden', minWidth:0 };

const chatHeader     = { display:'flex', alignItems:'center', gap:'12px', padding:'14px 20px', borderBottom:'1px solid #eee', backgroundColor:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.05)', flexShrink:0 };
const compactProduct = { marginLeft:'auto', display:'flex', flexDirection:'column', alignItems:'flex-end', gap:'2px', marginRight:'12px' };
const compactPrice   = { fontSize:'15px', fontWeight:'900', color:'#002f34' };
const compactTitle   = { fontSize:'11px', color:'#888', whiteSpace:'nowrap' };
const headerAvatar = { width:'42px', height:'42px', borderRadius:'50%', backgroundColor:'#002f34', color:'#ffce32', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:'900', fontSize:'17px', flexShrink:0 };
const headerInfo = { flex:1, minWidth:0 };
const headerName = { fontWeight:'800', fontSize:'15px', color:'#002f34' };
const headerSub  = { fontSize:'12px', color:'#888', marginTop:'1px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' };
const activePill = { display:'flex', alignItems:'center', gap:'5px', fontSize:'12px', color:'#27ae60', fontWeight:'600', flexShrink:0 };
const greenDot   = { width:'8px', height:'8px', borderRadius:'50%', backgroundColor:'#27ae60', display:'inline-block' };

const msgArea = { flex:1, overflowY:'auto', padding:'20px 24px', backgroundColor:'#f0f2f5', display:'flex', flexDirection:'column', gap:'2px' };
const emptyWrap = { flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', paddingTop:'60px' };

const dateSep  = { display:'flex', justifyContent:'center', margin:'14px 0 10px' };
const datePill = { backgroundColor:'#dde3f0', color:'#555', fontSize:'11px', fontWeight:'600', padding:'3px 14px', borderRadius:'20px' };

const msgRow    = { display:'flex', alignItems:'flex-end', gap:'8px', marginBottom:'4px' };
const theirAvatar = { width:'26px', height:'26px', borderRadius:'50%', backgroundColor:'#3a7bd5', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'10px', fontWeight:'800', flexShrink:0, marginBottom:'2px' };

const myBubble    = { backgroundColor:'#002f34', color:'#fff', padding:'10px 14px', borderRadius:'18px 18px 4px 18px', maxWidth:'65%', minWidth:'96px', wordBreak:'break-word', boxShadow:'0 1px 4px rgba(0,0,0,0.15)', display:'flex', flexDirection:'column' };
const theirBubble = { backgroundColor:'#fff', color:'#222', padding:'10px 14px', borderRadius:'18px 18px 18px 4px', maxWidth:'65%', minWidth:'96px', wordBreak:'break-word', border:'1px solid #e8e8e8', boxShadow:'0 1px 3px rgba(0,0,0,0.06)', display:'flex', flexDirection:'column' };
const bubbleTxt   = { fontSize:'14px', lineHeight:1.55, display:'block', flex:1 };
const tickRow   = { display:'flex', alignItems:'center', justifyContent:'flex-end', gap:'3px', marginTop:'6px', alignSelf:'flex-end' };
const myTime    = { fontSize:'10px', opacity:0.6,  whiteSpace:'nowrap' };
const theirTime = { fontSize:'10px', opacity:0.45, whiteSpace:'nowrap', alignSelf:'flex-end', marginTop:'6px' };

const msgImgStyle = { maxWidth:'220px', maxHeight:'200px', borderRadius:'8px', cursor:'pointer', display:'block', marginBottom:'2px' };
const fileLink  = { color:'inherit', fontSize:'13px', fontWeight:'600', textDecoration:'none', display:'flex', alignItems:'center', gap:'6px' };

/* Image preview bar */
const previewBar = { display:'flex', alignItems:'center', gap:'12px', padding:'10px 16px', backgroundColor:'#f8f9fa', borderTop:'1px solid #eee', flexShrink:0 };
const previewImg = { width:'50px', height:'50px', objectFit:'cover', borderRadius:'6px', border:'1px solid #ddd' };
const previewInfo = { flex:1 };
const previewSendBtn  = { padding:'7px 16px', backgroundColor:'#002f34', color:'#fff', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'700', fontSize:'13px' };
const previewCancelBtn= { padding:'7px 12px', backgroundColor:'#eee', color:'#555', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:'700', fontSize:'14px' };

/* Emoji panel */
const emojiPanel = { display:'flex', gap:'8px', padding:'10px 18px', backgroundColor:'#fff', borderTop:'1px solid #eee', flexShrink:0, flexWrap:'wrap' };
const emojiBtn   = { fontSize:'22px', background:'none', border:'none', cursor:'pointer', borderRadius:'8px', padding:'4px 8px', transition:'background 0.15s' };

/* Input bar */
const inputBar  = { display:'flex', alignItems:'flex-end', gap:'8px', padding:'12px 16px', borderTop:'1px solid #eee', backgroundColor:'#fff', flexShrink:0 };
const toolBtn   = { width:'38px', height:'38px', borderRadius:'50%', border:'none', cursor:'pointer', backgroundColor:'#f0f2f5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0, transition:'background 0.15s' };
const inputWrap = { flex:1, backgroundColor:'#f0f2f5', borderRadius:'20px', padding:'6px 14px', display:'flex', alignItems:'center' };
const msgInput  = { width:'100%', border:'none', background:'none', outline:'none', fontSize:'14px', fontFamily:'inherit', resize:'none', lineHeight:1.5, maxHeight:'100px', overflowY:'auto' };
const sendBtn   = { display:'flex', alignItems:'center', gap:'7px', padding:'9px 18px', borderRadius:'24px', backgroundColor:'#002f34', color:'#fff', border:'none', cursor:'pointer', fontWeight:'700', fontSize:'14px', flexShrink:0, transition:'opacity 0.2s' };
const micBtn    = { width:'42px', height:'42px', borderRadius:'50%', border:'none', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, transition:'background 0.2s' };
