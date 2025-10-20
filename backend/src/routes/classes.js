const router = require('express').Router();
const { requireAuth, requireRole } = require('../middleware/auth');

// Create class (LECTURER/ADMIN)
router.post('/', requireAuth, requireRole('LECTURER', 'ADMIN'), async (req, res) => {
  const { title, code } = req.body || {};
  if (!title || !code) return res.status(400).json({ error: 'Missing fields' });
  const cls = await req.prisma.class.create({
    data: { title, code, ownerId: req.user.id }
  });
  res.json(cls);
});

// List classes (paginate)
router.get('/', requireAuth, async (req, res) => {
  const take = Math.min(parseInt(req.query.take || '20'), 100);
  const skip = parseInt(req.query.skip || '0');
  const classes = await req.prisma.class.findMany({
    skip, take,
    include: { owner: true, enrollments: { include: { user: true } } },
    orderBy: { createdAt: 'desc' }
  });
  res.json(classes);
});

// Enroll (student self-enroll)
router.post('/:id/enroll', requireAuth, async (req, res) => {
  const classId = req.params.id;
  try {
    const enr = await req.prisma.enrollment.create({
      data: { classId, userId: req.user.id }
    });
    res.json(enr);
  } catch (e) {
    res.status(400).json({ error: 'Already enrolled or invalid' });
  }
});

module.exports = router;
