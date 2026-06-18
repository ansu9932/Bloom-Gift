# 🌸 BloomGift

A full-stack **digital flower gifting platform**. Compose a multi-step animated gift
(bouquet → lock → intro → card → notebook → letter → reveal), share a private link, and
the recipient unlocks a beautiful animated experience — no app required.

> Send flowers that last forever.

---

## ✨ Features

- **Gift sequence composer** — a two-panel builder: a vertical timeline of steps + a
  per-step configuration panel.
- **Surface picker** — 18 cards, 9 scratchbook notebooks, 12 misc screens, plus lock /
  intro / bouquet essentials.
- **Bouquet composer** — drag, scale, rotate, flip, layer, undo/redo across 100+ flowers.
- **Animated recipient experience** — PIN lock screen, canvas petal-burst intro, starfield
  cards, a spinning 3D letter globe, envelope letter reveal, and a bouquet bloom-in.
- **URL-encoded gifts** — an entire gift can live in the link as URL-safe base64 (no DB
  needed for basic gifts). Saved gifts get a permanent slug.
- **Auth** — JWT + bcrypt, with free vs. blooming plan gating.
- **Media** — photo/video uploads, Spotify & YouTube music embeds, scratch-reveal toggle.
- **Share** — copy link, QR code, WhatsApp, email.

> Procedural SVG flowers render in-app, so the platform works out of the box without any
> image assets. Drop real illustrations into `client/public/flowers/` (named to match
> `client/src/data/flowers.js`) to upgrade the visuals later.

---

## 🧱 Tech stack

| Layer    | Tech                                                   |
| -------- | ------------------------------------------------------ |
| Frontend | React 18 · Vite · TailwindCSS · Framer Motion · axios  |
| Backend  | Node.js · Express · JWT · bcrypt · multer              |
| Database | MySQL 8 (mysql2)                                       |
| Hosting  | Hostinger VPS (Ubuntu) + Nginx + PM2, or shared + MySQL |

---

## 📁 Structure

```
Bloom-Gift/
├── client/            # React + Vite frontend
│   ├── public/        # favicon + flowers/ (optional image assets)
│   └── src/
│       ├── components/ (bouquet/ compose/ preview/ flowers/ ui/ layout/)
│       ├── data/       (flowers.js, surfaces.js, themes.js)
│       ├── hooks/      (useGiftBuilder, useBouquet)
│       ├── lib/        (api.js, AuthContext.jsx)
│       ├── pages/
│       └── utils/      (encode.js, animations.js)
├── server/            # Express API
│   ├── routes/  models/  middleware/  scripts/  uploads/
│   └── index.js  db.js
├── database/
│   └── schema.sql
└── README.md
```

---

## 🚀 Local development

### Prerequisites
- Node.js 18+ (20 recommended)
- A MySQL 8 server

### 1. Database

```bash
mysql -u root -p < database/schema.sql
# creates database `bloomgift_db` and all tables
```

### 2. Backend

```bash
cd server
cp .env.example .env        # then edit DB creds + JWT_SECRET
npm install
npm run init-db             # optional: runs schema.sql via Node
npm run dev                 # http://localhost:3001  (health: /api/health)
```

### 3. Frontend

```bash
cd client
cp .env.example .env        # defaults point at the local API
npm install
npm run dev                 # http://localhost:5173
```

Vite proxies `/api` and `/uploads` to `http://localhost:3001` in dev, so no CORS setup is
needed locally.

---

## 🔌 API overview

| Method | Endpoint                 | Notes                                  |
| ------ | ------------------------ | -------------------------------------- |
| POST   | `/api/auth/register`     | `{username,email,password}` → token    |
| POST   | `/api/auth/login`        | `{email,password}` → token             |
| GET    | `/api/auth/me`           | Bearer token → current user            |
| POST   | `/api/auth/upgrade`      | `{plan}` → switch free/blooming        |
| POST   | `/api/gifts`             | create gift (optional auth)            |
| GET    | `/api/gifts/mine`        | list my gifts (auth)                   |
| GET    | `/api/gifts/:slug`       | public fetch by slug                   |
| DELETE | `/api/gifts/:id`         | owner only                             |
| POST   | `/api/bouquets`          | save a bouquet                         |
| GET    | `/api/bouquets/:id`      | fetch a bouquet                        |
| POST   | `/api/upload`            | multipart, field `files` (max 43)      |

Plan limits are enforced server-side: **free** = 2 steps / 1 bloom, **blooming** = 30 steps
/ 12 blooms.

---

## 🌐 Deploy to Hostinger (VPS)

```bash
# On an Ubuntu 22.04 VPS
apt update && apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -y nodejs
apt install -y mysql-server nginx
npm install -g pm2

# DB
mysql -u root -p < /var/www/Bloom-Gift/database/schema.sql

# Backend
cd /var/www/Bloom-Gift/server
cp .env.example .env   # set NODE_ENV=production, DB creds, JWT_SECRET, CLIENT_ORIGIN
npm install --omit=dev
pm2 start index.js --name bloomgift-api && pm2 save && pm2 startup

# Frontend
cd /var/www/Bloom-Gift/client
cp .env.example .env.production   # set VITE_API_URL=https://api.yourdomain.com
npm install && npm run build      # output: client/dist
```

### Nginx (sketch)

```nginx
server {                      # frontend
  listen 80;
  server_name yourdomain.com www.yourdomain.com;
  root /var/www/Bloom-Gift/client/dist;
  location / { try_files $uri $uri/ /index.html; }
}
server {                      # api
  listen 80;
  server_name api.yourdomain.com;
  client_max_body_size 60M;
  location / { proxy_pass http://localhost:3001; proxy_set_header Host $host; }
  location /uploads/ { alias /var/www/Bloom-Gift/server/uploads/; }
}
```

```bash
ln -s /etc/nginx/sites-available/bloomgift /etc/nginx/sites-enabled/
nginx -t && systemctl reload nginx
certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

Point DNS A-records (`@`, `www`, `api`) at the VPS IP in the Hostinger hPanel.

---

## 🧪 Notes & status

- The procedural SVG flower renderer means **no external assets are required** to run.
- Music autoplay is constrained by browser policies; the player exposes a manual toggle.
- The codebase was authored and statically validated (syntax + import resolution). Run
  `npm install` in `client/` and `server/` to pull dependencies before first start.

---

*Built with ❤️ · BloomGift · A digital flower gifting platform · All code is original.*
