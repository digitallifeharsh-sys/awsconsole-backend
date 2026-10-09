import { Router } from 'express';
const router = Router();
// Reserved for future API-user endpoints. Add authentication when that module is implemented.
router.get('/health', (_req, res) => res.json({ success: true, module: 'sms-api-user' }));
export default router;
