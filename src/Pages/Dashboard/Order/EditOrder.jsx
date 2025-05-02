import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@components/components/ui/badge";
import { Button } from "@components/components/ui/button";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";
import { config } from "../../../../config.js";
import moment from "moment";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/components/ui/select";

import {
  IndianRupee,
  CreditCard,
  ShoppingBag,
  UserRoundPen,
} from "lucide-react";

import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useParams } from "react-router-dom";
import OrderedProduct from "./components/OrderedProduct.jsx";

const UPDATE_ORDER_STATUS_VALIDATE_SCHEMA = yup.object({
  status: yup
    .string()
    .oneOf(
      [
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Success",
        "Cancelled",
        "Returned",
        "Refunded",
        "Failed",
        "On Hold",
        "Out for Delivery",
        "Declined",
      ],
      "Invalid status"
    )
    .required("Order Status is required"),
});

const EditOrder = () => {
  const [order, setOrderData] = useState(null);
  const { ORDER_ID } = useParams();

  const {
    register,
    formState,
    trigger,
    isValid,
    reset,
    setValue,
    handleSubmit,
    watch,
  } = useForm({
    resolver: yupResolver(UPDATE_ORDER_STATUS_VALIDATE_SCHEMA),
    mode: "all",
    defaultValues: {
      status: "",
    },
  });

  const getToken = localStorage.getItem("AppID");

  const handleUpdateFormStatus = async () => {
    const isValid = await trigger();

    if (!isValid) {
      toast.error("Please fill the form carefully..");
    }

    const { status } = watch();

    const postDataOnServer = async () => {
      try {
        const res = await fetch(
          `${config?.BACKEND_URL}/api/admin/order/${ORDER_ID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken}`,
            },
            body: JSON.stringify({ status: status }),
          }
        );

        const result = await res.json();
        if (!result) {
          toast.error("Internal error.");
        }

        if (result?.statusCode === 200) {
          toast.success(result?.msg);
        } else {
          toast.error("Internal error.");
        }
      } catch (error) {
        toast.error(error.message);
      }
    };

    // Call __Action to submit data on server..
    postDataOnServer();
  };

  useEffect(() => {
    const API = `${config.BACKEND_URL}/api/admin/order/${ORDER_ID}`;

    const fetchData = async () => {
      try {
        const res = await fetch(API, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken}`,
          },
        });

        if (!res.ok) {
          toast.error("Internal error ");
        }

        const results = await res.json();
        // set data on state
        setOrderData(results.order);
      } catch (error) {
        toast.error(error?.message);
      }
    };

    fetchData();
  }, []);

  if (!order) return;

  return (
    <>
      <Toaster richColors />

      <div>
        <div
          className="bg-neutral-100 rounded-lg border p-6 mx-auto w-1/2 dark:bg-slate-500"
          id="oderPreview"
        >
          <div className="cardHeader flex justify-between">
            <Badge variant="destructive" className="bg-orange-400">
              <UserRoundPen />
            </Badge>

            {/* Pending', 'Processing', 'Shipped', 'Delivered', 'Success', 'Cancelled', 'Returned', 'Refunded', 'Failed', 'On Hold', 'Out for Delivery', 'Declined */}

            <div className="w-64">
              <Select
                className="w-[10px] focus:border-orange-400 ring-orange-600"
                onValueChange={(selectedItem) => {
                  setValue("status", selectedItem);
                }}
              >
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={`Update order status: ${order?.orderStatus}`}
                  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Processing">Processing</SelectItem>
                  <SelectItem value="Delivered">Delivered</SelectItem>
                  <SelectItem value="Success">Success</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                  <SelectItem value="Returned">Returned</SelectItem>
                  <SelectItem value="Refunded">Refunded</SelectItem>
                  <SelectItem value="Failed">Failed</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Out for Delivery">
                    Out for Delivery
                  </SelectItem>
                  <SelectItem value="Declined">Declined</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* cardBody */}
          <div className="cardBody bg-white rounded-md border  dark:border-gray-400 p-6 mt-6 dark:bg-slate-400">
            <div className="products mb-4  product-card ">
              {order && <OrderedProduct Product={order.product} />}
            </div>
          </div>

          {/* display order-info */}
          <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
            <div className="inline-block min-w-full shadow-sm rounded-sm overflow-hidden">
              <table className="min-w-full leading-normal">
                <tbody>
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">Name:</p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        <span className="flex items-center gap-2">
                          <img
                            src={`${config.IMAGE_CDN}/Uploads/users/${order.customer.avatar}`}
                            className="size-7 rounded-full shadow-sm"
                            onClick={() => {
                              setIsphotoViewer((p) => !p);
                            }}
                          />
                          {order.customer.fullName}
                        </span>
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">Dob:</p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {moment(order.customer.dob).format("DD-MM-YYYY")}
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Gender:
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.customer.gender}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Payment mode:
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.payment.method}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Order status
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order.orderStatus}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        Address:
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap">
                        {order?.customer?.address}
                      </p>
                    </td>
                  </tr>

                  <tr>
                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap font-semibold">
                        Total Amount:
                      </p>
                    </td>

                    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                      <p className="text-gray-900 whitespace-no-wrap font-semibold">
                        <span className="flex items-center">
                          <IndianRupee className="size-4" />
                          {order.totalAmount}
                        </span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Button-to-update- status */}
          <div className="flex justify-end">
            <Button
              className="mt-4 bg-theme-color"
              onClick={handleUpdateFormStatus}
            >
              Update Now
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EditOrder;
