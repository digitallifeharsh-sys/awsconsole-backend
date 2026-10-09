import { Router } from 'express';
import configRouter from './router/config.Router.js';

const router = Router();
// Login has not been implemented yet, so no login/admin middleware is attached.
router.use('/', configRouter);
export default router;
