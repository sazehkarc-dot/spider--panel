-- Beesa E-commerce Database Schema

-- Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  phone TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  password_hash TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  price INTEGER NOT NULL,
  discount_price INTEGER,
  stock INTEGER DEFAULT 0,
  sku TEXT UNIQUE,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  is_featured BOOLEAN DEFAULT FALSE,
  is_new BOOLEAN DEFAULT FALSE,
  is_best_seller BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  seo_title TEXT,
  seo_description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Product images
CREATE TABLE IF NOT EXISTS product_images (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0
);

-- Product variants
CREATE TABLE IF NOT EXISTS product_variants (
  id SERIAL PRIMARY KEY,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  value TEXT NOT NULL,
  stock INTEGER DEFAULT 0,
  price_adjustment INTEGER DEFAULT 0
);

-- Orders
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'new',
  subtotal INTEGER NOT NULL,
  shipping INTEGER DEFAULT 0,
  discount INTEGER DEFAULT 0,
  total INTEGER NOT NULL,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  province TEXT,
  city TEXT,
  address TEXT,
  postal_code TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order items
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price INTEGER NOT NULL,
  image_url TEXT
);

-- Addresses
CREATE TABLE IF NOT EXISTS addresses (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  province TEXT,
  city TEXT,
  address TEXT,
  postal_code TEXT,
  is_default BOOLEAN DEFAULT FALSE
);

