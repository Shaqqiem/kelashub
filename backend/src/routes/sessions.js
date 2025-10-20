const router = require('express').Router();
const { requireAuth, requireRole, signQRToken } = require('../middleware/auth');
const QRCode = require('qrcode');

// Create session
router.post('/', requireAuth, requireRole('LECTURER', 'ADMIN'), async (req, res) => {
  const { classId, title, startsAt, endsAt } = req.body || {};
  if (!classId || !title || !startsAt || !endsAt) return res.status(400).json({ error: 'Missing fields' });
  const s = await req.prisma.session.create({ data: { classId, title, startsAt: new Date(startsAt), endsAt: new Date(endsAt) }});
  res.json(s);
});

// List sessions by class (paginate)
router.get('/', requireAuth, async (req, res) => {
  const { classId } = req.query;
  const where = classId ? { classId } : {};
  const take = Math.min(parseInt(req.query.take || '20'), 100);
  const skip = parseInt(req.query.skip || '0');
  const list = await req.prisma.session.findMany({
    where, skip, take, orderBy: { startsAt: 'desc' }
  });
  res.json(list);
});

// Generate QR token & PNG data URL
router.get('/:id/qr', requireAuth, requireRole('LECTURER', 'ADMIN'), async (req, res) => {
  const sessionId = req.params.id;
  const token = signQRToken(sessionId);
  const data = await QRCode.toDataURL(token);
  res.json({ token, dataUrl: data, ttl: parseInt(process.env.QR_TTL_SECONDS || '120') });
});

module.exports = router;
