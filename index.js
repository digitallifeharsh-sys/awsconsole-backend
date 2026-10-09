import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import smsRoutes from './src/routes/sms.routes.js';
import initializeDatabase from './src/models/initDatabase.js';
import pool from './src/config/database.js';
import requireConsoleAdmin from './src/middleware/requireConsoleAdmin.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(new Error('Origin not allowed'));
  },
  credentials: true,
}));

app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));

app.get('/health', async (_req, res) => {
  try {
    await pool.query('SELECT 1');
    return res.json({ success: true, service: 'awsconsole-backend', database: 'connected', time: new Date().toISOString() });
  } catch {
    return res.status(503).json({ success: false, service: 'awsconsole-backend', database: 'unavailable' });
  }
});

app.use('/api/v1/sms/2factor', requireConsoleAdmin, smsRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

app.use((error, _req, res, _next) => {
  if (error.message === 'Origin not allowed') return res.status(403).json({ success: false, message: 'Origin not allowed' });
  console.error('Request failed:', error.message);
  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  return res.status(statusCode).json({
    success: false,
    message: statusCode >= 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : (error.message || 'Internal server error'),
  });
});

const port = Number(process.env.PORT || 5000);
const startServer = async () => {
  try {
    await initializeDatabase();
    app.listen(port, '0.0.0.0', () => {
      console.log(`AWS Console backend running at http://localhost:${port}`);
      console.log('Entry point: index.js | Framework: Express MVC | Database: MySQL');
    });
  } catch (error) {
    console.error('Backend startup failed. Verify .env and MySQL DNS user permissions.');
    console.error(error.code || error.message);
    await pool.end().catch(() => {});
    process.exit(1);
  }
};
startServer();
export default app;
