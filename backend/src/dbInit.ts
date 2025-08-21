import pool from './db';

export async function initDb() {
  const tables = [
    // 1. users
    `CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role ENUM('admin', 'user') DEFAULT 'user',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`,

    // 2. addresses (linked to users)
    `CREATE TABLE IF NOT EXISTS addresses (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      full_name VARCHAR(255),
      phone VARCHAR(30),
      street_address TEXT,
      city VARCHAR(100),
      province VARCHAR(100),
      postal_code VARCHAR(20),
      country VARCHAR(100) DEFAULT 'Philippines',
      is_default TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`,

    // 3. categories
    `CREATE TABLE IF NOT EXISTS categories (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`,

    // 4. products
    `CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      category_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      brand VARCHAR(100) NOT NULL,
      slug VARCHAR(255) NOT NULL UNIQUE,
      description TEXT,
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
    )`,

    // 5. product_options
    `CREATE TABLE IF NOT EXISTS product_options (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      name VARCHAR(100) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`,

    // 6. product_option_values
    `CREATE TABLE IF NOT EXISTS product_option_values (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_option_id INT NOT NULL,
      value VARCHAR(100) NOT NULL,
      slug VARCHAR(100) NOT NULL UNIQUE,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_option_id) REFERENCES product_options(id) ON DELETE CASCADE
    )`,

    // 7. product_variants
    `CREATE TABLE IF NOT EXISTS product_variants (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_id INT NOT NULL,
      sku VARCHAR(100) UNIQUE,
      price INT NOT NULL,
      name TEXT,
      description TEXT,
      stock INT DEFAULT 0,
      image_url VARCHAR(255),
      is_active TINYINT(1) DEFAULT 1,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
    )`,

    // 8. product_variant_values
    `CREATE TABLE IF NOT EXISTS product_variant_values (
      id INT AUTO_INCREMENT PRIMARY KEY,
      product_variant_id INT NOT NULL,
      product_option_id INT NOT NULL,
      product_option_value_id INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (product_variant_id) REFERENCES product_variants(id) ON DELETE CASCADE,
      FOREIGN KEY (product_option_id) REFERENCES product_options(id) ON DELETE CASCADE,
      FOREIGN KEY (product_option_value_id) REFERENCES product_option_values(id) ON DELETE CASCADE
    )`,

    // 9. cart
    `CREATE TABLE IF NOT EXISTS cart (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      product_id INT NOT NULL,
      variant_id INT NOT NULL,
      name VARCHAR(255) NOT NULL,
      price INT NOT NULL,
      image_url VARCHAR(255),
      quantity INT NOT NULL DEFAULT 1,
      stock INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      UNIQUE KEY unique_cart (user_id, variant_id),
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
    )`,

    // 10. orders
    `CREATE TABLE IF NOT EXISTS orders (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      
      payment_method ENUM('cod', 'online') NOT NULL,
      payment_status ENUM('unpaid', 'pending', 'paid', 'failed', 'refunded') DEFAULT 'unpaid',
      order_status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
      refund_status ENUM('none','requested','processing','completed','rejected'),
      cancellation_reason text NULL,

      total_price INT NOT NULL,
      delivery_address TEXT,

      stripe_session_id VARCHAR(255) UNIQUE NULL,
      stripe_payment_intent_id VARCHAR(255) UNIQUE NULL,
      payment_details JSON NULL,

      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`,

    // 11. order_items
    `CREATE TABLE IF NOT EXISTS order_items (
      id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT NOT NULL,
      product_id INT NOT NULL,
      variant_id INT NOT NULL,
      quantity INT NOT NULL,
      unit_price INT NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
      FOREIGN KEY (variant_id) REFERENCES product_variants(id) ON DELETE CASCADE
    )`,
  ];

  for (const sql of tables) {
    try {
      await pool.query(sql);
    } catch (err) {
      console.error('Failed to run SQL:', err);
      throw err;
    }
  }

  console.log('✅ All tables ensured.');
}
