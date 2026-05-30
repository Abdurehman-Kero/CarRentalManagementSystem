# 🚗 DriveEase — Car Rental Management System

![DriveEase Banner](https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&q=80&w=2000&h=600)

> A modern, full-stack web application designed to streamline car rental operations, from fleet management to customer bookings and rental checkouts.

## ✨ Features

- **📊 Dashboard Analytics**: Real-time overview of active rentals, available cars, total customers, and monthly revenue.
- **🚙 Fleet Management**: Complete CRUD operations for vehicles, categorized by status (Available, In Use, Maintenance). Includes real-time search and color swatch previews.
- **👥 Customer Profiles**: Manage customer data securely, including driver's licenses and contact information, with auto-generated gradient avatars.
- **📅 Booking System**: Create reservations with an interactive cost calculator that automatically computes totals based on vehicle rates and duration.
- **🔑 Rental Lifecycle**: Seamlessly transition from Pending Bookings → Active Rentals (Checkout) → Returned (Check-in).
- **🎨 Premium UI/UX**: Built with Tailwind CSS, featuring glassmorphism, responsive design, smooth animations, and a rich dark sidebar layout.

## 🛠️ Tech Stack

### Frontend
- **Framework**: [React 18](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS v3](https://tailwindcss.com/)
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Hot Toast

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: Express.js
- **Database**: MySQL (via MAMP/XAMPP)
- **ORM**: [Prisma v7](https://www.prisma.io/) (with MariaDB driver adapter)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
- **Node.js** (v18 or higher)
- **MySQL Database** (MAMP, XAMPP, or standalone)
- **Git**

### 1. Database Setup
Ensure your local MySQL server is running (default port `3306`).
Create an empty database named `crms`:
```sql
CREATE DATABASE crms;
```

### 2. Backend Setup
Navigate to the backend directory and install dependencies:
```bash
cd backend
npm install
```

Ensure your `.env` file is properly configured. If it doesn't exist, create it:
```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=crms
DATABASE_URL="mysql://root:root@localhost:3306/crms"
PORT=5000
```

Generate the Prisma client and push the schema to the database:
```bash
npx prisma generate
npx prisma db push
```

Start the backend development server:
```bash
npm run dev
```
*(The server will start on `http://localhost:5000`)*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, and install dependencies:
```bash
cd frontend
npm install
```

Start the Vite development server:
```bash
npm run dev
```
*(The frontend will be available at `http://localhost:5174` or `5173`)*

---

## 📂 Project Structure

\`\`\`text
CarRentalManagementSystem/
├── backend/
│   ├── prisma/
│   │   └── schema.prisma        # Database schema definitions
│   ├── src/
│   │   ├── controllers/         # Business logic (car, booking, customer, rental)
│   │   ├── routes/              # Express API route definitions
│   │   └── lib/                 # Shared utilities (Prisma singleton)
│   ├── index.js                 # Entry point & Express configuration
│   └── prisma.config.ts         # Prisma v7 adapter configuration
│
└── frontend/
    ├── src/
    │   ├── layouts/             # Main layout shell (Sidebar, Topbar)
    │   ├── pages/               # Dashboard, Fleet, Bookings, Customers, Rentals
    │   ├── services/            # Axios API integration
    │   ├── App.jsx              # Routing & toast configuration
    │   └── index.css            # Tailwind directives & design system
    ├── tailwind.config.js       # Custom colors and animations
    └── vite.config.js           # Build tool config
\`\`\`

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!
Feel free to check the [issues page](https://github.com/Abdurehman-Kero/CarRentalManagementSystem/issues).

## 📝 License
This project is open-source and available under the [MIT License](LICENSE).

---
*Built with ❤️ by [Abdurehman-Kero](https://github.com/Abdurehman-Kero)*
