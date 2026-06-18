const express = require('express');
const Bouquet = require('../models/Bouquet');
const { requireAuth, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/bouquets — save a bouquet
router.post('/', optionalAuth, async (req, res) => {
  try {
    const { name = 'Classic Bouquet', style = 'classic', flowers = [], thumbnailUrl = null } = req.body || {};
    if (!Array.isArray(flowers)) {
      return res.status(400).json({ error: 'flowers must be an array' });
    }
    const bouquet = await Bouquet.create({
      userId: req.user?.id || null,
      name,
      style,
      flowers,
      thumbnailUrl,
    });
    return res.status(201).json({ bouquet });
  } catch (err) {
    console.error('create bouquet error', err);
    return res.status(500).json({ error: 'Failed to save bouquet' });
  }
});

// PUT /api/bouquets/:id — update a bouquet
router.put('/:id', optionalAuth, async (req, res) => {
  try {
    const updated = await Bouquet.update(req.params.id, req.body || {});
    if (!updated) return res.status(404).json({ error: 'Bouquet not found' });
    return res.json({ bouquet: updated });
  } catch (err) {
    console.error('update bouquet error', err);
    return res.status(500).json({ error: 'Failed to update bouquet' });
  }
});

// GET /api/bouquets/mine — list user's bouquets
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const bouquets = await Bouquet.findByUser(req.user.id);
    return res.json({ bouquets });
  } catch (err) {
    console.error('list bouquets error', err);
    return res.status(500).json({ error: 'Failed to list bouquets' });
  }
});

// GET /api/bouquets/:id — fetch a single bouquet (used by recipient view)
router.get('/:id', async (req, res) => {
  try {
    const bouquet = await Bouquet.findById(req.params.id);
    if (!bouquet) return res.status(404).json({ error: 'Bouquet not found' });
    return res.json({ bouquet });
  } catch (err) {
    console.error('get bouquet error', err);
    return res.status(500).json({ error: 'Failed to load bouquet' });
  }
});

// DELETE /api/bouquets/:id — owner only
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const removed = await Bouquet.remove(req.params.id, req.user.id);
    if (!removed) return res.status(404).json({ error: 'Bouquet not found' });
    return res.json({ success: true });
  } catch (err) {
    console.error('delete bouquet error', err);
    return res.status(500).json({ error: 'Failed to delete bouquet' });
  }
});

module.exports = router;
