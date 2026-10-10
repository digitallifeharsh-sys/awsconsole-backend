import { randomUUID } from 'node:crypto';
import db from '../../config/db.js';
import { encryptSecret } from '../../utils/crypto.js';

const clean = value => String(value ?? '').trim();
const optional = value => clean(value) || null;

export const createSetup = async (req, res) => {
  const body = req.body || {};
  const fullName = clean(body.fullName);
  const gender = clean(body.gender);
  const phone = clean(body.phone);
  const email = clean(body.email).toLowerCase();
  const nickname = clean(body.nickname);
  const apiKey = clean(body.apiKey);

  if (!fullName || fullName.length > 160) return res.status(400).json({ success: false, message: 'Enter a valid full name (maximum 160 characters).' });
  if (!['male', 'female', 'other', 'prefer_not_to_say'].includes(gender)) return res.status(400).json({ success: false, message: 'Select a valid gender option.' });
  if (!/^\+?[0-9 ()-]{7,32}$/.test(phone)) return res.status(400).json({ success: false, message: 'Enter a valid phone number.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  if (!nickname || nickname.length > 120) return res.status(400).json({ success: false, message: 'Nickname is required (maximum 120 characters).' });
  if (!apiKey) return res.status(400).json({ success: false, message: '2Factor API key is required.' });

  const publicId = randomUUID();
  try {
    await db.execute(
      `INSERT INTO console_user_setups
      (public_id, full_name, gender, phone, email, nickname, api_key_encrypted, sms_token_encrypted, call_token_encrypted, sms_template_id, call_template_id, provider, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '2factor', ?)`,
      [publicId, fullName, gender, phone, email, nickname, encryptSecret(apiKey),
       encryptSecret(optional(body.smsToken)), encryptSecret(optional(body.callToken)),
       optional(body.smsTemplateId), optional(body.callTemplateId), body.isActive === false ? 0 : 1]
    );
    return res.status(201).json({
      success: true,
      message: 'Profile and API configuration saved.',
      data: { profileId: publicId, fullName, gender, phone, email, nickname, provider: '2factor', isActive: body.isActive !== false }
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'A setup with this email or phone already exists. Login and profile management will be added later.' });
    throw error;
  }
};