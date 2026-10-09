import { Router } from 'express'
import bcrypt from 'bcryptjs'
import { pool } from '../db.js'
import { signToken, authMiddleware } from '../middleware/auth.js'

const router = Router()

router.post('/register', async (req, res) => {
  const { phone, password, full_name } = req.body
  if (!phone || !password) return res.status(400).json({ error: 'شماره موبایل و رمز عبور الزامی است' })
  if (password.length < 6) return res.status(400).json({ error: 'رمز عبور حداقل ۶ کاراکتر باشد' })

  const { rows } = await pool.query('SELECT id FROM users WHERE phone = $1', [phone])
  if (rows.length > 0) return res.status(409).json({ error: 'این شماره قبلاً ثبت شده است' })

  const hash = await bcrypt.hash(password, 10)
  const { rows: [user] } = await pool.query(
    'INSERT INTO users (phone, full_name, password_hash) VALUES ($1, $2, $3) RETURNING id, phone, full_name, is_admin, created_at',
    [phone, full_name || null, hash]
  )
  res.json({ user, token: signToken(user) })
})

router.post('/login', async (req, res) => {
  const { phone, password } = req.body
  if (!phone || !password) return res.status(400).json({ error: 'شماره موبایل و رمز عبور الزامی است' })

  const { rows } = await pool.query('SELECT * FROM users WHERE phone = $1', [phone])
  if (rows.length === 0) return res.status(401).json({ error: 'شماره یا رمز عبور اشتباه است' })

  const user = rows[0]
  const valid = await bcrypt.compare(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'شماره یا رمز عبور اشتباه است' })
  if (!user.is_active) return res.status(403).json({ error: 'حساب شما غیرفعال است' })

  delete user.password_hash
  res.json({ user, token: signToken(user) })
})

router.get('/me', authMiddleware, async (req, res) => {
  const { rows } = await pool.query('SELECT id, phone, email, full_name, is_admin, created_at FROM users WHERE id = $1', [req.user.id])
  if (rows.length === 0) return res.status(404).json({ error: 'کاربر یافت نشد' })
  res.json(rows[0])
})

router.put('/me', authMiddleware, async (req, res) => {
  const { full_name, email } = req.body
  const { rows } = await pool.query(
    'UPDATE users SET full_name = $1, email = $2 WHERE id = $3 RETURNING id, phone, email, full_name, is_admin, created_at',
    [full_name, email, req.user.id]
  )
  res.json(rows[0])
})

export default router
