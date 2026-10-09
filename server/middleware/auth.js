import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'beesa_jwt_secret_dev'

export function signToken(user) {
  return jwt.sign(
    { id: user.id, phone: user.phone, is_admin: user.is_admin },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'لطفاً وارد شوید' })
  try {
    req.user = jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ error: 'نشست شما منقضی شده است' })
  }
}

export function adminMiddleware(req, res, next) {
  if (!req.user?.is_admin) return res.status(403).json({ error: 'دسترسی غیرمجاز' })
  next()
}
