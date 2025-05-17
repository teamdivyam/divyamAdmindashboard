import React, { useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuth } from "../../store/Auth/Authentication";
import isTokenExpired from "../../utils/isTokenExpired.js";
const ProtectedRoute = ({ children }) => {
  const token = useMemo(() => localStorage.getItem("AppID"), []);

  const isTokenValid = isTokenExpired(token);

  if (isTokenValid) {
    return <Navigate to="/login" />;
  }

  if (token) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
