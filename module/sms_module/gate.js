import { Router } from 'express';
import adminRoutes from './Admin/IndexRoute.js';

const router = Router();
router.use('/', adminRoutes);
export default router;
