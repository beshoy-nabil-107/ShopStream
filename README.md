# 🛍️ ShopStream — Modern E-Commerce Storefront & Admin Dashboard

**ShopStream** is a full-featured, responsive E-Commerce web application built with **React.js** and **Redux Toolkit**. It combines a sleek customer-facing storefront with a secure, real-time simulated **Admin Panel** for managing inventory, customer carts, and user accounts.

* **GitHub Repository:** [ShopStream Repository](https://github.com/beshoy-nabil-107/ShopStream)
* **Live Demo:** [View Live Demo](https://[your-demo-url].vercel.app)

---

## Key Features

### Customer Storefront
- **Dynamic Home Page:** Features hero banners, curated product carousels (`Featured Products`), category quick-links, and an interactive newsletter subscription banner (`Stay Ahead of the Stream`).
- **Advanced Product Catalog (`/products`):**
  - Real-time debounced search bar synced with URL query parameters (`?search=...`) and accessible from the global navigation bar.
  - Multi-criteria filtering (by Category) and sorting.
  - Dynamic server-side pagination using `limit` and `skip`.
- **Dedicated Categories View (`/categories`):** Custom icon-mapped category navigation for effortless browsing across Tech, Mobile, Watches, Fashion, Beauty, Home, Groceries, Sports, and Sunglasses.
- **Product Details Page (`/products/:id`):** Rich product view displaying image galleries, ratings, stock badges, warranty/shipping highlights, and instant cart actions.
- **Shopping Cart (`/cart`):** Full cart management (add items, increment/decrement quantities, remove items, automatic subtotal/total calculation, and persistent state via `localStorage`).
- **Protected Checkout & Order Confirmation (`/checkout`, `/confirmation`):** Multi-step payment method selection (Credit Card / PayPal), order summary review, and confirmation receipt.
- **User Authentication & Profile (`/login`, `/register`, `/profile`):**
  - JWT-based authentication powered by DummyJSON Auth API + simulated registration flow.
  - Split `First Name` and `Last Name` registration inputs with password confirmation validation.
  - Persistent user sessions and protected profile dashboard.

---

### Admin Dashboard (`/dashboard`)
- **Environment-Protected Admin Gate (`AdminRoute`):**
  - Secured via an environment variable password (`ADMIN_PANEL_PASSWORD`).
  - Protects both direct URL navigation (`/dashboard/*`) and footer quick-access links with a masked password verification screen.
- **Dedicated Dashboard Layout:** Independent sidebar navigation (`Inventory`, `Orders`, `Users`) with static Master Admin branding, completely separated from the storefront's Navbar and Footer.
- **1. Product Inventory Management (`/dashboard/inventory`):**
  - Live search by product title and dropdown filtering by category.
  - Smart pagination with ellipsis (`...`) for large datasets (10 items per page).
  - **Add New Product (Simulation):** Custom modal with local image upload & live preview (`URL.createObjectURL`), SKU generation, category selection, pricing, and stock quantity—inserting new items directly at the top of the Redux state array.
  - **Edit Product (Simulation):** Pre-populated modal displaying product images, publish status toggle switch, and live details updating.
  - **Delete Product (Simulation):** Secure confirmation modal previewing the selected product's thumbnail, SKU, stock badge, and price before removal.
- **2. Cart & Orders Management (`/dashboard/orders`):**
  - Fetches and merges live Carts and Users data from the API.
  - Displays customer initials avatars, full names, emails, total items, total price, and order status badges (`Completed`, `Pending`, `Abandoned`).
  - Instant search by customer name and dropdown filtering by order status.
  - Includes KPI summary cards (`Active Carts`, `Potential Rev`, `Avg. Session`, `Abandon Rate`), `Abandoned Cart Recovery` insights, and a dark-themed `System Alerts` panel.
- **3. User Directory Management (`/dashboard/users`):**
  - Powered by a standalone `userSlice` and `userService`.
  - Live user search, role badges (`Admin` / `Customer`), status indicators (`Active` / `Inactive`), and smart pagination.
  - **Add New User (Simulation):** Modal with full name, username, email, role, password, and custom profile photo upload + preview.
  - **Edit User (Simulation):** Update profile picture (`Upload New` / `Remove`), personal details, role, and active status toggle switch.
  - **Delete User (Simulation):** Confirmation modal with user summary card and instant state removal.

---

## Tech Stack & Libraries

| Category | Technologies Used |
| :--- | :--- |
| **Core Framework** | React.js (Vite) |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), React-Redux |
| **Routing & Navigation** | React Router DOM (`v6` - `Outlet`, `NavLink`, `useSearchParams`, Protected Routes) |
| **UI & Styling** | React-Bootstrap, Bootstrap 5, Custom SASS/SCSS (`App.scss` & Component-level `.scss`) |
| **Icons** | React Icons (`Feather Icons`, `FontAwesome 5/6`, `Ionicons 5`, `Material Design`, `Css.gg`) via centralized `SetIcon` wrapper |
| **HTTP Client & API** | Axios (Custom instance configured with `DummyJSON` REST API) |

---

## Project Architecture

```text
├── public/
├── src/
│   ├── assets/
│   │   └── icons.js                  # Centralized icon registry & SetIcon component
│   ├── components/
│   │   ├── layout/
│   │   │   ├── appLayout/            # Storefront Navbar, debounced search & Outlet
│   │   │   ├── dashboardLayout/      # Admin Sidebar & Outlet
│   │   │   ├── footer/               # Global Footer with Admin Dashboard trigger
│   │   │   └── Navbar/               # Reusable Bootstrap Navbar wrapper
│   │   └── protectedRoute/
│   │       ├── ProtectedRoute.jsx    # Customer authentication guard
│   │       └── AdminRoute.jsx        # Password-protected Admin Panel guard
│   ├── pages/
│   │   ├── homePage/                 # Storefront landing page & Newsletter banner
│   │   ├── productsPage/             # Catalog, filters, sorting & pagination
│   │   ├── productDetailsPage/       # Single product showcase
│   │   ├── categoriesPage/           # Category grid filter page
│   │   ├── cartPage/                 # Shopping cart management
│   │   ├── checkoutPage/             # Checkout & Order Confirmation pages
│   │   ├── loginPage/                # Sign In page
│   │   ├── registerPage/             # Create Account page
│   │   ├── profilePage/              # User account & order history
│   │   └── dashboard/                # Admin Panel Views
│   │       ├── inventoryPage/        # Product CRUD, search, category filter & stats
│   │       ├── ordersPage/           # Cart activity, user merge, status filter & alerts
│   │       └── usersPage/            # User Directory CRUD, photo upload & role management
│   ├── services/
│   │   ├── axios.js                  # Base Axios instance ([https://dummyjson.com](https://dummyjson.com))
│   │   ├── productService.js         # Product API calls
│   │   ├── authService.js            # Login & Register API calls
│   │   └── userService.js            # User Directory API calls
│   ├── store/
│   │   ├── store.js                  # Redux store configuration
│   │   └── slices/
│   │       ├── productSlice.js       # Products fetch & CRUD simulation reducers
│   │       ├── cartSlice.js          # Cart state & localStorage persistence
│   │       ├── authSlice.js          # User auth state & JWT storage
│   │       └── userSlice.js          # Admin user management & CRUD simulation reducers
│   ├── App.jsx                       # Application routing tree
│   ├── App.scss                      # Global CSS variables & utility styles
│   └── main.jsx                      # React DOM entry point
├── .env                              # Environment variables (ignored by Git)
├── .gitignore
├── package.json
└── vite.config.js                    # Vite config with custom envPrefix ("VITE_", "ADMIN_")