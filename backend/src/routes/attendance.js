const router = require('express').Router();
const { requireAuth, verifyQRToken } = require('../middleware/auth');

// Scan attendance using QR token
router.post('/scan', requireAuth, async (req, res) => {
  const { token } = req.body || {};
  if (!token) return res.status(400).json({ error: 'Missing token' });
  const ver = verifyQRToken(token);
  if (!ver.ok) return res.status(400).json({ error: 'Invalid or expired QR' });

  const sid = ver.sid;
  // ensure enrollment
  const session = await req.prisma.session.findUnique({ where: { id: sid }, include: { class: true }});
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const enr = await req.prisma.enrollment.findFirst({ where: { classId: session.classId, userId: req.user.id }});
  if (!enr) return res.status(403).json({ error: 'Not enrolled in class' });

  // mark attendance (idempotent)
  try {
    const att = await req.prisma.attendance.create({
      data: { sessionId: sid, userId: req.user.id }
    });
    return res.json({ status: 'ok', attendance: att });
  } catch {
    return res.json({ status: 'ok', message: 'Already marked' });
  }
});

module.exports = router;
