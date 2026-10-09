import pg from 'pg'

const { Pool } = pg

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://beesa:beesa_dev_password@localhost:5432/beesa',
})

export async function query(text, params) {
  return pool.query(text, params)
}
