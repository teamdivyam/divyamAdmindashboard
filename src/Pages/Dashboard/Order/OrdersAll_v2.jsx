import React, { useEffect, useReducer, useState } from "react";
import { toast, Toaster } from "sonner";
import { config } from "../../../../config";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@components/components/ui/dropdown-menu";
import { EllipsisVertical, MoveHorizontal } from "lucide-react";

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@components/components/ui/pagination";
import { NavLink } from "react-router-dom";
import moment from "moment";

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
const OrdersAll = () => {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [Orders, setOrder] = useState(null);
  const [state, dispatch] = useReducer(Reducer, initialState);

  const getTOKEN = localStorage.getItem("AppID");
  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(
          `${config.BACKEND_URL}/api/admin/orders?page=${state.page}&limit=${state.limit}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${getTOKEN}`,
              "Content-Type": "application/json",
            },
          }
        );
        const result = await res.json();
        if (!res.ok) {
          toast.error("Can't able to fetch Orders");
        }
        console.log(result);
        // on success
        setOrder(result?.orders);
      } catch (error) {
        toast.error(error);
      }
    })();
  }, [state?.page]);

  const changeOrderStatusColor = (status) => {
    if (status === "Pending") {
      // for fresh Orders after payment complete
      return (
        <>
          <span className="text-yellow-700">{status}</span>
        </>
      );
    }

    if (
      status == "Success" ||
      status == "Delivered" ||
      status == "Shipped" ||
      status == "Out for Delivery"
    ) {
      return (
        <>
          <span className="text-green-500 ">{status}</span>
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

    if (status === "Processing") {
      return (
        <>
          <span className="text-blue-500">{status}</span>
        </>
      );
    }

    if (status == "CANCELLATION_REQUESTED" || status === "REFUND_REQUESTED") {
      return (
        <>
          <span className="text-yellow-700">{status}</span>
        </>
      );
    }

    // for others order status will return this one
    return (
      <>
        <span className="text-black font-bold">{status}</span>
      </>
    );
  };

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
        <div className="w-full p-4">
          <Toaster richColors />
          <Table>
            <TableCaption>.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[300px]">Order Id</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Booking Dates</TableHead>
                <TableHead>Payment Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Orders && Orders.length > 0 ? (
                Orders.map((order, idx) => {
                  const startBookingDate = moment(
                    order.booking?.startDate
                  ).format("DD-MM-YYYY");
                  const endBookingDate = moment(order.booking?.endDate).format(
                    "DD-MM-YYYY"
                  );
                  return (
                    <TableRow key={idx}>
                      <TableCell className="font-medium">
                        <NavLink to={`/dashboard/order/${order._id}`}>
                          {order.orderId.split("_").at(1)}
                        </NavLink>
                      </TableCell>

                      <TableCell>
                        {changeOrderStatusColor(order.orderStatus)}
                      </TableCell>

                      <TableCell className="">
                        <div className="flex gap-4 font-semibold text-neutral-500">
                          {startBookingDate}{" "}
                          <MoveHorizontal className="text-neutral-400" />{" "}
                          {endBookingDate}
                        </div>
                      </TableCell>

                      <TableCell>
                        {order?.transaction?.paymentMethod || (
                          <span className="text-neutral-500">
                            Not available
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {order?.totalAmount}
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
};

export default OrdersAll;
