import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import smsRoutes from './src/routes/sms.routes.js';
import initializeDatabase from './src/models/initDatabase.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
const origins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(x => x.trim()).filter(Boolean);
app.use(cors({ origin: (origin, cb) => !origin || origins.includes(origin) ? cb(null, true) : cb(new Error('Origin not allowed')), credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.get('/health', (_req, res) => res.json({ success: true, service: 'awsconsole-backend', time: new Date().toISOString() }));
app.use('/api/v1/sms/2factor', smsRoutes);
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(err.statusCode || 500).json({ success: false, message: err.statusCode ? err.message : 'Internal server error' });
});

const port = Number(process.env.PORT || 5000);
try {
  await initializeDatabase();
  app.listen(port, '0.0.0.0', () => console.log('AWS Console backend listening on port ' + port));
} catch (error) {
  console.error('Backend startup failed. Check MySQL settings and database permissions.', error);
  process.exit(1);
}
