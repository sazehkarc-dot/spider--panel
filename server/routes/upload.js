import { Router } from 'express'
import multer from 'multer'
import path from 'path'
import { fileURLToPath } from 'url'
import { authMiddleware, adminMiddleware } from '../middleware/auth.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

const storage = multer.diskStorage({
  destination: path.join(__dirname, '..', '..', 'public', 'uploads'),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname)
    const name = Date.now() + '-' + Math.random().toString(36).slice(2, 8) + ext
    cb(null, name)
  },
})

const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } })

const router = Router()
router.use(authMiddleware, adminMiddleware)

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'فایلی ارسال نشده است' })
  res.json({ url: `/uploads/${req.file.filename}` })
})

export default router
