# 🛒 ShopHub - MERN E-Commerce Application

ShopHub is a full-stack MERN E-Commerce application built using MongoDB, Express.js, React, and Node.js. It provides a modern shopping experience with secure authentication, product management, image uploads, shopping cart, checkout, orders, reviews, and an admin dashboard.

---

## 🚀 Features

### 👤 Authentication
- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Admin Authorization

### 🛍 Products
- View Products
- Product Details
- Product Search
- Product Reviews & Ratings
- Cloudinary Image Upload
- Duplicate Product Validation

### 🛒 Shopping
- Add to Cart
- Update Quantity
- Remove from Cart
- Stock Validation
- Persistent Cart (Local Storage)

### 📦 Orders
- Checkout
- Shipping Information
- Place Order
- My Orders
- Admin Order Management
- Update Order Status

### ⚙️ Admin Dashboard
- Dashboard Statistics
- Product Management
- Order Management
- Revenue Overview
- Recent Orders
- Latest Products

---

## 🛠 Tech Stack

### Frontend
- React
- React Router
- Context API
- Axios
- Tailwind CSS
- React Hot Toast
- React Icons
- Vite

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- Bcrypt
- Multer
- Cloudinary

---

## 📁 Project Structure

```
ShopHub
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── utils
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── assets
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── services
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

---

## ⚡ Installation

### Clone Repository

```bash
git clone https://github.com/dawoodcs195-spec/ShopHub.git
```

### Backend

```bash
cd ShopHub/backend
npm install
npm run dev
```

### Frontend

```bash
cd ../frontend
npm install
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file inside the `backend` folder.

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloud_name

CLOUDINARY_API_KEY=your_api_key

CLOUDINARY_API_SECRET=your_api_secret
```

---

## ✅ Completed Features

- JWT Authentication
- Role-Based Authorization
- Product CRUD
- Cloudinary Integration
- Product Search
- Shopping Cart
- Checkout
- Order Management
- Admin Dashboard
- Product Reviews & Ratings
- Dashboard Statistics
- Stock Validation

---

## 🚧 Future Improvements

- User Profile
- Avatar Upload
- Forgot Password
- Wishlist
- Coupons
- Online Payments (Stripe / Razorpay)
- Email Notifications
- Sales Analytics
- Deployment

---

## 👨‍💻 Author

**Muhammad Dawood**

GitHub: https://github.com/dawoodcs195-spec