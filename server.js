import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import smsGate from './module/sms_module/gate.js';
import { initializeConfigTable } from './module/sms_module/Admin/model/config.model.js';
import { initializeUserSetupTable } from './module/user_setup/model.js';
import userSetupRoutes from './module/user_setup/router.js';
import webPanelRoutes from './module/sms_module/web_panel/router/index.js';
import apiUserRoutes from './module/sms_module/api_user/router/index.js';
import db from './config/db.js';

const app = express();
app.disable('x-powered-by');
app.use(helmet());
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',').map(v => v.trim()).filter(Boolean);
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
    await db.query('SELECT 1');
    return res.json({ success: true, service: 'awsconsole-backend', database: 'connected' });
  } catch (error) {
    console.error('Health check failed:', error.code || error.message);
    return res.status(503).json({ success: false, service: 'awsconsole-backend', database: 'unavailable' });
  }
});

// Login is intentionally deferred. Protect public configuration endpoints before production deployment.
app.use('/api/v1/user-setup', userSetupRoutes);
app.use('/sms/2factor', smsGate);
app.use('/api/v1/sms/2factor', smsGate);
app.use('/sms/web-panel', webPanelRoutes);
app.use('/sms/api-user', apiUserRoutes);

app.use((req, res) => res.status(404).json({ success: false, message: `Route not found: ${req.method} ${req.originalUrl}` }));
app.use((error, _req, res, _next) => {
  if (error.message === 'Origin not allowed') return res.status(403).json({ success: false, message: error.message });
  console.error('Request failed:', error.code || error.message);
  if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'This email or phone is already registered.' });
  const status = Number.isInteger(error.statusCode) ? error.statusCode : 500;
  return res.status(status).json({ success: false, message: status >= 500 && process.env.NODE_ENV === 'production' ? 'Internal server error' : error.message });
});

const port = Number(process.env.PORT || 5000);
try {
  await initializeConfigTable();
  await initializeUserSetupTable();
  app.listen(port, '0.0.0.0', () => console.log(`AWS Console backend listening at http://localhost:${port} (server.js)`));
} catch (error) {
  console.error('Backend startup failed:', error.code || error.message);
  await db.end().catch(() => {});
  process.exit(1);
}
export default app;
