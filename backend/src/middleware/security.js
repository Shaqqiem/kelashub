const path = require('path');
const mime = require('mime-types');

function sanitizeFilename(name) {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 128);
}

function validateMimetype(mimetype) {
  const allowed = (process.env.ALLOWED_MIME || '').split(',').map(s => s.trim()).filter(Boolean);
  if (allowed.length === 0) return true;
  return allowed.includes(mimetype);
}

function safeJoin(root, filename) {
  const p = path.join(root, filename);
  if (!p.startsWith(path.resolve(root))) throw new Error('Path traversal');
  return p;
}

module.exports = { sanitizeFilename, validateMimetype, safeJoin };
