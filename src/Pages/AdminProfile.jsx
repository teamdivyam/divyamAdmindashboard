import React, { useEffect, useState } from "react";

import { Badge } from "@components/components/ui/badge";

import {
  UserCog,
  ShieldCheck,
  Mail,
  LockKeyhole,
  MapPin,
  Phone,
} from "lucide-react";

import { config } from "../../config.js";

const AdminProfile = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const getTOKEN = localStorage.getItem("AppID");

    const fetchAdminData = async () => {
      try {
        const res = await fetch(
          `${config && config.BACKEND_URL}/api/admin/profile`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json, application/xml",
              "Accept-Language": "en_US",
            },
          }
        );
        const data = await res.json();

        if (res.ok) {
          setAdminData(data);
        }
      } catch (error) {}
    };

    fetchAdminData();
  }, []);

  return (
    <div
      className="bg-neutral-100 dark:bg-gray-700 rounded-lg border p-6 mx-auto w-2/3"
      id="oderPreview"
    >
      <div className="cardHeader flex justify-between">
        <Badge
          variant="destructive"
          className="bg-orange-400 py-1 cursor-pointer hover:bg-orange-400"
        >
          <UserCog />
        </Badge>

        <Badge variant="destructive" className="bg-white  hover:bg-white">
          <span className="text-green-700 animate-pulse	">Online</span>
          <span
            className="inline-block uppercase pl-1 rounded-full  text-neutral-500
        font-medium 
        "
          ></span>
        </Badge>
      </div>

      <div className="cardBody bg-white dark:bg-slate-800 rounded-md border p-6 mt-6">
        <div className="userProfile flex flex-row ">
          <img
            src={`${config && config.IMAGE_CDN}/Uploads/admins/${
              adminData && adminData.avatar
            }`}
            className=" rounded-full shadow-lg size-24 object-cover"
          />

          {/* <img
            src="https://i.pravatar.cc/300"
            className=" rounded-full shadow-lg size-24"
          /> */}
          <div className="profileText pt-1 pl-10">
            <h2 className="capitalize font-medium text-neutral-600 text-3xl flex mt-4 gap-2 items-center">
              {adminData && adminData.fullName}
              <ShieldCheck className="text-green-400" />
            </h2>
            <p className="mobileNum flex items-center pt-2 text-neutral-400 gap-2">
              <Mail /> {adminData?.email}
            </p>

            <p className="age  mt-2  flex items-center  text-neutral-400 gap-2">
              <Phone />
              <span>{adminData?.mobileNum}</span>
            </p>

            <p className="age  mt-2  flex items-center  text-neutral-400 gap-2">
              <MapPin />
              <span>Not available </span>
            </p>

            <p className="age  mt-2  flex items-center  text-neutral-400 gap-2">
              <LockKeyhole /> <span>***********</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
