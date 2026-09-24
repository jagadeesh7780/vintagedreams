# 🛍️ VintageDreams — Full MERN Stack Fashion E-Commerce Platform

> **Modern Flipkart & Amazon style luxury fashion e-commerce platform built with React 18, Tailwind CSS, Pure Express.js, MongoDB Atlas, JWT Authentication, and Razorpay Payments.**

---

## 🌟 Key Features

- 👕 **Men's & Women's Fashion Catalog**: Casual & Formal Shirts, Utility Cargos & Joggers, Sneakers, Luxury Analog Watches, Hallmarked 925 Pure Silver Rings, Evening & Midi Dresses, Chikankari Kurtis, Fine Jewelry, and Kanjivaram Silk Sarees.
- ⚡ **Amazon/Flipkart-Style UI**: Dynamic category bar with icons, quick search, multi-image product gallery with zoom, customer reviews & rating star breakdown, delivery estimators, and discount badges.
- 🔒 **Secure JWT Authentication**: User registration, login, profile management, and 1-click demo login buttons.
- 🛒 **Full Shopping Experience**: Persistent MongoDB cart & wishlist with guest fallback, size/color selectors, coupon code discount engine (`VINTAGE10`), and price breakdown cards.
- 💳 **Razorpay Checkout & Payments**: Integrated Razorpay modal (UPI, Cards, NetBanking) + Cash on Delivery (COD) mode with signature verification.
- 📦 **Order Tracking**: Comprehensive order status tracking (Confirmed, Processing, Shipped, Delivered) with date stamps and receipt summaries.
- 👑 **Admin Control Center**: Product CRUD catalog manager, live inventory adjustment, revenue metric cards, and order fulfillment status updates.

---

## 📂 Project Architecture

```
VintageDreams/
├── backend/                       # Express.js REST API
│   ├── config/db.js               # MongoDB Atlas connection
│   ├── models/                    # User, Product, Order, Cart, Wishlist
│   ├── controllers/               # Auth, Product, Cart, Wishlist, Order, Payment
│   ├── routes/                    # /api/auth, /api/products, /api/cart, /api/orders, etc.
│   ├── middleware/                # JWT Auth & error handlers
│   ├── utils/seedProducts.js      # MongoDB seeder with 25+ products
│   └── server.js                  # Express entry point
│
└── frontend/                      # React 18 + Vite + Tailwind CSS
    ├── src/
    │   ├── api/axios.js           # Axios client with JWT auto-injection
    │   ├── context/               # AuthContext, CartContext, WishlistContext
    │   ├── components/            # Navbar, CategoryBar, ProductCard, Footer, Stars...
    │   ├── pages/                 # Home, Products, ProductDetails, Cart, Wishlist,
    │   │                          # Checkout, OrderSuccess, MyOrders, Login, Register,
    │   │                          # About, AdminDashboard
    │   ├── data/                  # Fallback offline dataset
    │   ├── App.jsx                # Router & Global Layout
    │   └── index.css              # Tailwind CSS styles & typography
    └── package.json
```

---

## 🚀 Quick Start Guide

### 1. Configure Environment Variables

Open [backend/.env](file:///d:/VintageDreams/backend/.env) and set your **MongoDB Atlas connection string** and **Razorpay API Keys**:

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/vintagedreams?retryWrites=true&w=majority
JWT_SECRET=vintagedreams_jwt_super_secret_key_2024
JWT_EXPIRES_IN=7d
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
CLIENT_URL=http://localhost:5173
NODE_ENV=development
```

---

### 2. Seed Database (Optional / Initial setup)

Once your MongoDB Atlas URI is configured, seed the complete product catalog and demo users:

```bash
cd backend
npm run seed
```

---

### 3. Start the Backend API Server

```bash
cd backend
npm run dev
# Server runs on: http://localhost:5000
```

---

### 4. Start the React Frontend

Open a new terminal window:

```bash
cd frontend
npm run dev
# Frontend runs on: http://localhost:5173
```

---

## 🔑 Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| **Administrator** | `admin@vintagedreams.com` | `adminpassword123` |
| **Customer** | `user@vintagedreams.com` | `userpassword123` |

*(You can also use the 1-click Demo Login buttons on the Login page!)*

---

## 🔗 REST API Endpoints Summary

| Method | Route | Description | Auth Required |
|--------|-------|-------------|---------------|
| `POST` | `/api/auth/register` | Register new user account | No |
| `POST` | `/api/auth/login` | Login user and receive JWT | No |
| `GET` | `/api/auth/me` | Fetch logged-in user profile | Yes (JWT) |
| `GET` | `/api/products` | Get products with search/filter/sort | No |
| `GET` | `/api/products/:id` | Get single product details | No |
| `POST` | `/api/products/:id/reviews` | Add customer rating & review | Yes (JWT) |
| `GET` | `/api/cart` | Get user shopping cart | Yes (JWT) |
| `POST` | `/api/cart` | Add product to cart | Yes (JWT) |
| `GET` | `/api/wishlist` | Get user wishlist | Yes (JWT) |
| `POST` | `/api/wishlist` | Add product to wishlist | Yes (JWT) |
| `POST` | `/api/orders` | Place order (COD or online) | Yes (JWT) |
| `GET` | `/api/orders/myorders` | Get current user orders | Yes (JWT) |
| `POST` | `/api/payment/create-order` | Create Razorpay payment order | Yes (JWT) |
| `POST` | `/api/payment/verify` | Verify Razorpay HMAC signature | Yes (JWT) |
