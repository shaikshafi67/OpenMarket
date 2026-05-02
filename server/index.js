const express    = require('express');
const mysql      = require('mysql');
const cors       = require('cors');
const multer     = require('multer');
const path       = require('path');
const nodemailer = require('nodemailer');

// ── EMAIL TRANSPORTER ─────────────────────────────────────────────
// Uses Gmail App Password. Generate one at: Google Account → Security → App Passwords
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'openmarket39@gmail.com',
        pass: 'ebnnavlafojalhhx',
    }
});

function sendEmail(to, subject, html) {
    transporter.sendMail({ from: '"OpenMarket Team" <openmarket39@gmail.com>', to, subject, html }, (err) => {
        if (err) console.error('Email error:', err.message);
        else console.log('Email sent to', to);
    });
}

function sendNotification(userId, title, message) {
    db.query("INSERT INTO notifications (user_id, title, message) VALUES (?, ?, ?)",
        [userId, title, message],
        (err) => { if (err) console.error('Notification insert error:', err.message); }
    );
}

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const db = mysql.createPool({
    host:            process.env.DB_HOST     || 'localhost',
    user:            process.env.DB_USER     || 'root',
    password:        process.env.DB_PASSWORD || '',
    database:        process.env.DB_NAME     || 'open_market',
    connectionLimit: 10,
});

db.getConnection((err, conn) => {
    if (err) console.log("❌ DB Error:", err.message);
    else {
        console.log("✅ Server & Database Connected Successfully");
        conn.query(`CREATE TABLE IF NOT EXISTS notifications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            title VARCHAR(255),
            message TEXT NOT NULL,
            is_read TINYINT(1) DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )`, (e) => { if (e) console.error('Notifications table error:', e.message); });
        conn.release();
        setupFooterTables();
    }
});

function setupFooterTables() {
    const tables = [
        `CREATE TABLE IF NOT EXISTS footer_sections (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            is_enabled TINYINT(1) DEFAULT 1,
            sort_order INT DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS footer_links (
            id INT AUTO_INCREMENT PRIMARY KEY,
            section_id INT NOT NULL,
            label VARCHAR(150) NOT NULL,
            url VARCHAR(500) DEFAULT '#',
            is_enabled TINYINT(1) DEFAULT 1,
            sort_order INT DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS footer_social (
            id INT AUTO_INCREMENT PRIMARY KEY,
            platform VARCHAR(50) NOT NULL,
            icon VARCHAR(50),
            url VARCHAR(500) DEFAULT '#',
            is_enabled TINYINT(1) DEFAULT 1,
            sort_order INT DEFAULT 0
        )`,
        `CREATE TABLE IF NOT EXISTS footer_settings (
            id INT AUTO_INCREMENT PRIMARY KEY,
            setting_key VARCHAR(100) NOT NULL UNIQUE,
            setting_value TEXT
        )`,
    ];
    let i = 0;
    const next = () => {
        if (i >= tables.length) { addMsgIsReadColumnIfMissing(); addContentColumnIfMissing(); seedFooterIfEmpty(); return; }
        db.query(tables[i++], (e) => { if (e) console.error('Footer table error:', e.message); next(); });
    };
    next();
}

function addMsgIsReadColumnIfMissing() {
    db.query(
        `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'messages' AND COLUMN_NAME = 'is_read'`,
        (err, rows) => {
            if (!err && rows[0].cnt === 0) {
                db.query("ALTER TABLE messages ADD COLUMN is_read TINYINT(1) DEFAULT 0", (e) => {
                    if (!e) console.log('✅ Added is_read column to messages');
                });
            }
        }
    );
}

function addContentColumnIfMissing() {
    db.query(
        `SELECT COUNT(*) AS cnt FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'footer_links' AND COLUMN_NAME = 'content'`,
        (err, rows) => {
            if (!err && rows[0].cnt === 0) {
                db.query("ALTER TABLE footer_links ADD COLUMN content LONGTEXT", (e) => {
                    if (!e) console.log('✅ Added content column to footer_links');
                });
            }
        }
    );
}

