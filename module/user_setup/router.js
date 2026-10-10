import { Router } from 'express';
import { createSetup } from './controller.js';

const router = Router();
router.post('/', (req, res, next) => Promise.resolve(createSetup(req, res)).catch(next));
export default router;