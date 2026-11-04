import React from "react";
import { useSelector } from "react-redux";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute() {
  const { isLoggedIn } = useSelector((store) => store.auth);
  const location = useLocation();

  // If not logged in, redirect to login page and save the attempted location
  if (!isLoggedIn) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // If logged in, render protected component
  return <Outlet />;
}