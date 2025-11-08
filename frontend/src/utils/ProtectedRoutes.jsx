import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router";
import { jwtDecode } from "jwt-decode";

const ProtectedRoutes = ({ requireRole, children }) => {
  const token = localStorage.getItem("pos-token");
  const user = JSON.parse(localStorage.getItem("pos-user"));
  const navigate = useNavigate();

  // Automatically check token expiration
  useEffect(() => {
    if (!token) return;

    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;
    const remainingTime = decoded.exp - now;

    if (remainingTime <= 0) {
      handleLogout();
    } else {
      // set timeout to auto logout when token expires
      const timer = setTimeout(() => handleLogout(), remainingTime * 1000);
      return () => clearTimeout(timer);
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("pos-token");
    localStorage.removeItem("pos-user");
    navigate("/login", { replace: true });
  };

  // No token or user stored
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token);
    const now = Date.now() / 1000;

    // Token expired
    if (decoded.exp < now) {
      handleLogout();
      return null;
    }

    // Role check
    if (requireRole && !requireRole.includes(user.role)) {
      return <Navigate to="/unauthorized" replace />;
    }

    // Valid token + role
    return children;
  } catch (err) {
    handleLogout();
    return null;
  }
};

export default ProtectedRoutes;
