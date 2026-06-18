const { pool } = require('../db');
const { v4: uuidv4 } = require('uuid');

// mysql2 returns JSON columns already parsed; normalise just in case.
function parseFlowers(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return [];
    }
  }
  return value || [];
}

function hydrate(row) {
  if (!row) return null;
  return { ...row, flowers: parseFlowers(row.flowers) };
}

const Bouquet = {
  async create({ userId = null, name = 'Classic Bouquet', style = 'classic', flowers = [], thumbnailUrl = null }) {
    const id = uuidv4();
    const bloomCount = Array.isArray(flowers) ? flowers.length : 0;
    await pool.query(
      `INSERT INTO bouquets (id, user_id, name, style, flowers, bloom_count, thumbnail_url)
       VALUES (?, ?, ?, ?, CAST(? AS JSON), ?, ?)`,
      [id, userId, name, style, JSON.stringify(flowers), bloomCount, thumbnailUrl]
    );
    return this.findById(id);
  },

  async update(id, { name, style, flowers, thumbnailUrl }) {
    const current = await this.findById(id);
    if (!current) return null;
    const next = {
      name: name ?? current.name,
      style: style ?? current.style,
      flowers: flowers ?? current.flowers,
      thumbnailUrl: thumbnailUrl ?? current.thumbnail_url,
    };
    await pool.query(
      `UPDATE bouquets SET name = ?, style = ?, flowers = CAST(? AS JSON), bloom_count = ?, thumbnail_url = ?
       WHERE id = ?`,
      [next.name, next.style, JSON.stringify(next.flowers), next.flowers.length, next.thumbnailUrl, id]
    );
    return this.findById(id);
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM bouquets WHERE id = ?', [id]);
    return hydrate(rows[0]);
  },

  async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM bouquets WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows.map(hydrate);
  },

  async remove(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM bouquets WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Bouquet;
