import { decryptSecret } from '../../../../utils/crypto.js';

const baseUrl = () => String(process.env.TWO_FACTOR_BASE_URL || 'https://2factor.in').replace(/\/$/, '');
const digits = value => String(value || '').replace(/[\s()+-]/g, '');
const validPhone = value => /^\d{10,15}$/.test(digits(value));

const requestProvider = async (url, options = {}) => {
  let response;
  try { response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) }); }
  catch (error) {
    const e = new Error(error?.name === 'TimeoutError' ? '2Factor request timed out' : '2Factor provider is unreachable');
    e.statusCode = 502; throw e;
  }
  const raw = await response.text();
  let body;
  try { body = JSON.parse(raw); } catch { body = { message: raw }; }
  if (!response.ok || body?.Status === 'Error' || body?.status === 'error' || body?.success === false) {
    const e = new Error(body?.Details || body?.message || '2Factor provider rejected the request');
    e.statusCode = 502; throw e;
  }
  return body;
};

export const sendSms = async ({ config, phone, otp }) => {
  if (!validPhone(phone)) throw Object.assign(new Error('Enter a valid phone number'), { statusCode: 400 });
  if (!config.sms_template_id) throw Object.assign(new Error('Set the SMS Template ID / Name first'), { statusCode: 400 });
  const code = String(otp || Math.floor(100000 + Math.random() * 900000));
  if (!/^\d{4,8}$/.test(code)) throw Object.assign(new Error('OTP must contain 4 to 8 digits'), { statusCode: 400 });
  const apiKey = decryptSecret(config.api_key_encrypted);
  return requestProvider(baseUrl() + '/API/V1/OTP/SEND', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify({ to: phone.trim(), template_name: config.sms_template_id, var1: code }),
  });
};

export const makeCall = async ({ config, phone, message, otp }) => {
  if (!validPhone(phone)) throw Object.assign(new Error('Enter a valid phone number'), { statusCode: 400 });
  const input = String(message || (otp ? 'Your one-time password is ' + otp : '')).trim();
  if (!input) throw Object.assign(new Error('Voice message is required'), { statusCode: 400 });
  const apiKey = decryptSecret(config.call_token_encrypted) || decryptSecret(config.api_key_encrypted);
  const params = new URLSearchParams({ Mode: 'Say', APIKey: apiKey, PhoneNo: digits(phone), Input: input });
  return requestProvider(baseUrl() + '/API/V1/OBD/Send.php?' + params.toString());
};
