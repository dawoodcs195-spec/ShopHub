# Diya Expressions — MERN Artisan Store (E‑Commerce)

Diya Expressions is a full‑stack MERN e‑commerce application built with **MongoDB, Express.js, React (Vite), and Node.js**.

It is designed as a **premium artisan brand storefront** for handcrafted creations—warm, elegant, and story‑driven—while still providing a complete e‑commerce feature set (auth, products, cart, checkout, orders, reviews, admin dashboard, uploads, etc.).

---

## ✨ Product Categories (Examples)
- Handmade Candles  
- Resin Art (Clocks, Decor, Jewelry)  
- Floral Decor  
- Handmade Accessories  
- Personalized Gifts  

---

## 🚀 Features

### 👤 Authentication
- User Registration / Login
- JWT Authentication
- Protected Routes
- Admin Authorization
- Forgot / Reset Password (Email)

### 🛍 Products
- Browse Products
- Product Details
- Search + Filters + Sorting
- Reviews & Ratings
- Cloudinary Image Uploads

### ❤️ Wishlist
- Add / Remove wishlist items
- Persistent wishlist experience

### 🛒 Shopping & Checkout
- Add to Cart
- Update Quantity
- Remove from Cart
- Stock Validation
- Checkout flow

### 📦 Orders
- Place Order
- My Orders
- Admin Order Management
- Update Order Status

### 💳 Payments
- Stripe integration (server-side)

### ⚙️ Admin Dashboard
- Dashboard Statistics
- Product Management
- Order Management
- Revenue & Reports
- Recent Orders / Latest Products

### 📄 Exports / Documents
- PDF Invoice generation
- Orders CSV / PDF export

---

## 🛠 Tech Stack

### Frontend
- React (Vite)
- React Router
- Context API
- Axios
- Tailwind CSS
- Framer Motion
- React Hot Toast
- React Icons

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- JWT
- Bcrypt
- Multer
- Cloudinary
- Nodemailer
- Stripe

---

## 📁 Project Structure (Monorepo)
SHOPHUB/
│
├── backend/
│ ├── config/
│ ├── controllers/
│ ├── middleware/
│ ├── models/
│ ├── routes/
│ ├── services/
│ ├── utils/
│ └── server.js
│
├── frontend/
│ ├── public/
│ ├── src/
│ │ ├── assets/
│ │ ├── components/
│ │ ├── context/
│ │ ├── pages/
│ │ ├── services/
│ │ ├── utils/
│ │ └── App.jsx
│ └── vite.config.js
│
└── README.md

text


> Note: The folder/repo name may still be `ShopHub`, but the **brand identity in the application** is **Diya Expressions**.

---

## ⚡ Installation (Local Development)

### 1) Clone Repository
```bash
git clone https://github.com/dawoodcs195-spec/ShopHub.git
2) Backend
Bash

cd ShopHub/backend
npm install
npm run dev
3) Frontend
Bash

cd ../frontend
npm install
npm run dev
Frontend runs at:

http://localhost:5173
Backend runs at:

http://localhost:5000
🔐 Environment Variables (Backend)
Create a .env file inside the backend folder.

env

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email
EMAIL_PASS=your_email_app_password
EMAIL_FROM="Diya Expressions <your_email>"
FRONTEND_URL=http://localhost:5173
✅ Completed Modules
Authentication + Authorization (JWT, Admin)
Products + Reviews/Ratings
Category Filtering / Search / Sorting
Cart + Checkout
Orders + Admin order management
Stripe (backend)
Cloudinary uploads (products + avatars)
Email notifications (welcome, order, password reset, delivered)
PDF Invoice + Orders Export (CSV/PDF)
Premium storefront UI + animations (Framer Motion)
🚧 Next Steps / Deployment
MongoDB Atlas (production database)
Render (backend hosting)
Vercel (frontend hosting)
Production environment variables
Final responsive refinements + polish
👨‍💻 Author
Muhammad Dawood
GitHub: https://github.com/dawoodcs195-spec