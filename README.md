---
title: OpenMarket
emoji: 🛒
colorFrom: green
colorTo: yellow
sdk: docker
pinned: false
---

# OpenMarket 🛒

A full-stack marketplace application built with React, Node.js, Express, and MySQL. OpenMarket provides a platform for users to buy and sell products locally, with real-time chat, email OTP authentication, an admin dashboard, and a CMS-powered footer.

## Features

- **Buy & Sell Products** — List items for sale or browse listings from local sellers.
- **Real-time Chat** — Messaging between buyers and sellers per product listing.
- **Admin Dashboard** — Manage users, approve/reject listings, and monitor activity.
- **Email OTP Authentication** — Secure registration and password reset via one-time codes.
- **Multi-language Support** — Built-in i18n for a global audience.
- **Dynamic CMS Footer** — Admin-editable footer sections, links, and social icons.
- **Image Uploads** — Multi-image support for product listings via Multer.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Axios |
| Backend | Node.js, Express 5 |
| Database | MySQL |
| File Uploads | Multer |
| Email | Nodemailer (Gmail App Password) |
| Deployment | Docker, Hugging Face Spaces |

## Project Structure

```
OpenMarket_Project/
├── client/             # React frontend (port 3000)
│   ├── public/
│   ├── src/
│   └── package.json
├── server/             # Express backend (port 5000)
│   ├── index.js        # Entry point — all routes defined here
│   ├── uploads/        # Uploaded product images (auto-created)
│   └── package.json
├── open_market.sql     # Full database schema + seed data
├── Dockerfile
└── README.md
```

---

## Running Locally

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MySQL Server](https://dev.mysql.com/downloads/mysql/) running on `localhost:3306`

---

### Step 1 — Set up the Database

1. Start your MySQL server.

2. Create the database:
   ```sql
   CREATE DATABASE open_market;
   ```

3. Import the schema and seed data:
   ```bash
   mysql -u root -p open_market < open_market.sql
   ```
   > Enter your MySQL root password when prompted. This creates all required tables (`users`, `products`, `messages`, etc.) and populates initial data.

---

### Step 2 — Start the Backend

Open a terminal in the project root:

```bash
cd server
npm install
node index.js
```

You should see:
```
🚀 Server on http://localhost:5000
✅ Server & Database Connected Successfully
```

**Environment variables** — create a `server/.env` file (never commit it — it's already git-ignored):

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=open_market
PORT=5000

GMAIL_USER=your-gmail-address@gmail.com
GMAIL_APP_PASSWORD=your-16-char-app-password
```

> `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, and `PORT` are optional — the server falls back to the defaults above if unset. If your MySQL root account has a password, set `DB_PASSWORD` accordingly.
>
> `GMAIL_USER` and `GMAIL_APP_PASSWORD` are **required** for OTP emails (registration/password reset) to send. Generate an App Password at [Google Account → Security → App Passwords](https://myaccount.google.com/apppasswords) (requires 2-Step Verification enabled) — do not use your regular Gmail password.

**Hot reload (development):** Use `npx nodemon index.js` instead of `node index.js` to auto-restart on file changes.

---

### Step 3 — Start the Frontend

Open a **new terminal** in the project root:

```bash
cd client
npm install
npm start
```

The React app will open automatically at **http://localhost:3000**.

> The client is pre-configured to proxy all `/api` requests to `http://localhost:5000`, so both terminals must be running at the same time.

---

### Default Ports

| Service | URL |
|---|---|
| Frontend (React) | http://localhost:3000 |
| Backend (Express) | http://localhost:5000 |

---

## Troubleshooting

**`❌ DB Error: connect ECONNREFUSED`**
MySQL is not running. Start your MySQL service and retry.

**`❌ DB Error: Access denied for user 'root'`**
Your MySQL root account has a password. Add `DB_PASSWORD=yourpassword` to `server/.env`.

**`❌ DB Error: Unknown database 'open_market'`**
The database does not exist yet. Run the `CREATE DATABASE` and import commands from Step 1.

**Port 3000 or 5000 already in use**
Kill the process on that port or set a different port in `server/.env` (`PORT=5001`) and update the `proxy` field in `client/package.json` to match.

**`npm install` fails on client**
Run `npm install --legacy-peer-deps` inside the `client` directory — some React 19 packages have peer dependency conflicts with older tooling.

---

## Docker Deployment

Build and run the full application in a container:

```bash
# Build the image
docker build -t openmarket .

# Run the container (pass DB credentials as env vars)
docker run -p 5000:5000 \
  -e DB_HOST=host.docker.internal \
  -e DB_USER=root \
  -e DB_PASSWORD=yourpassword \
  -e DB_NAME=open_market \
  -e GMAIL_USER=your-gmail-address@gmail.com \
  -e GMAIL_APP_PASSWORD=your-16-char-app-password \
  openmarket
```

> In production/Docker mode the Express server serves the React build from `client/build/`. Run `npm run build` inside `client/` first if the `build/` folder is not present.

---

## License

This project is open-source and available under the ISC License.
