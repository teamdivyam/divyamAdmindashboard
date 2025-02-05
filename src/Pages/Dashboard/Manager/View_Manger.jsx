import React, { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import APP from "../../../../dataCred";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";
import { UserRound, MapPin, Phone, Calendar } from "lucide-react";
import { Badge } from "@components/components/ui/badge";
import { Button } from "@components/components/ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/components/ui/dialog";

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
  const [emp, setEmp] = useState(null);
  const { EMP_ID } = useParams();
  const navigate = useNavigate();
  const getTOKEN = localStorage.getItem("AppID");
  const [open, setOpen] = useState(false);

  const handleDeleteUser = () => {
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

  useEffect(() => {
    const fetchDATA = async () => {
      try {
        const res = await fetch(
          `${APP.BACKEND_URL}/api/admin/employee/${EMP_ID}`,
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
        if (!res.ok) {
          return;
        }

        const result = await res.json();

        if (result.success) {
          setEmp(result);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchDATA();
  }, []);

  return (
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
              Employee
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
              {`${emp && emp.createdAt}`}
            </span>
          </Badge>
        </div>

        <div className="cardBody bg-white dark:bg-slate-800 rounded-md border p-6 mt-6">
          <div className="userProfile flex flex-row ">
            <img
              src={
                emp?.profile
                  ? `${APP.IMG_PATH}/Uploads/employee/${emp.profile}`
                  : "https://placehold.co/400x400?text=Loading.."
              }
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
                    <span className="pl-2 font-normal">{emp.dob}</span>
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
        {/* <DialogTrigger>Open</DialogTrigger> */}
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
                  onClick={handleDeleteUser}
                >
                  Confirm
                </Button>
              </span>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ViewManager;
