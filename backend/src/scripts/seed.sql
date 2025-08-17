
SET FOREIGN_KEY_CHECKS = 0;

TRUNCATE TABLE product_variant_values;
TRUNCATE TABLE product_variants;
TRUNCATE TABLE product_option_values;
TRUNCATE TABLE product_options;
TRUNCATE TABLE products;
TRUNCATE TABLE categories;

ALTER TABLE product_options AUTO_INCREMENT = 1;
ALTER TABLE product_option_values AUTO_INCREMENT = 1;
ALTER TABLE product_variants AUTO_INCREMENT = 1;
ALTER TABLE product_variant_values AUTO_INCREMENT = 1;
ALTER TABLE products AUTO_INCREMENT = 1;
ALTER TABLE categories AUTO_INCREMENT = 1;

SET FOREIGN_KEY_CHECKS = 1;


-- 1. Categories

INSERT INTO categories (name, slug, created_at, updated_at) VALUES
('Laptops', 'laptops', NOW(), NOW()),
('Smartphones', 'smartphones', NOW(), NOW()), 
('Tablets & E-Readers', 'tablets-e-readers', NOW(), NOW()),
('PC Components', 'pc-components', NOW(), NOW()),
('Gaming Consoles', 'gaming-consoles', NOW(), NOW()),
('Computer Accessories', 'computer-accessories', NOW(), NOW()),
('Networking Equipment', 'networking-equipment', NOW(), NOW()),
('Wearable Tech', 'wearable-tech', NOW(), NOW()),
('Smart Home Devices', 'smart-home-devices', NOW(), NOW()),
('Audio & Headphones', 'audio-headphones', NOW(), NOW());

-- 2. Products (depends on categories)
INSERT INTO products (category_id, name, brand, slug, description, is_active, created_at, updated_at) VALUES
(1, 'MacBook Air 13-inch M2', 'Apple', 'macbook-air-13-m2', 'Thin and light laptop...', 1, NOW(), NOW()),
(1, 'ThinkPad X1 Carbon Gen 11', 'Lenovo', 'thinkpad-x1-carbon-gen-11', 'Business ultrabook...', 1, NOW(), NOW()),
(2, 'iPhone 15', 'Apple', 'iphone-15', 'Flagship smartphone...', 1, NOW(), NOW()),
(2, 'Galaxy A54 5G', 'Samsung', 'samsung-galaxy-a54-5g', 'Mid-range 5G...', 1, NOW(), NOW()),
(2, 'Pixel 8a', 'Google', 'google-pixel-8a', 'Clean Android...', 1, NOW(), NOW()),
(3, 'iPad Air 10.9-inch', 'Apple', 'ipad-air-10-9', 'Lightweight tablet...', 1, NOW(), NOW()),
(3, 'Kindle Oasis', 'Amazon', 'kindle-oasis', 'Premium e-reader...', 1, NOW(), NOW()),
(4, 'NVIDIA GeForce RTX 4070 Ti', 'NVIDIA', 'nvidia-geforce-rtx-4070-ti', 'High-performance GPU...', 1, NOW(), NOW()),
(4, 'Samsung 980 Pro 2TB NVMe SSD', 'Samsung', 'samsung-980-pro-2tb', 'High-speed NVMe SSD...', 1, NOW(), NOW()),
(4, 'AMD Ryzen 7 7800X3D', 'AMD', 'amd-ryzen-7-7800x3d', 'Gaming-focused CPU...', 1, NOW(), NOW()),
(5, 'Nintendo Switch OLED', 'Nintendo', 'nintendo-switch-oled', 'Portable/home hybrid...', 1, NOW(), NOW()),
(5, 'Steam Deck 512GB', 'Valve', 'steam-deck-512gb', 'Handheld gaming PC...', 1, NOW(), NOW()),
(6, 'Logitech G502 HERO', 'Logitech', 'logitech-g502-hero', 'Wired gaming mouse...', 1, NOW(), NOW()),
(6, 'Keychron K2 Wireless', 'Keychron', 'keychron-k2-wireless', 'Compact mechanical keyboard...', 1, NOW(), NOW()),
(7, 'Ubiquiti UniFi 6 Long-Range', 'Ubiquiti', 'ubiquiti-unifi-6-lr', 'Wi-Fi 6 access point...', 1, NOW(), NOW()),
(7, 'TP-Link Archer AX50', 'TP-Link', 'tp-link-archer-ax50', 'Affordable Wi-Fi 6...', 1, NOW(), NOW()),
(8, 'Garmin Forerunner 265', 'Garmin', 'garmin-forerunner-265', 'Advanced running smartwatch...', 1, NOW(), NOW()),
(8, 'Fitbit Inspire 3', 'Fitbit', 'fitbit-inspire-3', 'Slim fitness tracker...', 1, NOW(), NOW()),
(9, 'Philips Hue Starter Kit (3 bulbs + bridge)', 'Philips', 'philips-hue-starter-kit-3', 'Smart lighting kit...', 1, NOW(), NOW()),
(10, 'Sennheiser HD 660S2', 'Sennheiser', 'sennheiser-hd-660s2', 'Open-back headphones...', 1, NOW(), NOW());

