import { Router } from 'express'
import { pool } from '../db.js'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware, adminMiddleware)

// ── Dashboard ──
router.get('/dashboard', async (req, res) => {
  const { rows: stats } = await pool.query(`
    SELECT
      (SELECT COALESCE(SUM(total), 0) FROM orders WHERE status != 'cancelled') as total_sales,
      (SELECT COUNT(*) FROM orders) as total_orders,
      (SELECT COUNT(*) FROM users WHERE is_admin = false) as total_customers,
      (SELECT COUNT(*) FROM products) as total_products
  `)
  const { rows: lowStock } = await pool.query(
    'SELECT id, name, stock, sku FROM products WHERE stock < 10 AND is_active = true ORDER BY stock ASC LIMIT 10'
  )
  const { rows: recentOrders } = await pool.query(`
    SELECT o.*, u.full_name as customer_name
    FROM orders o LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC LIMIT 10
  `)
  res.json({ ...stats[0], low_stock: lowStock, recent_orders: recentOrders })
})

// ── Products ──
router.get('/products', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, c.name as category_name
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
  `)
  res.json(rows)
})

router.post('/products', async (req, res) => {
  const { name, slug, description, price, discount_price, stock, sku, category_id,
    is_featured, is_new, is_best_seller, is_active, seo_title, seo_description, images, variants } = req.body

  const productSlug = slug || `product-${Date.now().toString(36)}`
  const { rows: [product] } = await pool.query(
    `INSERT INTO products (name, slug, description, price, discount_price, stock, sku, category_id,
      is_featured, is_new, is_best_seller, is_active, seo_title, seo_description)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [name, productSlug, description || '', price, discount_price || null, stock || 0, sku || null,
     category_id || null, !!is_featured, !!is_new, !!is_best_seller, is_active !== false,
     seo_title || null, seo_description || null]
  )

  if (images?.length) {
    for (let i = 0; i < images.length; i++)
      await pool.query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES ($1,$2,$3)',
        [product.id, images[i], i])
  }
  if (variants?.length) {
    for (const v of variants)
      await pool.query('INSERT INTO product_variants (product_id, name, value, stock, price_adjustment) VALUES ($1,$2,$3,$4,$5)',
        [product.id, v.name, v.value, v.stock || 0, v.price_adjustment || 0])
  }
  res.json(product)
})

router.put('/products/:id', async (req, res) => {
  const { id } = req.params
  const { name, slug, description, price, discount_price, stock, sku, category_id,
    is_featured, is_new, is_best_seller, is_active, seo_title, seo_description, images, variants } = req.body

  const { rows: [product] } = await pool.query(
    `UPDATE products SET name=$1, slug=$2, description=$3, price=$4, discount_price=$5, stock=$6,
      sku=$7, category_id=$8, is_featured=$9, is_new=$10, is_best_seller=$11, is_active=$12,
      seo_title=$13, seo_description=$14 WHERE id=$15 RETURNING *`,
    [name, slug, description || '', price, discount_price || null, stock || 0, sku || null,
     category_id || null, !!is_featured, !!is_new, !!is_best_seller, is_active !== false,
     seo_title || null, seo_description || null, id]
  )
  if (!product) return res.status(404).json({ error: 'محصول یافت نشد' })

  await pool.query('DELETE FROM product_images WHERE product_id = $1', [id])
  if (images?.length) {
    for (let i = 0; i < images.length; i++)
      await pool.query('INSERT INTO product_images (product_id, image_url, sort_order) VALUES ($1,$2,$3)',
        [id, images[i], i])
  }
  await pool.query('DELETE FROM product_variants WHERE product_id = $1', [id])
  if (variants?.length) {
    for (const v of variants)
      await pool.query('INSERT INTO product_variants (product_id, name, value, stock, price_adjustment) VALUES ($1,$2,$3,$4,$5)',
        [id, v.name, v.value, v.stock || 0, v.price_adjustment || 0])
  }
  res.json(product)
})

