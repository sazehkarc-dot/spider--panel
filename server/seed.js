import bcrypt from 'bcryptjs'
import { pool } from './db.js'

export async function ensureAdmin() {
  try {
    const { rows } = await pool.query('SELECT id FROM users WHERE is_admin = true LIMIT 1')
    if (rows.length === 0) {
      const hash = await bcrypt.hash('admin123', 10)
      await pool.query(
        `INSERT INTO users (phone, full_name, password_hash, is_admin)
         VALUES ($1, $2, $3, true)`,
        ['09123456789', 'مدیر بیسا', hash]
      )
      console.log('✅ Admin user created — phone: 09123456789, password: admin123')
    }
  } catch (err) {
    console.error('Failed to create admin user:', err.message)
  }
}
