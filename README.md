# 🍕 Oasis Pizza — Full-Stack Pizza Ordering & Real-Time Inventory Management Platform

> A production-grade, full-stack artisanal pizza ordering platform built with **React (Vite)**, **Node.js / Express**, **MongoDB (Mongoose)**, **Socket.IO**, **Nodemailer**, **node-cron**, and **Razorpay Test Integration**.

---

## 🚀 Key Features

### 🛒 Customer Experience
* **Artisanal Pizza Customizer**: Multi-step interactive builder allowing selection of Crust (Base), Sauce, Cheese, and fresh Garden Vegetables with live dynamic pricing and visual layered preview.
* **Database as Single Source of Truth**: All ingredients, pricing, and stock levels are queried live from MongoDB. Server-side validation recalculates true price and rejects out-of-stock items.
* **Test Razorpay Gateway**: Seamless checkout with Razorpay test payments and atomic stock deduction upon verification.
* **Real-Time Live Order Tracking**: Powered by WebSockets (`Socket.IO`), advancing from *Order Received* ➔ *In Kitchen* ➔ *Sent to Delivery* ➔ *Delivered* without manual browser refresh.
* **Complete User Authentication**: Secure registration, email verification with time-limited tokens via Nodemailer, password reset tokens, and JWT sessions.

### 🛡️ Admin & Inventory Management Hub
* **Role-Based Admin Console**: Distinct Admin authentication model isolated from normal users.
* **Real-time Order Operations**: Board to inspect order details, recipes, customer addresses, and advance order status with instant live socket push to customers.
* **Inventory Control & CRUD**: Manage ingredients, update pricing, customize low-stock threshold triggers, and perform quick stock increments/decrements.
* **Automated Low-Stock Cron Job**: Background `node-cron` scheduled task (every 5 minutes) checks for low stock and alerts the admin via Nodemailer with automatic alert deduplication.
* **Executive Metrics Dashboard**: Live calculations of total revenue, active orders, low stock items, and overall inventory valuation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, React Router DOM, Axios, Context API, Socket.IO Client, Lucide Icons, Canvas Confetti |
| **Backend** | Node.js (ES Modules), Express.js 5, WebSockets (`Socket.IO`), Mongoose 9, JWT, bcryptjs, Nodemailer, node-cron, Razorpay SDK |
| **Database** | MongoDB |
| **Styling** | Vanilla CSS Design System (Custom Glassmorphism, Micro-animations, Mobile Responsive) |

---

## 📁 Project Structure

```text
oasis-pizza/
│
├── client/                     # React Frontend (Vite)
│   ├── src/
│   │   ├── components/         # Navbar, Footer, PizzaVisualizer, IngredientCard, OrderTracker, Skeletons
│   │   ├── pages/              # Home, Login, Register, VerifyEmail, ForgotPassword, ResetPassword
│   │   │   │                   # Dashboard, PizzaBuilder, OrderSummary, Orders, OrderDetail
│   │   │   └── admin/          # AdminLogin, AdminDashboard, AdminInventory, AdminOrders, AdminOrderDetail
│   │   ├── layouts/            # MainLayout, AdminLayout
│   │   ├── context/            # AuthContext, CartContext, SocketContext, ToastContext
│   │   ├── services/           # api.js, authService, adminService, pizzaService, orderService
│   │   ├── hooks/              # useAuth, useCart, useSocket, useToast
│   │   ├── utils/              # formatters.js (INR currency, dates, badges)
│   │   ├── routes/             # AppRoutes, ProtectedRoute, AdminRoute
│   │   ├── App.jsx             # Main Application Component
│   │   ├── index.css           # Global Theme & Design System
│   │   └── main.jsx            # React DOM Root
│   ├── public/
│   ├── index.html
│   └── package.json
│
├── server/                     # Express Backend
│   ├── config/                 # db.js (MongoDB Connection), razorpay.js
│   ├── controllers/            # authController, adminController, inventoryController, pizzaController, orderController, adminOrderController
│   ├── middleware/             # authMiddleware (verifyUser, verifyAdmin), errorHandler
│   ├── model/                  # User.js, Admin.js, Inventory.js, Order.js
│   ├── routes/                 # authRoutes, adminRoutes, pizzaRoutes, orderRoutes
│   ├── services/               # emailService.js (Nodemailer Templates), paymentService.js (Razorpay & Signature Verification)
│   ├── jobs/                   # lowStockJob.js (node-cron inventory watcher)
│   ├── sockets/                # socketHandler.js (Socket.IO room subscriptions & status broadcasting)
│   ├── utils/                  # sendEmail.js
│   ├── scripts/                # createAdmin.js, seedInventory.js
│   ├── server.js               # Main Server Entry Point
│   ├── .env                    # Environment Secrets
│   └── package.json
│
├── .env.example                # Example Environment Variables
├── .gitignore
└── README.md
```

---

## ⚙️ Environment Variables

Create a `.env` file in the `server/` directory (refer to `.env.example`):

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/pizza-oasis

JWT_SECRET=oasis_pizza_super_secret_jwt_key_2025_secure_production_token
JWT_EXPIRES_IN=7d

# Nodemailer / Gmail SMTP
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password

# Admin Credentials for createAdmin script & alerts
ADMIN_NAME=Super Admin
ADMIN_EMAIL=admin@oasispizza.com
ADMIN_PASSWORD=AdminPassword@123