-- 3. Product Options (depends on products)
INSERT INTO product_options (id, product_id, name, created_at, updated_at) VALUES
(1, 1, 'Memory', NOW(), NOW()),
(2, 1, 'Storage', NOW(), NOW()),
(3, 2, 'Memory', NOW(), NOW()),
(4, 2, 'Storage', NOW(), NOW()),
(5, 3, 'Color', NOW(), NOW()),
(6, 3, 'Storage', NOW(), NOW()),
(7, 4, 'Color', NOW(), NOW()),
(8, 4, 'Storage', NOW(), NOW());

-- 4. Product Option Values (depends on product_options)
INSERT INTO product_option_values (id, product_option_id, value, slug, created_at, updated_at) VALUES
(1, 1, '8GB', 'macbook-8gb', NOW(), NOW()),
(2, 1, '16GB', 'macbook-16gb', NOW(), NOW()),
(3, 2, '256GB', 'macbook-256gb', NOW(), NOW()),
(4, 2, '512GB', 'macbook-512gb', NOW(), NOW()),
(5, 3, '16GB', 'thinkpad-16gb', NOW(), NOW()),
(6, 3, '32GB', 'thinkpad-32gb', NOW(), NOW()),
(7, 4, '512GB', 'thinkpad-512gb', NOW(), NOW()),
(8, 4, '1TB', 'thinkpad-1tb', NOW(), NOW()),
(9, 5, 'Black', 'iphone-black', NOW(), NOW()),
(10, 5, 'White', 'iphone-white', NOW(), NOW()),
(11, 6, '128GB', 'iphone-128gb', NOW(), NOW()),
(12, 6, '256GB', 'iphone-256gb', NOW(), NOW());

