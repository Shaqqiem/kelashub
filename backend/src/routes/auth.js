const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { signToken } = require('../middleware/auth');

const SALT = 10;

// On first user registration, grant ADMIN. Otherwise default STUDENT unless specified by an ADMIN.
router.post('/register', async (req, res) => {
  const { email, name, password } = req.body || {};
  if (!email || !name || !password) return res.status(400).json({ error: 'Missing fields' });
  const hashed = await bcrypt.hash(password, SALT);
  const existing = await req.prisma.user.findUnique({ where: { email }});
  if (existing) return res.status(409).json({ error: 'Email exists' });

  const count = await req.prisma.user.count();
  const role = count === 0 ? 'ADMIN' : 'STUDENT';

  const user = await req.prisma.user.create({
    data: { email, name, password: hashed, role }
  });

  const token = signToken(user);
  res.json({ token, user: { id: user.id, email, name, role } });
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body || {};
  if (!email || !password) return res.status(400).json({ error: 'Missing' });
  const user = await req.prisma.user.findUnique({ where: { email }});
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) return res.status(401).json({ error: 'Invalid credentials' });
  const token = signToken(user);
  res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role }});
});

module.exports = router;
