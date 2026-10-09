import mysql from 'mysql2/promise';

// Keep the same local MySQL connection style as DNS: localhost + DNS database.
// Environment variables only override local settings when explicitly supplied.
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'harsh',
  password: process.env.DB_PASSWORD ?? '',
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
