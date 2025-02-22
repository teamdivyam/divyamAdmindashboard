import React from "react";
import { NavLink, Outlet } from "react-router-dom";

const Setting_Layout = () => {
  return (
    <div className="border rounded-lg  mx-w-sm p-20 h-[100vh] flex justify-between">
      <div
        id="settings_menu "
        className="bg-neutral-50 
        dark:bg-gray-800
        w-1/2 pt-12 px-5 rounded-md"
      >
        <ul className="flex flex-col gap-5">
          <NavLink
            to="/dashboard/setting/general"
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <li
              className="bg-neutral-100 bg-active-link
                  dark:bg-slate-500
                  dark:text-white
           p-2 border text-black rounded-md cursor-pointer"
            >
              Theme
            </li>
          </NavLink>
          {/* to={APP && `${APP.APP_URL}/dashboard/settings/change-password`} */}

          <NavLink
            to="/dashboard/setting/change-password"
            end
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            <li
              className="bg-neutral-100 bg-active-link
                  dark:bg-slate-500
                  dark:text-white
           p-2 border text-black rounded-md cursor-pointer"
            >
              Change Password
            </li>
          </NavLink>
        </ul>
      </div>
      <div id="wrapper-setting" className="theme border p-5 rounded-md w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default Setting_Layout;
