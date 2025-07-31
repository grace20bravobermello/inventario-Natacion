// backend/config/db.js
import 'dotenv/config'; // <-- ¡IMPORTANTE: Asegúrate de que tu package.json tenga "type": "module" para usar import/export!

import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_NAME,
});

export default pool;