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
import { toast } from "sonner";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/components/ui/pagination";

import APP from "../../../../dataCred.js";
import { EllipsisVertical } from "lucide-react";
import { NavLink } from "react-router-dom";

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
  const [pendingOrders, setPendingOrder] = useState(null);
  const getTOKEN = localStorage.getItem("AppID");
  const [state, dispatch] = useReducer(Reducer, init);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // http://localhost:3001/api/admin/order-filter?filterBy=Pending&page=1&limit=4
        // // http://localhost:3001/api/admin/order/filter/Pending?filterBy=Pending&page=1&limit=1
        const res = await fetch(
          `${
            APP.BACKEND_URL
          }/api/admin/order-filter?filterBy=${`Pending`}&page=${
            state.page
          }&limit=${state.limit}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${getTOKEN}`,
              Accept: "application/json, application/xml",
              "Accept-Language": "en_US",
            },
          }
        );
        if (!res.ok) {
          toast.error("can't get orders data");
        }

        const data = await res.json();

        setPendingOrder(data);
        if (data.length == 0) {
          toast.error("no data available.");
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [state.page, state.limit]);

  return (
    <div className="w-full">
      <Toaster richColors />
      <Table>
        <TableCaption>.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Name</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Payment Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
            <TableHead className="text-right">Invoice No. </TableHead>
            <TableHead className="text-right">Transaction Date</TableHead>
            {/* <TableHead className="text-right">Actions</TableHead> */}
          </TableRow>
        </TableHeader>
        <TableBody>
          {pendingOrders &&
            pendingOrders.responseData.map((order) => {
              const date = new Date(order.order_date);
              const day = String(date.getDate()).padStart(2, "0");
              const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
              const year = date.getFullYear();

              // Format the date as dd/mm/yyyy
              const formattedDate = `${day}/${month}/${year}`;

              return (
                <TableRow key={order.order_id}>
                  <TableCell className="font-medium">
                    <NavLink
                      to={`${APP && APP.APP_URL}/dashboard/order/${
                        order && order._id
                      }`}
                    >
                      {order.order_id}
                    </NavLink>
                  </TableCell>
                  <TableCell>
                    <span className="text-orange-500 font-semibold">
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell>{order.payment_method}</TableCell>
                  <TableCell className="text-right">
                    {order.total_amount}
                  </TableCell>
                  <TableCell className="text-right">{Math.random()}</TableCell>
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
    </div>
  );
};

export default OrderPending;
