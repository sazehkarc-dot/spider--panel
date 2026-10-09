import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

// Specific routes must come before :slug
router.get('/featured/all', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_featured = true AND p.is_active = true ORDER BY p.created_at DESC LIMIT 8
  `)
  res.json(rows)
})

router.get('/new/all', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_new = true AND p.is_active = true ORDER BY p.created_at DESC LIMIT 8
  `)
  res.json(rows)
})

router.get('/best-sellers/all', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.is_best_seller = true AND p.is_active = true ORDER BY p.created_at DESC LIMIT 8
  `)
  res.json(rows)
})

router.get('/special-offers/all', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.discount_price IS NOT NULL AND p.is_active = true ORDER BY p.created_at DESC LIMIT 8
  `)
  res.json(rows)
})

router.get('/', async (req, res) => {
  const { category, search, sort, min_price, max_price, in_stock } = req.query
  const where = ['p.is_active = true']
  const params = []
  let idx = 1

  if (category) { where.push(`c.slug = $${idx++}`); params.push(category) }
  if (search) {
    where.push(`(p.name ILIKE $${idx} OR p.sku ILIKE $${idx} OR p.description ILIKE $${idx})`)
    params.push(`%${search}%`); idx++
  }
  if (min_price) { where.push(`COALESCE(p.discount_price, p.price) >= $${idx++}`); params.push(parseInt(min_price)) }
  if (max_price) { where.push(`COALESCE(p.discount_price, p.price) <= $${idx++}`); params.push(parseInt(max_price)) }
  if (in_stock === 'true') where.push(`p.stock > 0`)

  let orderBy = 'p.created_at DESC'
  if (sort === 'best_seller') orderBy = 'p.is_best_seller DESC, p.created_at DESC'
  if (sort === 'price_low') orderBy = 'COALESCE(p.discount_price, p.price) ASC'
  if (sort === 'price_high') orderBy = 'COALESCE(p.discount_price, p.price) DESC'

  const { rows } = await pool.query(
    `SELECT p.*, c.name as category_name, c.slug as category_slug
     FROM products p LEFT JOIN categories c ON p.category_id = c.id
     WHERE ${where.join(' AND ')} ORDER BY ${orderBy}`,
    params
  )
  res.json(rows)
})

router.get('/:slug', async (req, res) => {
  const { slug } = req.params
  const { rows } = await pool.query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.slug = $1 AND p.is_active = true
  `, [slug])
  if (rows.length === 0) return res.status(404).json({ error: 'محصول یافت نشد' })

  const product = rows[0]
  const { rows: images } = await pool.query('SELECT * FROM product_images WHERE product_id = $1 ORDER BY sort_order', [product.id])
  const { rows: variants } = await pool.query('SELECT * FROM product_variants WHERE product_id = $1', [product.id])
  const { rows: related } = await pool.query(`
    SELECT p.*, c.name as category_name, c.slug as category_slug
    FROM products p LEFT JOIN categories c ON p.category_id = c.id
    WHERE p.category_id = $1 AND p.id != $2 AND p.is_active = true LIMIT 4
  `, [product.category_id, product.id])

  res.json({ ...product, images, variants, related })
})

export default router
