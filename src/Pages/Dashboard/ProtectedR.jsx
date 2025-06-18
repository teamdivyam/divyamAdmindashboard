import React from "react";
import { Navigate } from "react-router-dom";
import isTokenExpired from "../../utils/isTokenExpired.js";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("AppID");
  const imagesState = useSelector((state) => state?.UploadedImgs);
  // reset store
  console.log(imagesState);

  if (isTokenExpired(token)) {
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
