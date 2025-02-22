import React, { useEffect, useState } from "react";
import { Switch } from "@components/components/ui/switch";
import APP from "../../../../dataCred.js";
import { toggleDarkMode } from "../../../store/Theme/themeSlice.js";
import { useSelector, useDispatch } from "react-redux";

const General = () => {
  const appTheme = useSelector((state) => state.theme.darkMode);
  const [isChecked, setIsChecked] = useState(appTheme == "dark" ? true : false);

  useEffect(() => {
    if (appTheme === "light") {
      document.documentElement.classList.add("light");
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, [appTheme]);

  const dispatch = useDispatch();

  const handleToggleSwitch = () => {
    setIsChecked((prev) => !prev);
    dispatch(toggleDarkMode());
  };

  return (
    <div
      id="wrapper-setting"
      className="theme dark:bg-slate-800  p-5 rounded-md"
    >
      <div className="border dark:border-gray-600 inner_wrapper rounded-md p-3  flex justify-between items-center">
        <div>
          <h3 className="font-medium capitalize">Theme</h3>
          <p className="text-xs text-slate-500">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Minima id
            consectetur magnam
          </p>
        </div>
        <Switch checked={isChecked} onCheckedChange={handleToggleSwitch} />
      </div>
    </div>
  );
};

export default General;
