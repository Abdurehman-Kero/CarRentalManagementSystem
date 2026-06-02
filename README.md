# DriveEase — Car Rental Management System

![DriveEase Banner](https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000&h=600)

> A modern, full-stack web application designed to streamline car rental operations — from fleet management and customer registration to booking reservations and complete rental lifecycle tracking.

---

## Table of Contents

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

## Overview

**DriveEase** is a fully functional Car Rental Management System built as an academic group project. It provides a role-based admin dashboard that allows rental company staff to manage their entire operation from a single, intuitive interface.

The system covers the complete rental workflow:

```
Customer Registration → Booking Creation → Vehicle Checkout → Car Return
```

All data is persisted in a relational MySQL database through a RESTful Express.js API, with a React-powered frontend delivering a fast and responsive user experience.

---

## Team Members

This project was designed and developed by the following team:

| Name | Role |
|------|------|
| **Abdurehman Kero** | Full-Stack Developer & Project Lead |
| **Kenenisa Jaleto** | Backend Developer & Database Design |
| **Abdisa Waritu** | Frontend Developer & UI/UX Design |
| **Biniyam Beyene** | Frontend Developer & Testing |

---

## Features

### Dashboard Analytics
- Real-time summary cards showing active rentals, available vehicles, total customers, and monthly revenue
- Quick-action buttons for common admin tasks (add car, add customer, new booking)
- Visual revenue sparkline and recent activity feed

### Fleet Management
- Add, edit, and remove vehicles from the fleet
- Filter vehicles by status: **Available**, **In Use**, **Maintenance**, or **Retired**
- Live search by brand, model, or license plate
- Color swatch preview and optional vehicle image support
- Vehicle status automatically updates when a booking is activated or a car is returned

### Customer Management
- Full CRUD operations for customer profiles
- Stores full name, email, phone, driver license number, and address
- Auto-generated gradient avatar based on customer ID
- Search customers by name, email, phone, or city

### Booking System
- Create reservations linked to existing customers and available vehicles
- Interactive cost calculator — automatically computes the total based on daily rate and selected date range
- Booking status lifecycle: **Pending → Active → Completed / Cancelled**
- Prevents double-booking of vehicles already in use

### Rental Lifecycle
- Convert a Pending Booking into an **Active Rental** (vehicle checkout)
- Mark a rental as **Returned** (vehicle check-in) with a single click
- Automatically updates vehicle status and booking status on checkout/return
- Displays both active and historical (returned) rentals in one table

### Admin Management
- Manage admin accounts with secure authentication
- Role-based access with JWT token authorization
- Session persistence with localStorage

### Security & UX
- JWT-based authentication with protected routes
- Inline form error messages instead of generic browser popups
- Premium styled confirmation dialogs for all destructive actions (delete, return)
- Toast notifications for all create, update, delete, and error events
- Fully responsive layout — works on desktop, tablet, and mobile screens

---

## Tech Stack

### Frontend

