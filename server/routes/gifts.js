const express = require('express');
const { v4: uuidv4 } = require('uuid');
const Gift = require('../models/Gift');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 40);
}

function buildSlug({ tier = 'starter', version = 1, senderName, palette }) {
  const name = slugify(senderName) || 'someone';
  const pal = slugify(palette) || 'pink';
  const rand = Math.random().toString(36).slice(2, 6);
  return `${tier}-v${version}-${name}-${pal}-${rand}`;
}

// POST /api/gifts — create a gift sequence (optionally authenticated)
router.post('/', optionalAuth, async (req, res) => {
  try {
    const {
      senderName = 'Someone',
      recipientName = 'You',
      sequenceData = [],
      palette = 'pink',
      isPublic = true,
      expiresAt = null,
      tier = 'starter',
    } = req.body || {};

    if (!Array.isArray(sequenceData) || sequenceData.length === 0) {
      return res.status(400).json({ error: 'sequenceData must be a non-empty array' });
    }

    const id = uuidv4();
    const slug = buildSlug({ tier, version: 1, senderName, palette });
    const gift = await Gift.create({
      id,
      userId: req.user?.id || null,
      senderName,
      recipientName,
      slug,
      sequenceData,
      isPublic,
      expiresAt,
    });

    return res.status(201).json({ gift });
  } catch (err) {
    console.error('create gift error', err);
    return res.status(500).json({ error: 'Failed to create gift' });
  }
});

// GET /api/gifts/mine — list the authenticated user's gifts
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const gifts = await Gift.findByUser(req.user.id);
    return res.json({ gifts });
  } catch (err) {
    console.error('list gifts error', err);
    return res.status(500).json({ error: 'Failed to list gifts' });
  }
});

// GET /api/gifts/:slug — public fetch by slug (increments view count)
router.get('/:slug', async (req, res) => {
  try {
    const gift = await Gift.findBySlug(req.params.slug);
    if (!gift) return res.status(404).json({ error: 'Gift not found' });

    if (gift.expires_at && new Date(gift.expires_at) < new Date()) {
      return res.status(410).json({ error: 'This gift has expired' });
    }
    if (!gift.is_public) {
      return res.status(403).json({ error: 'This gift is private' });
    }

    await Gift.incrementViews(gift.id);
    return res.json({ gift });
  } catch (err) {
    console.error('get gift error', err);
    return res.status(500).json({ error: 'Failed to load gift' });
  }
});

// DELETE /api/gifts/:id — owner only
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await Gift.remove(req.params.id, req.user.id);
    if (!removed) return res.status(404).json({ error: 'Gift not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error('delete gift error', err);
    return res.status(500).json({ error: 'Failed to delete gift' });
  }
});

module.exports = router;
