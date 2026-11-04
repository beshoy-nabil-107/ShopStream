import React from "react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { dashboardIcons, SetIcon } from "../../../assets/icons";
import "./DashboardLayout.scss";
import myAvatar from "../../../assets/images/beshoy_nabil_image.jpeg";
export default function DashboardLayout() {

  const adminAvatar = myAvatar;

  return (
    <div className="dashboard-layout d-flex min-vh-100">
      {/* Left Sidebar */}
      <aside className="dashboard-sidebar d-flex flex-column justify-content-between p-3 p-xl-4 flex-shrink-0">
        <div>
          {/* Brand Header */}
          <div className="sidebar-brand mb-4 px-2">
            <Link
              to="/"
              className="brand-title text-decoration-none fw-bolder fs-4 d-block"
            >
              ShopStream
            </Link>
            <span className="admin-subtitle text-muted small fw-medium">
              Admin Panel
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="sidebar-nav d-flex flex-column gap-2">
            <NavLink
              to="/dashboard/inventory"
              className={({ isActive }) =>
                `sidebar-link text-decoration-none rounded-3 px-3 py-2 d-flex align-items-center gap-3 fw-semibold small ${
                  isActive ? "active" : "text-secondary"
                }`
              }
            >
              <SetIcon Icon={dashboardIcons.inventory} size={18} />
              <span>Inventory</span>
            </NavLink>

            <NavLink
              to="/dashboard/orders"
              className={({ isActive }) =>
                `sidebar-link text-decoration-none rounded-3 px-3 py-2 d-flex align-items-center gap-3 fw-semibold small ${
                  isActive ? "active" : "text-secondary"
                }`
              }
            >
              <SetIcon Icon={dashboardIcons.orders} size={18} />
              <span>Orders</span>
            </NavLink>

            <NavLink
              to="/dashboard/users"
              className={({ isActive }) =>
                `sidebar-link text-decoration-none rounded-3 px-3 py-2 d-flex align-items-center gap-3 fw-semibold small ${
                  isActive ? "active" : "text-secondary"
                }`
              }
            >
              <SetIcon Icon={dashboardIcons.users} size={18} />
              <span>Users</span>
            </NavLink>
          </nav>
        </div>

        {/* Bottom Admin Info Card */}
        <div className="admin-profile-card rounded-4 p-2 d-flex align-items-center gap-3 mt-4">
          <img
            src={adminAvatar}
            alt="Beshoy Nabil"
            className="admin-avatar rounded-circle object-fit-cover flex-shrink-0"
          />
          <div className="overflow-hidden">
            <h6 className="fw-bold text-dark mb-0 small text-truncate">
              Beshoy Nabil
            </h6>
            <span className="admin-role text-muted fw-bold d-block">
              MASTER ADMIN
            </span>
          </div>
        </div>
      </aside>

      {/* Right Content Area (Inventory, Orders, or Users) */}
      <main className="dashboard-main flex-grow-1 p-4 p-lg-5 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}