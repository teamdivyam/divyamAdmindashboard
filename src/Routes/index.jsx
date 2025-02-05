import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../Pages/Login";
import Register from "../Pages/Register";
import DashBoardLayout from "../Pages/Dashboard";
import OrdersAll from "../Pages/Dashboard/Order/OrdersAll";
import General from "../Pages/Dashboard/Settings/General";
import DashBoradIndexPage from "../Pages/Dashboard/Home";
import ProtectedRoute from "../Pages/Dashboard/ProtectedR";
import LogOut from "../Pages/Dashboard/Logout";
import Packages from "../Pages/Dashboard/Package/Packages";

// import ViewPackage from "../Pages/Dashboard/Package/ViewPackage";
import ADD_NEW_PKG from "../Pages/Dashboard/Package/ADD_NEW_PKG";
import OrderPending from "../Pages/Dashboard/Order/OrderPending";
import OrderComplete from "../Pages/Dashboard/Order/OrderComplete";
import VIEW_SINGLE_USER from "../Pages/Dashboard/Users/ViewUser";
import Change_Password from "../Pages/Dashboard/Settings/Change_Password";
import Setting_Layout from "../Pages/Dashboard/Settings/SettingLayout";
import AdminProfile from "../Pages/AdminProfile";
import Add_Delivery_Area from "../Pages/Dashboard/DeliveryAreas/Add_Delivery_Area";

import CreateNewManager from "../Pages/Dashboard/Manager/CreateNewManager";
// ../Pages/Dashboard/Employee/CreateNewEmployee

// import ViewManager from "../Pages/Dashboard/Manager/View_Manger";

import ViewManager from "../Pages/Dashboard/Manager/View_Manger";

import LIstOfDeliveryAreas from "../Pages/Dashboard/DeliveryAreas/LIstOfDeliveryAreas";
import Edit_Delivery_Area from "../Pages/Dashboard/DeliveryAreas/Edit_Delivery_Area";
import EditOrder from "../Pages/Dashboard/Order/EditOrder";
import ViewPackage from "../Pages/Dashboard/Package/ViewPackage";
import OrderView from "../Pages/Dashboard/Order/OrderView";

import ManagerLists from "../Pages/Dashboard/Manager/ManagerLists";

import All_Users from "../Pages/Dashboard/Users/All_Users";

const DashBoardRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashBoardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashBoradIndexPage />} />
          <Route path="admin" element={<AdminProfile />} />
          <Route path="users" element={<All_Users />} />
          <Route path="user/:USER_ID" element={<VIEW_SINGLE_USER />} />
          <Route path="order" element={<OrdersAll />} />
          <Route path="order-pending" element={<OrderPending />} />
          <Route path="order-complete" element={<OrderComplete />} />
          <Route path="order-edit/:ORDER_ID" element={<EditOrder />} />
          <Route path="Order/:ORDER_ID" element={<OrderView />} />
          <Route path="package" element={<Packages />} />
          <Route path="add-new-package" element={<ADD_NEW_PKG />} />
          <Route path="employee/:EMP_ID" element={<ViewManager />} />
          <Route path="manager" element={<ManagerLists />} />
          <Route path="new-manager" element={<CreateNewManager />} />
          <Route path="package/:PKG_ID" element={<ViewPackage />} />
          <Route path="/dashboard/logout" element={<LogOut />} />
          <Route
            path="/dashboard/add-new-area"
            element={<Add_Delivery_Area />}
          />
          <Route
            path="/dashboard/delivery-area-lists"
            element={<LIstOfDeliveryAreas />}
          />
          <Route
            path="/dashboard/delivery-area-lists/:AREA_ZONE_ID"
            element={<Edit_Delivery_Area />}
          />

          <Route path="/dashboard/setting" element={<Setting_Layout />}>
            <Route path="general" index element={<General />} />
            <Route path="change-password" element={<Change_Password />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};

export default DashBoardRoutes;
