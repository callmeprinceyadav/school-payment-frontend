<div align="center">

# 💳 School Payment Dashboard

**Modern • Responsive • Secure**

*A powerful React frontend for managing school payment transactions with real-time analytics*

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev)
[![Material-UI](https://img.shields.io/badge/MUI-v7-007FFF?logo=mui)](https://mui.com)
[![Vite](https://img.shields.io/badge/Vite-7-646CFF?logo=vite)](https://vitejs.dev)
[![TypeScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?logo=javascript)](https://www.javascript.com)

[🚀 Live Demo](#-quick-start) • [📚 Documentation](#-features) • [🛠️ Setup](#-installation)

</div>

---

## ✨ Features

🎨 **Modern Interface** • Clean, professional UI with Material Design  
📊 **Real-time Analytics** • Live transaction statistics and status tracking  
🔍 **Advanced Search** • Multi-filter search across transactions and schools  
📱 **Fully Responsive** • Perfect on desktop, tablet, and mobile  
🔐 **Secure Access** • JWT authentication with protected routes  
⚡ **Lightning Fast** • Optimized performance with Vite and React 19  

## 🛠️ Tech Stack

**Frontend:** React 19 • Material-UI v7 • MUI DataGrid v8  
**Build:** Vite 7 • ES6+ JavaScript  
**Routing:** React Router v7  
**HTTP:** Axios with interceptors  
**Auth:** JWT + Context API

## 🚀 Quick Start

```bash
# Clone and install
git clone <repository-url>
cd school-payment-frontend
npm install

# Create environment file
echo "VITE_API_BASE_URL=http://localhost:3000/api" > .env

# Start development server
npm run dev
```

**Requirements:** Node.js 18+ • Backend API running on port 3000

## 🎯 Pages Overview

📊 **Dashboard** - Transaction analytics with real-time stats and filtering  
🏫 **School Search** - Find transactions by school ID with advanced filters  
🔍 **Status Lookup** - Check individual transaction details and status  
📋 **All Transactions** - Comprehensive view with multi-column filtering

## 🔑 Demo Login

**Email:** `admin@school.com`  
**Password:** `admin123`

## 📊 Key Features

**📊 Real-time Dashboard** - Live stats, filtering, and data tables  
**🏫 School Management** - Search transactions by school ID  
**🔍 Status Tracking** - Detailed transaction lookup and monitoring  
**📋 Advanced Filtering** - Multi-parameter search with date ranges  
**📱 Mobile Responsive** - Perfect experience on all devices  
**⚡ Fast Performance** - Optimized loading and smooth interactions

## 🎯 Sample Data for Testing

**School IDs:** `65b0e6293e9f76a9694d84b4` • `507f1f77bcf86cd799439011`  
**Order Format:** `ORD_1234567890_abc12`  
**Gateways:** Razorpay • PayU • Cashfree

## 🚀 Deploy

```bash
# Build for production
npm run build

# Deploy to Netlify/Vercel
# Set VITE_API_BASE_URL in environment variables
```

## 🔌 API Endpoints

**Backend:** `http://localhost:3000/api`

`POST /auth/login` • `GET /transactions` • `GET /transactions/school/:id` • `GET /transaction-status/:orderId`

## 📁 Project Structure

```
src/
├── components/     # Navigation, ProtectedRoute
├── pages/          # Dashboard, Login, Transactions pages
├── context/        # AuthContext for global state
├── utils/          # API client and utilities
└── App.jsx         # Main app with routing
```

---

<div align="center">

**Built with ❤️ using React 19, Material-UI, and Vite**

*Modern School Payment Management Dashboard*

</div>
