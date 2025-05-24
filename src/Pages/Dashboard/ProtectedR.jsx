import React, { useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuth } from "../../store/Auth/Authentication";
import isTokenExpired from "../../utils/isTokenExpired.js";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = useMemo(() => localStorage.getItem("AppID"), []);

  const isTokenValid = isTokenExpired(token);

  if (isTokenValid) {
    navigate("/login");
  }

  if (token) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
