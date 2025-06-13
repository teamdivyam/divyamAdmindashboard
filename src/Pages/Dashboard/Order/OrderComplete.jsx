import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";
import React, { useEffect, useReducer, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown-menu";
import { Toaster } from "@components/components/ui/sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/components/ui/pagination";

import { config } from "../../../../config.js";
import { EllipsisVertical } from "lucide-react";
import { NavLink } from "react-router-dom";
import { toast } from "sonner";

// reducers for pagination

const init = {
  page: 1,
  limit: 17,
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

const OrderPending = () => {
  const [completedOrders, setCompletedOrders] = useState(null);
  const getTOKEN = localStorage.getItem("AppID");
  const [state, dispatch] = useReducer(Reducer, init);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${
            config.BACKEND_URL
          }/api/admin/order-filter?filterBy=${`Success`}&page=${
            state.page
          }&limit=${state.limit}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${getTOKEN}`,
            },
          }
        );
        if (!res.ok) {
          toast.error("can't get orders data");
        }

        const data = await res.json();

        setCompletedOrders(data.responseData);
        // if (data.length == 0) {
        //   toast.error("no data available.");
        // }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [state.page, state.limit]);

  if (completedOrders) {
    if (!completedOrders.length) {
      return (
        <span className="block lg:mt-20 text-center font-medium text-neutral-500">
          Oops! There's no data to show right now. It looks like no orders are
          available 😊
        </span>
      );
    }
  }

  return (
    <div className="w-full">
      <Toaster richColors />
      <Table>
        <TableCaption>.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Order Id</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Order Date</TableHead>
            {/* <TableHead className="text-right">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {completedOrders &&
            completedOrders.map((order, idx) => {
              const date = new Date(order.createdAt);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0");
              // Months are 0-indexed
              const year = date.getFullYear();
              // Format the date as dd/mm/yyyy
              const formattedDate = `${day}/${month}/${year}`;

              return (
                <TableRow key={order._id}>
                  <TableCell className="font-medium">
                    <NavLink
                      to={`${config && config.APP_URL}/dashboard/order/${
                        order && order._id
                      }`}
                    >
                      {order.orderId}
                    </NavLink>
                  </TableCell>
                  <TableCell>
                    <span className="text-orange-500 font-semibold">
                      {(order && order?.orderStatus) || null}
                    </span>
                  </TableCell>
                  <TableCell>
                    {(order && order?.transaction?.amount) || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    {(order && order?.totalAmount) || null}
                  </TableCell>
                  <TableCell className="text-right">{formattedDate}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <EllipsisVertical />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuLabel>Action</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="cursor-pointer">
                          View More
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400 hover:text-red-800 cursor-pointer">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              );
            })}
        </TableBody>
      </Table>

      {completedOrders && completedOrders?.length > 10 ? (
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
    </div>
  );
};

export default OrderPending;
