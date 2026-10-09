import {Router} from 'express';
import {list,get,create,update,remove,testSms,testCall} from '../controllers/twoFactor.controller.js';
const router=Router();
router.get('/config',list);router.get('/config/:id',get);router.post('/config',create);router.put('/config/:id',update);router.delete('/config/:id',remove);router.post('/config/:id/test-sms',testSms);router.post('/config/:id/test-call',testCall);
export default router;
