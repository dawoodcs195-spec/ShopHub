<div align="center">

# Diya Expressions: MERN E-Commerce Store and Admin Dashboard

**A full-stack storefront for handmade candles, resin art and gifts, with JWT auth, Stripe payments, Cloudinary uploads and an analytics dashboard.**

[**Live store →**](https://diya-expressions.vercel.app) &nbsp;·&nbsp; [API](https://diya-expressions-api.vercel.app)

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel&logoColor=white)](https://diya-expressions.vercel.app)

![React](https://img.shields.io/badge/React-19-149ECA?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4-06B6D4?logo=tailwindcss&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-Express%205-339933?logo=nodedotjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?logo=mongodb&logoColor=white)
![Stripe](https://img.shields.io/badge/Stripe-Payment%20Intents-635BFF?logo=stripe&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-images-3448C5?logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

</div>

> The repository is named `ShopHub`; the product it contains is the **Diya Expressions** storefront.

---

## Contents

- [Features](#features)
- [Tech stack](#tech-stack)
- [Architecture](#architecture)
- [Getting started](#getting-started)
- [Environment variables](#environment-variables)
- [API overview](#api-overview)
- [Deployment](#deployment)
- [Roadmap](#roadmap)
- [Author](#author)

## Features

**Storefront**
- Home page with hero, categories, testimonials, artist story and newsletter sign-up
- Product listing with keyword search, category filter and sorting; search modal with recent and popular searches
- Product details with reviews and star ratings, skeleton loaders and scroll-reveal animations (Framer Motion)
- Light and dark theme

**Shopping and payments**
- Cart, wishlist (saved to the user's account) and coupon codes at checkout
- Stock checked and decremented when an order is placed
- Two payment methods: **Cash on Delivery** and **card via Stripe** (Payment Intents + Stripe Elements)
- Stripe webhook with signature verification updates payment status on `payment_intent.succeeded` / `payment_failed`
- My Orders page and downloadable PDF invoices

**Accounts**
- Register and login with JWT; protected and admin-only routes on both client and server
- Profile editing, avatar upload (Cloudinary) and password change
- Forgot / reset password by email
- Request validation with `express-validator`

**Admin**
- Dashboard with revenue, orders and payment-method charts (Recharts), top products, latest products and recent orders
- Product management with Cloudinary image uploads
- Order management with status updates, filters, pagination and CSV / PDF export
- Coupon management (create, edit, delete)
- Newsletter subscriber list with unsubscribe
- Sales and revenue reports
- Daily visitor tracking for site analytics

**Email** (Nodemailer)
- Welcome email, order confirmation, new-order alert to the admin, delivery notification and password reset

**Security**
- Helmet headers and API rate limiting (300 requests / 15 minutes per IP)
- Passwords hashed with bcryptjs

## Tech stack

| Layer | Technology |
| :--- | :--- |
| Frontend | React 19, Vite, React Router 7, Tailwind CSS 4, Framer Motion, Recharts, Axios, React Hot Toast, React Icons |
| Payments (client) | `@stripe/stripe-js`, `@stripe/react-stripe-js` |
| Documents | jsPDF, jspdf-autotable, html2canvas |
| Backend | Node.js, Express 5, Mongoose (MongoDB Atlas) |
| Auth and validation | JSON Web Tokens, bcryptjs, express-validator |
| Services | Stripe, Cloudinary (Multer + streamifier), Nodemailer |
| Security | Helmet, express-rate-limit |
| Hosting | Vercel (frontend as a static SPA, backend as a serverless function) |

## Architecture

```text
React SPA (Vite) ──Axios──► Express API (/api/*) ──► MongoDB Atlas
   │                           ├─► Stripe (Payment Intents, webhook)
   │                           ├─► Cloudinary (product images, avatars)
   └─ Stripe Elements          └─► SMTP via Nodemailer (transactional email)
```

```text
ShopHub/
├── backend/
│   ├── api/[...path].js   # Vercel serverless entry (wraps the Express app)
│   ├── config/            # MongoDB and Cloudinary setup
│   ├── controllers/       # users, products, reviews, orders, payments, coupons, newsletter, analytics, admin
│   ├── middleware/        # auth (protect / authorize), validation, uploads, errors
│   ├── models/            # User, Product, Order, Coupon, NewsletterSubscriber, DailyVisitor, DailySiteStat
│   ├── routes/            # one router per resource
│   ├── services/          # email service
│   ├── utils/             # JWT helper
│   └── server.js
└── frontend/
    └── src/
        ├── components/    # layout, common, product, profile and admin components
        ├── context/       # auth, cart, wishlist, theme
        ├── pages/         # storefront, account and admin pages
        ├── services/      # API clients
        └── utils/         # invoice, CSV and PDF export helpers
```

## Getting started

**Prerequisites:** Node.js 20+, npm, a MongoDB database (local or Atlas). Stripe, Cloudinary and SMTP accounts are needed for payments, uploads and email.

```bash
git clone https://github.com/dawoodcs195-spec/ShopHub.git
cd ShopHub
```

**Backend** (http://localhost:5000)

```bash
cd backend
npm install
cp .env.example .env      # fill in your values
npm run dev
```

**Frontend** (http://localhost:5173)

```bash
cd frontend
npm install
cp .env.example .env      # point VITE_API_URL at the backend
npm run dev
```

For local Stripe webhooks: `stripe listen --forward-to localhost:5000/api/payments/webhook`.

## Environment variables

Names only; see `backend/.env.example` and `frontend/.env.example`. Never commit real values.

**Backend**

| Variable | Purpose |
| :--- | :--- |
| `PORT` | API port (default 5000) |
| `NODE_ENV` | `development` / `production` |
| `MONGO_URI` | MongoDB connection string |
| `JWT_SECRET` | Signs auth tokens |
| `FRONTEND_URL` | Used in email links |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Image uploads |
| `STRIPE_SECRET_KEY` | Creates Payment Intents |
| `STRIPE_WEBHOOK_SECRET` | Verifies webhook signatures |
| `EMAIL_HOST`, `EMAIL_PORT`, `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM` | SMTP email |

**Frontend**

| Variable | Purpose |
| :--- | :--- |
| `VITE_API_URL` | Backend base URL (with or without `/api`) |
| `VITE_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key |

## API overview

Base path: `/api`

| Area | Endpoints |
| :--- | :--- |
| Users | `POST /users/register` · `POST /users/login` · `POST /users/forgot-password` · `PUT /users/reset-password/:token` · `GET/PUT /users/profile` · `PUT /users/change-password` · `GET /users/wishlist` · `POST /users/wishlist/:productId` |
| Products | `GET /products` · `GET /products/:id` · `POST /products/:id/reviews` · `POST /products` · `PUT/DELETE /products/:id` (admin) |
| Orders | `POST /orders` · `GET /orders/my-orders` · `GET /orders/:id` · `GET /orders` (admin) · `PUT /orders/:id` (admin) |
| Payments | `POST /payments/create-payment-intent` · `POST /payments/webhook` |
| Coupons | `POST /coupons/validate` · CRUD on `/coupons` (admin) |
| Uploads | `POST /upload` (admin, product image) · `POST /upload/avatar` |
| Newsletter | `POST /newsletter/subscribe` · `GET /newsletter/subscribers` · `PATCH /newsletter/subscribers/:id/unsubscribe` |
| Admin | `GET /admin/dashboard` |
| Analytics | `POST /analytics/visit` |

## Deployment

Both apps are deployed on **Vercel** as two projects:

- **Frontend**: root directory `frontend`, framework Vite. `frontend/vercel.json` rewrites all paths to `index.html` for client-side routing. Set `VITE_API_URL` and `VITE_STRIPE_PUBLISHABLE_KEY`.
- **Backend**: root directory `backend`. `backend/vercel.json` routes every request to `api/[...path].js`, which exports the Express app (it skips `app.listen` when `VERCEL` is set). Add all backend variables.
- Create a Stripe webhook pointing to `https://<backend>/api/payments/webhook`.

## Roadmap

- [ ] Restrict CORS to the frontend origin
- [ ] Automated API tests (Jest / Vitest + Supertest) and a CI workflow
- [ ] Move the duplicate root-level `package.json` into the frontend only
- [ ] Order tracking emails for every status change

## Author

**Muhammad Dawood**, Full-Stack Developer

- Email: [dawood.cs195@gmail.com](mailto:dawood.cs195@gmail.com)
- GitHub: [@dawoodcs195-spec](https://github.com/dawoodcs195-spec)

## License

Released under the [MIT License](LICENSE).
