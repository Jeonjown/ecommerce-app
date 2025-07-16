// src/scripts/seed.ts
import pool from '../db';
import { faker } from '@faker-js/faker';
import { createSlug } from '../utils/createSlug';
import { generateSku } from '../utils/generateSku';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // Clean up tables in correct order
    await pool.query('DELETE FROM product_variants');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');

    // Step 1: Insert tech-related categories
    const categories = [
      'Laptops',
      'Monitors',
      'Mechanical Keyboards',
      'Gaming Mice',
      'Headphones',
    ];

    const insertedCategoryIds: number[] = [];

    for (const name of categories) {
      const slug = createSlug(name);
      const [result]: any = await pool.query(
        `INSERT INTO categories (name, slug) VALUES (?, ?)`,
        [name, slug]
      );
      insertedCategoryIds.push(result.insertId);
    }

    console.log(`✅ Inserted ${categories.length} categories.`);

    // Step 2: Insert tech-related products
    const techProducts = [
      'Gaming Laptop',
      'Ultrawide Monitor',
      'Mechanical Keyboard',
      'Wireless Gaming Mouse',
      'Noise Cancelling Headphones',
      'Streaming Webcam',
      'Portable SSD',
      'USB-C Docking Station',
      'Curved Monitor',
      'Mechanical Keypad',
    ];

    const insertedProductIds: number[] = [];

    for (let i = 0; i < techProducts.length; i++) {
      const name = techProducts[i];
      const categoryId = faker.helpers.arrayElement(insertedCategoryIds);
      const description = faker.commerce.productDescription();
      const image_url = faker.image.urlLoremFlickr({
        category: 'technology',
        width: 800,
        height: 600,
      });
      const slug = createSlug(name);
      const is_active = true;

      const [result]: any = await pool.query(
        `INSERT INTO products
         (category_id, name, description, image_url, is_active, slug, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [categoryId, name, description, image_url, is_active, slug]
      );

      insertedProductIds.push(result.insertId);
    }

    console.log(`✅ Inserted ${techProducts.length} products.`);

    // Step 3: Insert variants with all 3 options
    const option1Values = ['Black', 'White', 'Silver', 'Red', 'Blue'];
    const option2Values = ['Small', 'Medium', 'Large'];
    const option3Values = ['Standard', 'Pro', 'Ultra'];

    for (const productId of insertedProductIds) {
      const numVariants = faker.number.int({ min: 1, max: 3 });

      const [[productRow]]: any = await pool.query(
        'SELECT name FROM products WHERE id = ?',
        [productId]
      );
      const productName = productRow.name;

      for (let i = 0; i < numVariants; i++) {
        const option1 = faker.helpers.arrayElement(option1Values);
        const option2 = faker.helpers.arrayElement(option2Values);
        const option3 = faker.helpers.arrayElement(option3Values);
        const price = parseFloat(
          faker.commerce.price({ min: 50, max: 2000, dec: 2 })
        );
        const stock = faker.number.int({ min: 5, max: 50 });
        const sku = generateSku(productName, option1, option2, option3);
        const is_active = 1;

        await pool.query(
          `INSERT INTO product_variants
           (product_id, option1, option2, option3, price, stock, sku, is_active, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [productId, option1, option2, option3, price, stock, sku, is_active]
        );
      }
    }

    console.log(`✅ Inserted variants with all 3 options.`);
    console.log('🎉 Seeding complete!');

    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seed();
