# KelasHub v3 — Production Repo

**Frontend**: React + Vite + Tailwind on GitHub Pages  
**Backend**: Node 20 + Express + Prisma + Postgres in Docker (Synology Xpenology)  
**Reverse Proxy**: Default **Synology Reverse Proxy**, optional **Nginx container**  
**Features**: JWT auth + roles, QR attendance (TTL), file uploads, analytics, web push (VAPID), reminder worker, rate limiting, CORS whitelist, pagination, indices.

---
## ⚙️ Project Structure

```bash

kelashub/
├─ docker-compose.yml
├─ README.md
├─ ops/
│ └─ nginx/
│ ├─ nginx.conf
│ └─ certs/ # optional if terminating TLS here
├─ backend/
│ ├─ Dockerfile
│ ├─ package.json
│ ├─ .env.example
│ ├─ prisma/
│ │ └─ schema.prisma
│ └─ src/
│ ├─ index.js
│ ├─ routes/ # auth, classes, sessions, attendance, files, analytics, push
│ ├─ middleware/ # auth, security
│ ├─ services/ # mailer
│ ├─ worker/ # reminders
│ └─ tests/ # minimal unit/integration tests
└─ frontend/
├─ Dockerfile
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
├─ postcss.config.js
├─ public/
│ ├─ index.html
│ └─ sw.js
└─ src/
├─ main.jsx
├─ index.css
├─ App.jsx
├─ contexts/AuthContext.jsx
├─ services/api.js
├─ components/Header.jsx
└─ pages/ (Login, Dashboard, Classes, SessionDetail, QRScanner, Assignments, NotFound)