function seedFooterIfEmpty() {
    db.query('SELECT COUNT(*) AS cnt FROM footer_sections', (err, rows) => {
        if (err || rows[0].cnt > 0) return;
        const sectionData = [['Company', 1], ['Help & Support', 2], ['Legal', 3]];
        let ids = [];
        const insertSection = (idx) => {
            if (idx >= sectionData.length) { seedLinksAndSocial(ids); return; }
            db.query('INSERT INTO footer_sections (name, sort_order) VALUES (?, ?)', sectionData[idx], (e, r) => {
                if (!e) ids.push(r.insertId);
                insertSection(idx + 1);
            });
        };
        insertSection(0);
    });
}

function seedLinksAndSocial(ids) {
    const [cId, hId, lId] = ids;
    const links = [
        [cId,'About Us','#',1],[cId,'Careers','#',2],[cId,'Blog','#',3],[cId,'Contact Us','#',4],
        [hId,'Help Center','#',1],[hId,'FAQs','#',2],[hId,'Safety Tips','#',3],[hId,'Report an Issue','#',4],
        [lId,'Privacy Policy','#',1],[lId,'Terms of Use','#',2],[lId,'Cookie Policy','#',3],
    ];
    links.forEach(l => db.query('INSERT INTO footer_links (section_id,label,url,sort_order) VALUES (?,?,?,?)', l, ()=>{}));
    const social = [
        ['Facebook','fb','https://facebook.com',1],['Instagram','ig','https://instagram.com',2],
        ['Twitter (X)','tw','https://x.com',3],['WhatsApp','wa','https://wa.me',4],
    ];
    social.forEach(s => db.query('INSERT INTO footer_social (platform,icon,url,sort_order) VALUES (?,?,?,?)', s, ()=>{}));
    const settings = [
        ['copyright_text','© 2026 OpenMarket. All rights reserved.'],
        ['country','India'],['language','English'],
    ];
    settings.forEach(s => db.query('INSERT IGNORE INTO footer_settings (setting_key,setting_value) VALUES (?,?)', s, ()=>{}));
    console.log('✅ Footer data seeded');
}

const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// --- AUTH ---
// ── OTP STORE (in-memory, expires in 10 min) ─────────────────────
const otpStore = new Map();
function generateOTP() { return Math.floor(100000 + Math.random() * 900000).toString(); }
function otpEmailHtml(otp, type) {
    const heading = type === 'reset' ? 'Reset Your Password' : 'Verify Your Email';
    const sub     = type === 'reset' ? 'Use this code to reset your OpenMarket password.' : 'Use this code to complete your OpenMarket registration.';
    return `<div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;padding:24px;border:1px solid #eee;border-radius:12px">
      <div style="text-align:center;margin-bottom:20px">
        <span style="background:#002f34;color:#ffce32;font-weight:900;font-size:18px;padding:6px 14px;border-radius:6px">Open</span>
        <span style="font-weight:900;font-size:18px;margin-left:4px">Market</span>
      </div>
      <h2 style="color:#002f34;margin:0 0 8px">${heading}</h2>
      <p style="color:#666;margin:0 0 24px">${sub}</p>
      <div style="background:#f5f5f5;border-radius:10px;padding:24px;text-align:center;letter-spacing:10px;font-size:36px;font-weight:900;color:#002f34;margin-bottom:24px">${otp}</div>
      <p style="color:#aaa;font-size:13px;text-align:center">This code expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
    </div>`;
}

// POST /api/auth/send-otp
app.post('/api/auth/send-otp', (req, res) => {
    const { email, type } = req.body;
    if (!email || !type) return res.status(400).json({ error: 'Email and type required' });

    const checkEmail = (cb) => {
        db.query('SELECT id FROM users WHERE email = ?', [email], (err, rows) => {
            if (err) return res.status(500).json({ error: 'Server error' });
            cb(rows);
        });
    };

    const sendOtp = () => {
        const otp = generateOTP();
        otpStore.set(email, { otp, type, expires: Date.now() + 10 * 60 * 1000 });
        const subject = type === 'reset' ? 'Reset Password – OpenMarket' : 'Verify Email – OpenMarket';
        sendEmail(email, subject, otpEmailHtml(otp, type));
        console.log(`[OTP] ${email} → ${otp}`); // fallback log
        res.json({ success: true });
    };

    if (type === 'register') {
        checkEmail(rows => {
            if (rows.length > 0) return res.status(409).json({ error: 'Email already registered' });
            sendOtp();
        });
    } else if (type === 'reset') {
        checkEmail(rows => {
            if (rows.length === 0) return res.status(404).json({ error: 'No account found with this email' });
            sendOtp();
        });
    } else {
        res.status(400).json({ error: 'Invalid type' });
    }
});

