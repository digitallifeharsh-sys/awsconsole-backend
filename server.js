import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import smsRoutes from './src/routes/sms.routes.js';

const app=express();
app.use(helmet());
const origins=(process.env.FRONTEND_URL||'http://localhost:3000').split(',').map(x=>x.trim());
app.use(cors({origin:(origin,cb)=>!origin||origins.includes(origin)?cb(null,true):cb(new Error('Origin not allowed')),credentials:true}));
app.use(express.json({limit:'1mb'}));
app.get('/health',(_req,res)=>res.json({success:true,service:'awsconsole-backend',time:new Date().toISOString()}));
app.use('/api/v1/sms/2factor',smsRoutes);
app.use((err,_req,res,_next)=>{console.error(err);res.status(err.statusCode||500).json({success:false,message:err.statusCode?err.message:'Internal server error'});});
const port=Number(process.env.PORT||5000);
app.listen(port,()=>console.log('AWS Console backend listening on '+port));
