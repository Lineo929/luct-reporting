import React from "react";
import { Navigate } from "react-router-dom";
import { getUser } from "../utils/auth";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = getUser();

  if (!user) return <Navigate to="/login" />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
