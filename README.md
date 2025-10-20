# KelasHub v3 — Production Repo

**Frontend**: React + Vite + Tailwind on GitHub Pages  
**Backend**: Node 20 + Express + Prisma + Postgres in Docker (Synology Xpenology)  
**Reverse Proxy**: Default **Synology Reverse Proxy**, optional **Nginx container**  
**Features**: JWT auth + roles, QR attendance (TTL), file uploads, analytics, web push (VAPID), reminder worker, rate limiting, CORS whitelist, pagination, indices.

---

## 0) Repository Structure
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


---

## 1) Paste & Run — End-to-End Deployment

> **Goal**: Live frontend on GitHub Pages calling your NAS API over HTTPS at `https://api.kelashub.my`.

### A. Create the GitHub repo and push
```bash
# On your machine
mkdir kelashub && cd kelashub
# paste all files exactly as in this README answer (preserve paths)
git init
git branch -m main
git remote add origin git@github.com:<your-username>/kelashub-v3.git
git add .
git commit -m "KelasHub v3 initial"
git push -u origin main