// POST /api/auth/verify-otp
app.post('/api/auth/verify-otp', (req, res) => {
    const { email, otp } = req.body;
    const stored = otpStore.get(email);
    if (!stored)               return res.status(400).json({ error: 'OTP not found. Please request a new one.' });
    if (Date.now() > stored.expires) { otpStore.delete(email); return res.status(400).json({ error: 'OTP expired. Please request a new one.' }); }
    if (stored.otp !== otp)    return res.status(400).json({ error: 'Incorrect OTP. Please try again.' });
    res.json({ success: true, type: stored.type });
});

// POST /api/auth/reset-password
app.post('/api/auth/reset-password', (req, res) => {
    const { email, otp, newPassword } = req.body;
    const stored = otpStore.get(email);
    if (!stored || stored.otp !== otp || Date.now() > stored.expires)
        return res.status(400).json({ error: 'Invalid or expired OTP' });
    db.query('UPDATE users SET password = ? WHERE email = ?', [newPassword, email], (err) => {
        if (err) return res.status(500).json({ error: 'Failed to reset password' });
        otpStore.delete(email);
        res.json({ success: true });
    });
});

app.post('/api/signup', (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) return res.status(400).json({ error: "All fields are required" });
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, password, role || 'user'], (err) => {
        if (err) {
            if (err.code === 'ER_DUP_ENTRY') return res.status(409).json({ error: "Email already registered" });
            console.error("Signup DB error:", err.message);
            return res.status(500).json({ error: "Server error. Please try again." });
        }
        res.json({ message: "Success" });
    });
});

app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    db.query("SELECT * FROM users WHERE email = ? AND password = ?", [email, password], (err, result) => {
        if (err || result.length === 0) return res.status(401).json({ error: "Fail" });
        res.json(result[0]);
    });
});

