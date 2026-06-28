-- Admin activity log for accountability
CREATE TABLE IF NOT EXISTS admin_activity_log (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  admin_id   INT NULL,
  action     VARCHAR(100) NOT NULL,
  entity     VARCHAR(100) NOT NULL,
  entity_id  INT NULL,
  detail     TEXT NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_entity (entity, entity_id),
  INDEX idx_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
