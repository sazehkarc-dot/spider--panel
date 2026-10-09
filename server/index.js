import express from 'express'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'
import { pool } from './db.js'
import { ensureAdmin } from './seed.js'
import authRoutes from './routes/auth.js'
import productRoutes from './routes/products.js'
import categoryRoutes from './routes/categories.js'
import orderRoutes from './routes/orders.js'
import wishlistRoutes from './routes/wishlist.js'
import addressRoutes from './routes/addresses.js'
import settingsRoutes from './routes/settings.js'
import uploadRoutes from './routes/upload.js'
import adminRoutes from './routes/admin.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()

app.use(cors({ origin: true, credentials: true }))
app.use(express.json({ limit: '10mb' }))
app.use('/uploads', express.static(path.join(__dirname, '..', 'public', 'uploads')))

app.get('/api/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api/auth', authRoutes)
app.use('/api/products', productRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/wishlist', wishlistRoutes)
app.use('/api/addresses', addressRoutes)
app.use('/api/settings', settingsRoutes)
app.use('/api/upload', uploadRoutes)
app.use('/api/admin', adminRoutes)

const PORT = process.env.PORT || 4000

async function start() {
  for (let i = 0; i < 30; i++) {
    try {
      await pool.query('SELECT 1')
      console.log('✅ Database connected')
      break
    } catch {
      console.log(`Waiting for database... (${i + 1}/30)`)
      await new Promise(r => setTimeout(r, 1000))
    }
  }
  await ensureAdmin()
  app.listen(PORT, () => console.log(`🚀 Beesa API running on port ${PORT}`))
}

start()
