import mysql from 'mysql2/promise';

const requiredEnv = ['DB_HOST', 'DB_NAME', 'DB_USER'];
const missing = requiredEnv.filter((key) => !process.env[key]);
if (missing.length) throw new Error(`Missing database environment values: ${missing.join(', ')}. Create .env from .env.example.`);

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 3306),
  database: process.env.DB_NAME || 'DNS',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  charset: 'utf8mb4',
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
export default pool;
