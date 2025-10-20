const express = require('express');
const request = require('supertest');
const jwt = require('jsonwebtoken');

// Build a minimal app using in-memory fakes for Prisma
process.env.JWT_SECRET = 'test_secret';
process.env.QR_TTL_SECONDS = '60';
process.env.USE_FAKE_DB = '1';

const { signToken, signQRToken, requireAuth } = require('../middleware/auth');

function fakePrisma() {
  const data = {
    users: [],
    classes: [],
    sessions: [],
    enrollments: [],
    attendance: []
  };
  return {
    user: {
      findUnique: async ({ where: { email }}) => data.users.find(u => u.email === email) || null,
      count: async () => data.users.length,
      create: async ({ data: d }) => { data.users.push(d); return d; }
    },
    class: {
      create: async ({ data: d }) => { data.classes.push(d); return d; },
      findMany: async () => data.classes
    },
    session: {
      create: async ({ data: d }) => { data.sessions.push(d); return d; },
      findUnique: async ({ where: { id }}) => data.sessions.find(s => s.id === id) || null
    },
    enrollment: {
      create: async ({ data: d }) => { data.enrollments.push(d); return d; },
      findFirst: async ({ where: { classId, userId }}) => data.enrollments.find(e => e.classId === classId && e.userId === userId) || null
    },
    attendance: {
      create: async ({ data: d }) => {
        if (data.attendance.find(a => a.sessionId === d.sessionId && a.userId === d.userId)) throw new Error('dup');
        data.attendance.push(d); return d;
      }
    }
  };
}

function buildApp() {
  const app = express();
  app.use(express.json());
  app.use((req,_res,next)=>{ req.prisma = fakePrisma(); next(); });

  // minimal routes to test login/scan
  app.post('/auth/login', (req,res) => {
    const user = { id: 'u1', email: req.body.email, name: 'Test User', role: 'STUDENT', password: '' };
    req.prisma.user.create({ data: user });
    const tok = signToken(user, 3600);
    res.json({ token: tok, user });
  });

  app.post('/attendance/scan', requireAuth, async (req,res) => {
    const ver = require('../middleware/auth').verifyQRToken(req.body.token);
    if (!ver.ok) return res.status(400).json({ error: 'Invalid' });
    const s = { id: ver.sid, classId: 'c1', title: 'T', startsAt: new Date(), endsAt: new Date() };
    await req.prisma.session.create({ data: s });
    await req.prisma.enrollment.create({ data: { id:'e1', classId:'c1', userId: req.user.id }});
    try {
      const a = await req.prisma.attendance.create({ data: { id:'a1', sessionId: s.id, userId: req.user.id }});
      return res.json({ status: 'ok', attendance: a });
    } catch {
      return res.json({ status: 'ok', message: 'Already marked' });
    }
  });

  return app;
}

test('login + scan attendance', async () => {
  const app = buildApp();
  const login = await request(app).post('/auth/login').send({ email: 't@e.st', password: 'x' });
  const token = login.body.token;
  const qr = signQRToken('sess1', 60);

  const r = await request(app).post('/attendance/scan')
    .set('Authorization', 'Bearer ' + token)
    .send({ token: qr });

  expect(r.status).toBe(200);
  expect(r.body.status).toBe('ok');
});