router.delete('/products/:id', async (req, res) => {
  await pool.query('DELETE FROM products WHERE id = $1', [req.params.id])
  res.json({ success: true })
})

// ── Categories ──
router.get('/categories', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM categories ORDER BY sort_order ASC, id ASC')
  res.json(rows)
})

router.post('/categories', async (req, res) => {
  const { name, slug, description, image_url, sort_order, is_active } = req.body
  const { rows: [cat] } = await pool.query(
    'INSERT INTO categories (name, slug, description, image_url, sort_order, is_active) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
    [name, slug || `cat-${Date.now().toString(36)}`, description || '', image_url || null, sort_order || 0, is_active !== false]
  )
  res.json(cat)
})

router.put('/categories/:id', async (req, res) => {
  const { name, slug, description, image_url, sort_order, is_active } = req.body
  const { rows: [cat] } = await pool.query(
    'UPDATE categories SET name=$1, slug=$2, description=$3, image_url=$4, sort_order=$5, is_active=$6 WHERE id=$7 RETURNING *',
    [name, slug, description || '', image_url || null, sort_order || 0, is_active !== false, req.params.id]
  )
  res.json(cat)
})

router.delete('/categories/:id', async (req, res) => {
  await pool.query('DELETE FROM categories WHERE id = $1', [req.params.id])
  res.json({ success: true })
})

// ── Orders ──
router.get('/orders', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT o.*, u.full_name as customer_name, u.phone as customer_phone
    FROM orders o LEFT JOIN users u ON o.user_id = u.id
    ORDER BY o.created_at DESC
  `)
  res.json(rows)
})

router.put('/orders/:id/status', async (req, res) => {
  const { status } = req.body
  const { rows: [order] } = await pool.query(
    'UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]
  )
  res.json(order)
})

router.get('/orders/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1', [req.params.id])
  if (!rows.length) return res.status(404).json({ error: 'سفارش یافت نشد' })
  const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [req.params.id])
  res.json({ ...rows[0], items })
})

// ── Customers ──
router.get('/customers', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT u.id, u.phone, u.full_name, u.email, u.created_at,
      (SELECT COUNT(*) FROM orders WHERE user_id = u.id) as order_count,
      (SELECT COALESCE(SUM(total),0) FROM orders WHERE user_id = u.id AND status != 'cancelled') as total_spent
    FROM users u WHERE u.is_admin = false ORDER BY u.created_at DESC
  `)
  res.json(rows)
})

router.get('/customers/:id', async (req, res) => {
  const { rows } = await pool.query('SELECT id, phone, full_name, email, created_at FROM users WHERE id = $1', [req.params.id])
  if (!rows.length) return res.status(404).json({ error: 'کاربر یافت نشد' })
  const { rows: orders } = await pool.query('SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.params.id])
  res.json({ ...rows[0], orders })
})

// ── Discounts ──
router.get('/discounts', async (req, res) => {
  const { rows } = await pool.query('SELECT * FROM discounts ORDER BY created_at DESC')
  res.json(rows)
})

router.post('/discounts', async (req, res) => {
  const { code, type, value, product_id, category_id, expires_at, usage_limit, is_active } = req.body
  const { rows: [d] } = await pool.query(
    `INSERT INTO discounts (code, type, value, product_id, category_id, expires_at, usage_limit, is_active)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [code, type, value, product_id || null, category_id || null, expires_at || null, usage_limit || null, is_active !== false]
  )
  res.json(d)
})

router.delete('/discounts/:id', async (req, res) => {
  await pool.query('DELETE FROM discounts WHERE id = $1', [req.params.id])
  res.json({ success: true })
})

// ── Settings ──
router.get('/settings', async (req, res) => {
  const { rows } = await pool.query('SELECT key, value FROM settings')
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])))
})

router.put('/settings', async (req, res) => {
  for (const [key, value] of Object.entries(req.body)) {
    await pool.query(
      'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT (key) DO UPDATE SET value = $2',
      [key, String(value)]
    )
  }
  res.json({ success: true })
})

export default router
