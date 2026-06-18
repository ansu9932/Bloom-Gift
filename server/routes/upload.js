const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const { optionalAuth } = require('../middleware/auth');

const router = express.Router();

const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');
const MAX_FILE_SIZE = Number(process.env.MAX_FILE_SIZE) || 52428800; // 50 MB

// Route each file type into its own subfolder.
const SUBDIRS = { photo: 'photos', video: 'videos', voice: 'voice' };

function ensureDirs() {
  Object.values(SUBDIRS).forEach((sub) => {
    const dir = path.join(UPLOAD_DIR, sub);
    fs.mkdirSync(dir, { recursive: true });
  });
}
ensureDirs();

function classify(mimetype) {
  if (mimetype.startsWith('image/')) return 'photo';
  if (mimetype.startsWith('video/')) return 'video';
  if (mimetype.startsWith('audio/')) return 'voice';
  return null;
}

const ALLOWED = new Set([
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'audio/webm',
  'audio/mpeg',
  'audio/ogg',
  'audio/wav',
]);

const storage = multer.diskStorage({
  destination(req, file, cb) {
    const type = classify(file.mimetype);
    const sub = SUBDIRS[type] || 'photos';
    cb(null, path.join(UPLOAD_DIR, sub));
  },
  filename(req, file, cb) {
    const ext = path.extname(file.originalname) || '';
    cb(null, `${Date.now()}-${uuidv4().slice(0, 8)}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE },
  fileFilter(req, file, cb) {
    if (!ALLOWED.has(file.mimetype)) {
      return cb(new Error('Unsupported file type'));
    }
    cb(null, true);
  },
});

// POST /api/upload — single or multiple files under field "files"
router.post('/', optionalAuth, (req, res) => {
  upload.array('files', 43)(req, res, (err) => {
    if (err) {
      const status = err.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
      return res.status(status).json({ error: err.message });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }
    const files = req.files.map((f) => {
      const type = classify(f.mimetype);
      const sub = SUBDIRS[type] || 'photos';
      return {
        url: `/uploads/${sub}/${f.filename}`,
        type,
        size: f.size,
        originalName: f.originalname,
      };
    });
    return res.status(201).json({ files });
  });
});

module.exports = router;
