const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');

// Simple analytics endpoints
router.get('/overview', requireAuth, requireRole('LECTURER', 'ADMIN'), async (req, res) => {
  const [users, classes, sessions, attendances] = await Promise.all([
    req.prisma.user.count(),
    req.prisma.class.count(),
    req.prisma.session.count(),
    req.prisma.attendance.count()
  ]);
  res.json({ users, classes, sessions, attendances });
});

router.get('/class/:id/attendance-rate', requireAuth, async (req, res) => {
  const id = req.params.id;
  const sessions = await req.prisma.session.findMany({ where: { classId: id }, select: { id: true }});
  if (sessions.length === 0) return res.json({ rates: [] });
  const sessionIds = sessions.map(s => s.id);
  const counts = await req.prisma.attendance.groupBy({
    by: ['sessionId'],
    where: { sessionId: { in: sessionIds } },
    _count: { _all: true }
  });
  res.json({ rates: counts });
});

module.exports = router;
