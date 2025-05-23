import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import DashBoardRoutes from "./Routes/index";
import { Provider } from "react-redux";
import store from "./store/store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <DashBoardRoutes />
  </Provider>
);