-- 5. Product Variants (price *100 to store cents!)
INSERT INTO product_variants 
(product_id, sku, price, name, description, stock, image_url, is_active, created_at, updated_at) 
VALUES
(1, 'MAC-AIR-13-M2-8-256', 119900, 'MacBook Air 13\" M2 — 8GB / 256GB', 'Thin & light M2 MacBook...', 50, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053816/headphones-removebg-preview_tfn3ts.png', 1, NOW(), NOW()),
(2, 'TLP-X1C-GEN11-16-512', 199900, 'ThinkPad X1 Carbon Gen 11 — 16GB / 512GB', 'Business ultrabook...', 30, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053817/mouse-removebg-preview_lcuvak.png', 1, NOW(), NOW()),
(3, 'IP15-128-BLK', 79900, 'iPhone 15 — 128GB', 'Flagship-level camera...', 120, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/earbuds-removebg-preview_lf4k66.png', 1, NOW(), NOW()),
(4, 'SMA-A54-128-GRN', 34900, 'Samsung Galaxy A54 5G — 128GB', 'Value-focused 5G phone...', 85, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/keyboard-removebg-preview_lvjr0f.png', 1, NOW(), NOW()),
(5, 'GPX-8A-128-SIL', 34900, 'Google Pixel 8a — 128GB', 'Clean Android experience...', 70, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053814/monitor-removebg-preview_kwq61i.png', 1, NOW(), NOW()),
(6, 'IPAD-AIR-10-9-8-256', 59900, 'iPad Air 10.9\" — 8GB / 256GB', 'Lightweight tablet...', 28, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053816/headphones-removebg-preview_tfn3ts.png', 1, NOW(), NOW()),
(7, 'KNDL-OASIS-32', 24900, 'Kindle Oasis — 32GB', 'Premium E-ink reader...', 60, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053817/mouse-removebg-preview_lcuvak.png', 1, NOW(), NOW()),
(8, 'RTX-4070TI-OC', 79900, 'NVIDIA GeForce RTX 4070 Ti — Founders/OC', 'High-performance GPU...', 12, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/earbuds-removebg-preview_lf4k66.png', 1, NOW(), NOW()),
(9, 'S980PRO-2TB', 24900, 'Samsung 980 Pro 2TB NVMe', 'PCIe 4.0 NVMe SSD...', 40, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/keyboard-removebg-preview_lvjr0f.png', 1, NOW(), NOW()),
(10, 'RYZ-7-7800X3D', 44900, 'AMD Ryzen 7 7800X3D', 'Gaming-focused CPU...', 15, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053814/monitor-removebg-preview_kwq61i.png', 1, NOW(), NOW()),
(11, 'NSW-OLED-DOCK', 34900, 'Nintendo Switch OLED — Console', 'OLED-screen hybrid...', 55, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053816/headphones-removebg-preview_tfn3ts.png', 1, NOW(), NOW()),
(12, 'STEAM-DECK-512', 64900, 'Steam Deck — 512GB', 'Handheld PC for native...', 18, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053817/mouse-removebg-preview_lcuvak.png', 1, NOW(), NOW()),
(13, 'LOG-G502-HERO', 4999, 'Logitech G502 HERO', 'Wired gaming mouse...', 120, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/earbuds-removebg-preview_lf4k66.png', 1, NOW(), NOW()),
(14, 'KCHR-K2-BLUETOOTH', 7999, 'Keychron K2 Wireless', 'Compact mechanical keyboard...', 65, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/keyboard-removebg-preview_lvjr0f.png', 1, NOW(), NOW()),
(15, 'UBNT-U6-LR', 19900, 'Ubiquiti UniFi 6 Long-Range', 'Wi-Fi 6 access point...', 24, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053814/monitor-removebg-preview_kwq61i.png', 1, NOW(), NOW()),
(16, 'TPAX50-ROUTER', 12900, 'TP-Link Archer AX50', 'Affordable Wi-Fi 6 router...', 36, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053816/headphones-removebg-preview_tfn3ts.png', 1, NOW(), NOW()),
(17, 'GRMN-FR265', 34900, 'Garmin Forerunner 265', 'Advanced running smartwatch...', 40, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053817/mouse-removebg-preview_lcuvak.png', 1, NOW(), NOW()),
(18, 'FBT-INSP3-BLK', 7995, 'Fitbit Inspire 3', 'Slim fitness tracker...', 75, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/earbuds-removebg-preview_lf4k66.png', 1, NOW(), NOW()),
(19, 'HUE-START-3', 14900, 'Philips Hue Starter Kit', 'Color smart lighting...', 33, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/keyboard-removebg-preview_lvjr0f.png', 1, NOW(), NOW()),
(20, 'SENN-HD660S2', 49900, 'Sennheiser HD 660S2', 'Open-back reference headphones...', 22, 'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053814/monitor-removebg-preview_kwq61i.png', 1, NOW(), NOW());

-- 6. Product Variant Values (depends on variants + option_values)
INSERT INTO product_variant_values (id, product_variant_id, product_option_id, product_option_value_id, created_at, updated_at) VALUES
(1, 1, 1, 1, NOW(), NOW()),
(2, 1, 2, 3, NOW(), NOW()),
(3, 2, 1, 2, NOW(), NOW()),
(4, 2, 2, 4, NOW(), NOW()),
(5, 3, 5, 9, NOW(), NOW()),
(6, 3, 6, 11, NOW(), NOW()),
(7, 4, 7, 10, NOW(), NOW()),
(8, 4, 8, 12, NOW(), NOW());


ALTER TABLE categories AUTO_INCREMENT = 11;
ALTER TABLE products AUTO_INCREMENT = 21;
ALTER TABLE product_options AUTO_INCREMENT = 9;
ALTER TABLE product_option_values AUTO_INCREMENT = 17;
ALTER TABLE product_variants AUTO_INCREMENT = 21;
ALTER TABLE product_variant_values AUTO_INCREMENT = 9;
