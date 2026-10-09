import pool from '../config/database.js';

const initializeDatabase = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS two_factor_configs (
      id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      nickname VARCHAR(120) NOT NULL,
      api_key_encrypted TEXT NOT NULL,
      sms_token_encrypted TEXT NULL,
      call_token_encrypted TEXT NULL,
      sms_template_id VARCHAR(191) NULL,
      call_template_id VARCHAR(191) NULL,
      provider VARCHAR(40) NOT NULL DEFAULT '2factor',
      is_active TINYINT(1) NOT NULL DEFAULT 1,
      created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_two_factor_active (is_active),
      INDEX idx_two_factor_nickname (nickname)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
  `);
  const connection = await pool.getConnection();
  connection.release();
  console.log('MySQL connected; 2Factor configuration table is ready');
};

export default initializeDatabase;
