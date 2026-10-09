import { Router } from 'express';
const router = Router();
// Reserved for future web-panel-specific SMS module endpoints.
router.get('/health', (_req, res) => res.json({ success: true, module: 'sms-web-panel' }));
export default router;
