import { Router } from 'express'
import { pool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.post('/', async (req, res) => {
  const { items, full_name, phone, province, city, address, postal_code, notes } = req.body
  if (!items?.length || !full_name || !phone || !address) {
    return res.status(400).json({ error: 'لطفاً تمام فیلدهای الزامی را پر کنید' })
  }

  const productIds = items.map(i => i.product_id)
  const { rows: products } = await pool.query(
    'SELECT id, name, price, discount_price, stock FROM products WHERE id = ANY($1) AND is_active = true',
    [productIds]
  )

  let subtotal = 0
  const orderItems = []
  for (const item of items) {
    const p = products.find(x => x.id === item.product_id)
    if (!p) return res.status(400).json({ error: 'محصول یافت نشد' })
    if (p.stock < item.quantity) return res.status(400).json({ error: `موجودی «${p.name}» کافی نیست` })
    const price = p.discount_price || p.price
    subtotal += price * item.quantity
    orderItems.push({ product_id: p.id, product_name: p.name, quantity: item.quantity, price })
  }

  const { rows: sRows } = await pool.query(
    "SELECT key, value FROM settings WHERE key IN ('shipping_fee', 'free_shipping_threshold')"
  )
  const cfg = Object.fromEntries(sRows.map(s => [s.key, s.value]))
  const shippingFee = parseInt(cfg.shipping_fee || '50000')
  const freeThreshold = parseInt(cfg.free_shipping_threshold || '500000')
  const shipping = subtotal >= freeThreshold ? 0 : shippingFee
  const total = subtotal + shipping

  const orderNumber = `BS-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`

  const { rows: [order] } = await pool.query(
    `INSERT INTO orders (user_id, order_number, status, subtotal, shipping, discount, total, full_name, phone, province, city, address, postal_code, notes)
     VALUES ($1, $2, 'new', $3, $4, 0, $5, $6, $7, $8, $9, $10, $11, $12) RETURNING *`,
    [req.user.id, orderNumber, subtotal, shipping, total, full_name, phone, province, city, address, postal_code, notes]
  )

  for (const item of orderItems) {
    await pool.query(
      'INSERT INTO order_items (order_id, product_id, product_name, quantity, price) VALUES ($1, $2, $3, $4, $5)',
      [order.id, item.product_id, item.product_name, item.quantity, item.price]
    )
    await pool.query('UPDATE products SET stock = stock - $1 WHERE id = $2', [item.quantity, item.product_id])
  }

  res.json(order)
})

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC', [req.user.id]
  )
  res.json(rows)
})

router.get('/:id', async (req, res) => {
  const { id } = req.params
  const { rows } = await pool.query('SELECT * FROM orders WHERE id = $1 AND user_id = $2', [id, req.user.id])
  if (rows.length === 0) return res.status(404).json({ error: 'سفارش یافت نشد' })
  const order = rows[0]
  const { rows: items } = await pool.query('SELECT * FROM order_items WHERE order_id = $1', [id])
  res.json({ ...order, items })
})

export default router
