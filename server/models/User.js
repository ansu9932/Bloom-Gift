const { pool } = require('../db');

const User = {
  async create({ username, email, passwordHash, plan = 'free' }) {
    const [result] = await pool.query(
      'INSERT INTO users (username, email, password_hash, plan) VALUES (?, ?, ?, ?)',
      [username, email, passwordHash, plan]
    );
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await pool.query(
      'SELECT id, username, email, plan, created_at FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  // Includes password_hash — only for login verification.
  async findByEmail(email) {
    const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
    return rows[0] || null;
  },

  async findByUsernameOrEmail(username, email) {
    const [rows] = await pool.query(
      'SELECT id FROM users WHERE username = ? OR email = ? LIMIT 1',
      [username, email]
    );
    return rows[0] || null;
  },

  async setPlan(id, plan) {
    await pool.query('UPDATE users SET plan = ? WHERE id = ?', [plan, id]);
    return this.findById(id);
  },
};

module.exports = User;
