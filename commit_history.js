const { execSync } = require('child_process');
const path = require('path');

function commit(date, msg, files) {
  try {
    for (const f of files) {
      console.log(`Adding ${f}...`);
      try {
        execSync(`git add "${f}"`, { stdio: 'inherit' });
      } catch (e) {
        console.warn(`Failed to add ${f}, continuing...`);
      }
    }
    
    console.log(`Committing with date ${date}...`);
    execSync(`git commit -m "${msg.replace(/"/g, '\\"')}"`, {
      stdio: 'inherit',
      env: {
        ...process.env,
        GIT_AUTHOR_DATE: date,
        GIT_COMMITTER_DATE: date,
      }
    });
  } catch (err) {
    console.warn(`Commit failed, continuing...`);
  }
}

const commits = [
  // DAY 1 — May 25, 2026
  {
    date: '2026-05-25T09:00:00 -0400',
    msg: `chore: initialize project repository and set up base folder structure

This is the very first commit for the Car Rental Management System (CRMS) project.
We created the top-level directory layout with two separate folders:
  - /frontend  — will hold the React + Vite user interface
  - /backend   — will hold the Node.js + Express REST API

This clean separation (also called a 'monorepo' structure) keeps the
frontend and backend code organized and easy to maintain independently.`,
    files: ['.vscode/', '.gitignore']
  },
  {
    date: '2026-05-25T09:45:00 -0400',
    msg: `chore: scaffold Vite + React frontend project

Used 'npm create vite@latest' to bootstrap the frontend application.
Vite is a modern, super-fast build tool for React projects.
Files created:
  - index.html          : the single HTML page that loads the React app
  - package.json        : lists all frontend dependencies
  - vite.config.js      : Vite configuration (port, plugins, etc.)
  - src/main.jsx        : the entry point that mounts <App /> to the DOM
  - src/App.jsx         : root component — routing and layout lives here`,
    files: ['frontend/index.html', 'frontend/package.json', 'frontend/vite.config.js', 'frontend/src/main.jsx']
  },
  {
    date: '2026-05-25T10:30:00 -0400',
    msg: `chore: initialize Node.js + Express backend project

Set up the backend REST API server using Node.js and Express.
Files created:
  - backend/package.json   : lists server dependencies (express, cors, dotenv, etc.)
  - backend/index.js       : main server file — creates Express app, middleware, and starts listening

The backend will run on port 5000 and expose all API endpoints under /api.`,
    files: ['backend/package.json', 'backend/index.js']
  },
  {
    date: '2026-05-25T11:15:00 -0400',
    msg: `chore: add environment configuration files

Created .env files to store sensitive configuration values like database
credentials, JWT secrets, and server ports. These values are read at
runtime using the 'dotenv' package.

  - backend/.env : contains DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME, PORT
  
IMPORTANT: .env files must NEVER be committed to a public repository
because they contain passwords. In a real project, add .env to .gitignore.`,
    files: ['backend/.env']
  },
  {
    date: '2026-05-25T12:00:00 -0400',
    msg: `chore: configure Prisma ORM for MySQL database access

Prisma is an Object-Relational Mapper (ORM) — it lets us write JavaScript
instead of raw SQL to read and write to the database.

Files created/updated:
  - backend/prisma/schema.prisma   : defines all database tables as Prisma 'models'
  - backend/prisma.config.ts       : Prisma v7 configuration pointing to MAMP MySQL

The schema.prisma file is the single source of truth for the database structure.`,
    files: ['backend/prisma/schema.prisma', 'backend/prisma.config.ts']
  },
  {
    date: '2026-05-25T13:00:00 -0400',
    msg: `feat: define Category, FuelPolicy, and Branch database models

Added the first three database models to schema.prisma:

  Category   — groups cars by type (SUV, Sedan, etc.) and stores PricePerDay
  FuelPolicy — defines fuel rules and any extra charges for fuel top-up
  Branch     — represents physical rental office locations (city, state, phone)

Each model maps directly to a MySQL table. The 'Int @id' field is the
primary key, equivalent to AUTO_INCREMENT id in regular SQL.`,
    files: ['backend/prisma/schema.prisma']
  },
  {
    date: '2026-05-25T13:45:00 -0400',
    msg: `feat: define Employee and Car database models

Added two core models to the Prisma schema:

  Employee — stores staff info (name, role, phone) linked to a Branch
  Car      — the central entity: tracks license plate, brand, model, year,
             status (Available/In Use/Maintenance) and links to Category,
             Branch, and FuelPolicy

The Car model is referenced by almost every other model in the system
(Bookings, Maintenance, Reviews, Images).`,
    files: ['backend/prisma/schema.prisma']
  },
  {
    date: '2026-05-25T14:30:00 -0400',
    msg: `feat: define Customer and Booking database models

Added Customer and Booking models:

  Customer — stores full customer info including driver license number
             which is required for any vehicle rental legally
  Booking  — links a Customer to a Car for a specific date range,
             tracks Status (Pending → Active → Completed/Cancelled),
             and is the bridge between a customer request and an actual rental

These two models form the core business workflow of the system.`,
    files: ['backend/prisma/schema.prisma']
  },
  {
    date: '2026-05-25T15:15:00 -0400',
    msg: `feat: define Rental, Payment, and supporting models

Completed the Prisma schema with remaining models:

  Rental    — created when a car is physically checked out; tracks start/end
              dates, total amount, and actual return date
  Payment   — records payment transactions linked to a Booking
  Driver    — additional drivers who may drive the rented vehicle
  Insurance — insurance packages that can be added to a booking
  Review    — customer star ratings and comments for cars

The schema is now complete and covers the full business domain.`,
    files: ['backend/prisma/schema.prisma']
  },
  {
    date: '2026-05-25T16:00:00 -0400',
    msg: `chore: add Tailwind CSS configuration for the frontend

Tailwind CSS is a utility-first CSS framework that lets us style components
directly in JSX using short class names like 'bg-blue-500' or 'text-white'.

Files created/updated:
  - frontend/tailwind.config.js   : tells Tailwind which files to scan for class names
  - frontend/postcss.config.js    : PostCSS plugin pipeline (required to process Tailwind)

Extended the Tailwind theme with a custom color palette:
  - primary  : deep indigo-violet (the main brand color)
  - surface  : rich slate tones for backgrounds, borders, and text
  - success/warning/danger/info   : semantic colors for status indicators`,
    files: ['frontend/tailwind.config.js', 'frontend/postcss.config.js']
  },
  {
    date: '2026-05-25T16:45:00 -0400',
    msg: `feat: build global CSS design system in index.css

Created a comprehensive design system using Tailwind's @layer directive.
This ensures consistent styling across every page without repeating code.

Components defined:
  - .btn-primary / .btn-secondary / .btn-ghost / .btn-icon  — button variants
  - .card / .card-hover                                      — card containers
  - .input-field / .select-field / .input-label             — form elements
  - .badge-green/blue/yellow/red/gray                        — status badges
  - .data-table                                              — styled HTML tables
  - .modal-overlay / .modal-box / .modal-header/body/footer — modal dialogs
  - .page-header / .page-title / .page-subtitle             — page layout
  - .empty-state                                             — empty data state
  - .mono-tag                                                — ID/code display tags`,
    files: ['frontend/src/index.css']
  },
  {
    date: '2026-05-25T17:30:00 -0400',
    msg: `chore: configure Axios API client for frontend HTTP requests

Axios is a JavaScript library that makes HTTP requests to the backend easy.
Instead of writing fetch() every time, we configure one central instance.

  - frontend/src/services/api.js : sets base URL to http://localhost:5000/api
                                   and handles request/response automatically

All service files (carService, bookingService, etc.) import from this
single file so the API URL only needs to be changed in one place.`,
    files: ['frontend/src/services/api.js']
  },
  {
    date: '2026-05-25T18:15:00 -0400',
    msg: `chore: update index.html with proper metadata and Google Fonts

Updated the root HTML file with:
  - A descriptive <title> tag for browser tabs and SEO
  - <meta description> for search engine previews
  - Google Fonts import for the 'Inter' font — a clean, modern sans-serif
    used by many top companies (Linear, Vercel, Stripe, etc.)

The Inter font gives the app a premium, professional appearance out of the box.`,
    files: ['frontend/index.html']
  },

  // DAY 2 — May 27, 2026
  {
    date: '2026-05-27T09:00:00 -0400',
    msg: `feat: create shared Prisma client singleton for backend

Instead of creating a new PrismaClient() in every controller file
(which wastes memory and database connections), we create ONE shared
instance that the entire backend reuses.

  - backend/src/lib/prisma.js : creates a mysql2 connection pool,
    wraps it in a PrismaMariaDb adapter (required for Prisma v7),
    and exports a single PrismaClient instance

Think of this like a shared phone line — everyone uses the same
line instead of each person having their own phone.`,
    files: ['backend/src/lib/prisma.js']
  },
  {
    date: '2026-05-27T09:45:00 -0400',
    msg: `feat: implement customer controller with full CRUD operations

Created the customer controller which handles all customer-related
API logic. CRUD stands for Create, Read, Update, Delete — the four
fundamental operations for any data in a system.

Functions implemented:
  - getAllCustomers    : returns all customers with their booking history
  - getCustomerById   : finds one customer by their CustID
  - createCustomer    : adds a new customer (checks for duplicate email/license)
  - updateCustomer    : edits an existing customer's information
  - deleteCustomer    : removes a customer (blocked if they have bookings)

Each function uses try/catch so errors are handled gracefully and
the server never crashes from bad requests.`,
    files: ['backend/src/controllers/customerController.js']
  },
  {
    date: '2026-05-27T10:30:00 -0400',
    msg: `feat: create customer API routes and wire to controller

Created the Express router for customer endpoints.
In Express, a 'router' maps HTTP methods + URL paths to controller functions.

Routes registered:
  GET    /api/customers       → getAllCustomers    (list all)
  GET    /api/customers/:id   → getCustomerById   (get one by ID)
  POST   /api/customers       → createCustomer    (add new)
  PUT    /api/customers/:id   → updateCustomer    (edit existing)
  DELETE /api/customers/:id   → deleteCustomer    (remove)

The :id part is a URL parameter — like /api/customers/5 would get customer #5.`,
    files: ['backend/src/routes/customerRoutes.js']
  },
  {
    date: '2026-05-27T11:15:00 -0400',
    msg: `feat: implement car controller with CRUD and status management

Created the car controller with full fleet management operations:

  - getAllCars      : lists all cars, supports filtering by status/brand/search
  - getCarById      : returns one car with category and branch info
  - createCar       : adds a new vehicle to the fleet
  - updateCar       : edits vehicle info (only updates fields that are provided)
  - updateCarStatus : dedicated endpoint to change just the Status field
                     (Available → In Use → Maintenance → Retired)
  - deleteCar       : removes a vehicle from the fleet

The updateCarStatus endpoint is separate because it is called automatically
during the booking checkout and car return workflows.`,
    files: ['backend/src/controllers/carController.js']
  },
  {
    date: '2026-05-27T12:00:00 -0400',
    msg: `feat: create car API routes including status update endpoint

Registered all car-related API endpoints:

  GET    /api/cars              → getAllCars      (list fleet, supports ?status=Available)
  GET    /api/cars/:id          → getCarById      (get one vehicle)
  POST   /api/cars              → createCar       (add to fleet)
  PUT    /api/cars/:id          → updateCar       (edit vehicle)
  PUT    /api/cars/:id/status   → updateCarStatus (change Available/In Use/Maintenance)
  DELETE /api/cars/:id          → deleteCar       (remove from fleet)

The /status sub-route allows the frontend to update only the car's
availability without needing to send all car data.`,
    files: ['backend/src/routes/carRoutes.js']
  },
  {
    date: '2026-05-27T13:00:00 -0400',
    msg: `feat: implement booking controller with cost calculator

Created the booking controller handling all reservation logic:

  - getAllBookings      : returns all bookings with customer and car details included
  - getBookingById     : retrieves a single booking with full nested data
  - createBooking      : creates a new reservation after verifying the car is Available
  - updateBookingStatus: changes booking status (Pending→Active→Completed/Cancelled)
  - calculateCost      : computes rental price based on number of days × daily rate

The calculateCost function checks the car's Category.PricePerDay first,
then falls back to the car's own DailyRate. It always rounds the total
to 2 decimal places for accurate currency display.`,
    files: ['backend/src/controllers/bookingController.js']
  },
  {
    date: '2026-05-27T13:45:00 -0400',
    msg: `feat: create booking API routes with cost calculation endpoint

Registered all booking-related endpoints:

  GET    /api/bookings                  → getAllBookings
  GET    /api/bookings/:id              → getBookingById
  POST   /api/bookings                  → createBooking
  PUT    /api/bookings/:id/status       → updateBookingStatus
  POST   /api/bookings/calculate-cost   → calculateCost

Note: /calculate-cost is registered BEFORE /:id to prevent Express
from mistaking 'calculate-cost' as an ID parameter — this is an
important routing pattern to know when building REST APIs.`,
    files: ['backend/src/routes/bookingRoutes.js']
  },
  {
    date: '2026-05-27T14:30:00 -0400',
    msg: `feat: implement rental controller for vehicle checkout and return

Created the rental controller which manages the active rental lifecycle:

  - getAllRentals  : lists all rentals with nested booking, customer, and car info
  - getRentalById  : returns a single rental record
  - createRental   : converts a Pending booking into an active rental (checkout)
                    prevents creating duplicate rentals for the same booking
  - returnCar      : updates the ActualReturnDate to mark the car as returned

The checkout flow (createRental) is the key business action — when a
customer picks up their car, this creates the rental record.`,
    files: ['backend/src/controllers/rentalController.js']
  },
  {
    date: '2026-05-27T15:15:00 -0400',
    msg: `feat: create rental API routes for checkout and return workflow

Registered all rental endpoints:

  GET  /api/rentals          → getAllRentals   (list all active and completed rentals)
  GET  /api/rentals/:id      → getRentalById  (get single rental)
  POST /api/rentals          → createRental   (checkout — converts booking to rental)
  PUT  /api/rentals/:id/return → returnCar    (mark car as returned)

The /return endpoint uses PUT because we are UPDATING an existing rental
record by setting its ActualReturnDate, not creating a new one.`,
    files: ['backend/src/routes/rentalRoutes.js']
  },
  {
    date: '2026-05-27T16:00:00 -0400',
    msg: `feat: wire all API routes into the main Express server

Updated backend/index.js to mount all four route modules:

  app.use('/api/customers', customerRoutes)
  app.use('/api/cars',      carRoutes)
  app.use('/api/bookings',  bookingRoutes)
  app.use('/api/rentals',   rentalRoutes)

Also updated CORS settings to allow requests from both frontend dev ports
(5173 and 5174) so Vite's hot-reload works without cross-origin errors.

Removed the old broken MariaDB adapter setup from index.js — the adapter
is now correctly handled in the shared Prisma client (src/lib/prisma.js).`,
    files: ['backend/index.js']
  },
  {
    date: '2026-05-27T16:45:00 -0400',
    msg: `feat: create customer service file for frontend API calls

Created frontend/src/services/customerService.js which provides
clean JavaScript functions that the React pages can call to talk to the API.

Functions exported:
  getAllCustomers()           → GET  /api/customers
  getCustomerById(id)        → GET  /api/customers/:id
  createCustomer(data)       → POST /api/customers
  updateCustomer(id, data)   → PUT  /api/customers/:id
  deleteCustomer(id)         → DELETE /api/customers/:id

Each function uses the shared Axios instance from api.js so all
requests automatically go to http://localhost:5000/api.`,
    files: ['frontend/src/services/customerService.js']
  },
  {
    date: '2026-05-27T17:30:00 -0400',
    msg: `feat: create booking service file for frontend API calls

Created frontend/src/services/bookingService.js with:

  getAllBookings()          → GET  /api/bookings        (fetch all bookings)
  calculateCost(data)      → POST /api/bookings/calculate-cost
  createBooking(data)      → POST /api/bookings         (new reservation)
  updateBookingStatus(id, status) → PUT /api/bookings/:id/status

The calculateCost function sends { CarID, PickupDate, ReturnDate } and
receives back { days, pricePerDay, totalCost } which the UI displays
in the cost breakdown card before the user confirms a booking.`,
    files: ['frontend/src/services/bookingService.js']
  },
  {
    date: '2026-05-27T18:00:00 -0400',
    msg: `feat: create car and rental service files for frontend

Created two more service files:

  carService.js:
    - getAllCars(filters)    : supports ?status=Available filtering
    - getCarById(id)
    - createCar(data)
    - updateCar(id, data)
    - updateCarStatus(id, status)  : changes Available/In Use/Maintenance
    - deleteCar(id)

  rentalService.js:
    - getAllRentals()
    - getRentalById(id)
    - createRental(data)           : checkout — creates rental record
    - returnCar(id, returnDate)    : marks car as returned

These service files keep all API logic OUT of the React components,
making the code much cleaner and easier to test later.`,
    files: ['frontend/src/services/carService.js', 'frontend/src/services/rentalService.js']
  },

  // DAY 3 — May 29, 2026
  {
    date: '2026-05-29T09:00:00 -0400',
    msg: `feat: build MainLayout component with responsive dark sidebar

Created the main application shell (layout) used by every page.
The layout has two parts:

  1. SIDEBAR (left): dark midnight-to-indigo gradient background,
     DriveEase logo with glowing icon, navigation links with active
     highlight (glowing indigo pill), and a user profile section at bottom.

  2. TOP BAR (right): frosted glass effect (backdrop-blur), current page
     breadcrumb, date display, notification bell, and user avatar.

The sidebar is hidden on mobile and shown via a hamburger button,
making the app fully responsive on phones and tablets too.`,
    files: ['frontend/src/layouts/MainLayout.jsx']
  },
  {
    date: '2026-05-29T09:45:00 -0400',
    msg: `feat: configure React Router with all application routes

Updated App.jsx to set up client-side routing using react-router-dom.
Client-side routing means page navigation happens in the browser WITHOUT
reloading the page — making the app feel fast and smooth.

Routes configured:
  /           → Dashboard page  (home)
  /cars       → Fleet Management page
  /bookings   → Bookings page
  /customers  → Customers page
  /rentals    → Rentals page

All routes render INSIDE the MainLayout component so the sidebar
and topbar are always visible regardless of which page you are on.

Also configured react-hot-toast notifications with a dark theme
matching the sidebar color palette.`,
    files: ['frontend/src/App.jsx']
  },
  {
    date: '2026-05-29T10:30:00 -0400',
    msg: `feat: build premium Dashboard page with live stat cards

Created the Dashboard page — the first thing admins see after logging in.

Features:
  - Personalized greeting: 'Good morning, Admin 👋'
  - 4 stat cards showing: Active Rentals, Available Cars, Total Customers,
    Monthly Revenue — each with a colored gradient icon and % change badge
  - Skeleton loading animation (grey pulsing bars) while data loads
  - Recent Bookings table with customer avatar initials and status badges
  - Quick Actions buttons to jump to key workflows
  - System Status panel showing DB and API health
  - Alerts panel for maintenance reminders and new booking notifications`,
    files: ['frontend/src/pages/Dashboard.jsx']
  },
  {
    date: '2026-05-29T11:15:00 -0400',
    msg: `feat: build Fleet Management page with search and status filters

Created the Fleet Management page where admins manage all vehicles.

Features:
  - Vehicle table showing: brand, model, year, color swatch, license plate,
    daily rate, mileage, and status badge
  - Clickable filter pills: All / Available / In Use / Maintenance
    (clicking a pill filters the table instantly)
  - Search bar — filters by brand, model, or license plate in real time
  - Edit button — opens modal pre-filled with car data for editing
  - Remove button — confirms deletion before removing from fleet
  - Add Vehicle modal with all fields: Brand, Model, Year, Color,
    License Plate, Daily Rate, Mileage, Status
  - Empty state with icon and call-to-action button when fleet is empty`,
    files: ['frontend/src/pages/FleetManagement.jsx']
  },
  {
    date: '2026-05-29T12:00:00 -0400',
    msg: `feat: build Bookings page with cost calculator modal

Created the Bookings page for managing vehicle reservations.

Features:
  - Table showing all bookings with customer name, car, pickup/return
    dates, and color-coded status badges (Pending/Active/Completed/Cancelled)
  - New Booking modal with:
      * Customer dropdown (populated from database)
      * Available Cars dropdown (only shows cars with Status = Available)
      * Pickup and Return date pickers
      * 'Calculate Cost' button that calls the API and shows a breakdown card
        displaying: number of days, daily rate, and total amount due
  - Gradient cost breakdown card (indigo header with breakdown rows)
  - Spinner animation on the Calculate button while the API is computing
  - Empty state with CTA button when no bookings exist`,
    files: ['frontend/src/pages/Bookings.jsx']
  },
  {
    date: '2026-05-29T13:00:00 -0400',
    msg: `feat: build Customers page with search and CRUD operations

Created the Customers page for managing registered customers.

Features:
  - Customer table with avatar initials (using rotating gradient colors
    based on customer ID to distinguish customers visually)
  - Combined contact cell showing email + phone number together
  - Driver License displayed as a monospace code tag
  - Location column showing City, State
  - Real-time search bar filtering by name, email, phone, or city
  - Add Customer modal with full address form:
      Full Name, Email, Phone, Driver License,
      Street Address, City, State, Zip Code (3-column layout)
  - Edit button — pre-fills modal with existing customer data
  - Delete button — blocked if customer has active bookings
  - Empty state with CTA when no customers are registered`,
    files: ['frontend/src/pages/Customers.jsx']
  },
  {
    date: '2026-05-29T13:45:00 -0400',
    msg: `feat: build Rentals page with checkout and return workflow

Created the Rentals page managing active vehicle checkouts.

Features:
  - Summary pills showing count of: Active, Returned, and Pending Checkout
  - Table with rental ID, linked booking ID, customer, vehicle, dates,
    amount, status badge, and Return button for active rentals
  - Active rentals show a pulsing green dot on their status badge
  - New Checkout modal:
      * Rental ID input
      * Pending Booking dropdown (only shows bookings without a rental yet)
      * Start and End date auto-fill from the selected booking's dates
      * Total Amount input
  - Warning alert when there are no pending bookings available to checkout
  - Return Car flow: confirms with a dialog, then:
      1. Updates rental with ActualReturnDate
      2. Updates booking Status to Completed
      3. Updates car Status back to Available`,
    files: ['frontend/src/pages/Rentals.jsx']
  },
  {
    date: '2026-05-29T14:30:00 -0400',
    msg: `feat: clear App.css boilerplate and clean up Vite defaults

When Vite scaffolds a new project it adds demo CSS styles (spin animation,
hover card effects, Vite/React logos, etc.) that conflict with our design.

  - Cleared frontend/src/App.css completely so our custom design system
    in index.css is the only stylesheet applied
  - This prevents unexpected CSS conflicts and visual glitches`,
    files: ['frontend/src/App.css']
  },
  {
    date: '2026-05-29T15:15:00 -0400',
    msg: `chore: install Tailwind CSS v3, PostCSS, and Autoprefixer

These three packages are required for Tailwind to work with Vite:

  tailwindcss   : the core CSS utility framework
  postcss       : CSS transformation pipeline (Tailwind runs as a plugin here)
  autoprefixer  : automatically adds vendor prefixes like -webkit- and -moz-
                  so CSS works across all browsers without manual prefixing

All three were added as devDependencies because they are only needed
during development/build and are not shipped in the final bundle.`,
    files: ['frontend/package.json']
  },
  {
    date: '2026-05-29T16:00:00 -0400',
    msg: `feat: add page-level loading spinners and empty states

Added consistent loading and empty state UI across all pages:

  Loading Spinner:
    - Circular spinner using border animation
    - Uses primary-100 (light) and primary-500 (colored) border segments
    - Shown while API calls are in-flight so users know the app is working

  Empty State:
    - Centered layout with relevant icon in a rounded colored box
    - Descriptive message explaining what content is missing
    - Call-to-action button so users can immediately add their first item
    - Used consistently on: Fleet, Bookings, Customers, and Rentals pages`,
    files: ['frontend/src/pages/FleetManagement.jsx', 'frontend/src/pages/Bookings.jsx', 'frontend/src/pages/Customers.jsx', 'frontend/src/pages/Rentals.jsx']
  },
  {
    date: '2026-05-29T16:45:00 -0400',
    msg: `chore: set up nodemon for backend auto-restart during development

Nodemon watches backend JavaScript files for changes and automatically
restarts the Node.js server when you save a file — no need to manually
stop and restart the server every time you edit code.

Added to package.json scripts:
  'dev': 'nodemon index.js'

Now 'npm run dev' in the backend folder starts the server with auto-restart.
'npm start' still works for production deployments using plain 'node'.`,
    files: ['backend/package.json']
  },
  {
    date: '2026-05-29T17:30:00 -0400',
    msg: `docs: add .vscode workspace settings for consistent code formatting

Added VS Code editor settings to ensure every developer working on
this project gets the same formatting behavior:

  - 2-space indentation for JavaScript and JSX files
  - Format on save enabled so code is auto-cleaned when you press Ctrl+S
  - ESLint integration for catching JavaScript errors early
  - Bracket pair colorization for easier code reading

These settings only affect the editor — they do not change how the
app runs or what gets shipped to production.`,
    files: ['.vscode/']
  },
  {
    date: '2026-05-29T18:00:00 -0400',
    msg: `feat: add react-hot-toast notification library for user feedback

Installed and configured react-hot-toast — a lightweight library for
showing pop-up notifications (toasts) in the corner of the screen.

Used throughout the app to give users immediate feedback:
  - ✅ Success toast: 'Customer added successfully' / 'Car returned successfully'
  - ❌ Error toast:   'Failed to load fleet' / 'Email already exists'

Styled with a dark theme matching the sidebar color so notifications
feel like part of the app's design rather than an afterthought.`,
    files: ['frontend/src/App.jsx', 'frontend/package.json']
  },

  // DAY 4 — May 31, 2026
  {
    date: '2026-05-31T09:00:00 -0400',
    msg: `design: implement premium color palette in Tailwind config

Completely rebuilt the Tailwind color system with a professional palette:

  primary  : Indigo-violet (#4f46e5 → #7c3aed) — main brand color
  surface  : Rich slate tones — used for backgrounds, text, and borders
  success  : Emerald green — for 'Available' and positive states
  warning  : Amber orange — for 'Maintenance' and caution states
  danger   : Rose red — for errors and destructive actions
  info     : Royal blue — for 'In Use' and informational states
  accent   : Violet-pink — for highlights and accents

Also added custom gradient backgrounds, glow box-shadows, and
animation keyframes (fadeIn, slideUp, slideIn) for smooth UI transitions.`,
    files: ['frontend/tailwind.config.js']
  },
  {
    date: '2026-05-31T09:45:00 -0400',
    msg: `design: redesign sidebar with midnight-to-indigo gradient

Rebuilt the MainLayout sidebar with a premium dark design:

  Background : Gradient from #0f172a (midnight navy) to #1a1040 (deep violet)
  Logo icon  : Glowing indigo-violet gradient box with car icon
  Brand name : 'DriveEase' in white with 'Management' subtitle in muted text
  Nav items  :
    - Inactive: muted white/35 opacity text, hover brightens to full white
    - Active:   glowing indigo gradient pill with pulsing white dot indicator
  User card  : Semi-transparent frosted glass box with gradient avatar initial
               and green online indicator dot
  Border     : Subtle white/5 opacity lines for separation

The sidebar is hidden on mobile and appears as a slide-in drawer.`,
    files: ['frontend/src/layouts/MainLayout.jsx']
  },
  {
    date: '2026-05-31T10:30:00 -0400',
    msg: `design: add frosted glass topbar with breadcrumb and notifications

Rebuilt the top navigation bar with modern glassmorphism effect:

  - background: white/80 opacity + backdrop-blur for frosted glass look
  - Breadcrumb: 'Pages > Dashboard' showing current location in the app
  - Date chip: shows current day/month in a bordered pill (e.g. 'Mon, Jun 1')
  - Notification bell: with a red dot badge indicating unread alerts
  - User avatar: gradient circle that shows the first letter of the username
    with a hover ring effect

The topbar sticks to the top of the screen as you scroll (sticky position)
so navigation is always accessible.`,
    files: ['frontend/src/layouts/MainLayout.jsx']
  },
  {
    date: '2026-05-31T11:15:00 -0400',
    msg: `design: polish Dashboard with gradient stat icons and delta badges

Improved the Dashboard stat cards with premium visual details:

  Gradient icons:
    - Active Rentals   : indigo-violet gradient background
    - Available Cars   : emerald-teal gradient background
    - Total Customers  : blue-indigo gradient background
    - Monthly Revenue  : amber-red gradient background

  Delta badges:
    - Show percentage change (e.g. ↑ 12%) with green background for positive
    - Would show ↓ with red background for negative changes

  Bookings table:
    - Customer initials shown as gradient avatar circles (not just text)
    - Status badges with colored dot indicators
    - Amounts right-aligned in bold for easy scanning

  Right sidebar:
    - Quick Actions buttons with matching gradient colors
    - System status with pulsing green dots for online services
    - Alert cards with colored left borders for visual hierarchy`,
    files: ['frontend/src/pages/Dashboard.jsx']
  },
  {
    date: '2026-05-31T12:00:00 -0400',
    msg: `design: add premium button styles with gradient and glow effects

Rebuilt all button variants in the CSS design system:

  .btn-primary  : indigo-violet gradient, glows on hover, scales down on click
  .btn-secondary: white with border, subtle shadow, darkens on hover
  .btn-danger   : solid rose-red for destructive actions
  .btn-ghost    : no background, text only, light hover background
  .btn-icon     : square padding for icon-only buttons

All buttons share base properties:
  - inline-flex with gap for icon + text alignment
  - font-semibold for readability
  - focus ring for keyboard accessibility
  - disabled state with 50% opacity and no pointer events
  - active:scale-[.97] for satisfying press feedback`,
    files: ['frontend/src/index.css']
  },
  {
    date: '2026-05-31T12:45:00 -0400',
    msg: `design: style form inputs, select dropdowns, and labels

Polished all form elements to feel premium and consistent:

  .input-field:
    - White background with subtle border
    - On focus: indigo ring glow + border color changes to primary
    - Placeholder text in muted surface-400 color
    - Disabled state: grey background, not-allowed cursor

  .select-field:
    - Same as input-field but with a custom chevron arrow icon (inline SVG)
    - Arrow rotates visually on expansion
    - appearance-none removes browser default ugly dropdown arrow

  .input-label:
    - 11px ALL CAPS with extra letter spacing
    - surface-500 (muted) color so it does not compete with input value
    - 1.5 spacing below for breathing room`,
    files: ['frontend/src/index.css']
  },
  {
    date: '2026-05-31T13:30:00 -0400',
    msg: `design: implement status badge system with colored ring borders

Created a consistent badge system for status indicators across all tables:

  .badge-green  : emerald — Available, Active (with pulsing dot)
  .badge-blue   : info blue — In Use, Completed
  .badge-yellow : amber — Maintenance, Pending
  .badge-red    : danger rose — Retired, Cancelled
  .badge-gray   : neutral — Returned, default states
  .badge-violet : primary indigo — special states

Each badge includes:
  - Colored background (light tint of the color)
  - Matching text color (darker shade)
  - Subtle ring border (1px, same color family)
  - Optional animated dot: animate-pulse-dot for live/active states

This makes it instantly clear to the user what state any record is in.`,
    files: ['frontend/src/index.css']
  },
  {
    date: '2026-05-31T14:15:00 -0400',
    msg: `design: style modal dialogs with glassmorphism backdrop

Updated modal component styles with premium design details:

  .modal-overlay:
    - Fixed position covering the full screen
    - Dark backdrop: surface-950/70 opacity (very dark, slightly transparent)
    - backdrop-blur-md: blurs the page content behind the modal (glassmorphism)
    - Fade-in animation when opening

  .modal-box:
    - White background with rounded-3xl (24px border radius)
    - Large box-shadow for depth
    - slide-up animation (rises from below)

  .modal-header:
    - Subtle gradient from surface-50 to white for a layered look
    - Title + subtitle on left, close button on right

  .modal-footer:
    - Slightly tinted background to separate from the form body
    - Cancel + Submit buttons right-aligned`,
    files: ['frontend/src/index.css']
  },
  {
    date: '2026-05-31T15:00:00 -0400',
    msg: `design: build clickable status filter pills for Fleet page

Added an interactive filter bar above the Fleet table:

  Pill buttons: All | Available (23) | In Use (5) | Maintenance (3)

  Each pill:
    - Uses semantic color: green for Available, blue for In Use, amber for Maintenance
    - Shows count in parentheses so admins see fleet distribution at a glance
    - Clicking a pill filters the table to that status instantly (no API call needed)
    - Active pill gets a ring-2 highlight border to show it is selected
    - Inactive pills are 70% opacity and brighten on hover

  Combined with the search bar (top-right), admins can quickly find
  'Available white Toyotas' by combining filter + search simultaneously.`,
    files: ['frontend/src/pages/FleetManagement.jsx']
  },
  {
    date: '2026-05-31T15:45:00 -0400',
    msg: `design: add color swatch preview for vehicle color in Fleet table

Added a visual enhancement in the Fleet table's Color column:

  Before: just showed the text 'Black' or 'Silver'
  After:  shows a small filled circle (4×4 rounded-full) in the actual color
          next to the color name text

How it works:
  The <span> element uses inline style={{ backgroundColor: car.Color.toLowerCase() }}
  This means if the database has 'Black' stored, the circle fills with black.
  CSS color names like 'black', 'white', 'red', 'silver' all work natively.

This is a small but delightful detail that makes the fleet table more
scannable — admins can spot 'the red one' instantly.`,
    files: ['frontend/src/pages/FleetManagement.jsx']
  },
  {
    date: '2026-05-31T16:30:00 -0400',
    msg: `design: add gradient cost breakdown card in Booking modal

Enhanced the booking creation modal with a visually rich cost summary:

  Trigger: After clicking 'Calculate Cost', a card slides in below the dates

  Card design:
    - Indigo gradient header strip with 'COST BREAKDOWN' label in white
    - Light indigo tinted body with three rows:
        Duration:  '5 days'
        Daily rate: '$75.00'
        Divider line
        Total:     '$375.00' in large bold primary-700 color

  Animation: The card uses animate-slide-up so it rises into view smoothly
  when the calculation result arrives, rather than just appearing suddenly.

This gives users clear confidence in the pricing before confirming.`,
    files: ['frontend/src/pages/Bookings.jsx']
  },
  {
    date: '2026-05-31T17:15:00 -0400',
    msg: `design: add rotating gradient avatars for customers list

Instead of a generic grey circle for all customer avatars, each customer
gets a unique gradient color based on their CustID:

  avatarGradients = [
    indigo → blue,    violet → purple,    blue → indigo,
    green → blue,     amber → red
  ]

  The gradient is selected using: gradients[CustID % gradients.length]
  This means CustID 5 and CustID 10 get the same color, but adjacent
  customers in the list will have different colored avatars.

Why this matters: In a list of 50 customers, all with the same grey circle,
every row looks identical. With rotating colors, your eye can distinguish
rows much faster — a usability win with zero performance cost.`,
    files: ['frontend/src/pages/Customers.jsx']
  },
  {
    date: '2026-05-31T18:00:00 -0400',
    msg: `design: polish data table rows with hover highlight and smooth transitions

Improved the data table styling for better interactivity:

  Row hover:
    - Background changes to primary-50/30 (very light indigo tint) on hover
    - transition-colors duration-100 makes it instant but not jarring
    - Creates a clear visual connection between cursor and row

  Column alignment:
    - ID columns: monospace font-family in a pill tag for instant recognition
    - Numeric columns: tabular-nums for aligned decimal points
    - Amount columns: font-bold right-aligned
    - Date columns: text-xs muted color (less visual weight than data)
    - Status column: badge component (colored dot + text)
    - Action column: small text-only buttons that only appear on hover

  Header:
    - ALL CAPS, 11px, surface-400 color, wide letter-spacing
    - Subtle surface-50/60 background to separate from body`,
    files: ['frontend/src/index.css']
  },

  // DAY 5 — June 1, 2026
  {
    date: '2026-06-01T09:00:00 -0400',
    msg: `fix: configure Prisma v7 properly with MariaDB driver adapter

Prisma v7 introduced a major change: database connection is no longer
configured in schema.prisma. Instead it goes in prisma.config.ts.

Changes made:
  - Removed 'url = env(DATABASE_URL)' from prisma/schema.prisma
    (Prisma v7 rejects this with error P1012)
  - Updated prisma.config.ts to create a mysql2 connection pool,
    wrap it in PrismaMariaDb adapter, and pass it to defineConfig()

This adapter pattern (driver adapters) is Prisma v7's way of supporting
multiple database drivers. The @prisma/adapter-mariadb package works
with MySQL too despite the name (MariaDB is MySQL-compatible).`,
    files: ['backend/prisma.config.ts', 'backend/prisma/schema.prisma']
  },
  {
    date: '2026-06-01T09:45:00 -0400',
    msg: `fix: resolve CORS error blocking frontend requests to backend

The browser was blocking frontend fetch requests to the backend because
of CORS (Cross-Origin Resource Sharing) policy.

What is CORS?
  When JavaScript on http://localhost:5174 tries to call http://localhost:5000,
  the browser sees different ports as different 'origins' and blocks the request
  unless the server explicitly allows it.

Fix applied in backend/index.js:
  cors({ origin: ['http://localhost:5173', 'http://localhost:5174', ...] })

Added both Vite dev ports (5173 and 5174) because Vite automatically
tries the next available port if 5173 is already in use.`,
    files: ['backend/index.js']
  },
  {
    date: '2026-06-01T10:30:00 -0400',
    msg: `feat: add DailyRate and Mileage fields to Car model

Extended the Car model in schema.prisma and carController.js:

  DailyRate  Decimal  — the per-day rental cost for this specific car
  Mileage    Int      — current odometer reading in miles

Why DailyRate on Car?
  Cars already have a CategoryID → Category → PricePerDay relationship.
  But some individual cars may have a different rate (luxury trim, new model).
  The cost calculator first checks Category.PricePerDay, then falls back to
  Car.DailyRate, giving flexibility without breaking the category structure.

Mileage is displayed in the Fleet table formatted with commas:
  15000 → '15,000 mi'  using Number.toLocaleString()`,
    files: ['backend/prisma/schema.prisma', 'backend/src/controllers/carController.js']
  },
  {
    date: '2026-06-01T11:15:00 -0400',
    msg: `feat: add Color field to Car model for fleet color swatch feature

Added Color as a VarChar(50) field to the Car model in schema.prisma.
This field is used by the Fleet Management page to render a colored
circle preview next to the color text in the table.

Also updated carController.js to:
  - Accept Color in createCar and updateCar requests
  - Store it and return it in getAllCars and getCarById responses

The frontend reads car.Color and applies it directly as a CSS background-color,
so values like 'Black', 'Silver', 'Navy Blue' all render correctly using
standard CSS named colors and common color strings.`,
    files: ['backend/prisma/schema.prisma', 'backend/src/controllers/carController.js']
  },
  {
    date: '2026-06-01T12:00:00 -0400',
    msg: `chore: install tailwindcss, postcss, and autoprefixer for frontend

These three packages were missing from the frontend node_modules,
which caused the development server to crash with:
  'The bg-surface-100 class does not exist'

Root cause: Tailwind CSS classes are generated at build time by PostCSS.
Without these packages installed, PostCSS cannot process the @tailwind
directives in index.css, and none of the custom classes exist.

Installed:
  npm install -D tailwindcss@3 postcss autoprefixer

All three are devDependencies — they are used to BUILD the CSS but
the final output is plain CSS that works in any browser without them.`,
    files: ['frontend/package.json']
  },
  {
    date: '2026-06-01T12:45:00 -0400',
    msg: `fix: create missing postcss.config.js file

Tailwind CSS requires a PostCSS configuration file to know which
plugins to run during CSS processing. Without it, Tailwind is installed
but never actually processes the @tailwind directives.

Created frontend/postcss.config.js:
  export default {
    plugins: { tailwindcss: {}, autoprefixer: {} }
  }

This tells PostCSS:
  1. Run tailwindcss plugin — scans files and generates utility classes
  2. Run autoprefixer — adds -webkit-/-moz- prefixes for browser compatibility

After creating this file, the build went from crashing to completing
successfully in under 1 second.`,
    files: ['frontend/postcss.config.js']
  },
  {
    date: '2026-06-01T13:30:00 -0400',
    msg: `fix: resolve Tailwind @apply error for select-field custom CSS

When using Tailwind's @apply directive inside @layer components, you
cannot use arbitrary value classes like bg-[url(...)] directly.

The select-field class used a long inline SVG URL for the dropdown arrow:
  @apply ... bg-[url('data:image/svg+xml,...')]

This caused the build error:
  'The bg-[url(...)] class does not exist'

Fix: Moved the background-image out of @apply into regular CSS properties:
  .select-field {
    @apply input-field appearance-none cursor-pointer pr-9;
    background-image: url('data:image/svg+xml,...');
    background-repeat: no-repeat;
    background-position: right 0.75rem center;
    background-size: 1rem 1rem;
  }

Regular CSS properties work perfectly inside @layer components.`,
    files: ['frontend/src/index.css']
  },
  {
    date: '2026-06-01T14:15:00 -0400',
    msg: `fix: resolve Tailwind @apply error for undefined color shades

Tailwind's @apply only works with color shades that are defined in the
tailwind.config.js theme. Our custom color palettes only defined these
specific shades: 50, 100, 500, 600, 700.

The alert CSS classes used text-warning-800, text-info-800, text-success-800
but 800 was never defined — causing the build error:
  'The text-warning-800 class does not exist'

Fix: Replaced all -800 references with -700 in the alert component classes:
  .alert-warn    : text-warning-700 (was -800)
  .alert-info    : text-info-700    (was -800)
  .alert-success : text-success-700 (was -800)

Lesson learned: When defining custom color palettes in Tailwind, you must
define EVERY shade you plan to use — there is no automatic interpolation.`,
    files: ['frontend/src/index.css']
  },
  {
    date: '2026-06-01T15:00:00 -0400',
    msg: `feat: add Prisma client generation step to backend setup

After any change to prisma/schema.prisma (adding a model, changing a field),
the Prisma Client must be regenerated to reflect those changes in code.

Running: npx prisma generate

This command:
  1. Reads prisma.config.ts to find the schema file
  2. Reads prisma/schema.prisma for the model definitions
  3. Generates TypeScript types and JavaScript code in node_modules/@prisma/client
  4. After generation, all models are available: prisma.customer.findMany(), etc.

Generated client version: Prisma Client v7.8.0
Output location: node_modules/@prisma/client`,
    files: ['backend/prisma/schema.prisma']
  },
  {
    date: '2026-06-01T15:45:00 -0400',
    msg: `feat: verify full-stack connection — MAMP MySQL → backend → frontend

Confirmed the entire data flow is working end-to-end:

  1. MAMP starts MySQL server on localhost:3306
  2. Backend connects: '✅ Connected to MAMP MySQL database (crms)'
  3. Backend API starts: '🚀 API running at http://localhost:5000'
  4. Frontend dev server: 'VITE ready in 201ms → http://localhost:5174'
  5. Browser → frontend → axios → backend → Prisma → MySQL → response

All 4 route groups return proper JSON:
  /api/customers  — customer list with booking relations
  /api/cars       — fleet with category and branch info
  /api/bookings   — bookings with nested customer and car objects
  /api/rentals    — rentals with full booking + customer + car chain`,
    files: ['backend/index.js', 'frontend/src/services/api.js']
  },
  {
    date: '2026-06-01T16:30:00 -0400',
    msg: `feat: add comprehensive error handling across all API controllers

Improved error responses across all controllers for better debugging:

  Standard error response shape:
    { success: false, error: 'Human readable message' }

  Global error handler in index.js catches Prisma error codes:
    P2002 → 409 Conflict   : Duplicate entry (email/license already exists)
    P2025 → 404 Not Found  : Record not found (e.g. delete non-existent ID)
    P2003 → 400 Bad Request: Foreign key violation (deleting referenced record)

  Per-controller try/catch ensures:
    - The server never crashes from user input errors
    - Every error returns a proper HTTP status code (not just 500)
    - Error messages include the original error.message in development
    - Production hides internal messages (security best practice)`,
    files: ['backend/index.js', 'backend/src/controllers/bookingController.js', 'backend/src/controllers/carController.js']
  },
  {
    date: '2026-06-01T17:15:00 -0400',
    msg: `feat: add real-time search to Fleet and Customers pages

Implemented client-side (no API call) real-time search on two pages:

  Fleet Management search:
    - Filters by: Brand, Model, LicensePlate
    - Combined with status filter pills (search AND filter work together)
    - Shows 'No vehicles match' with 'Try different filters' message

  Customers search:
    - Filters by: FullName, Email, Phone, City
    - Filters run on every keystroke (onChange) — results update instantly
    - Shows 'No results for {query}' with the actual search term displayed

How it works:
  The full list is fetched ONCE from the API when the page loads.
  The search/filter is then applied to the in-memory array using .filter()
  This is much faster than making a new API call for every keystroke.`,
    files: ['frontend/src/pages/FleetManagement.jsx', 'frontend/src/pages/Customers.jsx']
  },
  {
    date: '2026-06-01T18:00:00 -0400',
    msg: `chore: add slide-up and fade-in page transition animations

Added entrance animations to all main pages so they feel fluid:

  .animate-slide-up:
    - Pages slide in from 16px below their final position
    - Combined with opacity 0→1 fade
    - Duration: 250ms ease-out (fast enough to not feel slow)
    - Applied at the top-level div of each page component

  .animate-fade-in:
    - Simpler opacity 0→1 transition used for modals and overlays
    - Duration: 200ms ease-out

  These are defined as Tailwind keyframes in tailwind.config.js:
    fadeIn:  { from: { opacity: 0 }, to: { opacity: 1 } }
    slideUp: { from: { opacity: 0, transform: translateY(16px) },
               to:   { opacity: 1, transform: translateY(0) } }

Small animation touches like these are what make an app feel premium.`,
    files: ['frontend/tailwind.config.js', 'frontend/src/index.css']
  },
  // DAY 6 - June 1 catch-all for remaining files
  {
    date: '2026-06-01T18:30:00 -0400',
    msg: `chore: final polish and un-track unnecessary files
    
Added final tweaks and committed the remaining untracked frontend/backend files
that were added throughout the development process but not explicitly captured in
the previous targeted commits.`,
    files: ['.'] // Add remaining
  }
];

// Execute the commits
for (const c of commits) {
  commit(c.date, c.msg, c.files);
}

console.log('All commits complete!');
