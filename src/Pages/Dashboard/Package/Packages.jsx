import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";
import { EllipsisVertical } from "lucide-react";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/components/ui/pagination";

import React, { useEffect, useReducer, useRef, useState } from "react";
import Loader from "../../../components/components/Loader.jsx";
import { NavLink, useNavigate } from "react-router-dom";
import { Button } from "@components/components/ui/button";

import { config } from "../../../../config.js";
import { toast } from "sonner";

const initialState = {
  page: 1,
  limit: 16,
};

const Reducer = (state, action) => {
  switch (action.type) {
    case "FIRST_PAGE": {
      return { ...state, page: (state.page = 1) };
    }

    case "SET_PAGE_NUM": {
      return { ...state, page: action.payload };
    }

    case "INC_PAGE": {
      return { ...state, page: state.page + 1 };
    }

    case "DEC_PAGE": {
      return { ...state, page: state.page - 1 };
    }
    case "SET_PAGE_LIMIT": {
      return { ...state, limit: action.payload };
    }

    default: {
      return state;
    }
  }
};

const Packages = () => {
  const [open, setOpen] = useState(false);
  const [data, setData] = useState(null);
  const [err, setErr] = useState(true);
  const [count, setCount] = useState(5);
  const [packageID, setPackageID] = useState(null);

  const [paginationState, dispatch] = useReducer(Reducer, initialState);

  const navigate = useNavigate();
  // will shift from normal state to reducer for ease
  const getTOKEN = localStorage.getItem("AppID");

  const handlePackageDelete = async () => {
    try {
      if (!packageID) {
        toast("Invalid Package Id");
      }

      const res = await fetch(
        `${config && config.BACKEND_URL}/api/admin/package/${packageID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getTOKEN}`,
          },
        }
      );

      if (!res.ok) {
        throw new Error("Can't able to delete packages");
      }

      if (res.ok) {
        setOpen((prev) => !prev);
        toast("Successfully deleted.");
        navigate(0);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${config && config.BACKEND_URL}/api/admin/package/?page=${
            paginationState.page
          }&limit=${paginationState.limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
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

  const handleTwoFunc = (pkgID) => {
    setPackageID(pkgID);
    setOpen((prev) => !prev);
  };

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
                  <TableHead>Published Package</TableHead>
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
                        <NavLink to={`/dashboard/package/${item?.slug}`}>
                          {item.pkg_id}
                        </NavLink>
                      </TableCell>
                      <TableCell>{item?.name}</TableCell>
                      <TableCell>
                        {item.isVisible === true
                          ? "Published"
                          : "Not Publish yet"}
                      </TableCell>
                      <TableCell>{item?.capacity} People</TableCell>
                      <TableCell>{item?.price}</TableCell>

                      <td className="text-left">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <NavLink to={`/dashboard/package/${item?.slug}`}>
                                View More
                              </NavLink>
                            </DropdownMenuItem>
                            <DropdownMenuItem className=" text-red-400 hover:text-red-800 cursor-pointer">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  handleTwoFunc(item._id);
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

      {/* ORDER_PAGINATION */}

      {data && data.length > 8 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => {
                  {
                    state?.page == 1 ? null : dispatch({ type: "FIRST_PAGE" });
                  }
                }}
              ></PaginationPrevious>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
                isActive
                onClick={() => {
                  dispatch({ type: "SET_PAGE_NUM", payload: 1 });
                }}
              >
                1
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
                isActive
                onClick={() => {
                  dispatch({ type: "SET_PAGE_NUM", payload: 2 });
                }}
              >
                2
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
                isActive
                onClick={() => {
                  dispatch({ type: "SET_PAGE_NUM", payload: 3 });
                }}
              >
                3
              </PaginationLink>
            </PaginationItem>

            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>

            <PaginationItem>
              <PaginationNext
                className="cursor-pointer"
                onClick={() => {
                  dispatch({ type: "INC_PAGE" });
                }}
              ></PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}

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
