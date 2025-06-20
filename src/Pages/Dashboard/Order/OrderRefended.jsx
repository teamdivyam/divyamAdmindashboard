import {
  Table,
  TableBody,
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

import { config } from "../../../../config.js";
import { EllipsisVertical } from "lucide-react";
import { NavLink } from "react-router-dom";

const init = {
  page: 1,
  limit: 10,
};

const Reducer = (state, action) => {
  switch (action.type) {
    case "SET_PAGE":
      return { ...state, page: action.payload };
    case "INC_PAGE":
      return { ...state, page: state.page + 1 };
    case "DEC_PAGE":
      return { ...state, page: Math.max(state.page - 1, 1) };
    default:
      return state;
  }
};

const OrderRefunded = () => {
  const [Orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const getTOKEN = localStorage.getItem("AppID");
  const [state, dispatch] = useReducer(Reducer, init);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/order-filter?filterBy=Refunded&page=${state.page}&limit=${state.limit}`,
          {
            method: "GET",
            headers: {
              "Content-type": "application/json",
              Authorization: `Bearer ${getTOKEN}`,
            },
          }
        );
        if (!res.ok) {
          toast.error("Can't get orders data");
          return;
        }
        const data = await res.json();
        setOrders(data.responseData);
        setTotalPages(Math.ceil(data.responseData.length / state.limit));
      } catch (error) {
        console.log(error);
        toast.error("Failed to fetch data");
      }
    };

    fetchData();
  }, [state.page, state.limit]);

  return (
    <div className="w-full">
      <Toaster richColors />
      {Orders.length === 0 ? (
        <span className="block lg:mt-20 text-center font-medium text-neutral-500">
          Oops! There's no data to show right now. 😊
        </span>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Order Id</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead className="text-right">Order Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Orders.map((order) => {
                const formattedDate = new Date(
                  order.createdAt
                ).toLocaleDateString("en-GB");
                return (
                  <TableRow key={order._id}>
                    <TableCell className="font-medium">
                      <NavLink
                        to={`${config.APP_URL}/dashboard/order/${order._id}`}
                      >
                        {order.orderId}
                      </NavLink>
                    </TableCell>
                    <TableCell>
                      <span className="text-orange-500 font-semibold">
                        {order.orderStatus}
                      </span>
                    </TableCell>
                    <TableCell>{order?.transaction?.paymentMethod}</TableCell>
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
                            <NavLink
                              to={`${config.APP_URL}/dashboard/order/${order._id}`}
                            >
                              View More
                            </NavLink>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={
                      state.page === 1
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
                    onClick={() =>
                      state.page > 1 && dispatch({ type: "DEC_PAGE" })
                    }
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      className="cursor-pointer"
                      isActive={state.page === i + 1}
                      onClick={() =>
                        dispatch({ type: "SET_PAGE", payload: i + 1 })
                      }
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    className={
                      state.page === totalPages
                        ? "cursor-not-allowed opacity-50"
                        : "cursor-pointer"
                    }
                    onClick={() =>
                      state.page < totalPages && dispatch({ type: "INC_PAGE" })
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
};

export default OrderRefunded;
