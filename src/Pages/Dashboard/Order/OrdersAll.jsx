import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";
import { Search } from "lucide-react";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/components/ui/pagination";

import React, { useEffect, useReducer, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown-menu";

import { config } from "../../../../config.js";
import { Toaster } from "@components/components/ui/sonner";

import { toast } from "sonner";

import { EllipsisVertical } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";

const SEARCH_ORDER_VALIDATE_SCHEMA = yup.object({
  searchKey: yup
    .string()
    .min(5, "Invalid order id")
    .max(20)
    .required("Invalid order id."),
});

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

export default function LinksTable() {
  const [Orders, setOrder] = useState(null);
  const getTOKEN = localStorage.getItem("AppID");
  const navigate = useNavigate();

  const [state, dispatch] = useReducer(Reducer, initialState);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    mode: "all",
    resolver: yupResolver(SEARCH_ORDER_VALIDATE_SCHEMA),
    defaultValues: {
      searchKey: "",
    },
  });

  const onSubmit = (data) => {
    // console.log(data);
    const searchOrder = async () => {
      try {
        const res = await fetch(
          `${config && config.BACKEND_URL}/api/admin/search-orders?searchKey=${
            data?.searchKey
          }`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getTOKEN}`,
              Accept: "application/json, application/xml",
            },
          }
        );

        const results = await res.json();

        if (results.success === true) {
          navigate(`/dashboard/order/${results._id}`);
        } else {
          toast.error("Invalid order id");
        }
      } catch (error) {
        toast.error("please try again later.");
      }
    };

    searchOrder();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/order?page=${state?.page}&limit=${state?.limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );

        const data = await res.json();
        setOrder(data);

        console.log(data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [state.page]);

  const changeOrderStatusColor = (status) => {
    if (status == "Pending") {
      return (
        <>
          <span className="text-green-400 animate-pulse ">{status}</span>
        </>
      );
    }

    if (status == "Success" || status == "Delivered" || status == "Shipped") {
      return (
        <>
          <span className="text-green-500">{status}</span>
        </>
      );
    }

    if (status == "Failed" || status == "Declined") {
      return (
        <>
          <span className="text-red-500">{status}</span>
        </>
      );
    }

    // for others order status will return this one

    return (
      <>
        <span className="text-slate-500 font-bold">{status}</span>
      </>
    );
  };

  useEffect(() => {
    if (errors?.searchKey?.message) {
      toast.error(errors?.searchKey?.message);
    }
  }, [errors.searchKey]);

  if (Orders) {
    if (!Orders.length) {
      return (
        <span className="block lg:mt-20 text-center font-medium text-neutral-500">
          Oops! There's no data to show right now. It looks like no orders are
          available 😊
        </span>
      );
    }
  }

  return (
    <>
      {Orders && (
        <div className="w-full ">
          <Toaster richColors />
          <form
            className="flex justify-center  w-full px-3 py-4"
            onSubmit={handleSubmit(onSubmit)}
          >
            <input
              type="text"
              name="search"
              id="search"
              placeholder="Search with order id"
              className="border px-4 shadow-sm  w-full rounded-lg text-lg rounded-r-none dark:bg-slate-600"
              {...register("searchKey")}
            />
            <button
              type="submit"
              className="bg-orange-400 rounded-md p-2 text-white rounded-l-none"
            >
              <Search className="size-8" />
            </button>
          </form>
          <Table>
            <TableCaption>.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Order Id</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Transaction Date</TableHead>
                {/* <TableHead className="text-right">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Orders && Orders.length > 0 ? (
                Orders.map((order, idx) => {
                  const date = new Date(order.createdAt);
                  const day = String(date.getDate()).padStart(2, "0");
                  const month = String(date.getMonth() + 1).padStart(2, "0");
                  // Months are 0-indexed
                  const year = date.getFullYear();

                  // Format the date as dd/mm/yyyy
                  const formattedDate = `${day}/${month}/${year}`;

                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        <NavLink to={`${order._id}`}>
                          {order.orderId.split("_").at(1)}
                        </NavLink>
                      </TableCell>
                      <TableCell>
                        {changeOrderStatusColor(order.orderStatus)}
                      </TableCell>
                      <TableCell>
                        {order?.transaction?.paymentMethod || (
                          <span className="text-red-3400">Payment failed</span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {order.totalAmount}
                      </TableCell>
                      <TableCell className="text-right">
                        {formattedDate}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger>
                            <EllipsisVertical />
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuLabel>Action</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="cursor-pointer">
                              <NavLink to={`${order._id}`}>View More</NavLink>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <h1>0 Orders available..</h1>
              )}
            </TableBody>
          </Table>

          {/* ORDER_PAGINATION */}

          {Orders && Orders.length > 10 ? (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="cursor-pointer"
                    onClick={() => {
                      {
                        state?.page == 1
                          ? null
                          : dispatch({ type: "FIRST_PAGE" });
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
        </div>
      )}
    </>
  );
}
