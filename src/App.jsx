import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "./components/layout/appLayout/AppLayout";
import Home from "./pages/Home";
import DashboardLayout from "./components/layout/dashboardLayout/DashboardLayout";

import "./App.scss";
import Products from "./pages/productsPage/Products";
import ProductDetails from "./pages/productDetailsPage/ProductDetails";
import Cart from "./pages/cartPage/Cart";
import Categories from "./pages/categoriesPage/Categories";
import Login from "./pages/loginPage/Login";
import Profile from "./pages/profilePage/Profile";

import Checkout from "./pages/checkoutPage/Checkout";
import Confirmation from "./pages/checkoutPage/Confirmation";
import Register from "./pages/registerPage/Register";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

import Inventory from "./pages/dashboard/inventoryPage/Inventory.jsx";
import Orders from "./pages/dashboard/ordersPage/Orders.jsx";
import Users from "./pages/dashboard/usersPage/Users.jsx";
import AdminRoute from "./components/protectedRoute/AdminRoute.jsx";

export default function App() {
  return (
    <div>
      <Routes>
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="products/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/categories" element={<Categories />} />

          {/* Protected Routes (Requires Login) */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<Profile />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/confirmation" element={<Confirmation />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        
        <Route element={<AdminRoute />}>
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<Navigate to="inventory" replace />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="orders" element={<Orders />} />
            <Route path="users" element={<Users />} />
          </Route>
        </Route>
      </Routes>
    </div>
  );
}
