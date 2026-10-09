import { decryptSecret } from '../utils/crypto.js';

const base = () => String(process.env.TWO_FACTOR_BASE_URL || 'https://2factor.in').replace(/\/$/, '');
const phoneDigits = value => String(value || '').replace(/[\s()+-]/g, '');
const validPhone = value => /^\d{10,15}$/.test(phoneDigits(value));

const providerRequest = async (url, options = {}) => {
  let response;
  try {
    response = await fetch(url, { ...options, signal: AbortSignal.timeout(15000) });
  } catch (error) {
    const e = new Error(error?.name === 'TimeoutError' ? '2Factor request timed out' : '2Factor provider is unreachable');
    e.statusCode = 502;
    throw e;
  }
  const raw = await response.text();
  let body;
  try { body = JSON.parse(raw); } catch { body = { message: raw }; }
  if (!response.ok) {
    const e = new Error(body?.message || body?.Details || '2Factor provider rejected the request');
    e.statusCode = 502;
    throw e;
  }
  if (body?.Status === 'Error' || body?.status === 'error' || body?.success === false) {
    const e = new Error(body?.Details || body?.message || '2Factor provider reported a failure');
    e.statusCode = 502;
    throw e;
  }
  return body;
};

// 2Factor's documented SMS OTP endpoint uses X-API-Key and a template name.
// The optional SMS token is stored encrypted for provider-specific setups, but is
// not sent as an undocumented header to 2Factor.
export const sendSms = async ({ config, phone, otp }) => {
  if (!validPhone(phone)) throw Object.assign(new Error('Enter a valid phone number with country code'), { statusCode: 400 });
  if (!config.sms_template_id) throw Object.assign(new Error('Set the SMS Template ID / Name before sending a test SMS'), { statusCode: 400 });
  const code = String(otp || Math.floor(100000 + Math.random() * 900000));
  if (!/^\d{4,8}$/.test(code)) throw Object.assign(new Error('OTP must contain 4 to 8 digits'), { statusCode: 400 });
  const apiKey = decryptSecret(config.api_key_encrypted);
  if (!apiKey) throw Object.assign(new Error('2Factor API key is missing'), { statusCode: 409 });
  return providerRequest(base() + '/API/V1/OTP/SEND', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json', 'X-API-Key': apiKey },
    body: JSON.stringify({ to: phone.trim(), template_name: config.sms_template_id, var1: code })
  });
};

// 2Factor's voice API uses an API key and text/audio input. A dedicated call token
// can be used as the voice API key; otherwise the main API key is used.
export const makeCall = async ({ config, phone, message, otp }) => {
  if (!validPhone(phone)) throw Object.assign(new Error('Enter a valid phone number with country code'), { statusCode: 400 });
  const input = String(message || (otp ? 'Your one-time password is ' + otp : '')).trim();
  if (!input) throw Object.assign(new Error('Voice message is required'), { statusCode: 400 });
  const apiKey = decryptSecret(config.call_token_encrypted) || decryptSecret(config.api_key_encrypted);
  if (!apiKey) throw Object.assign(new Error('2Factor voice API key is missing'), { statusCode: 409 });
  const params = new URLSearchParams({ Mode: 'Say', APIKey: apiKey, PhoneNo: phoneDigits(phone), Input: input });
  return providerRequest(base() + '/API/V1/OBD/Send.php?' + params.toString(), { method: 'GET', headers: { Accept: 'application/json, text/plain' } });
};
