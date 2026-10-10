import { randomUUID } from 'node:crypto';
import db from '../../config/db.js';
import { encryptSecret } from '../../utils/crypto.js';

const clean = value => String(value ?? '').trim();
const optional = value => clean(value) || null;
const tooLong = (value, max) => value !== null && value.length > max;

export const createSetup = async (req, res) => {
  const body = req.body && typeof req.body === 'object' && !Array.isArray(req.body) ? req.body : {};
  const fullName = clean(body.fullName);
  const gender = clean(body.gender);
  const phone = clean(body.phone);
  const email = clean(body.email).toLowerCase();
  const nickname = clean(body.nickname);
  const apiKey = clean(body.apiKey);
  const smsToken = optional(body.smsToken);
  const callToken = optional(body.callToken);
  const smsTemplateId = optional(body.smsTemplateId);
  const callTemplateId = optional(body.callTemplateId);

  if (!fullName || fullName.length > 160) return res.status(400).json({ success: false, message: 'Enter a valid full name (maximum 160 characters).' });
  if (!['male', 'female', 'other', 'prefer_not_to_say'].includes(gender)) return res.status(400).json({ success: false, message: 'Select a valid gender option.' });
  if (!/^\+?[0-9 ()-]{7,32}$/.test(phone)) return res.status(400).json({ success: false, message: 'Enter a valid phone number.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ success: false, message: 'Enter a valid email address.' });
  if (!nickname || nickname.length > 120) return res.status(400).json({ success: false, message: 'Nickname is required (maximum 120 characters).' });
  if (!apiKey || apiKey.length > 2048) return res.status(400).json({ success: false, message: '2Factor API key is required and must be at most 2048 characters.' });
  if (tooLong(smsToken, 2048) || tooLong(callToken, 2048)) return res.status(400).json({ success: false, message: 'SMS and Call tokens must be at most 2048 characters.' });
  if (tooLong(smsTemplateId, 191) || tooLong(callTemplateId, 191)) return res.status(400).json({ success: false, message: 'Template IDs must be at most 191 characters.' });
  if (body.isActive !== undefined && typeof body.isActive !== 'boolean') return res.status(400).json({ success: false, message: 'isActive must be true or false.' });

  const publicId = randomUUID();
  try {
    await db.execute(
      `INSERT INTO console_user_setups
      (public_id, full_name, gender, phone, email, nickname, api_key_encrypted, sms_token_encrypted, call_token_encrypted, sms_template_id, call_template_id, provider, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '2factor', ?)`,
      [
        publicId,
        fullName,
        gender,
        phone,
        email,
        nickname,
        encryptSecret(apiKey),
        encryptSecret(smsToken),
        encryptSecret(callToken),
        smsTemplateId,
        callTemplateId,
        body.isActive === false ? 0 : 1,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Profile and API configuration saved.',
      data: {
        profileId: publicId,
        fullName,
        gender,
        phone,
        email,
        nickname,
        provider: '2factor',
        isActive: body.isActive !== false,
      },
    });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        message: 'A setup with this email or phone already exists. Profile editing requires authenticated account ownership and is not enabled yet.',
      });
    }
    throw error;
  }
};
