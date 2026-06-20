ALTER TABLE blog_posts
  ADD COLUMN category VARCHAR(100) NULL AFTER title,
  ADD COLUMN excerpt VARCHAR(500) NULL AFTER category,
  ADD COLUMN featured_image VARCHAR(500) NULL AFTER excerpt,
  ADD COLUMN author_name VARCHAR(150) NULL AFTER featured_image;