// --- PRODUCT POSTING (CRITICAL FIXES HERE) ---
app.post('/api/products/add', upload.array('images', 12), (req, res) => {
    const { seller_id, title, description, price, location, category } = req.body;
    
    // Check if seller_id is actually coming through
    if (!seller_id) {
        console.error("❌ Error: Received null seller_id");
        return res.status(400).json({ error: "Missing seller_id" });
    }

    const images_json = JSON.stringify(req.files.map(f => `/uploads/${f.filename}`));
    const sql = "INSERT INTO products (seller_id, title, description, price, location, category, image_url) VALUES (?, ?, ?, ?, ?, ?, ?)";
    
    db.query(sql, [seller_id, title, description, price, location, category, images_json], (err, result) => {
        if (err) {
            console.error("❌ SQL INSERT ERROR:", err.message); // THIS PRINT THE REAL PROBLEM IN CMD
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.json({ message: "Ad Posted" });
    });
});

app.get('/api/products/approved', (req, res) => {
    const sql = `
        SELECT p.*,
               u.name AS seller_name,
               u.created_at AS seller_since,
               (SELECT COUNT(*) FROM products p2 WHERE p2.seller_id = p.seller_id AND p2.is_approved = 1) AS seller_ad_count
        FROM products p
        LEFT JOIN users u ON p.seller_id = u.id
        WHERE p.is_approved = 1
        ORDER BY p.created_at DESC`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.get('/api/products/user/:id', (req, res) => {
    db.query("SELECT * FROM products WHERE seller_id = ? ORDER BY created_at DESC", [req.params.id], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.delete('/api/products/delete/:id', (req, res) => {
    db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.put('/api/products/update/:id', upload.array('newImages', 12), (req, res) => {
    const { title, description, price, location, category, keepImages } = req.body;
    console.log('PUT /api/products/update/' + req.params.id, { title, price, keepImages });

    let imageArray = [];
    try { imageArray = JSON.parse(keepImages || '[]'); } catch(e) {}
    if (req.files && req.files.length > 0) {
        req.files.forEach(f => imageArray.push('/uploads/' + f.filename));
    }

    db.query(
        "UPDATE products SET title=?, description=?, price=?, location=?, category=?, image_url=?, is_approved=0 WHERE id=?",
        [title || '', description || '', price || 0, location || '', category || '', JSON.stringify(imageArray), req.params.id],
        (err) => {
            if (err) { console.error('DB update error:', err.message); return res.status(500).json({ error: err.message }); }
            res.json({ success: true });
        }
    );
});

// --- ADMIN ---
app.get('/api/admin/stats', (req, res) => {
    const queries = [
        "SELECT COUNT(*) AS total FROM users WHERE role != 'admin'",
        "SELECT COUNT(*) AS total FROM products",
        "SELECT COUNT(*) AS total FROM products WHERE is_approved = 0",
        "SELECT COUNT(*) AS total FROM products WHERE is_approved = 1",
        "SELECT COUNT(*) AS total FROM messages",
    ];
    Promise.all(queries.map(q => new Promise((resolve, reject) => {
        db.query(q, (err, r) => err ? reject(err) : resolve(r[0].total));
    }))).then(([users, products, pending, approved, messages]) => {
        res.json({ users, products, pending, approved, messages });
    }).catch(err => res.status(500).json(err));
});

app.get('/api/admin/pending', (req, res) => {
    const sql = `SELECT p.*, u.name AS seller_name FROM products p
                 LEFT JOIN users u ON p.seller_id = u.id
                 WHERE p.is_approved = 0 ORDER BY p.created_at DESC`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.get('/api/admin/all-products', (req, res) => {
    const sql = `SELECT p.*, u.name AS seller_name FROM products p
                 LEFT JOIN users u ON p.seller_id = u.id
                 ORDER BY p.created_at DESC`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.post('/api/admin/approve', (req, res) => {
    db.query(
        `SELECT p.id, p.title, p.seller_id, u.email, u.name
         FROM products p JOIN users u ON u.id = p.seller_id WHERE p.id = ?`,
        [req.body.id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            const product = rows[0];

            db.query("UPDATE products SET is_approved = 1 WHERE id = ?", [req.body.id], (err2) => {
                if (err2) return res.status(500).json(err2);

                if (product) {
                    const notifTitle = product.title;
                    const notifMsg   = `Your ad has been approved by the OpenMarket Team and is now LIVE on the marketplace. Buyers can now see and contact you about it.`;

                    sendNotification(product.seller_id, notifTitle, notifMsg);

                    sendEmail(product.email, '✅ Your Ad is Approved & Live on OpenMarket!', `
                        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
                            <div style="background:#002f34;padding:24px;text-align:center;">
                                <h1 style="color:#ffce32;margin:0;font-size:26px;">OpenMarket</h1>
                                <p style="color:#cde;margin:6px 0 0;font-size:14px;">Your trusted marketplace</p>
                            </div>
                            <div style="padding:32px;">
                                <h2 style="color:#002f34;margin-top:0;">🎉 Your Ad is Live!</h2>
                                <p style="color:#444;font-size:15px;">Hi <strong>${product.name}</strong>,</p>
                                <p style="color:#444;font-size:15px;">Your ad has been <strong style="color:#27ae60;">approved</strong> by the OpenMarket Team and is now visible to buyers!</p>
                                <div style="background:#f0f9f4;border:1px solid #a8e6c8;border-radius:8px;padding:16px 20px;margin:20px 0;">
                                    <p style="margin:0;font-size:15px;color:#002f34;font-weight:bold;">📦 ${product.title}</p>
                                </div>
                                <p style="color:#444;font-size:14px;">Buyers can now search for your product and contact you directly through the platform.</p>
                                <p style="color:#888;font-size:13px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
                                    If you have any questions, contact us at <a href="mailto:support@openmarket.in" style="color:#3a7bd5;">support@openmarket.in</a><br/>
                                    — The OpenMarket Team
                                </p>
                            </div>
                        </div>
                    `);
                }
                res.json({ success: true });
            });
        }
    );
});

app.put('/api/admin/product/:id', (req, res) => {
    const { title, description, price, category, location, is_approved } = req.body;
    const sql = `UPDATE products SET title=?, description=?, price=?, category=?, location=?, is_approved=? WHERE id=?`;
    db.query(sql, [title, description, price, category, location, is_approved, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.delete('/api/admin/product/:id', (req, res) => {
    db.query(
        `SELECT p.id, p.title, p.seller_id, u.email, u.name
         FROM products p JOIN users u ON u.id = p.seller_id WHERE p.id = ?`,
        [req.params.id],
        (err, rows) => {
            if (err) return res.status(500).json(err);
            const product = rows[0];

            db.query("DELETE FROM products WHERE id = ?", [req.params.id], (err2) => {
                if (err2) return res.status(500).json(err2);

                if (product) {
                    const notifMsg = `Your ad has been removed by the OpenMarket Team. If you have any questions or concerns, please contact us at support@openmarket.in`;
                    sendNotification(product.seller_id, product.title, notifMsg);

                    sendEmail(product.email, '❌ Your Ad Was Removed from OpenMarket', `
                        <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #e0e0e0;border-radius:10px;overflow:hidden;">
                            <div style="background:#002f34;padding:24px;text-align:center;">
                                <h1 style="color:#ffce32;margin:0;font-size:26px;">OpenMarket</h1>
                                <p style="color:#cde;margin:6px 0 0;font-size:14px;">Your trusted marketplace</p>
                            </div>
                            <div style="padding:32px;">
                                <h2 style="color:#c0392b;margin-top:0;">❌ Ad Removed</h2>
                                <p style="color:#444;font-size:15px;">Hi <strong>${product.name}</strong>,</p>
                                <p style="color:#444;font-size:15px;">Your following ad has been <strong style="color:#e74c3c;">removed</strong> from the OpenMarket platform by our moderation team:</p>
                                <div style="background:#fff5f5;border:1px solid #f5c6cb;border-radius:8px;padding:16px 20px;margin:20px 0;">
                                    <p style="margin:0;font-size:15px;color:#c0392b;font-weight:bold;">📦 ${product.title}</p>
                                </div>
                                <p style="color:#444;font-size:14px;">This may have been due to a violation of our listing policies. If you believe this was a mistake or have any questions, please reach out to our support team.</p>
                                <a href="mailto:support@openmarket.in" style="display:inline-block;margin-top:10px;padding:12px 24px;background:#002f34;color:#ffce32;border-radius:8px;text-decoration:none;font-weight:bold;">Contact Support</a>
                                <p style="color:#888;font-size:13px;margin-top:32px;border-top:1px solid #eee;padding-top:16px;">
                                    Email: <a href="mailto:support@openmarket.in" style="color:#3a7bd5;">support@openmarket.in</a><br/>
                                    — The OpenMarket Team
                                </p>
                            </div>
                        </div>
                    `);
                }
                res.json({ success: true });
            });
        }
    );
});

app.get('/api/admin/users', (req, res) => {
    const sql = `SELECT u.id, u.name, u.email, u.role, u.created_at,
                 COUNT(p.id) AS ad_count
                 FROM users u LEFT JOIN products p ON p.seller_id = u.id
                 WHERE u.role != 'admin'
                 GROUP BY u.id ORDER BY u.created_at DESC`;
    db.query(sql, (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.put('/api/admin/user/:id', (req, res) => {
    const { name, email, role } = req.body;
    db.query("UPDATE users SET name=?, email=?, role=? WHERE id=? AND role != 'admin'",
        [name, email, role, req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.delete('/api/admin/user/:id', (req, res) => {
    db.query("DELETE FROM users WHERE id = ? AND role != 'admin'", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// --- MEDIA UPLOAD (CHAT) ---
app.post('/api/messages/upload', upload.single('chatFile'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
    const { product_id, sender_id, receiver_id, message_type } = req.body;
    const file_url = `/uploads/${req.file.filename}`;
    const sql = "INSERT INTO messages (product_id, sender_id, receiver_id, file_url, message_type) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [product_id, sender_id, receiver_id, file_url, message_type || 'audio'], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ url: file_url });
    });
});

// --- CHAT SYSTEM ---
app.delete('/api/messages/delete-chat', (req, res) => {
    const { product_id, user1_id, user2_id } = req.body;
    const sql = `DELETE FROM messages WHERE product_id = ? AND ((sender_id = ? AND receiver_id = ?) OR (sender_id = ? AND receiver_id = ?))`;
    db.query(sql, [product_id, user1_id, user2_id, user2_id, user1_id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.post('/api/messages/send', (req, res) => {
    const { product_id, sender_id, receiver_id, message_text } = req.body;
    const sql = "INSERT INTO messages (product_id, sender_id, receiver_id, message_text, message_type) VALUES (?, ?, ?, ?, 'text')";
    db.query(sql, [product_id, sender_id, receiver_id, message_text], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.get('/api/messages/:productId/:user1/:user2', (req, res) => {
    const { productId, user1, user2 } = req.params;
    // Mark messages sent to user1 as read
    db.query(
        `UPDATE messages SET is_read=1 WHERE product_id=? AND sender_id=? AND receiver_id=? AND is_read=0`,
        [productId, user2, user1], () => {}
    );
    const sql = `SELECT * FROM messages WHERE product_id = ?
                 AND ((sender_id = ? AND receiver_id = ?)
                 OR (sender_id = ? AND receiver_id = ?))
                 ORDER BY timestamp ASC`;
    db.query(sql, [productId, user1, user2, user2, user1], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

app.get('/api/chats/summary/:userId', (req, res) => {
    const userId = req.params.userId;
    const sql = `
        SELECT DISTINCT p.id, p.title, p.image_url, p.seller_id, p.price, p.location, p.category,
        CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END AS buyer_id,
        u.name AS other_user_name,
        (SELECT message_text FROM messages WHERE product_id = p.id ORDER BY timestamp DESC LIMIT 1) as last_msg,
        (SELECT timestamp FROM messages WHERE product_id = p.id ORDER BY timestamp DESC LIMIT 1) as last_time,
        (SELECT sender_id FROM messages WHERE product_id = p.id ORDER BY timestamp DESC LIMIT 1) as last_sender_id,
        (SELECT COUNT(*) FROM messages WHERE product_id = p.id AND receiver_id = ? AND is_read = 0) as msg_count
        FROM products p
        JOIN messages m ON p.id = m.product_id
        JOIN users u ON u.id = CASE WHEN m.sender_id = ? THEN m.receiver_id ELSE m.sender_id END
        WHERE m.sender_id = ? OR m.receiver_id = ?
    `;
    db.query(sql, [userId, userId, userId, userId, userId], (err, result) => {
        if (err) return res.status(500).json(err);
        res.json(result);
    });
});

// --- NOTIFICATIONS ---
app.get('/api/notifications/:userId', (req, res) => {
    db.query(
        "SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 50",
        [req.params.userId],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.json(result);
        }
    );
});

app.put('/api/notifications/read/:userId', (req, res) => {
    db.query("UPDATE notifications SET is_read=1 WHERE user_id=?", [req.params.userId], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

app.delete('/api/notifications/:id', (req, res) => {
    db.query("DELETE FROM notifications WHERE id=?", [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

// ── FOOTER API ────────────────────────────────────────────────────────
app.get('/api/footer', (req, res) => {
    db.query('SELECT * FROM footer_sections ORDER BY sort_order', (e1, sections) => {
        if (e1) return res.status(500).json(e1);
        db.query('SELECT * FROM footer_links ORDER BY sort_order', (e2, links) => {
            if (e2) return res.status(500).json(e2);
            db.query('SELECT * FROM footer_social ORDER BY sort_order', (e3, social) => {
                if (e3) return res.status(500).json(e3);
                db.query('SELECT * FROM footer_settings', (e4, settRows) => {
                    if (e4) return res.status(500).json(e4);
                    const settings = {};
                    settRows.forEach(r => { settings[r.setting_key] = r.setting_value; });
                    const sectionsWithLinks = sections.map(s => ({ ...s, links: links.filter(l => l.section_id === s.id) }));
                    res.json({ sections: sectionsWithLinks, social, settings });
                });
            });
        });
    });
});

app.post('/api/footer/sections', (req, res) => {
    const { name } = req.body;
    db.query('SELECT IFNULL(MAX(sort_order),0)+1 AS n FROM footer_sections', (e, rows) => {
        if (e) return res.status(500).json(e);
        db.query('INSERT INTO footer_sections (name,sort_order) VALUES (?,?)', [name, rows[0].n], (e2, r) => {
            if (e2) return res.status(500).json(e2);
            res.json({ id: r.insertId, name, is_enabled: 1, sort_order: rows[0].n, links: [] });
        });
    });
});

app.put('/api/footer/sections/:id', (req, res) => {
    db.query('UPDATE footer_sections SET name=? WHERE id=?', [req.body.name, req.params.id], (e) => {
        if (e) return res.status(500).json(e);
        res.json({ success: true });
    });
});

app.delete('/api/footer/sections/:id', (req, res) => {
    db.query('DELETE FROM footer_links WHERE section_id=?', [req.params.id], () => {
        db.query('DELETE FROM footer_sections WHERE id=?', [req.params.id], (e) => {
            if (e) return res.status(500).json(e);
            res.json({ success: true });
        });
    });
});

app.put('/api/footer/sections/:id/toggle', (req, res) => {
    db.query('UPDATE footer_sections SET is_enabled=NOT is_enabled WHERE id=?', [req.params.id], (e) => {
        if (e) return res.status(500).json(e);
        res.json({ success: true });
    });
});

app.post('/api/footer/links', (req, res) => {
    const { section_id, label } = req.body;
    db.query('INSERT INTO footer_links (section_id,label,url,content) VALUES (?,?,?,?)', [section_id, label, '#', ''], (e, r) => {
        if (e) return res.status(500).json(e);
        res.json({ id: r.insertId, section_id, label, content: '', is_enabled: 1 });
    });
});

app.get('/api/footer/links/:id', (req, res) => {
    db.query('SELECT * FROM footer_links WHERE id=?', [req.params.id], (e, rows) => {
        if (e) return res.status(500).json(e);
        if (!rows.length) return res.status(404).json({ error: 'Not found' });
        res.json(rows[0]);
    });
});

app.put('/api/footer/links/:id', (req, res) => {
    const { label, content } = req.body;
    db.query('UPDATE footer_links SET label=?,content=? WHERE id=?', [label, content || '', req.params.id], (e) => {
        if (e) return res.status(500).json(e);
        res.json({ success: true });
    });
});

app.delete('/api/footer/links/:id', (req, res) => {
    db.query('DELETE FROM footer_links WHERE id=?', [req.params.id], (e) => {
        if (e) return res.status(500).json(e);
        res.json({ success: true });
    });
});

app.put('/api/footer/links/:id/toggle', (req, res) => {
    db.query('UPDATE footer_links SET is_enabled=NOT is_enabled WHERE id=?', [req.params.id], (e) => {
        if (e) return res.status(500).json(e);
        res.json({ success: true });
    });
});

app.put('/api/footer/social/:id', (req, res) => {
    const { url, platform } = req.body;
    db.query('UPDATE footer_social SET url=?,platform=? WHERE id=?', [url, platform, req.params.id], (e) => {
        if (e) return res.status(500).json(e);
        res.json({ success: true });
    });
});

app.put('/api/footer/social/:id/toggle', (req, res) => {
    db.query('UPDATE footer_social SET is_enabled=NOT is_enabled WHERE id=?', [req.params.id], (e) => {
        if (e) return res.status(500).json(e);
        res.json({ success: true });
    });
});

app.put('/api/footer/settings', (req, res) => {
    const entries = Object.entries(req.body);
    let done = 0;
    if (entries.length === 0) return res.json({ success: true });
    entries.forEach(([key, value]) => {
        db.query('INSERT INTO footer_settings (setting_key,setting_value) VALUES (?,?) ON DUPLICATE KEY UPDATE setting_value=?',
            [key, value, value], (e) => {
                if (e) console.error('Settings error:', e.message);
                if (++done === entries.length) res.json({ success: true });
            }
        );
    });
});

// Serve React build in production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../client/build')));
    app.get(/^(?!\/api).*$/, (req, res) => {
        res.sendFile(path.join(__dirname, '../client/build', 'index.html'));
    });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server on http://localhost:${PORT}`));