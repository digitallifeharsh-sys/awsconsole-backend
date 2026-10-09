import db from '../../../../config/db.js';

export const findAll = async () => {
  const [rows] = await db.execute('SELECT * FROM two_factor_configs ORDER BY id DESC');
  return rows;
};
export const findById = async id => {
  const [rows] = await db.execute('SELECT * FROM two_factor_configs WHERE id = ? LIMIT 1', [id]);
  return rows[0] || null;
};
export const create = async data => {
  const [result] = await db.execute(
    'INSERT INTO two_factor_configs (nickname, api_key_encrypted, sms_token_encrypted, call_token_encrypted, sms_template_id, call_template_id, provider, is_active) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
    [data.nickname, data.apiKeyEncrypted, data.smsTokenEncrypted, data.callTokenEncrypted, data.smsTemplateId, data.callTemplateId, data.provider, data.isActive ? 1 : 0]
  );
  return findById(result.insertId);
};
export const update = async (id, data) => {
  const columns = {
    nickname: 'nickname', apiKeyEncrypted: 'api_key_encrypted',
    smsTokenEncrypted: 'sms_token_encrypted', callTokenEncrypted: 'call_token_encrypted',
    smsTemplateId: 'sms_template_id', callTemplateId: 'call_template_id',
    provider: 'provider', isActive: 'is_active',
  };
  const fields = []; const values = [];
  for (const [key, column] of Object.entries(columns)) {
    if (data[key] !== undefined) { fields.push(column + ' = ?'); values.push(key === 'isActive' ? (data[key] ? 1 : 0) : data[key]); }
  }
  if (fields.length) {
    values.push(id);
    await db.execute('UPDATE two_factor_configs SET ' + fields.join(', ') + ' WHERE id = ?', values);
  }
  return findById(id);
};
export const remove = async id => {
  const [result] = await db.execute('DELETE FROM two_factor_configs WHERE id = ?', [id]);
  return result.affectedRows > 0;
};
