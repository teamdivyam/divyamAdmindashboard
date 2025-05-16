import React, { useEffect, useMemo } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { isAuth } from "../../store/Auth/Authentication";
import { useDispatch } from "react-redux";
import { resetImageStore } from "../../store/UploadImages/uploadImageSlice.js";
const ProtectedRoute = ({ children }) => {
  // RESET_IMAGE_STORE

  const token = useMemo(() => localStorage.getItem("AppID"), []);

  if (token) {
    return children;
  }

  return <Navigate to="/login" />;
};

export default ProtectedRoute;
