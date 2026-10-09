import { Router } from 'express';
import { list, get, create, update, remove, testSms, testCall } from '../controllers/twoFactor.controller.js';

const router = Router();
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

router.get('/config', asyncRoute(list));
router.get('/config/:id', asyncRoute(get));
router.post('/config', asyncRoute(create));
router.put('/config/:id', asyncRoute(update));
router.delete('/config/:id', asyncRoute(remove));
router.post('/config/:id/test-sms', asyncRoute(testSms));
router.post('/config/:id/test-call', asyncRoute(testCall));

export default router;
