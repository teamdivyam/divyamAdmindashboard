import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";
import { DatabaseZapIcon, EllipsisVertical } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@components/components/ui/dialog";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown-menu";

import React, { useEffect, useRef, useState } from "react";
import Loader from "../../../components/components/Loader.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@components/components/ui/button";

import APP from "../../../../dataCred.js";
import { toast } from "sonner";

const Packages = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(true);
  const [count, setCount] = useState(5);
  const [packageID, setPackageID] = useState(null);

  const navigate = useNavigate();
  // will shift from normal state to reducer for ease
  const getTOKEN = localStorage.getItem("AppID");

  const handlePackageDelete = async () => {
    try {
      if (!packageID) {
        toast("Invalid Package Id");
      }

      const res = await fetch(
        `${APP && APP.BACKEND_URL}/api/admin/package/${packageID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getTOKEN}`,
          },
        }
      );

      const data = await res.json();

      if (res.ok) {
        setOpen((prev) => !prev);
        toast("Successfully deleted.");
        navigate(0);
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/package/`,
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
        if (!response.ok) {
          setErr(true);
        }

        const data = await response.json();
        setErr(false);
        setData(data);
      } catch (error) {
        setErr(true);
      }
    };

    fetchData();
  }, []);

  // useEffect(() => {
  //   const InterVal = setInterval(() => {
  //     if (count > 0) {
  //       setCount((prev) => prev - 1);
  //     } else {
  //       clearInterval(InterVal);
  //     }
  //   }, 1000);

  //   return () => {
  //     clearInterval(InterVal);
  //   };
  // }, [open, setOpen]);

  const handleTwoFunc = (pkgID) => {
    setPackageID(pkgID);
    setOpen((prev) => !prev);
  };

  // const showErrMsg = () => {
  //   const isNodata = data && data.length <= 0;
  //   return (
  //     <>
  //       isNodata && <p>No data Available</p>
  //     </>
  //   );
  // };

  return (
    <>
      {err ? (
        <Loader />
      ) : (
        <div className="lg:px-10 lg:mx-auto">
          {data && data.length ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">id</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Capacity</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data &&
                  data.map((item) => (
                    <TableRow key={item.pkg_id}>
                      <TableCell className="font-medium">
                        <NavLink to={`/dashboard/package/${item?.id}`}>
                          {item.pkg_id}
                        </NavLink>
                      </TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.status}</TableCell>
                      <TableCell>{item.capacity} People</TableCell>
                      <TableCell>{item.price}</TableCell>

                      <td className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <NavLink to={`/dashboard/package/${item?._id}`}>
                                View More
                              </NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem className=" text-red-400 hover:text-red-800 cursor-pointer">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  handleTwoFunc(item.id);
                                }}
                              >
                                Delete
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          ) : (
            <span className="block lg:mt-20 text-center font-medium text-neutral-500">
              Oops! There's no data to show right now. It looks like no packages
              are available. Try adding a new package to get started! 😊
            </span>
          )}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
              <span className="mt-5 flex justify-end gap-3">
                <Button
                  variant="secondary"
                  className="w-28 "
                  onClick={() => setOpen((prev) => !prev)}
                >
                  Cancel
                </Button>

                <Button
                  variant="destructive"
                  className="w-28"
                  onClick={handlePackageDelete}
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

export default Packages;
