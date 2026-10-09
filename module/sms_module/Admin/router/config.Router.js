import { Router } from 'express';
import { list, get, create, update, remove, testSms, testCall } from '../controller/config.controller.js';

const router = Router();
const wrap = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);
router.get('/config', wrap(list));
router.get('/config/:id', wrap(get));
router.post('/config', wrap(create));
router.put('/config/:id', wrap(update));
router.delete('/config/:id', wrap(remove));
router.post('/config/:id/test-sms', wrap(testSms));
router.post('/config/:id/test-call', wrap(testCall));
export default router;
