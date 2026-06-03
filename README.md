# 🚗 Car Rental Management System

![Car Rental Banner](https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000&h=600)

> A production-deployed, full-stack **Car Rental Management System** built to digitize and automate all aspects of a car rental business — from fleet and booking management to driver assignment, payment processing, and customer reviews.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-sheger.abdurehman.com-brightgreen?style=for-the-badge&logo=vercel)](https://sheger.abdurehman.com/)
[![Backend API](https://img.shields.io/badge/Backend%20API-Render-blue?style=for-the-badge&logo=render)](https://carrentalmanagementsystem-1.onrender.com)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Abdurehman-Kero/CarRentalManagementSystem)

---

## 🌐 Live Deployment

| Service | URL |
|---------|-----|
| **Frontend** | [https://sheger.abdurehman.com/](https://sheger.abdurehman.com/) |
| **Backend API** | [https://carrentalmanagementsystem-1.onrender.com](https://carrentalmanagementsystem-1.onrender.com) |
| **Health Check** | [https://carrentalmanagementsystem-1.onrender.com/health](https://carrentalmanagementsystem-1.onrender.com/health) |

---

## 📋 Table of Contents

- [Overview](#overview)
- [Team Members](#team-members)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Database Setup](#1-database-setup)
  - [Backend Setup](#2-backend-setup)
  - [Frontend Setup](#3-frontend-setup)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Environment Variables](#environment-variables)
- [License](#license)

---

## 📖 Overview

**Car Rental Management System** is a comprehensive, production-ready web application designed to replace manual, paper-based workflows with a centralized real-time digital platform. The system provides a role-based admin dashboard that allows rental company staff to manage their entire operation from a single, intuitive interface.

The system covers the complete rental workflow:

```
Customer Registration → Booking Creation → Driver Assignment → Vehicle Checkout → Payment → Car Return → Review
```

All data is persisted in a relational MySQL database through a RESTful Express.js API, with a React-powered frontend delivering a fast, modern, and responsive user experience.

---

## 👥 Team Members

| Name | Role |
|------|------|
| **Abdurehman Kero** | Full-Stack Developer & Project Lead |
| **Kenenisa Jaleto** | Backend Developer & Database Design |
| **Abdisa Waritu** | Frontend Developer & UI/UX Design |
| **Biniyam Beyene** | Frontend Developer & Testing |

---

## ✨ Features

### 📊 Live Dashboard
- Real-time statistics: total revenue, active bookings, fleet utilization rate, total customers
- Dynamic charts showing revenue trends and upcoming returns
- Quick-action buttons for common admin tasks

### 🚗 Fleet Management
- Full CRUD for vehicles with filtering by status (Available / In Use / Maintenance / Retired)
- Live search by brand, model, or license plate
- Vehicle image support and color swatch preview
- Vehicle status auto-updates on booking activation or car return

### 👤 Customer Management
- Full CRUD for customer profiles (name, email, phone, driver's license, address)
- Auto-generated gradient avatars based on customer ID
- Smart search across all customer fields

### 📅 Booking System
- Create reservations linked to customers and available vehicles
- Interactive cost calculator (daily rate × duration + insurance add-ons)
- Booking status lifecycle: **Pending → Active → Completed / Cancelled**
- Prevents double-booking of vehicles already in use
- Assign multiple drivers and insurance packages per booking

### 🔑 Rental Lifecycle
- Convert a Pending Booking into an Active Rental (vehicle checkout)
- Mark a rental as Returned with actual return date tracking
- Automatically updates vehicle and booking status on checkout/return
- Full rental history with active and returned records

### 💳 Payments
- Record payments with multiple payment method support
- Link payments to specific bookings with timestamps
- Full payment history per booking

### 🛡️ Insurance & Fuel Policies
- Configurable insurance packages attachable to bookings
- Fuel policy management affecting vehicle cost calculation

### 🏢 Branch Management
- Multi-branch support with city and location tracking
- Assign vehicles to specific branches

### 📂 Category Management
- Vehicle categorization with custom daily pricing per category

### 👨‍✈️ Driver Management
- Manage a roster of licensed drivers
- Assign drivers to specific bookings

### 👷 Employee Management
- Track employee records across branches
- Role-based employee profiles

### 🔧 Maintenance Tracking
- Log and track vehicle maintenance records
- Associate maintenance entries with specific vehicles

### ⭐ Customer Reviews
- View and manage customer feedback per vehicle
- Star-rating system linked to completed bookings

### 🔐 Authentication & Security
- JWT-based authentication with 24-hour token expiry
- Role-based access: **Admin** and **Super Admin**
- Super admin auto-seeded on server startup
- Protected API routes with token verification middleware
- Session persistence using localStorage

---

## 🛠️ Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) | UI component library |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [React Router DOM](https://reactrouter.com/) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client for API calls |
| [React Hot Toast](https://react-hot-toast.com/) | Toast notification system |
| Vanilla CSS | Custom styling and animations |

### Backend

| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) | JavaScript runtime environment |
| [Express.js 5](https://expressjs.com/) | Web framework and REST API |
| [MySQL](https://www.mysql.com/) | Relational database |
| [mysql2](https://github.com/sidorares/node-mysql2) | MySQL driver with connection pooling |
| [JSON Web Tokens (JWT)](https://jwt.io/) | Authentication and authorization |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [CORS](https://github.com/expressjs/cors) | Cross-origin resource sharing |
| [dotenv](https://github.com/motdotla/dotenv) | Environment variable management |

### Deployment

| Service | Purpose |
|---------|---------|
| [Render](https://render.com/) | Backend Node.js API hosting |
| [cPanel](https://cpanel.net/) | Remote MySQL database hosting |
| Custom Domain | Frontend hosting at `sheger.abdurehman.com` |
| [GitHub](https://github.com/) | Version control & CI/CD trigger |

---

## 🚀 Getting Started

Follow these step-by-step instructions to run the project on your local machine.

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher — [Download](https://nodejs.org/)
- **MySQL** database server — via [XAMPP](https://www.apachefriends.org/), [MAMP](https://www.mamp.info/), or standalone MySQL
- **Git** — [Download](https://git-scm.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/Abdurehman-Kero/CarRentalManagementSystem.git
cd CarRentalManagementSystem
```

### 2. Database Setup

Make sure your local MySQL server is running (default port `3306`). Then import the provided SQL dump or create the database manually:

```sql
CREATE DATABASE carrentalmanagement;
```

> **Note:** Import the SQL schema file from the repository to create all required tables.

### 3. Backend Setup

Navigate to the backend directory and install all dependencies:

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory with the following content:

```env
# Database connection
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=carrentalmanagement

# Server
PORT=5000

# Authentication
JWT_SECRET=your_super_secret_key_here

# Environment
NODE_ENV=development
```

> **Important:** Replace `DB_USER`, `DB_PASSWORD`, and `JWT_SECRET` with your own values. Never commit your `.env` file to version control.

Start the backend development server:

```bash
npm run dev
```

The API server will start at **`http://localhost:5000`**. A super admin account will be automatically seeded on first startup.

### 4. Frontend Setup

Open a **new terminal window**, navigate to the frontend directory, and install dependencies:

```bash
cd frontend
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will be available at **`http://localhost:5173`** (or `5174` if port `5173` is already in use).

### 5. Default Login

Once the backend is running, use these credentials to log in:

| Field | Value |
|-------|-------|
| **Email** | `keroabdurehman@gmail.com` |
| **Password** | `nexus@0974` |

---

## 🗂️ Project Structure

```
CarRentalManagementSystem/
│
├── backend/
│   ├── src/
│   │   ├── controllers/           # Business logic per resource
│   │   │   ├── authController.js
│   │   │   ├── carController.js
│   │   │   ├── bookingController.js
│   │   │   ├── customerController.js
│   │   │   ├── rentalController.js
│   │   │   ├── driverController.js
│   │   │   ├── employeeController.js
│   │   │   ├── branchController.js
│   │   │   ├── categoryController.js
│   │   │   ├── fuelPolicyController.js
│   │   │   ├── insuranceController.js
│   │   │   ├── maintenanceController.js
│   │   │   ├── paymentController.js
│   │   │   ├── paymentMethodController.js
│   │   │   └── reviewController.js
│   │   ├── routes/                # Express route definitions
│   │   ├── middleware/            # JWT auth middleware
│   │   └── lib/                  # MySQL connection pool
│   ├── index.js                   # Express app entry point
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable UI components
    │   │   ├── ConfirmModal.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx    # Global auth state
    │   ├── layouts/
    │   │   └── MainLayout.jsx     # Sidebar + Topbar shell layout
    │   ├── pages/                 # One file per application page
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── FleetManagement.jsx
    │   │   ├── Customers.jsx
    │   │   ├── Bookings.jsx
    │   │   ├── Rentals.jsx
    │   │   ├── Drivers.jsx
    │   │   ├── Employees.jsx
    │   │   ├── Branches.jsx
    │   │   ├── InsuranceManagement.jsx
    │   │   ├── Maintenance.jsx
    │   │   ├── Payments.jsx
    │   │   ├── Reviews.jsx
    │   │   ├── Settings.jsx
    │   │   └── AdminsManagement.jsx
    │   ├── services/
    │   │   └── api.js             # Axios instance & interceptors
    │   ├── App.jsx                # Root component & route definitions
    │   └── index.css              # Global styles
    └── vite.config.js
```

---

## 📡 API Reference

Base URL (Production): `https://carrentalmanagementsystem-1.onrender.com/api`  
Base URL (Local): `http://localhost:5000/api`

### Authentication (Public)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Log in and receive a JWT token |
| `GET` | `/auth/me` | Get the currently authenticated admin |

### Fleet (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cars` | Get all vehicles |
| `GET` | `/cars/:id` | Get a single vehicle |
| `POST` | `/cars` | Add a vehicle |
| `PUT` | `/cars/:id` | Update a vehicle |
| `PATCH` | `/cars/:id/status` | Update vehicle status |
| `DELETE` | `/cars/:id` | Delete a vehicle |

### Customers (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/customers` | Get all customers |
| `GET` | `/customers/:id` | Get a customer |
| `POST` | `/customers` | Add a customer |
| `PUT` | `/customers/:id` | Update a customer |
| `DELETE` | `/customers/:id` | Delete a customer |

### Bookings (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/bookings` | Get all bookings |
| `GET` | `/bookings/:id` | Get a booking |
| `POST` | `/bookings` | Create a booking |
| `PATCH` | `/bookings/:id/status` | Update booking status |
| `POST` | `/bookings/:id/drivers` | Assign a driver |
| `DELETE` | `/bookings/:id/drivers/:driverId` | Remove a driver |
| `POST` | `/bookings/:id/insurances` | Attach insurance |

### Rentals (Protected)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rentals` | Get all rentals |
| `POST` | `/rentals` | Create a rental (checkout) |
| `PATCH` | `/rentals/:id/return` | Return a vehicle |

### Other Protected Endpoints

| Resource | Base Path |
|----------|-----------|
| Branches | `/api/branches` |
| Categories | `/api/categories` |
| Drivers | `/api/drivers` |
| Employees | `/api/employees` |
| Insurance | `/api/insurances` |
| Fuel Policies | `/api/fuel-policies` |
| Maintenance | `/api/maintenance` |
| Payments | `/api/payments` |
| Payment Methods | `/api/payment-methods` |
| Reviews | `/api/reviews` |

---

## ⚙️ Environment Variables

The following environment variables are required in `backend/.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `your_password` |
| `DB_NAME` | Database name | `carrentalmanagement` |
| `PORT` | Express server port | `5000` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key` |
| `NODE_ENV` | Environment mode | `development` or `production` |

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).

---

*Developed as part of a Database Management Systems course project.*  
*Team: Abdurehman Kero · Kenenisa Jaleto · Abdisa Waritu · Biniyam Beyene*
