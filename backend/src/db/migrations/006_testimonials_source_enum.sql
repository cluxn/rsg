ALTER TABLE testimonials
  MODIFY COLUMN source ENUM('google', 'indiamart', 'justdial', 'other') DEFAULT 'google';
