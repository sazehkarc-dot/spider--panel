import { Router } from 'express'
import { pool } from '../db.js'

const router = Router()

router.get('/', async (req, res) => {
  const { rows } = await pool.query('SELECT key, value FROM settings')
  res.json(Object.fromEntries(rows.map(r => [r.key, r.value])))
})

export default router