# Razorpay Test Mode Credentials
RAZORPAY_KEY_ID=rzp_test_placeholder_key
RAZORPAY_KEY_SECRET=placeholder_secret

CLIENT_URL=http://localhost:5173
API_BASE_URL=http://localhost:5000
LOW_STOCK_CRON_SCHEDULE=*/5 * * * *
```

---

## 🚀 Setup & Local Installation

### 1. Prerequisites
- **Node.js** (v18 or higher recommended)
- **MongoDB** running locally on port `27017` or a MongoDB Atlas URI

---

### Quick Start (One Command from Root)
```bash
# 1. Install all dependencies across client and server
npm run install:all

# 2. Seed ingredients & create admin account in MongoDB
npm run setup

# 3. Start both Backend & Frontend simultaneously
npm run dev
```

---

### Alternative: Individual Service Setup

#### Backend Setup (`/server`)
```bash
cd server
npm install

# Seed Initial Pizza Ingredients (Crusts, Sauces, Cheeses, Vegetables)
npm run seed

# Create the Administrator Account
npm run create-admin

# Start Backend Dev Server
npm run dev
```

#### Frontend Setup (`/client`)
```bash
cd ../client
npm install

# Start Vite Development Server
npm run dev
```

Open your browser at `http://localhost:5173`.

---

### 🧪 Automated End-to-End Test Suite
Run the comprehensive 12-step automated integration test suite covering registration, email verification, login, pizza building, stock validation, test Razorpay payment, atomic stock deduction, admin metrics, and real-time status transitions:

```bash
npm test
```

---

## 🔑 Default Admin & Test Credentials

| Account | Email | Password | Role |
|---|---|---|---|
| **Administrator** | `gopalmuruga007@gmail.com` | `Pizza@123` | `admin` |
| **Admin Login URL** | `http://localhost:5173/admin/login` | — | — |

---

## 🔄 End-to-End Operational Workflow

```text
Customer
   │
   ├─► Register ➔ Receive Verification Email ➔ Verify Link ➔ Login
   │
   ├─► Open Custom Pizza Builder (Step 1: Crust ➔ Step 2: Sauce ➔ Step 3: Cheese ➔ Step 4: Veggies)
   │
   ├─► Review Order Summary (Server recalculates genuine price from MongoDB)
   │
   ├─► Razorpay Test Checkout ➔ Signature Verified
   │
   ├─► Stock Deducted Atomically in MongoDB ➔ Order Created ("Order Received")
   │
   ├─► Customer Redirected to Live Real-Time Tracking Page
   │
Admin
   │
   ├─► Receives live Socket.IO alert on Admin Dashboard
   │
   ├─► Updates Status: "In Kitchen" ➔ Customer page automatically reflects state
   │
   ├─► Updates Status: "Sent to Delivery" ➔ Customer page automatically reflects state
   │
   ├─► Updates Status: "Delivered" ➔ Order Finished
   │
Inventory & Cron Watcher
   │
   └─► Stock decreases below threshold ➔ node-cron alerts admin via Nodemailer
```

---

## 📡 Key API Endpoints Overview

### Authentication (`/api/auth`)
* `POST /api/auth/register` — Register new customer
* `GET  /api/auth/verify-email/:token` — Verify user email
* `POST /api/auth/login` — User login (returns JWT)
* `POST /api/auth/forgot-password` — Request password reset
* `POST /api/auth/reset-password/:token` — Set new password
* `GET  /api/auth/me` — Authenticated profile

### Admin Operations (`/api/admin`)
* `POST   /api/admin/login` — Admin login (returns Admin JWT)
* `GET    /api/admin/dashboard` — Overview metrics & recent orders
* `GET    /api/admin/inventory` — List all ingredients
* `POST   /api/admin/inventory` — Add new ingredient
* `PUT    /api/admin/inventory/:id` — Update ingredient
* `PATCH  /api/admin/inventory/:id` — Partial update / adjust stock
* `DELETE /api/admin/inventory/:id` — Delete ingredient
* `GET    /api/admin/orders` — Filtered order pipeline
* `GET    /api/admin/orders/:id` — Inspect order details
* `PATCH  /api/admin/orders/:id/status` — Advance status with Socket.IO broadcast

### Pizza Options (`/api/pizzas`)
* `GET /api/pizzas/options` — Active in-stock ingredients categorized by Base, Sauce, Cheese, Veggies
* `GET /api/pizzas/presets` — Chef's signature preset pizzas

### Orders & Payment (`/api/orders`)
* `POST /api/orders/create-payment` — Validates items, recalculates price from DB & generates Razorpay Order
* `POST /api/orders/verify-payment` — Verifies HMAC-SHA256 signature, deducts inventory, creates Order
* `GET  /api/orders/my-orders` — Customer order history
* `GET  /api/orders/:id` — Live order tracking data

---

## 🛡️ Security Highlights
- **Zero-Trust Pricing**: Frontend prices and totals are never trusted for payment calculations.
- **Atomic Stock Deductions**: Deductions use atomic database queries (`$inc` with `{ quantity: { $gte: 1 } }`) to prevent negative inventory and race conditions.
- **HMAC-SHA256 Signature Verification**: Validates Razorpay payments securely on the server.
- **Bcrypt Password Hashing**: Passwords are never stored in plaintext and never returned in API responses.
- **Role Isolation**: Strict middleware verification ensures user tokens cannot access admin routes.

---

## 📄 License
This project is open source and available under the ISC License.
