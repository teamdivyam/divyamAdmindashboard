import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Badge } from "@components/components/ui/badge";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";

import { UserRound, MapPin, Phone, Calendar, MapPinHouse } from "lucide-react";
import { config } from "../../../../config.js";
import { Button } from "@components/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/components/ui/dialog";
import moment from "moment";
import SINGLE_ORDER_CARD from "./Component/OrderCard.jsx";

const Gender_MALE_ICON = () => {
  return (
    <>
      <svg
        fill="white"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="M16 2v2h3.586l-3.972 3.972c-1.54-1.231-3.489-1.972-5.614-1.972-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-2.125-.741-4.074-1.972-5.614l3.972-3.972v3.586h2v-7h-7zm-6 20c-3.86 0-7-3.14-7-7s3.14-7 7-7 7 3.14 7 7-3.14 7-7 7z" />
      </svg>
    </>
  );
};

const Gender_Female_Icon = () => {
  return (
    <svg
      width="24px"
      height="24px"
      fill="white"
      viewBox="0 0 1024 1024"
      className="icon"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fill="#ffffff"
        d="M512 640a256 256 0 100-512 256 256 0 000 512zm0 64a320 320 0 110-640 320 320 0 010 640z"
      />
      <path
        fill="#ffffff"
        d="M512 640q32 0 32 32v256q0 32-32 32t-32-32V672q0-32 32-32z"
      />
      <path
        fill="#ffffff"
        d="M352 800h320q32 0 32 32t-32 32H352q-32 0-32-32t32-32z"
      />
    </svg>
  );
};

const VIEW_SINGLE_USER = () => {
  const navigate = useNavigate();
  const { USER_ID } = useParams();

  const [open, setOpen] = useState(false);
  const [err, setErr] = useState(true);
  const [user, setUser] = useState(null);

  const getTOKEN = localStorage.getItem("AppID");

  const handleDeleteUser = async () => {
    try {
      const res = await fetch(
        `${config && config.BACKEND_URL}/api/admin/user/${USER_ID}`,
        {
          method: "DELETE",
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${getTOKEN}`,
          },
        }
      );

      const result = await res.json();

      if (res.ok) {
        setOpen((prev) => !prev);
        toast("Successfully deleted.");
        navigate("/dashboard/users");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${config.BACKEND_URL}/api/admin/user/${USER_ID}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${getTOKEN}`,
              Accept: "application/json, application/xml",
            },
          }
        );

        if (!response.ok) {
          setErr(true);
          navigate("/dashboard/users");
        }

        const data = await response.json();

        setErr(false);
        setUser(data);
      } catch (error) {
        setErr(true);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <Toaster />

      <div
        className="bg-neutral-100 dark:bg-gray-700 rounded-lg border p-6 mx-auto w-1/2"
        id="oderPreview"
      >
        <div className="cardHeader flex justify-between">
          <Badge
            variant="destructive"
            className="bg-orange-400 py-1 cursor-pointer hover:bg-orange-400"
          >
            <UserRound />
          </Badge>

          <Badge
            variant="destructive"
            className="bg-white text-neutral-500 hover:bg-white"
          >
            <span className="font-">Joined Date:</span>
            <span
              className="inline-block uppercase pl-1 rounded-full  text-neutral-500
            font-medium 
            "
            >
              {`${user && user.createdAt}`}
            </span>
          </Badge>
        </div>

        <div className="cardBody bg-white dark:bg-slate-800 rounded-md border p-6 mt-6">
          <div className="userProfile flex flex-row ">
            {user && user.avatar ? (
              <img
                src={user?.avatar}
                className="w-[150px] h-[150px] object-cover rounded-sm shadow-sm"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://placehold.co/300x300?text=NA";
                }}
                alt="profile-image"
              />
            ) : null}

            <div className="profileText pt-10 pl-10">
              <h2 className="font-medium text-neutral-600 text-3xl flex items-center">
                {user && user.fullName ? user.fullName : "Not Available"}
                <span
                  title={user && user.gender == "male" ? "Male" : "Female"}
                  className="rounded-full size-8 flex justify-center items-center ml-2 p-2 text-white bg-orange-400"
                >
                  {user && user.gender == "male" ? (
                    <Gender_MALE_ICON />
                  ) : (
                    <Gender_Female_Icon />
                  )}
                </span>
              </h2>
              <p className="mobileNum flex items-center pt-2 text-neutral-400">
                {user && user.mobileNum ? (
                  <>
                    <Phone />
                    <span className="pl-2">{user.mobileNum}</span>
                  </>
                ) : (
                  "Mobile number is not available"
                )}
              </p>

              <p className="age  mt-2  flex items-center  text-neutral-400">
                {user && user.dob ? (
                  <>
                    <Calendar />
                    <span className="pl-2 font-normal">
                      {moment(user.dob).format("DD-MM-YYYY")}
                    </span>
                  </>
                ) : (
                  "Date of birth is not available"
                )}
              </p>

              <p className="age  mt-2  flex items-center  text-neutral-400">
                {user && user.areaPin ? (
                  <>
                    <MapPinHouse />
                    <span className="pl-2 font-normal">{user.areaPin}</span>
                  </>
                ) : (
                  "Area pin code is not available"
                )}
              </p>

              <p className="mt-2 flex text-neutral-400 ">
                {user && user.address ? (
                  <>
                    <MapPin />
                    <span className="pl-2 capitalize">{`${user.address}  `}</span>
                  </>
                ) : (
                  "user Address is not available"
                )}
              </p>
            </div>
          </div>

          {/* SHOW_ORDERS */}
          <div className="customerOrders mt-4">
            {user && user?.orders.length ? (
              <span className=" text-neutral-500 font-bold mb-4">Orders: </span>
            ) : null}
            {user && user?.orders ? (
              user.orders.map((orderId) => {
                return <SINGLE_ORDER_CARD Orderid={orderId} key={orderId} />;
              })
            ) : (
              <p>There is no orders with this user Id</p>
            )}
          </div>
        </div>

        {/* DELETE USER PROFILE */}
        <div id="userProfileDeleteAction" className="w-full flex justify-end">
          <Button
            variant="destructive"
            className="mt-8 flex justify-center items-center w-32 "
            onClick={() => {
              setOpen((prev) => !prev);
            }}
          >
            Delete
          </Button>
        </div>
      </div>

      {/*__Model__*/}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure ?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete user
              account and remove user data from our servers.
              <span className=" mt-4 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  className="w-28 "
                  onClick={() => setOpen((prev) => !prev)}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  className="w-28 "
                  onClick={handleDeleteUser}
                >
                  Confirm
                </Button>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default VIEW_SINGLE_USER;
