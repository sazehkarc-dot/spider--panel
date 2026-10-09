export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fa-IR').format(price)
}

export function hasDiscount(price: number, discountPrice: number | null): boolean {
  return !!discountPrice && discountPrice < price
}

export function effectivePrice(price: number, discountPrice: number | null): number {
  return discountPrice && discountPrice < price ? discountPrice : price
}

export function discountPercent(price: number, discountPrice: number): number {
  return Math.round(((price - discountPrice) / price) * 100)
}

export function slugify(text: string): string {
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '')
}

const CATEGORY_GRADIENTS: Record<string, string> = {
  necklace: 'from-pink-200 via-pink-300 to-rose-300',
  bracelet: 'from-purple-200 via-violet-300 to-purple-300',
  ring: 'from-amber-200 via-orange-200 to-rose-200',
  'hair-accessory': 'from-teal-200 via-cyan-200 to-blue-200',
  plush: 'from-rose-200 via-pink-200 to-fuchsia-200',
  'bag-charm': 'from-emerald-200 via-green-200 to-teal-200',
  fantasy: 'from-violet-200 via-purple-200 to-indigo-200',
  gift: 'from-yellow-200 via-amber-200 to-orange-200',
}

const CATEGORY_EMOJIS: Record<string, string> = {
  necklace: '💗',
  bracelet: '📿',
  ring: '💍',
  'hair-accessory': '🎀',
  plush: '🧸',
  'bag-charm': '🎀',
  fantasy: '✨',
  gift: '🎁',
}

export function categoryGradient(slug: string | undefined): string {
  return CATEGORY_GRADIENTS[slug || ''] || 'from-pink-200 to-rose-300'
}

export function categoryEmoji(slug: string | undefined): string {
  return CATEGORY_EMOJIS[slug || ''] || '🛍️'
}

export function formatDate(dateStr: string): string {
  try {
    return new Intl.DateTimeFormat('fa-IR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(new Date(dateStr))
  } catch {
    return dateStr
  }
}

export function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `BS-${ts}-${rand}`
}
