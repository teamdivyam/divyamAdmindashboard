import React, { useEffect } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import isTokenExpired from "../../utils/isTokenExpired.js";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("AppID");

  if (isTokenExpired(token)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
