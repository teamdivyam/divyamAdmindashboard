import React, { lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginForm from "../Pages/Login";
import Register from "../Pages/Register";
import DashBoardLayout from "../Pages/Dashboard";
import DashBoradIndexPage from "../Pages/Dashboard/Home";
import LogOut from "../Pages/Dashboard/Logout";
import ProtectedRoute from "../Pages/Dashboard/ProtectedR";
import RobotTxtFile from "../Pages/robot";

const NEW_ORDERS = lazy(() => import("../Pages/Dashboard/Order/NewOrder"));
const General = lazy(() => import("../Pages/Dashboard/Settings/General"));
const Packages = lazy(() => import("../Pages/Dashboard/Package/Packages"));
const Setting_Layout = lazy(() =>
  import("../Pages/Dashboard/Settings/SettingLayout")
);
const ADD_NEW_PKG = lazy(() =>
  import("../Pages/Dashboard/Package/ADD_NEW_PKG")
);
const OrderPending = lazy(() =>
  import("../Pages/Dashboard/Order/OrderPending")
);
const OrderComplete = lazy(() =>
  import("../Pages/Dashboard/Order/OrderComplete")
);
const VIEW_SINGLE_USER = lazy(() =>
  import("../Pages/Dashboard/Users/ViewUser")
);

const Change_Password = lazy(() =>
  import("../Pages/Dashboard/Settings/Change_Password")
);

const AdminProfile = lazy(() => import("../Pages/AdminProfile"));

const Add_Delivery_Area = lazy(() =>
  import("../Pages/Dashboard/DeliveryAreas/Add_Delivery_Area")
);

const ViewManager = lazy(() =>
  import("../Pages/Dashboard/Manager/View_Manger")
);

const LIstOfDeliveryAreas = lazy(() =>
  import("../Pages/Dashboard/DeliveryAreas/LIstOfDeliveryAreas")
);

const Edit_Delivery_Area = lazy(() =>
  import("../Pages/Dashboard/DeliveryAreas/Edit_Delivery_Area")
);

const EditOrder = lazy(() => import("../Pages/Dashboard/Order/EditOrder"));

const ViewPackage = lazy(() =>
  import("../Pages/Dashboard/Package/ViewPackage")
);

const OrderView = lazy(() => import("../Pages/Dashboard/Order/OrderView"));

const ManagerLists = lazy(() =>
  import("../Pages/Dashboard/Manager/ManagerLists")
);

const All_Users = lazy(() => import("../Pages/Dashboard/Users/All_Users"));

const DeliveryAgentLists = lazy(() =>
  import("../Pages/Dashboard/DeliveryAgent/DeliveryAgentsLists")
);

const SingleDeliveryAgent = lazy(() =>
  import("../Pages/Dashboard/DeliveryAgent/SingleDeliveryAgent")
);

const CreateNewEmployee = lazy(() =>
  import("../Pages/Dashboard/Manager/CreateNewManager")
);
const Backup = lazy(() => import("../Pages/Dashboard/Settings/backup"));

const OrderCancelled = lazy(() =>
  import("../Pages/Dashboard/Order/OrderCancelled")
);

const OrderRefunded = lazy(() =>
  import("../Pages/Dashboard/Order/OrderRefended")
);
const OrdersAll = lazy(() => import("../Pages/Dashboard/Order/OrdersAll_v2"));
const NOT_FOUND = lazy(() => import("../Pages/Dashboard/Not-found"));

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
          <Route path="new-orders" element={<NEW_ORDERS />} />
          <Route path="orders" element={<OrdersAll />} />
          <Route path="order-pending" element={<OrderPending />} />
          <Route path="order-complete" element={<OrderComplete />} />
          <Route path="order-cancelled" element={<OrderCancelled />} />
          <Route path="order-refunded" element={<OrderRefunded />} />
          <Route path="edit-order/:ORDER_ID" element={<EditOrder />} />
          <Route path="Order/:ORDER_ID" element={<OrderView />} />
          <Route path="package" element={<Packages />} />
          <Route path="add-new-package" element={<ADD_NEW_PKG />} />
          <Route path="employee/:EMP_ID" element={<ViewManager />} />
          <Route path="new-employee" element={<CreateNewEmployee />} />
          <Route path="employee" element={<ManagerLists />} />
          <Route path="employee/:EMP_ID" element={<ViewManager />} />
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

          <Route
            path="/dashboard/delivery-agents"
            element={<DeliveryAgentLists />}
          />

          <Route
            path="/dashboard/delivery-agent/:AGENT_ID"
            element={<SingleDeliveryAgent />}
          />

          <Route path="/dashboard/setting" element={<Setting_Layout />}>
            <Route path="general" index element={<General />} />
            <Route path="change-password" element={<Change_Password />} />
            <Route path="backup" element={<Backup />} />
          </Route>
        </Route>
        <Route path="*" element={<NOT_FOUND />} />
      </Routes>
    </Router>
  );
};

export default DashBoardRoutes;