-- Wishlists
CREATE TABLE IF NOT EXISTS wishlists (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Discounts
CREATE TABLE IF NOT EXISTS discounts (
  id SERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL,
  value INTEGER NOT NULL,
  product_id INTEGER REFERENCES products(id) ON DELETE SET NULL,
  category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
  expires_at TIMESTAMP WITH TIME ZONE,
  usage_limit INTEGER,
  used_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Settings
CREATE TABLE IF NOT EXISTS settings (
  id SERIAL PRIMARY KEY,
  key TEXT UNIQUE NOT NULL,
  value TEXT
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_user ON wishlists(user_id);

-- ============ SEED DATA ============

-- Categories
INSERT INTO categories (id, name, slug, description, sort_order, is_active) VALUES
  (1, 'گردنبند', 'necklace', 'انواع گردنبندهای زیبا و فانتزی', 1, true),
  (2, 'دستبند', 'bracelet', 'دستبندهای رنگی و شیک', 2, true),
  (3, 'انگشتر', 'ring', 'انگشترهای فانتزی و ظریف', 3, true),
  (4, 'اکسسوری مو', 'hair-accessory', 'گیره و اکسسوری مو', 4, true),
  (5, 'عروسک و آویز', 'plush', 'عروسک و اکسسوری‌های فانتزی', 5, true),
  (6, 'آویز کیف', 'bag-charm', 'آویز کیف‌های بامزه', 6, true),
  (7, 'اکسسوری فانتزی', 'fantasy', 'اکسسوری‌های فانتزی و رنگی', 7, true),
  (8, 'هدیه', 'gift', 'هدیه‌های ویژه و خاص', 8, true)
ON CONFLICT (slug) DO NOTHING;

-- Products
INSERT INTO products (id, name, slug, description, price, discount_price, stock, sku, category_id, is_featured, is_new, is_best_seller, is_active) VALUES
  (1,  'گردنبند قلب عشق',       'necklace-heart-love',     'گردنبند زیبا با آویز قلب نقره‌ای، مناسب برای هدیه دادن به کسی که دوستش داری. طول زنجیر قابل تنظیم.', 249000, NULL,   50, 'BS001', 1, true,  true,  true,  true),
  (2,  'دستبند مهره‌ای رنگی',    'bracelet-colorful-beads', 'دستبند مهره‌ای با رنگ‌های شاد و زیبا. مناسب برای استفاده روزمره و کژوال.', 189000, NULL,   35, 'BS002', 2, false, true,  false, true),
  (3,  'انگشتر فانتزی پاپیونی',  'ring-fantasy-butterfly',  'انگشتر ظریف با طرح پروانه، طراحی فانتزی و خاص. مناسب برای دختران جوان.', 159000, 129000, 40, 'BS003', 3, false, false, true,  true),
  (4,  'گیره مو پاپیونی',        'hair-clip-butterfly',    'گیره مو با طرح پروانه رنگی، کوچک و سبک. مناسب برای موهای نازک و متوسط.', 89000,  NULL,   100,'BS004', 4, false, true,  false, true),
  (5,  'آویز کیف عروسکی',        'bag-charm-doll',         'آویز کیف با طرح عروسک کوچک، بامزه و رنگارنگ. جنس باکیفیت و مقاوم.', 129000, NULL,   60, 'BS005', 6, true,  false, false, true),
  (6,  'عروسک کوچک خرسه',        'plush-bear-mini',        'عروسک کوچک خرسه، نرم و دلبرانه. مناسب برای تزئین و هدیه. ارتفاع ۱۵ سانتی‌متر.', 199000, NULL,   25, 'BS006', 5, false, true,  true,  true),
  (7,  'آویز موبایل ستاره',      'phone-charm-star',       'آویز موبایل با طرح ستاره و مروارید، شیک و خاص. مناسب برای تمام گوشی‌ها.', 99000,  79000,  80, 'BS007', 7, true,  false, false, true),
  (8,  'دستبند مرواریدی ظریف',    'bracelet-pearl-delicate','دستبند مرواریدی ظریف و شیک، مناسب برای مجالس و مهمانی‌ها. مروارید طبیعی.', 219000, NULL,   30, 'BS008', 2, false, false, false, true),
  (9,  'گردنبند مرواریدی کلاسیک','necklace-pearl-classic', 'گردنبند مرواریدی کلاسیک و همیشه شیک. مناسب برای مهمانی‌ها و مجالس.', 289000, NULL,   20, 'BS009', 1, false, false, true,  true),
  (10, 'ست گیره مو گل‌دار',      'hair-clip-flowers-set',  'ست ۳ تایی گیره مو با طرح گل، رنگ‌های متنوع. مناسب برای دختران و نوجوانان.', 149000, 119000, 45, 'BS010', 4, false, true,  false, true),
  (11, 'انگشتر گل رز',           'ring-rose-flower',       'انگشتر با طرح گل رز، ظریف و زنانه. رنگ صورتی ملایم.', 169000, NULL,   55, 'BS011', 3, false, false, false, true),
  (12, 'گوشواره قلبی مینی',      'earrings-heart-mini',    'گوشواره مینیاتوری با طرح قلب، سبک و ظریف. مناسب برای استفاده روزمره.', 139000, NULL,   70, 'BS012', 7, true,  true,  false, true),
  (13, 'آویز کیف قلبی',          'bag-charm-heart',        'آویز کیف با طرح قلب و مروارید، شیک و خاص. رنگ صورتی و طلایی.', 119000, NULL,   65, 'BS013', 6, false, false, false, true),
  (14, 'عروسک خرگوشی کوچک',      'plush-bunny-mini',       'عروسک کوچک خرگوشی، نرم و بامزه. مناسب برای تزئین کیف و اتاق. ارتفاع ۱۲ سانتی‌متر.', 179000, 149000, 30, 'BS014', 5, false, false, true,  true),
  (15, 'گردنبند ستاره فانتزی',   'necklace-star-fantasy', 'گردنبند با آویز ستاره، طراحی فانتزی و خاص. مناسب برای نوجوانان و جوانان.', 229000, NULL,   40, 'BS015', 1, false, true,  false, true),
  (16, 'دستبند روبان دار',       'bracelet-ribbon',        'دستبند با طرح روبان، شیک و ظریف. رنگ صورتی ملایم با جزئیات طلایی.', 179000, NULL,   50, 'BS016', 2, false, false, false, true),
  (17, 'گیره مو رنگارنگ',        'hair-clip-colorful',     'گیره مو رنگارنگ، بامزه و شاد. بسته ۵ تایی با رنگ‌های مختلف.', 79000,  NULL,   120,'BS017', 4, false, false, false, true),
  (18, 'آویز موبایل عروسکی',    'phone-charm-doll',       'آویز موبایل با طرح عروسک کوچک، بامزه و رنگارنگ. مناسب برای گوشی و تبلت.', 109000, 89000,  75, 'BS018', 7, true,  true,  false, true)
ON CONFLICT (slug) DO NOTHING;

-- Reset sequences
SELECT setval('categories_id_seq', (SELECT MAX(id) FROM categories));
SELECT setval('products_id_seq', (SELECT MAX(id) FROM products));

-- Settings
INSERT INTO settings (key, value) VALUES
  ('store_name',          'بیسا'),
  ('store_name_en',       'Beesa'),
  ('instagram',           'beesa_accessory'),
  ('contact_phone',      ''),
  ('contact_email',      ''),
  ('shipping_fee',        '50000'),
  ('free_shipping_threshold', '500000'),
  ('currency',            'تومان'),
  ('logo_url',            ''),
  ('hero_title',          'یه چیز بامزه برای خودت پیدا کن 💗'),
  ('hero_description',    'بیسا، فروشگاه آنلاین اکسسوری‌های فانتزی و زیبا. بهترین هدیه برای خودت و عزیزانت'),
  ('hero_button_text',    'مشاهده محصولات'),
  ('about_text',          'بیسا برندی از ایران برای دخترانی که عاشق زیبایی و رنگ هستند. ما انواع اکسسوری‌های فانتزی و شیک را با بهترین کیفیت و قیمت مناسب ارائه می‌دهیم.')
ON CONFLICT (key) DO NOTHING;