| Technology | Purpose |
|------------|---------|
| [React 18](https://react.dev/) | UI component library |
| [Vite](https://vitejs.dev/) | Build tool and dev server |
| [Tailwind CSS v3](https://tailwindcss.com/) | Utility-first CSS framework |
| [React Router DOM](https://reactrouter.com/) | Client-side routing |
| [Axios](https://axios-http.com/) | HTTP client for API calls |
| [React Hot Toast](https://react-hot-toast.com/) | Toast notification system |

### Backend

| Technology | Purpose |
|------------|---------|
| [Node.js](https://nodejs.org/) | JavaScript runtime environment |
| [Express.js](https://expressjs.com/) | Web framework and REST API |
| [MySQL](https://www.mysql.com/) | Relational database |
| [Prisma v7](https://www.prisma.io/) | Type-safe ORM with MariaDB driver |
| [JSON Web Tokens (JWT)](https://jwt.io/) | Authentication and authorization |
| [bcryptjs](https://github.com/dcodeIO/bcrypt.js) | Password hashing |
| [CORS](https://github.com/expressjs/cors) | Cross-origin resource sharing |

---

## Getting Started

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

Make sure your local MySQL server is running (default port `3306`). Then create an empty database for the project:

```sql
CREATE DATABASE crms;
```

> **Note:** The Prisma schema push in the next step will automatically create all required tables inside this database.

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
DB_PASSWORD=root
DB_NAME=crms
DATABASE_URL="mysql://root:root@localhost:3306/crms"

# Server
PORT=5000

# Authentication
JWT_SECRET=your_super_secret_key_here
```

> **Important:** Replace `DB_USER`, `DB_PASSWORD`, and `JWT_SECRET` with your own values. Never commit your `.env` file to version control.

Generate the Prisma client and push the schema to your database:

```bash
npx prisma generate
npx prisma db push
```

Start the backend development server:

```bash
npm run dev
```

The API server will start at **`http://localhost:5000`**.

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

---

## Project Structure

```
CarRentalManagementSystem/
│
├── backend/
│   ├── prisma/
│   │   └── schema.prisma          # Database schema (tables & relations)
│   ├── src/
│   │   ├── controllers/           # Business logic per resource
│   │   │   ├── authController.js
│   │   │   ├── carController.js
│   │   │   ├── bookingController.js
│   │   │   ├── customerController.js
│   │   │   └── rentalController.js
│   │   ├── routes/                # Express route definitions
│   │   │   ├── authRoutes.js
│   │   │   ├── carRoutes.js
│   │   │   ├── bookingRoutes.js
│   │   │   ├── customerRoutes.js
│   │   │   └── rentalRoutes.js
│   │   ├── middleware/            # Auth middleware (JWT verification)
│   │   ├── lib/                   # Prisma client singleton
│   │   └── utils/                 # Shared utility functions
│   ├── index.js                   # Express app entry point
│   └── prisma.config.ts           # Prisma v7 adapter configuration
│
└── frontend/
    ├── src/
    │   ├── components/            # Reusable UI components
    │   │   ├── ConfirmModal.jsx   # Custom confirmation dialog
    │   │   └── ProtectedRoute.jsx # Auth guard for private routes
    │   ├── layouts/
    │   │   └── MainLayout.jsx     # Sidebar + Topbar shell layout
    │   ├── pages/                 # One file per application page
    │   │   ├── Login.jsx
    │   │   ├── Dashboard.jsx
    │   │   ├── FleetManagement.jsx
    │   │   ├── Customers.jsx
    │   │   ├── Bookings.jsx
    │   │   ├── Rentals.jsx
    │   │   └── AdminsManagement.jsx
    │   ├── services/              # Axios API service modules
    │   │   ├── api.js             # Axios instance & interceptors
    │   │   ├── carService.js
    │   │   ├── bookingService.js
    │   │   ├── customerService.js
    │   │   └── rentalService.js
    │   ├── App.jsx                # Root component & route definitions
    │   └── index.css              # Global styles & Tailwind directives
    ├── tailwind.config.js         # Custom color palette & animations
    └── vite.config.js             # Vite build configuration
```

---

## API Reference

All API endpoints are prefixed with `http://localhost:5000/api`.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/auth/login` | Log in an admin and receive a JWT token |
| `POST` | `/auth/register` | Register a new admin account |

### Vehicles (Cars)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/cars` | Retrieve all vehicles |
| `GET` | `/cars/:id` | Retrieve a single vehicle by ID |
| `POST` | `/cars` | Add a new vehicle to the fleet |
| `PUT` | `/cars/:id` | Update vehicle details |
| `PATCH` | `/cars/:id/status` | Update vehicle status only |
| `DELETE` | `/cars/:id` | Remove a vehicle from the fleet |

### Customers

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/customers` | Retrieve all customers |
| `GET` | `/customers/:id` | Retrieve a single customer by ID |
| `POST` | `/customers` | Register a new customer |
| `PUT` | `/customers/:id` | Update customer information |
| `DELETE` | `/customers/:id` | Delete a customer record |

### Bookings

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/bookings` | Retrieve all bookings |
| `GET` | `/bookings/:id` | Retrieve a single booking |
| `POST` | `/bookings` | Create a new booking |
| `PUT` | `/bookings/:id` | Update booking details |
| `PATCH` | `/bookings/:id/status` | Update booking status |
| `DELETE` | `/bookings/:id` | Cancel and delete a booking |

### Rentals

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/rentals` | Retrieve all rentals |
| `GET` | `/rentals/:id` | Retrieve a single rental |
| `POST` | `/rentals` | Create a new rental (vehicle checkout) |
| `PATCH` | `/rentals/:id/return` | Record a vehicle return (check-in) |

---

## Environment Variables

The following environment variables are required in `backend/.env`:

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Full MySQL connection string for Prisma | `mysql://root:root@localhost:3306/crms` |
| `DB_HOST` | Database host | `localhost` |
| `DB_PORT` | Database port | `3306` |
| `DB_USER` | Database username | `root` |
| `DB_PASSWORD` | Database password | `root` |
| `DB_NAME` | Database name | `crms` |
| `PORT` | Port for the Express server | `5000` |
| `JWT_SECRET` | Secret key for signing JWT tokens | `your_secret_key` |

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

*Developed as part of a Database Management Systems course project.*  
*Team: Abdurehman Kero · Kenenisa Jaleto · Abdisa Waritu · Biniyam Beyene*
