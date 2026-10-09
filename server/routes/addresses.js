import { Router } from 'express'
import { pool } from '../db.js'
import { authMiddleware } from '../middleware/auth.js'

const router = Router()
router.use(authMiddleware)

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM addresses WHERE user_id = $1 ORDER BY is_default DESC, id ASC', [req.user.id]
  )
  res.json(rows)
})

router.post('/', async (req, res) => {
  const { full_name, phone, province, city, address, postal_code, is_default } = req.body
  if (is_default) {
    await pool.query('UPDATE addresses SET is_default = false WHERE user_id = $1', [req.user.id])
  }
  const { rows: [addr] } = await pool.query(
    `INSERT INTO addresses (user_id, full_name, phone, province, city, address, postal_code, is_default)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
    [req.user.id, full_name, phone, province, city, address, postal_code, is_default || false]
  )
  res.json(addr)
})

router.delete('/:id', async (req, res) => {
  await pool.query('DELETE FROM addresses WHERE id = $1 AND user_id = $2', [req.params.id, req.user.id])
  res.json({ success: true })
})

export default router
