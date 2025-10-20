require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const path = require('path');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

const app = express();

// CORS
const origins = (process.env.CORS_ORIGINS || '').split(',').map(s => s.trim()).filter(Boolean);
app.use(cors({
  origin: function (origin, cb) {
    if (!origin) return cb(null, true); // allow curl/postman
    if (origins.includes(origin)) return cb(null, true);
    cb(new Error('CORS not allowed'));
  },
  credentials: true
}));

app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));
app.use(morgan('tiny'));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// attach prisma per-request
app.use((req, _res, next) => { req.prisma = prisma; next(); });

// rate limiters
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, standardHeaders: true });
const scanLimiter = rateLimit({ windowMs: 60 * 1000, max: 60, standardHeaders: true });

// static files (uploads)
const FILE_ROOT = process.env.FILE_STORAGE_ROOT || '/files';
app.use('/files', express.static(FILE_ROOT, { maxAge: '7d', etag: true }));

// routes
app.use('/auth', authLimiter, require('./routes/auth'));
app.use('/classes', require('./routes/classes'));
app.use('/sessions', require('./routes/sessions'));
app.use('/attendance', scanLimiter, require('./routes/attendance'));
app.use('/files', require('./routes/files'));
app.use('/analytics', require('./routes/analytics'));
app.use('/push', require('./routes/push'));

// health
app.get('/health', (_req, res) => res.json({ ok: true, time: new Date().toISOString() }));

// worker
if ((process.env.ENABLE_REMINDERS || '1') === '1') {
  require('./worker/reminders').start(prisma);
}

// start
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`API listening on ${PORT}`);
});
