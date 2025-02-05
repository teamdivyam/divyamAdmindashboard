import React, { useMemo } from "react";
import { useDispatch } from "react-redux";
import { Navigate } from "react-router-dom";
import { isAuth } from "../../store/Auth/Authentication";

const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();

  const token = useMemo(() => localStorage.getItem("AppID"), []);

  if (token) {
    return children;
    // dispatch(isAuth());
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
