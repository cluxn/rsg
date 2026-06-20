ALTER TABLE events
  ADD COLUMN event_type VARCHAR(50) NULL AFTER title,
  ADD COLUMN location VARCHAR(255) NULL AFTER event_type,
  ADD COLUMN excerpt VARCHAR(500) NULL AFTER location,
  ADD COLUMN cover_image VARCHAR(500) NULL AFTER excerpt,
  ADD COLUMN end_date DATE NULL AFTER event_date;
