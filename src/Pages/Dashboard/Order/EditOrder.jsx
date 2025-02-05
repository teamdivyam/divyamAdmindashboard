import React, { useEffect, useMemo, useState } from "react";
import { Badge } from "@components/components/ui/badge";
import { Button } from "@components/components/ui/Button";
import { Toaster } from "@components/components/ui/sonner";
import { toast } from "sonner";
import APP from "../../../../dataCred.js";
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
  const [orderData, setOrderData] = useState(null);

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
          `${APP?.BACKEND_URL}/api/admin/order/${ORDER_ID}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken}`,
              Accept: "application/json, application/xml",
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

  const formattedDate = useMemo(() => {
    if (!orderData) return;

    const date = new Date(orderData.createdAt);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    const formattedDate = `${day}/${month}/${year}`;
    return formattedDate;
  }, [orderData]);

  //get order status

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${APP && APP.BACKEND_URL}/api/admin/order/${ORDER_ID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${getToken}`,
              Accept: "application/json, application/xml",
            },
          }
        );

        if (!res.ok) {
          toast.error("Internal error ");
        }

        const results = await res.json();
        // set data on state
        setOrderData(results);
      } catch (error) {
        toast.error(error?.message);
      }
    };

    fetchData();
  }, []);

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
                  console.log("status", selectedItem);
                }}
              >
                <SelectTrigger className="">
                  <SelectValue
                    placeholder={`Update order status: ${orderData?.status}`}
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
            {[1, 2, 3, 4].map((item, id) => {
              return (
                <div key={id}>
                  <div className="products mb-4  ">
                    <div className="product hover:bg-neutral-100 text-neutral-600 flex bg-neutral-50 p-2 rounded-md dark:bg-gray-500 dark:text-white">
                      <img
                        src="https://ptal.in/cdn/shop/files/31_974373bd-58b3-419b-ac7f-5428d38b7075.png"
                        className="size-16 rounded-lg"
                      />
                      <div className="textContent flex">
                        <h3 className="items-start pl-10 font-medium text-md">
                          Brass Tawa - Roti Tava in Brass
                        </h3>
                        <div className="items-end">Price: 565</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="orderPreviewFooter dark:text-white mt-8 pt-4 border-t dark:border-t dark:border-gray-300 flex justify-between">
              <div id="date " className="text-neutral-500 dark:text-white">
                {orderData && formattedDate}
              </div>
              {true && (
                <div className="total flex text-neutral-600 dark:text-white">
                  <IndianRupee />
                  <span className="font-semibold">
                    {orderData ? orderData?.total_amount : null}
                  </span>
                </div>
              )}
            </div>

            <div id="paymentAND_ProductDetails" className="mt-4">
              <ul className="flex flex-col gap-3 text-neutral-500">
                <li>
                  {true && (
                    <span className="flex gap-2">
                      <CreditCard />
                      {orderData ? orderData?.payment_method : null}
                    </span>
                  )}
                </li>

                <li>
                  {true && (
                    <span className="flex gap-2">
                      <ShoppingBag />
                      {true ? "Package" : "Product"}
                    </span>
                  )}
                </li>
              </ul>
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
