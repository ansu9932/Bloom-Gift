require('dotenv').config();
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { assertConnection } = require('./db');
const authRoutes = require('./routes/auth');
const giftRoutes = require('./routes/gifts');
const bouquetRoutes = require('./routes/bouquets');
const uploadRoutes = require('./routes/upload');

const app = express();
const PORT = Number(process.env.PORT) || 3001;
const UPLOAD_DIR = process.env.UPLOAD_DIR || path.join(__dirname, 'uploads');

// Security headers. crossOriginResourcePolicy relaxed so uploaded media can be
// embedded by the frontend served from another origin.
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    contentSecurityPolicy: false,
  })
);

// CORS — allow configured client origins. Defaults include the deployed
// Hostinger site and local dev so the API works out of the box. Add/override
// via the CLIENT_ORIGIN env var (comma-separated). Trailing slashes are ignored.
const DEFAULT_ORIGINS = [
  'https://limegreen-eland-563542.hostingersite.com',
  'http://localhost:5173',
  'http://localhost:4173',
];

const stripSlash = (s) => String(s || '').trim().replace(/\/+$/, '');

const allowedOrigins = new Set(
  [...DEFAULT_ORIGINS, ...(process.env.CLIENT_ORIGIN || '').split(',')]
    .map(stripSlash)
    .filter(Boolean)
);
const allowAll = allowedOrigins.has('*');

app.use(
  cors({
    origin(origin, cb) {
      // Allow non-browser clients (curl, health checks) with no Origin header.
      if (!origin || allowAll || allowedOrigins.has(stripSlash(origin))) {
        return cb(null, true);
      }
      return cb(new Error(`Origin ${origin} not allowed by CORS`));
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Global, generous rate limit.
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 240,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

// Serve uploaded media.
app.use('/uploads', express.static(UPLOAD_DIR));

// Health check.
app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'bloomgift-api' }));

// Routes.
app.use('/api/auth', authRoutes);
app.use('/api/gifts', giftRoutes);
app.use('/api/bouquets', bouquetRoutes);
app.use('/api/upload', uploadRoutes);

// 404 + error handlers.
app.use((req, res) => res.status(404).json({ error: 'Not found' }));
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

async function start() {
  try {
    await assertConnection();
    console.log('✓ Connected to MySQL');
  } catch (err) {
    console.warn('⚠ Could not connect to MySQL on boot:', err.message);
    console.warn('  The API will still start; check your .env DB settings.');
  }
  app.listen(PORT, () => {
    console.log(`🌸 BloomGift API running on http://localhost:${PORT}`);
  });
}

start();

module.exports = app;
