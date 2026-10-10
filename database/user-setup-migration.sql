-- Run against the existing DNS database.
-- Creates a user profile with exactly one linked 2Factor configuration.
-- Login/ownership controls are intentionally deferred as requested.
CREATE TABLE IF NOT EXISTS console_user_setups (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
  public_id CHAR(36) NOT NULL UNIQUE,
  full_name VARCHAR(160) NOT NULL,
  gender ENUM('male','female','other','prefer_not_to_say') NOT NULL,
  phone VARCHAR(32) NOT NULL,
  email VARCHAR(254) NOT NULL,
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
  UNIQUE KEY uq_console_user_email (email),
  UNIQUE KEY uq_console_user_phone (phone)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;