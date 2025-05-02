import React, { useEffect, useState } from "react";
import { Link, NavLink, useNavigate, useParams } from "react-router-dom";
import { config } from "../../../../config.js";
import { Toaster } from "@components/components/ui/sonner";
import { UserRound, MapPin, Phone, Calendar, Trash2 } from "lucide-react";
import { Badge } from "@components/components/ui/badge";
import { Button } from "@components/components/ui/button";
import { format } from "date-fns";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@components/components/ui/dialog";

import SetSupervisorToManagerDialog from "./SelectSuperVisorDialoge/setSupervisorToManagerDialog";

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

const ViewManager = () => {
  const [emp, setEmp] = useState(null); //store response data in employee-state
  const { EMP_ID } = useParams();
  const navigate = useNavigate();
  const getTOKEN = localStorage.getItem("AppID") || undefined;
  const [open, setOpen] = useState(false);
  const [showSuperVisorDialog, setShowSuperVisorDialog] = useState(false);

  const handleDeleteEMP = () => {
    const DELETE_EMP = async () => {
      try {
        const res = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/employee/${EMP_ID}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
              Accept: "application/json, application/xml",
              "Accept-Language": "en_US",
            },
          }
        );
        if (!res.ok) {
          alert("Unknown error.");
          return;
        }
        if (res.ok) {
          navigate(-1);
        }
      } catch (error) {
        console.log(error);
      }
    };

    DELETE_EMP();
  };

  const handleRemoveSuperVisorFromManager = (superVisor) => {
    const UNSET_SUPERVISOR_FROM_MANGER = async () => {
      try {
        const response = await fetch(
          `${config.BACKEND_URL}/api/admin/unset-supervisor`,
          {
            method: "PATCH",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              managerID: EMP_ID,
              superVisorID: superVisor._id,
            }),
          }
        );
        const results = await response.json();

        if (results.success) {
          navigate(0);
        }
      } catch (error) {
        throw new Error(error);
      }
    };

    UNSET_SUPERVISOR_FROM_MANGER();
  };

  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/employee/${EMP_ID}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!res.ok) {
          return;
        }

        const result = await res.json();

        if (result) {
          setEmp(result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDATA();
  }, []);

  // useEffect(() => {
  //   window.location.reload();
  // }, [EMP_ID]);

  return (
    <>
      <div>
        <Toaster />
        <div
          className="bg-orange-50 dark:bg-gray-700 rounded-lg border p-6 mx-auto w-1/2"
          id="oderPreview"
        >
          <div className="cardHeader flex justify-between">
            <Badge
              variant="destructive"
              className="bg-orange-400 py-1 cursor-pointer hover:bg-orange-400 "
            >
              <UserRound />
              <span className="pl-2 uppercase font-medium text-white rounded-sm px-3">
                {emp && emp.role}
              </span>
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
                {`${emp && format(emp.createdAt, "MM-dd-yyyy")}`}
              </span>
            </Badge>
          </div>
          <div className="cardBody bg-white dark:bg-slate-800 rounded-md border p-6 mt-6">
            <div className="userProfile flex flex-row ">
              {/* <img
                src={
                  emp?.profile
                    ? `${APP.IMG_PATH}/Uploads/employee/${emp.profile}`
                    : "https://placehold.co/400x400?text=Loading.."
                }
                className="size-48 rounded-lg shadow-sm"
              /> */}
              <img
                src="https://i.pravatar.cc/300"
                className="size-48 rounded-lg shadow-sm"
              />
              <div className="profileText pt-10 pl-10">
                <h2 className="font-medium text-neutral-600 text-3xl flex items-center">
                  {emp && emp.fullName ? emp.fullName : "Not Available"}
                  <span
                    title={emp && emp.gender == "male" ? "Male" : "Female"}
                    className="rounded-full size-8 flex justify-center items-center ml-2 p-2 text-white bg-orange-400"
                  >
                    {emp && emp.gender == "male" ? (
                      <Gender_MALE_ICON />
                    ) : (
                      <Gender_Female_Icon />
                    )}
                  </span>
                </h2>
                <p className="mobileNum flex items-center pt-2 text-neutral-400">
                  {emp && emp.mobileNum ? (
                    <>
                      <Phone />
                      <span className="pl-2">{emp.mobileNum}</span>
                    </>
                  ) : (
                    "Mobile number is not available"
                  )}
                </p>
                <p className="age  mt-2  flex items-center  text-neutral-400">
                  {emp && emp.dob ? (
                    <>
                      <Calendar />
                      <span className="pl-2 font-normal">
                        {format(emp.dob, "MM-dd-yyyy")}
                      </span>
                    </>
                  ) : (
                    "Date of birth is not available"
                  )}
                </p>
                <p className="mt-2 flex text-neutral-400 ">
                  {emp && emp.address ? (
                    <>
                      <MapPin className="" />
                      <span className="pl-2">
                        {`${emp.address}  `}
                        <span className="font-medium font-">
                          {emp && emp.address}
                        </span>
                      </span>
                    </>
                  ) : (
                    "user Address is not available"
                  )}
                </p>
              </div>
            </div>
          </div>
          {emp && emp?.role === "manager" ? (
            <div className="border-b mt-4  p-2 text-white">
              <h2 className="text-neutral-400 text-nowrap font-normal capitalize">
                Choose supervisor
              </h2>

              <SetSupervisorToManagerDialog
                IsDialogVisible={showSuperVisorDialog}
                ManagerInfo={emp}
              />

              <button
                className="w-full border border-orange-200 rounded-md bg-orange-100 shadow-sm text-gray-600  p-2  text-left text-lg"
                onClick={() => {
                  setShowSuperVisorDialog((p) => !p);
                }}
              >
                Choose now
              </button>
            </div>
          ) : null}

          {/* http://localhost:5173/dashboard/employee/67c15e9aa3d952788ae0497f */}

          <div className="flex flex-col gap-2 mt-3">
            {emp?.supervisors &&
              emp.supervisors.map((superVisor) => {
                return (
                  <div
                    key={superVisor._id}
                    className="bg-[#BE9E882D]   p-2 flex rounded-md justify-between items-center"
                  >
                    <a
                      className="cursor-pointer"
                      onClick={() => {
                        window.location.href = `/dashboard/employee/${superVisor._id}`;
                      }}
                    >
                      <h4 className="capitalize tex-md font-medium text-neutral-500">
                        {superVisor?.fullName}
                      </h4>
                    </a>

                    <Button
                      variant="outline"
                      size="icon"
                      className="bg-red-500 hover:bg-red-400 border-0"
                      onClick={() =>
                        handleRemoveSuperVisorFromManager(superVisor)
                      }
                    >
                      <Trash2 className="text-white" />
                    </Button>
                  </div>
                );
              })}
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

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure ?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
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
                    onClick={handleDeleteEMP}
                  >
                    Confirm
                  </Button>
                </span>
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
};

export default ViewManager;
