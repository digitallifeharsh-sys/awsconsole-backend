import * as query from '../query/config.query.js';
import { encryptSecret, maskedSecret } from '../../../../utils/crypto.js';
import { sendSms, makeCall } from '../utils/provider.js';

const view = row => row && ({
  id: row.id, nickname: row.nickname,
  apiKey: maskedSecret(row.api_key_encrypted),
  smsToken: maskedSecret(row.sms_token_encrypted),
  callToken: maskedSecret(row.call_token_encrypted),
  smsTemplateId: row.sms_template_id, callTemplateId: row.call_template_id,
  provider: row.provider, isActive: Boolean(row.is_active),
  createdAt: row.created_at, updatedAt: row.updated_at,
});
const optional = value => value === undefined || value === null || String(value).trim() === '' ? null : String(value).trim();

export const list = async (_req, res) => res.json({ success: true, data: (await query.findAll()).map(view) });
export const get = async (req, res) => {
  const row = await query.findById(req.params.id);
  if (!row) return res.status(404).json({ success: false, message: 'Configuration not found' });
  return res.json({ success: true, data: view(row) });
};
export const create = async (req, res) => {
  const body = req.body || {};
  const nickname = String(body.nickname || '').trim();
  const apiKey = String(body.apiKey || '').trim();
  if (!nickname) return res.status(400).json({ success: false, message: 'Nickname is required' });
  if (!apiKey) return res.status(400).json({ success: false, message: '2Factor API key is required' });
  const row = await query.create({
    nickname, apiKeyEncrypted: encryptSecret(apiKey),
    smsTokenEncrypted: encryptSecret(optional(body.smsToken)),
    callTokenEncrypted: encryptSecret(optional(body.callToken)),
    smsTemplateId: optional(body.smsTemplateId), callTemplateId: optional(body.callTemplateId),
    provider: optional(body.provider) || '2factor',
    isActive: body.isActive === undefined ? true : Boolean(body.isActive),
  });
  return res.status(201).json({ success: true, message: 'Configuration saved', data: view(row) });
};
export const update = async (req, res) => {
  const existing = await query.findById(req.params.id);
  if (!existing) return res.status(404).json({ success: false, message: 'Configuration not found' });
  const body = req.body || {}; const data = {};
  if (body.nickname !== undefined) {
    data.nickname = String(body.nickname).trim();
    if (!data.nickname) return res.status(400).json({ success: false, message: 'Nickname is required' });
  }
  for (const key of ['smsTemplateId', 'callTemplateId', 'provider']) {
    if (body[key] !== undefined) data[key] = optional(body[key]) || (key === 'provider' ? '2factor' : null);
  }
  if (body.isActive !== undefined) data.isActive = Boolean(body.isActive);
  for (const [input, target] of [['apiKey','apiKeyEncrypted'], ['smsToken','smsTokenEncrypted'], ['callToken','callTokenEncrypted']]) {
    if (body[input] !== undefined && String(body[input]).trim()) data[target] = encryptSecret(String(body[input]).trim());
  }
  return res.json({ success: true, message: 'Configuration updated', data: view(await query.update(req.params.id, data)) });
};
export const remove = async (req, res) => {
  if (!await query.findById(req.params.id)) return res.status(404).json({ success: false, message: 'Configuration not found' });
  await query.remove(req.params.id);
  return res.json({ success: true, message: 'Configuration deleted' });
};
export const testSms = async (req, res) => {
  const config = await query.findById(req.params.id);
  if (!config) return res.status(404).json({ success: false, message: 'Configuration not found' });
  if (!config.is_active) return res.status(409).json({ success: false, message: 'Configuration is disabled' });
  return res.json({ success: true, data: await sendSms({ config, ...(req.body || {}) }) });
};
export const testCall = async (req, res) => {
  const config = await query.findById(req.params.id);
  if (!config) return res.status(404).json({ success: false, message: 'Configuration not found' });
  if (!config.is_active) return res.status(409).json({ success: false, message: 'Configuration is disabled' });
  return res.json({ success: true, data: await makeCall({ config, ...(req.body || {}) }) });
};
