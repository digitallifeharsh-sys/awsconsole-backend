import crypto from 'node:crypto';
const key=()=>{const value=process.env.CREDENTIAL_ENCRYPTION_KEY||'';if(!/^[a-fA-F0-9]{64}$/.test(value))throw new Error('CREDENTIAL_ENCRYPTION_KEY must be 64 hexadecimal characters');return Buffer.from(value,'hex');};
export const encryptSecret=value=>{if(value===undefined||value===null||value==='')return null;const iv=crypto.randomBytes(12);const cipher=crypto.createCipheriv('aes-256-gcm',key(),iv);const encrypted=Buffer.concat([cipher.update(String(value),'utf8'),cipher.final()]);return Buffer.concat([iv,cipher.getAuthTag(),encrypted]).toString('base64');};
export const decryptSecret=payload=>{if(!payload)return null;const raw=Buffer.from(payload,'base64');const decipher=crypto.createDecipheriv('aes-256-gcm',key(),raw.subarray(0,12));decipher.setAuthTag(raw.subarray(12,28));return Buffer.concat([decipher.update(raw.subarray(28)),decipher.final()]).toString('utf8');};
export const maskedSecret=payload=>payload?'********configured':null;
