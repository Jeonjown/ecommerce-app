import pool from '../db';
import { faker } from '@faker-js/faker';
import { createSlug } from '../utils/createSlug';
import { generateSku } from '../utils/generateSku';

async function seed() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1️⃣ Clear tables in order
    await pool.query('DELETE FROM product_variants');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');

    // 2️⃣ Insert categories
    const categories = [
      'Laptops',
      'Monitors',
      'Mechanical Keyboards',
      'Gaming Mice',
      'Headphones',
    ];
    const categoryIds: number[] = [];

    for (const name of categories) {
      const slug = createSlug(name);
      const [result]: any = await pool.query(
        'INSERT INTO categories (name, slug) VALUES (?, ?)',
        [name, slug]
      );
      categoryIds.push(result.insertId);
    }
    console.log(`✅ Inserted ${categories.length} categories.`);

    // 3️⃣ Insert products
    const productNames = [
      'Gaming Laptop',
      'Ultrawide Monitor',
      'Mechanical Keyboard',
      'Wireless Gaming Mouse',
      'Noise Cancelling Headphones',
    ];
    const productIds: number[] = [];

    for (const name of productNames) {
      const categoryId = faker.helpers.arrayElement(categoryIds);
      const description = faker.commerce.productDescription();
      const slug = createSlug(name);

      const [result]: any = await pool.query(
        `INSERT INTO products (category_id, name, description, is_active, slug, created_at, updated_at)
         VALUES (?, ?, ?, 1, ?, NOW(), NOW())`,
        [categoryId, name, description, slug]
      );
      productIds.push(result.insertId);
    }
    console.log(`✅ Inserted ${productNames.length} products.`);

    // 4️⃣ Insert product variants with option1, option2, option3
    const option1Values = ['Black', 'White', 'Silver'];
    const option2Values = ['Small', 'Medium', 'Large'];
    const option3Values = ['Standard', 'Pro', 'Ultra'];

    let variantCount = 0;

    for (const productId of productIds) {
      const [[{ name: productName }]]: any = await pool.query(
        'SELECT name FROM products WHERE id = ?',
        [productId]
      );

      const numVariants = faker.number.int({ min: 2, max: 3 });

      for (let i = 0; i < numVariants; i++) {
        const option1 = faker.helpers.arrayElement(option1Values);
        const option2 = faker.helpers.arrayElement(option2Values);
        const option3 = faker.helpers.arrayElement(option3Values);

        const price = faker.commerce.price({ min: 100, max: 2000 });
        const stock = faker.number.int({ min: 10, max: 100 });
        const image_url = faker.image.urlLoremFlickr({
          category: 'technology',
          width: 800,
          height: 600,
        });
        const sku = generateSku(productName, option1, option2, option3);

        await pool.query(
          `INSERT INTO product_variants
            (product_id, option1, option2, option3, price, stock, is_active, image_url, sku, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?, NOW(), NOW())`,
          [productId, option1, option2, option3, price, stock, image_url, sku]
        );

        variantCount++;
      }
    }

    console.log(`✅ Inserted ${variantCount} product variants.`);
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seed();
