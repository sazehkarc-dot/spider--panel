const API_BASE = '/api'

function getToken(): string | null {
  return localStorage.getItem('beesa_token')
}

export function setToken(token: string | null) {
  if (token) localStorage.setItem('beesa_token', token)
  else localStorage.removeItem('beesa_token')
}

async function request<T = any>(path: string, options?: RequestInit): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options?.headers,
    },
  })
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'خطا در ارتباط با سرور' }))
    throw new Error(error.error || 'خطا در ارتباط با سرور')
  }
  return res.json()
}

export const api = {
  // Auth
  register: (data: { phone: string; password: string; full_name?: string }) =>
    request('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  login: (data: { phone: string; password: string }) =>
    request('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
  getMe: () => request('/auth/me'),
  updateProfile: (data: { full_name?: string; email?: string }) =>
    request('/auth/me', { method: 'PUT', body: JSON.stringify(data) }),

  // Products
  getProducts: (params?: Record<string, string | number | boolean>) => {
    const qs = params ? '?' + new URLSearchParams(params as any).toString() : ''
    return request(`/products${qs}`)
  },
  getProduct: (slug: string) => request(`/products/${slug}`),
  getFeaturedProducts: () => request('/products/featured/all'),
  getNewProducts: () => request('/products/new/all'),
  getBestSellers: () => request('/products/best-sellers/all'),
  getSpecialOffers: () => request('/products/special-offers/all'),

  // Categories
  getCategories: () => request('/categories'),

  // Orders
  createOrder: (data: any) => request('/orders', { method: 'POST', body: JSON.stringify(data) }),
  getOrders: () => request('/orders'),
  getOrder: (id: number) => request(`/orders/${id}`),

  // Wishlist
  getWishlist: () => request('/wishlist'),
  addToWishlist: (productId: number) => request('/wishlist', { method: 'POST', body: JSON.stringify({ product_id: productId }) }),
  removeFromWishlist: (productId: number) => request(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Addresses
  getAddresses: () => request('/addresses'),
  addAddress: (data: any) => request('/addresses', { method: 'POST', body: JSON.stringify(data) }),
  deleteAddress: (id: number) => request(`/addresses/${id}`, { method: 'DELETE' }),

  // Settings
  getSettings: () => request('/settings'),

  // Admin
  adminDashboard: () => request('/admin/dashboard'),
  adminGetProducts: () => request('/admin/products'),
  adminCreateProduct: (data: any) => request('/admin/products', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateProduct: (id: number, data: any) => request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteProduct: (id: number) => request(`/admin/products/${id}`, { method: 'DELETE' }),
  adminGetCategories: () => request('/admin/categories'),
  adminCreateCategory: (data: any) => request('/admin/categories', { method: 'POST', body: JSON.stringify(data) }),
  adminUpdateCategory: (id: number, data: any) => request(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
  adminDeleteCategory: (id: number) => request(`/admin/categories/${id}`, { method: 'DELETE' }),
  adminGetOrders: () => request('/admin/orders'),
  adminGetOrder: (id: number) => request(`/admin/orders/${id}`),
  adminUpdateOrderStatus: (id: number, status: string) => request(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
  adminGetCustomers: () => request('/admin/customers'),
  adminGetCustomer: (id: number) => request(`/admin/customers/${id}`),
  adminGetDiscounts: () => request('/admin/discounts'),
  adminCreateDiscount: (data: any) => request('/admin/discounts', { method: 'POST', body: JSON.stringify(data) }),
  adminDeleteDiscount: (id: number) => request(`/admin/discounts/${id}`, { method: 'DELETE' }),
  adminGetSettings: () => request('/admin/settings'),
  adminUpdateSettings: (data: any) => request('/admin/settings', { method: 'PUT', body: JSON.stringify(data) }),
  uploadImage: (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return fetch(`${API_BASE}/upload`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${getToken()}` },
      body: formData,
    }).then(r => r.json())
  },
}
