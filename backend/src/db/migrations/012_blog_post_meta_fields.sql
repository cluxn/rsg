ALTER TABLE blog_posts
  ADD COLUMN service VARCHAR(100) NULL AFTER category,
  ADD COLUMN industry VARCHAR(100) NULL AFTER service,
  ADD COLUMN featured BOOLEAN DEFAULT FALSE AFTER author_name,
  ADD COLUMN status ENUM('draft', 'scheduled', 'published') DEFAULT 'draft' AFTER published,
  ADD COLUMN scheduled_at TIMESTAMP NULL AFTER status,
  ADD COLUMN canonical_url VARCHAR(255) NULL AFTER meta_description,
  ADD COLUMN og_image VARCHAR(500) NULL AFTER canonical_url;

UPDATE blog_posts SET status = IF(published = TRUE, 'published', 'draft') WHERE status = 'draft';
