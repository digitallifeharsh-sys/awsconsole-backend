import 'dotenv/config';
import mysql from 'mysql2/promise';

// Match dns_harsh's local MySQL setup: localhost + DNS database + harsh user.
// Password is loaded from the private local .env file, never hard-coded in Git.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'harsh',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'DNS',
  port: Number(process.env.DB_PORT || 3306),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

export default pool;
