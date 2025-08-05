import { RowDataPacket } from 'mysql2';
import pool from '../db';
import { faker } from '@faker-js/faker';
import { generateSlug } from '../utils/generateSlug';
import { generateSku } from '../utils/generateSku';

async function seed() {
  console.log('🌱 Starting flexible database seeding...');

  try {
    // 1️⃣ Clear tables
    await pool.query('DELETE FROM product_variant_values');
    await pool.query('DELETE FROM product_variants');
    await pool.query('DELETE FROM product_option_values');
    await pool.query('DELETE FROM product_options');
    await pool.query('DELETE FROM products');
    await pool.query('DELETE FROM categories');

    // 2️⃣ Insert categories
    const categories = [
      'Laptops',
      'Monitors',
      'Keyboards',
      'Mice',
      'Headphones',
    ];
    const categoryIds: number[] = [];

    for (const name of categories) {
      const slug = await generateSlug(name, 'categories');
      const [res]: any = await pool.query(
        'INSERT INTO categories(name,slug) VALUES(?,?)',
        [name, slug]
      );
      categoryIds.push(res.insertId);
    }
    console.log(`✅ Inserted ${categories.length} categories.`);

    // 3️⃣ Define options
    const optionSets = [
      { name: 'Color', values: ['Black', 'White', 'Silver'] },
      { name: 'Size', values: ['Small', 'Medium', 'Large'] },
      { name: 'Edition', values: ['Standard', 'Pro', 'Ultra'] },
    ];

    // 4️⃣ Images
    const imageUrls = [
      'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053816/headphones-removebg-preview_tfn3ts.png',
      'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053817/mouse-removebg-preview_lcuvak.png',
      'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/earbuds-removebg-preview_lf4k66.png',
      'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053815/keyboard-removebg-preview_lvjr0f.png',
      'https://res.cloudinary.com/dgf5yareo/image/upload/v1754053814/monitor-removebg-preview_kwq61i.png',
    ];

    const productNames = [
      'Gaming Laptop',
      'Ultrawide Monitor',
      'Mechanical Keyboard',
      'Wireless Mouse',
      'Studio Headphones',
    ];

    let totalVariants = 0;
    let imageIndex = 0;

    for (const productName of productNames) {
      const categoryId = faker.helpers.arrayElement(categoryIds);
      const description = faker.commerce.productDescription();
      const prodSlug = await generateSlug(productName, 'products');

      const [pRes]: any = await pool.query(
        `INSERT INTO products
         (category_id, name, description, slug, is_active, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
        [categoryId, productName, description, prodSlug, 1]
      );
      const productId = pRes.insertId;

      const optId: Record<string, number> = {};
      const valMap: Record<string, number[]> = {};

      for (const { name: optName, values } of optionSets) {
        const [oRes]: any = await pool.query(
          'INSERT INTO product_options(product_id,name) VALUES(?,?)',
          [productId, optName]
        );
        optId[optName] = oRes.insertId;
        valMap[optName] = [];

        for (const v of values) {
          const vSlug = await generateSlug(v, 'product_option_values');
          const [vRes]: any = await pool.query(
            `INSERT INTO product_option_values
             (product_option_id,value,slug,created_at,updated_at)
             VALUES(?,?,?,NOW(),NOW())`,
            [optId[optName], v, vSlug]
          );
          valMap[optName].push(vRes.insertId);
        }
      }

      const nv = faker.number.int({ min: 2, max: 3 });

      for (let i = 0; i < nv; i++) {
        const picks: { opt: string; valId: number }[] = [];
        const names: string[] = [];

        for (const { name: optName } of optionSets) {
          const arr = valMap[optName];
          const vid = faker.helpers.arrayElement(arr);
          picks.push({ opt: optName, valId: vid });

          const [[row]] = (await pool.query<RowDataPacket[]>(
            'SELECT value FROM product_option_values WHERE id=?',
            [vid]
          )) as any;
          names.push(row.value);
        }

        const sku = await generateSku(
          productName,
          picks.map(({ opt }, i) => ({
            name: opt,
            value: names[i],
          }))
        );

        const variantName = `${productName} - ${names.join(' / ')}`;
        const variantDescription = faker.commerce.productDescription();
        const price = faker.commerce.price({ min: 100, max: 2000 });
        const stock = faker.number.int({ min: 10, max: 50 });
        const img = imageUrls[imageIndex % imageUrls.length];
        imageIndex++;

        const [vRes]: any = await pool.query(
          `INSERT INTO product_variants
           (product_id, name, description, sku, price, stock, image_url, is_active, created_at, updated_at)
           VALUES(?,?,?,?,?,?,?,1,NOW(),NOW())`,
          [productId, variantName, variantDescription, sku, price, stock, img]
        );
        const vid = vRes.insertId;

        for (const { opt, valId } of picks) {
          await pool.query(
            `INSERT INTO product_variant_values
             (product_variant_id, product_option_id, product_option_value_id, created_at, updated_at)
             VALUES (?, ?, ?, NOW(), NOW())`,
            [vid, optId[opt], valId]
          );
        }

        totalVariants++;
      }
    }

    console.log(
      `✅ Inserted ${productNames.length} products with ${totalVariants} variants.`
    );
    console.log('🎉 Seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during seeding:', err);
    process.exit(1);
  }
}

seed();
