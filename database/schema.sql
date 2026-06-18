-- BloomGift database schema
-- Run on Hostinger MySQL (or local MySQL 8+)
--   mysql -u root -p < database/schema.sql

CREATE DATABASE IF NOT EXISTS bloomgift_db
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE bloomgift_db;

-- ── Users ──────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id            INT AUTO_INCREMENT PRIMARY KEY,
  username      VARCHAR(50)  UNIQUE NOT NULL,
  email         VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  plan          ENUM('free', 'blooming') DEFAULT 'free',
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- ── Saved bouquets ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS bouquets (
  id            VARCHAR(36) PRIMARY KEY,             -- UUID
  user_id       INT NULL,
  name          VARCHAR(100) DEFAULT 'Classic Bouquet',
  style         ENUM('classic', 'paper') DEFAULT 'classic',
  flowers       JSON NOT NULL,                       -- [{id,x,y,scale,rotation,zIndex,flip}]
  bloom_count   INT DEFAULT 0,
  thumbnail_url VARCHAR(500),
  created_at    TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_bouquets_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- ── Gift sequences ─────────────────────────────────────
CREATE TABLE IF NOT EXISTS gifts (
  id             VARCHAR(36) PRIMARY KEY,            -- UUID
  user_id        INT NULL,
  sender_name    VARCHAR(100) DEFAULT 'Someone',
  recipient_name VARCHAR(100) DEFAULT 'You',
  slug           VARCHAR(120) UNIQUE,                -- e.g. starter-v1-nghile-pink
  sequence_data  JSON NOT NULL,                      -- full encoded sequence
  is_public      BOOLEAN DEFAULT TRUE,
  view_count     INT DEFAULT 0,
  created_at     TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  expires_at     TIMESTAMP NULL,                     -- NULL = permanent
  CONSTRAINT fk_gifts_user FOREIGN KEY (user_id)
    REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE INDEX idx_gifts_slug ON gifts (slug);
CREATE INDEX idx_gifts_user ON gifts (user_id);

-- ── Uploaded media (photos/videos/voice per gift step) ──
CREATE TABLE IF NOT EXISTS media (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  gift_id    VARCHAR(36) NULL,
  step_id    VARCHAR(100),
  file_url   VARCHAR(500),
  file_type  ENUM('photo', 'video', 'voice'),
  file_size  INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_media_gift FOREIGN KEY (gift_id)
    REFERENCES gifts(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE INDEX idx_media_gift ON media (gift_id);
