import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import DashBoardRoutes from "./Routes/index";
import { Provider } from "react-redux";
import store from "./store/store.js";

createRoot(document.getElementById("root")).render(
  // <StrictMode>
  <Provider store={store}>
    <DashBoardRoutes />
  </Provider>
  // </StrictMode>
);

// import { useSelector, useDispatch } from "react-redux";
// import { toggleDarkMode } from "./Theme/themeSlice";
