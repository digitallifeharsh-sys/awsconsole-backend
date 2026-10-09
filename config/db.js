import 'dotenv/config';
import mysql from 'mysql2/promise';

// Local defaults intentionally match the existing dns_harsh MySQL pattern.
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || 'harsh',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'DNS',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
export default db;
