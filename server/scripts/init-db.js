/**
 * Initialise the database by executing database/schema.sql.
 * Usage: npm run init-db   (from the server/ folder)
 *
 * Requires DB_HOST/DB_USER/DB_PASSWORD in server/.env and a MySQL user with
 * privileges to create databases/tables.
 */
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function run() {
  const schemaPath = path.join(__dirname, '..', '..', 'database', 'schema.sql');
  const sql = fs.readFileSync(schemaPath, 'utf8');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    multipleStatements: true,
  });

  console.log('Running schema.sql ...');
  await connection.query(sql);
  console.log('✓ Database initialised');
  await connection.end();
}

run().catch((err) => {
  console.error('Failed to initialise database:', err.message);
  process.exit(1);
});
