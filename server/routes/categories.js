import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  const { rows } = await pool.query(
    'SELECT * FROM categories WHERE is_active = true ORDER BY sort_order ASC, id ASC'
  )
  res.json(rows)
})

export default router
