import React, { useEffect, useMemo } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { isAuth } from "../../store/Auth/Authentication";
import isTokenExpired from "../../utils/isTokenExpired.js";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("AppID") || null;
  const isTokenEXP = isTokenExpired(token);

  if (token || isTokenEXP == false) {
    return children;
  }

  if (isTokenEXP == false) {
    return children;
  }

  useEffect(() => {
    if (isTokenEXP) {
      navigate("/login");
      return;
    }

    if (isTokenEXP && token) {
      return children;
    }
  }, [isTokenEXP, token]);

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
