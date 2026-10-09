# Beesa (بیسا) — Persian E-commerce Platform

## Overview
A complete, production-ready Persian RTL e-commerce website for the Beesa accessory brand. Built with React, TypeScript, Tailwind CSS, Node.js/Express, and PostgreSQL.

## Tech Stack
- **Frontend**: React 18 + TypeScript + Tailwind CSS + Vite
- **Backend**: Node.js + Express
- **Database**: PostgreSQL 16
- **Auth**: JWT-based with bcrypt password hashing
- **Font**: Vazirmatn (bundled via @fontsource)

## Architecture
- Single-origin: Vite dev server (port 3000) proxies `/api` and `/uploads` to Express (port 4000)
- PostgreSQL runs as a separate compose service with auto-init schema
- Cart is client-side (localStorage) — no backend needed for cart
- Orders, auth, products, etc. use the Express API + PostgreSQL

## Quick Start (Docker)
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
App runs at `http://localhost:3000`.

## Default Admin
- URL: `/admin/login`
- Phone: `09123456789`
- Password: `admin123`
- **Change the password immediately after first login.**

## Database Schema
Tables: `users`, `categories`, `products`, `product_images`, `product_variants`, `orders`, `order_items`, `addresses`, `wishlists`, `discounts`, `settings`

Schema is auto-initialized from `db/schema.sql` on first PostgreSQL start. Seed data includes 8 categories, 18 sample products, and default store settings.

## Environment Variables
| Variable | Default | Purpose |
|---|---|---|
| `DATABASE_URL` | `postgresql://beesa:beesa_dev_password@db:5432/beesa` | PostgreSQL connection |
| `JWT_SECRET` | `beesa_jwt_secret_dev` | JWT signing secret |
| `PORT` | `4000` | Express API port |
| `VITE_API_PROXY_TARGET` | `http://localhost:4000` | Vite proxy target for API |

## Local Development (without Docker)
1. Install PostgreSQL locally
2. Run `db/schema.sql` to create tables and seed data
3. `npm install`
4. Set env vars (DATABASE_URL, JWT_SECRET)
5. `node server/index.js` (starts API on :4000)
6. `npx vite` (starts frontend on :3000, proxies API to :4000)

## Features
- Persian RTL UI with Vazirmatn font
- Product catalog with 18 sample products
- Category filtering, search, sorting
- Product detail pages with related products
- Shopping cart (localStorage-persisted)
- Checkout with order creation (no fake payment)
- User auth (register, login, account)
- Wishlist
- Admin dashboard with:
  - Sales/order/customer/product stats
  - Product CRUD with image upload
  - Category management
  - Order management with status updates
  - Customer management
  - Discount codes
  - Store settings

## Payment Integration
Checkout creates the order in the database without processing payment. The payment flow is architected to accept an Iranian payment gateway later — add a payment service that hooks into the order creation endpoint.

## Deployment
The project is structured for deployment to any Node.js host (Railway, Render, etc.) or Cloudflare Pages (frontend) + a Node.js backend. Use environment variables for all secrets.
