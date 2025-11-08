ALTER TABLE products ADD COLUMN display_order INT DEFAULT 0;

-- Set initial display order based on existing product IDs
UPDATE products SET display_order = id WHERE display_order = 0;
