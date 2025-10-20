const jwt = require('jsonwebtoken');

function requireAuth(req, res, next) {
  const hdr = req.headers.authorization || '';
  const token = hdr.startsWith('Bearer ') ? hdr.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Missing token' });
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: 'Forbidden' });
    return next();
  };
}

function signToken(user, ttlSeconds = parseInt(process.env.TOKEN_TTL_SECONDS || '86400')) {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: ttlSeconds });
}

function signQRToken(sessionId, ttlSeconds = parseInt(process.env.QR_TTL_SECONDS || '120')) {
  return jwt.sign({ type: 'qr', sid: sessionId }, process.env.JWT_SECRET, { expiresIn: ttlSeconds });
}

function verifyQRToken(token) {
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (payload.type !== 'qr') throw new Error('not qr');
    return { ok: true, sid: payload.sid };
  } catch (e) {
    return { ok: false, error: e.message || 'invalid' };
  }
}

module.exports = { requireAuth, requireRole, signToken, signQRToken, verifyQRToken };
