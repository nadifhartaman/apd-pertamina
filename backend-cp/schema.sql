-- =====================================================================
--  schema.sql
--  Rekonstruksi skema database backend "pertamina-detection" (backend-cp)
--  Fitur: Deteksi APD (container), manajemen Kamera, dan Auth user.
--
--  PENTING: tipe & panjang kolom di sini adalah INFERENSI dari query di
--  kode (models & controllers), BUKAN hasil dump skema produksi asli.
--  Cukup untuk menjalankan backend di lokal; sesuaikan tipe/panjang/index
--  bila perlu.
--
--  Target : MySQL 8 / MariaDB, engine InnoDB, charset utf8mb4.
--  Sumber : models/userApdModel.js, models/cameraApdModel.js,
--           models/apdModel.js, controllers/*.js
--
--  Cara pakai di DBeaver / MySQL CLI:
--    1) buat / pilih database tujuan (samakan dengan DB_NAME di .env)
--    2) jalankan seluruh script ini
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =====================================================================
--  USERS  (auth: register / login / forgot-reset password)
--  Kolom sesuai INSERT & UPDATE di userApdModel.js + authApdController.js
--    - createUser -> (email, full_name, role, hashed_password, is_active)
--    - login      -> membaca hashed_password, full_name, role, username
--    - reset      -> reset_token, reset_expires
-- =====================================================================

CREATE TABLE IF NOT EXISTS `users` (
  `id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `email`           VARCHAR(150) NOT NULL,
  `full_name`       VARCHAR(150) NULL,
  `username`        VARCHAR(100) NULL,               -- dibaca saat login (opsional/legacy)
  `role`            VARCHAR(30)  NOT NULL DEFAULT 'user',   -- 'user' / 'admin' / dll
  `hashed_password` VARCHAR(255) NOT NULL,           -- bcrypt hash
  `is_active`       TINYINT(1)   NOT NULL DEFAULT 1,
  `reset_token`     VARCHAR(100) NULL,               -- crypto.randomBytes(20).hex = 40 char
  `reset_expires`   DATETIME     NULL,
  `created_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `uq_users_email` (`email`),
  KEY `idx_users_reset_token` (`reset_token`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
--  CAMERAS  (CRUD kamera + status online/offline)
--  Kolom sesuai INSERT/UPDATE di cameraApdModel.js
--    INSERT -> (name, location, description, rtsp_url, status,
--               created_at, updated_at, resolution, channel)
--    UPDATE -> juga menyentuh ip_address
--    status dibandingkan dengan 'online' / 'offline'
-- =====================================================================

CREATE TABLE IF NOT EXISTS `cameras` (
  `id`          INT UNSIGNED NOT NULL AUTO_INCREMENT,
  `name`        VARCHAR(150) NULL,
  `location`    VARCHAR(200) NULL,
  `description` VARCHAR(255) NULL,
  `ip_address`  VARCHAR(64)  NULL,
  `rtsp_url`    VARCHAR(500) NULL,
  `status`      VARCHAR(20)  NOT NULL DEFAULT 'offline',  -- 'online' / 'offline'
  `resolution`  VARCHAR(30)  NULL,                        -- mis. '1920x1080'
  `channel`     VARCHAR(30)  NULL,
  `created_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_cameras_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- =====================================================================
--  CONTAINER  (hasil deteksi objek/APD per frame)
--  Dipakai di apdModel.js. Query mengacu kolom:
--    id, detected_container_id, timestamp, id_camera, image_frame
--  JOIN: container.id_camera = cameras.id
--
--  Catatan:
--   - `detected_container_id` menyimpan daftar label dipisah koma
--     (mis. "No Helmet, No Vest, person") -> disimpan sebagai TEXT.
--   - `image_frame` = frame gambar deteksi. Bisa berupa path/URL file
--     atau base64. Dibuat LONGTEXT agar aman untuk base64; ganti ke
--     VARCHAR(500) bila hanya menyimpan path/URL.
--   - Data lama dibersihkan berdasarkan `timestamp` (deleteOldData).
-- =====================================================================

CREATE TABLE IF NOT EXISTS `container` (
  `id`                    BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  `detected_container_id` TEXT            NULL,      -- label deteksi dipisah koma
  `image_frame`           LONGTEXT        NULL,      -- path/URL atau base64 frame
  `id_camera`             INT UNSIGNED    NULL,
  `timestamp`             DATETIME        NULL,
  `created_at`            DATETIME        NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_container_camera` (`id_camera`),
  KEY `idx_container_timestamp` (`timestamp`),
  CONSTRAINT `fk_container_camera`
    FOREIGN KEY (`id_camera`) REFERENCES `cameras` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

SET FOREIGN_KEY_CHECKS = 1;

-- =====================================================================
--  SEED (opsional) — 1 user admin agar bisa langsung login.
--  Login: email = admin@pertamina.local  |  password = admin123
--  Hash di bawah = bcrypt('admin123'). Hapus/ubah sesuai kebutuhan.
-- =====================================================================

INSERT INTO `users` (`email`, `full_name`, `username`, `role`, `hashed_password`, `is_active`)
VALUES (
  'admin@pertamina.local', 'Administrator', 'admin', 'admin',
  '$2b$10$OvmyIDuRkLs6y9zvyYE9wuDBoBIeAgN4RaZsBEkjXIr9ssgbqpPFC', 1
)
ON DUPLICATE KEY UPDATE `full_name` = VALUES(`full_name`);
