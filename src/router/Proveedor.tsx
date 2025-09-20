import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export const Proveedor = () => {
  const { user } = useAuth();
  const isAuthenticated = !!user;

  if (!isAuthenticated || user.role !== "proveedor") {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};