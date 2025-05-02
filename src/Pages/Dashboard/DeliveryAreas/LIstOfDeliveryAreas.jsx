import React, { useEffect, useReducer, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";
import { NavLink, Navigate, useNavigate } from "react-router-dom";
import { EllipsisVertical, MapPin, CirclePlus } from "lucide-react";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown-menu";
import { config } from "../../../../config.js";
import { format } from "date-fns";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/components/ui/pagination";

const initialState = {
  page: 1,
  limit: 18,
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
const LIstOfDeliveryAreas = () => {
  const [data, setData] = useState([]);
  const [state, dispatch] = useReducer(Reducer, initialState);

  const navigate = useNavigate();

  const getTOKEN = localStorage.getItem("AppID") || undefined;

  const handleDeleteAreaZone = async (AREA_ZONE_ID) => {
    if (!AREA_ZONE_ID) return;
    try {
      const res = await fetch(
        `${config && config.BACKEND_URL}/api/admin/areas-zone/${AREA_ZONE_ID}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${getTOKEN}`,
            "Content-Type": "application/json",
            Accept: "application/json, application/xml",
          },
        }
      );
      const results = await res.json();

      if (results.success === false) {
        toast.error("Oops! Internal error please try again later.");
      }

      if (results.success === true) {
        toast.success("Successfully deleted.");
        navigate(0);
      }
    } catch (error) {
      console.log(error);
      toast.error("Oops Internal error");
    }
  };

  useEffect(() => {
    const getAreaLists = async () => {
      try {
        const res = await fetch(
          `${config && config.BACKEND_URL}/api/admin/areas-zone?page=${
            state?.page
          }&limit=${state?.limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
            },
          }
        );

        const results = await res.json();

        if (results?.success == false) {
          toast.error(results.msg);
        }
        if (results.success === true) {
          setData(() => results?.responseData);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    };

    getAreaLists();
  }, [state]);

  if (data) {
    if (!data.length) {
      return (
        <span className="block lg:mt-20 text-center font-medium text-neutral-500">
          Oops! No area zones have been added yet 😊
        </span>
      );
    }
  }

  return (
    <div>
      <Toaster richColors />

      {/* <div className="pr-10 mb-2">
        <NavLink
          to={`${APP && APP.APP_URL}/dashboard/add-new-area`}
          className="flex justify-end"
        >
          <span className="relative flex gap-2 text-[#686868] capitalize justify-center items-center p-3 rounded-full cursor-pointer bg-[#ffebd6] transition-all duration-300 ease-in-out hover:bg-[#ecd4bb] max-w-52 font-normal group shadow-sm border border-[#eee0d1] hover:shadow-none">
            <span>
              <CirclePlus className="text-orange-400 group-hover:text-orange-300 duration-200 ease-in-out transition-colors" />
            </span>
            <span>Add new area zone</span>
          </span>
        </NavLink>
      </div> */}
      <h1 className="border-b pb-3 pl-2 text-2xl font  capitalize mx-4 mt-2">
        Area zones
      </h1>
      <div className="px-4 mx-auto">
        <Table className="mt-8">
          <TableHeader>
            <TableRow>
              <TableHead>Pincode</TableHead>
              <TableHead>State</TableHead>
              <TableHead>District</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Availability</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data && data.length
              ? data.map((area) => {
                  return (
                    <TableRow key={area?._id}>
                      <TableCell className="font-medium">
                        <span className="flex items-center gap-2">
                          <NavLink
                            to={area?._id}
                            className="text-slate-600 font-medium"
                          >
                            {area?.areaPinCode}
                          </NavLink>
                          <NavLink
                            target="_blank"
                            to={`https://www.google.com/maps/search/${area?.areaPinCode}`}
                          >
                            <span
                              className="text-[#4784ec]"
                              title="view on google map"
                            >
                              <MapPin className="size-4" />
                            </span>
                          </NavLink>
                        </span>
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {area?.state}
                      </TableCell>
                      <TableCell className="text-slate-600 font-medium">
                        {area?.district}
                      </TableCell>
                      <TableCell>
                        <span className="flex gap-2">
                          <span className="font-medium text-slate-600">
                            {format(new Date(area?.startDate), "dd/MM/yyyy")}
                          </span>
                          <span>-</span>
                          <span className="text-slate-600 font-medium">
                            {format(new Date(area?.endDate), "dd/MM/yyyy")}
                          </span>
                        </span>
                      </TableCell>

                      <TableCell className="text-slate-600 font-medium">
                        {area?.isAvailable ? (
                          <span className="text-green-600">Available</span>
                        ) : (
                          <span className="text-red-500">Not Available</span>
                        )}
                      </TableCell>

                      <td className="pl-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className=" ">
                              <button
                                className="w-full text-left"
                                onClick={() => {
                                  navigate(
                                    `/dashboard/delivery-area-lists/${area?._id}`
                                  );
                                }}
                              >
                                Edit
                              </button>
                            </DropdownMenuItem>

                            <DropdownMenuItem className=" text-red-400 hover:text-red-800 cursor-pointer">
                              <button
                                className="w-full text-left"
                                onClick={() => handleDeleteAreaZone(area?._id)}
                              >
                                Delete
                              </button>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </TableRow>
                  );
                })
              : null}
          </TableBody>
        </Table>
      </div>

      {data.length >= 10 ? (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                className="cursor-pointer"
                onClick={() => {
                  dispatch({ type: "DEC_PAGE" });
                }}
              ></PaginationPrevious>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink
                className="cursor-pointer"
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
                onClick={(e) => {
                  dispatch({ type: "INC_PAGE" });
                }}
              ></PaginationNext>
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      ) : null}
    </div>
  );
};

export default LIstOfDeliveryAreas;
