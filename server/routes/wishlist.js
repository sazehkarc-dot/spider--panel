import { Router } from 'express'
import { pool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req, res) => {
  const { rows } = await pool.query(`
    SELECT w.*, p.name, p.slug, p.price, p.discount_price, p.stock, p.is_active,
           c.slug as category_slug
    FROM wishlists w
    JOIN products p ON w.product_id = p.id
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE w.user_id = $1
  `, [req.user.id])
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { product_id } = req.body
  if (!product_id) return res.status(400).json({ error: 'محصول مشخص نشده است' })
  await pool.query(
    'INSERT INTO wishlists (user_id, product_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
    [req.user.id, product_id]
  )
  res.json({ success: true })
})

router.delete('/:productId', async (req, res) => {
  await pool.query('DELETE FROM wishlists WHERE user_id = $1 AND product_id = $2',
    [req.user.id, req.params.productId])
  res.json({ success: true })
})

export default router
