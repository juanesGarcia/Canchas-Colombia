import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const AdminRoute = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (!isAuthenticated || user.role !== "superadmin") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};