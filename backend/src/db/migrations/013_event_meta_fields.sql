ALTER TABLE events
  ADD COLUMN meta_title VARCHAR(255) NULL AFTER cover_image,
  ADD COLUMN meta_description TEXT NULL AFTER meta_title,
  ADD COLUMN canonical_url VARCHAR(255) NULL AFTER meta_description,
  ADD COLUMN og_image VARCHAR(500) NULL AFTER canonical_url,
  ADD COLUMN featured BOOLEAN DEFAULT FALSE AFTER end_date,
  ADD COLUMN status ENUM('draft', 'scheduled', 'published') DEFAULT 'draft' AFTER published,
  ADD COLUMN scheduled_at TIMESTAMP NULL AFTER status,
  ADD COLUMN published_at TIMESTAMP NULL AFTER scheduled_at;

UPDATE events SET status = IF(published = TRUE, 'published', 'draft') WHERE status = 'draft';
UPDATE events SET published_at = created_at WHERE published = TRUE AND published_at IS NULL;
