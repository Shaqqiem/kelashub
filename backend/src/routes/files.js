const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const { requireAuth } = require('../middleware/auth');
const { sanitizeFilename, validateMimetype } = require('../middleware/security');

const FILE_ROOT = process.env.FILE_STORAGE_ROOT || '/files';
const maxMB = parseInt(process.env.MAX_FILE_SIZE_MB || '20');

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, FILE_ROOT),
  filename: (_req, file, cb) => cb(null, Date.now() + '_' + sanitizeFilename(file.originalname))
});

const upload = multer({
  storage,
  limits: { fileSize: maxMB * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    if (!validateMimetype(file.mimetype)) return cb(new Error('Invalid file type'));
    cb(null, true);
  }
});

router.post('/upload', requireAuth, upload.single('file'), async (req, res) => {
  const { classId } = req.body || {};
  if (!classId) return res.status(400).json({ error: 'Missing classId' });
  if (!req.file) return res.status(400).json({ error: 'No file' });

  const sub = await req.prisma.submission.create({
    data: {
      classId,
      userId: req.user.id,
      filename: req.file.originalname,
      mimetype: req.file.mimetype,
      path: '/files/' + path.basename(req.file.path)
    }
  });
  res.json({ status: 'ok', submission: sub });
});

module.exports = router;
