const { pool } = require('../db');
const { v4: uuidv4 } = require('uuid');

function parseSequence(value) {
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
  return { ...row, sequence_data: parseSequence(row.sequence_data) };
}

const Gift = {
  async create({
    id,
    userId = null,
    senderName = 'Someone',
    recipientName = 'You',
    slug,
    sequenceData = [],
    isPublic = true,
    expiresAt = null,
  }) {
    const giftId = id || uuidv4();
    await pool.query(
      `INSERT INTO gifts (id, user_id, sender_name, recipient_name, slug, sequence_data, is_public, expires_at)
       VALUES (?, ?, ?, ?, ?, CAST(? AS JSON), ?, ?)`,
      [
        giftId,
        userId,
        senderName,
        recipientName,
        slug,
        JSON.stringify(sequenceData),
        isPublic ? 1 : 0,
        expiresAt,
      ]
    );
    return this.findById(giftId);
  },

  async findById(id) {
    const [rows] = await pool.query('SELECT * FROM gifts WHERE id = ?', [id]);
    return hydrate(rows[0]);
  },

  async findBySlug(slug) {
    const [rows] = await pool.query('SELECT * FROM gifts WHERE slug = ?', [slug]);
    return hydrate(rows[0]);
  },

  async findByUser(userId) {
    const [rows] = await pool.query(
      'SELECT * FROM gifts WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    return rows.map(hydrate);
  },

  async incrementViews(id) {
    await pool.query('UPDATE gifts SET view_count = view_count + 1 WHERE id = ?', [id]);
  },

  async remove(id, userId) {
    const [result] = await pool.query(
      'DELETE FROM gifts WHERE id = ? AND user_id = ?',
      [id, userId]
    );
    return result.affectedRows > 0;
  },
};

module.exports = Gift;
