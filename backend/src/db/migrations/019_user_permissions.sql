ALTER TABLE admin_users
  ADD COLUMN IF NOT EXISTS permissions JSON NULL COMMENT 'null = all access, array = allowed module keys';
