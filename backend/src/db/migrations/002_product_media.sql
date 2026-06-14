-- Product media junction table
-- Run: npm run migrate

CREATE TABLE IF NOT EXISTS product_media (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  media_id INT NOT NULL,
  display_order INT DEFAULT 0,
  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
  FOREIGN KEY (media_id) REFERENCES media(id) ON DELETE RESTRICT,
  UNIQUE KEY unique_product_media (product_id, media_id)
);
